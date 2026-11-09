import { TajwidRule, CaseStudyChoice } from '../types';

/**
 * Calculates quiz score as a percentage and performance level
 */
export function calculateQuizScore(totalQuestions: number, correctAnswers: number): {
  score: number;
  grade: 'Mumtaz (Istimewa)' | 'Jayyid Jiddan (Amat Baik)' | 'Jayyid (Baik)' | 'Maqbul (Cukup)' | 'Perlu Remedi';
  percentage: number;
} {
  if (totalQuestions <= 0) {
    return { score: 0, grade: 'Perlu Remedi', percentage: 0 };
  }
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  let grade: 'Mumtaz (Istimewa)' | 'Jayyid Jiddan (Amat Baik)' | 'Jayyid (Baik)' | 'Maqbul (Cukup)' | 'Perlu Remedi';

  if (percentage >= 90) {
    grade = 'Mumtaz (Istimewa)';
  } else if (percentage >= 80) {
    grade = 'Jayyid Jiddan (Amat Baik)';
  } else if (percentage >= 70) {
    grade = 'Jayyid (Baik)';
  } else if (percentage >= 60) {
    grade = 'Maqbul (Cukup)';
  } else {
    grade = 'Perlu Remedi';
  }

  return { score: percentage, grade, percentage };
}

/**
 * Filter tajwid rules by keyword or arabic letter
 */
export function filterTajwidBySearch(rules: TajwidRule[], query: string): TajwidRule[] {
  if (!query || query.trim() === '') return rules;
  const q = query.toLowerCase().trim();
  return rules.filter(
    (rule) =>
      rule.name.toLowerCase().includes(q) ||
      rule.arabicName.includes(q) ||
      rule.category.toLowerCase().includes(q) ||
      rule.letters.some((l) => l.includes(q)) ||
      rule.definition.toLowerCase().includes(q)
  );
}

/**
 * Evaluates moral case study choices
 */
export function evaluateMoralImpact(choices: CaseStudyChoice[], selectedId: string): {
  isRecommended: boolean;
  scoreImpact: number;
  analysis: string;
} {
  const chosen = choices.find((c) => c.id === selectedId);
  if (!chosen) {
    return {
      isRecommended: false,
      scoreImpact: 0,
      analysis: 'Pilihan tidak ditemukan.',
    };
  }
  return {
    isRecommended: chosen.isRecommended,
    scoreImpact: chosen.scoreImpact,
    analysis: chosen.analysis,
  };
}

/**
 * Calculates Zakat Fitrah (2.5 kg or 3.5 liter rice per soul)
 */
export function calculateZakatFitrah(numberOfSouls: number, pricePerKg: number = 15000): {
  kgBeras: number;
  rupiahEquivalent: number;
} {
  const kg = Math.max(0, numberOfSouls) * 2.5;
  const rupiah = kg * Math.max(0, pricePerKg);
  return { kgBeras: kg, rupiahEquivalent: rupiah };
}

/**
 * Calculates Zakat Maal (Nisab 85 grams of gold, 2.5% rate)
 */
export function calculateZakatMaal(
  totalWealthInRupiah: number,
  goldPricePerGram: number = 1350000
): {
  nisabValue: number;
  isObligated: boolean;
  zakatDue: number;
} {
  const nisabValue = 85 * goldPricePerGram;
  const isObligated = totalWealthInRupiah >= nisabValue;
  const zakatDue = isObligated ? Math.round(totalWealthInRupiah * 0.025) : 0;
  return { nisabValue, isObligated, zakatDue };
}
