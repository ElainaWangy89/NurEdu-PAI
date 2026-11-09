export type TabType = 
  | 'kurikulum'
  | 'tajwid'
  | 'fikih'
  | 'kasus'
  | 'kuis'
  | 'video'
  | 'studio';

export interface TajwidRule {
  id: string;
  name: string;
  arabicName: string;
  category: 'Nun Sukun & Tanwin' | 'Mim Sukun' | 'Hukum Mad' | 'Hukum Ra & Lam' | 'Qalqalah';
  definition: string;
  letters: string[];
  examples: {
    surah: string;
    arabic: string;
    latin: string;
    highlightWord: string;
    meaning: string;
  }[];
  pronunciationTip: string;
}

export interface SurahItem {
  id: string;
  number: number;
  name: string;
  arabicName: string;
  meaning: string;
  versesCount: number;
  type: 'Makkiyah' | 'Madaniyah';
  theme: string;
  asbabunNuzul: string;
  verses: {
    number: number;
    arabic: string;
    latin: string;
    translation: string;
    tajwidNotes?: string;
  }[];
}

export interface ShalatStep {
  id: number;
  name: string;
  phase: 'Persiapan / Wudhu' | 'Rukun Shalat' | 'Sunnah & Penutup';
  arabicText: string;
  latinText: string;
  translation: string;
  motionGuide: string;
  fiqihPoints: string[];
  illustrationSymbol: string;
}

export interface CaseStudyChoice {
  id: string;
  text: string;
  isRecommended: boolean;
  scoreImpact: number;
  analysis: string;
  dalil: {
    source: string;
    arabic?: string;
    translation: string;
  };
}

export interface CaseStudy {
  id: string;
  title: string;
  pillar: 'Akhlak Pribadi' | 'Akhlak Sosial & Digital' | 'Toleransi & Moderasi' | 'Kejujuran & Amanah';
  targetGrade: 'SMP (Fase D)' | 'SMA/SMK (Fase E/F)';
  storyline: string;
  dilemmaQuestion: string;
  choices: CaseStudyChoice[];
  pedagogicalObjective: string;
}

export interface QuizQuestion {
  id: string;
  strand: 'Al-Qur\'an Hadis' | 'Akidah' | 'Akhlak' | 'Fikih' | 'SKI (Sejarah)';
  level: 'Dasar' | 'Menengah' | 'HOTS';
  question: string;
  arabicSnippet?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  dalilSource: string;
}

export interface LearningVideoItem {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  duration: string;
  description: string;
  visualThumbnailPrompt: string;
  keyConcepts: string[];
  interactiveQuestions: {
    question: string;
    answer: string;
  }[];
}

export interface GeneratedAsset {
  id: string;
  type: 'image' | 'video';
  url: string;
  prompt: string;
  aspectRatio: string;
  resolution?: string;
  createdAt: string;
}
