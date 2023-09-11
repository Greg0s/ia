let generations = [];
const size = 30; //taille d'une cellule
let ruleset = []; //regle 30
let rowsNb;
let currentGen = 0;
const rowLength = 33;
let yOffset = 0;
let ruleNb = 0;

function setup() {
  const canva = createCanvas(1000, 600);
  canva.id("canva");

  randomRuleset();

  //remplir la 1ere génération avec des cellules aléatoires
  let generation = [];
  generation = Array(floor(width / size)).fill(0);
  generation[floor(generation.length / 2)] = 1; // Place une cellule active au centre

  generations.push(generation);

  frameRate(10);

  document.querySelector("h1").innerHTML += "Rule " + ruleNb;
}

function draw() {
  background("#FFFFCC");

  // dessine les cases
  drawCurrentGen();

  // calcule la génération suivante
  calculateNextGen();
}

function randomRuleset() {
  for (let i = 0; i < 8; i++) {
    if (Math.random() < 0.5) {
      ruleset[i] = 0;
    } else ruleset[i] = 1;
    ruleNb += ruleset[i] * Math.pow(2, i);
  }
}

function drawCurrentGen() {
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
    let left = generation[i - 1];
    let me = generation[i];
    let right = generation[i + 1];
    nextGeneration[i] = applyRule(left, me, right); // Applique la règle 30
  }
  currentGen++;
  if (currentGen == 17) noLoop();

  generations[currentGen] = nextGeneration; // Met à jour la génération actuelle

  yOffset += size;
}

// Appliquer la règle 30
function applyRule(left, me, right) {
  let index = left * 4 + me * 2 + right * 1; // Convertit les valeurs en binaire
  return ruleset[index]; // Renvoie la valeur de la règle à l'index
}
