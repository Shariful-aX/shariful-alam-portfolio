import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

// Exercise the actual scrolling controller without loading React or a browser.
const source = await readFile(new URL("../src/app.js", import.meta.url), "utf8");
const controller = source.slice(source.indexOf("function scrollTargetFor("), source.indexOf("function ParticleField("));

function setup(reduced = false, paused = false) {
  function events() {
    const listeners = new Map();
    return {
      listeners,
      addEventListener(name, fn) { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(fn); },
      removeEventListener(name, fn) { listeners.get(name)?.delete(fn); },
      emit(name, event = {}) { for (const fn of listeners.get(name) || []) fn(event); }
    };
  }
  const frames = new Map();
  let nextFrame = 0;
  let now = 0;
  let cleanup;
  const motion = Object.assign(events(), { matches: reduced });
  const root = { scrollHeight: 5000, style: { scrollPaddingTop: "64px" } };
  const window = Object.assign(events(), {
    scrollY: 0, innerHeight: 800, location: { hash: "" },
    matchMedia: () => motion,
    scrollTo(x, y) { this.scrollY = Math.max(0, Math.min(root.scrollHeight - this.innerHeight, y)); this.emit("scroll"); },
    history: { entries: [], pushState(a, b, hash) { this.entries.push(hash); window.location.hash = hash; } }
  });
  class Element {
    constructor(top = 0, href = null) { this.top = top; this.href = href; this.style = {}; this.scrollHeight = 0; this.clientHeight = 0; }
    getBoundingClientRect() { return { top: this.top - window.scrollY }; }
    focus() { this.focused = true; }
    closest() { return this.href ? this : null; }
    getAttribute(name) { return name === "href" ? this.href : null; }
    hasAttribute(name) { return Boolean(this[name]); }
  }
  const sections = { top: new Element(0), about: new Element(800), projects: new Element(1900), contact: new Element(4700) };
  const document = Object.assign(events(), { documentElement: root, body: new Element(), getElementById: id => sections[id], querySelector: () => document.dialogOpen ? {} : null });
  runInNewContext(`${controller}\nSmoothScroll();`, {
    window, document, Element, getComputedStyle: node => node.style,
    performance: { now: () => now },
    requestAnimationFrame(fn) { frames.set(++nextFrame, fn); return nextFrame; },
    cancelAnimationFrame(id) { frames.delete(id); },
    useEffect(fn) { cleanup = fn(); }, useContext() { return paused; }, MotionContext: {}
  });
  function emit(target, name, extras = {}) {
    const event = { target: document.body, button: 0, deltaX: 0, deltaY: 200, deltaMode: 0, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, ...extras };
    target.emit(name, event);
    return event;
  }
  return {
    window, document, root, sections, motion, Element, frames, cleanup,
    wheel: extras => emit(window, "wheel", extras),
    click: (href, extras) => emit(document, "click", { target: new Element(0, href), ...extras }),
    settle() {
      let count = 0;
      while (frames.size && count++ < 600) {
        const pending = [...frames.values()]; frames.clear(); now += 1000 / 60;
        for (const fn of pending) fn(now);
      }
      assert.equal(frames.size, 0, "scrolling must settle instead of running indefinitely");
    }
  };
}

test("section links leave room for the fixed navigation and move keyboard focus", () => {
  const page = setup();
  assert.ok(page.click("#about").defaultPrevented);
  page.settle();
  assert.equal(page.window.scrollY, 736);
  assert.ok(page.sections.about.focused);
  page.click("#about"); page.settle();
  assert.equal(page.window.history.entries.length, 1, "repeated clicks must not clutter Back history");
  page.click("#contact"); page.settle();
  assert.equal(page.window.scrollY, 4200, "the last section must stop at the bottom of the page");
  page.click("#top"); page.settle();
  assert.equal(page.window.scrollY, 0);
});

