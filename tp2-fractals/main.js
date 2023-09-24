import * as THREE from "three";
import CameraControls from "camera-controls";

CameraControls.install({ THREE: THREE });

import { faces } from "./faces.js";

// const v0 = faces[0][1];
// console.log(typeof v0);

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

function drawAxis() {
  const axisLength = 15;

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

/* -- Triangle de Sierpiński -- */

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
  console.log(faces[0], typeof faces[0]);
  drawVertices(faces[0], 0xff0000);
  // drawVertices(faces[1], 0x00ff00);
  // drawVertices(faces[2], 0xffff00);
  // drawVertices(faces[3], 0xff00ff);
  // drawVertices(faces[4], 0x0000ff);
  // drawVertices(faces[5], 0x0000ff);
}

// drawTriangle();

// function midCoord(v) {
//   const mid0x = v[0] + 0.5 * (v[3] - v[0]);
//   const mid0y = v[1] + 0.5 * (v[4] - v[1]);
//   const mid0z = v[2] + 0.5 * (v[5] - v[2]);

//   return [mid0x, mid0y, mid0z];
// }

function midCoord(v0, v1) {
  const midx = v0[0] + 0.5 * (v1[0] - v0[0]);
  const midy = v0[1] + 0.5 * (v1[1] - v0[1]);
  const midz = v0[2] + 0.5 * (v1[2] - v0[2]);

  return [midx, midy, midz];
  // return new Float32Array([midx, midy, midz]);
}

// Recursive function to generate Sierpinski Triangle
function generateSierpinski(vertices, depth) {
  console.log(depth);
  if (depth === 0) {
    // On est arrivé à la limite définie, on dessine les triangles
    console.log("depth==0");
    console.log("verticessssssssss", vertices, typeof vertices);
    drawVertices(vertices, 0xffff00);
    // const geometry = new THREE.BufferGeometry();
    // geometry.setFromPoints(vertices);
    // const material = new THREE.LineBasicMaterial({ color: 0xffffff });
    // const line = new THREE.LineLoop(geometry, material);
    // scene.add(line);
  } else {
    // const v0 = new Float32Array([
    //   vertices[0][0],
    //   vertices[0][1],
    //   vertices[0][2],
    // ]);
    // const v1 = new Float32Array([
    //   vertices[0][3],
    //   vertices[0][4],
    //   vertices[0][5],
    // ]);
    // const v2 = new Float32Array([
    //   vertices[0][6],
    //   vertices[0][7],
    //   vertices[0][8],
    // ]);

    // const v0 = [vertices[0][0], vertices[0][1], vertices[0][2]];
    // const v1 = [vertices[0][3], vertices[0][4], vertices[0][5]];
    // const v2 = [vertices[0][6], vertices[0][7], vertices[0][8]];

    const v0 = [vertices[0], vertices[1], vertices[2]];
    const v1 = [vertices[3], vertices[4], vertices[5]];
    const v2 = [vertices[6], vertices[7], vertices[8]];

    // calcul des triangles enfants

    console.log("v0,v1,v2", v0, v1, v2);

    const mid1 = midCoord(v0, v1);
    const mid2 = midCoord(v1, v2);
    const mid3 = midCoord(v0, v2);

    console.log("mid1, 2, 3", mid1, mid2, mid3);

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
    console.log("vertice1", vertice1);
    generateSierpinski(vertice1, depth - 1);
    generateSierpinski(vertice2, depth - 1);
    generateSierpinski(vertice3, depth - 1);
  }
}

// Call the Sierpinski Triangle generation function
const depth = 6;
generateSierpinski(faces[0], depth);
generateSierpinski(faces[1], depth);
generateSierpinski(faces[2], depth);
generateSierpinski(faces[3], depth);

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

/*// Recursive function to generate Sierpinski Triangle
function generateSierpinski(vertices, depth) {
  if (depth === 0) {
    // On est arrivé à la limite définie, on dessine les triangles
    // const geometry = new THREE.BufferGeometry();
    // geometry.setFromPoints(vertices);
    // const material = new THREE.LineBasicMaterial({ color: 0xffffff });
    // const line = new THREE.LineLoop(geometry, material);
    // scene.add(line);

    drawVertices(vertices, 0xffff00);
  } else {
    const v0 = new Float32Array([
      vertices[0][0],
      vertices[0][1],
      vertices[0][2],
    ]);
    const v1 = vertices[1];
    const v2 = vertices[2];

    // calcul des triangles enfants

    const mid0 = midCoord(v0);
    // milieux des différents segments
    const mid0a = mid0[0];
    const mid0b = mid0[1];
    const mid0c = mid0[2];

    const mid1 = midCoord(v1);
    const mid1a = mid1[0];
    const mid1b = mid1[1];
    const mid1c = mid1[2];

    const mid2 = midCoord(v2);
    const mid2a = mid2[0];
    const mid2b = mid2[1];
    const mid2c = mid2[2];


    generateSierpinski([v0, mid0a, mid0c], depth - 1);
    generateSierpinski([mid0a, v1, mid0b], depth - 1);
    generateSierpinski([mid0c, mid0b, v2], depth - 1);
}*/
