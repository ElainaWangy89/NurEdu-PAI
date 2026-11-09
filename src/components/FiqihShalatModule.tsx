import React, { useState, useEffect } from 'react';
import { SHALAT_STEPS } from '../data/paiData';
import { ShalatStep } from '../types';
import { calculateZakatFitrah, calculateZakatMaal } from '../utils/paiLogic';
import { markLessonAsCompleted, loadUserProgress } from '../utils/progress';
import { PrayerReminderWidget } from './PrayerReminderWidget';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Calculator,
  Volume2,
  AlertCircle,
  HelpCircle,
  Coins,
  Clock,
} from 'lucide-react';

export const FiqihShalatModule: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState<'shalat' | 'jadwal' | 'zakat'>('shalat');
  const [completedList, setCompletedList] = useState<string[]>(loadUserProgress().completedLessons);

  useEffect(() => {
    const handleUpdate = () => {
      setCompletedList(loadUserProgress().completedLessons);
    };
    window.addEventListener('nuredu_progress_updated', handleUpdate);
    return () => window.removeEventListener('nuredu_progress_updated', handleUpdate);
  }, []);

  const isShalatDone = completedList.includes('shalat-guide');
  const isZakatDone = completedList.includes('zakat-calculator');

  const handleToggleComplete = (id: string) => {
    markLessonAsCompleted(id);
    setCompletedList(loadUserProgress().completedLessons);
  };

  // Zakat Calculator State
  const [familyMembers, setFamilyMembers] = useState<number>(4);
  const [ricePrice, setRicePrice] = useState<number>(15000);

  const [wealthAmount, setWealthAmount] = useState<number>(120000000);
  const [goldPrice, setGoldPrice] = useState<number>(1350000);

  const currentStep: ShalatStep = SHALAT_STEPS[currentStepIndex];
  const zakatFitrahResult = calculateZakatFitrah(familyMembers, ricePrice);
  const zakatMaalResult = calculateZakatMaal(wealthAmount, goldPrice);

  return (
    <div className="space-y-8 py-6">
      {/* Module Header and Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Modul Fikih Ibadah Praktis
            </h2>
            {activeSubTab === 'shalat' && isShalatDone && (
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Tuntas
              </span>
            )}
            {activeSubTab === 'zakat' && isZakatDone && (
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Tuntas
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Panduan kinestetik tata cara shalat lima waktu serta kalkulator interaktif zakat fitrah & maal
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeSubTab === 'shalat' ? (
            <button
              onClick={() => handleToggleComplete('shalat-guide')}
              disabled={isShalatDone}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 border ${
                isShalatDone
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{isShalatDone ? 'Telah Diselesaikan' : 'Tandai Shalat Selesai'}</span>
            </button>
          ) : activeSubTab === 'zakat' ? (
            <button
              onClick={() => handleToggleComplete('zakat-calculator')}
              disabled={isZakatDone}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 border ${
                isZakatDone
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{isZakatDone ? 'Telah Diselesaikan' : 'Tandai Zakat Selesai'}</span>
            </button>
          ) : null}

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0">
            <button
              onClick={() => setActiveSubTab('shalat')}
              className={`px-3 sm:px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeSubTab === 'shalat'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Tata Cara Shalat
            </button>
            <button
              onClick={() => setActiveSubTab('jadwal')}
              className={`px-3 sm:px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeSubTab === 'jadwal'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Jadwal & Pengingat</span>
            </button>
            <button
              onClick={() => setActiveSubTab('zakat')}
              className={`px-3 sm:px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeSubTab === 'zakat'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Kalkulator Zakat
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Compact Reminder in Shalat Tab */}
      {activeSubTab === 'shalat' && (
        <PrayerReminderWidget compact={true} />
      )}

      {activeSubTab === 'jadwal' && (
        <PrayerReminderWidget />
      )}

      {activeSubTab === 'shalat' && (
        /* ================= SHALAT SIMULATOR VIEW ================= */
        <div className="space-y-6">
          {/* Step Progress Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span>Rukun ke-{currentStepIndex + 1} dari {SHALAT_STEPS.length}</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                {Math.round(((currentStepIndex + 1) / SHALAT_STEPS.length) * 100)}% Alur Selesai
              </span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentStepIndex + 1) / SHALAT_STEPS.length) * 100}%` }}
              />
            </div>

            {/* Quick Step Buttons */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {SHALAT_STEPS.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                    currentStepIndex === idx
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {idx + 1}. {step.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Main Shalat Stage Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Stage: Posture & Movement Description (6 cols) */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
                  {currentStep.phase}
                </span>
                <span className="text-xs text-slate-400">Langkah {currentStepIndex + 1}</span>
              </div>

              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {currentStep.name}
              </h3>

              {/* Visual Icon Illustration Box */}
              <div className="h-44 sm:h-52 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-100 dark:to-slate-800/80 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 flex flex-col items-center justify-center p-6 text-center space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
                  {currentStepIndex + 1}
                </div>
                <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                  Posisi: {currentStep.illustrationSymbol}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                  Pastikan thuma’ninah (berhenti tenang sejenak) minimal selama bacaan tasbih
                </div>
              </div>

              {/* Motion Guide */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Panduan Gerakan Kinestetik
                </h5>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  {currentStep.motionGuide}
                </p>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  disabled={currentStepIndex === 0}
                  onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Sebelumnya</span>
                </button>

                <button
                  disabled={currentStepIndex === SHALAT_STEPS.length - 1}
                  onClick={() => setCurrentStepIndex((prev) => Math.min(SHALAT_STEPS.length - 1, prev + 1))}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <span>Langkah Berikutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Stage: Recitation (Doa) & Fiqih Points (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              {/* Recitation Box */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Bacaan Doa & Zikir Shalat
                  </h5>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Rukun Qauli / Sunnah
                  </span>
                </div>

                <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 space-y-3">
                  <p className="text-right font-arabic text-2xl sm:text-3xl text-slate-900 dark:text-white leading-[2.2]">
                    {currentStep.arabicText}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-emerald-900 dark:text-emerald-300">
                    {currentStep.latinText}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 italic leading-relaxed">
                    "{currentStep.translation}"
                  </p>
                </div>
              </div>

              {/* Fiqih Checkpoints */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Poin Fikih & Syarat Sah Shalat
                </h5>
                <ul className="space-y-3">
                  {currentStep.fiqihPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= ZAKAT CALCULATOR VIEW ================= */}
      {activeSubTab === 'zakat' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Zakat Fitrah Calculator */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Kalkulator Zakat Fitrah
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Kewajiban per jiwa (2,5 kg atau 3,5 liter beras) di bulan Ramadhan
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Jumlah Jiwa / Anggota Keluarga yang Ditanggung
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={familyMembers}
                  onChange={(e) => setFamilyMembers(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Standar Harga Beras Konsumsi (Rp / kg)
                </label>
                <input
                  type="number"
                  step="500"
                  value={ricePrice}
                  onChange={(e) => setRicePrice(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 dark:text-white"
                />
              </div>

              {/* Results Panel */}
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                <div className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                  Total Zakat Fitrah yang Wajib Dikeluarkan:
                </div>
                <div className="text-2xl font-extrabold text-emerald-950 dark:text-emerald-100">
                  {zakatFitrahResult.kgBeras} kg Beras
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Atau setara tunai: <strong className="text-emerald-700 dark:text-emerald-300">Rp {zakatFitrahResult.rupiahEquivalent.toLocaleString('id-ID')}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Zakat Maal Calculator */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Kalkulator Zakat Maal (Harta)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Nisab setara 85 gram emas murni dengan tarif 2,5% per tahun (haul)
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Total Harta Bersih Tersimpan Selama 1 Tahun (Rp)
                </label>
                <input
                  type="number"
                  step="1000000"
                  value={wealthAmount}
                  onChange={(e) => setWealthAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Harga Emas Murni Saat Ini (Rp / gram)
                </label>
                <input
                  type="number"
                  step="10000"
                  value={goldPrice}
                  onChange={(e) => setGoldPrice(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 dark:text-white"
                />
              </div>

              {/* Maal Result */}
              <div
                className={`p-5 rounded-2xl border space-y-2 ${
                  zakatMaalResult.isObligated
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Ambang Batas Nisab (85g Emas):{' '}
                  <strong>Rp {zakatMaalResult.nisabValue.toLocaleString('id-ID')}</strong>
                </div>

                {zakatMaalResult.isObligated ? (
                  <div>
                    <div className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                      Wajib Zakat Maal (2,5%):
                    </div>
                    <div className="text-2xl font-extrabold text-amber-900 dark:text-amber-200">
                      Rp {zakatMaalResult.zakatDue.toLocaleString('id-ID')}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Harta belum mencapai nisab 85g emas. Belum wajib zakat maal, namun disunnahkan berinfaq/sedekah.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
