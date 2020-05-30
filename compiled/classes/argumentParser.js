"use strict";
exports.__esModule = true;
var supportData_1 = require("../data/supportData");
var ArgumentParser = (function () {
    function ArgumentParser(argV) {
        this.commandLineArgs = argV;
        this.instructions = supportData_1.instructions;
    }
    ArgumentParser.prototype.countArgs = function () { };
    ArgumentParser.prototype.parse = function () {
        var arg1 = this.commandLineArgs[2];
        switch (arg1) {
            case "-i":
            case "--information":
            case undefined: {
                console.log("this is the i/undefined case.");
                console.log('arg1', arg1);
                console.log('instructions', this.instructions.description);
                break;
            }
            case "-c":
            case "--configure": {
                break;
            }
            case "-b":
            case "--build": {
                break;
            }
            default: {
            }
        }
    };
    return ArgumentParser;
}());
exports["default"] = ArgumentParser;
//# sourceMappingURL=argumentParser.js.map