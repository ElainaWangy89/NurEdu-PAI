import React, { useState, useEffect } from 'react';
import { TAJWID_RULES, SURAH_LIST } from '../data/paiData';
import { filterTajwidBySearch } from '../utils/paiLogic';
import { markLessonAsCompleted, loadUserProgress } from '../utils/progress';
import { TajwidRule, SurahItem } from '../types';
import { Search, Volume2, BookOpen, Info, Sparkles, Check, ChevronRight, CheckCircle2 } from 'lucide-react';

export const TajwidQuranModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'tajwid' | 'surah'>('tajwid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRule, setSelectedRule] = useState<TajwidRule>(TAJWID_RULES[0]);
  const [selectedSurah, setSelectedSurah] = useState<SurahItem>(SURAH_LIST[0]);
  const [playingExample, setPlayingExample] = useState<string | null>(null);
  const [completedList, setCompletedList] = useState<string[]>(loadUserProgress().completedLessons);

  useEffect(() => {
    const handleUpdate = () => {
      setCompletedList(loadUserProgress().completedLessons);
    };
    window.addEventListener('nuredu_progress_updated', handleUpdate);
    return () => window.removeEventListener('nuredu_progress_updated', handleUpdate);
  }, []);

  const isTajwidDone = completedList.includes('tajwid-rules');
  const isSurahDone = completedList.includes('surah-tadabbur');

  const handleToggleComplete = (id: string) => {
    markLessonAsCompleted(id);
    setCompletedList(loadUserProgress().completedLessons);
  };

  const filteredRules = filterTajwidBySearch(TAJWID_RULES, searchQuery);

  // Play synthetic tone / recitation simulation using Web Audio API
  const playAudioCue = (text: string) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Soft melodic tone representing ghunnah / recitation chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.6);

      setPlayingExample(text);
      setTimeout(() => setPlayingExample(null), 1200);
    } catch {
      // Audio fallback
      setPlayingExample(text);
      setTimeout(() => setPlayingExample(null), 1200);
    }
  };

  return (
    <div className="space-y-8 py-6">
      {/* Header and Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Modul Al-Qur'an & Kaidah Tajwid Interaktif
            </h2>
            {activeSubTab === 'tajwid' && isTajwidDone && (
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Tuntas
              </span>
            )}
            {activeSubTab === 'surah' && isSurahDone && (
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Tuntas
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Pelajari makhraj huruf, hukum bacaan nun sukun/tanwin, serta tadabbur ayat Al-Qur'an tematik
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeSubTab === 'tajwid' ? (
            <button
              onClick={() => handleToggleComplete('tajwid-rules')}
              disabled={isTajwidDone}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 border ${
                isTajwidDone
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{isTajwidDone ? 'Telah Diselesaikan' : 'Tandai Tajwid Selesai'}</span>
            </button>
          ) : (
            <button
              onClick={() => handleToggleComplete('surah-tadabbur')}
              disabled={isSurahDone}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 border ${
                isSurahDone
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{isSurahDone ? 'Telah Diselesaikan' : 'Tandai Surah Selesai'}</span>
            </button>
          )}

          {/* Sub-tab switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0">
          <button
            onClick={() => setActiveSubTab('tajwid')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === 'tajwid'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Kaidah Hukum Tajwid
          </button>
            <button
              onClick={() => setActiveSubTab('surah')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeSubTab === 'surah'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Tadabbur Surah Tematik
            </button>
          </div>
        </div>
      </div>

      {activeSubTab === 'tajwid' ? (
        /* ================= TAJWID VIEW ================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Rule Selector & Search (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Cari hukum tajwid (misal: ikhfa, idgham, huruf ب)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white shadow-sm"
              />
            </div>

            {/* Rules List */}
            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {filteredRules.map((rule) => {
                const isSelected = selectedRule.id === rule.id;
                return (
                  <button
                    key={rule.id}
                    onClick={() => setSelectedRule(rule)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                          {rule.category}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {rule.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                        {rule.definition}
                      </p>
                    </div>

                    <div className="font-arabic text-xl font-bold text-emerald-800 dark:text-emerald-300 shrink-0">
                      {rule.arabicName}
                    </div>
                  </button>
                );
              })}

              {filteredRules.length === 0 && (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  Tidak ada hukum tajwid yang cocok dengan "{searchQuery}".
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Detailed Rule Workbench (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {selectedRule.category}
                </span>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {selectedRule.name}
                </h3>
              </div>
              <span className="text-3xl font-arabic font-bold text-emerald-700 dark:text-emerald-300">
                {selectedRule.arabicName}
              </span>
            </div>

            {/* Definition */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Pengertian & Kaidah Hukum
              </h5>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                {selectedRule.definition}
              </p>
            </div>

            {/* Letters Grid */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Huruf-Huruf Hijaiyah ({selectedRule.letters.length} Huruf)
              </h5>
              <div className="flex flex-wrap gap-2">
                {selectedRule.letters.map((letter, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-arabic text-xl flex items-center justify-center font-bold shadow-xs"
                  >
                    {letter}
                  </div>
                ))}
              </div>
            </div>

            {/* Pronunciation Tip */}
            <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h6 className="text-xs font-bold text-amber-900 dark:text-amber-300">
                  Tips Melafalkan Sesuai Makhraj
                </h6>
                <p className="text-xs text-amber-800 dark:text-amber-200/90 mt-1 leading-relaxed">
                  {selectedRule.pronunciationTip}
                </p>
              </div>
            </div>

            {/* Examples with highlight & audio cue */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Contoh Bacaan dalam Ayat Al-Qur'an
              </h5>
              <div className="space-y-3">
                {selectedRule.examples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        {ex.surah}
                      </span>
                      <button
                        onClick={() => playAudioCue(ex.highlightWord)}
                        className={`px-3 py-1 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all ${
                          playingExample === ex.highlightWord
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{playingExample === ex.highlightWord ? 'Melafalkan...' : 'Dengar Lafal'}</span>
                      </button>
                    </div>

                    <div className="text-right font-arabic text-2xl font-bold text-slate-900 dark:text-white py-1 leading-loose">
                      {ex.arabic}
                    </div>

                    <div className="text-xs font-mono text-emerald-800 dark:text-emerald-300">
                      Bagian Tajwid: <span className="font-bold underline">{ex.highlightWord}</span>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-400 italic">
                      "{ex.meaning}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= SURAH TADABBUR VIEW ================= */
        <div className="space-y-6">
          {/* Surah Selector Tabs */}
          <div className="flex flex-wrap gap-2">
            {SURAH_LIST.map((surah) => (
              <button
                key={surah.id}
                onClick={() => setSelectedSurah(surah)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                  selectedSurah.id === surah.id
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                <span>{surah.name}</span>
                <span className="opacity-80 font-arabic text-base">({surah.arabicName})</span>
              </button>
            ))}
          </div>

          {/* Surah Metadata Card */}
          <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 rounded-2xl shadow-sm space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-200">
              <span>Surah ke-{selectedSurah.number}</span>
              <span>·</span>
              <span>Golongan {selectedSurah.type}</span>
              <span>·</span>
              <span>{selectedSurah.versesCount} Ayat</span>
            </div>
            <h3 className="text-2xl font-bold">
              Surah {selectedSurah.name} ({selectedSurah.meaning})
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed pt-1">
              <strong>Tema Pokok:</strong> {selectedSurah.theme}
            </p>
            <p className="text-xs text-emerald-200/80 pt-1">
              <strong>Asbabun Nuzul:</strong> {selectedSurah.asbabunNuzul}
            </p>
          </div>

          {/* Verses List */}
          <div className="space-y-4">
            {selectedSurah.verses.map((v) => (
              <div
                key={v.number}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center">
                    {v.number}
                  </div>
                  <button
                    onClick={() => playAudioCue(`Ayat ${v.number}`)}
                    className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label={`Dengarkan tilawah ayat ${v.number}`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Arabic Script */}
                <p className="text-right font-arabic text-2xl sm:text-3xl text-slate-900 dark:text-white leading-[2.4] tracking-wide">
                  {v.arabic}
                </p>

                {/* Transliteration */}
                <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-400 font-medium">
                  {v.latin}
                </p>

                {/* Translation */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  "{v.translation}"
                </p>

                {/* Tajwid Note if available */}
                {v.tajwidNotes && (
                  <div className="pt-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-3 py-2 rounded-lg border border-amber-200/60 dark:border-amber-900/40">
                    <strong>Catatan Tajwid:</strong> {v.tajwidNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
