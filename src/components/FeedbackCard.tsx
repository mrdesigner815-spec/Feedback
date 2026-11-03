import React, { useState } from 'react';
import {
  Play,
  Pause,
  Download,
  Copy,
  Check,
  Loader2,
  Sparkles,
  Award,
  Target,
  ThumbsUp,
  Zap,
  CheckCircle2,
  Compass,
  Lightbulb,
  HeartHandshake,
  MessageSquareHeart,
  Footprints,
  BookOpenCheck,
  TrendingUp,
  Flame,
  Star,
  PartyPopper,
} from 'lucide-react';
import { FeedbackItem } from '../data/feedbackGuideData';

interface FeedbackCardProps {
  item: FeedbackItem;
  isPlaying: boolean;
  isLoading: boolean;
  onPlay: (item: FeedbackItem, useSaudi: boolean) => void;
  onDownload: (item: FeedbackItem, useSaudi: boolean) => void;
  globalDialect: 'saudi' | 'original';
}

const ICON_MAP: Record<string, React.ElementType> = {
  Award,
  Sparkles,
  Target,
  ThumbsUp,
  Zap,
  CheckCircle2,
  Compass,
  Lightbulb,
  HeartHandshake,
  MessageSquareHeart,
  Footprints,
  BookOpenCheck,
  TrendingUp,
  Flame,
  Star,
  PartyPopper,
};

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  item,
  isPlaying,
  isLoading,
  onPlay,
  onDownload,
  globalDialect,
}) => {
  // Local toggle overrides global if the user clicks it specifically
  const [localDialect, setLocalDialect] = useState<'saudi' | 'original' | null>(null);
  const [copied, setCopied] = useState(false);

  const activeDialect = localDialect || globalDialect;
  const isSaudi = activeDialect === 'saudi';
  const currentText = isSaudi ? item.saudiText : item.originalText;

  const IconComponent = ICON_MAP[item.iconName] || Sparkles;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Color schemes based on category
  const theme = {
    positive: {
      bgGradient: 'bg-emerald-50/50',
      border: 'border-emerald-200 hover:border-emerald-400',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      iconBox: 'bg-emerald-600 text-white shadow-emerald-200',
      playBtn: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200',
      activeBorder: 'ring-2 ring-emerald-500 shadow-lg shadow-emerald-100',
      pillActive: 'bg-emerald-600 text-white',
    },
    corrective: {
      bgGradient: 'bg-amber-50/50',
      border: 'border-amber-200 hover:border-amber-400',
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
      iconBox: 'bg-amber-600 text-white shadow-amber-200',
      playBtn: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-200',
      activeBorder: 'ring-2 ring-amber-500 shadow-lg shadow-amber-100',
      pillActive: 'bg-amber-600 text-white',
    },
    motivation: {
      bgGradient: 'bg-sky-50/50',
      border: 'border-sky-200 hover:border-sky-400',
      badge: 'bg-sky-100 text-sky-800 border-sky-200',
      iconBox: 'bg-sky-600 text-white shadow-sky-200',
      playBtn: 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-200',
      activeBorder: 'ring-2 ring-sky-500 shadow-lg shadow-sky-100',
      pillActive: 'bg-sky-600 text-white',
    },
  }[item.category];

  return (
    <div
      className={`relative bg-white rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between ${
        theme.border
      } ${isPlaying ? theme.activeBorder : 'shadow-sm hover:shadow-md'}`}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl shadow-sm ${theme.iconBox}`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-800">{item.title}</h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${theme.badge}`}>
                  {item.tag}
                </span>
                <span className="text-[11px] text-slate-600 font-medium bg-slate-100 px-1.5 py-0.5 rounded">
                  صفحة {item.page} بالـ PDF
                </span>
              </div>
            </div>
          </div>

          {/* Dialect Switcher inside Card */}
          <div className="inline-flex p-0.5 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setLocalDialect('saudi')}
              className={`px-2 py-1 rounded-md transition-all ${
                isSaudi ? `${theme.pillActive} shadow-xs` : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              سعودية
            </button>
            <button
              type="button"
              onClick={() => setLocalDialect('original')}
              className={`px-2 py-1 rounded-md transition-all ${
                !isSaudi ? `${theme.pillActive} shadow-xs` : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              فصحى
            </button>
          </div>
        </div>

        {/* Text Content */}
        <div
          className={`p-3.5 rounded-xl border text-sm leading-relaxed transition-all my-2 ${
            isSaudi
              ? 'bg-amber-50/30 border-amber-100 text-slate-800'
              : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5 text-[11px] text-slate-600 font-medium">
            <span>{isSaudi ? 'الصياغة المحكية (اللهجة السعودية الطبيعية):' : 'النص المشكول الأصلي من الدليل:'}</span>
            {isSaudi && (
              <span className="text-amber-700 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> لهجة محفزة
              </span>
            )}
          </div>
          <p className="font-medium text-slate-900 leading-relaxed tracking-wide select-text">
            {currentText}
          </p>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-2">
        <div className="flex items-center gap-1.5">
          {/* Copy button */}
          <button
            type="button"
            onClick={handleCopy}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
            title="نسخ النص"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Download Audio */}
          <button
            type="button"
            onClick={() => onDownload(item, isSaudi)}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
            title="تحميل الملف الصوتي (WAV)"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

        {/* Live Audio Visualizer bars when playing */}
        {isPlaying && (
          <div className="flex items-center gap-0.5 px-2">
            <span className="w-1 h-3 bg-emerald-500 rounded-full animate-bounce [animation-delay:0ms]"></span>
            <span className="w-1 h-5 bg-emerald-600 rounded-full animate-bounce [animation-delay:150ms]"></span>
            <span className="w-1 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:300ms]"></span>
            <span className="w-1 h-4 bg-emerald-600 rounded-full animate-bounce [animation-delay:75ms]"></span>
          </div>
        )}

        {/* Play / Pause Primary Button */}
        <button
          type="button"
          onClick={() => onPlay(item, isSaudi)}
          disabled={isLoading}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm ${theme.playBtn}`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              جاري النطق...
            </>
          ) : isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              إيقاف
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              استماع {isSaudi ? 'سعودي' : 'فصحى'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