test("modified clicks, downloads, unknown and malformed fragments retain native behavior", () => {
  const page = setup();
  for (const extras of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }]) {
    assert.equal(page.click("#about", extras).defaultPrevented, false);
  }
  for (const href of ["#", "#missing", "#%ZZ"]) assert.equal(page.click(href).defaultPrevented, false);
  const link = new page.Element(0, "#about"); link.target = "_blank";
  assert.equal(page.click("#about", { target: link }).defaultPrevented, false);
  link.target = ""; link.download = true;
  assert.equal(page.click("#about", { target: link }).defaultPrevented, false);
  assert.equal(page.frames.size, 0);
});

test("keyboard, touch, pointer, and history input cancel an in-flight animation", () => {
  for (const [event, details] of [["keydown", { key: "PageDown" }], ["keydown", { key: "Tab" }], ["touchstart", {}], ["pointerdown", {}], ["popstate", {}], ["hashchange", {}]]) {
    const page = setup(); page.click("#projects");
    assert.ok(page.frames.size);
    page.window.emit(event, details);
    assert.equal(page.frames.size, 0, event);
    assert.equal(page.sections.projects.focused, undefined, "an interrupted jump must not steal focus");
  }
});

test("horizontal gestures, zooming, and nested scrolling remain native", () => {
  const page = setup();
  const nested = new page.Element(); nested.scrollHeight = 500; nested.clientHeight = 100; nested.style.overflowY = "auto";
  for (const extras of [{ deltaX: 300, deltaY: 10 }, { shiftKey: true }, { ctrlKey: true }, { target: nested }]) {
    page.click("#about");
    assert.equal(page.wheel(extras).defaultPrevented, false);
    assert.equal(page.frames.size, 0);
  }
});

test("wheel input takes over from the visible position during an anchor jump", () => {
  const page = setup();
  page.click("#projects");
  page.wheel({ deltaY: 200 }); page.settle();
  assert.equal(page.window.scrollY, 200);
  assert.equal(page.sections.projects.focused, undefined);
});

test("an open project dialog stops page easing and leaves wheel input native", () => {
  const page = setup();
  page.click("#projects");
  page.document.dialogOpen = true;
  page.window.emit("portfolio:dialog-open");
  assert.equal(page.frames.size, 0);
  assert.equal(page.wheel().defaultPrevented, false);
  assert.equal(page.window.scrollY, 0);
  page.document.dialogOpen = false;
  page.wheel(); page.settle();
  assert.equal(page.window.scrollY, 200);
});

test("reduced motion uses immediate links and native wheel scrolling, including preference changes", () => {
  const page = setup(true);
  page.click("#about");
  assert.equal(page.window.scrollY, 736);
  assert.ok(page.sections.about.focused);
  assert.equal(page.frames.size, 0);
  assert.equal(page.wheel().defaultPrevented, false);
  page.motion.matches = false;
  page.click("#projects"); assert.ok(page.frames.size);
  page.motion.matches = true; page.motion.emit("change");
  assert.equal(page.frames.size, 0);
});

test("wheel easing survives changes in document height and cleans up on unmount", () => {
  const page = setup();
  assert.ok(page.wheel({ deltaY: 900 }).defaultPrevented);
  page.root.scrollHeight = 1000;
  page.settle();
  assert.equal(page.window.scrollY, 200);
  page.wheel({ deltaY: -1, deltaMode: 1 }); page.settle();
  assert.equal(page.window.scrollY, 184);
  page.click("#projects");
  page.cleanup();
  assert.equal(page.frames.size, 0);
  for (const target of [page.window, page.document, page.motion]) for (const listeners of target.listeners.values()) assert.equal(listeners.size, 0);
});

test("the site motion toggle uses immediate navigation and native scrolling", () => {
  const page = setup(false, true);
  page.click("#about");
  assert.equal(page.window.scrollY, 736);
  assert.ok(page.sections.about.focused);
  assert.equal(page.frames.size, 0);
  assert.equal(page.wheel().defaultPrevented, false);
});
