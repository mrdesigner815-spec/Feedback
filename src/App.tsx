import React, { useState, useMemo } from 'react';
import {
  FEEDBACK_ITEMS,
  FeedbackItem,
  HEADER_QUOTE,
  SAUDI_VOICE_OPTIONS,
} from './data/feedbackGuideData';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { Header } from './components/Header';
import { HeroQuote } from './components/HeroQuote';
import { FeedbackCard } from './components/FeedbackCard';
import { MasterAudioPlayer } from './components/MasterAudioPlayer';
import { PdfViewerModal } from './components/PdfViewerModal';
import { CustomStudioModal } from './components/CustomStudioModal';
import {
  Search,
  Sparkles,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Volume2,
  FileCheck,
  Layers,
  Heart,
  Share2,
} from 'lucide-react';

export default function App() {
  const [selectedVoice, setSelectedVoice] = useState<string>('Puck');
  const [globalDialect, setGlobalDialect] = useState<'saudi' | 'original'>('saudi');
  const [activeTab, setActiveTab] = useState<'all' | 'positive' | 'corrective' | 'motivation'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isStudioModalOpen, setIsStudioModalOpen] = useState(false);

  const {
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
  } = useAudioPlayer();

  // Filter items
  const filteredItems = useMemo(() => {
    return FEEDBACK_ITEMS.filter((item) => {
      const matchesTab = activeTab === 'all' || item.category === activeTab;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.originalText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.saudiText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tag.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  // Group items by category
  const positiveItems = useMemo(
    () => filteredItems.filter((item) => item.category === 'positive'),
    [filteredItems]
  );
  const correctiveItems = useMemo(
    () => filteredItems.filter((item) => item.category === 'corrective'),
    [filteredItems]
  );
  const motivationItems = useMemo(
    () => filteredItems.filter((item) => item.category === 'motivation'),
    [filteredItems]
  );

  // Play a single item
  const handlePlayCard = (item: FeedbackItem, useSaudi: boolean) => {
    playAudio({
      id: item.id,
      title: item.title,
      category: item.categoryTitle,
      text: useSaudi ? item.saudiText : item.originalText,
      voiceName: selectedVoice,
      isSaudiDialect: useSaudi,
    });
  };

  // Download item
  const handleDownloadCard = (item: FeedbackItem, useSaudi: boolean) => {
    // If we have an existing audio for this, download it, else request and download
    const text = useSaudi ? item.saudiText : item.originalText;
    fetch('/api/tts/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        voiceName: selectedVoice,
        isSaudiDialect: useSaudi,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.audioDataUrl) {
          downloadAudio(
            data.audioDataUrl,
            `تغذية_راجعة_${item.title.replace(/\s+/g, '_')}_${useSaudi ? 'سعودية' : 'فصحى'}`
          );
        }
      })
      .catch(console.error);
  };

  // Play Hero Quote
  const handlePlayHero = (text: string, isSaudi: boolean) => {
    playAudio({
      id: 'hero-quote',
      title: HEADER_QUOTE.title,
      category: 'عبارة التكريم الرئيسية',
      text,
      voiceName: selectedVoice,
      isSaudiDialect: isSaudi,
    });
  };

  const handleDownloadHero = (text: string, isSaudi: boolean) => {
    fetch('/api/tts/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        voiceName: selectedVoice,
        isSaudiDialect: isSaudi,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.audioDataUrl) {
          downloadAudio(data.audioDataUrl, 'عبارة_الاستهلال_والتكريم_سعودية');
        }
      })
      .catch(console.error);
  };

  // Play entire guide or section
  const handlePlayAll = (itemsToPlay = FEEDBACK_ITEMS) => {
    const queue = itemsToPlay.map((item) => ({
      ...item,
      useSaudi: globalDialect === 'saudi',
      voiceName: selectedVoice,
    }));
    startPlaylist(queue, selectedVoice, globalDialect === 'saudi');
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-36 text-slate-900 font-['Cairo',sans-serif]">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-8">
        {/* Header Bar */}
        <Header
          selectedVoice={selectedVoice}
          onSelectVoice={setSelectedVoice}
          globalDialect={globalDialect}
          onToggleGlobalDialect={setGlobalDialect}
          playbackRate={playbackRate}
          onChangePlaybackRate={setPlaybackRate}
          onOpenPdfModal={() => setIsPdfModalOpen(true)}
          onOpenStudioModal={() => setIsStudioModalOpen(true)}
          onStartFullPlaylist={() => handlePlayAll(FEEDBACK_ITEMS)}
          onStopPlaylist={stopAll}
          isPlaylistRunning={isPlaylistRunning}
          currentPlayIndex={currentIndex}
          totalPlaylistItems={FEEDBACK_ITEMS.length}
        />

        {/* Hero Banner Quote (From Page 1 Header) */}
        <HeroQuote
          isPlaying={playingState.id === 'hero-quote' && playingState.isPlaying}
          isLoading={playingState.id === 'hero-quote' && playingState.isLoading}
          onPlay={handlePlayHero}
          onDownload={handleDownloadHero}
          globalDialect={globalDialect}
        />

        {/* Category Filter & Search Bar */}
        <section className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'كافة النماذج (16)', icon: Layers },
              { id: 'positive', label: 'أولاً: التعزيز (6)', icon: CheckCircle },
              { id: 'corrective', label: 'ثانياً: التوجيه (6)', icon: HelpCircle },
              { id: 'motivation', label: 'ثالثاً: التحفيز (4)', icon: TrendingUp },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن نموذج أو عبارة..."
              className="w-full pr-10 pl-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
          </div>
        </section>

        {/* Feedback Sections */}
        <div className="space-y-10">
          {/* Section 1: Positive Feedback (التعزيز) */}
          {(activeTab === 'all' || activeTab === 'positive') && positiveItems.length > 0 && (
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-emerald-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      أَوَّلًا: نَمَاذِجُ التَّغْذِيَةِ الرَّاجِعَةِ لِلْإِجَابَةِ الصَّحِيحَةِ (التَّعْزِيزُ)
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      مستخرجة من صفحة 1 بالملف • عبارات التقدير والإشادة بالإتقان والتفكير السليم
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handlePlayAll(positiveItems)}
                  className="self-start sm:self-auto text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  تشغيل قسم التعزيز متتالياً
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {positiveItems.map((item) => (
                  <FeedbackCard
                    key={item.id}
                    item={item}
                    isPlaying={playingState.id === item.id && playingState.isPlaying}
                    isLoading={playingState.id === item.id && playingState.isLoading}
                    onPlay={handlePlayCard}
                    onDownload={handleDownloadCard}
                    globalDialect={globalDialect}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Section 2: Corrective Feedback (التوجيه والتصويب) */}
          {(activeTab === 'all' || activeTab === 'corrective') && correctiveItems.length > 0 && (
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-amber-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      ثَانِيًا: نَمَاذِجُ التَّغْذِيَةِ الرَّاجِعَةِ لِلْإِجَابَةِ الْخَاطِئَةِ (التَّوْجِيهُ وَالتَّصْوِيبُ)
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      مستخرجة من صفحتي 1 و 2 بالملف • دعم المتعلم عند الخطأ وتوجيهه نحو الصواب برفق وتشجيع
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handlePlayAll(correctiveItems)}
                  className="self-start sm:self-auto text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  تشغيل قسم التوجيه متتالياً
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {correctiveItems.map((item) => (
                  <FeedbackCard
                    key={item.id}
                    item={item}
                    isPlaying={playingState.id === item.id && playingState.isPlaying}
                    isLoading={playingState.id === item.id && playingState.isLoading}
                    onPlay={handlePlayCard}
                    onDownload={handleDownloadCard}
                    globalDialect={globalDialect}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Section 3: General Motivation (البناء والتحفيز) */}
          {(activeTab === 'all' || activeTab === 'motivation') && motivationItems.length > 0 && (
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-sky-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      ثَالِثًا: نَمَاذِجُ عَامَّةٌ لِلْبِنَاءِ وَالتَّحْفِيزِ
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      مستخرجة من صفحة 2 بالملف • غرس عقلية النمو والالتزام وتقدير التطور المستمر
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handlePlayAll(motivationItems)}
                  className="self-start sm:self-auto text-xs font-bold text-sky-700 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg border border-sky-200 transition flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  تشغيل قسم التحفيز متتالياً
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {motivationItems.map((item) => (
                  <FeedbackCard
                    key={item.id}
                    item={item}
                    isPlaying={playingState.id === item.id && playingState.isPlaying}
                    isLoading={playingState.id === item.id && playingState.isLoading}
                    onPlay={handlePlayCard}
                    onDownload={handleDownloadCard}
                    globalDialect={globalDialect}
                  />
                ))}
              </div>
            </section>
          )}

          {filteredItems.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <FileCheck className="w-12 h-12 text-slate-400 mx-auto" />
              <h4 className="font-bold text-slate-700">لم يتم العثور على نتائج مطابقة</h4>
              <p className="text-xs text-slate-500">جرب البحث بكلمة مختلفة مثل: ذكاء، إتقان، هدف، تفوق</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveTab('all');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-semibold rounded-lg transition"
              >
                إعادة ضبط البحث
              </button>
            </div>
          )}
        </div>

        {/* Pedagogical Feature Callout */}
        <section className="bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-100 rounded-3xl p-6 sm:p-8 border border-emerald-200/60 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h4 className="font-bold text-base text-emerald-950 flex items-center gap-2">
              <Heart className="w-5 h-5 text-emerald-600 fill-emerald-600" />
              لماذا التغذية الراجعة باللهجة السعودية الطبيعية؟
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              تؤكد الدراسات التربوية الحديثة أن تعزيز الطلاب والتصويب اللطيف بنبرة بيضاء قريبة من لهجة البيئة المدرسية يكسر حاجز الخوف من الخطأ، ويعزز الثقة بالنفس، ويجعل المتعلم يشعر بقرب معلمه وفخره الصادق به.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsStudioModalOpen(true)}
            className="shrink-0 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            جرب نطق اسم طالب في فصلك الآن
          </button>
        </section>
      </main>

      {/* Floating Audio Player */}
      <MasterAudioPlayer
        state={playingState}
        onPause={pauseAudio}
        onPlayAgain={() => {
          if (playingState.id) {
            playAudio({
              id: playingState.id,
              title: playingState.title,
              category: playingState.category,
              text: playingState.text,
              voiceName: selectedVoice,
              isSaudiDialect: globalDialect === 'saudi',
            });
          }
        }}
        onSeek={seek}
        onClose={stopAll}
        onDownload={() => downloadAudio(playingState.audioUrl, playingState.title || 'تسجيل_صوتي')}
        playbackRate={playbackRate}
      />

      {/* PDF Viewer Modal */}
      <PdfViewerModal isOpen={isPdfModalOpen} onClose={() => setIsPdfModalOpen(false)} />

      {/* Custom Studio Modal */}
      <CustomStudioModal
        isOpen={isStudioModalOpen}
        onClose={() => setIsStudioModalOpen(false)}
        selectedVoice={selectedVoice}
        onPlayAudio={playAudio}
        isPlaying={playingState.isPlaying}
        currentPlayingId={playingState.id}
        downloadAudio={downloadAudio}
      />
    </div>
  );
}
