# WellSync — Every Part of You, In Sync

A complete, zero-budget personal health intelligence system. WellSync tracks 6 pillars of your health — mental, fitness, nutrition, sleep, vitals, and wellness — and uses Google Gemini AI to find patterns across them, all for free.

## Features
- **PWA Ready**: Installable as a mobile app directly from the browser.
- **AI WellScore**: Gemini 1.5 Flash generates a daily score and briefing based on all your logs.
- **6 Health Pillars**: Track mood, workouts, meals, sleep, vitals, and habits in one clean dashboard.
- **WellBot**: A contextual AI health chat assistant.
- **Data Export**: Export all your data to CSV.
- **Zero Cost Stack**: React, Vite, Node.js, Express, Supabase (Free Tier), Gemini API (Free Tier), Vercel & Render.

## Project Structure
- `/client`: React + Vite frontend (Tailwind CSS, Framer Motion)
- `/server`: Node.js + Express backend

## Environment Setup
Create a `.env` file in both `client` and `server` folders based on the following configurations:

### Client `.env`
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_API_BASE_URL=http://localhost:5000
```

### Server `.env`
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

## Running Locally
1. Run the Supabase SQL schema (`supabase_schema.sql`) in your Supabase project's SQL Editor.
2. Install dependencies:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```
3. Start the dev servers:
   ```bash
   # Terminal 1 (Frontend)
   cd client && npm run dev
   
   # Terminal 2 (Backend)
   cd server && npm start
   ```

## Deployment
1. **Frontend**: Deploy the `client` folder to Vercel. Connect your GitHub repository and it will automatically build using Vite. Ensure you set the `VITE_` environment variables in Vercel.
2. **Backend**: Deploy the `server` folder to Render as a Web Service. Set the environment variables and start command `node app.js`.

---
*Built as a 3rd Year Project.*
