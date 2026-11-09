/**
 * Pure calculation utilities for Islamic daily prayer times based on solar coordinates.
 * Compatible with Indonesian Ministry of Religious Affairs (Kemenag) standard angles:
 * Fajr (Subuh): -20 degrees
 * Isha (Isya): -18 degrees
 */

export interface PrayerTimeItem {
  id: 'subuh' | 'terbit' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya';
  name: string;
  arabicName: string;
  timeString: string; // HH:mm
  date: Date;
  isPassed: boolean;
  isUpcoming: boolean;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
  cityName?: string;
}

export const INDONESIA_CITY_PRESETS: { name: string; lat: number; lng: number }[] = [
  { name: 'Jakarta (WIB)', lat: -6.2088, lng: 106.8456 },
  { name: 'Bandung (WIB)', lat: -6.9175, lng: 107.6191 },
  { name: 'Surabaya (WIB)', lat: -7.2575, lng: 112.7521 },
  { name: 'Yogyakarta (WIB)', lat: -7.7956, lng: 110.3695 },
  { name: 'Medan (WIB)', lat: 3.5952, lng: 98.6722 },
  { name: 'Banda Aceh (WIB)', lat: 5.5483, lng: 95.3238 },
  { name: 'Makassar (WITA)', lat: -5.1477, lng: 119.4327 },
  { name: 'Denpasar (WITA)', lat: -8.6705, lng: 115.2126 },
  { name: 'Balikpapan (WITA)', lat: -1.2379, lng: 116.8529 },
  { name: 'Jayapura (WIT)', lat: -2.5916, lng: 140.669 },
];

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/**
 * Calculates solar declination and equation of time for a given Date
 */
function getSolarCoordinates(date: Date) {
  // Day of the year
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;

  // Approximate solar declination
  const gamma = degToRad((360 / 365) * (dayOfYear - 81));
  const declination = degToRad(23.45) * Math.sin(gamma);

  // Equation of time in minutes
  const B = degToRad((360 / 365) * (dayOfYear - 81));
  const eqtime =
    9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);

  return { declination, eqtime };
}

/**
 * Calculates astronomical prayer times for given coordinates and date
 */
