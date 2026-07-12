import { useCallback, useRef, useState } from "react";
import type { Language, NarrationSegment } from "../types";
import { voiceProvider } from "./provider";

/**
 * Plays narration for a lesson step. Prefers a pre-rendered audioUrl, then a
 * configured TTS provider, and always falls back to on-screen captions so the
 * lesson works before any voice agent is connected.
 */
export function useNarration(language: Language) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [caption, setCaption] = useState<string>("");

  const speak = useCallback(
    async (segment: NarrationSegment) => {
      setCaption(segment.text[language]);
      audioRef.current?.pause();
      const prerendered = segment.audioUrl?.[language];
      let url = prerendered;
      if (!url && voiceProvider.supports(language)) {
        try {
          url = await voiceProvider.synthesize(segment, language);
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
    [language],
  );

  const stop = useCallback(() => {
    audioRef.current?.pause();
    setCaption("");
  }, []);

  return { caption, speak, stop };
}
