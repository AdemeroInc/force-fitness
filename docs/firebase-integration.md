# Firebase Integration

## Overview

Force Fitness leverages Firebase as its complete backend-as-a-service platform, providing authentication, real-time database, file storage, and hosting capabilities. This integration enables rapid development while maintaining enterprise-grade security and scalability.

## 🔥 Firebase Services Used

### Core Services
- **Authentication**: User management and security
- **Firestore Database**: Real-time NoSQL database
- **Cloud Storage**: File and media storage
- **App Hosting**: Static site hosting with CDN
- **Cloud Functions**: Serverless compute (future)

## 🔐 Authentication Setup

### Firebase Auth Configuration
```typescript
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Configure providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
```

### Authentication Methods
```typescript
// src/lib/auth.ts
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';

export class AuthService {
  /**
   * Sign in with email and password
   */
  static async signInWithEmail(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      throw new AuthError('Failed to sign in', error);
    }
  }

  /**
   * Create new account with email and password
   */
  static async signUpWithEmail(email: string, password: string, displayName: string) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(result.user, { displayName });
      
      // Create user profile in Firestore
      await this.createUserProfile(result.user);
      
      return result.user;
    } catch (error) {
      throw new AuthError('Failed to create account', error);
    }
  }

  /**
   * Sign in with Google OAuth
   */
  static async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Check if this is the first time signing in
      const isNewUser = result._tokenResponse?.isNewUser;
      
      if (isNewUser) {
        await this.createUserProfile(result.user);
      }
      
      return result.user;
    } catch (error) {
      throw new AuthError('Failed to sign in with Google', error);
    }
  }

  /**
   * Create user profile document in Firestore
   */
  private static async createUserProfile(user: User) {
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      healthProfile: {
        age: 0,
        height: 0,
        weight: 0,
        fitnessLevel: 'beginner',
        medicalConditions: [],
        hormoneTreatment: false,
        allergies: [],
        dietaryRestrictions: []
      },
      preferences: {
        selectedCoach: 'marcus',
        workoutDays: [],
        preferredWorkoutTime: '09:00',
        equipment: [],
        goals: []
      },
      subscription: {
        plan: 'free',
        status: 'active',
        startDate: Timestamp.now(),
        endDate: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) // 7 days free trial
      }
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);
  }
}
```

### Authentication Hooks
```typescript
// src/lib/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { UserProfile } from '@/types/user';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(!user); // If no user, stop loading immediately
      setError(null);
    });

    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const unsubscribeProfile = onSnapshot(
      doc(db, 'users', user.uid),
      (doc) => {
        if (doc.exists()) {
          setProfile(doc.data() as UserProfile);
        } else {
          setProfile(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching user profile:', error);
        setError('Failed to load user profile');
        setLoading(false);
      }
    );

    return unsubscribeProfile;
  }, [user]);

  return {
    user,
    profile,
    loading,
    error,
    isAuthenticated: !!user,
    isProfileComplete: !!(profile?.healthProfile?.age && profile?.preferences?.selectedCoach)
  };
};
```

## 🗄️ Firestore Database Structure

### Collections Overview
```
force-fitness/
├── users/              # User profiles and settings
├── conversations/      # AI coaching conversations
├── workoutPlans/      # Generated workout plans
├── mealPlans/         # Generated meal plans
├── progress/          # User progress tracking
└── feedback/          # User feedback and ratings
```

### User Profile Schema
```typescript
interface UserProfile {
  // Basic Information
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;

  // Health Profile
  healthProfile: {
    age: number;
    height: number; // in cm
    weight: number; // in kg
    fitnessLevel: 'beginner' | 'intermediate' | 'advanced' | 'elite';
    medicalConditions: string[];
    hormoneTreatment: boolean;
    allergies: string[];
    dietaryRestrictions: string[];
    injuries?: string[];
    medications?: string[];
  };

  // User Preferences
  preferences: {
    selectedCoach: CoachType;
    workoutDays: string[]; // ['monday', 'wednesday', 'friday']
    preferredWorkoutTime: string; // '09:00'
    workoutDuration: number; // minutes
    equipment: string[];
    goals: string[];
    notificationsEnabled: boolean;
    privateProfile: boolean;
  };

  // Subscription Information
  subscription: {
    plan: 'free' | 'premium' | 'elite';
    status: 'active' | 'canceled' | 'expired' | 'trial';
    startDate: Timestamp;
    endDate: Timestamp;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
  };

  // Usage Statistics
  stats?: {
    totalWorkouts: number;
    totalCoachingMessages: number;
    streakDays: number;
    lastActiveDate: Timestamp;
    favoriteCoach: CoachType;
  };
}
```

