# Visual Identity Guidelines

## Overview

Force Fitness visual identity is designed to inspire, motivate, and reflect the premium nature of our platform. Every visual element should communicate excellence, creativity, and the sophisticated taste of our high-performing target audience.

## 🎨 Brand Foundation

### Core Visual Principle
**"Every pixel should inspire greatness."**

Our visual identity transcends traditional fitness app aesthetics, embracing an artistic, high-end approach that resonates with creative professionals and industry leaders.

### Brand Personality
- **Premium**: High-end, luxury experience
- **Artistic**: Creative, expressive, visually striking
- **Confident**: Bold, assertive, commanding attention
- **Inspiring**: Motivational, uplifting, empowering
- **Sophisticated**: Refined, polished, professional

## 🌈 Color Palette

### Primary Colors

#### Gold to Orange Gradient
```css
/* CSS Implementation */
.primary-gradient {
  background: linear-gradient(135deg, #FCD34D 0%, #F59E0B 50%, #EA580C 100%);
}
```

**Color Values**:
- Gold: `#FCD34D` (RGB: 252, 211, 77)
- Amber: `#F59E0B` (RGB: 245, 158, 11)
- Orange: `#EA580C` (RGB: 234, 88, 12)

**Psychology & Usage**:
- **Gold**: Excellence, achievement, luxury, success
- **Orange**: Energy, enthusiasm, creativity, determination
- **Application**: Primary buttons, hero elements, call-to-actions, achievements

#### Purple to Pink Gradient
```css
.secondary-gradient {
  background: linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #EC4899 100%);
}
```

**Color Values**:
- Purple: `#8B5CF6` (RGB: 139, 92, 246)
- Violet: `#A855F7` (RGB: 168, 85, 247)
- Pink: `#EC4899` (RGB: 236, 72, 153)

**Psychology & Usage**:
- **Purple**: Luxury, creativity, transformation, wisdom
- **Pink**: Energy, playfulness, approachability, innovation
- **Application**: Secondary buttons, accents, coach personalities, interactive elements

### Neutral Colors

#### Dark Palette
```css
/* Dark theme colors */
.bg-black { background-color: #000000; }
.bg-gray-900 { background-color: #111827; }
.bg-gray-800 { background-color: #1F2937; }
.bg-gray-700 { background-color: #374151; }
```

