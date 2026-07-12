import { useCallback, useRef, useState } from "react";
import type { NarrationSegment } from "../types";
import { voiceProvider } from "./provider";

/** Voice-over language for a future TTS provider (e.g. ElevenLabs). */
const LANGUAGE = "en";

/**
 * Plays narration for a lesson step. Prefers a pre-rendered audioUrl, then a
 * configured TTS provider, and always falls back to on-screen captions so the
 * lesson works before any voice agent is connected.
 */
export function useNarration() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [caption, setCaption] = useState<string>("");

  const speak = useCallback(
    async (segment: NarrationSegment) => {
      setCaption(segment.text);
      audioRef.current?.pause();
      const prerendered = segment.audioUrl?.[LANGUAGE];
      let url = prerendered;
      if (!url && voiceProvider.supports(LANGUAGE)) {
        try {
          url = await voiceProvider.synthesize(segment, LANGUAGE);
        } catch {
          url = undefined;
        }
      }
      if (url) {
        const audio = new Audio(url);
        audioRef.current = audio;
        void audio.play().catch(() => undefined);
      }
    },
    [],
  );

  const stop = useCallback(() => {
    audioRef.current?.pause();
    setCaption("");
  }, []);

  return { caption, speak, stop };
}
