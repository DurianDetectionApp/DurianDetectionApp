# Durly - Ripe Durian Detection App

Durly is a mobile application built with Expo and React Native that helps users estimate durian ripeness from tap sounds. Instead of relying on guesswork, the app records audio, analyzes the sound signal, and returns a clear result with a short explanation.

This project is designed to be practical, mobile-first, and easy to understand for both end users and non-technical reviewers such as HR or recruiters.

## Executive Summary

Durly solves a simple but useful problem: helping people check whether a durian is likely ripe, under-ripe, or over-ripe by recording and analyzing tap sounds.

The app combines a clean UI, audio recording, AI-assisted inference, and local history tracking into a single workflow. It is suitable for a portfolio because it demonstrates product thinking, mobile development, state management, and fallback logic for unreliable APIs.

## Product Overview

Durly follows a straightforward flow:

1. Users sign in or create an account.
2. On the Record screen, users allow microphone access and tap the durian while recording the sound.
3. The recorded audio is passed to the AI analysis layer or a mock fallback.
4. The Result screen shows the ripeness label, confidence score, durian variety, texture, and a short description.
5. Each scan can be stored in History for later review.

The app includes screens for login, registration, recording, history, results, and settings. Under the hood, it uses Zustand for state management, AsyncStorage for local persistence, and React Navigation for smooth navigation.

## Key Features

- Record durian tap sounds using the device microphone.
- Analyze audio to estimate ripeness.
- Display clear labels such as ripe, under-ripe, over-ripe, or undetected.
- Show a short explanation so the result is easy to understand.
- Save scan history for later review.
- Provide authentication screens for a more complete app experience.
- Include a settings screen for app preferences.

## How It Works

Durly currently supports two analysis paths:

- Mock mode: `mockAnalyzeAudio()` creates simulated results for demos and quick testing.
- Production mode: `analyzeAudio()` sends the audio file to the AI endpoint at `https://api.durly.app/predict`.

In this repo, `RecordScreen` currently calls `mockAnalyzeAudio()` by default. `analyzeAudio()` (with mock fallback when the API is unavailable) is implemented in `durian-frontend/src/services/aiService.ts`, but it is not wired into the recording flow yet.

## How to Use

### For End Users

1. Open the app and sign in or register.
2. Go to the Record screen.
3. Allow microphone permission when prompted.
4. Tap the durian and record the sound.
5. Wait for the analysis result.
6. Review the ripeness label, confidence, texture, and description.
7. Open the History screen to see previous scans.

### For HR / Recruiters

If you are reviewing this project as part of a portfolio or job application, here is a concise summary:

- Product goal: help users estimate durian ripeness using audio analysis.
- Platform: mobile app built with Expo and React Native.
- Core strengths: audio recording, AI-assisted inference, local history storage, and a clean navigation flow.
- Technical highlights: Zustand state management, AsyncStorage persistence, Expo AV audio capture, and fallback logic for API failure.
- Business value: reduces manual guesswork and provides a practical, easy-to-use customer-facing tool.

## Demo Flow

Use this flow when presenting the app in a demo or interview:

1. Show the login or register screen to introduce the app entry point.
2. Move to the Record screen and explain microphone permission.
3. Start a recording and highlight the audio visualization.
4. Stop the recording and let the analysis run.
5. Present the Result screen and explain the ripeness decision.
6. Open History to show previous scans are retained.
7. End with Settings to demonstrate a complete app structure.

## Screenshot Placeholders

Add screenshots here when you are ready:

- Login screen
- Register screen
- Record screen
- Result screen
- History screen
- Settings screen

## Tech Stack

- Expo / React Native
- TypeScript
- React Navigation
- Zustand
- Expo AV
- AsyncStorage
- Axios

## Requirements

- Node.js 18 or newer
- npm
- Expo Go or an Android/iOS simulator

## Installation

This project is split into:
- `durian-frontend/`: Expo (React Native) mobile app
- `durian-backend/`: Node/Express API server (optional for local development)

### Frontend (Expo app)
1. Install dependencies:
   ```bash
   cd durian-frontend
   npm install
   ```
2. Start the app:
   ```bash
   npm start
   ```
3. Run on a platform:
   ```bash
   npm run android
   npm run ios
   npm run web
   ```

### Backend (optional)
1. Install dependencies:
   ```bash
   cd durian-backend
   npm install
   ```
2. Start the server (uploads + health check):
   ```bash
   npm run dev
   ```

## Permissions

The app requires microphone access because its main feature is recording durian tap sounds for analysis. The permission text is configured in the app settings for both iOS and Android.

## Project Structure
- `durian-frontend/`: Expo (React Native) app
- `durian-frontend/src/`: Screens, components, audio recording, and AI service (mock + production).
- `durian-frontend/src/store/`: Zustand stores (auth, history, record, settings).
- `durian-frontend/src/theme/`: Colors, typography, and UI helpers.
- `durian-backend/`: Express API server
- `durian-backend/src/`: Upload route/controller + middleware.
- `durian-backend/dist/`: Build output (generated by `npm run build`)

## Notes

- Expo app name: `Durly`
- Package name: `durly-durian`
- The app uses Nunito fonts to keep the UI soft and friendly
