import * as THREE from "three";
// Dependencies
import CameraControls from "camera-controls";
// Data

// -------------------
//  Scene and camera init
// -------------------

CameraControls.install({ THREE: THREE });

const scene = new THREE.Scene();
const clock = new THREE.Clock();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.x = 30;
camera.position.y = 15;
camera.position.z = 30;

// setSceneBackground();
const renderer = new THREE.WebGLRenderer();
const cameraControls = new CameraControls(camera, renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a parent group to hold the axes helpers and drawing group
const parentGroup = new THREE.Group();
scene.add(parentGroup);

// Create a group to hold your drawing
const drawingGroup = new THREE.Group();
parentGroup.add(drawingGroup);

// -------------------
//  Parameters and UI
// -------------------

//  Parameters
// -------------------

const lineGeometry = new THREE.BufferGeometry();

// Define parameters and initial conditions
const sigma = 10;
const rho = 28;
const beta = 8 / 3;
let x = 0.1;
let y = 0;
let z = 0;

// Arrays to store positions and colors of the lines
let dotPosition = [];
const positions = [];
const colors = [];
const size = [];

// Functions
// -------------------

function setSceneBackground() {
  scene.background = new THREE.Color(
    "hsl(" + Math.floor(Math.random() * 361) + ", 100%, 10%)"
  );
}

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// UI
// -------------------

// -------------------
//  Scene content
// -------------------

// Simulation loop
function simulate() {
  // Update variables using Lorenz attractor equations
  const dt = 0.01;
  const dx = sigma * (y - x) * dt;
  const dy = (x * (rho - z) - y) * dt;
  const dz = (x * y - beta * z) * dt;
  x += dx;
  y += dy;
  z += dz;

  // Store new positions and colors
  positions.push(x, y, z);
  dotPosition.push(x, y, z);
  colors.push(x / 30 + 0.5, y / 30 + 0.5, z / 30 + 0.5);
  size.push(10);

  lineGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  lineGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colors, 3)
  );

  // Render the scene
  drawingGroup.add(camera);
  // parentGroup.rotation.z -= 0.005;
  renderer.render(scene, camera);
  dotPosition = [];
  if (positions.length > 5000) {
    positions.splice(0, 3);
    colors.splice(0, 3);
  }
}

// -------------------
//  Render call
// -------------------

function animate() {
  const delta = clock.getDelta();
  cameraControls.update(delta);

  requestAnimationFrame(animate);
  simulate();

  renderer.render(scene, camera);
}

animate();
