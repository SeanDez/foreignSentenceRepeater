import StepsBase from "./StepsBase";
import WizardSteps from "./WizardStepsInterface";


export default class InstallFfMpeg extends StepsBase implements WizardSteps {
   protected readonly header: string = `
***********************************
         Install FFmpeg
***********************************
`

   protected readonly description: string = `

FFmpeg is a helpful utility for making and combining audio files. This audio translation application makes heavy use of FFmpeg during the audio building process. 

If you do not already have FFmpeg installed, please take the time to install it now. 

Installation options for Windows, Mac, and Linux are available, but can change. As of June 2020, this is a good guide for Ubuntu and Linux Mint installations: https://www.tecmint.com/install-ffmpeg-in-linux/

Mac and Windows users: Please check Google for a good recent guide on how to install FFmpeg on your machine. 
`

   public promptMessage: string = `Press any key to continue after you have installed FFmpeg.`;
}