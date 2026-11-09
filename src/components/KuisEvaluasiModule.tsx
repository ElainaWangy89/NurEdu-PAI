import React, { useState } from 'react';
import { QUIZ_BANK } from '../data/paiData';
import { QuizQuestion } from '../types';
import { calculateQuizScore } from '../utils/paiLogic';
import { recordQuizAttempt } from '../utils/progress';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  RefreshCw,
  Printer,
  Heart,
  Timer,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

export const KuisEvaluasiModule: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>(QUIZ_BANK);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [scoreCount, setScoreCount] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [studentName, setStudentName] = useState<string>('Ahmad Fauzan');

  const currentQ: QuizQuestion = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctAnswer) {
      setScoreCount((prev) => prev + 1);
    } else {
      setLives((prev) => Math.max(0, prev - 1));
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length && lives > 0) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      const finalScore = Math.round((scoreCount / questions.length) * 100);
      recordQuizAttempt(finalScore, scoreCount, questions.length);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScoreCount(0);
    setLives(3);
    setIsFinished(false);
  };

  const scoreResult = calculateQuizScore(questions.length, scoreCount);

  return (
    <div className="space-y-8 py-6">
      {/* Title */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Kuis & Asesmen Formatif PAI Terintegrasi
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Uji pemahaman komprehensif Al-Qur'an Hadis, Akidah, Akhlak, Fikih, dan Sejarah Kebudayaan Islam
        </p>
      </div>

      {!isFinished ? (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Top HUD: Question count, Lives & Progress */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                  Soal {currentIndex + 1} dari {questions.length}
                </span>
                <span>·</span>
                <span>{currentQ.strand}</span>
                <span>·</span>
                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                  Level {currentQ.level}
                </span>
              </div>

              {/* Lives Hearts */}
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((heart) => (
                  <Heart
                    key={heart}
                    className={`w-4 h-4 transition-colors ${
                      heart <= lives
                        ? 'fill-red-500 text-red-500'
                        : 'fill-slate-200 dark:fill-slate-700 text-slate-300 dark:text-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
              {currentQ.question}
            </h3>

            {/* Arabic Snippet if present */}
            {currentQ.arabicSnippet && (
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-right font-arabic text-2xl font-bold text-slate-900 dark:text-white leading-loose">
                {currentQ.arabicSnippet}
              </div>
            )}

            {/* Options List */}
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctAnswer;

                let optionStyle =
                  'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300';
                if (isAnswered) {
                  if (isCorrect) {
                    optionStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-100';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'bg-red-50 dark:bg-red-950/60 border-red-500 text-red-900 dark:text-red-100';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="text-sm font-medium leading-relaxed">{option}</span>
                    </div>

                    {isAnswered && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Instant Feedback & Dalil Explanation */}
            {isAnswered && (
              <div className="space-y-4 pt-2">
                <div
                  className={`p-5 rounded-2xl border ${
                    selectedOption === currentQ.correctAnswer
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
                      : 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm mb-1.5">
                    {selectedOption === currentQ.correctAnswer ? (
                      <span className="text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Jawaban Tepat!
                      </span>
                    ) : (
                      <span className="text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                        <XCircle className="w-4 h-4" /> Pembahasan Jawaban Benar:
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {currentQ.explanation}
                  </p>
                  <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 italic">
                    Sumber Rujukan: {currentQ.dalilSource}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <span>{currentIndex + 1 < questions.length && lives > 0 ? 'Soal Berikutnya' : 'Lihat Hasil Akhir'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ================= RESULTS & CERTIFICATE VIEW ================= */
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Certificate Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border-4 border-emerald-600/30 dark:border-emerald-500/30 shadow-xl space-y-6 relative overflow-hidden text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold tracking-widest text-emerald-700 dark:text-emerald-400 uppercase">
                Sertifikat Capaian Asesmen PAI
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Hasil Evaluasi Pembelajaran
              </h3>
            </div>

            {/* Student Name */}
            <div className="py-2">
              <label className="block text-xs text-slate-400 mb-1">Nama Siswa / Peserta Didik:</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="text-center font-bold text-lg sm:text-xl text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-1.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Big Score Box */}
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-2">
              <div className="text-4xl sm:text-5xl font-black text-emerald-800 dark:text-emerald-200">
                {scoreResult.percentage}%
              </div>
              <div className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                Predikat: {scoreResult.grade}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Menjawab benar {scoreCount} dari {questions.length} soal
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
              "Menuntut ilmu itu wajib atas setiap muslim. Semoga ilmu yang dipelajari menjadi berkah dan memancarkan akhlak mulia dalam kehidupan bermasyarakat."
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Unduh Rapor</span>
              </button>
              <button
                onClick={handleRestart}
                className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Ulangi Kuis</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
