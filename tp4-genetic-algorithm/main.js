import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "dat.gui";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.x = 16;
camera.position.z = 16;
camera.position.y = 12;

const colors = [];

const pointLight = new THREE.PointLight(0xff0000, 1, 10); // Red color, intensity 1, reach distance of 10 units
pointLight.position.set(0.1, 0, 15); // Light position
scene.add(pointLight);

let width = window.innerWidth;
let height = window.innerHeight;

let popSize = 400;
let generations = 200;
let mutationRate = 0.1;

let materialFacesColor = 0x0f0fff;
let targetValue = 0.5;

const chromosomeHTML = document.querySelector(".chromosome");
const fitnessHTML = document.querySelector(".fitness");
const targetValueHTML = document.querySelector(".target-value");

// GUI
const gui = new GUI();
const params = {
  color: 0x0f0fff,
  reload: () => reload(),
  popSize: 400,
  generations: 200,
  mutationRate: 0.1,
  targetValue: 0.5,
};
const fitnessLandscape = gui.addFolder("Fitness landscape");
fitnessLandscape.open();
gui.add(params, "reload");
fitnessLandscape
  .add(params, "popSize", 300, 2000, 50)
  .listen()
  .onChange(function (value) {
    popSize = value; // Update the variable when the GUI slider changes
  })
  .name("Population size");
fitnessLandscape
  .add(params, "generations", 100, 2000, 50)
  .listen()
  .onChange(function (value) {
    generations = value;
  })
  .name("Generations");
fitnessLandscape
  .add(params, "mutationRate", 0.1, 1, 0.1)
  .listen()
  .onChange(function (value) {
    mutationRate = value;
  })
  .name("Mutation rate");
fitnessLandscape
  .add(params, "targetValue", 0, 10, 0.5)
  .listen()
  .onChange(function (value) {
    targetValue = value;
    targetValueHTML.innerHTML = targetValue;
  })
  .name("Target value");
fitnessLandscape
  .addColor(params, "color")
  .onChange(function (newColor) {
    materialFacesColor = newColor;
  })
  .name("Color");

function clearScene() {
  while (scene.children.length > 0) {
    const child = scene.children[0];
    scene.remove(child);
  }
  // Réinitialiser les tableaux de données
  vertices.fill(0); // Réinitialiser les données de vertices
  colors.length = 0; // Réinitialiser le tableau de couleurs
}

function reload() {
  clearScene();
  targetValueHTML.innerHTML = targetValue;
  geneticAlgorithmWithAdaptiveLandscape(popSize, generations, mutationRate);
}

(function init() {
  window.addEventListener("resize", onResize, false);

  const renderer = initRenderer({
    antialias: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  // OrbitControls initialization
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.rotateSpeed = 0.5;

  render();

  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
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

const gridSize = 20; // Number of grid points per side
const vertices = new Float32Array(gridSize * gridSize * 3);

/**
 * Camera initialization function
 *
 * @param {THREE.Vector3} [initialPosition]
 */

function displayFitnessMap(population) {
  const gridStep = 1; // Spacing between grid points

  const geometry = new THREE.BufferGeometry();
  // const vertices = new Float32Array(gridSize * gridSize * 3);

  for (let i = 0, x = -gridSize / 2; i < gridSize; i++, x += gridStep) {
    for (let j = 0, z = -gridSize / 2; j < gridSize; j++, z += gridStep) {
      // Check if the index is valid before accessing the population element
      if (i * gridSize + j < population.length) {
        const fitness = population[i * gridSize + j].fitness;
        vertices[i * gridSize * 3 + j * 3] = x;
        vertices[i * gridSize * 3 + j * 3 + 1] += fitness * 2; // Use fitness for the Y component
        vertices[i * gridSize * 3 + j * 3 + 2] = z;
      }
    }
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

  const materialPoints = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.07,
  });
  materialPoints.side = THREE.DoubleSide; // to see the mesh from both ways
  const fitnessMap = new THREE.Points(geometry, materialPoints);
  fitnessMap.castShadow = true; // Enable shadow casting
  scene.add(fitnessMap);

  // Connect the points with lines
  // Create a lines geometry by connecting adjacent points in the grid
  const linesGeometry = new THREE.BufferGeometry();
  const linesVertices = [];

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const currentIndex = i * gridSize + j;
      const currentX = vertices[currentIndex * 3];
      const currentY = vertices[currentIndex * 3 + 1];
      const currentZ = vertices[currentIndex * 3 + 2];

      // Line to the right point (if available)
      if (j < gridSize - 1) {
        const rightIndex = i * gridSize + (j + 1);
        const rightX = vertices[rightIndex * 3];
        const rightY = vertices[rightIndex * 3 + 1];
        const rightZ = vertices[rightIndex * 3 + 2];

        linesVertices.push(currentX, currentY, currentZ);
        linesVertices.push(rightX, rightY, rightZ);
      }

      // Line to the bottom point (if available)
      if (i < gridSize - 1) {
        const bottomIndex = (i + 1) * gridSize + j;
        const bottomX = vertices[bottomIndex * 3];
        const bottomY = vertices[bottomIndex * 3 + 1];
        const bottomZ = vertices[bottomIndex * 3 + 2];

        linesVertices.push(currentX, currentY, currentZ);
        linesVertices.push(bottomX, bottomY, bottomZ);
      }
    }

    // Adding faces connecting the lines
    // Create geometry for faces between the lines
    const facesGeometry = new THREE.BufferGeometry();
    const facesVertices = [];

    for (let i = 0; i < gridSize - 1; i++) {
      for (let j = 0; j < gridSize - 1; j++) {
        const currentIndex = i * gridSize + j;
        const nextIndex = currentIndex + 1;
        const belowIndex = (i + 1) * gridSize + j;
        const belowNextIndex = belowIndex + 1;

        // Add the four corners of the square
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

        // First face of the square
        facesVertices.push(currentX, currentY, currentZ);
        facesVertices.push(nextX, nextY, nextZ);
        facesVertices.push(belowX, belowY, belowZ);

        // Second face of the square
        facesVertices.push(belowX, belowY, belowZ);
        facesVertices.push(nextX, nextY, nextZ);
        facesVertices.push(belowNextX, belowNextY, belowNextZ);

        colors.push(
          currentX / 30 + 0.5,
          currentY / 30 + 0.5,
          currentZ / 30 + 0.5
        );
      }
    }

    facesGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(facesVertices, 3)
    );

    const materialFaces = new THREE.PointsMaterial({
      color: materialFacesColor,
      size: 0.1,
    });

    materialFaces.side = THREE.DoubleSide; // to see the mesh from both ways
    const fitnessFaces = new THREE.Mesh(facesGeometry, materialFaces);
    fitnessFaces.receiveShadow = true; // Enable shadow reception
    scene.add(fitnessFaces);
  }

  linesGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(linesVertices, 3)
  );
  linesGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colors, 3)
  );

  const materialLines = new THREE.LineBasicMaterial({ vertexColors: true });
  materialLines.side = THREE.DoubleSide; // to see the mesh from both ways
  const fitnessLines = new THREE.LineSegments(linesGeometry, materialLines);
  scene.add(fitnessLines);
}

