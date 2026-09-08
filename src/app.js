import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";

const MotionContext = createContext(false);

const navSections = [
  { id: "top", label: "SA." },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" }
];

const boneScrewGallery = [
  {"src":"images/bone-screw-mesh-composite-v2.png","thumbnail":"images/bone-screw-gallery/mesh-overview-thumb.webp","title":"Bone–screw finite element meshes","alt":"Side-by-side high-resolution bone-screw finite element meshes"},
  {"src":"images/bone-screw-gallery/aug27-le33-01.gif","title":"Axial strain (LE33) · Screw Pullout (Without Cortical Bone)","alt":"Axial strain (LE33) · Screw Pullout (Without Cortical Bone)"},
  {"src":"images/bone-screw-gallery/aug27-le33-02.gif","title":"Axial strain (LE33) · Screw Pullout (Without Cortical Bone)","alt":"Axial strain (LE33) · Screw Pullout (Without Cortical Bone)"},
  {"src":"images/bone-screw-gallery/aug27-principal-strain.gif","title":"Maximum principal strain · Screw Pullout (With Cortical Bone)","alt":"Maximum principal strain · Screw Pullout (With Cortical Bone)"},
  {"src":"images/bone-screw-gallery/aug27-le33-03.gif","title":"Axial strain (LE33) · Screw Pullout (With Cortical Bone)","alt":"Axial strain (LE33) · Screw Pullout (With Cortical Bone)"},
  {"src":"images/bone-screw-gallery/aug13-le33-02.gif","title":"Axial strain (LE33) · Bone Under Compression","alt":"Axial strain (LE33) · Bone Under Compression"},
  {"src":"images/bone-screw-gallery/aug13-le33-01.gif","title":"Axial strain (LE33) · Bone Under Tension","alt":"Axial strain (LE33) · Bone Under Tension"},
  {"src":"images/bone-screw-gallery/matlab-geometry.png","title":"Trabecular bone geometry (MATLAB)","alt":"Trabecular bone geometry (MATLAB)"},
  {"src":"images/bone-screw-gallery/trabecular-geometry.png","title":"Trabecular bone geometry (Blender)","alt":"Trabecular bone geometry (Blender)"},
  {"src":"images/bone-screw-gallery/screw-side.png","title":"Screw geometry · side view","alt":"Screw geometry · side view"},
  {"src":"images/bone-screw-gallery/screw-head.png","title":"Screw geometry · head view","alt":"Screw geometry · head view"}
].map((item) => ({
  ...item,
  animated: item.src.endsWith(".gif"),
  thumbnail: item.thumbnail || item.src.replace(/\.(png|gif)$/, "-thumb.webp"),
  poster: item.src.endsWith(".gif") ? item.src.replace(/\.gif$/, "-poster.webp") : item.src
}));

const vehicleGallery = [
  {
    "src": "images/autonomous-robot.jpg",
    "thumbnail": "images/vehicle-gallery/vehicle-thumb.webp",
    "title": "Autonomous Multi-Mode Vehicle",
    "alt": "Assembled autonomous vehicle with ultrasonic turret and differential-drive wheels",
    "crop": true
  },
  {
    "src": "images/vehicle-gallery/isometric-assembly.png",
    "thumbnail": "images/vehicle-gallery/isometric-assembly-thumb.webp",
    "title": "Isometric CAD view of Full Assembly",
    "alt": "Isometric CAD view of Full Assembly"
  },
  {
    "src": "images/vehicle-gallery/wheel-configuration.png",
    "thumbnail": "images/vehicle-gallery/wheel-configuration-thumb.webp",
    "title": "Bottom View of Vehicle Displaying Wheel Configuration",
    "alt": "Bottom View of Vehicle Displaying Wheel Configuration"
  },
  {
    "src": "images/vehicle-gallery/dimensioned-assembly.png",
    "thumbnail": "images/vehicle-gallery/dimensioned-assembly-thumb.webp",
    "title": "Dimensioned Drawing of Full Assembly",
    "alt": "Dimensioned Drawing of Full Assembly"
  },
  {
    "src": "images/vehicle-gallery/wiring-schematic.jpg",
    "thumbnail": "images/vehicle-gallery/wiring-schematic-thumb.webp",
    "title": "Wiring Schematic",
    "alt": "Wiring Schematic"
  },
  {
    "src": "images/vehicle-gallery/control-algorithm.jpg",
    "thumbnail": "images/vehicle-gallery/control-algorithm-thumb.webp",
    "title": "Control Algorithm",
    "alt": "Control Algorithm"
  }
];

const turbopropGallery = [
  {
    "src": "images/turboprop-gallery/flight-envelope.png",
    "thumbnail": "images/turboprop-gallery/flight-envelope-thumb.webp",
    "title": "Flight Envelope",
    "alt": "Flight Envelope across flight speed and altitude"
  },
  {
    "src": "images/turboprop-gallery/thrust.png",
    "thumbnail": "images/turboprop-gallery/thrust-thumb.webp",
    "title": "Thrust Surface Plot",
    "alt": "Thrust Surface Plot across flight speed and altitude"
  },
  {
    "src": "images/turboprop-gallery/power.png",
    "thumbnail": "images/turboprop-gallery/power-thumb.webp",
    "title": "Power Surface Plot",
    "alt": "Power Surface Plot across flight speed and altitude"
  },
  {
    "src": "images/turboprop-gallery/ebsfc.png",
    "thumbnail": "images/turboprop-gallery/ebsfc-thumb.webp",
    "title": "EBSFC Surface Plot",
    "alt": "EBSFC Surface Plot across flight speed and altitude"
  },
  {
    "src": "images/turboprop-gallery/thermodynamic-efficiency.png",
    "thumbnail": "images/turboprop-gallery/thermodynamic-efficiency-thumb.webp",
    "title": "Thermodynamic Efficiency Surface Plot",
    "alt": "Thermodynamic Efficiency Surface Plot across flight speed and altitude"
  },
  {
    "src": "images/turboprop-gallery/propulsive-efficiency.png",
    "thumbnail": "images/turboprop-gallery/propulsive-efficiency-thumb.webp",
    "title": "Propulsive Efficiency Surface Plot",
    "alt": "Propulsive Efficiency Surface Plot across flight speed and altitude"
  },
  {
    "src": "images/turboprop-gallery/overall-efficiency.png",
    "thumbnail": "images/turboprop-gallery/overall-efficiency-thumb.webp",
    "title": "Overall Efficiency Surface Plot",
    "alt": "Overall Efficiency Surface Plot across flight speed and altitude"
  }
];

const clampGallery = [
  {
    "src": "images/c-clamp-gallery/1.png",
    "thumbnail": "images/c-clamp-gallery/1-thumb.webp",
    "title": "Completed C-Clamp · Handheld View",
    "alt": "Completed C-Clamp · Handheld View"
  },
  {
    "src": "images/c-clamp-gallery/2.png",
    "thumbnail": "images/c-clamp-gallery/2-thumb.webp",
    "title": "C-Clamp · Engraving and Thread Detail",
    "alt": "C-Clamp · Engraving and Thread Detail"
  },
  {
    "src": "images/c-clamp-gallery/3.png",
    "thumbnail": "images/c-clamp-gallery/3-thumb.webp",
    "title": "C-Clamp · Front View",
    "alt": "C-Clamp · Front View"
  },
  {
    "src": "images/c-clamp-gallery/4.png",
    "thumbnail": "images/c-clamp-gallery/4-thumb.webp",
    "title": "C-Clamp · Extended Screw",
    "alt": "C-Clamp · Extended Screw"
  }
];

