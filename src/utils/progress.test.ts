import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateProgressPercentage,
  TOTAL_CURRICULUM_MILESTONES,
  QuizRecord,
  evaluateBadges,
  BADGE_DEFINITIONS,
} from './progress';

test('calculateProgressPercentage returns 0% when no lessons completed', () => {
  const result = calculateProgressPercentage([], null);
  assert.equal(result.percentage, 0);
  assert.equal(result.completedCount, 0);
  assert.equal(result.totalCount, TOTAL_CURRICULUM_MILESTONES);
});

test('calculateProgressPercentage correctly calculates completed fraction', () => {
  const lessons = ['tajwid-rules', 'surah-tadabbur', 'shalat-guide', 'zakat-calculator'];
  const result = calculateProgressPercentage(lessons, null);
  // 4 out of 8 = 50%
  assert.equal(result.completedCount, 4);
  assert.equal(result.percentage, 50);
});

test('calculateProgressPercentage counts passed quiz as milestone', () => {
  const lessons = ['tajwid-rules'];
  const quizRecord: QuizRecord = {
    highestScore: 80,
    lastScore: 80,
    totalQuestions: 6,
    correctAnswers: 5,
    lastAttemptAt: new Date().toISOString(),
    passed: true,
  };
  const result = calculateProgressPercentage(lessons, quizRecord);
  // 'tajwid-rules' + 'quiz-evaluation' = 2 out of 8 = 25%
  assert.equal(result.completedCount, 2);
  assert.equal(result.percentage, 25);
});

test('calculateProgressPercentage caps at 100% when all completed', () => {
  const allLessons = [
    'tajwid-rules',
    'surah-tadabbur',
    'shalat-guide',
    'zakat-calculator',
    'kasus-integritas-ujian',
    'kasus-tabayyun-medsos',
    'kasus-moderasi-toleransi',
    'quiz-evaluation',
  ];
  const result = calculateProgressPercentage(allLessons, null);
  assert.equal(result.completedCount, 8);
  assert.equal(result.percentage, 100);
});

// Achievement / Badge system tests
test('evaluateBadges returns all locked when no lessons completed', () => {
  const result = evaluateBadges([], null);
  assert.equal(result.totalCount, BADGE_DEFINITIONS.length);
  assert.equal(result.unlockedCount, 0);
  assert.equal(result.newlyUnlockedIds.length, 0);
  assert.ok(result.badges.every((b) => !b.isUnlocked));
});

test('evaluateBadges unlocks prayer-scholar and zakat-benefactor correctly', () => {
  const result = evaluateBadges(['shalat-guide', 'zakat-calculator'], null);
  const prayerBadge = result.badges.find((b) => b.id === 'prayer-scholar');
  const zakatBadge = result.badges.find((b) => b.id === 'zakat-benefactor');
  const tajwidBadge = result.badges.find((b) => b.id === 'tajwid-master');

  assert.ok(prayerBadge?.isUnlocked, 'Prayer scholar should be unlocked');
  assert.ok(zakatBadge?.isUnlocked, 'Zakat benefactor should be unlocked');
  assert.equal(tajwidBadge?.isUnlocked, false, 'Tajwid master should remain locked');
  assert.equal(result.unlockedCount, 2);
});

test('evaluateBadges requires both tajwid rules and surah tadabbur for tajwid-master', () => {
  // Only 1 completed
  const partial = evaluateBadges(['tajwid-rules'], null);
  assert.equal(partial.badges.find((b) => b.id === 'tajwid-master')?.isUnlocked, false);

  // Both completed
  const complete = evaluateBadges(['tajwid-rules', 'surah-tadabbur'], null);
  assert.equal(complete.badges.find((b) => b.id === 'tajwid-master')?.isUnlocked, true);
});

test('evaluateBadges unlocks mumtaz-scholar when quiz score >= 80', () => {
  const lowScoreQuiz: QuizRecord = {
    highestScore: 70,
    lastScore: 70,
    totalQuestions: 6,
    correctAnswers: 4,
    lastAttemptAt: new Date().toISOString(),
    passed: true,
  };
  const lowResult = evaluateBadges([], lowScoreQuiz);
  assert.equal(lowResult.badges.find((b) => b.id === 'mumtaz-scholar')?.isUnlocked, false);

  const highScoreQuiz: QuizRecord = {
    highestScore: 85,
    lastScore: 85,
    totalQuestions: 6,
    correctAnswers: 5,
    lastAttemptAt: new Date().toISOString(),
    passed: true,
  };
  const highResult = evaluateBadges([], highScoreQuiz);
  assert.equal(highResult.badges.find((b) => b.id === 'mumtaz-scholar')?.isUnlocked, true);
});

test('evaluateBadges unlocks moral-champion when all 3 moral dilemmas are completed', () => {
  const twoCases = ['kasus-integritas-ujian', 'kasus-tabayyun-medsos'];
  assert.equal(evaluateBadges(twoCases, null).badges.find((b) => b.id === 'moral-champion')?.isUnlocked, false);

  const threeCases = [
    'kasus-integritas-ujian',
    'kasus-tabayyun-medsos',
    'kasus-moderasi-toleransi',
  ];
  assert.equal(evaluateBadges(threeCases, null).badges.find((b) => b.id === 'moral-champion')?.isUnlocked, true);
});

test('evaluateBadges unlocks khatam-mastery only when all 8 milestones are done', () => {
  const allLessons = [
    'tajwid-rules',
    'surah-tadabbur',
    'shalat-guide',
    'zakat-calculator',
    'kasus-integritas-ujian',
    'kasus-tabayyun-medsos',
    'kasus-moderasi-toleransi',
    'quiz-evaluation',
  ];
  const result = evaluateBadges(allLessons, null);
  const khatam = result.badges.find((b) => b.id === 'khatam-mastery');
  assert.ok(khatam?.isUnlocked, 'Khatam mastery should be unlocked');
  assert.equal(result.unlockedCount, 5); // tajwid-master, prayer-scholar, zakat-benefactor, moral-champion, khatam-mastery
});

test('evaluateBadges preserves existing unlockedAt timestamps and records new unlocks', () => {
  const initialTime = '2026-11-01T10:00:00.000Z';
  const existingMap = { 'prayer-scholar': initialTime };

  const result = evaluateBadges(['shalat-guide', 'zakat-calculator'], null, existingMap);
  const prayerBadge = result.badges.find((b) => b.id === 'prayer-scholar');
  const zakatBadge = result.badges.find((b) => b.id === 'zakat-benefactor');

  assert.equal(prayerBadge?.unlockedAt, initialTime, 'Should keep previous unlock time');
  assert.ok(zakatBadge?.unlockedAt, 'Newly unlocked badge should receive a timestamp');
  assert.deepEqual(result.newlyUnlockedIds, ['zakat-benefactor']);
});