### Conversation Schema
```typescript
interface Conversation {
  id: string;
  userId: string;
  coachId: CoachType;
  title: string;
  messages: ChatMessage[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  metadata: {
    totalMessages: number;
    lastActivity: Timestamp;
    context: string[]; // Topics discussed
    sentiment: 'positive' | 'neutral' | 'negative';
    userSatisfaction?: number; // 1-5 rating
  };
  
  // Conversation state
  status: 'active' | 'archived' | 'completed';
  isLocked: boolean; // Premium feature lock
}

interface ChatMessage {
  id: string;
  role: 'user' | 'coach';
  content: string;
  timestamp: Timestamp;
  type: 'text' | 'workout_plan' | 'meal_plan' | 'progress_update';
  metadata?: {
    workoutPlanId?: string;
    mealPlanId?: string;
    mediaUrls?: string[];
  };
}
```

### Database Operations
```typescript
// src/lib/services/firestore.ts
import {
  doc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export class FirestoreService {
  /**
   * Create a new conversation
   */
  static async createConversation(
    userId: string,
    coachId: CoachType,
    initialMessage: string
  ): Promise<string> {
    const conversation: Omit<Conversation, 'id'> = {
      userId,
      coachId,
      title: `Chat with ${coachId}`,
      messages: [{
        id: crypto.randomUUID(),
        role: 'user',
        content: initialMessage,
        timestamp: Timestamp.now(),
        type: 'text'
      }],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      metadata: {
        totalMessages: 1,
        lastActivity: Timestamp.now(),
        context: [],
        sentiment: 'neutral'
      },
      status: 'active',
      isLocked: false
    };

    const docRef = await addDoc(collection(db, 'conversations'), conversation);
    return docRef.id;
  }

  /**
   * Add message to conversation
   */
  static async addMessage(
    conversationId: string,
    message: Omit<ChatMessage, 'id' | 'timestamp'>
  ): Promise<void> {
    const conversationRef = doc(db, 'conversations', conversationId);
    
    const newMessage: ChatMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: Timestamp.now()
    };

    await updateDoc(conversationRef, {
      messages: arrayUnion(newMessage),
      updatedAt: Timestamp.now(),
      'metadata.totalMessages': increment(1),
      'metadata.lastActivity': Timestamp.now()
    });
  }

  /**
   * Get user conversations with pagination
   */
  static async getUserConversations(
    userId: string,
    limitCount: number = 20
  ): Promise<Conversation[]> {
    const q = query(
      collection(db, 'conversations'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Conversation));
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(
    userId: string,
    updates: Partial<UserProfile>
  ): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  }

  /**
   * Subscribe to real-time conversation updates
   */
  static subscribeToConversation(
    conversationId: string,
    callback: (conversation: Conversation) => void
  ): () => void {
    const conversationRef = doc(db, 'conversations', conversationId);
    
    return onSnapshot(conversationRef, (doc) => {
      if (doc.exists()) {
        callback({
          id: doc.id,
          ...doc.data()
        } as Conversation);
      }
    });
  }
}
```

## 🔒 Security Rules

### Firestore Security Rules
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Allow other users to read public profile information only
      allow read: if request.auth != null && 
        resource.data.preferences.privateProfile == false &&
        request.auth.uid != userId;
    }
    
    // Conversations are private to the user
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      
      // Validate conversation data structure
      allow create: if request.auth != null &&
        request.auth.uid == request.resource.data.userId &&
        request.resource.data.keys().hasAll(['userId', 'coachId', 'messages']) &&
        request.resource.data.messages is list;
    }
    
    // Workout plans are private to the user
    match /workoutPlans/{planId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Meal plans are private to the user
    match /mealPlans/{planId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Progress tracking is private to the user
    match /progress/{progressId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Feedback can be read by authenticated users, written by the owner
    match /feedback/{feedbackId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Helper function to validate user data
    function isValidUser() {
      return request.auth != null && 
        request.auth.token.email_verified == true;
    }
    
    // Helper function to check if user owns the document
    function isOwner(userId) {
      return request.auth != null && request.auth.uid == userId;
    }
    
    // Helper function to validate required fields
    function hasRequiredFields(fields) {
      return request.resource.data.keys().hasAll(fields);
    }
  }
}
```

### Storage Security Rules
```javascript
// storage.rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // User profile images
    match /users/{userId}/profile/{fileName} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null; // Public read for profile images
    }
    
    // Workout media (videos, images)
    match /workouts/{userId}/{fileName} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Progress photos
    match /progress/{userId}/{fileName} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Validate file types and sizes
    function isValidImage() {
      return request.resource.contentType.matches('image/.*') &&
        request.resource.size < 5 * 1024 * 1024; // 5MB limit
    }
    
    function isValidVideo() {
      return request.resource.contentType.matches('video/.*') &&
        request.resource.size < 50 * 1024 * 1024; // 50MB limit
    }
  }
}
```

## 📱 Cloud Storage Integration

### File Upload Service
```typescript
// src/lib/services/storage.ts
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll
} from 'firebase/storage';
import { storage } from '@/lib/firebase';

