import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "dat.gui";

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(30, 60.0, 30);
camera.lookAt(0, 0, 30);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
const main = document.querySelector("main");
main.appendChild(renderer.domElement);

// Create a parent group to hold the drawings
const drawGroup = new THREE.Group();
scene.add(drawGroup);

// OrbitControls initialization
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.rotateSpeed = 0.5;

// Create geometry and material for the lines
const lineGeometry = new THREE.BufferGeometry();
const lineMaterial = new THREE.LineBasicMaterial({ vertexColors: true });

// Initialize attractor parameters and initial conditions
let x, y, z;
let nbOfLoop = 10000;
let dt = 0.005;
let currentName = "lorenz";

// Arrays to store positions and colors of the lines
const positions = [];
const colors = [];

// Initialize the scene
function init() {
  // Create a line segments object
  const line = new THREE.Line(lineGeometry, lineMaterial);
  // Add the lines to the scene
  scene.add(line);
  x = 0.1;
  y = 0;
  z = 0;
}

// Function to update the attractor based on its name
function attractor(name) {
  currentName = name;
  clearScene();
  init();
  instantDraw(name, nbOfLoop);
  document.querySelector(".name").innerHTML =
    transformString(name) + " attractor";
}

function transformString(inputString) {
  // Use a regular expression to split the string at capital letters
  const parts = inputString.split(/(?=[A-Z])/);

  // Capitalize the first letter of each part and join with spaces
  const transformedString = parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return transformedString;
}

// Function to instantly draw attractor points
function instantDraw(name, times) {
  for (let i = 0; i < times; i++) {
    const { dx, dy, dz } = calculateAttractor(name);
    x += dx;
    y += dy;
    z += dz;
    positions.push(x, y, z);
    colors.push(x / 30 + 0.5, y / 30 + 0.5, z / 30 + 0.5);
  }

  // Update the line geometry
  lineGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  lineGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colors, 3)
  );
}

// Function to calculate attractor values
function calculateAttractor(name) {
  let dx, dy, dz;

  if (name == "lorenz") {
    const a = 10,
      b = 28,
      c = 8 / 3;
    dx = a * (y - x) * dt;
    dy = (x * (b - z) - y) * dt;
    dz = (x * y - c * z) * dt;
  } else if (name == "rossler") {
    const a = 0.2,
      b = 0.2,
      c = 5.7;
    dx = (-y - z) * dt;
    dy = (x + a * y) * dt;
    dz = (b + z * (x - c)) * dt;
  } else if (name == "aizawa") {
    const a = 0.95,
      b = 0.7,
      c = 0.6,
      d = 3.5,
      e = 0.25,
      f = 0.1;
    dx = ((z - b) * x - d * y) * dt;
    dy = (d * x + (z - b) * y) * dt;
    dz =
      (c +
        a * z -
        Math.pow(z, 3) / 3 -
        (Math.pow(x, 2) + Math.pow(y, 2)) * (1 + e * z) +
        f * z * Math.pow(x, 3)) *
      dt;
  } else if (name == "arneodo") {
    const a = -5.5,
      b = 3.5,
      c = -1;

    dx = y * dt;
    dy = z * dt;
    dz = (-a * x - b * y - z + c * Math.pow(x, 3)) * dt;
  } else if (name == "sprottB") {
    const a = 0.4,
      b = 1.2,
      c = 1;

    dx = a * y * z * dt;
    dy = (x - b * y) * dt;
    dz = (c - x * y) * dt;
  } else if (name == "sprottLinzF") {
    const a = 0.5;
    dx = (y + z) * dt;
    dy = (-x + a * y) * dt;
    dz = (Math.pow(x, 2) - z) * dt;
  } else if (name == "halvorsen") {
    const a = 1.4;
    dx = (-a * x - 4 * y - 4 * z - y * y) * dt;
    dy = (-a * y - 4 * z - 4 * x - z * z) * dt;
    dz = (-a * z - 4 * x - 4 * y - x * x) * dt;
  }

  return { dx, dy, dz };
}

function clearScene() {
  while (drawGroup.children.length > 0) {
    const child = drawGroup.children[0];
    drawGroup.remove(child);
  }
  positions.length = 0;
  colors.length = 0;
}

// Initialize the scene
init();

// GUI
const gui = new GUI();
const params = {
  Lorenz: () => attractor("lorenz"),
  Rossler: () => attractor("rossler"),
  Aizawa: () => attractor("aizawa"),
  Arneodo: () => attractor("arneodo"),
  SprottB: () => attractor("sprottB"),
  SprottLinzF: () => attractor("sprottLinzF"),
  Halvorsen: () => attractor("halvorsen"),
  reload: () => attractor(currentName),
  nbOfLoop: 10000,
  dt: 0.005,
};
const chaoticAttractors = gui.addFolder("Chaotic attractors");
chaoticAttractors.add(params, "Lorenz");
chaoticAttractors.add(params, "Rossler");
chaoticAttractors.add(params, "Aizawa");
chaoticAttractors.add(params, "Arneodo");
chaoticAttractors.add(params, "SprottB").name("Sprott B");
chaoticAttractors.add(params, "SprottLinzF").name("Sprott Linz F");
chaoticAttractors.add(params, "Halvorsen");
chaoticAttractors.open();
gui
  .add(params, "nbOfLoop", 1000, 50000, 500)
  .listen()
  .onChange(function (value) {
    nbOfLoop = value; // Update the nbOfLoop variable when the GUI slider changes
  })
  .name("Number of loops");
gui
  .add(params, "dt", 0.005, 0.02, 0.005)
  .listen()
  .onChange(function (value) {
    dt = value; // Update the dt variable when the GUI slider changes
  })
  .name("Accuracy (dt)");
gui.add(params, "reload").name("Reload");

// Simulation loop
function simulate() {
  drawGroup.add(camera);
  drawGroup.rotation.z -= 0.001;
  renderer.render(scene, camera);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  simulate();
  controls.update();
}

// Init scene
attractor(currentName);
// Start the animation
animate();
