
// --------------- Prompt

export const pressEnter = "Press Enter to continue...";

// --------------- Instruction Text

const instructionHeader = `
******************************************
    FOREIGN SENTENCE AUDIO TRANSLATOR 
******************************************
`

const instructionAppDescription = `
This app will accept a series of sentences, and output matching subfolders. 

1. Each subfolder will speak the sentence in English, then the foreign language version of the sentence X number of times (X is user defined).

2. Each word in the sentence will then be stated once in English, then X number of times as well, to build familiarity and repetition at the phrase/sentence level, and also understanding at the individual word level.

3. Finally, step 1 will repeat again, saying the entire sentence or phrase in English, then repeating it in the foreign language X times.

All audio files are saved in .ogg format.
`




export type instructionsType = {
   header: string
   , description: string
}

export const instructions: instructionsType = {
   header : instructionHeader
   , description : instructionAppDescription
   
}