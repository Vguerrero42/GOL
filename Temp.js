//   <h1>Game of Life</h1>
//   <table id="board"></table>

//   <div id="control_panel">
//     <button id="step_btn" class="button">
//       Step
//     </button>
//     <button id="play_btn" class="button">
//       Play
//     </button>
//     <button id="reset_btn" class="button">
//       Reset Random
//     </button>
//     <button id="clear_btn" class="button">
//       Clear
//     </button>
//     <h2 id="iterations" class="button"></h2>
//     <h2 id="cells_alive" class="button"></h2>
//   </div>

//   <footer>
//     <p>
//       Built by [me] at
//       <a href="http://www.fullstackacademy.com/">Fullstack Academy</a>
//     </p>
//   </footer>

// <h2 id="iterations" class="button"></h2>
// <h2 id="cells_alive" class="button"></h2>
document.getElementsByTagName("tbody")[0].addEventListener("change", () => {
  if (Number(generations.innerHTML) < limit) generations.innerHTML = gol.states;
  else {
    let alive = 0;
    cells.forEach(cell => {
      const cellValue = gol.getCell(td.dataset.row, td.dataset.col);
      if (cellValue == 1) {
        alive++;
      }
    });
    console.log("run");
    document.getElementById("cells_alive").innerHTML = alive;
  }
});
