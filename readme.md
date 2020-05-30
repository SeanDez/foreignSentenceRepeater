## This repo is currently in pre-alpha
### The below documentation will explain usage after initial release

### English to Foregin Language Sentence and Word Translator

After taking an excellent spanish course, I looked around for good training materials on an Asian language and found nothing with enough repetition. All the courses would give a translation once, of either a single word, or a whole sentence.

This project aimed to fix this issue. It will take a list of sentences and return a translation of the sentence, and also each word. 

That way you can learn the most common sentences you need to know for travel, or other purposes, and words in the context used by those same sentences.

Any language used by Google Translate is compatible. You may also configure the amount of repetitions (of each sentence and word). These are both global settings. I recommend 2 or 3 repeats. 

Each sentence or phrase you add during configuration will be added as a subfolder full of .ogg audio files inside `./audioCourse`. You may run the build step multiple times with difference sentences in the sentences.txt folder to add more sentences.


### Requirements to use this project

* This project was built and tested on Node.js 14.2.0. It is recommended you use this version (or later) to avoid random bugs and incompatibilities.


### Usage

1. Git clone the repo.
2. After navigating to the project root, run `npm i` in terminal to install all project dependencies.
3. Next, run `tsc` to build the project
4. Run `node ./compiled/index.js` to start the step by step guided wizard. It will take you through the process of enabling google cloud and setting up your desired language settings and sentences to be translated.
5. Run the script again with the `-b` or `--build` flags. For now, every sentence you add will require manually selecting the foreign words in each sentence. This is because some languages lump all words together without spaces. (Space detection is on the way!)

### Ongoing usage

1. As noted above, you may modify sentences.txt -- first introduced during the setup wizard -- at any time. The new sentences or phrases you add will be added to the `./audioCourse` parent folder in their own subfolders.
2. You may also directly modify the setup file to switch the language code or number of global repeats. This is not recommended for organizational reasons. It is recommended that you create a new project and re-run the wizard with your new settings.


### Potential future features under consideration
1. Automatic space detection to streamline the build of most languages.
2. Option to save files as .mp3
3. Input language is any Google Translate compatible language, not just English.




