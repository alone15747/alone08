const express = require('express');
const cors = require('cors');
const youtubedl = require('youtube-dl-exec');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check — Render.com isse use karega check karne ke liye ki server zinda hai
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'YT Downloader Backend Running' });
});

// Helper — YouTube URL se Video ID nikalna
function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\s]+)/,
    /(?:youtu\.be\/)([^?\s]+)/,
    /(?:youtube\.com\/shorts\/)([^?\s]+)/,
  ];
  for (const p of patterns) {
    const match = url.match(p);
    if (match) return match[1];
  }
  return null;
}

// MAIN ENDPOINT — Video info + saare quality options nikalna
app.post('/api/video-info', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL zaroori hai' });
  }

  const videoId = extractVideoId(url);
  if (!videoId) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  try {
    // yt-dlp se poora video info nikalna (bina download kiye, sirf metadata)
    const info = await youtubedl(url, {
      dumpSingleJson: true,
      noWarnings: true,
      noCheckCertificates: true,
      preferFreeFormats: true,
      addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
    });

    // Formats ko filter karna — video+audio wale aur audio-only wale
    const videoFormats = [];
    const audioFormats = [];

    if (info.formats) {
      info.formats.forEach((f) => {
        // Video format jisme video bhi hai
        if (f.vcodec && f.vcodec !== 'none' && f.url) {
          videoFormats.push({
            quality: f.format_note || f.height + 'p' || 'unknown',
            height: f.height || 0,
            ext: f.ext,
            filesize: f.filesize || f.filesize_approx || null,
            url: f.url,
            hasAudio: f.acodec && f.acodec !== 'none',
          });
        }
        // Audio-only format (MP3 jaisa)
        if (f.acodec && f.acodec !== 'none' && (!f.vcodec || f.vcodec === 'none') && f.url) {
          audioFormats.push({
            quality: (f.abr ? Math.round(f.abr) + 'kbps' : 'audio'),
            ext: f.ext,
            filesize: f.filesize || f.filesize_approx || null,
            url: f.url,
          });
        }
      });
    }

    // Duplicate heights hatakar best quality wala rakhna, height ke hisaab se sort
    const seenHeights = new Set();
    const uniqueVideoFormats = videoFormats
      .sort((a, b) => b.height - a.height)
      .filter((f) => {
        if (seenHeights.has(f.height)) return false;
        seenHeights.add(f.height);
        return true;
      })
      .slice(0, 8); // Top 8 quality options

    const uniqueAudioFormats = audioFormats.slice(0, 3);

    res.json({
      title: info.title,
      thumbnail: info.thumbnail,
      duration: info.duration,
      channel: info.channel || info.uploader,
      views: info.view_count,
      videoFormats: uniqueVideoFormats,
      audioFormats: uniqueAudioFormats,
    });
  } catch (error) {
    console.error('yt-dlp error:', error.message);
    res.status(500).json({
      error: 'Video info nahi mil paaya. Link check karein ya phir try karein.',
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server chal raha hai port ${PORT} par`);
});
