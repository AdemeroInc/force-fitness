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
    <div className="space-y-4">
      <Input
        type="email"
        label="Email Address"
        value={formData.email}
        onChange={handleInputChange('email')}
        placeholder="Enter your email"
        required
        disabled={loading}
      />
      
      <Input
        type="password"
        label="Password"
        value={formData.password}
        onChange={handleInputChange('password')}
        placeholder="Enter your password"
        required
        disabled={loading}
        helperText={isSignUp ? 'Must be at least 6 characters' : ''}
      />
    </div>
  );

  const renderDivider = (): JSX.Element => (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-2 bg-white text-gray-500">Or continue with</span>
      </div>
    </div>
  );

  return (
    <Card className="max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="mt-2 text-gray-600">
            {isSignUp 
              ? 'Start your fitness journey today' 
              : 'Sign in to continue your fitness journey'
            }
          </p>
        </div>

        {renderErrorMessage()}

        <form onSubmit={handleEmailAuth} className="space-y-6">
          {renderFormFields()}
          
          <Button 
            type="submit" 
            className="w-full" 
            loading={loading}
            disabled={loading}
          >
            <Mail size={18} className="mr-2" />
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        {renderDivider()}

        <Button
          variant="ghost"
          onClick={handleGoogleAuth}
          className="w-full"
          disabled={loading}
        >
          <Chrome size={18} className="mr-2" />
          Continue with Google
        </Button>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={toggleAuthMode}
            className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
            disabled={loading}
          >
            {isSignUp 
              ? 'Already have an account? Sign in' 
              : "Don't have an account? Sign up"
            }
          </button>
        </div>
      </motion.div>
    </Card>
  );
}