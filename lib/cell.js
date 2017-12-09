const ALIVE = require('./status').ALIVE;
const DEAD = require('./status').DEAD;

module.exports = class Cell {
  constructor(x, y, gol) {
    this.x = x;
    this.y = y;
    this.gol = gol;
    this.state = DEAD;
    this.willDie = false;
    this.willLive = false;
  }

  setState(state) {
    this.state = state;
  }

  getState() {
    return this.state;
  }

  checkForNeighbors() {
    let numNeighbors = 0;
    const y = this.y;
    const x = this.x;
    if (this.gol.cells[y + 1]) {
      if (this.gol.cells[y + 1][x - 1]) {
        if (this.gol.cells[y + 1][x - 1].getState() == ALIVE) numNeighbors++;
      }
      if (this.gol.cells[y + 1][x]) {
        if (this.gol.cells[y + 1][x].getState() == ALIVE) numNeighbors++;
      }
      if (this.gol.cells[y + 1][x + 1]) {
        if (this.gol.cells[y + 1][x + 1].getState() == ALIVE) numNeighbors++;
      }
    }  
    if (this.gol.cells[y][x - 1]) {
      if (this.gol.cells[y][x - 1].getState() == ALIVE) numNeighbors++;
    }
    if (this.gol.cells[y][x + 1]) {
      if (this.gol.cells[y][x + 1].getState() == ALIVE) numNeighbors++;
    }
    if (this.gol.cells[y - 1]) {
      if (this.gol.cells[y - 1][x - 1]) {
        if (this.gol.cells[y - 1][x - 1].getState() == ALIVE) numNeighbors++;
      }
      if (this.gol.cells[y - 1][x]) {
        if (this.gol.cells[y - 1][x].getState() == ALIVE) numNeighbors++;
      }
      if (this.gol.cells[y - 1][x + 1]) {
        if (this.gol.cells[y - 1][x + 1].getState() == ALIVE) numNeighbors++;
      }
    }  
    if (this.state === ALIVE) {
      if (numNeighbors < 2) this.willDie = true;
      if (numNeighbors > 3) this.willDie = true;
    }
    if (this.state === DEAD) {
      if (numNeighbors === 3) this.willLive = true;
    }
  }

  update() {
    if (this.willDie) {
      this.setState(DEAD);
    }
    if (this.willLive) {
      this.setState(ALIVE);
    }
    this.willDie = false;
    this.willLive = false;
  }
}