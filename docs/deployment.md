# Deployment Guide

## Overview

This guide covers the complete deployment process for Force Fitness, from development environment setup to production deployment on Firebase App Hosting. The platform uses a modern CI/CD pipeline with automated testing, building, and deployment.

## 🚀 Quick Deployment

### Prerequisites
```bash
# Required tools
node --version    # v18.0.0 or higher
npm --version     # v8.0.0 or higher
git --version     # Latest stable

# Firebase CLI
npm install -g firebase-tools
firebase --version # v12.0.0 or higher
```

### One-Command Deployment
```bash
# Deploy to production
npm run deploy:prod

# Deploy to development
npm run deploy:dev
```

## 🛠️ Environment Setup

### Local Development Environment
```bash
# Clone repository
git clone https://github.com/AdemeroInc/force-fitness.git
cd force-fitness

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

### Environment Variables

#### Development (.env.local)
```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_dev_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=force-fitness-dev.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=force-fitness-dev
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=force-fitness-dev.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_dev_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_dev_app_id

# AI Services
OPENAI_API_KEY=your_openai_api_key

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_HOTJAR_ID=your_hotjar_id

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_ERROR_REPORTING=true
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true
```

#### Production (.env.production)
```bash
# Firebase Configuration (Production)
NEXT_PUBLIC_FIREBASE_API_KEY=your_prod_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=force-fitness.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=force-fitness
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=force-fitness.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_prod_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_prod_app_id

# AI Services (Production)
OPENAI_API_KEY=your_prod_openai_api_key

# Payment Processing
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Analytics (Production)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_HOTJAR_ID=your_prod_hotjar_id

# Security
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=https://force-fitness.com

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_ERROR_REPORTING=true
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true
```

## 🔥 Firebase Configuration

### Project Setup
```bash
# Login to Firebase
firebase login

# Initialize Firebase project
firebase init

# Select the following services:
# ✅ Firestore: Configure security rules and indexes
# ✅ Hosting: Configure files for Firebase Hosting
# ✅ Storage: Configure a security rules file for Cloud Storage
# ✅ Functions: Configure a Cloud Functions directory (optional)

