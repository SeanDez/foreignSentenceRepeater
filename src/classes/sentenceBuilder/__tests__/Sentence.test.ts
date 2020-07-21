import Sentence, { capitalizeAllWords, stripNonWordFolderCharacters } from '../Sentence';

class SentenceExt extends Sentence {
  // implicit super call and argument passage

  public buildFolderName() {
    return super.buildFolderName();
  }
}

test('capitalize all words', () => {
  const words = 'this is_my++teSt String!!! Another sentence here.'.split(' ');

  const capitalized = capitalizeAllWords(words);

  expect(capitalized).toStrictEqual('This Is_my++teSt String!!! Another Sentence Here.');
});

test('stripNonWordFolderCharactersExt', () => {
  const sentence = new SentenceExt('This Is _My ++TeSt String!!! Another Sentence Here.');

  const stripped = stripNonWordFolderCharacters(sentence.englishVersion);

  expect(stripped).toStrictEqual('ThisIs_MyTeStStringAnotherSentenceHere');
});

test('buildFolderName', () => {
  const sentence = new SentenceExt('This is the test sentence string');

  const result = sentence.folderName;

  expect(result).toStrictEqual('ThisIsTheTestSentenceString');
});