// Function to maximize (objective)
function fitnessFunction(x) {
  // Calculate the absolute difference between x and the target value
  const difference = Math.abs(x - targetValue);

  // Calculate the fitness score by inversing the difference (the smaller the difference, the higher the score)
  const fitnessScore = 1 / (1 + difference);

  return fitnessScore;
}

// Generate an initial population randomly
function generatePopulation(popSize) {
  const population = [];
  for (let i = 0; i < popSize; i++) {
    const individual = {
      chromosome: Math.random() * 10, // Random initial value within a range of 0 to 10
      fitness: 0,
    };
    population.push(individual);
  }
  return population;
}

// Evaluate the fitness of each individual in the population
function evaluatePopulation(population) {
  for (const individual of population) {
    individual.fitness = fitnessFunction(individual.chromosome);
  }
}

// Select individuals for reproduction (roulette wheel)
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

// Perform reproduction (crossover)
function crossover(parent1, parent2) {
  const crossoverPoint = Math.random(); // Crossover point between 0 and 1
  const child1 = {
    chromosome:
      parent1.chromosome * crossoverPoint +
      parent2.chromosome * (1 - crossoverPoint),
    fitness: fitnessFunction(),
  };
  const child2 = {
    chromosome:
      parent2.chromosome * crossoverPoint +
      parent1.chromosome * (1 - crossoverPoint),
    fitness: fitnessFunction(),
  };
  return [child1, child2];
}

// Apply random mutation to an individual
function mutate(individual, mutationRate) {
  if (Math.random() < mutationRate) {
    individual.chromosome = Math.random() * 10; // New random value
  }
}

// Main genetic algorithm with adaptive landscape display
function geneticAlgorithmWithAdaptiveLandscape(
  popSize,
  generations,
  mutationRate
) {
  let population = generatePopulation(popSize);
  const adaptiveLandscapeInterval = Math.floor(generations / 10); // Display adaptive landscape every 10 generations

  for (let gen = 0; gen < generations; gen++) {
    evaluatePopulation(population); // Update population fitness
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

    population = newPopulation; // let populations = newPopulation;

    if (gen % adaptiveLandscapeInterval === 0) {
      evaluatePopulation(population);
      displayFitnessMap(population);
    }
  }

  evaluatePopulation(population);

  // Return the best individual from the last generation
  const bestIndividual = population.reduce(
    (best, individual) =>
      individual.fitness > best.fitness ? individual : best,
    population[0]
  );

  chromosomeHTML.innerHTML = bestIndividual.chromosome.toFixed(3);
  fitnessHTML.innerHTML = bestIndividual.fitness.toFixed(3);
}

// Example of using the genetic algorithm with adaptive landscape display
geneticAlgorithmWithAdaptiveLandscape(popSize, generations, mutationRate);
targetValueHTML.innerHTML = targetValue;
