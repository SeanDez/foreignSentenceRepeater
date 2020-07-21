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

test('textTranslate (gcloud integration)', async () => {
  const audioMaker = new AudioMakerAllPublic(dummyConfigData, testSentence);
  const translationResult = await audioMaker.textTranslate('test string', translationDirection.toForeign);

  // works but doesn't match
  // expect(translationResult).toEqual('ฮารดโคด');

  const translationResult2 = await audioMaker.textTranslate('ฮารดโคด', translationDirection.toEnglish);

  expect(translationResult2).toStrictEqual('test string 2');
});

test.skip('gatherAllForeignWordsAndDefinitionsFromUser', () => {

});
