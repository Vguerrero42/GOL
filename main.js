const width = 25;
const height = 25;
const limit = 3000;
let iterations = 30; //actually the value - 1, subtracts 2 initially :(
let started = false;

let initPop;
let stateNum = (Number(localStorage.getItem("lastState")) || 0) + 1;

if (stateNum > iterations) {
  if (localStorage.getItem(`alldata${width}x${height}`)) {
    alert("DATA FOR BOARD EXISTS");
  } else {
    stateNum = 1;
  }
}

// Create Game of Life instance
// const control = JSON.parse(localStorage.getItem(`run15`));
// const test = control.start;
const gol = new GameOfLife(width, height, limit);

// Actual table cells
const cells = [];

const generations = document.getElementById("generations");
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

const check = () =>{
  if (alive > peak && gol.currentState !== 0) {
    peak = alive;
    peakState = gol.currentState;
  }
  if (alive < lowest) {
    lowest = alive;
    lowestState = gol.currentState;
  }
}
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
  check()
};
//RESET POP NUMBER AFTER CLEAR
let pop = () => {
  let ratio = (1 / (width + height)) * 200;
  let weight = ratio / ratio - 1;
  if (ratio < 2) {
    ratio = 2;
  }
  initPop = Math.round((width * height) / ratio + weight);
};
//GIVE INITPOP A VALUE
pop();

//Keep tracking of last 10 gens. to prevent infinite loop
const trackLastTen = state => {
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
  if (previous.length < 10) {
    previous.push(state);
  } else {
    previous.shift();
    previous.push(state);
  }
};

let interval = null;

//update data after every state
const update = () => {
  check()
  generations.innerHTML = `Generation : ${gol.currentState}`;
  gol.cellsAlive = alive;
  cellsAlive.innerHTML = `Population : ${alive}`;
};

//
const singleStep = () => {
  allStates.push({
    state: gol.currentState,
    alive
  });
  trackLastTen(gol.board);
  update();
  gol.tick();
  paint();
};

const run = () => {
  if (!interval) {
    interval = setInterval(() => {
      if (gol.currentState >= gol.limit || stagnateGen) {
        run();
      } else {
        allStates.push({
          state: gol.currentState,
          alive
        });
        trackLastTen(gol.board);
        update();
        gol.tick();
        paint();
      }
    }, 10);
  } else {
    clearInterval(interval);
    interval = null;
    if (gol.currentState === gol.limit || stagnateGen)
      if (!localStorage.getItem(`run${stateNum}`)) {
        let total = 0;
        allStates.forEach(state => {
          total += state.alive;
        });
        let average = total / allStates.length;

        localStorage.setItem(
          `run${stateNum}`,
          JSON.stringify({
            start: initial,
            final: gol.board,
            peak,
            peakState,
            lowest,
            lowestState,
            average,
            allStates,
            alive,
            stagnateGen
          })
        );
        localStorage.setItem("lastState", `${stateNum}`);
        stateNum++;
        if (iterations > 0) {
          iterations--;
          console.log("RUNS:", iterations);
          clear();
          reset();
          run();
        } else {
          let n = localStorage.getItem("lastState");
          let alldata = [];
          for (let i = 1; i < n; i++) {
            let iteration = JSON.parse(localStorage.getItem(`run${i}`));
            let gen = `iteration${i}`;
            alldata.push({ [gen]: iteration });
          }
          // localStorage.setItem(
          //   `alldata${height}x${width}`,
          //   JSON.stringify(alldata)
          // );
          console.log(`alldata${height}x${width}:`, alldata);
        }
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
    started = false;
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

document.getElementById("play_btn").addEventListener("click", () => {
  if (!started) {
    iterations--;
  }
  run();
});

// INITIALIZE RANDOM
document.getElementById("reset_btn").addEventListener("click", () => reset());

document.getElementById("clear_btn").addEventListener("click", () => clear());

// document.getElementById("skip").addEventListener("click", () => {
//   gol.currentState = limit;
// });
// document.getElementById("submit").addEventListener("click", () => {
//   gol.height = document.getElementById("height").nodeValue;
//   gol.width = document.getElementById("width").nodeValue;
//   console.log(gol.height, gol.width);
// });
// ]
