const ALIVE = require('./lib/status').ALIVE;
const DEAD = require('./lib/status').DEAD;
const Cell = require('./lib/cell');
const readline = require('readline');
const sha256 = require('sha256');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let gol = {};

function makeGrid() {
  gol.cells = [...new Array(30)]
    .map((d, y) => [...new Array(60)]
      .map((f, x) => new Cell(x, y, gol)));
}

function randomSeed() {
  for (let i = 0; i < 250; i++) {
    let rx = Math.floor(Math.random() * 60);
    let ry = Math.floor(Math.random() * 30);
    gol.cells[ry][rx].setState(ALIVE);
  }
}

function seedBoard(preseed) {
  let seed = preseed.split(" ");
  let i = 0;
  let x = 0;
  let y = 0;
  for (let coord of seed) {
    if (i % 2) {
      y = coord;
      gol.cells[y][x].setState(ALIVE);
    }
    else {
      x = coord;
    }
    i++;
  }
}

function generate(seed) {
  let hash = sha256(seed, { asBytes: true });
  for (let i = 0; i < seed.length * (1 / Math.sqrt(seed.length)) * 10; i++) {
    hash = hash.concat(sha256(seed + String(i), { asBytes: true }));
  }
  let scaled = hash.map((d, i) => Math.round(((i % 2) ? 29 : 59) * (d / 255)));
  let x = 0;
  let y = 0;
  scaled.map((d, i) => {
    if (i % 2) {
      y = d;
      gol.cells[y][x].setState(ALIVE);
    }
    else {
      x = d;
    }
  })
}

function set(data) {
  console.log(data);
  gol.cells[data[1]][data[0]].setState(data[2].toLowerCase() === "alive" ? ALIVE : DEAD);
}

function doTick() {
  gol.cells.map(d => d.map(e => e.checkForNeighbors()));
  gol.cells.map(d => d.map(e => e.update()));
  askQuestion();
}

function makeBoard() {
  let arrBoard = [];
  gol.cells.map(d => {
    d.map(e => {
      arrBoard.push(e.getState() === ALIVE ? "*" : "-")
    });
    arrBoard.push("\n");
  });
  return arrBoard.join("");
}

function askQuestion() {
  rl.question(makeBoard(), answer => {
    if (answer === "restart" || answer === "rs") {
      makeGrid();
      randomSeed();
      askQuestion();
    }
    else if (answer.split(":")[0] === "seed") {
      makeGrid();
      generate(answer.split(":")[1]);
      askQuestion();
    }
    else if (answer.split(":")[0] === "start") {
      makeGrid();
      seedBoard(answer.split(":")[1]);
      askQuestion();
    }
    else if (answer.split(":")[0] === "set") {
      set(answer.split(":")[1].split(" "));
      askQuestion();
    }  
    else {
      doTick();
    } 
  });
}

makeGrid();
randomSeed();
askQuestion();
