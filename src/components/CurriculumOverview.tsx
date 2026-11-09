import React, { useState, useEffect } from 'react';
import { TabType } from '../types';
import {
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Video,
  Scale,
  Sparkles,
  ArrowRight,
  Compass,
  FileQuestion,
  RotateCcw,
  Trophy,
  Target,
  Award,
  Crown,
  Coins,
  Lock,
} from 'lucide-react';
import {
  loadUserProgress,
  calculateProgressPercentage,
  clearUserProgress,
  evaluateBadges,
  BadgeItem,
  MILESTONE_DEFINITIONS,
  UserProgress,
} from '../utils/progress';
import { PrayerReminderWidget } from './PrayerReminderWidget';

interface CurriculumOverviewProps {
  onNavigate: (tab: TabType) => void;
}

export const CurriculumOverview: React.FC<CurriculumOverviewProps> = ({ onNavigate }) => {
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress());

  // Listen to progress updates from localStorage across components
  useEffect(() => {
    const handleUpdate = () => {
      setProgress(loadUserProgress());
    };
    window.addEventListener('nuredu_progress_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('nuredu_progress_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const { percentage, completedCount, totalCount } = calculateProgressPercentage(
    progress.completedLessons,
    progress.quizRecord
  );

  const {
    badges,
    unlockedCount: unlockedBadgesCount,
    totalCount: totalBadgesCount,
  } = evaluateBadges(
    progress.completedLessons,
    progress.quizRecord,
    progress.unlockedBadges
  );

  const handleResetProgress = () => {
    if (window.confirm('Apakah kamu yakin ingin mereset seluruh progres belajar dan lencana?')) {
      clearUserProgress();
      setProgress(loadUserProgress());
    }
  };

  const isLessonDone = (id: string) => progress.completedLessons.includes(id);

  const renderBadgeIcon = (iconName: BadgeItem['iconName'], isUnlocked: boolean) => {
    switch (iconName) {
      case 'book':
        return <BookOpen className={`w-5 h-5 ${isUnlocked ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`} />;
      case 'compass':
        return <Compass className={`w-5 h-5 ${isUnlocked ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`} />;
      case 'coins':
        return <Coins className={`w-5 h-5 ${isUnlocked ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'}`} />;
      case 'scale':
        return <Scale className={`w-5 h-5 ${isUnlocked ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />;
      case 'trophy':
        return <Trophy className={`w-5 h-5 ${isUnlocked ? 'text-amber-500 dark:text-amber-300' : 'text-slate-400 dark:text-slate-500'}`} />;
      case 'crown':
        return <Crown className={`w-5 h-5 ${isUnlocked ? 'text-yellow-600 dark:text-yellow-400' : 'text-slate-400 dark:text-slate-500'}`} />;
      default:
        return <Award className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-12 py-6">
      {/* Hero Banner Section */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl border border-emerald-700/40">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300 bg-emerald-800/60 px-3 py-1 rounded-full border border-emerald-600/30">
            <span>Rancangan Produk Media Pembelajaran PAI Digital</span>
            <span>·</span>
            <span>Standar Kurikulum Merdeka</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Transformasi Pendidikan Agama Islam Interaktif & Kontekstual
          </h1>

          <p className="text-emerald-100/90 text-base sm:text-lg leading-relaxed">
            Platform komprehensif yang dirancang untuk memfasilitasi pembelajaran bermakna (meaningful learning)
            melalui visualisasi hukum tajwid, simulasi tata cara ibadah shalat, penalaran moral studi kasus nyata,
            asesmen adaptif, serta studio pembuatan materi visual 4K dan animasi video edukasi islami.
          </p>

          <div className="pt-4 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('kasus')}
              className="px-5 py-2.5 bg-white text-emerald-950 hover:bg-emerald-50 font-semibold text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <span>Eksplorasi Studi Kasus</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('studio')}
              className="px-5 py-2.5 bg-emerald-700/80 hover:bg-emerald-600 text-white font-medium text-sm rounded-xl border border-emerald-500/30 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Buka Studio Kreatif AI</span>
            </button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute -right-12 -bottom-16 w-96 h-96 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none" />
        <div className="absolute right-12 top-10 opacity-10 text-9xl font-arabic pointer-events-none select-none">
          اقْرَأْ
        </div>
      </section>

      {/* USER PROGRESS TRACKING CARD (Local Storage Powered) */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              <Target className="w-4 h-4" />
              <span>Progres Belajar Pengguna (Tersimpan Otomatis)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Capaian Pembelajaran Mandiri
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {progress.quizRecord && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold">
                <Trophy className="w-4 h-4" />
                <span>Skor Kuis Terbaik: {progress.quizRecord.highestScore}%</span>
              </div>
            )}

            <button
              onClick={handleResetProgress}
              className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              title="Reset data progres di peramban ini"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Progres</span>
            </button>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
            <span>
              Tuntas {completedCount} dari {totalCount} Capaian Materi PAI
            </span>
            <span className="font-extrabold text-emerald-700 dark:text-emerald-400 text-base">
              {percentage}% Selesai
            </span>
          </div>

          {/* Interactive Visual Bar */}
          <div
            className="w-full bg-slate-100 dark:bg-slate-800 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700/60"
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progres Belajar PAI"
          >
            <div
              className="bg-gradient-to-r from-emerald-600 to-teal-500 h-full rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Milestone Pills Grid */}
        <div className="pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Daftar Milestone Capaian Kurikulum:
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {MILESTONE_DEFINITIONS.map((m) => {
              const done =
                isLessonDone(m.id) ||
                (m.id === 'quiz-evaluation' && (progress.quizRecord?.passed ?? false));
              return (
                <div
                  key={m.id}
                  className={`p-3 rounded-xl border text-left transition-colors flex flex-col justify-between gap-1.5 ${
                    done
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                      {m.category}
                    </span>
                    {done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                    )}
                  </div>
                  <div
                    className={`text-xs font-bold leading-tight ${
                      done
                        ? 'text-emerald-950 dark:text-emerald-200'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {m.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS & BADGES SYSTEM (Stored in LocalStorage) */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Sistem Pencapaian Prestasi Siswa</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Lencana Prestasi Belajar (Badges)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Buka lencana kehormatan dengan menuntaskan milestone materi atau meraih skor kuis tinggi (tersimpan otomatis)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>{unlockedBadgesCount} dari {totalBadgesCount} Lencana Terbuka ({Math.round((unlockedBadgesCount / totalBadgesCount) * 100)}%)</span>
            </div>
          </div>
        </div>

        {/* Badges Grid (6 Badges) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => {
            return (
              <div
                key={badge.id}
                className={`rounded-2xl p-5 border transition-all flex flex-col justify-between space-y-4 ${
                  badge.isUnlocked
                    ? 'bg-gradient-to-br from-amber-50/50 via-white to-emerald-50/40 dark:from-amber-950/20 dark:via-slate-900 dark:to-emerald-950/20 border-amber-300/80 dark:border-amber-700/60 shadow-xs'
                    : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-80'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      badge.isUnlocked
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 shadow-inner'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                    }`}>
                      {renderBadgeIcon(badge.iconName, badge.isUnlocked)}
                    </div>

                    {badge.isUnlocked ? (
                      <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Terbuka
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-400" /> Terkunci
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-0.5">
                      {badge.category}
                    </div>
                    <h3 className={`text-base font-bold ${
                      badge.isUnlocked
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}>
                      {badge.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  {badge.isUnlocked ? (
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-medium">
                      <Sparkles className="w-3 h-3" />
                      <span>{badge.unlockedAt ? `Diraih: ${new Date(badge.unlockedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}` : 'Tercapai'}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {badge.criterion}
                      </span>
                      {badge.targetTab && (
                        <button
                          onClick={() => onNavigate(badge.targetTab!)}
                          className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-0.5 shrink-0 hover:underline"
                        >
                          <span>Mulai</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PRAYER REMINDER WIDGET (Geolocation & Kemenag Astronomical Formula) */}
      <section>
        <PrayerReminderWidget />
      </section>

      {/* Blueprint Struktur Konten Interaktif */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Arsitektur Struktur Konten Media Pembelajaran
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Desain alur pembelajaran hierarkis berbasis 5 Elemen Capaian Pembelajaran (CP) PAI
            </p>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Fase D (SMP) & Fase E/F (SMA/SMK)
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Al-Qur'an & Hadis */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                {isLessonDone('tajwid-rules') && isLessonDone('surah-tadabbur') ? (
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                  </span>
                ) : null}
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                1. Al-Qur'an & Tajwid Interaktif
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Visualisasi interaktif hukum bacaan Nun Sukun, Tanwin, Mim Sukun, dan Qalqalah dengan kode warna,
                audio pelafalan makhraj, serta tadabbur ayat bertema persaudaraan & anti-hoaks (QS. Al-Hujurat 10-12).
              </p>
              <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Highlight huruf & pelafalan audio</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Teks Arab, Latin & Tafsir kontekstual</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('tajwid')}
              className="mt-6 w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700/50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Buka Modul Tajwid</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 2. Fikih Ibadah */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Compass className="w-5 h-5" />
                </div>
                {isLessonDone('shalat-guide') && isLessonDone('zakat-calculator') ? (
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                  </span>
                ) : null}
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                2. Fikih Ibadah & Tata Cara Shalat
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Simulator panduan rukun shalat 5 waktu dan wudhu langkah demi langkah. Dilengkapi bacaan niat, takbir,
                ruku’, i’tidal, sujud sempurna 7 anggota badan, hingga salam serta kalkulator zakat fitrah & maal.
              </p>
              <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Cek kelurusan rukun shalat & tuma’ninah</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kalkulator Nisab Zakat otomatis</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('fikih')}
              className="mt-6 w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700/50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Buka Modul Fikih</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 3. Studi Kasus Akhlak */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 flex items-center justify-center font-bold">
                  <Scale className="w-5 h-5" />
                </div>
                {isLessonDone('kasus-integritas-ujian') &&
                isLessonDone('kasus-tabayyun-medsos') &&
                isLessonDone('kasus-moderasi-toleransi') ? (
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                  </span>
                ) : null}
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                3. Studi Kasus & Dilema Moral
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Pembelajaran berbasis masalah (PBL) yang menghadirkan skenario nyata siswa: kejujuran saat ujian,
                etika bermedia sosial melawan fitnah siber (tabayyun), dan adab toleransi bertetangga majemuk.
              </p>
              <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Percabangan keputusan & dampak moral</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Rujukan dalil Al-Qur'an & Hadis Shahih</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('kasus')}
              className="mt-6 w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700/50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Coba Studi Kasus</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4. Kuis & Evaluasi */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
                  <HelpCircle className="w-5 h-5" />
                </div>
                {progress.quizRecord?.passed ? (
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Tuntas ({progress.quizRecord.highestScore}%)
                  </span>
                ) : null}
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                4. Kuis & Asesmen Formatif
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Evaluasi adaptif dengan soal berbasis HOTS (Higher Order Thinking Skills), penghitungan skor seketika,
                pembahasan komprehensif, dan pencetakan Sertifikat Capaian Belajar siswa.
              </p>
              <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Timer & sistem nyawa gamifikasi</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Unduh Sertifikat Predikat Mumtaz</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('kuis')}
              className="mt-6 w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700/50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Mulai Kuis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 5. Video Pembelajaran */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 flex items-center justify-center font-bold">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                5. Video Pembelajaran Kurikuler
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Koleksi video animasi konsep PAI: rekonstruksi shalat khusyuk, rute perjalanan hijrah Nabi SAW
                membangun peradaban Madinah, dan visualisasi getaran dengung huruf Al-Qur'an.
              </p>
              <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Poin intisari materi & pertanyaan refleksi</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Navigasi waktu & topik fleksibel</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('video')}
              className="mt-6 w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700/50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Lihat Video</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 6. Studio AI Kreatif */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-slate-800 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800/60 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                6. Studio Media Kreatif AI (1K/2K/4K & Video)
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Fasilitas mutakhir bagi pendidik & peserta didik:
                <br />• <strong>Generator Gambar Resolusi Tinggi</strong> (Model <code className="text-xs bg-emerald-100 dark:bg-emerald-900 px-1 py-0.5 rounded">gemini-3-pro-image-preview</code>) opsi <strong>1K, 2K, 4K</strong>.
                <br />• <strong>Studio Animasi Video</strong> (Model <code className="text-xs bg-emerald-100 dark:bg-emerald-900 px-1 py-0.5 rounded">gemini-omni-1.2-flash</code>) rasio <strong>16:9</strong> / <strong>9:16</strong>.
              </p>
              <div className="pt-2 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Unggah foto & ubah jadi video ajar</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Preset prompt arsitektur masjid & sejarah</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('studio')}
              className="mt-6 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Buka Studio Kreatif AI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Rincian Ide Kuis, Video & Studi Kasus Relevan Kurikulum */}
      <section className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 space-y-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Konsep Desain Pembelajaran: Kuis, Video & Studi Kasus
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Penjelasan metodologi pedagogis kurikulum PAI abad ke-21 yang diimplementasikan pada website ini
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
              <FileQuestion className="w-4 h-4" />
              <span>1. Ide Kuis Adaptif & HOTS</span>
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">
              Bukan Sekadar Hafalan, Uji Penalaran Kontekstual
            </h4>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-disc pl-4 leading-relaxed">
              <li>
                <strong>Kuis Analisis Tajwid:</strong> Menampilkan potongan mushaf Al-Qur'an asli, siswa menganalisis sebab terjadinya hukum bacaan (bukan sekadar menghafal huruf).
              </li>
              <li>
                <strong>Tantangan Situasi Fikih:</strong> Mengidentifikasi keabsahan shalat saat terjadi keraguan rakaat (sujud sahwi) dan kondisi musafir (jama’ qashar).
              </li>
              <li>
                <strong>Gamifikasi Umpan Balik:</strong> Penjelasan seketika mengutip dalil Al-Qur'an/Hadis, memberikan reward predikat akademik (Mumtaz, Jayyid Jiddan).
              </li>
            </ul>
          </div>

          <div className="space-y-3 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold text-sm">
              <Video className="w-4 h-4" />
              <span>2. Ide Video Pembelajaran Animasi</span>
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">
              Visualisasi Kinestetik & Rekonstruksi Sejarah
            </h4>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-disc pl-4 leading-relaxed">
              <li>
                <strong>Video Animasi Sujud 7 Anggota Tubuh:</strong> Memperlihatkan sudut kelurusan tulang belakang dan titik kontak lantai untuk menghindari batalnya rukun shalat.
              </li>
              <li>
                <strong>Video Eksplorasi Piagam Madinah:</strong> Menggambarkan suasana multikultural kota Madinah saat Rasulullah SAW meletakkan dasar piagam hak asasi pertama dunia.
              </li>
              <li>
                <strong>Animasi Al-Qur'an 9:16 & 16:9:</strong> Format fleksibel yang dapat di-generate langsung dari foto menggunakan Gemini Omni Flash untuk media tayang di kelas atau gawai siswa.
              </li>
            </ul>
          </div>

          <div className="space-y-3 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold text-sm">
              <Scale className="w-4 h-4" />
              <span>3. Ide Studi Kasus Dilema Moral</span>
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">
              Scenario-Based Learning & Pembiasaan Akhlak
            </h4>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-disc pl-4 leading-relaxed">
              <li>
                <strong>Dilema Menemukan Bocoran Soal Ujian:</strong> Menguji integritas siswa antara rasa takut dikucilkan teman vs ketaatan atas sifat muraqabatullah.
              </li>
              <li>
                <strong>Dilema Tabayyun di Media Sosial:</strong> Menghadapi video provokatif yang menjelekkan guru/teman di grup WA/TikTok sebelum terbukti kebenarannya.
              </li>
              <li>
                <strong>Dilema Toleransi Sosial:</strong> Praktik adab bertetangga dengan warga berbeda agama yang sedang berduka (menghormati martabat kemanusiaan).
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
