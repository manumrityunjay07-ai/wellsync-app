# WellSync — Every Part of You, In Sync

A complete, zero-budget personal health intelligence system. WellSync tracks 6 pillars of your health — mental, fitness, nutrition, sleep, vitals, and wellness — and uses Google Gemini AI to find patterns across them, all for free.

## Features
- **PWA Ready**: Installable as a mobile app directly from the browser.
- **AI WellScore**: Gemini Flash generates a daily score and briefing based on all your logs.
- **6 Health Pillars**: Track mood, workouts, meals, sleep, vitals, and habits in one clean dashboard.
- **WellBot**: A contextual AI health chat assistant.
- **Google Fit Integration**: Sync steps and workout data via Google OAuth.
- **Data Export**: Export all your data to CSV.
- **Zero Cost Stack**: React, Vite, Node.js, Express, Supabase (Free Tier), Gemini API (Free Tier), Railway & Vercel.

## Project Structure
- `/client`: React + Vite frontend (Tailwind CSS, Framer Motion)
- `/server`: Node.js + Express backend

## Environment Setup
Copy the example files and fill in your own credentials:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

### Server `.env`
```
PORT=5000
NODE_ENV=development

# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# Google OAuth (for Fit / Calendar integrations)
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/integrations/google/callback
```

### Client `.env`
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:5000
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
1. **Frontend**: Deploy the `client` folder to Vercel. Connect your GitHub repository and it will automatically build using Vite. Set your `VITE_` environment variables in the Vercel dashboard.
2. **Backend**: Deploy the `server` folder to Railway (or Render) as a Web Service. Set all environment variables in the dashboard and use `node app.js` as the start command.

---
*Built as a 3rd Year Project.*
