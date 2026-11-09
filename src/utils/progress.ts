export interface QuizRecord {
  highestScore: number;
  lastScore: number;
  totalQuestions: number;
  correctAnswers: number;
  lastAttemptAt: string;
  passed: boolean;
}

export interface UserProgress {
  completedLessons: string[]; // List of lesson IDs completed
  quizRecord: QuizRecord | null;
  unlockedBadges: Record<string, string>; // badgeId -> unlockedAt ISO timestamp
  lastActiveTab?: string;
  updatedAt: string;
}

export const TOTAL_CURRICULUM_MILESTONES = 8;

export const MILESTONE_DEFINITIONS = [
  { id: 'tajwid-rules', title: 'Kaidah Hukum Tajwid', category: 'Al-Qur\'an & Hadis' },
  { id: 'surah-tadabbur', title: 'Tadabbur Surah Tematik', category: 'Al-Qur\'an & Hadis' },
  { id: 'shalat-guide', title: 'Tata Cara Shalat Khusyuk', category: 'Fikih Ibadah' },
  { id: 'zakat-calculator', title: 'Kalkulator Zakat Fitrah & Maal', category: 'Fikih Ibadah' },
  { id: 'kasus-integritas-ujian', title: 'Studi Kasus Kejujuran Ujian', category: 'Akhlak & Adab' },
  { id: 'kasus-tabayyun-medsos', title: 'Studi Kasus Tabayyun Medsos', category: 'Akhlak & Adab' },
  { id: 'kasus-moderasi-toleransi', title: 'Studi Kasus Toleransi Beragama', category: 'Akhlak & Adab' },
  { id: 'quiz-evaluation', title: 'Kuis Evaluasi Formatif PAI', category: 'Asesmen' },
];

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  iconName: 'book' | 'compass' | 'coins' | 'scale' | 'trophy' | 'crown';
  category: 'Al-Qur\'an' | 'Fikih' | 'Akhlak' | 'Asesmen' | 'Komprehensif';
  criterion: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  targetTab?: 'tajwid' | 'fikih' | 'kasus' | 'kuis';
}

export const BADGE_DEFINITIONS: Omit<BadgeItem, 'isUnlocked' | 'unlockedAt'>[] = [
  {
    id: 'tajwid-master',
    title: 'Tajwid Master',
    description: 'Menguasai visualisasi kaidah hukum tajwid dan tadabbur ayat Al-Qur\'an.',
    iconName: 'book',
    category: 'Al-Qur\'an',
    criterion: 'Tuntaskan Kaidah Tajwid & Tadabbur Surah',
    targetTab: 'tajwid',
  },
  {
    id: 'prayer-scholar',
    title: 'Prayer Scholar',
    description: 'Menuntaskan seluruh rukun kinestetik, thuma\'ninah, dan doa shalat 5 waktu.',
    iconName: 'compass',
    category: 'Fikih',
    criterion: 'Tuntaskan simulasi Tata Cara Shalat Khusyuk',
    targetTab: 'fikih',
  },
  {
    id: 'zakat-benefactor',
    title: 'Zakat Benefactor',
    description: 'Memahami hisab nisab dan tata kelola zakat fitrah serta zakat maal.',
    iconName: 'coins',
    category: 'Fikih',
    criterion: 'Gunakan dan selesaikan modul Kalkulator Zakat',
    targetTab: 'fikih',
  },
  {
    id: 'moral-champion',
    title: 'Moral Champion',
    description: 'Mengambil keputusan terpuji pada 3 skenario dilema moral kontekstual.',
    iconName: 'scale',
    category: 'Akhlak',
    criterion: 'Tuntaskan 3 studi kasus kejujuran, tabayyun, dan toleransi',
    targetTab: 'kasus',
  },
  {
    id: 'mumtaz-scholar',
    title: 'Mumtaz Scholar',
    description: 'Meraih skor evaluasi formatif PAI predikat istimewa (Mumtaz ≥80%).',
    iconName: 'trophy',
    category: 'Asesmen',
    criterion: 'Raih nilai kuis minimal 80%',
    targetTab: 'kuis',
  },
  {
    id: 'khatam-mastery',
    title: 'Khatam Mastery',
    description: 'Menuntaskan seluruh 8 milestone kurikulum Pendidikan Agama Islam.',
    iconName: 'crown',
    category: 'Komprehensif',
    criterion: 'Tuntaskan 100% capaian kurikulum',
    targetTab: 'tajwid',
  },
];

export const STORAGE_KEY = 'nuredu_pai_user_progress_v1';

export const INITIAL_PROGRESS: UserProgress = {
  completedLessons: [],
  quizRecord: null,
  unlockedBadges: {},
  updatedAt: new Date().toISOString(),
};

/**
 * Calculates overall progress percentage (0 - 100)
 */
export function calculateProgressPercentage(
  completedLessons: string[],
  quizRecord: QuizRecord | null
): {
  percentage: number;
  completedCount: number;
  totalCount: number;
} {
  const completedSet = new Set(completedLessons);
  if (quizRecord && quizRecord.passed) {
    completedSet.add('quiz-evaluation');
  }

  // Count how many milestone IDs are satisfied
  let validCount = 0;
  for (const m of MILESTONE_DEFINITIONS) {
    if (completedSet.has(m.id)) {
      validCount++;
    }
  }

  const percentage = Math.min(
    100,
    Math.round((validCount / TOTAL_CURRICULUM_MILESTONES) * 100)
  );

  return {
    percentage,
    completedCount: validCount,
    totalCount: TOTAL_CURRICULUM_MILESTONES,
  };
}

/**
 * Pure evaluation function for badges
 */
