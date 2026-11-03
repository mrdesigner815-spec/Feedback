import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Download,
  X,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { PlayingState } from '../hooks/useAudioPlayer';

interface MasterAudioPlayerProps {
  state: PlayingState;
  onPause: () => void;
  onPlayAgain: () => void;
  onSeek: (seconds: number) => void;
  onClose: () => void;
  onDownload: () => void;
  playbackRate: number;
}

export const MasterAudioPlayer: React.FC<MasterAudioPlayerProps> = ({
  state,
  onPause,
  onPlayAgain,
  onSeek,
  onClose,
  onDownload,
  playbackRate,
}) => {
  if (!state.audioUrl && !state.isLoading && !state.error) {
    return null;
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressPercent = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

  return (
    <div className="fixed bottom-4 inset-x-4 max-w-4xl mx-auto z-40 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-slate-700/80 p-4 transition-all duration-300">
      {/* Error state */}
      {state.error ? (
        <div className="flex items-center justify-between text-rose-300 text-xs py-1">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>{state.error}</span>
          </div>
          <button onClick={onClose} className="p-1 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {/* Top row: meta & close */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                <Volume2 className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-white truncate">{state.title || 'المقطع الصوتي'}</h4>
                  {state.category && (
                    <span className="text-[10px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded-md font-medium border border-slate-700 shrink-0">
                      {state.category}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 truncate max-w-md">{state.text}</p>
              </div>
            </div>

            {/* Actions right */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] text-slate-400 font-mono px-2 py-1 bg-slate-800 rounded-md">
                {playbackRate}x
              </span>

              {state.audioUrl && (
                <button
                  type="button"
                  onClick={onDownload}
                  className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
                  title="تحميل الملف الصوتي (WAV)"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                title="إخفاء المشغل"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrubber progress */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-slate-400 w-10 text-right">
              {formatTime(state.currentTime)}
            </span>
            <div
              className="relative flex-1 h-2 bg-slate-800 rounded-full cursor-pointer overflow-hidden group"
              onClick={(e) => {
                if (state.duration > 0) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                  onSeek(ratio * state.duration);
                }
              }}
            >
              <div
                className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all group-hover:brightness-110"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-slate-400 w-10">
              {formatTime(state.duration)}
            </span>

            {/* Play/Pause Button */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => onSeek(0)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                title="إعادة من البداية"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (state.isPlaying) onPause();
                  else onPlayAgain();
                }}
                disabled={state.isLoading}
                className="w-9 h-9 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center font-bold transition shadow-md"
              >
                {state.isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                ) : state.isPlaying ? (
                  <Pause className="w-4 h-4 fill-current text-slate-950" />
                ) : (
                  <Play className="w-4 h-4 fill-current text-slate-950" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
