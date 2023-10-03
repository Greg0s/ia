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
  const scene = new THREE.Scene();

  renderer.setSize(window.innerWidth, window.innerHeight);

  // Lights
  let spotLight = new THREE.DirectionalLight();
  spotLight.position.set(-20, 250, -50);
  spotLight.target.position.set(30, -40, -20);
  spotLight.intensity = 0.3;
  scene.add(spotLight);

  // OrbitControls initialization
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.rotateSpeed = 0.5;

  let step = 0;

  // Function to create the fitness landscape
  function fitnessLandscape(u, v, target) {
    // Utilisez votre algorithme génétique TSP ici pour calculer la fitness
    const scale = 200;
    const x = u * scale;
    const z = v * scale;
    const amplitude = 10;

    // Remplacez cette ligne par le calcul de fitness à partir de votre algorithme génétique
    const fitness = calculateTSPFitness(/* insérez les coordonnées ici */);

    target.set(x, fitness * amplitude, z);
  }

  let mesh = createMesh(
    new THREE.ParametricBufferGeometry(fitnessLandscape, 25, 25)
  );
  scene.add(mesh);

  render();

  function createMesh(geom) {
    geom.applyMatrix4(new THREE.Matrix4().makeTranslation(-12.5, 0, -12.5));
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
 * Camera initialization function
 *
 * @param {THREE.Vector3} [initialPosition]
 */
function initCamera(initialPosition) {
  const position =
    initialPosition !== undefined
      ? initialPosition
      : new THREE.Vector3(30, 60.0, 30);
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.copy(position);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  return camera;
}
