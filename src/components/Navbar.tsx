import React from 'react';
import { TabType } from '../types';
import { BookOpen, Sparkles, Moon, Sun } from 'lucide-react';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('kurikulum')}
              className="flex items-center gap-2 text-left focus:outline-none group"
              aria-label="Kembali ke beranda NurEdu PAI"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-emerald-700 transition-colors">
                ن
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                  NurEdu PAI
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4-5 Concise Single-Line Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => setActiveTab('kurikulum')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'kurikulum'
                  ? 'text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/50'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Rancangan Kurikulum
            </button>
            <button
              onClick={() => setActiveTab('tajwid')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'tajwid'
                  ? 'text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/50'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Al-Qur'an & Tajwid
            </button>
            <button
              onClick={() => setActiveTab('fikih')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'fikih'
                  ? 'text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/50'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Fikih Shalat
            </button>
            <button
              onClick={() => setActiveTab('kasus')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'kasus'
                  ? 'text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/50'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Studi Kasus Akhlak
            </button>
            <button
              onClick={() => setActiveTab('kuis')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'kuis'
                  ? 'text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/50'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Kuis & Evaluasi
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'video'
                  ? 'text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/50'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Video Pembelajaran
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action + Theme Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label={isDarkMode ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setActiveTab('studio')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg shadow-sm transition-all whitespace-nowrap ${
                activeTab === 'studio'
                  ? 'bg-emerald-800 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Studio Kreatif AI</span>
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Scrolling Nav */}
        <div className="lg:hidden flex items-center gap-2 py-2 overflow-x-auto border-t border-slate-100 dark:border-slate-800 scrollbar-none text-xs">
          <button
            onClick={() => setActiveTab('kurikulum')}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 ${
              activeTab === 'kurikulum' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Struktur
          </button>
          <button
            onClick={() => setActiveTab('tajwid')}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 ${
              activeTab === 'tajwid' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Al-Qur'an & Tajwid
          </button>
          <button
            onClick={() => setActiveTab('fikih')}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 ${
              activeTab === 'fikih' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Fikih Shalat
          </button>
          <button
            onClick={() => setActiveTab('kasus')}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 ${
              activeTab === 'kasus' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Studi Kasus
          </button>
          <button
            onClick={() => setActiveTab('kuis')}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 ${
              activeTab === 'kuis' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Kuis
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 ${
              activeTab === 'video' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Video Ajar
          </button>
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 ${
              activeTab === 'studio' ? 'bg-emerald-700 text-white font-semibold' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
            }`}
          >
            Studio AI
          </button>
        </div>
      </div>
    </header>
  );
};
