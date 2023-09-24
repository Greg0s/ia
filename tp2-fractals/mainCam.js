import * as THREE from "three";
import CameraControls from "camera-controls";

CameraControls.install({ THREE: THREE });

import { faces } from "./faces.js";

// snip ( init three scene... )
const scene = new THREE.Scene();
const clock = new THREE.Clock();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
const cameraControls = new CameraControls(camera, renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Contenu de la scène

/* -- Ajout d'un cube test -- */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
material.side = THREE.DoubleSide;
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

function drawVertices(vertices, color) {
  const geometry = new THREE.BufferGeometry();

  // itemSize = 3 because there are 3 values (components) per vertex
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  const material = new THREE.MeshBasicMaterial({ color: color });
  material.side = THREE.DoubleSide;
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}

function drawTriangle() {
  // create a simple square shape. We duplicate the top left and bottom right
  // vertices because each vertex needs to appear once per triangle.
  drawVertices(faces[0], 0xff0000);
  drawVertices(faces[1], 0x00ff00);
  drawVertices(faces[2], 0xffff00);
  drawVertices(faces[3], 0xff00ff);
  drawVertices(faces[4], 0x0000ff);
  drawVertices(faces[5], 0x0000ff);
}

drawTriangle();

function drawAxis() {
  const axisLength = 5;

  for (let i = 0; i < 3; i++) {
    const points = [];
    points.push(new THREE.Vector3(0, 0, 0));

    if (i === 0) points.push(new THREE.Vector3(0, 0, axisLength));
    if (i === 1) points.push(new THREE.Vector3(0, axisLength, 0));
    if (i === 2) points.push(new THREE.Vector3(axisLength, 0, 0));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const line = new THREE.Line(geometry, material);
    scene.add(line);
  }
}

drawAxis();

(function anim() {
  // snip
  const delta = clock.getDelta();
  const hasControlsUpdated = cameraControls.update(delta);

  requestAnimationFrame(anim);

  // you can skip this condition to render though
  if (hasControlsUpdated) {
    renderer.render(scene, camera);
  }
})();
