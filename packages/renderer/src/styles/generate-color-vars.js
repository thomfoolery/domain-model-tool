const chroma = require("chroma-js");

// const greenScale = chroma.scale(["#d4fff6", "#00ffc8", "#00755b"]).colors(9);

// console.log(greenScale);

const green = chroma("#00ffc8");

console.log(green.brighten(0).hex());
console.log(green.brighten(0.1).hex());
console.log(green.brighten(0.2).hex());
console.log(green.brighten(0.3).hex());
console.log(green.brighten(0.4).hex());
console.log(green.brighten(0.5).hex());
console.log(green.brighten(0.6).hex());
console.log(green.brighten(0.7).hex());
console.log(green.brighten(0.8).hex());
console.log(green.brighten(0.9).hex());
console.log(green.brighten(1).hex());
