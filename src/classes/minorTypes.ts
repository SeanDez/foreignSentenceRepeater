import Sentence from "./sentenceBuilder/Sentence"

export enum translationDirection { toForeign, toEnglish }

export enum voiceGender { male = "MALE", female = "FEMALE" }

export type audioEncoding = "OGG_OPUS" | "AUDIO_ENCODING_UNSPECIFIED" | "LINEAR16" | "MP3";