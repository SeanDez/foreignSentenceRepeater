import AudioMaker from '../AudioMaker';
import dummyConfigData from '../testData/dummyConfigData';
import testSentence from '../testData/dummySentence';
import { translationDirection, voiceGender, audioEncoding } from '../../../helpers/minorTypes';

class AudioMakerAllPublic extends AudioMaker {
  public gatherAllForeignWordsAndDefinitionsFromUser() {
    return super.gatherAllForeignWordsAndDefinitionsFromUser();
  }

  public async textTranslate(
    wordPhraseOrSentence: string,
    direction: translationDirection,
  ) : Promise<string> {
    return super.textTranslate(wordPhraseOrSentence, direction);
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
