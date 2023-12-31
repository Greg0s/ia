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

// Fonction pour afficher le paysage adaptatif sur le canvas
function drawLandscape(population, canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  // Effacer le canvas
  ctx.clearRect(0, 0, width, height);

  // Dessiner la ligne de la fonction objectif
  ctx.strokeStyle = "blue";
  ctx.beginPath();
  ctx.moveTo(0, height);
  for (let x = 0; x < width; x++) {
    const y = height - fitnessFunction((x / width) * 10) * 20;
    ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Dessiner les individus de la population
  ctx.fillStyle = "red";
  for (const individual of population) {
    const x = (individual.chromosome / 10) * width;
    const y = height - (individual.fitness - -10) * (height / 20); // Modifier cette ligne
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Algorithme génétique principal avec affichage du paysage adaptatif
function geneticAlgorithmWithAdaptiveLandscape(
  popSize,
  generations,
  mutationRate,
  canvas
) {
  let population = generatePopulation(popSize);
  const adaptiveLandscapeInterval = Math.floor(generations / 10); // Afficher le paysage adaptatif toutes les 10 générations

  for (let gen = 0; gen < generations; gen++) {
    evaluatePopulation(population);
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

    population = newPopulation;

    if (gen % adaptiveLandscapeInterval === 0) {
      drawLandscape(population, canvas);
    }
  }

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
const canvas = document.getElementById("adaptive-landscape");
const bestSolution = geneticAlgorithmWithAdaptiveLandscape(
  100,
  100,
  0.1,
  canvas
);
console.log("Meilleure solution trouvée :", bestSolution.chromosome);
console.log("Valeur de la fonction objectif :", bestSolution.fitness);
