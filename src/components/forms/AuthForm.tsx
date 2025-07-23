'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Chrome } from 'lucide-react';

import { 
  signInWithGoogle, 
  signInWithEmail, 
  signUpWithEmail 
} from '@/lib/firebase';
import { Button, Input, Card } from '@/components/ui';

interface AuthFormProps {
  onSuccess?: () => void;
}

interface FormData {
  email: string;
  password: string;
}

const initialFormData: FormData = {
  email: '',
  password: ''
};

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    return true;
  };

  const handleEmailAuth = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        await signUpWithEmail(formData.email, formData.password);
      } else {
        await signInWithEmail(formData.email, formData.password);
      }
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async (): Promise<void> => {
    setLoading(true);
    setError('');

    try {
      await signInWithGoogle();
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = (): void => {
    setIsSignUp(!isSignUp);
    setError('');
    setFormData(initialFormData);
  };

  const renderErrorMessage = (): JSX.Element | null => {
    if (!error) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
      >
        {error}
      </motion.div>
    );
  };

  const renderFormFields = (): JSX.Element => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <label className="block text-white font-bold mb-2 uppercase tracking-wide text-sm">
          Email Address
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          placeholder="Enter your email"
          required
          disabled={loading}
          className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all disabled:opacity-50"
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <label className="block text-white font-bold mb-2 uppercase tracking-wide text-sm">
          Password
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={handleInputChange('password')}
          placeholder="Enter your password"
          required
          disabled={loading}
          className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all disabled:opacity-50"
        />
        {isSignUp && (
          <p className="text-gray-400 text-xs mt-1">Must be at least 6 characters</p>
        )}
      </motion.div>
    </div>
  );

  const renderDivider = (): JSX.Element => (
    <div className="relative my-8">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-600/30" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 bg-black text-gray-400 font-bold uppercase tracking-wide">Or continue with</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center mb-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-black text-white mb-3"
          >
            {isSignUp ? 'JOIN THE ELITE' : 'WELCOME BACK'}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-300"
          >
            {isSignUp 
              ? 'Your transformation begins now' 
              : 'Continue your legendary journey'
            }
          </motion.p>
        </div>

        {renderErrorMessage()}

        <form onSubmit={handleEmailAuth} className="space-y-6">
          {renderFormFields()}
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 rounded-xl blur-sm opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
            <button
              type="submit"
              disabled={loading}
              className="relative w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-black py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center uppercase tracking-wide"
            >
              <Mail size={20} className="mr-3" />
              {loading ? 'Please wait...' : (isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN')}
            </button>
          </motion.div>
        </form>

        {renderDivider()}

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-red-500/30 rounded-xl blur-sm opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className="relative w-full bg-white hover:bg-gray-50 text-gray-900 font-bold py-4 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <button
            type="button"
            onClick={toggleAuthMode}
            className="text-yellow-400 hover:text-yellow-300 font-bold transition-colors uppercase tracking-wide text-sm"
            disabled={loading}
          >
            {isSignUp 
              ? 'Already have an account? Sign in' 
              : "Don't have an account? Sign up"
            }
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}