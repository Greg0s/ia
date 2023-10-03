// import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

(function init() {
  window.addEventListener("resize", onResize, false);
  const stats = initStats();

  const renderer = initRenderer({
    antialias: true,
  });

  const camera = initCamera();
  // camera.position.set(-20, 30, 20)
  // camera.lookAt(new THREE.Vector3(0,0,-35))

  const scene = new THREE.Scene();

  camera.position.set(40, 30.0, 40);
  camera.lookAt(0, 0, 0);

  renderer.setSize(window.innerWidth, window.innerHeight);

  // OrbitControls initialization
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.rotateSpeed = 0.5;

  let spotLight = new THREE.DirectionalLight();
  spotLight.position.set(-20, 250, -50);
  spotLight.target.position.set(30, -40, -20);
  spotLight.intensity = 0.3;
  scene.add(spotLight);

  let step = 0;

  function wave(u, v, target) {
    const r = 50;

    const x = Math.sin(u) * r;
    const z = Math.sin(v / 2) * 2 * r;
    const y = (Math.sin(u * 4 * Math.PI) + Math.cos(v * 2 * Math.PI)) * 2.8;

    // Modifier le paramètre 'target' au lieu de créer une nouvelle instance de Vector3
    target.set(x, y, z);
  }

  let radialWave;

  // Paramètres du paysage adaptatif
  const landscapeParams = {
    scale: 50,
    xOffset: 0,
    yOffset: 0,
    zOffset: 0,
    geneticFactor: 0.6, // Facteur génétique qui influence la forme du paysage
  };

  radialWave = function (u, v, target) {
    const { scale, xOffset, yOffset, zOffset, geneticFactor } = landscapeParams;

    const x = u * scale + xOffset;
    const z = v * scale + yOffset;

    // Fonction de fitness basée sur l'algorithme génétique (exemple simple)
    const geneticEffect =
      Math.sin(u * geneticFactor) * Math.cos(v * geneticFactor);

    const y = geneticEffect * 5 + Math.sin(x) * Math.cos(z) * 5; // Fonction d'élévation

    // Modifier le paramètre 'target' pour définir les coordonnées du point
    target.set(x, y, z);
  };

  let mesh = createMesh(new THREE.ParametricGeometry(radialWave, 25, 120));
  scene.add(mesh);

  render();

  function createMesh(geom) {
    geom.applyMatrix4(new THREE.Matrix4().makeTranslation(-25, 0, -25));
    const meshMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x550000,
      metalness: 0.5,
    });

    meshMaterial.side = THREE.DoubleSide;
    return new THREE.Mesh(geom, meshMaterial);
  }

  function render() {
    stats.update();
    // mesh.rotation.y = step += 0.01;
    // mesh.rotation.x = step;
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  function initStats() {
    var stats = new Stats();
    stats.setMode(0);

    document.getElementById("stats").appendChild(stats.domElement);
    return stats;
  }

  function onResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
})();

/**
 * Renderer initialization function
 *
 * @param Additional Properties to pass to renderer
 */
function initRenderer(additionalProperties) {
  const props =
    typeof additionalProperties !== "undefined" && additionalProperties
      ? additionalProperties
      : {};
  const renderer = new THREE.WebGLRenderer(props);

  renderer.setClearColor(new THREE.Color(0x000000));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.getElementById("output").appendChild(renderer.domElement);
  return renderer;
}

/**
 * Camera initialization functin
 *
 * @param {THREE.Vector3} [initialPosition]
 */
function initCamera(initialPosition) {
  const position =
    initialPosition !== undefined
      ? initialPosition
      : new THREE.Vector3(-30, 40, 30);
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.copy(position);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  camera.position.set(30, 60.0, 30);

  return camera;
}