const suspensionGallery = [
  {
    "src": "images/suspension-gallery/vehicle-parameters.png",
    "thumbnail": "images/suspension-gallery/vehicle-parameters-thumb.webp",
    "title": "Tesla Model 3 · Nominal Parameters",
    "alt": "Tesla Model 3 · Nominal Parameters"
  },
  {
    "src": "images/suspension-gallery/free-body-diagrams.png",
    "thumbnail": "images/suspension-gallery/free-body-diagrams-thumb.webp",
    "title": "Free Body Diagrams",
    "alt": "Free Body Diagrams"
  },
  {
    "src": "images/suspension-gallery/road-bump.png",
    "thumbnail": "images/suspension-gallery/road-bump-thumb.webp",
    "title": "Implemented Road Bump Model",
    "alt": "Implemented Road Bump Model"
  },
  {
    "src": "images/suspension-gallery/baseline.png",
    "thumbnail": "images/suspension-gallery/baseline-thumb.webp",
    "title": "Baseline Motion",
    "alt": "Baseline Motion"
  },
  {
    "src": "images/suspension-gallery/optimized-motion.png",
    "thumbnail": "images/suspension-gallery/optimized-motion-thumb.webp",
    "title": "Final Optimized Motion",
    "alt": "Final Optimized Motion"
  }
];

const wgmGallery = [
  {"src":"images/wgm-gallery/cover.png","thumbnail":"images/wgm-gallery/cover-thumb.webp","title":"Optical Wall Shear Stress Sensor · Close-Up","alt":"Close-up of the optical wall shear stress sensor assembly"},
  {
    "src": "images/wgm-gallery/cad-membrane.png",
    "thumbnail": "images/wgm-gallery/cad-membrane-thumb.webp",
    "title": "Revised CAD Design · Membrane Beneath the Brass Plate",
    "alt": "Revised CAD Design · Membrane Beneath the Brass Plate"
  },
  {
    "src": "images/wgm-gallery/fiber-assembly.png",
    "thumbnail": "images/wgm-gallery/fiber-assembly-thumb.webp",
    "title": "Optical Fiber and Microsphere Assembly",
    "alt": "Optical Fiber and Microsphere Assembly"
  },
  {
    "src": "images/wgm-gallery/sensor-assembly.png",
    "thumbnail": "images/wgm-gallery/sensor-assembly-thumb.webp",
    "title": "Physical Sensor Assembly",
    "alt": "Physical Sensor Assembly"
  },
  {
    "src": "images/wgm-gallery/floating-element.png",
    "thumbnail": "images/wgm-gallery/floating-element-thumb.webp",
    "title": "Beam-Based Floating Element Schematic",
    "alt": "Beam-Based Floating Element Schematic"
  },
  {
    "src": "images/wgm-gallery/sensor-views.png",
    "thumbnail": "images/wgm-gallery/sensor-views-thumb.webp",
    "title": "Sensor Model · General and Section Views",
    "alt": "Sensor Model · General and Section Views"
  }
];

const bridgeGallery = [
  {
    "src": "images/bridge-gallery/cover.png",
    "thumbnail": "images/bridge-gallery/cover-thumb.webp",
    "title": "Completed Howe Truss Paper Bridge",
    "alt": "Completed Howe Truss Paper Bridge"
  },
  {
    "src": "images/bridge-gallery/half.jpg",
    "thumbnail": "images/bridge-gallery/half-thumb.webp",
    "title": "Single Truss Side",
    "alt": "Single Truss Side"
  },
  {
    "src": "images/bridge-gallery/assembly.png",
    "thumbnail": "images/bridge-gallery/assembly-thumb.webp",
    "title": "Bridge Assembly",
    "alt": "Bridge Assembly"
  },
  {
    "src": "images/bridge-gallery/truss-simulation.jpg",
    "thumbnail": "images/bridge-gallery/truss-simulation-thumb.webp",
    "title": "Truss Simulation · Axial Force Distribution",
    "alt": "Truss Simulation · Axial Force Distribution"
  },
  {
    "src": "images/bridge-gallery/fusion360.png",
    "thumbnail": "images/bridge-gallery/fusion360-thumb.webp",
    "title": "Fusion 360 · Structural Simulation",
    "alt": "Fusion 360 · Structural Simulation"
  },
  {
    "src": "images/bridge-gallery/testing-preparation.jpg",
    "thumbnail": "images/bridge-gallery/testing-preparation-thumb.webp",
    "title": "Load Test Preparation",
    "alt": "Load Test Preparation"
  },
  {
    "src": "images/bridge-gallery/after-testing.png",
    "thumbnail": "images/bridge-gallery/after-testing-thumb.webp",
    "title": "Bridge After Load Testing",
    "alt": "Bridge After Load Testing"
  },
  {
    "src": "images/bridge-gallery/all-bridges.png",
    "thumbnail": "images/bridge-gallery/all-bridges-thumb.webp",
    "title": "Class Bridge Designs",
    "alt": "Class Bridge Designs"
  },
  {
    "src": "images/bridge-gallery/test-view.jpg",
    "thumbnail": "images/bridge-gallery/test-view-thumb.webp",
    "title": "Bridge on the Test Setup",
    "alt": "Bridge on the Test Setup"
  }
];

const windGallery = [
  {
    "src": "images/wind-turbine-blade.jpg",
    "thumbnail": "images/wind-gallery/0-thumb.webp",
    "title": "Wind Turbine Blades",
    "alt": "Wind Turbine Blades"
  },
  {
    "src": "images/wind-gallery/1.png",
    "thumbnail": "images/wind-gallery/1-thumb.webp",
    "title": "Material Families: Tensile Strength vs. Density",
    "alt": "Material Families: Tensile Strength vs. Density"
  },
  {
    "src": "images/wind-gallery/2.png",
    "thumbnail": "images/wind-gallery/2-thumb.webp",
    "title": "Strength-to-Weight Screening",
    "alt": "Strength-to-Weight Screening"
  },
  {
    "src": "images/wind-gallery/3.png",
    "thumbnail": "images/wind-gallery/3-thumb.webp",
    "title": "Shortlisted Strength-to-Weight Candidates",
    "alt": "Shortlisted Strength-to-Weight Candidates"
  },
  {
    "src": "images/wind-gallery/4.png",
    "thumbnail": "images/wind-gallery/4-thumb.webp",
    "title": "Fracture Toughness vs. Density",
    "alt": "Fracture Toughness vs. Density"
  },
  {
    "src": "images/wind-gallery/5.png",
    "thumbnail": "images/wind-gallery/5-thumb.webp",
    "title": "Fracture-Toughness Screening",
    "alt": "Fracture-Toughness Screening"
  },
  {
    "src": "images/wind-gallery/6.png",
    "thumbnail": "images/wind-gallery/6-thumb.webp",
    "title": "Density Limit: 1,800 kg/m³",
    "alt": "Density Limit: 1,800 kg/m³"
  },
  {
    "src": "images/wind-gallery/7.png",
    "thumbnail": "images/wind-gallery/7-thumb.webp",
    "title": "Density and Water-Durability Criteria",
    "alt": "Density and Water-Durability Criteria"
  },
  {
    "src": "images/wind-gallery/8.png",
    "thumbnail": "images/wind-gallery/8-thumb.webp",
    "title": "Fatigue Strength at 10⁷ Cycles",
    "alt": "Fatigue Strength at 10⁷ Cycles"
  },
  {
    "src": "images/wind-gallery/9.png",
    "thumbnail": "images/wind-gallery/9-thumb.webp",
    "title": "Thermal Expansion and Service Temperature",
    "alt": "Thermal Expansion and Service Temperature"
  },
  {
    "src": "images/wind-gallery/10.png",
    "thumbnail": "images/wind-gallery/10-thumb.webp",
    "title": "Material Cost Comparison",
    "alt": "Material Cost Comparison"
  }
];

