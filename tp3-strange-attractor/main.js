import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "dat.gui";

// Set up the scene
const scene = new THREE.Scene();

// Set up the camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(30, 60.0, 30);
camera.lookAt(0, 0, 30);

// Set up the renderer
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

// Define parameters and initial conditions
let x = 0.1;
let y = 0;
let z = 0;

// Arrays to store positions and colors of the lines
let positions = [];
let colors = [];

// Initialize the scene
function init() {
  // Create a line segments object
  const line = new THREE.Line(lineGeometry, lineMaterial);
  // Add the lines to the scene
  scene.add(line);
}

// Function to update the attractor based on its name
function attractor(name) {
  //   const lineGeometry = new THREE.BufferGeometry();
  //   const line = new THREE.Line(lineGeometry, lineMaterial);
  //   scene.add(line);

  let dt, dx, dy, dz, a, b, c, d, e, f;

  if (name == "lorenz") {
    a = 10;
    b = 28;
    c = 8 / 3;
    dt = 0.01;
    dx = a * (y - x) * dt;
    dy = (x * (b - z) - y) * dt;
    dz = (x * y - c * z) * dt;
  } else if (name == "rossler") {
    a = 0.2;
    b = 0.2;
    c = 5.7;
    dt = 0.01;
    dx = (-y - z) * dt;
    dy = (x + a * y) * dt;
    dz = (b + z * (x - c)) * dt;
  } else if (name == "aizawa") {
    a = 0.95;
    b = 0.7;
    c = 0.6;
    d = 3.5;
    e = 0.25;
    f = 0.1;
    dt = 0.01;
    dx = ((z - b) * x - d * y) * dt;
    dy = (d * x + (z - b) * y) * dt;
    dz =
      (c +
        a * z -
        Math.pow(z, 3) / 3 -
        (Math.pow(x, 2) + Math.pow(y, 2)) * (1 + e * z) +
        f * z * Math.pow(x, 3)) *
      dt;
  }

  x += dx;
  y += dy;
  z += dz;

  // Store new positions and colors
  positions.push(x, y, z);
  colors.push(x / 30 + 0.5, y / 30 + 0.5, z / 30 + 0.5);

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

// Function to instantly draw attractor points
function instantDraw(name, times) {
  console.log(scene);
  for (let i = 0; i < times; i++) {
    attractor(name);
  }
}

function clearScene() {
  while (scene.children.length > 1) {
    const child = scene.children[scene.children.length - 1];
    scene.remove(child);
  }
}

// Initialize the scene
init();

// GUI
// -------------------

const gui = new GUI();
const params = {
  Lorenz: () => instantDraw("lorenz", 10000), // Draw 10,000 Lorenz attractor points
  Rossler: () => instantDraw("rossler", 10000), // Draw 10,000 Rossler attractor points
  Aizawa: () => instantDraw("aizawa", 10000), // Draw 10,000 Aizawa attractor points
  clear: () => {
    clearScene();
  },
};
const chaoticAttractors = gui.addFolder("Chaotic attractors");
chaoticAttractors.add(params, "Lorenz");
chaoticAttractors.add(params, "Rossler");
chaoticAttractors.add(params, "Aizawa");
chaoticAttractors.open();
gui.add(params, "clear");

// Simulation loop
function simulate() {
  // Render the scene
  drawGroup.add(camera);
  drawGroup.rotation.z -= 0.001;
  renderer.render(scene, camera);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  simulate();
}

// Init scene
instantDraw("lorenz", 10000);
// Start the animation
animate();
