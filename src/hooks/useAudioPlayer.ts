import { useState, useRef, useEffect, useCallback } from 'react';

export interface PlayingState {
  id: string | null;
  title: string;
  category: string;
  text: string;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  audioUrl: string | null;
  error: string | null;
}

export function useAudioPlayer() {
  const [playingState, setPlayingState] = useState<PlayingState>({
    id: null,
    title: '',
    category: '',
    text: '',
    isPlaying: false,
    isLoading: false,
    currentTime: 0,
    duration: 0,
    audioUrl: null,
    error: null,
  });

  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isPlaylistRunning, setIsPlaylistRunning] = useState<boolean>(false);
  const [playlistQueue, setPlaylistQueue] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCacheRef = useRef<Map<string, string>>(new Map());

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setPlayingState((prev) => ({
        ...prev,
        currentTime: audio.currentTime,
        duration: audio.duration || 0,
      }));
    };

    const handleEnded = () => {
      setPlayingState((prev) => ({
        ...prev,
        isPlaying: false,
        currentTime: 0,
      }));

      // If playlist is running, play next
      if (isPlaylistRunning) {
        setCurrentIndex((prevIdx) => prevIdx + 1);
      }
    };

    const handleError = () => {
      setPlayingState((prev) => ({
        ...prev,
        isPlaying: false,
        isLoading: false,
        error: 'حدث خطأ أثناء تشغيل الملف الصوتي',
      }));
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
    };
  }, [isPlaylistRunning]);

  // Adjust playback rate
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Play a single audio item
  const playAudio = useCallback(
    async (params: {
      id: string;
      title: string;
      category: string;
      text: string;
      voiceName: string;
      isSaudiDialect?: boolean;
    }) => {
      const { id, title, category, text, voiceName, isSaudiDialect = true } = params;
      const audio = audioRef.current;
      if (!audio) return;

      // If already playing this item, toggle pause/play
      if (playingState.id === id && playingState.audioUrl && !playingState.isLoading) {
        if (playingState.isPlaying) {
          audio.pause();
          setPlayingState((prev) => ({ ...prev, isPlaying: false }));
          return;
        } else {
          audio.play().catch(console.error);
          setPlayingState((prev) => ({ ...prev, isPlaying: true }));
          return;
        }
      }

      const cacheKey = `${voiceName}_${isSaudiDialect ? 'saudi' : 'standard'}_${text.trim()}`;

      // Reset state for new audio
      setPlayingState({
        id,
        title,
        category,
        text,
        isPlaying: false,
        isLoading: true,
        currentTime: 0,
        duration: 0,
        audioUrl: null,
        error: null,
      });

      try {
        let audioUrl = audioCacheRef.current.get(cacheKey);

        if (!audioUrl) {
          const res = await fetch('/api/tts/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text,
              voiceName,
              isSaudiDialect,
            }),
          });

          if (!res.ok) {
            const errJson = await res.json().catch(() => ({}));
            throw new Error(errJson.error || 'فشل في توليد الصوت');
          }

          const data = await res.json();
          audioUrl = data.audioDataUrl;
          if (audioUrl) {
            audioCacheRef.current.set(cacheKey, audioUrl);
          }

          if (data.useWebSpeechFallback && typeof window !== 'undefined' && 'speechSynthesis' in window) {
            try {
              window.speechSynthesis.cancel();
              const utterance = new SpeechSynthesisUtterance(text);
              utterance.lang = 'ar-SA';
              utterance.rate = playbackRate;
              window.speechSynthesis.speak(utterance);
            } catch (speechErr) {
              console.warn('SpeechSynthesis error:', speechErr);
            }
          }
        }

        if (!audioUrl) throw new Error('لم يتم استلام بيانات الصوت');

        audio.src = audioUrl;
        audio.playbackRate = playbackRate;
        await audio.play().catch((e) => console.log('Audio element play handled:', e));

        setPlayingState((prev) => ({
          ...prev,
          audioUrl,
          isPlaying: true,
          isLoading: false,
        }));
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'تعذر توليد الصوت';
        console.error('Audio playback error:', errorMsg);
        setPlayingState((prev) => ({
          ...prev,
          isLoading: false,
          isPlaying: false,
          error: errorMsg,
        }));
      }
    },
    [playingState.id, playingState.audioUrl, playingState.isPlaying, playingState.isLoading, playbackRate]
  );

  const pauseAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingState((prev) => ({ ...prev, isPlaying: false }));
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  const stopAll = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaylistRunning(false);
    setPlaylistQueue([]);
    setCurrentIndex(-1);
    setPlayingState((prev) => ({
      ...prev,
      isPlaying: false,
      currentTime: 0,
    }));
  }, []);

  const downloadAudio = useCallback((audioUrl: string | null, filename: string) => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `${filename || 'audio'}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, []);

  // Playlist handling
  const startPlaylist = useCallback((items: any[], voiceName: string, isSaudiDialect: boolean) => {
    if (!items.length) return;
    setPlaylistQueue(items);
    setIsPlaylistRunning(true);
    setCurrentIndex(0);
  }, []);

  useEffect(() => {
    if (!isPlaylistRunning) return;
    if (currentIndex >= 0 && currentIndex < playlistQueue.length) {
      const item = playlistQueue[currentIndex];
      playAudio({
        id: item.id,
        title: item.title,
        category: item.categoryTitle,
        text: item.useSaudi ? item.saudiText : item.originalText,
        voiceName: item.voiceName || 'Puck',
        isSaudiDialect: item.useSaudi,
      });
    } else if (currentIndex >= playlistQueue.length && playlistQueue.length > 0) {
      // Finished all items
      setIsPlaylistRunning(false);
      setCurrentIndex(-1);
    }
  }, [currentIndex, isPlaylistRunning, playlistQueue, playAudio]);

  return {
    playingState,
    playbackRate,
    setPlaybackRate,
    playAudio,
    pauseAudio,
    seek,
    stopAll,
    downloadAudio,
    startPlaylist,
    isPlaylistRunning,
    currentIndex,
    playlistLength: playlistQueue.length,
  };
}
