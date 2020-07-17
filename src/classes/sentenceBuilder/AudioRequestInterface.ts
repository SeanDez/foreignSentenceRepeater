import { voiceGender } from '../../helpers/minorTypes';

export default interface AudioRequest {
  input : { text : string }
  , voice : { languageCode : string, ssmlGender: voiceGender }
  , audioConfig : {
     audioEncoding : 'AUDIO_ENCODING_UNSPECIFIED' | 'LINEAR16' | 'MP3' | 'OGG_OPUS' }
}
