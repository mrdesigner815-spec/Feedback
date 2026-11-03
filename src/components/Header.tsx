import React from 'react';
import {
  Mic,
  FileText,
  PlayCircle,
  StopCircle,
  Sparkles,
  UserCheck,
  Languages,
  Gauge,
  HelpCircle,
} from 'lucide-react';
import { SAUDI_VOICE_OPTIONS, VoiceOption } from '../data/feedbackGuideData';

interface HeaderProps {
  selectedVoice: string;
  onSelectVoice: (voiceId: string) => void;
  globalDialect: 'saudi' | 'original';
  onToggleGlobalDialect: (dialect: 'saudi' | 'original') => void;
  playbackRate: number;
  onChangePlaybackRate: (rate: number) => void;
  onOpenPdfModal: () => void;
  onOpenStudioModal: () => void;
  onStartFullPlaylist: () => void;
  onStopPlaylist: () => void;
  isPlaylistRunning: boolean;
  currentPlayIndex: number;
  totalPlaylistItems: number;
}

export const Header: React.FC<HeaderProps> = ({
  selectedVoice,
  onSelectVoice,
  globalDialect,
  onToggleGlobalDialect,
  playbackRate,
  onChangePlaybackRate,
  onOpenPdfModal,
  onOpenStudioModal,
  onStartFullPlaylist,
  onStopPlaylist,
  isPlaylistRunning,
  currentPlayIndex,
  totalPlaylistItems,
}) => {
  return (
    <header className="space-y-6">
      {/* Top Navbar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-right w-full md:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-700 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-700/20 shrink-0">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                دليل التغذية الراجعة للطلاب
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                باللهجة السعودية الطبيعية 🇸🇦
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
              توليد وقراءة جميع نماذج التعزيز والتوجيه من الملف المرفق بنبرة صوتية تربوية دافئة
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Download Complete ZIP Package */}
          <a
            href="/api/download-all-zip"
            download="دليل_التغذية_الراجعة_الصوتيات_السعودية.zip"
            className="px-3.5 py-2 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-xl transition flex items-center gap-1.5 shadow-xs"
            title="تحميل جميع الملفات الصوتية الـ 17 بصيغة WAV في ملف مضغوط واحد"
          >
            <span className="text-base">📦</span>
            تحميل كل الأصوات (ملف ZIP)
          </a>

          {/* PDF Viewer Button */}
          <button
            type="button"
            onClick={onOpenPdfModal}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-emerald-700" />
            استعراض الـ PDF المرفق
          </button>

          {/* Custom Studio Button */}
          <button
            type="button"
            onClick={onOpenStudioModal}
            className="px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            استوديو التغذية باسم الطالب
          </button>

          {/* Full guide playlist */}
          {isPlaylistRunning ? (
            <button
              type="button"
              onClick={onStopPlaylist}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition shadow-sm flex items-center gap-1.5 animate-pulse"
            >
              <StopCircle className="w-4 h-4" />
              إيقاف الاستماع المتتالي ({currentPlayIndex + 1}/{totalPlaylistItems})
            </button>
          ) : (
            <button
              type="button"
              onClick={onStartFullPlaylist}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition shadow-sm flex items-center gap-1.5"
            >
              <PlayCircle className="w-4 h-4" />
              تشغيل الدليل كاملاً بالتتابع
            </button>
          )}
        </div>
      </div>

      {/* Voice & Settings Controller Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Voices selection */}
          <div className="space-y-1.5 w-full lg:w-auto">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <UserCheck className="w-4 h-4" />
              <span>اختر نبرة الصوت السعودي:</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SAUDI_VOICE_OPTIONS.map((voice: VoiceOption) => {
                const isSelected = selectedVoice === voice.geminiVoice;
                return (
                  <button
                    key={voice.id}
                    type="button"
                    onClick={() => onSelectVoice(voice.geminiVoice)}
                    className={`p-2.5 rounded-xl border text-right transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-800/70 border-emerald-400 text-white shadow-md ring-1 ring-emerald-400'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 w-full mb-1">
                      <span className="font-bold text-xs">{voice.name.split(' ')[0]}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                          isSelected ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {voice.badge}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-300 line-clamp-1">
                      {voice.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick controls: Dialect Mode & Speed */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
            {/* Dialect Switch */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Languages className="w-3.5 h-3.5 text-emerald-400" />
                صيغة النطق الافتراضية:
              </span>
              <div className="inline-flex p-1 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => onToggleGlobalDialect('saudi')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    globalDialect === 'saudi'
                      ? 'bg-emerald-600 text-white shadow-xs font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🇸🇦 لهجة سعودية طبيعية
                </button>
                <button
                  type="button"
                  onClick={() => onToggleGlobalDialect('original')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    globalDialect === 'original'
                      ? 'bg-emerald-600 text-white shadow-xs font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  📖 فصحى مشكولة أصلية
                </button>
              </div>
            </div>

            {/* Playback speed */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                سرعة القراءة:
              </span>
              <div className="inline-flex p-1 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold">
                {[0.85, 1.0, 1.15].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => onChangePlaybackRate(rate)}
                    className={`px-2.5 py-1.5 rounded-lg transition-all ${
                      playbackRate === rate
                        ? 'bg-emerald-600 text-white shadow-xs font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
