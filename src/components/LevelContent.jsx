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

  // Rough reading-time estimate for decorative meta info
  const estimatedMinutes = useMemo(() => {
    const words = String(safeContent || '')
      .split(/\s+/)
      .filter(Boolean).length;
    if (!words) return 1;
    return Math.max(1, Math.round(words / 160)); // ~160 wpm
  }, [safeContent]);

  // --- Simple content parser to create a rich, student‑friendly layout ---
  const blocks = useMemo(() => {
    const text = String(safeContent || '').trim();
    if (!text) return [];

    // Prefer splitting by double newlines; if none exist, fall back to single newlines
    const rawBlocks = text.includes('\n\n') ? text.split(/\n{2,}/) : text.split(/\n+/);

    return rawBlocks.map((raw, index) => {
      const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
      const first = lines[0] || '';

      // Definition / Important / Warning / Tip cards
      if (/^definition[:\-]/i.test(first)) {
        return { type: 'definition', id: `block-${index}`, body: lines.join(' ') };
      }
      if (/^(important|note)[:\-]/i.test(first)) {
        return { type: 'important', id: `block-${index}`, body: lines.join(' ') };
      }
      if (/^(warning|caution)[:\-]/i.test(first)) {
        return { type: 'warning', id: `block-${index}`, body: lines.join(' ') };
      }
      if (/^tip[:\-]/i.test(first)) {
        return { type: 'tip', id: `block-${index}`, body: lines.join(' ') };
      }

      // Bullet list
      if (lines.length > 1 && lines.every(l => /^[-*]\s+/.test(l))) {
        return {
          type: 'ul',
          id: `block-${index}`,
          items: lines.map(l => l.replace(/^[-*]\s+/, '')),
        };
      }

      // Numbered list
      if (lines.length > 1 && lines.every(l => /^\d+\.\s+/.test(l))) {
        return {
          type: 'ol',
          id: `block-${index}`,
          items: lines.map(l => l.replace(/^\d+\.\s+/, '')),
        };
      }

      // Heading + paragraph (short first line, then body)
      if (lines.length > 1 && first.length < 80) {
        return {
          type: 'section',
          id: `block-${index}`,
          heading: first,
          body: lines.slice(1).join(' '),
        };
      }

      // Plain paragraph
      return { type: 'p', id: `block-${index}`, body: lines.join(' ') };
    });
  }, [safeContent]);

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="lesson-shell p-4 mx-auto"
      style={{ maxWidth: '1000px' }}
    >
      <h1 className="neon-text mb-3 text-center lesson-title-heading">{safeTitle}</h1>
      <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-2 mb-4 lesson-title-sub">
        <span className="badge rounded-pill bg-opacity-25 bg-info text-light lesson-tag">
          Theory lesson
        </span>
        <span className="badge rounded-pill bg-opacity-25 bg-primary text-light lesson-tag">
          ~{estimatedMinutes} min read
        </span>
        {hasTimer && (
          <span className="badge rounded-pill bg-opacity-25 bg-warning text-dark lesson-tag">
            Guided reading mode
          </span>
        )}
      </div>
      
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
      
      <div className="theory-content mb-4 lesson-content">
        {blocks.length === 0 ? (
          <p className="text-light lesson-paragraph">{safeContent}</p>
        ) : (
          blocks.map(block => {
            if (block.type === 'definition') {
              return (
                <div key={block.id} className="lesson-card lesson-card-definition">
                  <div className="lesson-card-icon">📘</div>
                  <div>
                    <h3 className="lesson-card-title">Definition</h3>
                    <p className="lesson-paragraph">{block.body.replace(/^definition[:\-]\s*/i, '')}</p>
                  </div>
                </div>
              );
            }
            if (block.type === 'important') {
              return (
                <div key={block.id} className="lesson-card lesson-card-important">
                  <div className="lesson-card-icon">📌</div>
                  <div>
                    <h3 className="lesson-card-title">Important</h3>
                    <p className="lesson-paragraph">{block.body.replace(/^(important|note)[:\-]\s*/i, '')}</p>
                  </div>
                </div>
              );
            }
            if (block.type === 'warning') {
              return (
                <div key={block.id} className="lesson-card lesson-card-warning">
                  <div className="lesson-card-icon">⚠</div>
                  <div>
                    <h3 className="lesson-card-title">Warning</h3>
                    <p className="lesson-paragraph">{block.body.replace(/^(warning|caution)[:\-]\s*/i, '')}</p>
                  </div>
                </div>
              );
            }
            if (block.type === 'tip') {
              return (
                <div key={block.id} className="lesson-card lesson-card-tip">
                  <div className="lesson-card-icon">💡</div>
                  <div>
                    <h3 className="lesson-card-title">Tip</h3>
                    <p className="lesson-paragraph">{block.body.replace(/^tip[:\-]\s*/i, '')}</p>
                  </div>
                </div>
              );
            }
            if (block.type === 'ul') {
              return (
                <div key={block.id} className="lesson-list lesson-list-bullets">
                  <ul>
                    {block.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              );
            }
            if (block.type === 'ol') {
              return (
                <div key={block.id} className="lesson-list lesson-list-steps">
                  <ol>
                    {block.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ol>
                </div>
              );
            }
            if (block.type === 'section') {
              return (
                <section key={block.id} className="lesson-section">
                  <h2 className="lesson-heading">{block.heading}</h2>
                  <p className="lesson-paragraph">{block.body}</p>
                </section>
              );
            }
            // Default paragraph
            return (
              <p key={block.id} className="lesson-paragraph">
                {block.body}
              </p>
            );
          })
        )}
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
