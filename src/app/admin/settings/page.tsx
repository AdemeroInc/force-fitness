'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ChevronLeft,
  Settings,
  Brain,
  Key,
  ToggleLeft,
  ToggleRight,
  Save,
  AlertCircle,
  Check,
  Shield,
  Database,
  Bell,
  Mail,
  Globe
} from 'lucide-react';
import Link from 'next/link';

import { useAuth } from '@/lib/hooks/useAuth';
import { isAdmin } from '@/lib/admin';
import { Button, Card } from '@/components/ui';

interface SystemSettings {
  aiModel: {
    provider: 'openai' | 'anthropic' | 'gemini';
    model: string;
    temperature: number;
    maxTokens: number;
  };
  features: {
    aiCoaching: boolean;
    mealPlanning: boolean;
    progressTracking: boolean;
    socialFeatures: boolean;
    premiumFeatures: boolean;
  };
  notifications: {
    emailEnabled: boolean;
    pushEnabled: boolean;
    workoutReminders: boolean;
    mealReminders: boolean;
    progressUpdates: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordPolicy: 'standard' | 'strict';
    dataRetention: number;
  };
  apiKeys: {
    openai?: string;
    anthropic?: string;
    gemini?: string;
    sendgrid?: string;
  };
}

const defaultSettings: SystemSettings = {
  aiModel: {
    provider: 'openai',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000
  },
  features: {
    aiCoaching: true,
    mealPlanning: true,
    progressTracking: true,
    socialFeatures: false,
    premiumFeatures: true
  },
  notifications: {
    emailEnabled: true,
    pushEnabled: false,
    workoutReminders: true,
    mealReminders: true,
    progressUpdates: false
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordPolicy: 'standard',
    dataRetention: 365
  },
  apiKeys: {}
};

export default function AdminSettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<'ai' | 'features' | 'notifications' | 'security' | 'api'>('ai');

  useEffect(() => {
    if (!loading && (!user || !isAdmin(user))) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin(user)) return null;

  const handleSaveSettings = async () => {
    setSaveStatus('saving');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const updateSettings = (path: string, value: string | number | boolean) => {
    setSettings(prev => {
      const keys = path.split('.');
      const newSettings = { ...prev };
      let current: Record<string, unknown> = newSettings as Record<string, unknown>;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const tabs = [
    { id: 'ai', label: 'AI Configuration', icon: Brain },
    { id: 'features', label: 'Feature Flags', icon: ToggleLeft },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'api', label: 'API Keys', icon: Key }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link 
            href="/admin"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Admin
          </Link>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">System Settings</h1>
              <p className="text-gray-600">Configure your Force Fitness application</p>
            </div>
            
            <Button
              onClick={handleSaveSettings}
              disabled={saveStatus === 'saving'}
              className={`
                ${saveStatus === 'saved' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}
              `}
            >
              {saveStatus === 'saving' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />}
              {saveStatus === 'saved' && <Check className="w-5 h-5 mr-2" />}
              {saveStatus === 'error' && <AlertCircle className="w-5 h-5 mr-2" />}
              <Save className="w-5 h-5 mr-2" />
              {saveStatus === 'saved' ? 'Saved' : 'Save Settings'}
            </Button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'general' | 'system' | 'security' | 'integrations' | 'maintenance')}
                  className={`
                    py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* AI Configuration Tab */}
        {activeTab === 'ai' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Model Configuration</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    AI Provider
                  </label>
                  <select
                    value={settings.aiModel.provider}
                    onChange={(e) => updateSettings('aiModel.provider', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="openai">OpenAI</option>
                    <option value="anthropic">Anthropic</option>
                    <option value="gemini">Google Gemini</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model
                  </label>
                  <select
                    value={settings.aiModel.model}
                    onChange={(e) => updateSettings('aiModel.model', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="claude-3">Claude 3</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Temperature ({settings.aiModel.temperature})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.aiModel.temperature}
                    onChange={(e) => updateSettings('aiModel.temperature', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Precise</span>
                    <span>Creative</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Tokens
                  </label>
                  <input
                    type="number"
                    value={settings.aiModel.maxTokens}
                    onChange={(e) => updateSettings('aiModel.maxTokens', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Feature Flags Tab */}
        {activeTab === 'features' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Flags</h3>
              
              <div className="space-y-4">
                {Object.entries(settings.features).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {key === 'aiCoaching' && 'Enable AI-powered coaching features'}
                        {key === 'mealPlanning' && 'Allow users to access meal planning tools'}
                        {key === 'progressTracking' && 'Enable progress tracking and analytics'}
                        {key === 'socialFeatures' && 'Enable social features and community'}
                        {key === 'premiumFeatures' && 'Enable premium subscription features'}
                      </p>
                    </div>
                    <button
                      onClick={() => updateSettings(`features.${key}`, !value)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
              
              <div className="space-y-4">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      {key.includes('email') && <Mail className="w-5 h-5 text-gray-400" />}
                      {key.includes('push') && <Bell className="w-5 h-5 text-gray-400" />}
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h4>
                      </div>
                    </div>
                    <button
                      onClick={() => updateSettings(`notifications.${key}`, !value)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-500">Require 2FA for all admin users</p>
                  </div>
                  <button
                    onClick={() => updateSettings('security.twoFactorAuth', !settings.security.twoFactorAuth)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.security.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.security.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSettings('security.sessionTimeout', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password Policy
                  </label>
                  <select
                    value={settings.security.passwordPolicy}
                    onChange={(e) => updateSettings('security.passwordPolicy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="standard">Standard (8+ characters)</option>
                    <option value="strict">Strict (12+ chars, special chars required)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data Retention (days)
                  </label>
                  <input
                    type="number"
                    value={settings.security.dataRetention}
                    onChange={(e) => updateSettings('security.dataRetention', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* API Keys Tab */}
        {activeTab === 'api' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-yellow-600" />
                <h3 className="text-lg font-semibold text-gray-900">API Key Management</h3>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0" />
                  <p className="text-sm text-yellow-800">
                    API keys are sensitive. Never expose them in client-side code or public repositories.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {['openai', 'anthropic', 'gemini', 'sendgrid'].map((provider) => (
                  <div key={provider}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {provider.charAt(0).toUpperCase() + provider.slice(1)} API Key
                    </label>
                    <input
                      type="password"
                      placeholder={`Enter ${provider} API key`}
                      value={settings.apiKeys[provider as keyof typeof settings.apiKeys] || ''}
                      onChange={(e) => updateSettings(`apiKeys.${provider}`, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}