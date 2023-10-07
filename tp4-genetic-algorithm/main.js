import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// const camera = initCamera();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 8;
camera.position.y = 5;

const pointLight = new THREE.PointLight(0xff0000, 1, 10); // Couleur rouge, intensité 1, distance d'atteinte de 10 unités
pointLight.position.set(0.1, 0, 15); // Position de la lumière
scene.add(pointLight);

(function init() {
  window.addEventListener("resize", onResize, false);
  const stats = initStats();

  const renderer = initRenderer({
    antialias: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  // Lights
  // let spotLight = new THREE.DirectionalLight();
  // spotLight.position.set(-20, 250, -50);
  // spotLight.target.position.set(30, -40, -20);
  // spotLight.intensity = 0.3;
  // scene.add(spotLight);

  let spotLight = new THREE.DirectionalLight();
  spotLight.position.set(-20, 250, -50);
  spotLight.target.position.set(30, -40, -20);
  spotLight.intensity = 0.3;

  // Activer la projection des ombres pour la lumière
  spotLight.castShadow = true;

  scene.add(spotLight);

  // Créez une lumière directionnelle avec des ombres
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(0, 10, 0); // Position de la lumière
  directionalLight.castShadow = true; // Activez la projection des ombres

  // Configurez les propriétés d'ombre
  directionalLight.shadow.mapSize.width = 1024; // Largeur de la carte d'ombres
  directionalLight.shadow.mapSize.height = 1024; // Hauteur de la carte d'ombres
  directionalLight.shadow.camera.near = 0.5; // Distance proche de la caméra d'ombres
  directionalLight.shadow.camera.far = 50; // Distance loin de la caméra d'ombres

  // Ajoutez la lumière à la scène
  scene.add(directionalLight);

  // OrbitControls initialization
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.rotateSpeed = 0.5;

  render();

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

function displayFitnessMap(population) {
  const gridSize = 10; // Nombre de points de la grille par côté
  const gridStep = 1; // Espacement entre les points de la grille

  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array(gridSize * gridSize * 3);

  for (let i = 0, x = -gridSize / 2; i < gridSize; i++, x += gridStep) {
    for (let j = 0, z = -gridSize / 2; j < gridSize; j++, z += gridStep) {
      // Vérifiez si l'index est valide avant d'accéder à l'élément de population
      if (i * gridSize + j < population.length) {
        // console.log(population[i * gridSize + j]);
        const fitness = population[i * gridSize + j].fitness * 0.15;
        vertices[i * gridSize * 3 + j * 3] = x;
        // console.log(fitness);
        vertices[i * gridSize * 3 + j * 3 + 1] = fitness; // Utilisez la fitness pour la composante Y
        vertices[i * gridSize * 3 + j * 3 + 2] = z;
      }
    }
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

  const materialPoints = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
  });
  materialPoints.side = THREE.DoubleSide; // to see the mesh from both ways
  const fitnessMap = new THREE.Points(geometry, materialPoints);
  fitnessMap.castShadow = true; // Activer la projection des ombres
  scene.add(fitnessMap);

  // Relie les points par des lignes
  // Créez une géométrie de lignes en reliant les points adjacents dans la grille
  const linesGeometry = new THREE.BufferGeometry();
  const linesVertices = [];

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const currentIndex = i * gridSize + j;
      const currentX = vertices[currentIndex * 3];
      const currentY = vertices[currentIndex * 3 + 1];
      const currentZ = vertices[currentIndex * 3 + 2];

      // Ligne vers le point à droite (si disponible)
      if (j < gridSize - 1) {
        const rightIndex = i * gridSize + (j + 1);
        const rightX = vertices[rightIndex * 3];
        const rightY = vertices[rightIndex * 3 + 1];
        const rightZ = vertices[rightIndex * 3 + 2];

        linesVertices.push(currentX, currentY, currentZ);
        linesVertices.push(rightX, rightY, rightZ);
      }

      // Ligne vers le point en bas (si disponible)
      if (i < gridSize - 1) {
        const bottomIndex = (i + 1) * gridSize + j;
        const bottomX = vertices[bottomIndex * 3];
        const bottomY = vertices[bottomIndex * 3 + 1];
        const bottomZ = vertices[bottomIndex * 3 + 2];

        linesVertices.push(currentX, currentY, currentZ);
        linesVertices.push(bottomX, bottomY, bottomZ);
      }
    }

    // Ajout des faces reliant les lignes
    // Créez une géométrie pour les faces entre les lignes
    const facesGeometry = new THREE.BufferGeometry();
    const facesVertices = [];

    for (let i = 0; i < gridSize - 1; i++) {
      for (let j = 0; j < gridSize - 1; j++) {
        const currentIndex = i * gridSize + j;
        const nextIndex = currentIndex + 1;
        const belowIndex = (i + 1) * gridSize + j;
        const belowNextIndex = belowIndex + 1;

        // Ajoutez les quatre coins du carré
        const currentX = vertices[currentIndex * 3];
        const currentY = vertices[currentIndex * 3 + 1];
        const currentZ = vertices[currentIndex * 3 + 2];

        const nextX = vertices[nextIndex * 3];
        const nextY = vertices[nextIndex * 3 + 1];
        const nextZ = vertices[nextIndex * 3 + 2];

        const belowX = vertices[belowIndex * 3];
        const belowY = vertices[belowIndex * 3 + 1];
        const belowZ = vertices[belowIndex * 3 + 2];

        const belowNextX = vertices[belowNextIndex * 3];
        const belowNextY = vertices[belowNextIndex * 3 + 1];
        const belowNextZ = vertices[belowNextIndex * 3 + 2];

        // Première face du carré
        facesVertices.push(currentX, currentY, currentZ);
        facesVertices.push(nextX, nextY, nextZ);
        facesVertices.push(belowX, belowY, belowZ);

        // Deuxième face du carré
        facesVertices.push(belowX, belowY, belowZ);
        facesVertices.push(nextX, nextY, nextZ);
        facesVertices.push(belowNextX, belowNextY, belowNextZ);
      }
    }

    facesGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(facesVertices, 3)
    );

    const materialFaces = new THREE.PointsMaterial({
      color: 0x0000ff,
      size: 0.1,
    });
    materialFaces.side = THREE.DoubleSide; // to see the mesh from both ways
    const fitnessFaces = new THREE.Mesh(facesGeometry, materialFaces);
    fitnessFaces.receiveShadow = true; // Activer la réception des ombres
    scene.add(fitnessFaces);
  }

  linesGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(linesVertices, 3)
  );

  const materialLines = new THREE.PointsMaterial({
    color: 0x00ff00,
    size: 0.1,
  });
  materialLines.side = THREE.DoubleSide; // to see the mesh from both ways
  const fitnessLines = new THREE.LineSegments(linesGeometry, materialLines);
  scene.add(fitnessLines);
}

