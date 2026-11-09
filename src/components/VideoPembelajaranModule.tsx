import React, { useState } from 'react';
import { LEARNING_VIDEOS } from '../data/paiData';
import { LearningVideoItem, TabType } from '../types';
import {
  Video,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Clock,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface VideoPembelajaranProps {
  onGoToStudio: () => void;
}

export const VideoPembelajaranModule: React.FC<VideoPembelajaranProps> = ({ onGoToStudio }) => {
  const [selectedVideo, setSelectedVideo] = useState<LearningVideoItem>(LEARNING_VIDEOS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number | null>(null);

  return (
    <div className="space-y-8 py-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Video Pembelajaran PAI & Animasi Konsep
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Media audio-visual beranimasi untuk memperjelas makhraj, gerakan rukun ibadah, dan peristiwa sejarah Islam
          </p>
        </div>

        <button
          onClick={onGoToStudio}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-sm shrink-0"
        >
          <Sparkles className="w-4 h-4 text-emerald-200" />
          <span>Buat Video Sendiri di Studio AI</span>
        </button>
      </div>

      {/* Main Video Screen & Selector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Video Player Stage (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          {/* Simulated Video Canvas / Player Area */}
          <div className="relative aspect-video w-full rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 overflow-hidden flex flex-col items-center justify-center p-6 border border-emerald-900/50 shadow-inner group">
            {/* Ambient Animated Particles / Waves */}
            <div
              className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.25)_0%,_transparent_70%)] transition-opacity duration-1000 ${
                isPlaying ? 'opacity-100 animate-pulse' : 'opacity-40'
              }`}
            />

            <div className="relative z-10 text-center space-y-3 max-w-md">
              <span className="text-xs font-semibold text-emerald-300 uppercase tracking-widest bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-700/40">
                {selectedVideo.subject}
              </span>
              <h4 className="text-lg sm:text-xl font-bold text-white leading-snug">
                {selectedVideo.title}
              </h4>
              <p className="text-xs text-emerald-100/80 line-clamp-2">
                {selectedVideo.description}
              </p>

              {/* Play / Pause Big Button */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 mx-auto rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
                aria-label={isPlaying ? 'Jeda video' : 'Putar video'}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>
            </div>

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 backdrop-blur-xs p-3 flex items-center justify-between text-xs text-slate-300 border-t border-slate-800">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsPlaying(true)}
                  className="hover:text-emerald-400 transition-colors"
                  aria-label="Ulangi video"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <span className="text-[11px] text-slate-400">
                  {isPlaying ? '02:15' : '00:00'} / {selectedVideo.duration}
                </span>
              </div>

              <span className="text-[11px] text-emerald-400 font-medium">
                {selectedVideo.gradeLevel}
              </span>
            </div>
          </div>

          {/* Video Information */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {selectedVideo.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedVideo.description}
            </p>
          </div>

          {/* Key Concept Takeaways */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Poin Penting Konsep Materi
            </h5>
            <ul className="space-y-2">
              {selectedVideo.keyConcepts.map((concept, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{concept}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Video Catalog & Interactive Check-in (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Catalog List */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Daftar Video Kurikulum PAI
            </h4>

            <div className="space-y-3">
              {LEARNING_VIDEOS.map((vid) => {
                const isSelected = vid.id === selectedVideo.id;
                return (
                  <button
                    key={vid.id}
                    onClick={() => {
                      setSelectedVideo(vid);
                      setIsPlaying(false);
                      setActiveQuestionIdx(null);
                    }}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <Play className="w-3.5 h-3.5 ml-0.5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                        <span>{vid.subject}</span>
                        <span>·</span>
                        <span>{vid.duration}</span>
                      </div>
                      <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {vid.title}
                      </h5>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Video Reflection Question */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>Cek Pemahaman Pasca Menonton</span>
            </div>

            <div className="space-y-3">
              {selectedVideo.interactiveQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2"
                >
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                    {q.question}
                  </p>
                  {activeQuestionIdx === idx ? (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-900 dark:text-emerald-200">
                      <strong>Jawaban Kunci:</strong> {q.answer}
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveQuestionIdx(idx)}
                      className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                    >
                      Buka Kunci Jawaban
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
