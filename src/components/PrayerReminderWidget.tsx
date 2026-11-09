import React, { useState, useEffect, useRef } from 'react';
import {
  calculatePrayerTimes,
  getUpcomingPrayerSummary,
  INDONESIA_CITY_PRESETS,
  PrayerTimeItem,
  Coordinates,
} from '../utils/prayerTimes';
import {
  Clock,
  Compass,
  MapPin,
  Volume2,
  VolumeX,
  Bell,
  RefreshCw,
  CheckCircle,
  Sparkles,
  Sun,
  Sunset,
  Sunrise,
  Moon,
} from 'lucide-react';

interface PrayerReminderWidgetProps {
  compact?: boolean;
}

export const PrayerReminderWidget: React.FC<PrayerReminderWidgetProps> = ({ compact = false }) => {
  // Location state
  const [selectedCityName, setSelectedCityName] = useState<string>('Jakarta (WIB)');
  const [coords, setCoords] = useState<Coordinates>({
    latitude: -6.2088,
    longitude: 106.8456,
    cityName: 'Jakarta (WIB)',
  });
  const [isGpsActive, setIsGpsActive] = useState<boolean>(false);
  const [gpsLoading, setGpsLoading] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Time & countdown state
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [hasNotifiedUpcoming, setHasNotifiedUpcoming] = useState<string | null>(null);

  // Audio ref for Web Audio API tone generator
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play peaceful chime notification sound using Web Audio API
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Harmonic chords (oriental meditative chime)
      const frequencies = [440, 554.37, 659.25, 880]; // A major chime
      const now = ctx.currentTime;

      frequencies.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.12);

        gain.gain.setValueAtTime(0.001, now + index * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.18, now + index * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.12 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + index * 0.12);
        osc.stop(now + index * 0.12 + 1.3);
      });
    } catch {
      // AudioContext unavailable or blocked by browser policy
    }
  };

  // 1-second interval for real-time countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Request GPS location
  const handleRequestGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Browser tidak mendukung Geolocation API.');
      return;
    }

    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({
          latitude,
          longitude,
          cityName: 'Lokasi Anda (GPS)',
        });
        setSelectedCityName('custom_gps');
        setIsGpsActive(true);
        setGpsLoading(false);
      },
      (err) => {
        setGpsLoading(false);
        setIsGpsActive(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGpsError('Izin akses lokasi ditolak. Silakan pilih kota manual dari daftar.');
        } else {
          setGpsError('Gagal mendeteksi lokasi otomatis. Menggunakan estimasi kota pilihan.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Change city preset
  const handleSelectCity = (cityName: string) => {
    if (cityName === 'custom_gps') {
      handleRequestGps();
      return;
    }

    const preset = INDONESIA_CITY_PRESETS.find((c) => c.name === cityName);
    if (preset) {
      setSelectedCityName(preset.name);
      setCoords({
        latitude: preset.lat,
        longitude: preset.lng,
        cityName: preset.name,
      });
      setIsGpsActive(false);
      setGpsError(null);
    }
  };

  // Calculate prayer times
  const prayerTimes: PrayerTimeItem[] = calculatePrayerTimes(coords, currentTime, currentTime);
  const { upcomingPrayer, countdownString, isTomorrow } = getUpcomingPrayerSummary(prayerTimes, currentTime);

  // Trigger sound when upcoming prayer arrives (within 5 seconds)
  useEffect(() => {
    if (!soundEnabled) return;
    const nowTime = currentTime.getTime();
    const targetTime = upcomingPrayer.date.getTime();
    const diff = Math.abs(targetTime - nowTime);

    if (diff < 5000 && hasNotifiedUpcoming !== upcomingPrayer.id) {
      playChime();
      setHasNotifiedUpcoming(upcomingPrayer.id);
    }
  }, [currentTime, soundEnabled, upcomingPrayer, hasNotifiedUpcoming]);

  // Icon selector
  const getPrayerIcon = (id: PrayerTimeItem['id']) => {
    switch (id) {
      case 'subuh':
        return <Sunrise className="w-5 h-5 text-amber-500" />;
      case 'terbit':
        return <Sun className="w-5 h-5 text-orange-400" />;
      case 'dzuhur':
        return <Sun className="w-5 h-5 text-yellow-500" />;
      case 'ashar':
        return <Sunset className="w-5 h-5 text-amber-600" />;
      case 'maghrib':
        return <Sunset className="w-5 h-5 text-rose-500" />;
      case 'isya':
        return <Moon className="w-5 h-5 text-indigo-400" />;
      default:
        return <Clock className="w-5 h-5 text-emerald-500" />;
    }
  };

  if (compact) {
    return (
      <div className="bg-emerald-900/90 text-white rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-800/80 rounded-xl">
            <Clock className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <div className="text-xs text-emerald-200 font-medium flex items-center gap-2">
              <span>Menjelang Waktu Shalat</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {coords.cityName}
              </span>
            </div>
            <div className="text-base font-bold text-white flex items-center gap-2">
              <span>{upcomingPrayer.name} ({upcomingPrayer.arabicName})</span>
              <span className="text-emerald-300 font-mono text-sm">{upcomingPrayer.timeString}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs px-3 py-1 bg-emerald-800 text-emerald-100 rounded-full font-mono font-medium">
            {countdownString}
          </span>
          <button
            onClick={handleRequestGps}
            title="Perbarui via GPS"
            className="p-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 transition-colors"
          >
            <Compass className={`w-4 h-4 ${gpsLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
      {/* Top Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Jadwal & Pengingat Waktu Shalat
              {isGpsActive && (
                <span className="text-xs bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md flex items-center gap-1 font-normal">
                  <Compass className="w-3 h-3" /> GPS Aktif
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sesuai standar hisab astronomi Kementerian Agama RI (Subuh -20°, Isya -18°)
            </p>
          </div>
        </div>

        {/* Location Picker & Audio Toggle */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Geolocation Button */}
          <button
            onClick={handleRequestGps}
            disabled={gpsLoading}
            className={`px-3 py-1.5 text-xs font-medium rounded-xl flex items-center gap-1.5 transition-colors border ${
              isGpsActive
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
            title="Gunakan Geolocation Browser"
          >
            <Compass className={`w-3.5 h-3.5 ${gpsLoading ? 'animate-spin text-emerald-600' : ''}`} />
            <span>{gpsLoading ? 'Mencari...' : 'Gunakan GPS'}</span>
          </button>

          {/* City Preset Select */}
          <div className="relative">
            <select
              value={isGpsActive ? 'custom_gps' : selectedCityName}
              onChange={(e) => handleSelectCity(e.target.value)}
              className="px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {isGpsActive && (
                <option value="custom_gps">📍 Lokasi GPS ({coords.latitude.toFixed(2)}°, {coords.longitude.toFixed(2)}°)</option>
              )}
              {INDONESIA_CITY_PRESETS.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sound Alert Toggle */}
          <button
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) playChime();
            }}
            className={`p-1.5 rounded-xl border transition-colors ${
              soundEnabled
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            title={soundEnabled ? 'Notifikasi Suara Aktif' : 'Aktifkan Pengingat Suara'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {gpsError && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
          <span>{gpsError}</span>
          <button
            onClick={() => setGpsError(null)}
            className="text-amber-600 dark:text-amber-400 hover:underline font-semibold ml-2"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Hero Banner: Upcoming Prayer & Live Countdown */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-6 shadow-md">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
          <Moon className="w-48 h-48 -mr-12" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-200 text-xs font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {coords.cityName || 'Indonesia'}
              </span>
              <span>·</span>
              <span>
                {currentTime.toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>

            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-3xl font-extrabold tracking-tight">
                {upcomingPrayer.name}
              </span>
              <span className="font-arabic text-2xl text-emerald-300" dir="rtl">
                {upcomingPrayer.arabicName}
              </span>
              <span className="text-3xl font-bold font-mono text-emerald-100 ml-2">
                {upcomingPrayer.timeString}
              </span>
            </div>

            <p className="text-xs text-emerald-100/90 pt-1">
              {isTomorrow
                ? 'Waktu shalat berikutnya esok hari Subuh.'
                : 'Mempersiapkan diri dan berwudhu menyambut panggilan shalat.'}
            </p>
          </div>

          <div className="flex flex-col sm:items-end justify-center">
            <span className="text-xs uppercase tracking-wider text-emerald-200/90 font-semibold mb-1">
              Menghitung Mundur
            </span>
            <div className="bg-emerald-950/60 backdrop-blur-sm border border-emerald-600/40 px-4 py-2 rounded-xl text-lg sm:text-xl font-bold font-mono text-white shadow-inner">
              {countdownString}
            </div>
            {soundEnabled && (
              <span className="text-[11px] text-emerald-200 mt-1 flex items-center gap-1">
                <Bell className="w-3 h-3 text-emerald-300 animate-pulse" /> Pengingat audio aktif
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 6 Times Grid Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {prayerTimes.map((prayer) => {
          const isCurrentUpcoming = prayer.isUpcoming;
          const isPassed = prayer.isPassed;

          return (
            <div
              key={prayer.id}
              className={`rounded-xl p-3.5 border transition-all text-center flex flex-col justify-between ${
                isCurrentUpcoming
                  ? 'bg-emerald-50/90 dark:bg-emerald-950/50 border-emerald-500 dark:border-emerald-400 ring-2 ring-emerald-500/20 shadow-sm'
                  : isPassed
                  ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/70 dark:border-slate-800/70 opacity-75'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                  {getPrayerIcon(prayer.id)}
                </div>
                {isCurrentUpcoming ? (
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/80 px-1.5 py-0.5 rounded">
                    Berikutnya
                  </span>
                ) : isPassed ? (
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-0.5">
                    <CheckCircle className="w-3 h-3" /> Lewat
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    Mendatang
                  </span>
                )}
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {prayer.name}
                </div>
                <div className="font-arabic text-xs text-slate-500 dark:text-slate-400 my-0.5" dir="rtl">
                  {prayer.arabicName}
                </div>
                <div className={`text-base font-bold font-mono ${
                  isCurrentUpcoming
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : 'text-slate-900 dark:text-slate-100'
                }`}>
                  {prayer.timeString}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Helpful educational footer & adhan test */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>
            Sunnah adab ketika mendengar adzan: Mendengarkan, menjawab lafadz adzan, dan membaca doa wasilah.
          </span>
        </div>

        <button
          onClick={playChime}
          className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 hover:underline flex items-center gap-1 font-medium self-start sm:self-auto"
        >
          <Volume2 className="w-3.5 h-3.5" /> Uji Suara Bel / Chime
        </button>
      </div>
    </div>
  );
};
