const brain = require("brain.js");
const fs = require("fs");

let data;

fs.readFile("./data.txt", function read(err, stuff) {
  if (err) console.error(err);
  else data = stuff;
});

console.log(data);
