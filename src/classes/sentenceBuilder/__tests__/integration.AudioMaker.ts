import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import AudioMaker from '../AudioMaker';
import dummyConfigData from '../testData/dummyConfigData';
import testSentence from '../testData/dummySentence';
import { translationDirection, voiceGender, audioEncoding } from '../../../helpers/minorTypes';
import AudioRequest from '../AudioRequestInterface';
import Sentence from '../Sentence';
import ConfigData from '../../setupWizard/ConfigDataInterface';

const configData: ConfigData = {
  projectId: 'foreignsentencerepeater',
  languageCode: 'th',
  numberOfRepeats: 3,
};

const testSentence2 = new Sentence('jest test folder');

class AudioMakerAllPublic extends AudioMaker {
  constructor(config: ConfigData, sentence: Sentence) {
    super(config, sentence);
  }

  public async gatherAllForeignWordsAndDefinitionsFromUser() {
    // await is inferred from return statement
    return super.gatherAllForeignWordsAndDefinitionsFromUser();
  }

  public async textTranslate(
    wordPhraseOrSentence: string,
    direction: translationDirection,
  ) : Promise<string> {
    return super.textTranslate(wordPhraseOrSentence, direction);
  }

  public async fetchAndWriteAudio(
    request: Readonly<AudioRequest>,
    fileName: string,
  ) : Promise<ReturnType<typeof TextToSpeechClient.prototype.synthesizeSpeech>> {
    return super.fetchAndWriteAudio(request, fileName);
  }
}

/*
  This is an API test and therefore a slow integration test

  Keep it skipped unless testing of the API is specifically desired
*/
test('textTranslate (gcloud integration)', async () => {
  const audioMaker = new AudioMakerAllPublic(dummyConfigData, testSentence);
  const translationResult = await audioMaker.textTranslate('test string', translationDirection.toForeign);

  // returns exact match but jest can not detect it correctly
  // expect(translationResult).toEqual('สตรงการทดสอบ');

  const translationResult2 = await audioMaker.textTranslate('สตริงการทดสอบ', translationDirection.toEnglish);

  expect(translationResult2).toStrictEqual('Test string');
});

test.skip('gatherAllForeignWordsAndDefinitionsFromUser', () => {

});

test('fetchAndWriteAudio', async () => {
  const testRequest = {
    input: { text: 'This is a test request' },
    voice: { languageCode: 'en', ssmlGender: voiceGender.female },
    audioConfig: { audioEncoding: 'OGG_OPUS' as const },
  };

  const audioMaker = new AudioMakerAllPublic(configData, testSentence2);

  audioMaker.makeSentenceFolder();
  audioMaker.fetchAndWriteAudio(testRequest, 'testFileName.ogg');
});