const projects = [
  {
    number: "01",
    title: "Bone-Screw Implant Biomechanics: High Resolution FEA & Mesh Optimization",
    eyebrow: "NSF Undergraduate Research",
    description: "High-resolution nonlinear finite element models investigating screw-bone interaction across cortical shells and stochastic trabecular microstructures.",
    detail: "Developed stochastic Voronoi-based bone geometries in MATLAB and Blender, prepared and optimized the meshes in Altair HyperMesh, and configured materials, contact, boundary conditions, and analysis in Abaqus/CAE.",
    tags: ["MATLAB", "BLENDER", "ALTAIR HYPERMESH", "ABAQUS / CAE"],
    image: "images/bone-screw-mesh-composite-v2.png",
    alt: "Side-by-side high-resolution bone-screw finite element models",
    gallery: boneScrewGallery
  },
  {
    number: "02",
    title: "Autonomous Multi-Mode Vehicle with IMU Guidance & Servo Ultrasonic Turret",
    eyebrow: "Mechatronics System Design",
    description: "A 3D-printed differential-drive vehicle using IMU guidance and a servo-mounted ultrasonic sensor to navigate indoors, avoid obstacles, and follow a person.",
    detail: "Developed a multi-mode autonomous vehicle combining obstacle avoidance and human-following behavior with IMU guidance, a servo-mounted ultrasonic scanning turret, and differential-drive motion. Integrated Arduino control, circuit design, and a SolidWorks-designed, 3D-printed assembly to connect sensing, navigation, and mechanical design in a working prototype.",
    tags: ["ARDUINO (C/C++)", "IMU", "ULTRASONIC SENSOR", "SERVO TURRET", "DIFFERENTIAL DRIVE", "SOLIDWORKS CAD", "CIRCUIT DESIGN", "3D PRINTING"],
    image: "images/autonomous-robot.jpg",
    alt: "Student-built autonomous differential-drive robotic vehicle",
    gallery: vehicleGallery
  },
  {
    number: "03",
    title: "Turboprop Engine Thermodynamic Cycle & Flight Envelope Analysis",
    eyebrow: "Aerospace Propulsion",
    description: "A MATLAB-based turboprop engine model linking thermodynamic cycle analysis with the flight envelope to map thrust, power, fuel consumption, and efficiency across flight speed and altitude.",
    detail: "Developed a MATLAB-based analysis of a turboprop engine thermodynamic cycle and its flight envelope. Mapped thrust, power, equivalent brake-specific fuel consumption (EBSFC), and thermodynamic, propulsive, and overall efficiency across flight speed and altitude to evaluate performance tradeoffs and inform efficiency optimization.",
    tags: ["MATLAB", "Brayton Cycle", "Flight Envelope", "Thermodynamics", "Efficiency Optimization"],
    image: "images/combined-engine-performance.png",
    alt: "Combined turboprop thrust, power, fuel consumption, and efficiency plots",
    gallery: turbopropGallery
  },
  {
    number: "04",
    title: "Machined Aluminum C-Clamp & Machine Shop Manufacturing",
    eyebrow: "Precision Manufacturing",
    description: "A functional aluminum C-clamp fabricated from raw stock through manual machining, CNC operations, threading, assembly, and laser engraving.",
    detail: "Manufactured a functional aluminum C-clamp from raw stock, connecting dimensioned drawings with cutting, milling, drilling, tapping, lathe threading, CNC machining, assembly, and laser engraving. The broader machine-shop work covered vertical and horizontal band saws, welding, and dimensional inspection, building practical experience in process planning, fabrication, and part fit.",
    tags: ["VERTICAL & HORIZONTAL BAND SAWS", "DRILL PRESS", "MILLING", "LATHE", "CNC", "WELDING", "LASER ENGRAVING", "DIMENSIONING"],
    image: "images/c-clamp-gallery/1.png",
    alt: "Completed machined and laser-engraved aluminum C-clamp held in hand",
    gallery: clampGallery
  },
  {
    number: "05",
    title: "Half-Car Suspension Dynamics Modeling & Ride Comfort Optimization",
    eyebrow: "Systems Dynamics",
    description: "A half-car suspension model studying wheel motion, chassis bounce, and pitch over a road bump, with stiffness and damping tuned to improve ride comfort.",
    detail: "Developed a half-car suspension dynamics model using nominal Tesla Model 3 parameters to study coupled wheel, chassis, and pitch motion over a road bump. Formulated the equations of motion from free body diagrams, represented the system in state-space form, and simulated its transient response using MATLAB / Simulink and the ODE45 solver. Compared baseline and tuned suspension responses to evaluate how stiffness and damping influence vibration and ride comfort.",
    tags: ["MATLAB / Simulink", "State-Space Modeling", "Vibrations", "System Dynamics", "ODE45 Solver", "Ride Comfort Optimization"],
    image: "images/suspension-overview.png",
    alt: "Half-car suspension overview with vehicle, dynamics model, road bump, and response plots",
    gallery: suspensionGallery
  },
  {
    number: "06",
    title: "Optical Whispering Gallery Mode (WGM) Wall Shear Stress Sensor",
    eyebrow: "UREP Research",
    description: "An existing optical wall shear stress sensor redesigned to reduce membrane stiffness and increase deformation, addressing limited sensitivity in whispering gallery mode sensing.",
    detail: "Refined an existing wall shear stress sensor that transfers flow-induced deformation from a floating element through a beam to a PDMS microsphere, where whispering gallery mode resonance provides the optical readout. Addressed excessive membrane stiffness by enlarging the membrane and repositioning it beneath the brass plate, above the supporting ring, to allow greater deflection and improve deformation transfer. The work combined SolidWorks CAD and structural simulation with microsphere fabrication and sensor assembly; experimental validation of the redesigned sensor remained future work.",
    tags: ["Optical Sensing", "Whispering Gallery Mode", "SolidWorks CAD and FEA", "Micro-Fabrication", "PDMS Microspheres", "Aerodynamic Sensor"],
    image: "images/wgm-gallery/cover.png",
    alt: "Optical wall shear stress sensor assembly with microsphere sensing element",
    gallery: wgmGallery
  },
  {
    number: "07",
    title: "High-Efficiency Howe Truss Paper Bridge",
    eyebrow: "Structural Design & Testing",
    description: "A modified Howe truss built from rolled paper and glued joints, using force-distribution analysis and reinforced compression members to maximize load capacity relative to weight.",
    detail: "Designed and fabricated a modified Howe truss paper bridge to maximize load capacity relative to structural weight. Truss simulations guided a 2:1 span-to-height ratio and more even axial-force distribution, while Fusion 360 analysis supported the design using a surrogate material model. Thicker rolled-paper compression members and paper-mache joints formed the final structure. Load testing demonstrated the highest supported load in the class and showed how rope contact and load placement affected local deformation; the available test setup did not establish the bridge’s ultimate capacity.",
    tags: ["Structural Optimization", "Truss Simulation", "Autodesk Inventor", "Fusion 360", "Statics & Mechanics", "Fabrication"],
    image: "images/bridge-gallery/cover.png",
    alt: "Completed modified Howe truss paper bridge",
    gallery: bridgeGallery
  },
  {
    number: "08",
    title: "Comparative Material Selection for Wind Turbine Blades Using Ashby Methodology",
    eyebrow: "Materials Selection",
    description: "A comparative materials study using Ashby charts and Ansys GRANTA EduPack to balance blade weight, strength, fatigue resistance, environmental durability, and cost.",
    detail: "Evaluated wind turbine blade materials through literature-based comparison and systematic Ashby screening in Ansys GRANTA EduPack, with IEC 61400 standards providing design context. Compared metals, ceramics, and composites, then screened candidates by strength-to-weight ratio, fracture toughness, a density limit of 1,800 kg/m³, and water durability. Assessed shortlisted CFRP, GFRP, and magnesium alloys for fatigue strength, thermal behavior, and cost. Both studies favored CFRP under the selected criteria while identifying cost, brittleness, manufacturing, and environmental tradeoffs.",
    tags: ["Ansys GRANTA EduPack", "Ashby Charts", "Composites (CFRP/GFRP)", "Fatigue Analysis", "Materials Selection", "IEC 61400 Standards"],
    image: "images/wind-turbine-blade.jpg",
    alt: "Wind turbine rotor and blades viewed from below",
    gallery: windGallery
  },
  {
    number: "09",
    title: "Countershaft Machine Element Design & DE-Soderberg Fatigue Analysis",
    eyebrow: "Machine Element Design",
    description: "A complete stress and fatigue analysis of a multi-pulley countershaft assembly, determining the minimum shaft diameter for infinite life using the Distortion Energy Soderberg (DE-Soderberg) criterion.",
    detail: "Analyzed a multi-pulley countershaft assembly by resolving belt forces and bearing reactions, establishing bending moments and transmitted torque, and identifying the critical shaft section. Combined alternating bending and steady torsion with stress-concentration factors, notch sensitivity, and corrected endurance strength for AISI 1050 hot-rolled steel. Applied the Distortion Energy Soderberg fatigue criterion with a factor of safety of three to determine the minimum shaft diameter for infinite-life design.",
    tags: ["Machine Element Design", "Fatigue Analysis", "DE-Soderberg Criterion", "Notch Sensitivity", "Bending & Torsion", "AISI 1050 Steel"],
    moreProject: true,
    gallery: []
  }
];

