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



### Questions and Answers

**Why do you recommend a repeat setting of 2-3?**

The idea is to strike a balance between hearing every sentence and word several times, practicing 

**How much time is alloted for pauses**

2 seconds for the first word, .75 seconds for every extra word to give the listener additional time to mentally piece the word phrase or sentence together. There is a maximum pause capped at 12 seconds. The foreign language translation is being counted for this calculation.


**How do I know this application will help me learn a language?**

Only one way to find out! I modeled this course builder from the Pimsleur method, which teaches words, asks you to repeat, then tests you on phrases and finally sentences. If you would like to follow this (highly effective) program structure closely, design your sentence file to start with phrases, and then put the phrases together in another line to form a sentence. I suspect this extra planning will be too much for most people which is fine, drilling sentences and the words that make them up is a great learning pattern also.

**What limitations does this application have?**

1. The most important limitation is that the translation is as good as what Google Translate returns. For simple phrases and sentences it is quite good and getting better. It is not recommended to rely on this app for advanced level sentences.

2. Google cloud's Text to Speech and Translate APIs are not free. But they are very cheap. See the following pages for exact pricing:

https://cloud.google.com/translate/pricing

https://cloud.google.com/text-to-speech/pricing

Unless you are doing millions of translations for some reason, your costs will be pennies.

**Can I really learn a language from this application?**

It is a great sentence and word learning tool. Whether you learn a whole language from it is a higher bar. The best way to fully learn a language is to consume the language from multiple angles. 

Hearing and reciting, as this program does, helps you speak in particular. But obviously does nothing for your reading and writing skills. It is also non-ideal for listening comprehension; for that you will need to practice listening the foreign language in less predictable formats.
















