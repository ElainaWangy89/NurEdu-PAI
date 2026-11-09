import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateQuizScore,
  filterTajwidBySearch,
  evaluateMoralImpact,
  calculateZakatFitrah,
  calculateZakatMaal,
} from './paiLogic';
import { TAJWID_RULES } from '../data/paiData';

test('calculateQuizScore correctly handles various correct counts', () => {
  const perfect = calculateQuizScore(10, 10);
  assert.equal(perfect.percentage, 100);
  assert.equal(perfect.grade, 'Mumtaz (Istimewa)');

  const veryGood = calculateQuizScore(10, 8);
  assert.equal(veryGood.percentage, 80);
  assert.equal(veryGood.grade, 'Jayyid Jiddan (Amat Baik)');

  const needsRemedi = calculateQuizScore(10, 4);
  assert.equal(needsRemedi.percentage, 40);
  assert.equal(needsRemedi.grade, 'Perlu Remedi');

  const zeroQuestions = calculateQuizScore(0, 0);
  assert.equal(zeroQuestions.percentage, 0);
});

test('filterTajwidBySearch filters by name, arabic, or letters', () => {
  const ikhfa = filterTajwidBySearch(TAJWID_RULES, 'ikhfa');
  assert.ok(ikhfa.length > 0);
  assert.equal(ikhfa[0].id, 'ikhfa-haqiqi');

  const arabicLetter = filterTajwidBySearch(TAJWID_RULES, 'ب');
  assert.ok(arabicLetter.some((r) => r.id === 'iqlab' || r.id === 'qalqalah'));

  const empty = filterTajwidBySearch(TAJWID_RULES, '');
  assert.equal(empty.length, TAJWID_RULES.length);
});

test('calculateZakatFitrah computes rice and rupiah equivalent accurately', () => {
  const result = calculateZakatFitrah(4, 15000); // 4 souls * 2.5 kg = 10 kg
  assert.equal(result.kgBeras, 10);
  assert.equal(result.rupiahEquivalent, 150000);
});

test('calculateZakatMaal checks nisab threshold correctly', () => {
  const goldPrice = 1000000; // Nisab = 85 * 1jt = 85 jt
  const belowNisab = calculateZakatMaal(50000000, goldPrice);
  assert.equal(belowNisab.isObligated, false);
  assert.equal(belowNisab.zakatDue, 0);

  const aboveNisab = calculateZakatMaal(100000000, goldPrice);
  assert.equal(aboveNisab.isObligated, true);
  assert.equal(aboveNisab.zakatDue, 2500000); // 2.5% of 100jt
});
