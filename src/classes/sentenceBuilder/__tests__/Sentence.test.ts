import Sentence from "../Sentence";


class SentenceExt extends Sentence {
   // implicit super call and argument passage

   public stripNonWordFolderCharactersExt() {
      return this.stripNonWordFolderCharacters();
   }

   public capitalizeAllWordsExt() {
      return this.capitalizeAllWords();
   }
}

test("capitalize all words", () => {
   const sentenceObj = new SentenceExt("this is_my++teSt String!!! Another sentence here.");

   const capitalized = sentenceObj.capitalizeAllWordsExt();

   expect(capitalized).toStrictEqual("This Is_my++teSt String!!! Another Sentence Here.");
});

test("stripNonWordFolderCharactersExt", () => {
   const sentenceObj = new SentenceExt("This Is _My ++TeSt String!!! Another Sentence Here.");

   const stripped = sentenceObj.stripNonWordFolderCharactersExt();

   expect(stripped).toStrictEqual("ThisIs_MyTeStStringAnotherSentenceHere")
})