export class StorageService {
  /**
   * Upload user profile image
   */
  static async uploadProfileImage(
    userId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const fileExtension = file.name.split('.').pop();
    const fileName = `profile_${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, `users/${userId}/profile/${fileName}`);

    if (onProgress) {
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          },
          reject,
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    } else {
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    }
  }

  /**
   * Upload progress photo
   */
  static async uploadProgressPhoto(
    userId: string,
    file: File,
    metadata?: { date: string; weight?: number; notes?: string }
  ): Promise<string> {
    const fileExtension = file.name.split('.').pop();
    const fileName = `progress_${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, `progress/${userId}/${fileName}`);

    const uploadMetadata = {
      customMetadata: {
        uploadDate: new Date().toISOString(),
        ...metadata
      }
    };

    const snapshot = await uploadBytes(storageRef, file, uploadMetadata);
    return await getDownloadURL(snapshot.ref);
  }

  /**
   * Delete file from storage
   */
  static async deleteFile(filePath: string): Promise<void> {
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
  }

  /**
   * Get all user files in a directory
   */
  static async getUserFiles(userId: string, directory: string): Promise<string[]> {
    const dirRef = ref(storage, `${directory}/${userId}`);
    const result = await listAll(dirRef);
    
    const downloadURLs = await Promise.all(
      result.items.map(itemRef => getDownloadURL(itemRef))
    );
    
    return downloadURLs;
  }
}
```

## 🚀 Firebase App Hosting

### Deployment Configuration
```typescript
// firebase.json
{
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

### Next.js Configuration for Static Export
```typescript
// next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: false
  }
};

export default nextConfig;
```

## 🔧 Development & Production Environments

### Environment Configuration
```bash
# .env.local (Development)
NEXT_PUBLIC_FIREBASE_API_KEY=your_dev_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=force-fitness-dev.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=force-fitness-dev
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=force-fitness-dev.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_dev_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_dev_app_id

# OpenAI for AI coaching
OPENAI_API_KEY=your_openai_api_key

# Stripe for payments (future)
STRIPE_PUBLISHABLE_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### Deployment Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "export": "next export",
    "deploy:dev": "npm run build && firebase use development && firebase deploy",
    "deploy:prod": "npm run build && firebase use production && firebase deploy",
    "firebase:emulators": "firebase emulators:start",
    "test:e2e": "cypress run"
  }
}
```

## 📊 Performance Optimization

### Firestore Query Optimization
```typescript
// Efficient queries with proper indexing
const getUserWorkouts = async (userId: string, limit = 10) => {
  const q = query(
    collection(db, 'workoutPlans'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(limit)
  );
  
  return getDocs(q);
};

// Use composite indexes for complex queries
const getWorkoutsByCoachAndDate = async (
  userId: string,
  coachId: string,
  startDate: Date
) => {
  const q = query(
    collection(db, 'workoutPlans'),
    where('userId', '==', userId),
    where('coachId', '==', coachId),
    where('createdAt', '>=', Timestamp.fromDate(startDate)),
    orderBy('createdAt', 'desc')
  );
  
  return getDocs(q);
};
```

### Offline Support
```typescript
// Enable offline persistence
import { enableNetwork, disableNetwork } from 'firebase/firestore';

// Enable offline persistence (call once)
enablePersistence(db).catch(err => {
  if (err.code === 'failed-precondition') {
    console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.log('The current browser does not support all of the features required to enable persistence');
  }
});

// Manually control network state
export const goOffline = () => disableNetwork(db);
export const goOnline = () => enableNetwork(db);
```

---

This Firebase integration provides a solid foundation for Force Fitness, ensuring scalable, secure, and performant backend services that can grow with the application's needs while maintaining excellent developer experience.