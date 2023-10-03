// import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Définir les villes à visiter (chaque ville a des coordonnées x, y)
const cities = [
  { x: 10, y: 20 },
  { x: 50, y: 30 },
  { x: 40, y: 80 },
  // Ajoutez d'autres villes ici
];

const populationSize = 100;
const mutationRate = 0.01;

// Fonction pour calculer la distance entre deux villes
function distance(city1, city2) {
  const dx = city1.x - city2.x;
  const dy = city1.y - city2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Fonction pour calculer la fitness d'une séquence (chemin) donnée
function calculateFitness(sequence) {
  let totalDistance = 0;
  for (let i = 0; i < sequence.length - 1; i++) {
    totalDistance += distance(cities[sequence[i]], cities[sequence[i + 1]]);
  }
  return 1 / totalDistance;
}

// Fonction pour créer une séquence aléatoire de villes
function createRandomSequence() {
  const sequence = [...Array(cities.length).keys()];
  for (let i = sequence.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [sequence[i], sequence[j]] = [sequence[j], sequence[i]];
  }
  return sequence;
}

// Fonction pour effectuer le croisement (crossover) entre deux séquences
function crossover(parent1, parent2) {
  const start = Math.floor(Math.random() * parent1.length);
  const end = Math.floor(Math.random() * (parent1.length - start)) + start;

  const child = Array(parent1.length).fill(null);
  for (let i = start; i <= end; i++) {
    child[i] = parent1[i];
  }

  let currentIndex = 0;
  for (let i = 0; i < parent2.length; i++) {
    if (!child.includes(parent2[i])) {
      while (child[currentIndex] !== null) {
        currentIndex++;
      }
      child[currentIndex] = parent2[i];
    }
  }

  return child;
}

// Fonction pour effectuer la mutation d'une séquence
function mutate(sequence) {
  if (Math.random() < mutationRate) {
    const index1 = Math.floor(Math.random() * sequence.length);
    const index2 = Math.floor(Math.random() * sequence.length);
    [sequence[index1], sequence[index2]] = [sequence[index2], sequence[index1]];
  }
}

// Fonction pour sélectionner les meilleurs individus de la population
function selectBest(population, numSelect) {
  return population
    .map((sequence) => ({ sequence, fitness: calculateFitness(sequence) }))
    .sort((a, b) => b.fitness - a.fitness)
    .slice(0, numSelect)
    .map((individual) => individual.sequence);
}

// Générer une population initiale aléatoire
let population = Array.from({ length: populationSize }, createRandomSequence);

// Reste du code (comme dans votre exemple précédent)

// Fonction pour calculer la fitness TSP basée sur une séquence donnée
function calculateTSPFitness(sequence) {
  let totalDistance = 0;
  for (let i = 0; i < sequence.length - 1; i++) {
    const city1 = cities[sequence[i]];
    const city2 = cities[sequence[i + 1]];
    totalDistance += distance(city1, city2);
  }
  // Pour résoudre le TSP, la fitness doit être inversée
  return 1 / totalDistance;
}

// Fonction principale de l'algorithme génétique TSP
function runTSPGeneticAlgorithm() {
  let generations = 0;
  const maxGenerations = 50;
  while (generations < maxGenerations) {
    // Sélectionner les meilleurs individus
    const numSelect = 2;
    const selected = selectBest(population, numSelect);

    // Générer de nouveaux individus par croisement
    const children = [];
    while (children.length < populationSize - numSelect) {
      const parent1 = selected[Math.floor(Math.random() * selected.length)];
      const parent2 = selected[Math.floor(Math.random() * selected.length)];
      const child = crossover(parent1, parent2);
      mutate(child); // Appliquer une mutation
      children.push(child);
    }

    // Remplacer l'ancienne population par les nouveaux individus
    population = [...selected, ...children];

    generations++;
  }
  const bestSequence = selectBest(population, 1)[0];
  console.log("Meilleure séquence trouvée :", bestSequence);
  // Reste du code pour afficher la fitness map en 3D
}

// Appeler la fonction principale de l'algorithme génétique TSP
runTSPGeneticAlgorithm();
