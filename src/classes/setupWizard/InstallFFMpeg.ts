import StepsBase from './StepsBase';
import WizardSteps from './WizardStepsInterface';

export default class InstallFfMpeg extends StepsBase implements WizardSteps {
   protected readonly header: string = `
***********************************
   Install FFMpeg 2.4 (Or Later)
***********************************
`

   protected readonly description: string = `

FFMpeg makes and combines audio files. This audio translation application makes heavy use of FFmpeg during the audio build process. 

If you do not already have FFMpeg installed, please take the time to install it now. *IMPORTANT: You must install FFMpeg version 2.4 or later.*

Installation options for Windows, Mac, and other Linux distros are also available here: https://ffmpeg.org/download.html
`

   public promptMessage: string = 'Press any key to continue after you have installed FFmpeg.';
}