**Usage**:
- **Pure Black (#000000)**: Primary backgrounds, maximum contrast
- **Gray-900**: Card backgrounds, secondary surfaces
- **Gray-800**: Borders, dividers, subtle elements
- **Gray-700**: Disabled states, placeholder text

#### Light Accents
```css
/* Light accents for contrast */
.text-white { color: #FFFFFF; }
.text-gray-100 { color: #F3F4F6; }
.text-gray-200 { color: #E5E7EB; }
.text-gray-300 { color: #D1D5DB; }
```

**Usage**:
- **White**: Primary text, high contrast elements
- **Gray-100**: Secondary text, descriptions
- **Gray-200**: Tertiary text, metadata
- **Gray-300**: Placeholder text, disabled content

### Accent Colors

#### Success & Status Colors
```css
.success-green { color: #10B981; }
.warning-yellow { color: #F59E0B; }
.error-red { color: #EF4444; }
.info-blue { color: #3B82F6; }
```

**Usage Guidelines**:
- **Green**: Success states, completed workouts, positive feedback
- **Yellow**: Warnings, attention-needed items, caution states
- **Red**: Errors, critical information, urgent actions
- **Blue**: Information, tips, neutral notifications

## 🎭 Typography System

### Font Hierarchy

#### Display Font - Montserrat
```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');

.font-display {
  font-family: 'Montserrat', sans-serif;
}
```

**Usage**:
- **Headlines**: Major headings, hero titles, brand statements
- **Weights**: 700-900 for maximum impact
- **Characteristics**: Bold, commanding, attention-grabbing

#### Body Font - Inter
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.font-body {
  font-family: 'Inter', sans-serif;
}
```

**Usage**:
- **Body Text**: Paragraphs, descriptions, form labels
- **UI Elements**: Buttons, navigation, interface text
- **Characteristics**: Highly readable, modern, clean

### Typography Scale

#### Heading Styles
```css
/* H1 - Hero Headlines */
.text-hero {
  font-size: 4rem; /* 64px */
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.02em;
  font-family: 'Montserrat', sans-serif;
}

/* H2 - Section Headlines */
.text-section {
  font-size: 3rem; /* 48px */
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.01em;
  font-family: 'Montserrat', sans-serif;
}

/* H3 - Subsection Headlines */
.text-subsection {
  font-size: 2rem; /* 32px */
  font-weight: 700;
  line-height: 1.3;
  font-family: 'Montserrat', sans-serif;
}

/* H4 - Component Headlines */
.text-component {
  font-size: 1.5rem; /* 24px */
  font-weight: 600;
  line-height: 1.4;
  font-family: 'Inter', sans-serif;
}
```

#### Body Text Styles
```css
/* Large Body - Important descriptions */
.text-large {
  font-size: 1.25rem; /* 20px */
  font-weight: 400;
  line-height: 1.6;
  font-family: 'Inter', sans-serif;
}

/* Base Body - Standard text */
.text-base {
  font-size: 1rem; /* 16px */
  font-weight: 400;
  line-height: 1.6;
  font-family: 'Inter', sans-serif;
}

/* Small Body - Secondary information */
.text-small {
  font-size: 0.875rem; /* 14px */
  font-weight: 400;
  line-height: 1.5;
  font-family: 'Inter', sans-serif;
}

/* Caption - Metadata, timestamps */
.text-caption {
  font-size: 0.75rem; /* 12px */
  font-weight: 500;
  line-height: 1.4;
  font-family: 'Inter', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

#### Special Text Treatments
```css
/* Motivational Text - Uppercase, bold, spaced */
.text-motivational {
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  background: linear-gradient(135deg, #FCD34D, #EA580C);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Coach Speech - Italicized, personality-driven */
.text-coach {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-style: italic;
  line-height: 1.6;
  position: relative;
}

.text-coach::before {
  content: """;
  font-size: 1.5em;
  position: absolute;
  left: -0.5em;
  top: -0.2em;
  opacity: 0.5;
}
```

## 🎪 Iconography

### Icon System - Lucide React

#### Icon Categories
```typescript
// Fitness & Health Icons
import {
  Dumbbell,      // Strength training
  Heart,         // Cardio, health
  Target,        // Goals, objectives
  TrendingUp,    // Progress, improvement
  Zap,           // Energy, power
  Timer,         // Duration, timing
  Users,         // Community, social
  Calendar       // Scheduling, planning
} from 'lucide-react';

// Navigation & Interface Icons
import {
  Home,          // Dashboard
  MessageCircle, // Chat, coaching
  Settings,      // Preferences
  User,          // Profile
  Search,        // Discovery
  Bell,          // Notifications
  Menu,          // Navigation
  X              // Close, cancel
} from 'lucide-react';

// Status & Feedback Icons
import {
  CheckCircle,   // Success, completed
  AlertCircle,   // Warning, attention
  XCircle,       // Error, failure
  Info,          // Information
  Star,          // Rating, favorite
  Crown,         // Premium, elite
  Award,         // Achievement
  Flame          // Streak, motivation
} from 'lucide-react';
```

#### Icon Usage Guidelines
```css
/* Icon Sizing System */
.icon-sm { width: 16px; height: 16px; }
.icon-md { width: 24px; height: 24px; }
.icon-lg { width: 32px; height: 32px; }
.icon-xl { width: 48px; height: 48px; }

/* Icon Color Classes */
.icon-primary { color: #F59E0B; }
.icon-secondary { color: #A855F7; }
.icon-success { color: #10B981; }
.icon-warning { color: #F59E0B; }
.icon-error { color: #EF4444; }
.icon-muted { color: #6B7280; }
```

### Custom Brand Icons

#### Coach Persona Icons
```typescript
// Custom SVG icons for each coach
const CoachIcons = {
  marcus: (
    <svg viewBox="0 0 24 24" className="coach-icon">
      {/* Olympic torch/flame representing elite performance */}
    </svg>
  ),
  serena: (
    <svg viewBox="0 0 24 24" className="coach-icon">
      {/* Lotus flower representing mindfulness and balance */}
    </svg>
  ),
  alex: (
    <svg viewBox="0 0 24 24" className="coach-icon">
      {/* DNA helix representing scientific approach */}
    </svg>
  ),
  riley: (
    <svg viewBox="0 0 24 24" className="coach-icon">
      {/* Burst/star representing energy and motivation */}
    </svg>
  )
};
```

## 🎬 Animation & Motion

### Animation Principles

#### Core Animation Values
```css
/* Timing Functions */
:root {
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --ease-sharp: cubic-bezier(0.4, 0, 0.6, 1);
}

/* Duration Scale */
:root {
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --duration-slower: 800ms;
}
```

#### Common Animation Patterns
```css
/* Fade In Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale In Animation */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Gradient Animation */
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Floating Animation */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
```

### Framer Motion Variants
```typescript
// Page transition variants
export const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.8,
    filter: 'blur(10px)'
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  },
  exit: {
    opacity: 0,
    scale: 1.1,
    filter: 'blur(10px)',
    transition: { duration: 0.5 }
  }
};

// Stagger children animation
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Button hover animation
export const buttonHover = {
  scale: 1.02,
  transition: {
    duration: 0.2,
    ease: 'easeOut'
  }
};

// Card hover animation
export const cardHover = {
  y: -10,
  scale: 1.02,
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  transition: {
    duration: 0.3,
    ease: 'easeOut'
  }
};
```

## 🖼️ Visual Elements

### Background Patterns

#### Gradient Backgrounds
```css
/* Hero gradient background */
.bg-hero {
  background: radial-gradient(circle at 30% 40%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(236, 72, 153, 0.2) 0%, transparent 50%),
              #000000;
}

/* Card gradient border */
.card-gradient-border {
  background: linear-gradient(135deg, #FCD34D, #EA580C, #A855F7, #EC4899);
  padding: 2px;
  border-radius: 16px;
}

.card-gradient-border::before {
  content: '';
  background: #000000;
  border-radius: 14px;
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
}
```

#### Particle Effects
```typescript
// Floating particles component
export const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-yellow-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, -100, -20],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};
```

### Glass Morphism Effects
```css
/* Glass card effect */
.glass-card {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

/* Glass button effect */
.glass-button {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.glass-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}
```

## 📐 Layout & Spacing

### Spacing System
```css
/* Spacing scale based on 4px base unit */
:root {
  --space-0: 0px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
  --space-32: 128px;
}
```

### Grid System
```css
/* Container sizes */
.container-sm { max-width: 640px; }
.container-md { max-width: 768px; }
.container-lg { max-width: 1024px; }
.container-xl { max-width: 1280px; }
.container-2xl { max-width: 1536px; }

/* Grid layouts */
.grid-cols-auto { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
.grid-cols-responsive { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
```

### Component Spacing
```css
/* Section spacing */
.section-padding { padding: 6rem 0; }
.section-padding-sm { padding: 4rem 0; }

/* Card spacing */
.card-padding { padding: 2rem; }
.card-padding-sm { padding: 1.5rem; }

/* Content spacing */
.content-spacing > * + * { margin-top: 1.5rem; }
.content-spacing-sm > * + * { margin-top: 1rem; }
```

## 🎯 Component Design Patterns

### Button Styles
```css
/* Primary button */
.btn-primary {
  background: linear-gradient(135deg, #FCD34D, #EA580C);
  color: #000000;
  font-weight: 800;
  font-family: 'Montserrat', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 12px 24px;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(245, 158, 11, 0.3);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px rgba(245, 158, 11, 0.4);
}

/* Secondary button */
.btn-secondary {
  background: linear-gradient(135deg, #8B5CF6, #EC4899);
  color: #FFFFFF;
  font-weight: 700;
  font-family: 'Montserrat', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 12px 24px;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(139, 92, 246, 0.3);
  transition: all 0.3s ease;
}

/* Ghost button */
.btn-ghost {
  background: transparent;
  color: #FFFFFF;
  font-weight: 700;
  font-family: 'Montserrat', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 12px 24px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.btn-ghost:hover {
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}
```

### Card Styles
```css
/* Standard card */
.card {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  border-color: rgba(245, 158, 11, 0.3);
  box-shadow: 0 35px 70px -12px rgba(0, 0, 0, 0.7);
}

/* Feature card with gradient border */
.card-feature {
  position: relative;
  background: linear-gradient(135deg, #FCD34D, #EA580C, #A855F7, #EC4899);
  padding: 2px;
  border-radius: 18px;
}

.card-feature::before {
  content: '';
  background: rgba(0, 0, 0, 0.95);
  border-radius: 16px;
  position: absolute;
  inset: 2px;
}
```

## 📱 Responsive Design

### Breakpoint System
```css
/* Mobile first breakpoints */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### Responsive Typography
```css
/* Fluid typography */
.text-responsive-hero {
  font-size: clamp(2.5rem, 8vw, 5rem);
  line-height: 1.1;
}

.text-responsive-section {
  font-size: clamp(2rem, 6vw, 3.5rem);
  line-height: 1.2;
}

.text-responsive-body {
  font-size: clamp(1rem, 2vw, 1.25rem);
  line-height: 1.6;
}
```

## 🔍 Accessibility

### Color Contrast
- All text maintains WCAG AA compliance (4.5:1 contrast ratio)
- Important actions maintain WCAG AAA compliance (7:1 contrast ratio)
- Color is never the only means of conveying information

### Focus States
```css
/* Focus indicator system */
.focus-ring {
  outline: 2px solid #F59E0B;
  outline-offset: 2px;
  border-radius: 8px;
}

/* High contrast focus for better visibility */
.focus-ring-high-contrast {
  outline: 3px solid #FFFFFF;
  outline-offset: 2px;
  box-shadow: 0 0 0 6px #F59E0B;
}
```

---

This visual identity system ensures that Force Fitness maintains a consistent, premium, and inspiring visual presence across all touchpoints while remaining accessible and functional for all users.