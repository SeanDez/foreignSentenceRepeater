import ArgumentParser from "./classes/argumentParser";

console.log("Connected...");

// parse arguments passed in
const argumentParser = new ArgumentParser(process.argv);

argumentParser.parse();