const brain = require("brain.js");
const fs = require("fs");

let data;

fs.readFileSync("./DATA/30x30data.js", function read(err, stuff) {
  if (err) console.error(err);
  else data = stuff;
});

console.log(data);
