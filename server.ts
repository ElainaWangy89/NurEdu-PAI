import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Increase JSON body limit to support base64 image uploads for video animation
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Initialize Google GenAI client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: Generate High-Quality Educational Images (gemini-3-pro-image-preview)
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, imageSize = '1K', aspectRatio = '16:9' } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt materi visual PAI wajib diisi.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY belum dikonfigurasi di server. Pastikan API key telah terpasang.',
      });
    }

    // Call gemini-3-pro-image-preview model with requested image size and aspect ratio
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: `High quality Islamic educational illustration, respectful Islamic art aesthetic, suitable for Indonesian PAI (Pendidikan Agama Islam) learning media: ${prompt}. Clean lighting, vivid detail, no blasphemous depictions.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as '1:1' | '3:4' | '4:3' | '9:16' | '16:9',
          imageSize: imageSize as '1K' | '2K' | '4K',
        },
      },
    });

    let foundImage: { data: string; mimeType: string } | null = null;
    let textResponse = '';

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        foundImage = {
          data: part.inlineData.data,
          mimeType: part.inlineData.mimeType || 'image/png',
        };
        break;
      }
      if (part.text) {
        textResponse += part.text;
      }
    }

    if (!foundImage) {
      return res.status(422).json({
        error: 'Model tidak mengembalikan gambar. ' + (textResponse || 'Coba perbaiki prompt.'),
      });
    }

    const imageUrl = `data:${foundImage.mimeType};base64,${foundImage.data}`;
    return res.json({
      success: true,
      imageUrl,
      prompt,
      imageSize,
      aspectRatio,
      createdAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error generating image:', error);
    const message = error?.message || 'Gagal membuat gambar ilustrasi PAI.';
    return res.status(500).json({ error: message });
  }
});

// Endpoint: Animate Image into Video (gemini-omni-1.2-flash via Interactions API)
app.post('/api/animate-video', async (req, res) => {
  try {
    const {
      imageBase64,
      mimeType = 'image/jpeg',
      prompt = 'Animate this Islamic educational scene with gentle subtle cinematic motion, soft breeze, and serene golden lighting.',
      aspectRatio = '16:9',
    } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Data gambar (base64) wajib disediakan untuk animasi video.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY belum dikonfigurasi di server. Pastikan API key telah terpasang.',
      });
    }

    // Clean base64 prefix if provided (e.g. data:image/jpeg;base64,...)
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');

    // Format aspect ratio: must be '16:9' or '9:16'
    const targetAspectRatio = aspectRatio === '9:16' ? '9:16' : '16:9';

    // Call gemini-omni-1.2-flash via ai.interactions.create
    const interaction = await ai.interactions.create(
      {
        model: 'gemini-omni-1.2-flash',
        input: [
          {
            type: 'image',
            mime_type: mimeType,
            data: cleanBase64,
          },
          {
            type: 'text',
            text: `${prompt}. High educational quality, graceful realistic fluid animation.`,
          },
        ],
        background: false,
        store: false,
        stream: false,
        response_format: {
          type: 'video',
          aspect_ratio: targetAspectRatio,
        },
      },
      { timeout: 300000 }
    );

    const videoPart = interaction.output_video;
    let videoBase64Data: string | null = null;
    let videoMimeType = 'video/mp4';

    if (videoPart?.data) {
      videoBase64Data = videoPart.data;
      videoMimeType = videoPart.mime_type || 'video/mp4';
    } else {
      // Traverse steps
      for (const step of interaction.steps || []) {
        if (step.type === 'model_output' && step.content) {
          const vContent = step.content.find((c: any) => c.type === 'video');
          if (vContent && (vContent as any).data) {
            videoBase64Data = (vContent as any).data;
            videoMimeType = (vContent as any).mime_type || 'video/mp4';
            break;
          }
        }
      }
    }

    if (!videoBase64Data) {
      return res.status(422).json({
        error: 'Model tidak mengembalikan data video animasi. Pastikan API key mendukung model video.',
      });
    }

    const videoUrl = `data:${videoMimeType};base64,${videoBase64Data}`;
    return res.json({
      success: true,
      videoUrl,
      aspectRatio: targetAspectRatio,
      prompt,
      createdAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error animating video:', error);
    const message = error?.message || 'Gagal mengubah gambar menjadi video animasi.';
    return res.status(500).json({ error: message });
  }
});

// Endpoint: AI Asisten Belajar PAI & Guru Cerdas (gemini-3.8-flash)
app.post('/api/consult-ai', async (req, res) => {
  try {
    const { query, topic, level } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Pertanyaan atau topik wajib diisi.' });
    }

    const systemInstruction = `Anda adalah Guru Ahli Pendidikan Agama Islam (PAI) berbasis Kurikulum Merdeka di Indonesia. 
Sampaikan penjelasan yang santun, moderat (wasathiyah), berlandaskan dalil Al-Qur'an dan Hadis shahih, mudah dipahami siswa jenjang ${level || 'SMP/SMA'}, dengan gaya bahasa edukatif, inspiratif, dan aplikatif dalam kehidupan sehari-hari. Berikan juga rujukan ayat/hadis dan tips aksi nyata.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Topik Pembelajaran: ${topic || 'Pendidikan Agama Islam'}
Pertanyaan/Studi Kasus Siswa: ${query}`,
      config: {
        systemInstruction,
      },
    });

    return res.json({
      success: true,
      answer: response.text || 'Tidak ada tanggapan yang dihasilkan.',
    });
  } catch (error: any) {
    console.error('Error consult-ai:', error);
    return res.status(500).json({ error: error?.message || 'Gagal memproses konsultasi PAI.' });
  }
});

// Dev vs Prod Vite mounting
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NurEdu PAI Server berjalan di http://0.0.0.0:${PORT}`);
  });
}

startServer();
