import * as THREE from "three";

export const faces = [
  // face 1
  new Float32Array([
    0.0,
    0.0,
    2.0, // v0
    0.0,
    0.0,
    0.0, // v1
    1,
    2.0,
    1, // v2
  ]),
  // face 2
  new Float32Array([
    0.0,
    0.0,
    0.0, // v0
    2.0,
    0.0,
    0.0, // v1
    1,
    2.0,
    1, // v2
  ]),
  // face 3
  new Float32Array([
    2.0,
    0.0,
    0.0, // v0
    2.0,
    0.0,
    2.0, // v1
    1,
    2.0,
    1, // v2
  ]),
  // face 4
  new Float32Array([
    0.0,
    0.0,
    2.0, // v0
    2.0,
    0.0,
    2.0, // v1
    1,
    2.0,
    1, // v2
  ]),
  // base
  new Float32Array([
    0.0,
    0.0,
    0.0, // v0
    2.0,
    0.0,
    0.0, // v1
    0,
    0.0,
    2, // v2
  ]),
  // base
  new Float32Array([
    2.0,
    0.0,
    2.0, // v0
    2.0,
    0.0,
    0.0, // v1
    0,
    0.0,
    2, // v2
  ]),
];
