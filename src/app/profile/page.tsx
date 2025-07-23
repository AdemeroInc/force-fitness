'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Settings, 
  Heart, 
  Activity, 
  Apple, 
  Shield,
  Camera,
  Upload,
  Save,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Bell,
  Globe,
  Calendar,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { db, storage } from '@/lib/firebase';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { 
  updatePassword, 
  reauthenticateWithCredential, 
  EmailAuthProvider,
  deleteUser
} from 'firebase/auth';

// Profile data interface
interface UserProfile {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  location?: string;
  profilePhotoURL?: string;
  
  // Health Information
  height?: number; // in inches
  weight?: number; // in pounds
  medicalConditions: string[];
  medications: string[];
  isOnHormoneReplacement: boolean;
  hormoneDetails?: string;
  
  // Fitness Profile
  fitnessLevel: string;
  primaryGoals: string[];
  activityLevel: string;
  preferredWorkoutTypes: string[];
  availableEquipment: string[];
  timeAvailability: {
    weekdays: number;
    weekends: number;
  };
  
  // Dietary Information
  currentDiet?: string;
  dietaryRestrictions: string[];
  allergies: string[];
  nutritionGoals: string[];
  
  // Coach Selection
  selectedCoach?: string;
  
  // Privacy & Notifications
  notificationSettings: {
    workoutReminders: boolean;
    progressUpdates: boolean;
    socialUpdates: boolean;
    emailNotifications: boolean;
  };
  privacySettings: {
    profileVisibility: 'public' | 'private' | 'friends';
    shareProgress: boolean;
    shareWorkouts: boolean;
  };
  
  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<'personal' | 'health' | 'fitness' | 'dietary' | 'privacy' | 'account'>('personal');
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    medicalConditions: [],
    medications: [],
    isOnHormoneReplacement: false,
    fitnessLevel: '',
    primaryGoals: [],
    activityLevel: '',
    preferredWorkoutTypes: [],
    availableEquipment: [],
    timeAvailability: { weekdays: 30, weekends: 60 },
    dietaryRestrictions: [],
    allergies: [],
    nutritionGoals: [],
    notificationSettings: {
      workoutReminders: true,
      progressUpdates: true,
      socialUpdates: false,
      emailNotifications: true
    },
    privacySettings: {
      profileVisibility: 'private',
      shareProgress: false,
      shareWorkouts: false
    }
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Load profile data on mount
  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || user.email || '',
          phone: data.phone || '',
          dateOfBirth: data.dateOfBirth || '',
          gender: data.gender || '',
          location: data.location || '',
          profilePhotoURL: data.profilePhotoURL || '',
          height: data.height || undefined,
          weight: data.weight || undefined,
          medicalConditions: data.medicalConditions || [],
          medications: data.medications || [],
          isOnHormoneReplacement: data.isOnHormoneReplacement || false,
          hormoneDetails: data.hormoneDetails || '',
          fitnessLevel: data.fitnessLevel || '',
          primaryGoals: data.primaryGoals || [],
          activityLevel: data.activityLevel || '',
          preferredWorkoutTypes: data.preferredWorkoutTypes || [],
          availableEquipment: data.availableEquipment || [],
          timeAvailability: data.timeAvailability || { weekdays: 30, weekends: 60 },
          currentDiet: data.currentDiet || '',
          dietaryRestrictions: data.dietaryRestrictions || [],
          allergies: data.allergies || [],
          nutritionGoals: data.nutritionGoals || [],
          selectedCoach: data.selectedCoach || '',
          notificationSettings: data.notificationSettings || {
            workoutReminders: true,
            progressUpdates: true,
            socialUpdates: false,
            emailNotifications: true
          },
          privacySettings: data.privacySettings || {
            profileVisibility: 'private',
            shareProgress: false,
            shareWorkouts: false
          },
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        });
      } else {
        // Initialize with basic user data
        setProfile(prev => ({
          ...prev,
          email: user.email || ''
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setErrorMessage('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  // Save profile data
  const saveProfile = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      setErrorMessage('');
      
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        ...profile,
        updatedAt: serverTimestamp()
      });
      
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrorMessage('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle profile photo upload
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    
    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setErrorMessage('Image file must be less than 5MB');
      return;
    }
    
    try {
      setUploadingPhoto(true);
      setErrorMessage('');
      
      // Create storage reference
      const storageRef = ref(storage, `profile-photos/${user.uid}/${Date.now()}-${file.name}`);
      
      // Upload file
      await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update profile with new photo URL
      setProfile(prev => ({ ...prev, profilePhotoURL: downloadURL }));
      
      // Save to Firestore
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        profilePhotoURL: downloadURL,
        updatedAt: serverTimestamp()
      });
      
    } catch (error) {
      console.error('Error uploading photo:', error);
      setErrorMessage('Failed to upload photo. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Handle password change
  const changePassword = async () => {
    if (!user || !passwordData.currentPassword || !passwordData.newPassword) {
      setErrorMessage('Please fill in all password fields');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters');
      return;
    }
    
    try {
      setSaving(true);
      setErrorMessage('');
      
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        user.email!,
        passwordData.currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, passwordData.newPassword);
      
      // Clear password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      
    } catch (error: any) {
      console.error('Error changing password:', error);
      if (error.code === 'auth/wrong-password') {
        setErrorMessage('Current password is incorrect');
      } else {
        setErrorMessage('Failed to change password. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  // Export user data
  const exportData = async () => {
    if (!user) return;
    
    try {
      const userData = {
        profile,
        exportedAt: new Date().toISOString(),
        userId: user.uid
      };
      
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = window.URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `force-fitness-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error exporting data:', error);
      setErrorMessage('Failed to export data');
    }
  };

  // Personal Information Section
  const PersonalSection = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 flex items-center">
        <User className="w-5 h-5 mr-2 text-blue-600" />
        Personal Information
      </h2>
      
      {/* Profile Photo */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {profile.profilePhotoURL ? (
              <img 
                src={profile.profilePhotoURL} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-gray-400" />
            )}
          </div>
          {uploadingPhoto && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </div>
          )}
        </div>
        <div>
          <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
            <Camera className="w-4 h-4 mr-2" />
            Change Photo
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              disabled={uploadingPhoto}
            />
          </label>
          <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
        </div>
      </div>
      
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            value={profile.firstName}
            onChange={(e) => setProfile({...profile, firstName: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter first name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={profile.lastName}
            onChange={(e) => setProfile({...profile, lastName: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter last name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={profile.email}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            disabled
          />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <input
            type="tel"
            value={profile.phone || ''}
            onChange={(e) => setProfile({...profile, phone: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter phone number"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            value={profile.dateOfBirth || ''}
            onChange={(e) => setProfile({...profile, dateOfBirth: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <select
            value={profile.gender || ''}
            onChange={(e) => setProfile({...profile, gender: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location
        </label>
        <input
          type="text"
          value={profile.location || ''}
          onChange={(e) => setProfile({...profile, location: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="City, State/Country"
        />
      </div>
    </div>
  );

  // Health Information Section
  const HealthSection = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 flex items-center">
        <Heart className="w-5 h-5 mr-2 text-red-600" />
        Health Information
      </h2>
      
      {/* Physical Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Height (inches)
          </label>
          <input
            type="number"
            value={profile.height || ''}
            onChange={(e) => setProfile({...profile, height: parseInt(e.target.value) || undefined})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter height in inches"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weight (lbs)
          </label>
          <input
            type="number"
            value={profile.weight || ''}
            onChange={(e) => setProfile({...profile, weight: parseInt(e.target.value) || undefined})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter weight in pounds"
          />
        </div>
      </div>
      
      {/* Medical Conditions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Medical Conditions
        </label>
        <div className="space-y-2">
          {['None', 'Diabetes', 'Heart Disease', 'High Blood Pressure', 'Arthritis', 'Asthma', 'Back Problems', 'Knee Problems'].map(condition => (
            <label key={condition} className="flex items-center">
              <input
                type="checkbox"
                checked={profile.medicalConditions.includes(condition)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setProfile({...profile, medicalConditions: [...profile.medicalConditions, condition]});
                  } else {
                    setProfile({...profile, medicalConditions: profile.medicalConditions.filter(c => c !== condition)});
                  }
                }}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 mr-2"
              />
              <span className="text-sm text-gray-700">{condition}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Hormone Replacement Therapy */}
      <div>
        <label className="flex items-center mb-3">
          <input
            type="checkbox"
            checked={profile.isOnHormoneReplacement}
            onChange={(e) => setProfile({...profile, isOnHormoneReplacement: e.target.checked})}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 mr-2"
          />
          <span className="text-sm font-medium text-gray-700">Currently on Hormone Replacement Therapy</span>
        </label>
        
        {profile.isOnHormoneReplacement && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hormone Therapy Details
            </label>
            <textarea
              value={profile.hormoneDetails || ''}
              onChange={(e) => setProfile({...profile, hormoneDetails: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Please describe your hormone therapy (medications, dosage, etc.)"
            />
          </div>
        )}
      </div>
    </div>
  );

  // Fitness Profile Section
  const FitnessSection = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 flex items-center">
        <Activity className="w-5 h-5 mr-2 text-green-600" />
        Fitness Profile
      </h2>
      
      {/* Fitness Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Fitness Level
        </label>
        <select
          value={profile.fitnessLevel}
          onChange={(e) => setProfile({...profile, fitnessLevel: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select fitness level</option>
          <option value="beginner">Beginner - New to fitness</option>
          <option value="intermediate">Intermediate - Some experience</option>
          <option value="advanced">Advanced - Very experienced</option>
          <option value="expert">Expert - Professional level</option>
        </select>
      </div>
      
      {/* Primary Goals */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Primary Fitness Goals
        </label>
        <div className="space-y-2">
          {['Weight Loss', 'Muscle Gain', 'Strength Training', 'Endurance', 'General Health', 'Sports Performance', 'Flexibility', 'Body Composition'].map(goal => (
            <label key={goal} className="flex items-center">
              <input
                type="checkbox"
                checked={profile.primaryGoals.includes(goal)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setProfile({...profile, primaryGoals: [...profile.primaryGoals, goal]});
                  } else {
                    setProfile({...profile, primaryGoals: profile.primaryGoals.filter(g => g !== goal)});
                  }
                }}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 mr-2"
              />
              <span className="text-sm text-gray-700">{goal}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Activity Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Activity Level
        </label>
        <select
          value={profile.activityLevel}
          onChange={(e) => setProfile({...profile, activityLevel: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select activity level</option>
          <option value="sedentary">Sedentary - Desk job, no exercise</option>
          <option value="lightly-active">Lightly Active - Light exercise 1-3 days/week</option>
          <option value="moderately-active">Moderately Active - Moderate exercise 3-5 days/week</option>
          <option value="very-active">Very Active - Hard exercise 6-7 days/week</option>
          <option value="extremely-active">Extremely Active - Physical job + exercise</option>
        </select>
      </div>
      
      {/* Time Availability */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Time Availability
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Weekdays (minutes)</label>
            <input
              type="number"
              value={profile.timeAvailability.weekdays}
              onChange={(e) => setProfile({
                ...profile, 
                timeAvailability: {...profile.timeAvailability, weekdays: parseInt(e.target.value) || 0}
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              max="300"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Weekends (minutes)</label>
            <input
              type="number"
              value={profile.timeAvailability.weekends}
              onChange={(e) => setProfile({
                ...profile, 
                timeAvailability: {...profile.timeAvailability, weekends: parseInt(e.target.value) || 0}
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              max="300"
            />
          </div>
        </div>
      </div>
      
      {/* Available Equipment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Available Equipment
        </label>
        <div className="space-y-2">
          {['None (bodyweight only)', 'Dumbbells', 'Barbell', 'Resistance Bands', 'Pull-up Bar', 'Kettlebells', 'Full Gym Access', 'Home Gym Setup'].map(equipment => (
            <label key={equipment} className="flex items-center">
              <input
                type="checkbox"
                checked={profile.availableEquipment.includes(equipment)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setProfile({...profile, availableEquipment: [...profile.availableEquipment, equipment]});
                  } else {
                    setProfile({...profile, availableEquipment: profile.availableEquipment.filter(eq => eq !== equipment)});
                  }
                }}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 mr-2"
              />
              <span className="text-sm text-gray-700">{equipment}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  // Dietary Information Section
  const DietarySection = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 flex items-center">
        <Apple className="w-5 h-5 mr-2 text-green-600" />
        Dietary Information
      </h2>
      
      {/* Current Diet */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Diet Approach
        </label>
        <select
          value={profile.currentDiet || ''}
          onChange={(e) => setProfile({...profile, currentDiet: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select current diet</option>
          <option value="standard">Standard/Balanced Diet</option>
          <option value="mediterranean">Mediterranean</option>
          <option value="keto">Ketogenic</option>
          <option value="paleo">Paleo</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="intermittent-fasting">Intermittent Fasting</option>
          <option value="low-carb">Low Carb</option>
          <option value="high-protein">High Protein</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      {/* Dietary Restrictions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dietary Restrictions
        </label>
        <div className="space-y-2">
          {['None', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Soy-Free', 'Low Sodium', 'Low Sugar', 'Kosher', 'Halal'].map(restriction => (
            <label key={restriction} className="flex items-center">
              <input
                type="checkbox"
                checked={profile.dietaryRestrictions.includes(restriction)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setProfile({...profile, dietaryRestrictions: [...profile.dietaryRestrictions, restriction]});
                  } else {
                    setProfile({...profile, dietaryRestrictions: profile.dietaryRestrictions.filter(r => r !== restriction)});
                  }
                }}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 mr-2"
              />
              <span className="text-sm text-gray-700">{restriction}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Allergies */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Food Allergies
        </label>
        <div className="space-y-2">
          {['None', 'Peanuts', 'Tree Nuts', 'Shellfish', 'Fish', 'Eggs', 'Milk', 'Soy', 'Wheat/Gluten', 'Sesame'].map(allergy => (
            <label key={allergy} className="flex items-center">
              <input
                type="checkbox"
                checked={profile.allergies.includes(allergy)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setProfile({...profile, allergies: [...profile.allergies, allergy]});
                  } else {
                    setProfile({...profile, allergies: profile.allergies.filter(a => a !== allergy)});
                  }
                }}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 mr-2"
              />
              <span className="text-sm text-gray-700">{allergy}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Nutrition Goals */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nutrition Goals
        </label>
        <div className="space-y-2">
          {['Weight Loss', 'Muscle Gain', 'Maintain Weight', 'Improve Energy', 'Better Digestion', 'Reduce Inflammation', 'Heart Health', 'Better Sleep'].map(goal => (
            <label key={goal} className="flex items-center">
              <input
                type="checkbox"
                checked={profile.nutritionGoals.includes(goal)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setProfile({...profile, nutritionGoals: [...profile.nutritionGoals, goal]});
                  } else {
                    setProfile({...profile, nutritionGoals: profile.nutritionGoals.filter(g => g !== goal)});
                  }
                }}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 mr-2"
              />
              <span className="text-sm text-gray-700">{goal}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  // Privacy Settings Section
  const PrivacySection = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 flex items-center">
        <Shield className="w-5 h-5 mr-2 text-blue-600" />
        Privacy & Notifications
      </h2>
      
      {/* Notification Settings */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Workout Reminders</span>
            </div>
            <input
              type="checkbox"
              checked={profile.notificationSettings.workoutReminders}
              onChange={(e) => setProfile({
                ...profile,
                notificationSettings: {...profile.notificationSettings, workoutReminders: e.target.checked}
              })}
              className="w-4 h-4 text-blue-600 rounded border-gray-300"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Progress Updates</span>
            </div>
            <input
              type="checkbox"
              checked={profile.notificationSettings.progressUpdates}
              onChange={(e) => setProfile({
                ...profile,
                notificationSettings: {...profile.notificationSettings, progressUpdates: e.target.checked}
              })}
              className="w-4 h-4 text-blue-600 rounded border-gray-300"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Email Notifications</span>
            </div>
            <input
              type="checkbox"
              checked={profile.notificationSettings.emailNotifications}
              onChange={(e) => setProfile({
                ...profile,
                notificationSettings: {...profile.notificationSettings, emailNotifications: e.target.checked}
              })}
              className="w-4 h-4 text-blue-600 rounded border-gray-300"
            />
          </label>
        </div>
      </div>
      
      {/* Privacy Settings */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Visibility
            </label>
            <select
              value={profile.privacySettings.profileVisibility}
              onChange={(e) => setProfile({
                ...profile,
                privacySettings: {...profile.privacySettings, profileVisibility: e.target.value as any}
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="private">Private - Only me</option>
              <option value="friends">Friends - Connected users only</option>
              <option value="public">Public - Anyone can see</option>
            </select>
          </div>
          
          <label className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Share Progress with Community</span>
            <input
              type="checkbox"
              checked={profile.privacySettings.shareProgress}
              onChange={(e) => setProfile({
                ...profile,
                privacySettings: {...profile.privacySettings, shareProgress: e.target.checked}
              })}
              className="w-4 h-4 text-blue-600 rounded border-gray-300"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Share Workouts with Community</span>
            <input
              type="checkbox"
              checked={profile.privacySettings.shareWorkouts}
              onChange={(e) => setProfile({
                ...profile,
                privacySettings: {...profile.privacySettings, shareWorkouts: e.target.checked}
              })}
              className="w-4 h-4 text-blue-600 rounded border-gray-300"
            />
          </label>
        </div>
      </div>
    </div>
  );

  // Account Settings Section
  const AccountSection = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 flex items-center">
        <Settings className="w-5 h-5 mr-2 text-gray-600" />
        Account Settings
      </h2>
      
      {/* Change Password */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPasswords.current ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPasswords.new ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPasswords.confirm ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>
          
          <button
            onClick={changePassword}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            <Lock className="w-4 h-4 mr-2" />
            Change Password
          </button>
        </div>
      </div>
      
      {/* Data Export */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Data Export</h3>
        <p className="text-sm text-gray-600 mb-4">
          Download a copy of all your data including profile information, workouts, and progress.
        </p>
        <button
          onClick={exportData}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Download className="w-4 h-4 mr-2" />
          Export My Data
        </button>
      </div>
      
      {/* Account Deletion */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-red-900 mb-4">Danger Zone</h3>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-red-800">Delete Account</h4>
              <p className="text-sm text-red-700 mt-1">
                This action cannot be undone. This will permanently delete your account and remove all your data.
              </p>
              <button
                onClick={() => {
                  const confirmed = window.confirm(
                    'Are you absolutely sure you want to delete your account? This action cannot be undone and will permanently delete all your data.'
                  );
                  if (confirmed) {
                    // Account deletion logic would go here
                    alert('Account deletion feature will be implemented in the next phase.');
                  }
                }}
                className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Navigation tabs
  const tabs = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'health', label: 'Health', icon: Heart },
    { id: 'fitness', label: 'Fitness', icon: Activity },
    { id: 'dietary', label: 'Dietary', icon: Apple },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'account', label: 'Account', icon: Settings }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-600">Manage your personal information and preferences</p>
      </div>

      {/* Success/Error Messages */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center"
          >
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800">Profile saved successfully!</span>
          </motion.div>
        )}
        
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center"
          >
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800">{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeSection === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-3" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeSection === 'personal' && <PersonalSection />}
                {activeSection === 'health' && <HealthSection />}
                {activeSection === 'fitness' && <FitnessSection />}
                {activeSection === 'dietary' && <DietarySection />}
                {activeSection === 'privacy' && <PrivacySection />}
                {activeSection === 'account' && <AccountSection />}
              </motion.div>
            </AnimatePresence>
            
            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={saveProfile}
                disabled={saving}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}