import StepsBase from './StepsBase';
import WizardSteps from './WizardStepsInterface';

export default class InstallFfMpeg extends StepsBase implements WizardSteps {
   protected readonly header: string = `
***********************************
         Install Sox
***********************************
`

   protected readonly description: string = `

Sox is a helpful utility for making and combining audio files. This audio translation application makes heavy use of FFmpeg during the audio building process. 

If you do not already have Sox installed, please take the time to install it now. 

To install Sox on your machine, open a terminal and run 'sudo apt install sox'. Then run 'sox --version' to confirm it has been install.

Installation options for Windows, Mac, and other Linux distros are also available here: http://sox.sourceforge.net/

*NOTE: As of this writing, the above main site is temporarily down! But a google search for 'sox audio' will return many other sites to both download the utility and instruct on how to install it.
`

   public promptMessage: string = 'Press any key to continue after you have installed FFmpeg.';
}
