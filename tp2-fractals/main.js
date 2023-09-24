import * as THREE from "three";
// Dependencies
import CameraControls from "camera-controls";
import { GUI } from "dat.gui";
// Data
import { faces } from "./faces.js";

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

setSceneBackground();
const renderer = new THREE.WebGLRenderer();
const cameraControls = new CameraControls(camera, renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// -------------------
//  Parameters and UI
// -------------------

//  Parameters
// -------------------

let depth = 3;

// Functions
// -------------------

function setSceneBackground() {
  scene.background = new THREE.Color(
    "hsl(" + Math.floor(Math.random() * 361) + ", 100%, 10%)"
  );
}

function changeColors() {
  refresh();
  setSceneBackground();
}

function refresh() {
  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }
  generate3dSierpinski();
}

function setDepth(newDepth) {
  depth = newDepth;
  refresh();
}

// UI
// -------------------

const gui = new GUI();
const params = {
  Set_to_one: () => setDepth(1),
  Set_to_two: () => setDepth(2),
  Set_to_three: () => setDepth(3),
  Set_to_four: () => setDepth(4),
  Set_to_five: () => setDepth(5),
  Set_to_six: () => setDepth(6),
  Change_colors: () => changeColors(depth),
};
const depthFolder = gui.addFolder("Depth");
depthFolder.add(params, "Set_to_one");
depthFolder.add(params, "Set_to_two");
depthFolder.add(params, "Set_to_three");
depthFolder.add(params, "Set_to_four");
depthFolder.add(params, "Set_to_five");
depthFolder.add(params, "Set_to_six");
depthFolder.open();
gui.add(params, "Change_colors");

// -------------------
//  Scene content
// -------------------

// Sierpiński triangle
// -------------------

function drawVertices(vertices, color) {
  const geometry = new THREE.BufferGeometry();
  const itemSize = 3; // as a vertex has 3 values
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(vertices, itemSize)
  );

  const material = new THREE.MeshBasicMaterial({ color: color });
  material.side = THREE.DoubleSide; // to see the mesh from both ways
  const mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);
}

// Calculate the mid coordinate between 2 vertex
function midCoord(v0, v1) {
  const midx = v0[0] + 0.5 * (v1[0] - v0[0]);
  const midy = v0[1] + 0.5 * (v1[1] - v0[1]);
  const midz = v0[2] + 0.5 * (v1[2] - v0[2]);

  return [midx, midy, midz];
}

function getRandomColor() {
  return new THREE.Color(Math.random(), Math.random(), Math.random());
}

// Recursive function to generate Sierpinski Triangle
function generateSierpinski(vertices, depth) {
  if (depth === 0) {
    // We arrived to the defined depth, we can draw the triangles
    drawVertices(vertices, getRandomColor());
  } else {
    const v0 = [vertices[0], vertices[1], vertices[2]];
    const v1 = [vertices[3], vertices[4], vertices[5]];
    const v2 = [vertices[6], vertices[7], vertices[8]];

    // Calculating child triangles

    const mid1 = midCoord(v0, v1);
    const mid2 = midCoord(v1, v2);
    const mid3 = midCoord(v0, v2);

    const vertice1 = new Float32Array([
      v0[0],
      v0[1],
      v0[2],
      mid1[0],
      mid1[1],
      mid1[2],
      mid3[0],
      mid3[1],
      mid3[2],
    ]);
    const vertice2 = new Float32Array([
      mid1[0],
      mid1[1],
      mid1[2],
      v1[0],
      v1[1],
      v1[2],
      mid2[0],
      mid2[1],
      mid2[2],
    ]);
    const vertice3 = new Float32Array([
      mid3[0],
      mid3[1],
      mid3[2],
      mid2[0],
      mid2[1],
      mid2[2],
      v2[0],
      v2[1],
      v2[2],
    ]);

    // Recurscive call
    generateSierpinski(vertice1, depth - 1);
    generateSierpinski(vertice2, depth - 1);
    generateSierpinski(vertice3, depth - 1);
  }
}

function generate3dSierpinski() {
  // Draw all faces of the 3D triangle
  for (let i = 0; i < 6; i++) {
    generateSierpinski(faces[i], depth);
  }
}

generate3dSierpinski();

// -------------------
//  Render call
// -------------------

(function anim() {
  const delta = clock.getDelta();
  const hasControlsUpdated = cameraControls.update(delta);

  requestAnimationFrame(anim);

  renderer.render(scene, camera);
})();
