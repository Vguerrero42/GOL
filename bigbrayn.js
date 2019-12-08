// // const brain = require("brain.js");

// const trainingData = [];
// // n = number of sets of starting states and ending states

// let n = localStorage.getItem("lastState");

// const train = () => {
//   for (let i = 0; i < n; i++) {
//     let iteration = JSON.parse(localStorage.getItem(`run${n}`));
//     let {
//       firstState,
//       finalState,
//       alive,
//       height,
//       width,
//       average,
//       stagGen,
//       allStates
//     } = iteration;
//     let maxPossible = height * width;
//     // console.log(maxPossible / allStates.length);
//     // console.log(average);

//     if (average > maxPossible / 4) {
//       trainingData.push({
//         input: [height, width],
//         output: firstState
//       });
//     }
//   }
// };

// train();
// console.log(trainingData);
// let alldata = [];
// for (let i = 0; i < n; i++) {
//   let iteration = JSON.parse(localStorage.getItem(`run${n}`));
//   alldata.push({ iteration });
// }

// localStorage.setItem("alldata", JSON.stringify(alldata));

// console.log(JSON.stringify(alldata));