const stackRows = [
  ["MATLAB", "Abaqus", "HyperMesh", "SolidWorks"],
  ["Inventor", "AutoCAD", "Blender", "Multisim"],
  ["C#", "Excel", "Photoshop", "Illustrator"]
];

const experiences = [
  { role: "Undergraduate Biomechanics Research Assistant", place: "Dr. Wei Zeng · NSF Research", date: "May 2026 — Present · Old Westbury, NY · On-Site", copy: "Conduct NSF-funded computational research on bone-screw implant fixation, investigating how trabecular porosity, cortical shells, and screw geometry influence pull-out mechanics. Develop bone geometries and finite element meshes using MATLAB, Blender, and HyperMesh, and configure nonlinear contact analyses in Abaqus. Review biomechanics literature to inform modeling assumptions, mesh refinement, and interpretation of implant–bone interaction." },
  { role: "Undergraduate Research Assistant", place: "Dr. Tindaro Ioppolo · Undergraduate Research and Entrepreneurship Program (UREP)", date: "Sep 2025 — Apr 2026 · Old Westbury, NY · On-Site", copy: "Collaborated on the redesign of an optical wall shear stress sensor using whispering gallery mode resonance in PDMS microspheres. Addressed limited sensitivity by reducing membrane stiffness and improving deformation transfer through the sensing assembly. Combined SolidWorks modeling and structural simulation with microsphere fabrication and sensor assembly to prepare the revised design for future experimental validation." },
  { role: "Peer Tutor", place: "NYIT Office of Academic Success and Enrichment", date: "Mar 2024 — Present · Old Westbury, NY · Hybrid", copy: "Support approximately 15 undergraduates in manufacturing, thermodynamics, CAD, MATLAB, physics, and circuits through two to three weekly tutoring sessions. Break down engineering concepts into manageable steps and guide students through problem-solving methods and software applications. Track individual progress and adapt session plans to recurring errors, helping students develop stronger understanding and more independent study habits." },
  { role: "Mathematics Tutor", place: "NYIT Math Resource Center", date: "Oct 2025 — Present · Old Westbury, NY · On-Site", copy: "Provide mathematics tutoring from Precalculus through Differential Equations and Linear Algebra, supporting six students across two weekly sessions. Explain underlying concepts, work through representative problems, and help students connect mathematical methods with their coursework. Record attendance and progress after each session to identify areas that need reinforcement and guide subsequent support." }
];

function scrollTargetFor(element) {
  const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const maximum = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  return Math.min(maximum, Math.max(0, window.scrollY + element.getBoundingClientRect().top - offset));
}

function SmoothScroll() {
  const paused = useContext(MotionContext);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let current = window.scrollY;
    let target = current;
    let frame = null;
    let destination = null;
    let lastFrameTime = performance.now();

    const limit = (value) => Math.min(Math.max(0, document.documentElement.scrollHeight - window.innerHeight), Math.max(0, value));

    const stop = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      destination = null;
      current = window.scrollY;
      target = current;
    };

    const finish = () => {
      window.scrollTo(0, target);
      current = target;
      frame = null;
      destination?.focus({ preventScroll: true });
      destination = null;
    };

    const animate = (now) => {
      const elapsed = Math.min(64, Math.max(1, now - lastFrameTime));
      lastFrameTime = now;
      target = destination ? scrollTargetFor(destination) : limit(target);
      const distance = target - current;
      const easing = 1 - Math.pow(1 - .066, elapsed / (1000 / 60));
      current += distance * easing;

      if (Math.abs(distance) < .08) {
        finish();
        return;
      }

      window.scrollTo(0, current);
      frame = requestAnimationFrame(animate);
    };

    const begin = () => {
      if (frame === null) {
        lastFrameTime = performance.now();
        frame = requestAnimationFrame(animate);
      }
    };

    const onWheel = (event) => {
      if (document.querySelector("dialog[open]") || event.defaultPrevented || (motion.matches || paused) || event.ctrlKey || event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        stop();
        return;
      }
      // Leave nested scrolling surfaces, including the navigation pill, in native control.
      for (let node = event.target; node instanceof Element && node !== document.body; node = node.parentElement) {
        if (node.scrollHeight > node.clientHeight && /auto|scroll/.test(getComputedStyle(node).overflowY)) {
          stop();
          return;
        }
      }
      if (destination) stop();
      event.preventDefault();
      if (frame === null) {
        current = window.scrollY;
        target = current;
      }
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      target = limit(target + event.deltaY * unit);
      begin();
    };

    const onAnchorClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || !(event.target instanceof Element)) return;
      const anchor = event.target.closest('a[href^="#"]');
      if (!anchor || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
      const selector = anchor.getAttribute("href");
      if (!selector || selector === "#") return;
      let element;
      try { element = document.getElementById(decodeURIComponent(selector.slice(1))); } catch { return; }
      if (!element) return;
      event.preventDefault();
      stop();
      destination = element;
      current = window.scrollY;
      target = scrollTargetFor(element);
      if (window.location.hash !== selector) window.history.pushState(null, "", selector);
      if ((motion.matches || paused)) finish();
      else begin();
    };

    const onKeyDown = (event) => {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Tab", "Escape"].includes(event.key)) stop();
    };

    const syncNativeScroll = () => {
      if (frame === null) {
        current = window.scrollY;
        target = current;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", syncNativeScroll, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("popstate", stop);
    window.addEventListener("hashchange", stop);
    window.addEventListener("portfolio:dialog-open", stop);
    motion.addEventListener("change", stop);
    document.addEventListener("click", onAnchorClick);
    return () => {
      stop();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", syncNativeScroll);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("popstate", stop);
      window.removeEventListener("hashchange", stop);
      window.removeEventListener("portfolio:dialog-open", stop);
      motion.removeEventListener("change", stop);
      document.removeEventListener("click", onAnchorClick);
    };
  }, [paused]);

  return null;
}

