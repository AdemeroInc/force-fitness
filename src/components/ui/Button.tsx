'use client';

import { motion } from 'framer-motion';
import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const buttonVariants = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg',
  secondary: 'bg-gray-600 hover:bg-gray-700 text-white shadow-lg',
  success: 'bg-green-600 hover:bg-green-700 text-white shadow-lg',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-300'
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-6 py-2',
  lg: 'px-8 py-3 text-lg'
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}, ref) => {
  const isDisabled = disabled || loading;
  
  const baseClasses = 'rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const classes = `${baseClasses} ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`;

  return (
    <motion.button
      ref={ref}
      disabled={isDisabled}
      className={classes}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      transition={{ duration: 0.1 }}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <span className="ml-2">Loading...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;