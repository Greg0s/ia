import * as THREE from "three";

export const faces = [
  // face 1
  [
    new THREE.Vector3(0, 0, 2),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(1, 2, 1),
  ],
  // face 2
  new Array([
    { x: 0.0, y: 0.0, z: 0.0 }, // v0
    { x: 2.0, y: 0.0, z: 0.0 }, // v1
    { x: 1.0, y: 2.0, z: 1.0 }, // v2
  ]),
  // face 3
  new Array([
    { x: 2.0, y: 0.0, z: 0.0 }, // v0
    { x: 2.0, y: 0.0, z: 2.0 }, // v1
    { x: 1.0, y: 2.0, z: 1.0 }, // v2
  ]),
  // face 4
  new Array([
    { x: 0.0, y: 0.0, z: 2.0 }, // v0
    { x: 2.0, y: 0.0, z: 2.0 }, // v1
    { x: 1.0, y: 2.0, z: 1.0 }, // v2
  ]),
  // base
  new Array([
    { x: 0.0, y: 0.0, z: 0.0 }, // v0
    { x: 2.0, y: 0.0, z: 0.0 }, // v1
    { x: 0.0, y: 0.0, z: 2.0 }, // v2
  ]),
  // base
  new Array([
    { x: 2.0, y: 0.0, z: 2.0 }, // v0
    { x: 2.0, y: 0.0, z: 0.0 }, // v1
    { x: 0.0, y: 0.0, z: 2.0 }, // v2
  ]),
];

/*

    // triangle initial
    // face 1
    const v0 = new THREE.Vector3(0, 0, 2);
    const v1 = new THREE.Vector3(0, 0, 0);
    const v2 = new THREE.Vector3(1, 2, 1);
    // face 2
    const v3 = new THREE.Vector3(0, 0, 0);
    const v4 = new THREE.Vector3(2, 0, 0);
    const v5 = new THREE.Vector3(1, 2, 1);
    // face 3
    const v6 = new THREE.Vector3(2, 0, 0);
    const v7 = new THREE.Vector3(2, 0, 2);
    const v8 = new THREE.Vector3(1, 2, 1);
    // face 4
    const v9 = new THREE.Vector3(0, 0, 2);
    const v10 = new THREE.Vector3(2, 0, 2);
    const v11 = new THREE.Vector3(1, 2, 1);

    */