// Fonction à maximiser (objectif)
function fitnessFunction(x) {
  return -x * x + 4 * x; // Exemple : maximiser f(x) = -x^2 + 4x
}

// Générer une population initiale de manière aléatoire
function generatePopulation(popSize) {
  const population = [];
  for (let i = 0; i < popSize; i++) {
    const individual = {
      chromosome: Math.random() * 10, // Valeur initiale aléatoire dans une plage de 0 à 10
      fitness: 0,
    };
    population.push(individual);
  }
  return population;
}

// Évaluer la fitness de chaque individu dans la population
function evaluatePopulation(population) {
  for (const individual of population) {
    individual.fitness = fitnessFunction(individual.chromosome);
    // console.log(individual.fitness);
  }
}

// Sélectionner les individus pour la reproduction (roue de la roulette)
function selectParents(population) {
  const totalFitness = population.reduce(
    (sum, individual) => sum + individual.fitness,
    0
  );
  const parents = [];
  for (let i = 0; i < population.length; i++) {
    const pick = Math.random() * totalFitness;
    let currentSum = 0;
    for (const individual of population) {
      currentSum += individual.fitness;
      if (currentSum >= pick) {
        parents.push(individual);
        break;
      }
    }
  }
  return parents;
}

// Effectuer la reproduction (croisement)
function crossover(parent1, parent2) {
  const crossoverPoint = Math.random(); // Point de croisement entre 0 et 1
  const child1 = {
    chromosome:
      parent1.chromosome * crossoverPoint +
      parent2.chromosome * (1 - crossoverPoint),
    fitness: 0,
  };
  const child2 = {
    chromosome:
      parent2.chromosome * crossoverPoint +
      parent1.chromosome * (1 - crossoverPoint),
    fitness: 0,
  };
  return [child1, child2];
}

// Appliquer une mutation aléatoire à un individu
function mutate(individual, mutationRate) {
  if (Math.random() < mutationRate) {
    individual.chromosome = Math.random() * 10; // Nouvelle valeur aléatoire
  }
}

// Algorithme génétique principal avec affichage du paysage adaptatif
function geneticAlgorithmWithAdaptiveLandscape(
  popSize,
  generations,
  mutationRate
) {
  let population = generatePopulation(popSize);
  const adaptiveLandscapeInterval = Math.floor(generations / 10); // Afficher le paysage adaptatif toutes les 10 générations

  for (let gen = 0; gen < generations; gen++) {
    evaluatePopulation(population); // Mettre à jour la fitness de la population
    const parents = selectParents(population);
    const newPopulation = [];

    while (newPopulation.length < popSize) {
      const [parent1, parent2] = [
        parents[Math.floor(Math.random() * parents.length)],
        parents[Math.floor(Math.random() * parents.length)],
      ];
      const [child1, child2] = crossover(parent1, parent2);
      mutate(child1, mutationRate);
      mutate(child2, mutationRate);
      newPopulation.push(child1, child2);
    }

    // MODIFS:
    //population = newPopulation;
    let populations = newPopulation;

    if (gen % adaptiveLandscapeInterval === 0) {
      displayFitnessMap(population);
    }
  }

  // console.log(population);

  // Retourner le meilleur individu de la dernière génération
  evaluatePopulation(population);
  const bestIndividual = population.reduce(
    (best, individual) =>
      individual.fitness > best.fitness ? individual : best,
    population[0]
  );
  return bestIndividual;
}

// Exemple d'utilisation de l'algorithme génétique avec affichage du paysage adaptatif
const bestSolution = geneticAlgorithmWithAdaptiveLandscape(100, 100, 0.1);
console.log("Meilleure solution trouvée :", bestSolution.chromosome);
console.log("Valeur de la fonction objectif :", bestSolution.fitness);
