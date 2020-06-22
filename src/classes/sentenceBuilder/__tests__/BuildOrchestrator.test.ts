import BuildOrchestrator from "../BuildOrchestrator";

class BuildOrchExposed extends BuildOrchestrator {
   
   public parseSentenceFileExp(filePathOverride: string) {
      return this.parseSentenceFile(filePathOverride);
   }

   public validateSentenceCandidatesExp() {
      return;
   }
}

test("parseSentenceFile()", () => {
   // setup
   const buildOrchExposed = new BuildOrchExposed();
   buildOrchExposed.parseSentenceFileExp(undefined);

});