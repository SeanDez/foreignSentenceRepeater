import ArgumentParser from "./classes/argumentParser";

// set the credentials path. Google Cloud looks for this specific variable name
require('dotenv').config();


// parse arguments passed in
const argumentParser = new ArgumentParser(process.argv);

// contains main application logic
argumentParser.parse();