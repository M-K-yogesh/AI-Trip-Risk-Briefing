import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ message = "Analyzing trip factors and weather data..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="relative w-20 h-20 mb-6">
        {/* Outer glowing ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-t-brand-500 border-r-transparent border-b-brand-300 border-l-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        {/* Inner pulsing circle */}
        <motion.div
          className="absolute inset-4 rounded-full bg-brand-500/20 flex items-center justify-center"
          animate={{ scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-brand-500 font-semibold text-xs font-mono">AI</span>
        </motion.div>
      </div>
      
      <motion.h3 
        className="text-lg font-medium text-slate-700 dark:text-slate-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Generating Safety Briefing
      </motion.h3>
      
      <motion.p 
        className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {message}
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;
