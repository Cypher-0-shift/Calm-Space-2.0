# Quick Setup Guide for Calm Space

## Step-by-Step Instructions

### 1. Install Node.js
- Go to [nodejs.org](https://nodejs.org/)
- Download and install Node.js (version 18 or higher)
- Verify installation: open terminal/command prompt and type `node --version`

### 2. Download the App
- Download all project files to a folder on your computer
- Make sure you have all the files including `package.json`

### 3. Install Dependencies
Open terminal/command prompt in the project folder:
```bash
npm install
```
Wait for installation to complete (may take a few minutes)

### 4. Start the App
```bash
npm run dev
```
The app will open at: http://localhost:5000

### 5. Optional: Add API Keys
For full functionality (AI chat and music), create a `.env` file:
```
GROQ_API_KEY=your_key_here
YOUTUBE_API_KEY=your_key_here
```

## That's it! 
Your Calm Space app is now running locally on your PC.

## Need Help?
- Make sure Node.js is installed correctly
- Check you're in the right folder when running commands
- The app works without API keys (some features will be limited)
- Restart the server if you add API keys later