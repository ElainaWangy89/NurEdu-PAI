import React, { useState } from 'react';
import { GeneratedAsset } from '../types';
import {
  Sparkles,
  Image as ImageIcon,
  Film,
  Download,
  Upload,
  Play,
  RotateCcw,
  Check,
  AlertCircle,
  Layers,
  Sliders,
  Send,
  ArrowRight,
} from 'lucide-react';

interface StudioMediaKreatifProps {
  initialImageForVideo?: string | null;
}

export const StudioMediaKreatif: React.FC<StudioMediaKreatifProps> = ({
  initialImageForVideo,
}) => {
  const [activeTab, setActiveTab] = useState<'image' | 'video' | 'gallery'>('image');

  // Image Generation States (gemini-3-pro-image-preview)
  const [imagePrompt, setImagePrompt] = useState<string>(
    'Ilustrasi arsitektur Masjid Nabawi Madinah saat fajar merekah dengan pilar-pilar megah, pencahayaan keemasan lembut, dan suasana syahdu berkeadaban islami'
  );
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('2K');
  const [imageAspectRatio, setImageAspectRatio] = useState<
    '1:1' | '16:9' | '4:3' | '3:4' | '9:16'
  >('16:9');
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [currentGeneratedImage, setCurrentGeneratedImage] = useState<string | null>(null);

  // Video Animation States (gemini-omni-1.2-flash via Interactions API)
  const [sourceImageForVideo, setSourceImageForVideo] = useState<string | null>(
    initialImageForVideo || null
  );
  const [videoPrompt, setVideoPrompt] = useState<string>(
    'Animasi hembusan angin lembut menerpa daun pohon kurma, pendaran cahaya mentari pagi perlahan memancar hangat menyinari kubah masjid'
  );
  const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  // Gallery of Assets
  const [galleryAssets, setGalleryAssets] = useState<GeneratedAsset[]>([]);

  // PAI Presets for Quick Image Prompts
  const PRESET_PROMPTS = [
    {
      label: 'Arsitektur Nabawi Fajar',
      prompt:
        'Ilustrasi arsitektur Masjid Nabawi Madinah saat fajar merekah dengan pilar-pilar megah, pencahayaan keemasan lembut, dan suasana syahdu berkeadaban islami',
    },
    {
      label: 'Baitul Hikmah Baghdad',
      prompt:
        'Suasana perpustakaan agung Baitul Hikmah Baghdad era keemasan Islam, cendekiawan muslim meneliti manuskrip astronomi dan kedokteran, pencahayaan lilin dan jendela lengkung klasik',
    },
    {
      label: 'Anak Belajar Mengaji',
      prompt:
        'Ilustrasi santun dua murid muslim Indonesia sedang duduk belajar membaca Al-Qur\'an bersama guru di beranda madrasah yang asri, hangat, dan penuh takzim',
    },
    {
      label: 'Kaligrafi Geometris Islami',
      prompt:
        'Pola seni ornamen arabesque dan kaligrafi geometri islami dengan sentuhan warna zamrud dan emas bercahaya, estetika artistik tinggi untuk materi ajar',
    },
    {
      label: 'Rute Peta Hijrah Nabi',
      prompt:
        'Peta visual historis jalur perjalanan Hijrah Nabi Muhammad SAW dari Makkah ke Madinah melewati Gua Tsur dan Quba, gaya ilustrasi kartografi kuno edukatif',
    },
  ];

  // Handler: Generate Image via Server Endpoint (gemini-3-pro-image-preview)
  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePrompt.trim()) return;

    setIsGeneratingImage(true);
    setImageError(null);

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: imagePrompt,
          imageSize,
          aspectRatio: imageAspectRatio,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal membuat gambar dengan model gemini-3-pro-image-preview.');
      }

      setCurrentGeneratedImage(data.imageUrl);

      // Save to gallery
      const newAsset: GeneratedAsset = {
        id: 'img-' + Date.now(),
        type: 'image',
        url: data.imageUrl,
        prompt: imagePrompt,
        aspectRatio: imageAspectRatio,
        resolution: imageSize,
        createdAt: new Date().toLocaleTimeString('id-ID'),
      };
      setGalleryAssets((prev) => [newAsset, ...prev]);
    } catch (err: any) {
      setImageError(err.message || 'Terjadi kesalahan sistem saat menghubungi model gambar.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Handler: Handle User Image Upload for Video Animation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setVideoError('Harap unggah file berformat gambar (PNG, JPG, atau WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSourceImageForVideo(reader.result as string);
      setVideoError(null);
    };
    reader.readAsDataURL(file);
  };

  // Handler: Send generated image to video studio
  const handleSendToVideoStudio = (imgUrl: string) => {
    setSourceImageForVideo(imgUrl);
    setActiveTab('video');
  };

  // Handler: Generate Video Animation via Interactions API (gemini-omni-1.2-flash)
  const handleAnimateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceImageForVideo) {
      setVideoError('Harap pilih atau unggah foto/gambar terlebih dahulu untuk dianimasikan.');
      return;
    }

    setIsGeneratingVideo(true);
    setVideoError(null);
    setGeneratedVideoUrl(null);

    try {
      const res = await fetch('/api/animate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: sourceImageForVideo,
          prompt: videoPrompt,
          aspectRatio: videoAspectRatio,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menganimasikan gambar dengan model gemini-omni-1.2-flash.');
      }

      setGeneratedVideoUrl(data.videoUrl);

      // Save to gallery
      const newAsset: GeneratedAsset = {
        id: 'vid-' + Date.now(),
        type: 'video',
        url: data.videoUrl,
        prompt: videoPrompt,
        aspectRatio: videoAspectRatio,
        createdAt: new Date().toLocaleTimeString('id-ID'),
      };
      setGalleryAssets((prev) => [newAsset, ...prev]);
    } catch (err: any) {
      setVideoError(err.message || 'Terjadi kesalahan saat memproses animasi video.');
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  return (
    <div className="space-y-8 py-6">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Studio Media Ajar Generatif Kurikulum PAI</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Studio Ilustrasi 4K & Animasi Video Pembelajaran
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Ditenagai model Google Gemini: Ilustrasi resolusi 1K/2K/4K dan Animasi Foto menjadi Video bergerak
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0">
          <button
            onClick={() => setActiveTab('image')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'image'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>Generator Gambar (1K/2K/4K)</span>
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'video'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-emerald-600" />
            <span>Animasi Foto ke Video (16:9 / 9:16)</span>
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'gallery'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>Koleksi Hasil ({galleryAssets.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'image' && (
        /* ================= 1. HIGH-QUALITY IMAGE GENERATOR (gemini-3-pro-image-preview) ================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Form (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                Model: gemini-3-pro-image-preview
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Buat Ilustrasi Materi PAI Resolusi Tinggi
              </h3>
            </div>

            <form onSubmit={handleGenerateImage} className="space-y-5">
              {/* Image Size Affordance (1K, 2K, 4K) - Required by User */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Pilihan Resolusi Gambar (Affordance Ukuran):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['1K', '2K', '4K'] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setImageSize(size)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                        imageSize === size
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <div className="text-[11px] text-slate-400">
                  Resolusi ultra-detail cocok untuk infografis kelas, buku digital, & presentasi.
                </div>
              </div>

              {/* Aspect Ratio Options */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Rasio Aspek:
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(['16:9', '1:1', '4:3', '3:4', '9:16'] as const).map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setImageAspectRatio(ratio)}
                      className={`py-1.5 text-xs font-semibold rounded-lg transition-all border ${
                        imageAspectRatio === ratio
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preset Prompts */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Inspirasi Prompt Materi Kurikulum:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_PROMPTS.map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImagePrompt(preset.prompt)}
                      className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Textarea */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Deskripsi Prompt Gambar:
                </label>
                <textarea
                  rows={4}
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder="Tuliskan gambaran visual islami yang ingin dihasilkan..."
                  className="w-full p-3.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              {/* Error Message */}
              {imageError && (
                <div className="p-3 text-xs text-red-600 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900">
                  {imageError}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isGeneratingImage || !imagePrompt.trim()}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {isGeneratingImage ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Menghasilkan Ilustrasi {imageSize}...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Hasilkan Gambar Resolusi {imageSize}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Result Preview Stage (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Kanvas Hasil Ilustrasi Pembelajaran
              </h4>
              {currentGeneratedImage && (
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                  {imageSize} · {imageAspectRatio}
                </span>
              )}
            </div>

            {currentGeneratedImage ? (
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950 relative shadow-md group">
                  <img
                    src={currentGeneratedImage}
                    alt={imagePrompt}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-contain max-h-[500px] mx-auto"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-slate-500 dark:text-slate-400 max-w-sm line-clamp-2">
                    "{imagePrompt}"
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={currentGeneratedImage}
                      download={`nuredu-pai-${Date.now()}.png`}
                      className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh</span>
                    </a>

                    <button
                      onClick={() => handleSendToVideoStudio(currentGeneratedImage)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>Animasi Jadi Video</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-96 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                    Belum Ada Gambar yang Dihasilkan
                  </h5>
                  <p className="text-xs text-slate-400 max-w-sm mt-1">
                    Pilih preset atau tuliskan prompt di samping, tentukan ukuran (1K/2K/4K), lalu klik tombol hasilkan gambar.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'video' && (
        /* ================= 2. ANIMATE IMAGE INTO VIDEO (gemini-omni-1.2-flash) ================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Form (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                Model: gemini-omni-1.2-flash (Interactions API)
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Studio Animasi Foto ke Video Pembelajaran
              </h3>
            </div>

            <form onSubmit={handleAnimateVideo} className="space-y-5">
              {/* Step 1: Upload or Selected Image */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  1. Gambar Sumber (Foto / Ilustrasi):
                </label>

                {sourceImageForVideo ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950 p-1">
                    <img
                      src={sourceImageForVideo}
                      alt="Gambar Sumber Animasi"
                      className="w-full h-44 object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setSourceImageForVideo(null)}
                      className="absolute top-3 right-3 px-2 py-1 bg-black/70 hover:bg-black text-white text-[11px] font-semibold rounded-lg backdrop-blur-xs transition-colors"
                    >
                      Ganti Foto
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-emerald-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50 dark:bg-slate-800/40 text-center space-y-2">
                    <Upload className="w-8 h-8 text-slate-400" />
                    <div>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        Klik untuk Unggah Foto
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Format PNG, JPG, atau WEBP foto kegiatan PAI / gambar ajar
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Aspect Ratio Affordance (16:9 Landscape or 9:16 Portrait) - Required */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  2. Rasio Aspek Video Output (Wajib 16:9 atau 9:16):
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setVideoAspectRatio('16:9')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      videoAspectRatio === '16:9'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      16:9 Landscape
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Ideal untuk proyektor kelas & layar komputer
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVideoAspectRatio('9:16')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      videoAspectRatio === '9:16'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      9:16 Portrait
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Format video pendek edukatif / layar gawai siswa
                    </div>
                  </button>
                </div>
              </div>

              {/* Motion Direction Prompt */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  3. Arahan Gerakan Animasi:
                </label>
                <textarea
                  rows={3}
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  placeholder="Contoh: Gerakan dedaunan kurma berdesir tertiup angin lembut dan pendaran cahaya fajar di masjid..."
                  className="w-full p-3.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              {/* Error Message */}
              {videoError && (
                <div className="p-3 text-xs text-red-600 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900">
                  {videoError}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isGeneratingVideo || !sourceImageForVideo}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {isGeneratingVideo ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Menganimasikan Video ({videoAspectRatio})...</span>
                  </>
                ) : (
                  <>
                    <Film className="w-4 h-4" />
                    <span>Animasi Foto Menjadi Video ({videoAspectRatio})</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Result Video Player (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Hasil Video Pembelajaran Animasi
              </h4>
              {generatedVideoUrl && (
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                  Rasio {videoAspectRatio}
                </span>
              )}
            </div>

            {generatedVideoUrl ? (
              <div className="space-y-4">
                <div
                  className={`mx-auto rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-lg ${
                    videoAspectRatio === '9:16' ? 'max-w-[320px] aspect-[9/16]' : 'w-full aspect-video'
                  }`}
                >
                  <video
                    src={generatedVideoUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-slate-500 dark:text-slate-400 max-w-sm line-clamp-2">
                    "{videoPrompt}"
                  </div>

                  <a
                    href={generatedVideoUrl}
                    download={`video-pai-${Date.now()}.mp4`}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Video MP4</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="h-96 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                  <Film className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                    Belum Ada Video yang Dihasilkan
                  </h5>
                  <p className="text-xs text-slate-400 max-w-sm mt-1">
                    Unggah foto materi atau gunakan gambar yang digenerate di Tab 1, pilih rasio 16:9 atau 9:16, lalu klik animasi video.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'gallery' && (
        /* ================= 3. GALLERY COLLECTION ================= */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              Galeri Aset Media Pembelajaran ({galleryAssets.length} Aset Dibuat)
            </h4>
          </div>

          {galleryAssets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm space-y-3 p-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="aspect-video bg-black rounded-xl overflow-hidden relative">
                      {asset.type === 'video' ? (
                        <video
                          src={asset.url}
                          controls
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={asset.url}
                          alt={asset.prompt}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400 uppercase">
                        {asset.type} {asset.resolution ? `(${asset.resolution})` : `(${asset.aspectRatio})`}
                      </span>
                      <span>{asset.createdAt}</span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2">
                      {asset.prompt}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                    <a
                      href={asset.url}
                      download={`asset-${asset.id}.${asset.type === 'video' ? 'mp4' : 'png'}`}
                      className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh File</span>
                    </a>

                    {asset.type === 'image' && (
                      <button
                        onClick={() => handleSendToVideoStudio(asset.url)}
                        className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 flex items-center gap-1"
                      >
                        <Film className="w-3.5 h-3.5" />
                        <span>Animasi</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
              <Layers className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
              <div className="text-sm font-semibold">Belum Ada Media yang Disimpan</div>
              <p className="text-xs text-slate-400">
                Gambar dan video yang kamu buat akan otomatis terkumpul di sini.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
