import BuildOrchestrator from '../BuildOrchestrator';

class BuildOrchExposed extends BuildOrchestrator {
  public parseSentenceFileExp() {
    return this.parseSentenceFile();
  }

  public validateSentenceCandidatesExp() {

  }
}

test('parseSentenceFile()', () => {
  // setup
  const buildOrchExposed = new BuildOrchExposed();
  buildOrchExposed.parseSentenceFileExp();
});
