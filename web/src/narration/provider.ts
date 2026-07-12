import type { Language, NarrationSegment } from "../types";

/**
 * Pluggable text-to-speech provider. A real implementation (e.g. ElevenLabs)
 * synthesizes `segment.text[language]` and returns a playable audio URL.
 */
export interface VoiceProvider {
  readonly name: string;
  supports(language: Language): boolean;
  synthesize(segment: NarrationSegment, language: Language): Promise<string>;
}

/** Placeholder provider until an ElevenLabs (or similar) key is wired in. */
export class NullVoiceProvider implements VoiceProvider {
  readonly name = "none";
  supports(): boolean {
    return false;
  }
  synthesize(): Promise<string> {
    return Promise.reject(new Error("No voice provider configured"));
  }
}

export const voiceProvider: VoiceProvider = new NullVoiceProvider();