# Configure Firebase projects
firebase use --add
# Select your project and assign alias (dev, staging, prod)
```

### Firebase App Hosting Configuration

Force Fitness uses **Firebase App Hosting**, Google's new service specifically designed for Next.js applications with native SSR support.

#### Key Differences from Traditional Hosting:
- **Native Next.js Support**: No need for static export
- **Server-Side Rendering**: Full SSR/SSG capabilities
- **Automatic Builds**: Builds directly from Git repository
- **Enhanced Performance**: Built-in CDN and edge caching
- **Firebase Integration**: Seamless service integration

#### firebase.json
```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "hosting": {
    "source": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**",
      "docs/**"
    ],
    "frameworksBackend": {
      "region": "us-central1",
      "maxInstances": 100,
      "minInstances": 0,
      "concurrency": 1000,
      "cpu": 1,
      "memory": "1GiB"
    }
  },
  "apphosting": {
    "source": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**",
      "docs/**"
    ]
  },
    "headers": [
      {
        "source": "**/*.@(js|css|woff2|woff|ttf|eot)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|ico)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "**/*.@(html|json)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=0, must-revalidate"
          }
        ]
      }
    ],
    "cleanUrls": true,
    "trailingSlash": false
  },
  "storage": {
    "rules": "storage.rules"
  },
  "emulators": {
    "auth": {
      "port": 9099
    },
    "firestore": {
      "port": 8080
    },
    "hosting": {
      "port": 5000
    },
    "storage": {
      "port": 9199
    },
    "ui": {
      "enabled": true,
      "port": 4000
    }
  }
}
```

#### .firebaserc
```json
{
  "projects": {
    "development": "force-fitness-dev",
    "staging": "force-fitness-staging",
    "production": "force-fitness"
  },
  "targets": {
    "force-fitness": {
      "hosting": {
        "app": [
          "force-fitness"
        ]
      }
    }
  },
  "etags": {},
  "dataconnectEmulatorConfig": {}
}
```

### Security Rules

#### Firestore Rules (firestore.rules)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Allow reading public profiles
      allow read: if request.auth != null && 
        resource.data.privacy.profileVisibility == 'public';
    }
    
    // Conversations are private to the user
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
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
    
    // Achievements can be read by authenticated users
    match /achievements/{achievementId} {
      allow read: if request.auth != null;
      allow write: if false; // Only system can write achievements
    }
    
    // User achievements are private
    match /userAchievements/{userAchievementId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    function isValidUserData() {
      return request.resource.data.keys().hasAll(['uid', 'email', 'createdAt']);
    }
  }
}
```

#### Storage Rules (storage.rules)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // User profile images
    match /users/{userId}/profile/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.auth.uid == userId &&
        isValidImage() &&
        request.resource.size < 5 * 1024 * 1024; // 5MB limit
    }
    
    // Progress photos
    match /users/{userId}/progress/{fileName} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId &&
        isValidImage() &&
        request.resource.size < 10 * 1024 * 1024; // 10MB limit
    }
    
    // Workout videos
    match /users/{userId}/workouts/{fileName} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId &&
        isValidVideo() &&
        request.resource.size < 100 * 1024 * 1024; // 100MB limit
    }
    
    // Helper functions
    function isValidImage() {
      return request.resource.contentType.matches('image/.*');
    }
    
    function isValidVideo() {
      return request.resource.contentType.matches('video/.*');
    }
  }
}
```

## 📦 Build Process

### Next.js Configuration for App Hosting
```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Essential for Firebase App Hosting
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin'],
  },
  
  // Image optimization enabled for App Hosting
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'lh3.googleusercontent.com',
    ],
    unoptimized: false, // Keep optimized for App Hosting
  },
  
  // Build-time environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Custom webpack config if needed
    return config;
  },
  
  // Build time optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  // Performance monitoring
  analyticsId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
};

export default nextConfig;
```

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "export": "next export",
    
    // Firebase App Hosting deployment scripts
    "deploy:dev": "npm run build && firebase use development && firebase deploy --only apphosting",
    "deploy:staging": "npm run build && firebase use staging && firebase deploy --only apphosting", 
    "deploy:prod": "npm run build && firebase use production && firebase deploy --only apphosting",
    
    // Database deployment
    "deploy:rules": "firebase deploy --only firestore:rules,storage:rules",
    "deploy:indexes": "firebase deploy --only firestore:indexes",
    
    // Development tools
    "emulators": "firebase emulators:start",
    "clean": "rm -rf .next out",
    "analyze": "ANALYZE=true npm run build",
    
    // Quality checks
    "check": "npm run type-check && npm run lint && npm run test",
    "fix": "npm run lint -- --fix"
  }
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

#### .github/workflows/deploy.yml
```yaml
name: Deploy to Firebase

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run type checking
        run: npm run type-check
      
      - name: Run linting
        run: npm run lint
      
      - name: Run tests
        run: npm run test:coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
          NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
          NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
          NEXT_PUBLIC_FIREBASE_APP_ID: ${{ secrets.FIREBASE_APP_ID }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
      
      - name: Export static files
        run: npm run export
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: out/

  deploy-development:
    if: github.ref == 'refs/heads/develop'
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: out/
      
      - name: Deploy to Firebase Development
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT_DEV }}'
          projectId: force-fitness-dev
          channelId: live

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: build
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: out/
      
      - name: Deploy to Firebase Production
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT_PROD }}'
          projectId: force-fitness
          channelId: live
      
      - name: Notify deployment success
        uses: 8398a7/action-slack@v3
        with:
          status: success
          channel: '#deployments'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
          message: '🚀 Force Fitness deployed to production successfully!'
```

### Manual Deployment Process

#### Pre-deployment Checklist
```bash
# 1. Quality checks
npm run type-check
npm run lint
npm run test

# 2. Build verification
npm run build

# 3. Environment verification
firebase projects:list
firebase use production  # or development

# 4. Database rules update (if needed)
firebase deploy --only firestore:rules
firebase deploy --only storage:rules

# 5. Deploy to App Hosting
firebase deploy --only apphosting
```

#### App Hosting Deployment Commands
```bash
# Development deployment
firebase use development
npm run deploy:dev

# Staging deployment
firebase use staging
npm run deploy:staging

# Production deployment (requires confirmation)
firebase use production
npm run deploy:prod

# Deploy specific services
firebase deploy --only apphosting
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
firebase deploy --only firestore:indexes

# Combined deployment (App Hosting + Database)
firebase deploy --only apphosting,firestore:rules,storage:rules
```

## 🔍 Monitoring & Health Checks

### Performance Monitoring
```typescript
// pages/_app.tsx
import { performance } from 'firebase/performance';

const perf = getPerformance(app);

// Custom performance tracking
const trace = trace(perf, 'page_load');
trace.start();
// ... page loading logic
trace.stop();
```

### Error Monitoring
```typescript
// lib/monitoring.ts
interface ErrorReport {
  message: string;
  stack?: string;
  userId?: string;
  timestamp: Date;
  url: string;
  userAgent: string;
  buildVersion: string;
}

export const reportError = async (error: Error, context?: any) => {
  const report: ErrorReport = {
    message: error.message,
    stack: error.stack,
    userId: auth.currentUser?.uid,
    timestamp: new Date(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    buildVersion: process.env.NEXT_PUBLIC_BUILD_VERSION || 'unknown'
  };
  
  // Send to monitoring service
  await fetch('/api/errors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: report, context })
  });
};
```

### Health Check Endpoint
```typescript
// pages/api/health.ts
import type { NextApiRequest, NextApiResponse } from 'next';

interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  services: {
    firebase: 'up' | 'down';
    openai: 'up' | 'down';
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthCheck>
) {
  try {
    // Check Firebase connection
    const firebaseStatus = await checkFirebaseConnection();
    
    // Check OpenAI connection
    const openaiStatus = await checkOpenAIConnection();
    
    const health: HealthCheck = {
      status: firebaseStatus === 'up' && openaiStatus === 'up' ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_BUILD_VERSION || 'unknown',
      services: {
        firebase: firebaseStatus,
        openai: openaiStatus
      }
    };
    
    const statusCode = health.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_BUILD_VERSION || 'unknown',
      services: {
        firebase: 'down',
        openai: 'down'
      }
    });
  }
}
```

## 📊 Performance Optimization

### Build Optimization
```typescript
// Build-time optimizations
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Production client-side optimizations
      config.resolve.alias = {
        ...config.resolve.alias,
        '@sentry/node': '@sentry/browser',
      };
    }
    
    return config;
  },
  
  // Experimental optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@firebase/auth',
      '@firebase/firestore'
    ],
  },
});
```

### CDN Configuration
```json
{
  "hosting": {
    "headers": [
      {
        "source": "/static/**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          },
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          }
        ]
      }
    ]
  }
}
```

## 🔒 Security Configuration

### Content Security Policy
```typescript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.firebaseapp.com *.googleapis.com",
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
      "img-src 'self' data: blob: *.firebasestorage.app *.googleusercontent.com",
      "font-src 'self' fonts.gstatic.com",
      "connect-src 'self' *.firebase.googleapis.com *.firestore.googleapis.com api.openai.com"
    ].join('; ')
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
```

## 🚨 Rollback Strategy

### Quick Rollback
```bash
# Rollback to previous deployment
firebase hosting:clone SOURCE_SITE_ID TARGET_SITE_ID

# Or redeploy previous version
git checkout PREVIOUS_COMMIT_HASH
npm run deploy:prod
```

### Database Rollback
```bash
# Export current data (backup)
firebase firestore:export gs://your-bucket/backup-$(date +%Y%m%d)

# Restore from backup (if needed)
firebase firestore:import gs://your-bucket/backup-20240101
```

## 🔧 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and rebuild
rm -rf .next out node_modules
npm install
npm run build
```

#### Deployment Issues
```bash
# Check Firebase project status
firebase projects:list
firebase use --list

# Verify authentication
firebase login --reauth

# Check quotas and limits
firebase functions:log
```

#### Performance Issues
```bash
# Analyze bundle size
npm run analyze

# Check Firebase usage
firebase projects:list
# Check Firebase console for quotas
```

---

This deployment guide ensures reliable, secure, and performant deployments of Force Fitness across all environments while maintaining best practices for modern web applications.