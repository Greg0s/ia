// constantes
const size = 30; //taille d'une cellule
const rowLength = 33; // nb de cellule par ligne

// variables
let generations = [];
let ruleset = [];

let currentGen = 0;
let yOffset = 0;

let ruleNb = 0;
let mode = "centered";

function setup() {
  // création du canva
  let width;
  width = Math.min(window.innerWidth, 1000);
  const canva = createCanvas(width, 600);
  canva.id("canva");

  frameRate(10);

  init();
  update();
}

function init() {
  // initialisation des variables
  generations = [];
  currentGen = 0;
  ruleNb = 0;
  yOffset = 0;
}

function update() {
  updateRule();
  updateState();
}

function updateRule() {
  // règle aléatoire
  randomRuleset();
  document.querySelector("h1").innerHTML = "Rule " + ruleNb; // règle aléatoire
}

function updateState() {
  // remplir la 1ère génération
  let generation = setInitialState(mode);
  generations.push(generation);
}

function generate() {
  init();
  update();
  draw();
}

function draw() {
  clear();

  // dessine les cases
  drawAllGen();

  // calcule la génération suivante
  calculateNextGen();
}

function randomRuleset() {
  // génère une règle aléatoire
  for (let i = 0; i < 8; i++) {
    if (Math.random() < 0.5) {
      ruleset[i] = 0;
    } else ruleset[i] = 1;

    ruleNb += ruleset[i] * Math.pow(2, i);
  }
}

function setInitialState(mode) {
  let generation = [];
  generation = Array(floor(width / size)).fill(0);

  // Place une cellule active au centre
  if (mode == "centered") {
    generation[floor(generation.length / 2)] = 1;
  } else if (mode == "random") {
    // Génère une ligne aléatoire
    for (let i = 0; i < generation.length; i++) {
      if (Math.random() < 0.5) {
        generation[i] = 0;
      } else generation[i] = 1;
    }
  }
  return generation;
}

function setMode() {
  const toggle = document.querySelector("input");
  if (toggle.checked) mode = "random";
  else {
    mode = "centered";
  }
  init();
  updateState();
  draw();
}

function drawAllGen() {
  // dessine la génération entière
  for (let i = 0; i <= currentGen; i++) {
    for (let j = 0; j < rowLength; j++) {
      if (generations[i][j] === 1) {
        noStroke();
        fill("#fae"); // remplit la cellule
        rect(j * size, i * size, size, size); // dessine la cellule
      }
    }
  }
}

function calculateNextGen() {
  let nextGeneration = [];
  let generation = generations[currentGen];

  for (let i = 0; i < generation.length; i++) {
    let left, current, right;

    // gestion des bords
    if (i === 0) {
      left = generation[generation.length - 1];
      right = generation[i + 1];
    } else if (i === generation.length - 1) {
      left = generation[i - 1];
      right = generation[0];
    } else {
      left = generation[i - 1];
      right = generation[i + 1];
    }

    current = generation[i];

    nextGeneration[i] = applyRule(left, current, right); // Applique la règle
  }
  currentGen++;

  generations[currentGen] = nextGeneration; // Met à jour la génération actuelle

  yOffset += size;
}

// Appliquer la règle
function applyRule(left, current, right) {
  let index = left * 4 + current * 2 + right * 1; // Convertit les valeurs en binaire
  return ruleset[index]; // Renvoie la valeur de la règle à l'index
}
