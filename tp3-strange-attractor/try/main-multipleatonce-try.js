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

// init function

function init() {
  // Create a line segments object
  lorenz = new THREE.Line(lorenzGeometry, lineMaterial);
  rossler = new THREE.Line(rosslerGeometry, lineMaterial);
  console.log(lorenz.name);

  // init var

  positions = [];
  colors = [];
  size = [];

  // Add the lines to the scene
  scene.add(lorenz);
  scene.add(rossler);
}

function useNewParams() {
  // Clear the scene
  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }

  // Reinitialize the scene (you may want to call init() again here)
  init();
}

// UI
// -------------------

const gui = new GUI();
const params = {
  useNewParams: () => useNewParams(),
  Set_to_two: () => setDepth(2),
  Set_to_three: () => setDepth(3),
  Set_to_four: () => setDepth(4),
  Set_to_five: () => setDepth(5),
  Set_to_six: () => setDepth(6),
  Change_colors: () => changeColors(depth),
};
const depthFolder = gui.addFolder("Depth");
depthFolder.add(params, "useNewParams");
depthFolder.add(params, "Set_to_two");
depthFolder.add(params, "Set_to_three");
depthFolder.add(params, "Set_to_four");
depthFolder.add(params, "Set_to_five");
depthFolder.add(params, "Set_to_six");
depthFolder.open();
gui.add(params, "Change_colors");

// OrbitControls init
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Activer l'amortissement pour une rotation douce
controls.dampingFactor = 0.1; // Paramètre d'amortissement (ajustez selon vos préférences)
controls.rotateSpeed = 0.5; // Vitesse de rotation (ajustez selon vos préférences)

// Create a parent group to hold the drawings
const parentGroup = new THREE.Group();
scene.add(parentGroup);

// Create a group to hold your drawing
const lorenzGroup = new THREE.Group();
parentGroup.add(lorenzGroup);

// Create geometry and material for the lines
const lorenzGeometry = new THREE.BufferGeometry();
const rosslerGeometry = new THREE.BufferGeometry();

lorenzGeometry.setN;

const lineMaterial = new THREE.LineBasicMaterial({ vertexColors: true });
let lorenz;
let rossler;

// Define parameters and initial conditions
const alpha = 10;
const beta = 28;
const gamma = 8 / 3;
let x = 0.1;
let y = 0;
let z = 0;
let startTime;
let timer;

// Arrays to store positions and colors of the lines
let positions = [];
let colors = [];
let size = [];

// Timer

function startTimer() {
  startTime = new Date().getTime(); // Record the start time
  setInterval(updateTimer, 1000); // Update the timer every 1 second (1000 milliseconds)
}

startTimer();

function updateTimer() {
  const currentTime = new Date().getTime(); // Get the current time in milliseconds
  timer = (currentTime - startTime) / 1000; // Calculate elapsed time in seconds
  //   console.log(`Time since page load: ${timer.toFixed(1)} seconds`);
}

function attractor(geometry, a, b, c) {
  let dt;
  let dx;
  let dy;
  let dz;
  if (geometry.name == "lorenz") {
    dt = 0.01;
    dx = a * (y - x) * dt;
    dy = (x * (b - z) - y) * dt;
    dz = (x * y - c * z) * dt;
  } else if (geometry.name == "rossler") {
    dt = 0.01;
    dx = (-y - z) * dt;
    dy = (x + a * y) * dt;
    dz = (b + z * (x - c)) * dt;
  } else if (geometry.name == "aizawa") {
    dt = 0.01;
    dx = (-y - z) * dt;
    dy = (x + a * y) * dt;
    dz = (b + z * (x - c)) * dt;
  }

  x += dx;
  y += dy;
  z += dz;

  // Store new positions and colors
  positions.push(x, y, z);
  colors.push(x / 30 + 0.5, y / 30 + 0.5, z / 30 + 0.5);
  size.push(10);

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
}

function instantDraw(times) {
  console.log(lorenzGeometry);
  for (let i = 0; i < times; i++) {
    attractor(lorenzGeometry, alpha, beta, gamma);
    attractor(rosslerGeometry, 0.2, 0.2, 5.7);
  }
}

instantDraw(10000);

// Simulation loop
function simulate() {
  updateTimer();

  //   lorenz(alpha, beta, gamma);
  //   duffing(0.25, 0.3, 1);

  // Render the scene
  lorenzGroup.add(camera);
  parentGroup.rotation.z -= 0.001;
  renderer.render(scene, camera);
}

// Render the scene
function animate() {
  requestAnimationFrame(animate);
  simulate();
}

init();
animate();
