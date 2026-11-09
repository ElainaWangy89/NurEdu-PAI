import React, { useState } from 'react';
import { CASE_STUDIES } from '../data/paiData';
import { CaseStudy, CaseStudyChoice } from '../types';
import { evaluateMoralImpact } from '../utils/paiLogic';
import { markLessonAsCompleted } from '../utils/progress';
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Send,
  Sparkles,
  RefreshCw,
  MessageCircleQuestion,
  HelpCircle,
} from 'lucide-react';

export const StudiKasusModule: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<CaseStudy>(CASE_STUDIES[0]);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);

  // AI Consultation State
  const [consultQuestion, setConsultQuestion] = useState<string>('');
  const [consultAnswer, setConsultAnswer] = useState<string | null>(null);
  const [isConsulting, setIsConsulting] = useState<boolean>(false);
  const [consultError, setConsultError] = useState<string | null>(null);

  const activeChoice: CaseStudyChoice | undefined = selectedCase.choices.find(
    (c) => c.id === selectedChoiceId
  );

  const handleSelectChoice = (choiceId: string) => {
    setSelectedChoiceId(choiceId);
    setShowAnalysis(true);
    markLessonAsCompleted(selectedCase.id);
  };

  const handleReset = () => {
    setSelectedChoiceId(null);
    setShowAnalysis(false);
  };

  const handleConsultAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultQuestion.trim()) return;

    setIsConsulting(true);
    setConsultError(null);
    setConsultAnswer(null);

    try {
      const res = await fetch('/api/consult-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: consultQuestion,
          topic: `Studi Kasus PAI: ${selectedCase.title}`,
          level: selectedCase.targetGrade,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal berkonsultasi dengan asisten PAI.');
      }

      setConsultAnswer(data.answer);
    } catch (err: any) {
      setConsultError(err.message || 'Terjadi gangguan saat memproses jawaban.');
    } finally {
      setIsConsulting(false);
    }
  };

  return (
    <div className="space-y-8 py-6">
      {/* Module Title */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Studi Kasus & Pembiasaan Akhlak (Problem-Based Learning)
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Pecahkan dilema etika nyata siswa abad ke-21 berlandaskan nilai kejujuran, tabayyun, dan moderasi beragama
        </p>
      </div>

      {/* Case Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CASE_STUDIES.map((c) => {
          const isSelected = selectedCase.id === c.id;
          return (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCase(c);
                handleReset();
                setConsultAnswer(null);
              }}
              className={`p-5 rounded-2xl border text-left transition-all space-y-2 flex flex-col justify-between ${
                isSelected
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    {c.pillar}
                  </span>
                  <span className="text-slate-400">{c.targetGrade}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                  {c.title}
                </h4>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 pt-2 flex items-center gap-1 font-medium">
                <span>{c.choices.length} Opsi Tindakan</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Case Workspace */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
        {/* Story Context Box */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full font-semibold">
              {selectedCase.pillar}
            </span>
            <span>·</span>
            <span>Target: {selectedCase.targetGrade}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {selectedCase.title}
          </h3>

          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Skenario Peristiwa
            </h5>
            <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed">
              {selectedCase.storyline}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                Pertanyaan Dilema
              </h5>
              <p className="text-sm font-semibold text-amber-950 dark:text-amber-100 mt-0.5">
                {selectedCase.dilemmaQuestion}
              </p>
            </div>
          </div>
        </div>

        {/* Action Choices */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Pilihlah Tindakan yang Paling Tepat Menurut Syariat Islam:
          </h4>

          <div className="grid grid-cols-1 gap-3.5">
            {selectedCase.choices.map((choice, idx) => {
              const isSelected = selectedChoiceId === choice.id;
              return (
                <button
                  key={choice.id}
                  onClick={() => handleSelectChoice(choice.id)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                    isSelected
                      ? choice.isRecommended
                        ? 'bg-emerald-50/90 dark:bg-emerald-950/50 border-emerald-500 shadow-sm'
                        : 'bg-amber-50/90 dark:bg-amber-950/50 border-amber-500 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      isSelected
                        ? choice.isRecommended
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <div className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                    {choice.text}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Moral Evaluation & Dalil Reference */}
        {showAnalysis && activeChoice && (
          <div
            className={`p-6 sm:p-8 rounded-3xl border space-y-6 transition-all ${
              activeChoice.isRecommended
                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                : 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {activeChoice.isRecommended ? (
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-sm">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                    {activeChoice.isRecommended ? 'Pilihan Teladan & Tepat!' : 'Perlu Direnungkan Kembali'}
                  </h4>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Skor Integritas Moral: <strong>{activeChoice.scoreImpact} / 100</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="px-3.5 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Coba Opsi Lain</span>
              </button>
            </div>

            {/* Analysis Text */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Ulasan Moral & Dampak Tindakan
              </h5>
              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                {activeChoice.analysis}
              </p>
            </div>

            {/* Dalil Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <BookOpen className="w-4 h-4" />
                <span>Rujukan Dalil Naqli: {activeChoice.dalil.source}</span>
              </div>

              {activeChoice.dalil.arabic && (
                <p className="text-right font-arabic text-xl sm:text-2xl text-slate-900 dark:text-white leading-loose">
                  {activeChoice.dalil.arabic}
                </p>
              )}

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic">
                "{activeChoice.dalil.translation}"
              </p>
            </div>
          </div>
        )}

        {/* AI Consultation Desk (Tanya Guru Ahli PAI) */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-8 space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span>Tanya Guru Ahli PAI (Konsultasi Dilema & Dalil Kontekstual)</span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Punya pertanyaan mengenai kasus ini atau situasi etika serupa yang kamu alami? Ajukan pertanyaanmu untuk mendapatkan nasihat berbasis syariat yang moderat.
          </p>

          <form onSubmit={handleConsultAI} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tuliskan pertanyaanmu (misal: Bagaimana jika saya diancam teman karena menolak berbuat curang?)..."
                value={consultQuestion}
                onChange={(e) => setConsultQuestion(e.target.value)}
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                disabled={isConsulting || !consultQuestion.trim()}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
              >
                {isConsulting ? (
                  <span>Menjawab...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Kirim</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {consultError && (
            <div className="p-3 text-xs text-red-600 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900">
              {consultError}
            </div>
          )}

          {consultAnswer && (
            <div className="p-6 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-3">
              <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Nasihat Guru Ahli PAI:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                {consultAnswer}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
