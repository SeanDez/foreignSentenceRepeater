### English to Foregin Language Sentence and Word Translator

After taking an excellent spanish course, I looked around for good training materials on an Asian language. There nothing with enough repetition to memorize efficiently. All the courses would give a translation once and move on.

This project aimed to fix this issue. It will take a list of sentences and return a translation of the sentence, and also each word. And you have control of how many repetitions occur. I recommend 2 or 3 repeats to start.

Each sentence or phrase you add during configuration will be added as a subfolder full of .ogg audio files inside `./audioCourse`. You may run the build step multiple times with difference sentences in the sentences.txt folder to add more sentences.


### Requirements to use this project

* This project was built and tested on Node.js 14.2.0, with FFMpeg 2.4.0. It is recommended you use this version, or later, to avoid random bugs and incompatibilities.


### Usage

1. Git clone the repo.
2. After navigating to the project root, run `npm i` in terminal to install all project dependencies.
3. Next, run `tsc` to build the project
4. Run `node ./compiled/index.js -c` to start the step by step guided wizard. It will take you through the process of enabling google cloud and setting up your desired language settings and sentences to be translated.
5. Run the script again with the `-b` or `--build` flag. For now, every sentence you add will require manually selecting the foreign words in each sentence. This is because some languages lump all words together without spaces. (Space detection is on the way!)

### Ongoing usage

1. As noted above, you may modify sentences.txt -- first introduced during the setup wizard -- at any time. The new sentences or phrases you add will be added to the `./audioCourse` parent folder in their own subfolders.
2. You may also directly modify the setup file `configuration.json` to switch the language code or number of global repeats. It is recommended that you create a new project at least once first, to see how the file should be formatted.


### Potential future features under consideration
1. Automatic space detection to streamline the build of most languages.
2. Option to save files as .mp3
3. Input language is any Google Translate compatible language, not just English.


### Questions and Answers

**Why do you recommend a repeat setting of 2-3?**

To strike a balance between hearing every sentence and word several times, and not becoming bored. 

After you try this setting you'll have a better idea of what is ideal for your temperament and learning requirements. 

**How much time is alloted for pauses**

During sentence repetitions:

2 seconds for the first word, 1 seconds for every extra word to give the listener additional time to mentally piece the phrase or sentence together.

There is a maximum pause capped at 12 seconds. The foreign language translation is being counted for this calculation.

During single word repetitions:

3 seconds after each word. I recommend you pause often if additional time is desired. In the future, custom pause lengths may be incorporated.

**How do I know this application will help me learn a language?**

Only one way to find out! 

I modeled this course builder from the Pimsleur method, which teaches words, asks you to repeat, then tests you on phrases and finally sentences. It is highly rated. But only available for major languages.

**What limitations does this application have?**

1. The most important limitation is that the translation is as good as what Google Translate returns. For simple phrases and sentences it is quite good and getting better. It is not recommended to rely on this app for advanced level sentences.

2. Google Cloud's Text to Speech and Translate APIs are not free. But they are very cheap. See the following pages for exact pricing:

https://cloud.google.com/translate/pricing

https://cloud.google.com/text-to-speech/pricing

Unless you are doing millions of translations for some reason, your costs will be pennies.

**Can I really learn a language from this application?**

It is a great sentence and word learning tool. Whether you learn a whole language from it is a higher bar. The best way to fully learn a language is to consume the language from multiple angles. 

Hearing and reciting, as this program does, helps you speak. But it does nothing for your reading and writing skills.

It is also non-ideal for listening comprehension. For that you will need to practice listening the foreign language in less predictable formats. That is how the brain is forced into trying to comprehend, versus lazily hearing the same sentence it knows over and over again.
















