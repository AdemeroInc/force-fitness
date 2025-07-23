# Force Fitness

A modern fitness tracking application built with Next.js and Firebase App Hosting.

## Features

- 🏋️ Workout tracking and logging
- 🎯 Goal setting and progress monitoring  
- 📊 Progress visualization and analytics
- 🔥 Firebase backend integration
- 📱 Responsive design with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase CLI

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd force-fitness
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase configuration:
   - Create a Firebase project at https://console.firebase.google.com
   - Copy your Firebase configuration
   - Update `.env.local` with your Firebase credentials

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Firebase App Hosting Deployment

This application is configured for Firebase App Hosting with automatic Next.js support.

### Setup Firebase App Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
firebase init hosting
```

4. Deploy to Firebase App Hosting:
```bash
firebase deploy
```

### Configuration Files

- `firebase.json` - Firebase configuration
- `.firebaserc` - Firebase project settings
- `src/lib/firebase.ts` - Firebase client configuration

## Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication)
- **Hosting**: Firebase App Hosting
- **Language**: TypeScript

## Project Structure

```
src/
  app/                 # Next.js App Router pages
    workouts/         # Workout tracking page
    goals/           # Goals management page
  components/         # Reusable React components
  lib/               # Utility functions and configurations
    firebase.ts      # Firebase configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.