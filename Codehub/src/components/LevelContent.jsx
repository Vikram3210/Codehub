import React, { useEffect, useMemo, useState } from 'react';
import { motion as Motion } from 'framer-motion';

export default function LevelContent({ title, content, onNext, nextButtonText = "Next", readSeconds }) {
  // Safe defaults for all props
  const safeTitle = title || 'Level Content';
  const safeContent = content || 'No content available.';
  const safeNextButtonText = nextButtonText || 'Next';
  const safeOnNext = onNext || (() => console.warn('onNext callback not provided'));

  const [remaining, setRemaining] = useState(() => {
    try {
      if (typeof readSeconds === 'number' && readSeconds > 0) return readSeconds;
    } catch (error) {
      console.error('Error initializing timer:', error);
    }
    return 0;
  });

  const hasTimer = useMemo(() => {
    try {
      return typeof readSeconds === 'number' && readSeconds > 0;
    } catch (error) {
      console.error('Error checking timer:', error);
      return false;
    }
  }, [readSeconds]);

  useEffect(() => {
    try {
      if (!hasTimer) return;
      if (remaining <= 0) return;
      const id = setInterval(() => {
        setRemaining((s) => {
          try {
            return s > 0 ? s - 1 : 0;
          } catch (error) {
            console.error('Error updating timer:', error);
            return 0;
          }
        });
      }, 1000);
      return () => clearInterval(id);
    } catch (error) {
      console.error('Error setting up timer interval:', error);
    }
  }, [hasTimer, remaining]);

  useEffect(() => {
    try {
      // Reset when readSeconds changes
      if (hasTimer && typeof readSeconds === 'number' && readSeconds > 0) {
        setRemaining(readSeconds);
      }
    } catch (error) {
      console.error('Error resetting timer:', error);
    }
  }, [hasTimer, readSeconds]);

  const minutes = Math.floor(Math.max(0, remaining) / 60);
  const seconds = Math.max(0, remaining) % 60;

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card-glow p-4 mx-auto"
      style={{ maxWidth: '800px', backgroundColor: '#151a2d', borderRadius: '10px' }}
    >
      <h2 className="neon-text mb-4 text-center">{safeTitle}</h2>
      
      {/* Large Timer Display */}
      {hasTimer && (
        <Motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-4"
        >
          <div
            className="mx-auto"
            style={{
              background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
              borderRadius: '15px',
              padding: '20px 30px',
              border: '3px solid #ffb300',
              boxShadow: '0 8px 25px rgba(255, 193, 7, 0.4)',
              maxWidth: '300px'
            }}
          >
            <div className="text-dark" style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '8px' }}>
              ⏳ Reading Timer
            </div>
            <div 
              className="text-dark" 
              style={{ 
                fontSize: '3rem', 
                fontWeight: 'bold',
                fontFamily: 'monospace',
                lineHeight: '1'
              }}
            >
              {minutes}:{String(seconds).padStart(2, '0')}
            </div>
            <div className="text-dark mt-2" style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              {remaining > 0 ? 'Please read the theory before proceeding' : 'Ready to start quiz!'}
            </div>
          </div>
        </Motion.div>
      )}
      
      <div className="theory-content mb-4">
        <div 
          className="text-light"
          style={{ 
            lineHeight: '1.6', 
            fontSize: '1.1rem',
            whiteSpace: 'pre-line'
          }}
        >
          {safeContent}
        </div>
      </div>
      
      <div className="text-center">
        <button
          onClick={safeOnNext}
          className="btn btn-neon px-5 py-3"
          disabled={hasTimer && remaining > 0}
          style={{ 
            opacity: hasTimer && remaining > 0 ? 0.5 : 1,
            cursor: hasTimer && remaining > 0 ? 'not-allowed' : 'pointer',
            fontSize: '1.1rem',
            minWidth: '200px'
          }}
        >
          {hasTimer && remaining > 0 ? (
            <>
              <div>⏳ Timer Active</div>
              <small style={{ display: 'block', fontSize: '0.85rem', marginTop: '4px' }}>
                Available in {minutes}:{String(seconds).padStart(2, '0')}
              </small>
            </>
          ) : (
            safeNextButtonText
          )}
        </button>
      </div>
    </Motion.div>
  );
}
