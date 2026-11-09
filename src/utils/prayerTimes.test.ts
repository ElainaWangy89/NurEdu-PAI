import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculatePrayerTimes,
  getUpcomingPrayerSummary,
  INDONESIA_CITY_PRESETS,
} from './prayerTimes';

test('calculatePrayerTimes returns 6 times (Subuh, Terbit, Dzuhur, Ashar, Maghrib, Isya) for Jakarta', () => {
  const jakarta = INDONESIA_CITY_PRESETS[0];
  const date = new Date('2026-05-15T12:00:00Z');
  const times = calculatePrayerTimes(
    { latitude: jakarta.lat, longitude: jakarta.lng },
    date,
    date,
    7 // force WIB (UTC+7)
  );

  assert.equal(times.length, 6);
  assert.equal(times[0].id, 'subuh');
  assert.equal(times[1].id, 'terbit');
  assert.equal(times[2].id, 'dzuhur');
  assert.equal(times[3].id, 'ashar');
  assert.equal(times[4].id, 'maghrib');
  assert.equal(times[5].id, 'isya');

  // Verify time format (HH:mm)
  times.forEach((t) => {
    assert.match(t.timeString, /^\d{2}:\d{2}$/);
    assert.ok(!isNaN(t.date.getTime()));
  });
});

test('getUpcomingPrayerSummary correctly identifies upcoming prayer and countdown string', () => {
  const jakarta = INDONESIA_CITY_PRESETS[0];
  const date = new Date('2026-11-09T00:00:00Z');
  const times = calculatePrayerTimes(
    { latitude: jakarta.lat, longitude: jakarta.lng },
    date,
    date,
    7
  );

  // Set mock current time at 30 minutes after sunrise (before Dzuhur)
  const sunriseTime = times.find((t) => t.id === 'terbit')!.date;
  const mockNow = new Date(sunriseTime.getTime() + 30 * 60 * 1000);
  const summary = getUpcomingPrayerSummary(times, mockNow);

  // Upcoming prayer after sunrise should be Dzuhur
  assert.equal(summary.upcomingPrayer.id, 'dzuhur');
  assert.ok(summary.countdownString.includes('menit') || summary.countdownString.includes('jam'));
});
