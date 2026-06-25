# YT Downloader — Setup Guide

## Files Kya Hain:
- `server.js` — Backend server (yt-dlp use karta hai)
- `package.json` — Dependencies list
- `public/downloader.html` — Frontend page jo user dekhega

---

## STEP 1: Render.com Pe Deploy Karna (FREE)

1. **GitHub account banao** (agar nahi hai): github.com
2. Ye saari files ek GitHub repository mein upload karo
   - Naya repo banao (e.g. "yt-downloader")
   - Files upload karo (drag & drop se bhi ho jaata hai GitHub website pe)

3. **Render.com pe jao**: render.com
   - Free account banao (GitHub se sign up kar sakte ho)
   - "New +" button click karo → "Web Service" select karo
   - Apna GitHub repo connect karo

4. **Settings bharo:**
   - Name: `yt-downloader-backend` (ya kuch bhi)
   - Region: Singapore (India ke kareeb)
   - Branch: main
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: **Free**

5. **Create Web Service** click karo

6. 5-10 minute wait karo — Render automatically build karega

7. Deploy hone ke baad ek URL milega jaise:
   ```
   https://yt-downloader-backend-xxxx.onrender.com
   ```

---

## STEP 2: Frontend Connect Karna

1. `public/downloader.html` file kholo
2. Ye line dhundo:
   ```javascript
   const BACKEND_URL = 'https://YOUR-RENDER-APP-NAME.onrender.com';
   ```
3. Apna Render URL yahan paste karo (Step 1.7 wala)
4. Save karo

---

## STEP 3: Frontend Kahan Chalayein

`downloader.html` ko:
- Seedha double-click karke browser mein khol sakte ho, YA
- Netlify.com pe free host kar sakte ho (bas file drag-drop karni hai)

---

## ⚠️ IMPORTANT — Free Tier Ki Limitations

| Limitation | Detail |
|------------|--------|
| Sleep mode | Render free tier 15 min inactivity ke baad sleep ho jaata hai — pehli request slow (30-50 sec) hogi |
| Monthly hours | 750 hours/month free — kaafi hai ek app ke liye |
| yt-dlp breaks | YouTube update karega toh yt-dlp purana ho jaayega — `npm update youtube-dl-exec` chalana padega |

---

## Maintenance — Kab Kya Karna Hai

Agar downloader kaam karna band kare:
```bash
npm update youtube-dl-exec
```
Phir Render pe redeploy karo (automatic ho jaata hai GitHub push pe).

---

## Local Testing (Apne Computer Pe Test Karna)

Agar Node.js installed hai:
```bash
cd yt-downloader-backend
npm install
npm start
```
Phir browser mein: `http://localhost:3000`