function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame;
    let particles = [];
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.min(96, Math.max(42, Math.floor(window.innerWidth / 15)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.2 + .25,
        vx: (Math.random() - .5) * .12,
        vy: (Math.random() - .5) * .12
      }));
    };
    const render = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particles.forEach((particle, index) => {
        if (!reduced) {
          particle.x = (particle.x + particle.vx + window.innerWidth) % window.innerWidth;
          particle.y = (particle.y + particle.vy + window.innerHeight) % window.innerHeight;
        }
        context.beginPath();
        context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        context.fillStyle = index % 9 === 0 ? "rgba(245,158,11,.72)" : "rgba(232,224,205,.30)";
        context.fill();
      });
      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const distance = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (distance < 105) {
            context.beginPath();
            context.moveTo(particles[i].x, particles[i].y);
            context.lineTo(particles[j].x, particles[j].y);
            context.strokeStyle = `rgba(176,137,73,${(1 - distance / 105) * .12})`;
            context.stroke();
          }
        }
      }
      if (!reduced) frame = requestAnimationFrame(render);
    };
    resize();
    render();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full opacity-75" />;
}

function Reveal({ children, className = "", delay = 0 }) {
  const paused = useContext(MotionContext);
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.classList.add("is-visible");
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        node.classList.add("is-visible");
        observer.unobserve(node);
      }
    }, { threshold: .14, rootMargin: "0px 0px -5%" });
    observer.observe(node);
    return () => observer.disconnect();
  }, [paused]);
  return <div ref={ref} className={`reveal ${className}`} style={{ "--reveal-delay": `${delay}ms` }}>{children}</div>;
}

function Navbar() {
  const paused = useContext(MotionContext);
  const [compact, setCompact] = useState(false);
  const [active, setActive] = useState("top");
  const [indicator, setIndicator] = useState({ left: 4, width: 52 });
  const sliderRef = useRef(null);
  const itemRefs = useRef({});
  const navigationLockRef = useRef(null);

  useEffect(() => {
    const update = () => {
      setCompact(window.scrollY > window.innerHeight * .62);
      if (navigationLockRef.current) {
        const destination = document.getElementById(navigationLockRef.current);
        if (destination && Math.abs(window.scrollY - scrollTargetFor(destination)) > 2) return;
        navigationLockRef.current = null;
      }
      const marker = window.scrollY + window.innerHeight * .38;
      let current = "top";
      navSections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= marker) current = section.id;
      });
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) current = "contact";
      setActive((value) => value === current ? value : current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const releaseLock = () => { navigationLockRef.current = null; };
    window.addEventListener("wheel", releaseLock, { passive: true });
    window.addEventListener("touchstart", releaseLock, { passive: true });
    window.addEventListener("pointerdown", releaseLock, { passive: true });
    window.addEventListener("keydown", releaseLock);
    window.addEventListener("popstate", releaseLock);
    return () => {
      window.removeEventListener("wheel", releaseLock);
      window.removeEventListener("touchstart", releaseLock);
      window.removeEventListener("pointerdown", releaseLock);
      window.removeEventListener("keydown", releaseLock);
      window.removeEventListener("popstate", releaseLock);
    };
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    const item = itemRefs.current[active];
    if (!slider || !item) return;
    let disposed = false;
    const positionIndicator = () => {
      if (disposed) return;
      setIndicator({ left: item.offsetLeft, width: item.offsetWidth });
      const desiredLeft = item.offsetLeft - slider.clientWidth / 2 + item.offsetWidth / 2;
      slider.scrollTo({ left: Math.max(0, desiredLeft), behavior: paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    };
    const frame = requestAnimationFrame(positionIndicator);
    window.addEventListener("resize", positionIndicator);
    if (document.fonts?.ready) document.fonts.ready.then(positionIndicator);
    const observer = new ResizeObserver(positionIndicator);
    observer.observe(slider);
    observer.observe(item);
    return () => {
      disposed = true;
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", positionIndicator);
    };
  }, [active, compact, paused]);

  return (
    <header className={`nav-shell fixed inset-x-0 top-0 z-50 ${compact ? "is-compact" : ""}`}>
      <nav aria-label="Primary" className={`primary-nav mx-auto flex max-w-7xl items-center gap-4 px-3 transition-all duration-300 sm:px-8 ${compact ? "h-16" : "h-20"}`}>
        <div ref={sliderRef} className="nav-slider" aria-label="Portfolio sections">
          <span aria-hidden="true" className="nav-active-pill" style={{ width: `${indicator.width}px`, transform: `translateX(${indicator.left}px)` }} />
          {navSections.map((section) => (
            <a
              key={section.id}
              ref={(node) => { if (node) itemRefs.current[section.id] = node; }}
              href={`#${section.id}`}
              className={`nav-slider-link ${active === section.id ? "is-active" : ""}`}
              aria-current={active === section.id ? "location" : undefined}
              aria-label={section.id === "top" ? "Shariful Alam — back to top" : undefined}
              onClick={(event) => {
                if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
                navigationLockRef.current = section.id;
                setActive(section.id);
              }}
            >
              {section.id === "top" ? <>SA<span className="brand-dot">.</span></> : section.label}
            </a>
          ))}
        </div>
        <a href="resume/Shariful-Alam-Resume.pdf" className="nav-resume button-secondary" target="_blank" rel="noreferrer">Résumé <span aria-hidden="true">↗</span></a>
      </nav>
    </header>
  );
}

