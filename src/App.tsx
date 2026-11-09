import React, { useState, useEffect } from 'react';
import { TabType } from './types';
import { Navbar } from './components/Navbar';
import { CurriculumOverview } from './components/CurriculumOverview';
import { TajwidQuranModule } from './components/TajwidQuranModule';
import { FiqihShalatModule } from './components/FiqihShalatModule';
import { StudiKasusModule } from './components/StudiKasusModule';
import { KuisEvaluasiModule } from './components/KuisEvaluasiModule';
import { VideoPembelajaranModule } from './components/VideoPembelajaranModule';
import { StudioMediaKreatif } from './components/StudioMediaKreatif';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('kurikulum');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Sync dark class on html root element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Support ?autostart=1 query param to jump straight to study modules
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as TabType;
    if (tabParam && ['kurikulum', 'tajwid', 'fikih', 'kasus', 'kuis', 'video', 'studio'].includes(tabParam)) {
      setActiveTab(tabParam);
    } else if (params.get('autostart') === '1') {
      setActiveTab('tajwid');
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Bar Navigation (Strict 3-zone contract) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {activeTab === 'kurikulum' && (
          <CurriculumOverview onNavigate={(tab) => setActiveTab(tab)} />
        )}
        {activeTab === 'tajwid' && <TajwidQuranModule />}
        {activeTab === 'fikih' && <FiqihShalatModule />}
        {activeTab === 'kasus' && <StudiKasusModule />}
        {activeTab === 'kuis' && <KuisEvaluasiModule />}
        {activeTab === 'video' && (
          <VideoPembelajaranModule onGoToStudio={() => setActiveTab('studio')} />
        )}
        {activeTab === 'studio' && <StudioMediaKreatif />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">NurEdu PAI</span>
            <span>·</span>
            <span>Media Pembelajaran Pendidikan Agama Islam Berbasis Web</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>Standar Kurikulum Merdeka</span>
            <span>·</span>
            <span>Didukung Model Google Gemini</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
