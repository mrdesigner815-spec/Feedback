import React, { useState } from 'react';
import { Play, Pause, Loader2, Sparkles, Download, Copy, Check, Quote } from 'lucide-react';
import { HEADER_QUOTE } from '../data/feedbackGuideData';

interface HeroQuoteProps {
  isPlaying: boolean;
  isLoading: boolean;
  onPlay: (text: string, isSaudi: boolean) => void;
  onDownload: (text: string, isSaudi: boolean) => void;
  globalDialect: 'saudi' | 'original';
}

export const HeroQuote: React.FC<HeroQuoteProps> = ({
  isPlaying,
  isLoading,
  onPlay,
  onDownload,
  globalDialect,
}) => {
  const [localDialect, setLocalDialect] = useState<'saudi' | 'original' | null>(null);
  const [copied, setCopied] = useState(false);

  const activeDialect = localDialect || globalDialect;
  const isSaudi = activeDialect === 'saudi';
  const text = isSaudi ? HEADER_QUOTE.saudiText : HEADER_QUOTE.originalText;

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-emerald-700/50">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              عبارة الاستهلال والتكريم (أعلى الدليل - صفحة 1)
            </span>

            {/* Dialect toggle */}
            <div className="inline-flex p-0.5 bg-white/10 rounded-lg text-xs font-semibold backdrop-blur-sm">
              <button
                type="button"
                onClick={() => setLocalDialect('saudi')}
                className={`px-2.5 py-1 rounded-md transition ${
                  isSaudi ? 'bg-emerald-500 text-white shadow' : 'text-emerald-100 hover:text-white'
                }`}
              >
                اللهجة السعودية
              </button>
              <button
                type="button"
                onClick={() => setLocalDialect('original')}
                className={`px-2.5 py-1 rounded-md transition ${
                  !isSaudi ? 'bg-emerald-500 text-white shadow' : 'text-emerald-100 hover:text-white'
                }`}
              >
                الفصحى المشكولة
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Quote className="w-8 h-8 text-emerald-400 shrink-0 mt-1 opacity-70" />
            <div>
              <p className="text-xl sm:text-2xl font-bold leading-relaxed tracking-wide text-white drop-shadow-sm font-['Cairo',sans-serif]">
                "{text}"
              </p>
              <p className="text-xs text-emerald-200 mt-2 font-medium">
                {isSaudi
                  ? 'منطوقة بنبرة سعودية فخورة ومحفزة تلامس قلب الطالب وتعزز تميزه'
                  : 'كما وردت بالتشكيل الكامل في المستند التعليمي'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-sm transition border border-white/15"
            title="نسخ العبارة"
          >
            {copied ? <Check className="w-5 h-5 text-emerald-300" /> : <Copy className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={() => onDownload(text, isSaudi)}
            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-sm transition border border-white/15"
            title="تحميل الصوت (WAV)"
          >
            <Download className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => onPlay(text, isSaudi)}
            disabled={isLoading}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition shadow-lg shadow-emerald-500/25 flex items-center gap-2.5 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-slate-900" />
                جاري التوليد...
              </>
            ) : isPlaying ? (
              <>
                <Pause className="w-5 h-5 fill-current text-slate-950" />
                إيقاف مؤقت
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current text-slate-950" />
                استماع للعبارة {isSaudi ? 'بالسعودي' : 'بالفصحى'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
