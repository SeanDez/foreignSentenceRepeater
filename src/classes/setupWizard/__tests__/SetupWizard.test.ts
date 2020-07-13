import WizardSteps from '../WizardStepsInterface';
import ConfigData from '../ConfigDataInterface';

import SetupWizard from '../SetupWizard';
import StepsBase from '../StepsBase';

// --------------- File Scoped setup

// Extend Stepsbase to expose methods used in the main orchestrator
class SetupWizardExtended extends SetupWizard {
  public getValidInputExt(configStep: WizardSteps) {
    return this.getValidInput(configStep);
  }
}

// test class to use as argument

class NothingToSave extends StepsBase {
public hasSaveableData: boolean = true;

public needsFileValidation: boolean = true;
}

class SavesLanguageCode extends StepsBase {
public hasSaveableData: boolean = true;

public configDataKey: string = 'languageCode'
}

class SavesNumberOfRepeats extends StepsBase {
public hasSaveableData: boolean = true;

public configDataKey: string = 'numberOfRepeats'
}

// --------------- Tests

test('validates input and ends loop', () => {
/** ** Setup *** */
  const testInstance = new NothingToSave();
  const setupWizard = new SetupWizardExtended([testInstance]);
  jest.spyOn(testInstance, 'prompt')
    .mockImplementation(() => 'test input');

  /** ** Execute & Assert *** */
  const returnValue = setupWizard.getValidInputExt(testInstance);

  expect(returnValue).toStrictEqual('test input');

  /** ** Teardown *** */
});
