// src/components/WaveTransition.jsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './WaveTransition.css';

const WaveTransition = ({ isActive, onComplete, children }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isActive) {
      setShowContent(true);
      // Complete animation after wave finishes
      const timer = setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 4000); // Match animation duration (4 seconds)
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="wave-transition-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Animated Wave Background */}
          <div className="wave-container">
            <svg
              className="wave-svg"
              viewBox="0 0 1200 800"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Multiple wave layers for depth */}
              <motion.path
                className="wave-path wave-1"
                d="M0,400 Q300,300 600,400 T1200,400 L1200,800 L0,800 Z"
                fill="url(#waveGradient1)"
                initial={{ d: "M0,800 Q300,800 600,800 T1200,800 L1200,800 L0,800 Z" }}
                animate={{
                  d: [
                    "M0,800 Q300,800 600,800 T1200,800 L1200,800 L0,800 Z",
                    "M0,400 Q300,300 600,400 T1200,400 L1200,800 L0,800 Z",
                    "M0,0 Q300,100 600,0 T1200,0 L1200,800 L0,800 Z"
                  ]
                }}
                transition={{
                  duration: 4.0,
                  ease: [0.4, 0, 0.2, 1],
                  times: [0, 0.5, 1]
                }}
              />
              <motion.path
                className="wave-path wave-2"
                d="M0,450 Q300,350 600,450 T1200,450 L1200,800 L0,800 Z"
                fill="url(#waveGradient2)"
                initial={{ d: "M0,800 Q300,800 600,800 T1200,800 L1200,800 L0,800 Z" }}
                animate={{
                  d: [
                    "M0,800 Q300,800 600,800 T1200,800 L1200,800 L0,800 Z",
                    "M0,450 Q300,350 600,450 T1200,450 L1200,800 L0,800 Z",
                    "M0,50 Q300,150 600,50 T1200,50 L1200,800 L0,800 Z"
                  ]
                }}
                transition={{
                  duration: 4.0,
                  ease: [0.4, 0, 0.2, 1],
                  times: [0, 0.5, 1],
                  delay: 0.3
                }}
              />
              <motion.path
                className="wave-path wave-3"
                d="M0,500 Q300,400 600,500 T1200,500 L1200,800 L0,800 Z"
                fill="url(#waveGradient3)"
                initial={{ d: "M0,800 Q300,800 600,800 T1200,800 L1200,800 L0,800 Z" }}
                animate={{
                  d: [
                    "M0,800 Q300,800 600,800 T1200,800 L1200,800 L0,800 Z",
                    "M0,500 Q300,400 600,500 T1200,500 L1200,800 L0,800 Z",
                    "M0,100 Q300,200 600,100 T1200,100 L1200,800 L0,800 Z"
                  ]
                }}
                transition={{
                  duration: 4.0,
                  ease: [0.4, 0, 0.2, 1],
                  times: [0, 0.5, 1],
                  delay: 0.6
                }}
              />
              
              {/* Gradient Definitions */}
              <defs>
                <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#059669" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#047857" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.7" />
                  <stop offset="50%" stopColor="#10b981" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id="waveGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#34d399" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Gamified Content Overlay */}
          {showContent && (
            <motion.div
              className="wave-content"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                className="wave-icon"
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 1.0,
                  delay: 1.5,
                  ease: "easeInOut"
                }}
              >
                🎮
              </motion.div>
              <motion.h2
                className="wave-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.6 }}
              >
                Entering Quiz Arena...
              </motion.h2>
              <motion.div
                className="wave-particles"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.0 }}
              >
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="particle"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -30, 0],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2.0,
                      delay: 2.0 + i * 0.15,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WaveTransition;
