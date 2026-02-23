import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { motion, AnimatePresence } from 'framer-motion';

export default function BirthdayCelebration({ isOpen, onClose, userName }) {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl text-center max-w-sm mx-4 relative overflow-hidden"
        >
          <div className="text-6xl mb-4">🎂</div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Joyeux Anniversaire {userName} !
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Une année de plus vers tes objectifs. On est fiers de toi !
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
          >
            Merci !
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}