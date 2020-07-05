import StepsBase from "./StepsBase";
import WizardSteps from "./WizardStepsInterface";


export default class InstallFfMpeg extends StepsBase implements WizardSteps {
   protected readonly header: string = `
***********************************
         Install FFmpeg
***********************************
`

   protected readonly description: string = `

FFmpeg is a helpful utility library for making and combining audio files. This application makes heavy use of FFmpeg during the build process. 

If you do not already have this library installed, please take the time to do so now. 

Installation options for Windows, Mac, and Linux can be found on this page: https://ffmpeg.org/download.html
`

   public promptMessage: string = `Press any key to continue after you have installed FFmpeg`;
}