function Hero() {
  const paused = useContext(MotionContext);
  const phrases = [
    "Flight & Propulsion",
    "Nonlinear FEA",
    "Thermal Systems",
    "Vehicle Dynamics",
    "Robotics & Controls",
    "CAD to Fabrication"
  ];
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [visible, setVisible] = useState("");
  const [deleting, setDeleting] = useState(false);
  const heroRef = useRef(null);
  const backgroundRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const background = backgroundRef.current;
    const content = contentRef.current;
    if (!hero || !background || !content) return;
    if (paused) {
      background.style.setProperty("--hero-scale", "1.04");
      background.style.setProperty("--hero-shift", "0px");
      content.style.setProperty("--hero-content-shift", "0px");
      return;
    }
    let frame = null;
    const updateZoom = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const distance = Math.min(hero.offsetHeight, Math.max(0, -hero.getBoundingClientRect().top));
        const progress = distance / hero.offsetHeight;
        background.style.setProperty("--hero-scale", (1 + progress * .28).toFixed(4));
        background.style.setProperty("--hero-shift", `${(distance * .22).toFixed(2)}px`);
        content.style.setProperty("--hero-content-shift", `${(-distance * .08).toFixed(2)}px`);
        frame = null;
      });
    };
    updateZoom();
    window.addEventListener("scroll", updateZoom, { passive: true });
    window.addEventListener("resize", updateZoom);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateZoom);
      window.removeEventListener("resize", updateZoom);
    };
  }, [paused]);

  useEffect(() => {
    if (paused) {
      setVisible(phrases[0]);
      return;
    }
    const phrase = phrases[phraseIndex];
    const complete = visible === phrase;
    const empty = visible === "";
    const timeout = setTimeout(() => {
      if (complete && !deleting) setDeleting(true);
      else if (empty && deleting) {
        setDeleting(false);
        setPhraseIndex((value) => (value + 1) % phrases.length);
      } else setVisible(phrase.slice(0, visible.length + (deleting ? -1 : 1)));
    }, complete ? 1300 : deleting ? 44 : 82);
    return () => clearTimeout(timeout);
  }, [visible, deleting, phraseIndex, paused]);
  return (
    <section ref={heroRef} id="top" tabIndex={-1} className="hero-section relative isolate flex min-h-screen items-end overflow-hidden px-5 pb-8 pt-28 sm:px-8 sm:pb-10 lg:pb-8">
      <div ref={backgroundRef} aria-hidden="true" className="hero-background absolute inset-0 -z-20" />
      <div aria-hidden="true" className="hero-scrim absolute inset-0 -z-10" />
      <div ref={contentRef} className="hero-content relative w-full text-left">
        <div className="hero-eyebrow mb-5 flex items-center justify-start gap-4 text-accent">
          <span className="accent-line" /> MECHANICAL &amp; AEROSPACE ENGINEERING
        </div>
        <h1 className="hero-title font-display text-[clamp(3.9rem,9.5vw,8rem)] font-bold leading-[.84] text-foreground">Shariful Alam</h1>
        <p className="mt-5 min-h-8 font-mono text-base text-accent sm:text-lg"><span className="sr-only">Focus areas: {phrases.join(", ")}.</span><span aria-hidden="true">{visible}<span className="caret" /></span></p>
        <p className="hero-statement mt-4 text-foreground">
          <span className="hero-statement-text">
            <span className="hero-statement-line">Turning complex mechanics into</span>
            <span className="hero-statement-line">clear models and working hardware.</span>
          </span>
        </p>
        <p className="hero-statement-support mt-4 max-w-xl text-base text-foreground/80 sm:text-lg">From nonlinear FEA and vehicle dynamics to autonomous robotics and precision fabrication.</p>
        <div className="mt-7 flex flex-col justify-start gap-3 sm:flex-row">
          <a href="#projects" className="button-primary">View projects <span aria-hidden="true">↓</span></a>
          <a href="#contact" className="button-secondary">GET IN TOUCH</a>
        </div>
        <a href="resume/Shariful-Alam-Resume.pdf" className="hero-resume-link" target="_blank" rel="noreferrer">View résumé <span aria-hidden="true">↗</span></a>
      </div>
      <a href="#about" aria-label="Scroll to About" className="scroll-cue absolute bottom-7 right-5 font-mono text-[.62rem] uppercase tracking-[.2em] text-foreground/60 sm:right-8">Scroll<span className="ml-2 text-accent">↓</span></a>
    </section>
  );
}

function SectionIntro({ index, label, title, copy }) {
  return (
    <Reveal className="section-intro">
      <p className="section-kicker"><span>{index}</span>{label}</p>
      <div className={`section-intro-main${copy ? " has-copy" : ""}`}>
        <h2 className="section-heading">{title}</h2>
        {copy && <p className="section-intro-copy">{copy}</p>}
      </div>
    </Reveal>
  );
}

function About() {
  const capabilities = [
    {
      number: "01",
      title: "Analyze",
      copy: "Nonlinear FEA, system dynamics, fatigue, structural behavior, and MATLAB-based modeling."
    },
    {
      number: "02",
      title: "Design",
      copy: "CAD, machine elements, materials selection, mechanisms, and design for manufacturing."
    },
    {
      number: "03",
      title: "Build & Validate",
      copy: "Mechatronics, prototyping, machining, 3D printing, experimental testing, and iteration."
    }
  ];
  return (
    <section id="about" tabIndex={-1} className="about-section section-shell border-t border-border">
      <p className="section-kicker about-section-label"><span>01</span>About</p>
      <div className="about-layout">
        <Reveal className="portrait-frame">
          <img src="profile/Shariful-Alam.jpg" alt="MD Shariful Alam" className="h-full w-full object-cover" />
        </Reveal>
        <Reveal delay={80} className="about-copy">
          <h2 className="about-heading">Engineering at the intersection of <span className="text-accent">simulation, motion, and making.</span></h2>
          <div className="about-body">
            <p>Mechanical engineering student at New York Institute of Technology with an aerospace focus and hands-on experience across the full development cycle—from first-principles analysis and CAD to simulation, prototyping, testing, and fabrication.</p>
            <p>My work spans nonlinear finite-element analysis, vehicle-vibration dynamics, autonomous robotics, aircraft performance, machine-element fatigue design, optical sensing, materials selection, lightweight structures, and precision manufacturing. Using SolidWorks, Inventor, Fusion 360, MATLAB, Abaqus, HyperMesh, and Arduino C++, I connect computational models with testable, reliable hardware.</p>
          </div>
        </Reveal>
      </div>
      <div className="capability-grid" aria-label="Engineering capabilities">
        {capabilities.map((capability, index) => (
          <Reveal key={capability.title} delay={80 + index * 70} className="capability-item">
            <span>{capability.number}</span>
            <h3>{capability.title}</h3>
            <p>{capability.copy}</p>
          </Reveal>
        ))}
      </div>
      <Reveal delay={160}>
        <blockquote className="philosophy-quote">
          <p>“Engineering is the closest thing to magic that exists in the world.”</p>
          <footer>— Elon Musk</footer>
        </blockquote>
      </Reveal>
    </section>
  );
}