export function evaluateBadges(
  completedLessons: string[],
  quizRecord: QuizRecord | null,
  existingUnlockedBadges: Record<string, string> = {}
): {
  badges: BadgeItem[];
  unlockedCount: number;
  totalCount: number;
  newlyUnlockedIds: string[];
  unlockedBadgeMap: Record<string, string>;
} {
  const completedSet = new Set(completedLessons);
  const nowIso = new Date().toISOString();
  const unlockedBadgeMap: Record<string, string> = { ...existingUnlockedBadges };
  const newlyUnlockedIds: string[] = [];

  const checkBadgeCondition = (id: string): boolean => {
    switch (id) {
      case 'tajwid-master':
        return completedSet.has('tajwid-rules') && completedSet.has('surah-tadabbur');
      case 'prayer-scholar':
        return completedSet.has('shalat-guide');
      case 'zakat-benefactor':
        return completedSet.has('zakat-calculator');
      case 'moral-champion':
        return (
          completedSet.has('kasus-integritas-ujian') &&
          completedSet.has('kasus-tabayyun-medsos') &&
          completedSet.has('kasus-moderasi-toleransi')
        );
      case 'mumtaz-scholar':
        return quizRecord !== null && quizRecord.highestScore >= 80;
      case 'khatam-mastery':
        return calculateProgressPercentage(completedLessons, quizRecord).percentage === 100;
      default:
        return false;
    }
  };

  const badges: BadgeItem[] = BADGE_DEFINITIONS.map((def) => {
    const isUnlocked = checkBadgeCondition(def.id) || Boolean(existingUnlockedBadges[def.id]);
    let unlockedAt = unlockedBadgeMap[def.id];

    if (isUnlocked && !unlockedAt) {
      unlockedAt = nowIso;
      unlockedBadgeMap[def.id] = unlockedAt;
      newlyUnlockedIds.push(def.id);
    }

    return {
      ...def,
      isUnlocked,
      unlockedAt,
    };
  });

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;

  return {
    badges,
    unlockedCount,
    totalCount: BADGE_DEFINITIONS.length,
    newlyUnlockedIds,
    unlockedBadgeMap,
  };
}

/**
 * Loads user progress from localStorage safely
 */
export function loadUserProgress(): UserProgress {
  if (typeof window === 'undefined' || !window.localStorage) {
    return INITIAL_PROGRESS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PROGRESS;
    const parsed = JSON.parse(raw);
    const completedLessons = Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [];
    const quizRecord = parsed.quizRecord || null;
    const rawBadges = typeof parsed.unlockedBadges === 'object' && parsed.unlockedBadges !== null
      ? parsed.unlockedBadges
      : {};

    // Auto sync badges if conditions are satisfied
    const evaluated = evaluateBadges(completedLessons, quizRecord, rawBadges);

    return {
      completedLessons,
      quizRecord,
      unlockedBadges: evaluated.unlockedBadgeMap,
      lastActiveTab: parsed.lastActiveTab,
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    };
  } catch (err) {
    console.error('Failed to load user progress from localStorage:', err);
    return INITIAL_PROGRESS;
  }
}

/**
 * Saves user progress to localStorage
 */
export function saveUserProgress(progress: UserProgress): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }
  try {
    // Evaluate badges to ensure badge sync before saving
    const evaluated = evaluateBadges(
      progress.completedLessons,
      progress.quizRecord,
      progress.unlockedBadges
    );

    const updated: UserProgress = {
      ...progress,
      unlockedBadges: evaluated.unlockedBadgeMap,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Dispatch custom event so all open views / components re-sync immediately
    window.dispatchEvent(new Event('nuredu_progress_updated'));
    return true;
  } catch (err) {
    console.error('Failed to save user progress to localStorage:', err);
    return false;
  }
}

/**
 * Adds a completed lesson ID if not already present
 */
export function markLessonAsCompleted(lessonId: string): UserProgress {
  const current = loadUserProgress();
  if (current.completedLessons.includes(lessonId)) {
    return current;
  }
  const updatedLessons = [...current.completedLessons, lessonId];
  const evaluated = evaluateBadges(updatedLessons, current.quizRecord, current.unlockedBadges);

  const updated: UserProgress = {
    ...current,
    completedLessons: updatedLessons,
    unlockedBadges: evaluated.unlockedBadgeMap,
  };
  saveUserProgress(updated);
  return updated;
}

/**
 * Updates quiz score in progress and evaluates badges
 */
export function recordQuizAttempt(score: number, correctAnswers: number, totalQuestions: number): UserProgress {
  const current = loadUserProgress();
  const passed = score >= 60;

  const prevBest = current.quizRecord?.highestScore ?? 0;
  const newRecord: QuizRecord = {
    highestScore: Math.max(prevBest, score),
    lastScore: score,
    totalQuestions,
    correctAnswers,
    lastAttemptAt: new Date().toISOString(),
    passed: passed || (current.quizRecord?.passed ?? false),
  };

  const updatedLessons = new Set(current.completedLessons);
  if (passed) {
    updatedLessons.add('quiz-evaluation');
  }

  const updatedLessonArray = Array.from(updatedLessons);
  const evaluated = evaluateBadges(updatedLessonArray, newRecord, current.unlockedBadges);

  const updated: UserProgress = {
    ...current,
    completedLessons: updatedLessonArray,
    quizRecord: newRecord,
    unlockedBadges: evaluated.unlockedBadgeMap,
  };

  saveUserProgress(updated);
  return updated;
}

/**
 * Resets all user progress and badges
 */
export function clearUserProgress(): UserProgress {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event('nuredu_progress_updated'));
    } catch {
      // ignore
    }
  }
  return INITIAL_PROGRESS;
}
