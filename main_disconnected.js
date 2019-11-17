const fs = require("fs");
const { GameOfLife } = require("./GameOfLife");

const width = 80;
const height = 60;
const limit = 1000;

let initPop;
// let stateNum = (Number(localStorage.getItem("lastState")) || 0) + 1;
// Create Game of Life instance
// const control = JSON.parse(localStorage.getItem(`run15`));
// const test = control.start;
const gol = new GameOfLife(width, height, limit);

// Actual table cells
const cells = [];

const generations = document.getElementById("iterations");
const cellsAlive = document.getElementById("cells_alive");

let alive; // cells alive at each state
let peak = 0; //peak pop.
let peakState = 0; // state where peak occured
let lowest = width * height; // lowest population
let lowestState = 0;
let initial = null;
let allStates = []; //all generations for 1 iteration
let previous = []; //used to track last 3 generations
let stagnateGen; //gen where pop began loop

// Create Table
const table = document.createElement("tbody");
for (let h = 0; h < height; h++) {
  const tr = document.createElement("tr");
  for (let w = 0; w < width; w++) {
    const td = document.createElement("td");
    td.dataset.row = h;
    td.dataset.col = w;
    cells.push(td);
    tr.append(td);
  }
  table.append(tr);
}
document.getElementById("board").append(table);

const paint = () => {
  alive = 0;
  cells.forEach(td => {
    const cellValue = gol.getCell(td.dataset.row, td.dataset.col);
    if (cellValue === 1) {
      alive++;
      td.classList.add("alive");
    } else {
      td.classList.remove("alive");
    }
  });
  if (alive > peak && gol.currentState !== 0) {
    peak = alive;
    peakState = gol.currentState;
  }
  if (alive < lowest) {
    lowest = alive;
    lowestState = gol.currentState;
  }
};

//RESET POP NUMBER AFTER CLEAR
let pop = () => {
  initPop = Math.round((width * height) / 2);
};
//GIVE INITPOP A VALUE
pop();

//Keep tracking of last 3 gens. to prevent infinite loop
const trackLastThree = state => {
  state = JSON.stringify(state);
  if (previous.includes(state)) {
    previous.forEach(e => {
      if (e === state) {
        stagnateGen = gol.currentState;
      }
    });
    console.log("HIT", stagnateGen);
    run();
  }
  if (previous.length < 3) {
    previous.push(state);
  } else {
    previous.shift();
    previous.push(state);
  }
};

let interval = null;

//update data after every state
const update = () => {
  if (alive > peak && gol.currentState !== 0) {
    peak = alive;
    peakState = gol.currentState;
  }
  if (alive < lowest) {
    lowest = alive;
    lowestState = gol.currentState;
  }
  generations.innerHTML = gol.currentState;
  gol.cellsAlive = alive;
  cellsAlive.innerHTML = gol.cellsAlive;
};

//
const singleStep = () => {
  allStates.push({
    state: gol.currentState,
    alive
  });
  trackLastThree(gol.board);
  update();
  gol.tick();
  paint();
};

const run = () => {
  if (!interval) {
    interval = setInterval(() => {
      if (gol.currentState >= gol.limit) {
        run();
      } else {
        allStates.push({
          state: gol.currentState,
          alive
        });
        trackLastThree(gol.board);
        update();
        gol.tick();
        paint();
      }
    }, 10);
  } else {
    clearInterval(interval);
    interval = null;
    if (gol.currentState === gol.limit || stagnateGen)
      if (truth) {
        let total = 0;
        allStates.forEach(state => {
          total += state.alive;
        });
        let average = total / allStates.length;
        let obj = JSON.stringify({
          start: initial,
          final: gol.board,
          peak,
          peakState,
          lowest,
          lowestState,
          average,
          allStates,
          alive,
          stagnateGen,
          height,
          width
        });
        fs.appendFile("data.json", obj, err => {
          if (err) throw err;
          console.log("WROTE");
        });
        stateNum++;
        console.log("NUM OF GENERATIONS", allStates.length);
      } else {
        alert("ADJUST FINAL STATENUM");
      }
  }
};

const popTopHalf = () => {
  let firstHalf = initPop / 2;
  gol.forEachCell((row, col) => {
    if (initPop > firstHalf) {
      let val = Math.round(Math.random());
      if (val === 1) {
        initPop--;
      }
      gol.setCell(val || 0, row, col);
    }
  });
};

const popLowerHalf = () => {
  gol.revForEachCell((row, col) => {
    if (initPop > 0) {
      let val = Math.round(Math.random());
      if (val === 1) {
        initPop--;
      }
      gol.setCell(val, row, col);
    }
  });
};

const reset = () => {
  if (initial === null) {
    popTopHalf();
    popLowerHalf();
    paint();
    initial = gol.board;
    if (stagnateGen) {
      stagnateGen = null;
    }
  } else {
    gol.board = gol.makeBoard();
    gol.currentState = 0;
    pop();
    // console.log(gol.board);
    initial = null;
    // console.log(initial);
    allstates = [];
    reset();
  }
};

// MIGHT NOT REALLY NEED
const clear = () => {
  gol.forEachCell((row, col) => {
    gol.setCell(0, row, col);
  });
  reset();
};

//EVENT LISTENERS
document
  .getElementById("step_btn")
  .addEventListener("click", () => singleStep());

document.getElementById("play_btn").addEventListener("click", () => run());

// INITIALIZE RANDOM
document.getElementById("reset_btn").addEventListener("click", () => reset());

document.getElementById("clear_btn").addEventListener("click", () => clear());