function ProjectDialog({ project, onClose }) {
  const paused = useContext(MotionContext);
  const dialogRef = useRef(null);
  const thumbnailsRef = useRef(null);
  const backdropPressed = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const imageButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const closeViewer = () => {
    if (expanded) {
      setExpanded(false);
      imageButtonRef.current?.focus({ preventScroll: true });
    } else onClose();
  };
  const [playing, setPlaying] = useState(() => !paused);
  const gallery = project.gallery || [{ src: project.image, thumbnail: project.image, alt: project.alt, title: project.title }];
  const active = gallery[activeIndex];

  const selectImage = (index) => {
    setActiveIndex((index + gallery.length) % gallery.length);
    setPlaying(!paused);
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    const opener = document.activeElement;
    const root = document.documentElement;
    const oldRootOverflow = root.style.overflow;
    const oldBodyOverflow = document.body.style.overflow;
    window.dispatchEvent(new Event("portfolio:dialog-open"));
    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
      root.style.overflow = oldRootOverflow;
      document.body.style.overflow = oldBodyOverflow;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const strip = thumbnailsRef.current;
    const item = strip?.children[activeIndex];
    if (!item) return;
    const left = item.offsetLeft;
    const right = left + item.offsetWidth;
    if (left < strip.scrollLeft) strip.scrollTo({ left, behavior: "auto" });
    else if (right > strip.scrollLeft + strip.clientWidth) strip.scrollTo({ left: right - strip.clientWidth, behavior: "auto" });
  }, [activeIndex]);

  return createPortal(
    <dialog
      ref={dialogRef}
      className={`project-dialog${expanded ? " project-dialog-expanded" : ""}`}
      aria-labelledby="project-dialog-title"
      aria-describedby="project-dialog-description"
      onCancel={(event) => { event.preventDefault(); closeViewer(); }}
      onPointerDown={(event) => { backdropPressed.current = event.target === event.currentTarget; }}
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
        if (backdropPressed.current && event.target === event.currentTarget && outside) closeViewer();
        backdropPressed.current = false;
      }}
      onKeyDown={(event) => {
        if (event.key === "Tab") {
          const controls = [...event.currentTarget.querySelectorAll("button:not([disabled])")].filter((button) => button.getClientRects().length);
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
          return;
        }
        if (gallery.length < 2 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          selectImage(activeIndex + (event.key === "ArrowRight" ? 1 : -1));
        }
      }}
    >
      <header className="project-dialog-header">
        <div>
          <p className="project-dialog-eyebrow">{project.number} · {project.eyebrow}</p>
          <h2 id="project-dialog-title">{project.title}</h2>
        </div>
        <button ref={closeButtonRef} type="button" className="dialog-close" onClick={closeViewer} aria-label={expanded ? "Close enlarged image" : "Close project details"} autoFocus><span aria-hidden="true">×</span></button>
      </header>
      <div className="project-dialog-body">
        <p id="project-dialog-description" className="project-dialog-description">{project.detail}</p>
        {gallery.length > 0 && <section className="project-gallery" aria-label="Project gallery">
          <figure>
            <button ref={imageButtonRef} type="button" className="gallery-stage" aria-label={expanded ? "Return to project gallery" : "Enlarge image"} onClick={() => { setExpanded(!expanded); closeButtonRef.current?.focus({ preventScroll: true }); }}>
              <img className={active.crop ? "gallery-photo-cropped" : undefined} key={`${active.src}-${playing}`} src={active.animated && !playing ? active.poster : active.src} alt={active.alt} />
              {!expanded && <span className="gallery-enlarge-hint">Enlarge ↗</span>}
            </button>
            <figcaption aria-live="polite" aria-atomic="true"><span>{active.title}</span><span className="gallery-count">{activeIndex + 1} / {gallery.length}</span></figcaption>
          </figure>
          {gallery.length > 1 && <>
            <div className="gallery-controls">
              <button type="button" className="gallery-control" onClick={() => selectImage(activeIndex - 1)} aria-label="Previous image"><span aria-hidden="true">←</span> Previous</button>
              {active.animated && <button type="button" className="gallery-control gallery-play" onClick={() => setPlaying((value) => !value)}>{playing ? "Pause animation" : "Play animation"}</button>}
              <button type="button" className="gallery-control" onClick={() => selectImage(activeIndex + 1)} aria-label="Next image">Next <span aria-hidden="true">→</span></button>
            </div>
            <div ref={thumbnailsRef} className="gallery-thumbnails" aria-label="Choose a gallery image">
              {gallery.map((item, index) => <button key={item.src} type="button" className="gallery-thumbnail" aria-label={`Show image ${index + 1}: ${item.title}`} aria-current={index === activeIndex ? "true" : undefined} onClick={() => selectImage(index)}>
                <img src={item.thumbnail} alt="" loading="lazy" />
                {item.animated && <span>GIF</span>}
              </button>)}
            </div>
          </>}
        </section>}
      </div>
    </dialog>,
    document.body
  );
}

