import ArgumentParser from "./classes/argumentParser";

// parse arguments passed in
const argumentParser = new ArgumentParser(process.argv);

// contains main application logic
argumentParser.parse();