import * as THREE from "three";

// Scene, camera, render
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Contenu de la scène

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// // 4. Create a geometry for the triangle
// let v1 = new THREE.Vector3(0, 0, 0);
// var v2 = new THREE.Vector3(0, 1, 0);
// var v3 = new THREE.Vector3(0, 0, 1);

// var geometry = new THREE.BufferGeometry().setFromPoints([v1, v2, v3]);

// // geometry.faces.push(new THREE.Face3(0, 1, 2)); // Create a face using the vertices

// const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
// const triangle = new THREE.Mesh(geometry, material);
// scene.add(triangle);

/* -------------------------- */

const points = [];
points.push(new THREE.Vector3(-1, 1, 0));
points.push(new THREE.Vector3(-1, 2, 0));

const geometry2 = new THREE.BufferGeometry().setFromPoints(points);

const line = new THREE.Line(geometry2, material);
scene.add(line);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