export function calculatePrayerTimes(
  coords: Coordinates,
  date: Date = new Date(),
  currentTime: Date = new Date(),
  forceTimezoneOffsetHours?: number
): PrayerTimeItem[] {
  const { latitude, longitude } = coords;
  const { declination, eqtime } = getSolarCoordinates(date);

  const latRad = degToRad(latitude);

  // Local civil timezone offset in hours
  // If explicitly specified, use that; otherwise calculate from longitude or browser offset
  const browserTz = -date.getTimezoneOffset() / 60;
  const approxLngTz = Math.round(longitude / 15);
  const tzOffsetHours =
    forceTimezoneOffsetHours !== undefined
      ? forceTimezoneOffsetHours
      : Math.abs(browserTz - approxLngTz) <= 2
      ? browserTz
      : approxLngTz;

  // Solar noon in local civil time hours (decimal 0 - 24)
  const solarNoon = 12 + (tzOffsetHours * 15 - longitude) / 15 - eqtime / 60;

  // Helper to compute hour angle for a given solar altitude angle (alpha)
  const computeHourAngle = (alphaDeg: number): number => {
    const alphaRad = degToRad(alphaDeg);
    const cosHA =
      (Math.sin(alphaRad) - Math.sin(latRad) * Math.sin(declination)) /
      (Math.cos(latRad) * Math.cos(declination));
    const clampedCosHA = Math.max(-1, Math.min(1, cosHA));
    return radToDeg(Math.acos(clampedCosHA)) / 15;
  };

  // Subuh (Fajr): Kemenag standard -20°
  const fajrHA = computeHourAngle(-20);
  const fajrHours = solarNoon - fajrHA;

  // Terbit (Sunrise): -0.833° (atmospheric refraction)
  const sunriseHA = computeHourAngle(-0.833);
  const sunriseHours = solarNoon - sunriseHA;

  // Dzuhur: Solar noon + 2 minutes safety margin (ihtiyat)
  const dhuhrHours = solarNoon + 2 / 60;

  // Ashar: Shafi'i shadow length ratio = 1
  const asrAlt = radToDeg(
    Math.atan(1 / (1 + Math.tan(Math.abs(latRad - declination))))
  );
  const asrHA = computeHourAngle(asrAlt);
  const asrHours = solarNoon + asrHA;

  // Maghrib (Sunset): -0.833°
  const maghribHA = computeHourAngle(-0.833);
  const maghribHours = solarNoon + maghribHA + 2 / 60;

  // Isya (Isha): Kemenag standard -18°
  const ishaHA = computeHourAngle(-18);
  const ishaHours = solarNoon + ishaHA;

  // Convert decimal hours into Date object
  const toDate = (decHours: number): Date => {
    let normalized = decHours;
    while (normalized < 0) normalized += 24;
    while (normalized >= 24) normalized -= 24;

    const h = Math.floor(normalized);
    const m = Math.floor((normalized - h) * 60);

    const d = new Date(date);
    d.setHours(h, m, 0, 0);
    return d;
  };

  const pad = (n: number) => n.toString().padStart(2, '0');
  const formatTime = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

  const subuhDate = toDate(fajrHours);
  const terbitDate = toDate(sunriseHours);
  const dzuhurDate = toDate(dhuhrHours);
  const asharDate = toDate(asrHours);
  const maghribDate = toDate(maghribHours);
  const isyaDate = toDate(ishaHours);

  const rawList: {
    id: PrayerTimeItem['id'];
    name: string;
    arabicName: string;
    date: Date;
  }[] = [
    { id: 'subuh', name: 'Subuh', arabicName: 'الفَجْر', date: subuhDate },
    { id: 'terbit', name: 'Terbit', arabicName: 'الشُّرُوق', date: terbitDate },
    { id: 'dzuhur', name: 'Dzuhur', arabicName: 'الظُّهْر', date: dzuhurDate },
    { id: 'ashar', name: 'Ashar', arabicName: 'العَصْر', date: asharDate },
    { id: 'maghrib', name: 'Maghrib', arabicName: 'المَغْرِب', date: maghribDate },
    { id: 'isya', name: 'Isya', arabicName: 'العِشَاء', date: isyaDate },
  ];

  const now = currentTime;
  const obligatory = rawList.filter((p) => p.id !== 'terbit');
  const nextObligatory = obligatory.find((p) => p.date.getTime() > now.getTime());

  return rawList.map((item) => {
    const isPassed = item.date.getTime() <= now.getTime();
    const isUpcoming = nextObligatory
      ? item.id === nextObligatory.id
      : item.id === 'subuh';

    return {
      id: item.id,
      name: item.name,
      arabicName: item.arabicName,
      timeString: formatTime(item.date),
      date: item.date,
      isPassed,
      isUpcoming,
    };
  });
}

/**
 * Finds the single upcoming prayer and calculates remaining time
 */
export function getUpcomingPrayerSummary(
  prayerList: PrayerTimeItem[],
  now: Date = new Date()
): {
  upcomingPrayer: PrayerTimeItem;
  countdownString: string;
  isTomorrow: boolean;
} {
  const obligatory = prayerList.filter((p) => p.id !== 'terbit');
  let upcoming = obligatory.find((p) => p.date.getTime() > now.getTime());
  let isTomorrow = false;

  if (!upcoming) {
    // Tomorrow's Subuh
    upcoming = obligatory[0];
    isTomorrow = true;
  }

  // Calculate difference
  let targetMillis = upcoming.date.getTime();
  if (isTomorrow) {
    targetMillis += 24 * 60 * 60 * 1000;
  }

  const diffMs = Math.max(0, targetMillis - now.getTime());
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  const countdownString =
    hours > 0
      ? `${hours} jam ${minutes} menit lagi`
      : `${minutes} menit ${seconds} detik lagi`;

  return {
    upcomingPrayer: upcoming,
    countdownString,
    isTomorrow,
  };
}
