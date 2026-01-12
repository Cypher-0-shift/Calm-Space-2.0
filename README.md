# Calm Space - Mental Wellness App

A comprehensive mental wellness application designed to provide users with a personal sanctuary for emotional support and mental health management. The app features mood tracking, AI-powered chat support, music therapy, journaling, breathing exercises, creative activities, and relaxation tools.

## Features

- **Mood Tracking**: Visual mood selection with dynamic color themes
- **AI Chat Support**: 24/7 compassionate AI assistant powered by Groq
- **Music Therapy**: YouTube integration for calming music and meditation tracks
- **Digital Journaling**: Mood-based writing prompts and reflection tools
- **Panic Relief**: Guided breathing exercises and immediate support
- **Memory Games**: Mindfulness and cognitive training activities
- **Creative Tools**: Drawing and writing with therapeutic prompts
- **Inspiration Hub**: Quotes, affirmations, and success stories
- **Relaxation Center**: Meditation sessions and calming sounds
- **Privacy-First**: All data stored locally on your device

## Prerequisites

Before setting up the app, make sure you have:

- **Node.js** (version 18 or higher) - [Download from nodejs.org](https://nodejs.org/)
- **Git** - [Download from git-scm.com](https://git-scm.com/)
- **API Keys** (optional but recommended for full functionality):
  - Groq API Key (for AI chat) - [Get from groq.com](https://groq.com/)
  - YouTube API Key (for music) - [Get from Google Cloud Console](https://console.cloud.google.com/)

## Installation

### 1. Download the Project

You can either:
- Download the project files as a ZIP and extract them
- Or clone if you have Git: `git clone <repository-url>`

### 2. Install Dependencies

Open a terminal/command prompt in the project folder and run:

```bash
npm install
```

This will install all required dependencies including React, TypeScript, Tailwind CSS, and other libraries.

### 3. Set Up API Keys (Optional)

Create a `.env` file in the root directory and add your API keys:

```bash
# Create .env file
GROQ_API_KEY=your_groq_api_key_here
YOUTUBE_API_KEY=your_youtube_api_key_here
```

**Note**: The app works without API keys, but some features will be limited:
- Without Groq API: AI chat will show an error message
- Without YouTube API: Music search will show an error message

### 4. Start the Application

#### Option A: Standard Method (Mac/Linux/Windows with Git Bash)
```bash
npm run dev
```

#### Option B: Windows Command Prompt
If you get a "'NODE_ENV' is not recognized" error, use:
```batch
start-windows.bat
```

#### Option C: Windows PowerShell
```powershell
.\start-windows.ps1
```

The app will start and be available at: `http://localhost:5000`

## Getting API Keys

### Groq API Key (for AI Chat)
1. Visit [groq.com](https://groq.com/)
2. Sign up for a free account
3. Go to the API section in your dashboard
4. Create a new API key
5. Copy the key and add it to your `.env` file

### YouTube API Key (for Music)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "YouTube Data API v3"
4. Create credentials (API Key)
5. Copy the key and add it to your `.env` file

## Project Structure

```
calm-space/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # App pages (Home, MoodCheck, AIChat, etc.)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   └── lib/           # Libraries and configurations
│   └── index.html         # Main HTML file
├── server/                # Backend Express server
│   ├── index.ts          # Main server file
│   ├── routes.ts         # API routes
│   └── storage.ts        # Data storage interface
├── shared/               # Shared TypeScript types
└── package.json          # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Privacy & Data

- **Local Storage**: All your personal data (mood entries, journal entries, chat history) is stored locally in your browser
- **No Tracking**: The app doesn't collect or send your personal data anywhere
- **API Calls**: Only API calls are made to Groq (for AI chat) and YouTube (for music search) when you use those features

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Close other applications using port 5000
   - Or change the port in `server/index.ts`

2. **API features not working**
   - Check your `.env` file has the correct API keys
   - Restart the server after adding API keys

3. **Installation fails**
   - Make sure you have Node.js 18+ installed
   - Try deleting `node_modules` and running `npm install` again

### Getting Help

If you encounter issues:
1. Check that Node.js is properly installed: `node --version`
2. Make sure you're in the correct project directory
3. Try restarting the development server
4. Check the browser console for error messages

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Wouter (routing)
- **Backend**: Node.js, Express, TypeScript
- **UI Components**: Radix UI with shadcn/ui
- **Build Tools**: Vite for development and building
- **APIs**: Groq (AI), YouTube Data API v3

## Contributing

This is a mental wellness app designed to help people. Feel free to:
- Report bugs or issues
- Suggest new features
- Improve accessibility
- Add more relaxation content

## License

This project is proprietary and **not open source**.

All rights are reserved by the author.  
Use, copying, modification, or distribution of this code is **not permitted**
without explicit written permission.

See the `LICENSE` file for full details.
