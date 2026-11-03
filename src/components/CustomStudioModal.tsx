import React, { useState } from 'react';
import { X, Sparkles, Volume2, Loader2, Download, Copy, Check } from 'lucide-react';

interface CustomStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVoice: string;
  onPlayAudio: (params: {
    id: string;
    title: string;
    category: string;
    text: string;
    voiceName: string;
    isSaudiDialect?: boolean;
  }) => void;
  isPlaying: boolean;
  currentPlayingId: string | null;
  downloadAudio: (url: string | null, filename: string) => void;
}

export const CustomStudioModal: React.FC<CustomStudioModalProps> = ({
  isOpen,
  onClose,
  selectedVoice,
  onPlayAudio,
  isPlaying,
  currentPlayingId,
  downloadAudio,
}) => {
  const [studentName, setStudentName] = useState('يا بطل');
  const [originalPhrase, setOriginalPhrase] = useState(
    'إجابة صحيحة ومتميزة، أحسنت التفكير وأنا فخور بهذا المستوى'
  );
  const [saudiPhrase, setSaudiPhrase] = useState(
    'ما شاء الله عليك يا بطل! إجابة صحيحة ومضبوطة بالملي، كفو وبيض الله وجهك، فخور فيك وبمستواك العالي!'
  );
  const [isConverting, setIsConverting] = useState(false);
  const [tone, setTone] = useState('تشجيعي دافئ');
  const [copied, setCopied] = useState(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleConvert = async () => {
    if (!originalPhrase.trim()) return;
    setIsConverting(true);
    try {
      const res = await fetch('/api/gemini/convert-dialect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: originalPhrase,
          studentName,
          tone,
        }),
      });
      const data = await res.json();
      if (data.convertedText) {
        setSaudiPhrase(data.convertedText);
      }
    } catch (err) {
      console.error('Dialect conversion failed', err);
    } finally {
      setIsConverting(false);
    }
  };

  const handlePlay = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: saudiPhrase,
          voiceName: selectedVoice,
          isSaudiDialect: true,
        }),
      });
      const data = await res.json();
      if (data.audioDataUrl) {
        setGeneratedAudioUrl(data.audioDataUrl);
      }
      onPlayAudio({
        id: 'custom-studio-phrase',
        title: `تغذية خاصة (${studentName})`,
        category: 'استوديو الصوت المخصص',
        text: saudiPhrase,
        voiceName: selectedVoice,
        isSaudiDialect: true,
      });
    } catch (err) {
      console.error('Play error', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(saudiPhrase);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-800 to-teal-800 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-700/60 rounded-xl">
              <Sparkles className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg">استوديو التغذية الراجعة المخصصة</h3>
              <p className="text-xs text-emerald-200">توليد صوتي مخصص باسم الطالب وبنبرة سعودية طبيعية</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-emerald-700 rounded-lg transition-colors text-emerald-100 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Student Name & Tone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                اسم الطالب / صيغة المناداة
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="مثال: يا بطل، يا فيصل، يا سارة، يا شاطر..."
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                نبرة الصوت والأسلوب
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              >
                <option value="تشجيعي دافئ وودود">تشجيعي دافئ وودود (أبوي)</option>
                <option value="حماسي ومبهج">حماسي ومبهج (طاقة إيجابية عالية)</option>
                <option value="هادئ وتوجيهي لطيف">هادئ وتوجيهي لطيف (لمعالجة الخطأ)</option>
                <option value="فخر واعتزاز">فخر واعتزاز بالتميز</option>
              </select>
            </div>
          </div>

          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              نماذج جاهزة للاختيار السريع:
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'إجابة نموذجية', phrase: 'إجابة صحيحة ومتقنة، ما شاء الله أحسنت التفكير وأنا فخور بهذا المستوى' },
                { label: 'فهم عميق', phrase: 'إجابتك تدل على فهمك العميق للدرس واستيعابك للمعلومات بشكل ممتاز' },
                { label: 'محاولة شجاعة', phrase: 'محاولة ممتازة وشجاعة منك، راجع الخطوة الثانية لتصل للحل الصحيح' },
                { label: 'تقدم ملحوظ', phrase: 'ما شاء الله ألاحظ تقدماً ملحوظاً في مستواك، هذا يدل على اجتهادك المستمر' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setOriginalPhrase(item.phrase);
                  }}
                  className="px-3 py-1 text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 rounded-lg text-slate-700 transition"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Original Phrase */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                العبارة الأصلية (فصحى):
              </label>
              <button
                type="button"
                onClick={handleConvert}
                disabled={isConverting}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition"
              >
                {isConverting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                إعادة صياغة باللهجة السعودية ذكياً
              </button>
            </div>
            <textarea
              rows={2}
              value={originalPhrase}
              onChange={(e) => setOriginalPhrase(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              placeholder="اكتب العبارة التعليمية..."
            />
          </div>

          {/* Saudi Spoken Output */}
          <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                الصياغة المنطوقة باللهجة السعودية:
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs text-emerald-700 hover:text-emerald-900 flex items-center gap-1 font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'تم النسخ!' : 'نسخ النص'}
              </button>
            </div>
            <textarea
              rows={3}
              value={saudiPhrase}
              onChange={(e) => setSaudiPhrase(e.target.value)}
              className="w-full text-sm font-medium text-emerald-950 bg-white/80 p-2.5 rounded-lg border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>

        {/* Footer controls */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            سيتم التوليد بصوت: <span className="font-bold text-slate-700">{selectedVoice}</span>
          </div>
          <div className="flex items-center gap-2">
            {generatedAudioUrl && (
              <button
                type="button"
                onClick={() => downloadAudio(generatedAudioUrl, `تغذية_راجعة_سعودية_${studentName}`)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition flex items-center gap-1.5"
              >
                <Download className="w-4 h-4 text-slate-600" />
                تحميل WAV
              </button>
            )}
            <button
              type="button"
              onClick={handlePlay}
              disabled={isGenerating}
              className="px-5 py-2 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition shadow-md flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري التوليد...
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  {currentPlayingId === 'custom-studio-phrase' && isPlaying
                    ? 'إيقاف مؤقت'
                    : 'استماع بالصوت السعودي'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
