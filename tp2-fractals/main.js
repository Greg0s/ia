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

/* -- Ajout d'un cube test -- */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);
/* -------------------------- */

/* -- Ajout d'un cylindre -- */

const geometryC = new THREE.CylinderGeometry(1, 1, 1.5, 32);
const materialC = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const cylinder = new THREE.Mesh(geometryC, materialC);
//scene.add(cylinder);

/* -------------------------- */

const points = [];
points.push(new THREE.Vector3(-1, 1, 0));
points.push(new THREE.Vector3(-1, 2, 0));

const geometry2 = new THREE.BufferGeometry().setFromPoints(points);

const line = new THREE.Line(geometry2, material);
scene.add(line);

// Recursive function to create Pythagoras tree branches
function createPythagorasTree(x, y, length, angle, depth) {
  if (depth === 0) return;

  const endX = x + length * Math.cos(angle);
  const endY = y + length * Math.sin(angle);

  const points = [];
  points.push(new THREE.Vector3(x, y, 0));
  points.push(new THREE.Vector3(endX, endY, 0));

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });

  const line = new THREE.Line(geometry, material);
  scene.add(line);

  // Recursively create left and right branches
  const newLength = length * 0.7;
  createPythagorasTree(endX, endY, newLength, angle - Math.PI / 4, depth - 1);
  createPythagorasTree(endX, endY, newLength, angle + Math.PI / 4, depth - 1);
}

// Call the function to create the Pythagoras tree
createPythagorasTree(0, -5, 100, -Math.PI / 2, 7);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  cube.rotation.x += 0.01;
  cylinder.rotation.x += 0.01;
}

animate();
