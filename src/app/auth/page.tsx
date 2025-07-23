'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AuthForm } from '@/components/forms';

export default function AuthPage() {
  const router = useRouter();

  const handleAuthSuccess = (): void => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <AuthForm onSuccess={handleAuthSuccess} />
      </motion.div>
    </div>
  );
}