function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  return (
    <section id="projects" tabIndex={-1} className="section-shell border-t border-border">
      <SectionIntro index="02" label="Selected Projects" title={<>Equations are only <span className="text-accent">the beginning.</span></>} copy="Projects across nonlinear finite element analysis, autonomous mechatronics, vehicle dynamics, machine design, propulsion, optical sensing, structural testing, materials selection, and precision fabrication." />
      <div className="projects-grid mt-16">
        {projects.filter((project) => !project.moreProject).map((project, index) => {
          return (
            <Reveal key={project.number} className="project-reveal" delay={(index % 2) * 70}>
              <article className={`project-card${["03", "05"].includes(project.number) ? " project-card-diagram" : ""}`}>
                <div className="project-media">
                  <img src={project.image} srcSet={project.imageSet} sizes="(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 33vw" decoding="async" alt={project.alt} loading="lazy" style={project.imagePosition ? { objectPosition: project.imagePosition } : undefined} />
                  <span className="project-index">{project.number} / {String(projects.length).padStart(2, "0")}</span>
                </div>
                <div className="project-copy">
                  <div>
                    <p className="font-mono text-[.67rem] uppercase tracking-[.17em] text-accent">{project.eyebrow}</p>
                    <h3 className="project-title">{project.title}</h3>
                    <p className="mt-5 text-sm leading-7 text-muted sm:text-base">{project.description}</p>
                    {project.metric && <p className="project-metric">{project.metric}</p>}
                    <div className="mt-7 flex flex-wrap gap-2">{project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
                  </div>
                  <button onClick={() => setSelectedProject(project)} type="button" className="project-detail-button" aria-haspopup="dialog" aria-label={`View details: ${project.title}`}>View details<span aria-hidden="true">↗</span></button>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
      <div className="more-projects">
        <Reveal><h3 className="more-projects-heading">More Projects</h3></Reveal>
        {projects.filter((project) => project.moreProject).map((project) => (
          <Reveal key={project.number}>
            <article className="project-card more-project-card">
              <div>
                <p className="font-mono text-[.67rem] uppercase tracking-[.17em] text-accent">{project.number} · {project.eyebrow}</p>
                <h4 className="project-title">{project.title}</h4>
              </div>
              <div className="more-project-copy">
                <p className="text-sm leading-7 text-muted sm:text-base">{project.description}</p>
                <div className="mt-7 flex flex-wrap gap-2">{project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
                <button onClick={() => setSelectedProject(project)} type="button" className="project-detail-button" aria-haspopup="dialog" aria-label={`View details: ${project.title}`}>View details<span aria-hidden="true">↗</span></button>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      {selectedProject && <ProjectDialog key={selectedProject.number} project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </section>
  );
}

const skillGroups = [
  {
    "icon": "⚡",
    "title": "FEA & Computational Tools",
    "items": [
      "Abaqus Standard / Explicit",
      "Altair HyperMesh",
      "2D/3D Tetramesh",
      "Non-Linear Contact Mechanics",
      "CDP Damage Plasticity",
      "Mesh Convergence Analysis",
      "Ansys GRANTA EduPack",
      "Ashby Selection Charts"
    ]
  },
  {
    "icon": "📐",
    "title": "CAD & Mechanical Design",
    "items": [
      "SolidWorks (Part/Assembly/Drawing)",
      "Autodesk Inventor",
      "Autodesk Fusion 360",
      "Blender (Mesh Decimation)",
      "GD&T Standards",
      "Free Body Diagrams (FBD)",
      "Machine Element Sizing"
    ]
  },
  {
    "icon": "💻",
    "title": "Programming & Embedded",
    "items": [
      "MATLAB & Simulink",
      "ODE45 Numerical Solvers",
      "Arduino C / C++",
      "MPU-6050 IMU Integration",
      "State Machine Architecture",
      "Circuit Schematic Design",
      "L298N Motor Drivers"
    ]
  },
  {
    "icon": "🛠️",
    "title": "Machining & Fabrication",
    "items": [
      "Manual Vertical Milling",
      "Engine Lathe Threading",
      "CNC Machining",
      "Horizontal / Vertical Band Saw",
      "Drill Press & Hand Tapping",
      "Laser Cutting & Engraving",
      "FDM 3D Printing",
      "Precision Metrology"
    ]
  },
  {
    "icon": "🌀",
    "title": "Dynamics & Propulsion",
    "items": [
      "4-DOF Half-Car Suspension",
      "State-Space Linearization",
      "DE-Soderberg Fatigue Theory",
      "Howe Truss Force Analysis",
      "Turboprop Brayton Cycle",
      "Aerodynamic Flight Envelope"
    ]
  },
  {
    "icon": "💡",
    "title": "Sensors & Laboratory",
    "items": [
      "Whispering Gallery Mode (WGM)",
      "PDMS Polymeric Microspheres",
      "Tapered Optical Fibers",
      "Wall Shear Stress Sensing",
      "Cleanroom Assembly",
      "Microscope Inspection"
    ]
  }
];

function Stack() {
  return (
    <section id="stack" tabIndex={-1} className="overflow-hidden border-t border-border py-24 sm:py-32">
      <div className="section-shell !py-0">
        <SectionIntro index="04" label="Technical Stack" title={<>Tools for thinking, <span className="text-accent">making, and validating.</span></>} />
      </div>
      <div className="mt-14 space-y-3">
        {stackRows.map((row, index) => (
          <div className="marquee" key={row.join("-")}>
            <div className={`marquee-track ${index % 2 ? "is-reverse" : ""}`}>
              {[...row, ...row, ...row].map((item, itemIndex) => <span className="stack-item" aria-hidden={itemIndex >= row.length ? "true" : undefined} key={`${item}-${itemIndex}`}><i aria-hidden="true">{String(index * 4 + (itemIndex % 4) + 1).padStart(2, "0")}</i>{item}<b aria-hidden="true">×</b></span>)}
            </div>
          </div>
        ))}
      </div>
      <div className="section-shell skill-groups-shell">
        <div className="skill-groups">
          {skillGroups.map((group) => (
            <article className="skill-group" key={group.title}>
              <div className="skill-group-header">
                <span className="skill-group-icon" aria-hidden="true">{group.icon}</span>
                <h3>{group.title}</h3>
              </div>
              <ul className="skill-group-items">
                {group.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" tabIndex={-1} className="section-shell border-t border-border">
      <SectionIntro index="03" label="Experience & Education" title={<>Engineering experience. <span className="text-accent">Academic foundation.</span></>} />
      <div className="mt-16 grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
        <Reveal className="education-card">
          <p className="section-kicker"><img className="education-logo" src="images/nyit-logo.png" alt="New York Tech logo" />New York Institute of Technology</p>
          <h3 className="mt-8 font-display text-3xl font-semibold tracking-[-.04em]">B.S. Mechanical Engineering</h3>
          <p className="mt-2 text-accent">Minor in Mathematics</p>
          <dl className="education-details">
            <div><dt>Expected</dt><dd>December 2026</dd></div>
            <div><dt>CGPA</dt><dd>3.99 / 4.00</dd></div>
            <div><dt>Honors</dt><dd>Presidential Honor List (7 of 7 semesters)</dd></div>
            <div><dt>Recognition</dt><dd>CoECS Dean's Recognition Scholarship (2024-2025 and 2026-2027) · T.K. Steele Scholarship</dd></div>
            <div><dt>Professional Organizations</dt><dd>American Society of Mechanical Engineers (ASME) · Society of Hispanic Professional Engineers (SHPE) · National Society of Black Engineers (NSBE)</dd></div>
          </dl>
        </Reveal>
        <div className="timeline">
          {experiences.map((item, index) => (
            <Reveal key={`${item.role}-${item.place}`} delay={index * 55} className="timeline-item">
              <span className="timeline-dot" />
              <p className="font-mono text-[.66rem] uppercase tracking-[.13em] text-accent">{item.date}</p>
              <h3 className="mt-3 font-display text-xl font-semibold sm:text-2xl">{item.role}</h3>
              <p className="mt-1 text-sm font-medium text-foreground/70">{item.place}</p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">{item.copy}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const links = [
    { index: "01", label: "Email", value: "ae.shariful@gmail.com", href: "mailto:ae.shariful@gmail.com" },
    { index: "02", label: "LinkedIn", value: "linkedin.com/in/sharifulalam1", href: "https://www.linkedin.com/in/sharifulalam1" },
    { index: "03", label: "Phone", value: "+1 516 808 3987", href: "tel:+15168083987" },
    { index: "04", label: "Location", value: "Jamaica, New York", href: "https://www.google.com/maps/search/?api=1&query=Jamaica%2C+NY" }
  ];
  return (
    <section id="contact" tabIndex={-1} className="section-shell contact-section border-t border-border">
      <Reveal>
        <p className="section-kicker"><span>05</span>Contact</p>
        <h2 className="contact-heading">Let’s build something<br /><span>that holds.</span></h2>
        <p className="mt-8 max-w-2xl text-base leading-8 text-muted">I’m interested in mechanical design, simulation, aerospace, thermal systems, R&amp;D, and engineering roles where analysis has a direct line to better physical systems.</p>
      </Reveal>
      <div className="contact-grid">
        {links.map((link, index) => <Reveal key={link.label} delay={index * 65}><a className="contact-link" href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"><span>{link.label}</span><strong>{link.value}</strong><i>↗</i></a></Reveal>)}
      </div>
    </section>
  );
}

function Footer({ motionPaused, onToggleMotion }) {
  return (
    <footer className="border-t border-border px-5 py-8 sm:px-8">
      <div className="footer-content mx-auto max-w-7xl font-mono text-[.65rem] uppercase tracking-[.12em] text-muted">
        <a href="#top" className="font-display text-lg font-bold normal-case tracking-[-.04em] text-foreground">SA<span className="text-accent">.</span></a>
        <div className="footer-rights"><p>All Rights Reserved</p><button type="button" className="motion-toggle" aria-pressed={motionPaused} onClick={onToggleMotion}>{motionPaused ? "Resume motion" : "Pause motion"}</button></div>
        <p className="footer-credit">Designed &amp; built by Shariful Alam · 2026</p>
      </div>
    </footer>
  );
}

function App() {
  const [motionPaused, setMotionPaused] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    document.documentElement.dataset.motion = motionPaused ? "paused" : "running";
  }, [motionPaused]);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotionPaused(preference.matches);
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  return <MotionContext.Provider value={motionPaused}><SmoothScroll /><a className="skip-link" href="#main-content">Skip to content</a><div className="noise" /><Navbar /><main id="main-content" tabIndex={-1}><Hero /><About /><Projects /><Experience /><Stack /><Contact /></main><Footer motionPaused={motionPaused} onToggleMotion={() => setMotionPaused((value) => !value)} /></MotionContext.Provider>;
}

createRoot(document.getElementById("root")).render(<App />);
