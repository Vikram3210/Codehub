import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

// Generate 20 prerequisite questions from all levels
function generatePrerequisiteQuestions(lang, levelData) {
  console.log('generatePrerequisiteQuestions called with:', { lang, levelDataKeys: levelData ? Object.keys(levelData) : 'null' });
  const allQuestions = [];
  
  if (!levelData) {
    console.error('levelData is null or undefined');
    return [];
  }
  
  if (!levelData[lang]) {
    console.error(`Language "${lang}" not found in levelData. Available languages:`, Object.keys(levelData));
    return [];
  }
  
  const languageData = levelData[lang];
  console.log(`Found language data for ${lang}. Number of levels:`, Object.keys(languageData).length);
  
  Object.values(languageData).forEach((level, index) => {
    if (level.quiz && Array.isArray(level.quiz)) {
      console.log(`Level "${level.title}" has ${level.quiz.length} quiz questions`);
      level.quiz.forEach(q => {
        // Ensure question has required fields
        if (q.question && q.options && q.answer) {
          allQuestions.push({
            ...q,
            sourceLevel: level.title
          });
        } else {
          console.warn('Invalid question format:', q);
        }
      });
    } else {
      console.log(`Level "${level.title}" has no quiz or quiz is not an array`);
    }
  });
  
  console.log(`Total questions collected for ${lang}:`, allQuestions.length);
  
  // Shuffle and pick 20 questions (or all if less than 20)
  const shuffled = allQuestions.sort(() => Math.random() - 0.5);
  const count = Math.min(20, shuffled.length);
  const selected = shuffled.slice(0, count);
  console.log(`Selected ${selected.length} questions for prerequisite test`);
  
  return selected;
}

export default function PrerequisiteTest({ lang, levelData, onComplete, onExit }) {
  const [questions] = useState(() => {
    console.log('PrerequisiteTest - Initializing with:', { lang, levelData: levelData ? 'provided' : 'missing' });
    const qs = generatePrerequisiteQuestions(lang, levelData);
    console.log('PrerequisiteTest - Generated questions:', qs.length, 'for lang:', lang);
    if (qs.length === 0) {
      console.error('PrerequisiteTest - No questions generated! This will cause a blank page.');
    }
    return qs;
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  // Start with false - will be set to true when fullscreen is requested
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [warnings, setWarnings] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [testRestarted, setTestRestarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [fullscreenRequested, setFullscreenRequested] = useState(false);
  const containerRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const initialWindowWidth = useRef(typeof window !== 'undefined' ? window.innerWidth : 1920);
  const initialWindowHeight = useRef(typeof window !== 'undefined' ? window.innerHeight : 1080);
  const fullscreenActivatedTime = useRef(null);
  const isTransitioningToFullscreen = useRef(false);

  // Function to reset the test
  const requestFullscreenForContainer = useCallback(async () => {
    try {
      const elem = containerRef.current;
      if (!elem) {
        console.warn('Container ref not available');
        return;
      }

      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
        setIsFullscreen(true);
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
        setIsFullscreen(true);
      } else if (elem.msRequestFullscreen) {
        await elem.msRequestFullscreen();
        setIsFullscreen(true);
      } else {
        console.warn('Fullscreen API not supported');
        setIsFullscreen(true);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
      setIsFullscreen(false);
    }
  }, []);

  const resetTest = useCallback(() => {
    console.log('Test violation detected - restarting test');
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
    setWarnings(0);
    setTestRestarted(true);
    setShowInstructions(true);
    setFullscreenRequested(false);
    setIsFullscreen(false);
    isTransitioningToFullscreen.current = false;
    fullscreenActivatedTime.current = null;
    if (typeof document !== 'undefined') {
      if (document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(err => console.error('Error exiting fullscreen:', err));
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    }
  }, []);

  // Manage anti-cheat listeners and fullscreen state when test is active
  useEffect(() => {
    if (showInstructions || showResults) {
      setIsFullscreen(false)
      return undefined
    }
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return undefined
    }

    // Monitor fullscreen changes
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );
      console.log('Fullscreen change detected:', isCurrentlyFullscreen);
      setIsFullscreen(isCurrentlyFullscreen);
      
      // If fullscreen is now active, update initial window size and set grace period
      if (isCurrentlyFullscreen) {
        // Update initial size to current fullscreen size to prevent false positives
        initialWindowWidth.current = window.innerWidth;
        initialWindowHeight.current = window.innerHeight;
        fullscreenActivatedTime.current = Date.now();
        isTransitioningToFullscreen.current = true;
        
        // Clear the transitioning flag after a grace period (2 seconds)
        setTimeout(() => {
          isTransitioningToFullscreen.current = false;
        }, 2000);
        
        // Clear the fullscreenRequested flag after a small delay
        setTimeout(() => {
          setFullscreenRequested(false);
        }, 100);
      } else {
        // Fullscreen was exited
        isTransitioningToFullscreen.current = false;
        fullscreenActivatedTime.current = null;
        
        // If user exits fullscreen during test (not on results screen), restart test
        if (!showResults && !showInstructions) {
          resetTest();
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    // Prevent context menu (right-click)
    const preventContext = (e) => e.preventDefault();
    document.addEventListener('contextmenu', preventContext);

    // Prevent keyboard shortcuts
    const preventKeys = (e) => {
      // Allow only Tab, Enter, Arrow keys
      const allowedKeys = ['Tab', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
      if (!allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
        // Allow normal typing for answers
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') {
          return;
        }
      }
      // Block F12, Ctrl+Shift+I, etc. - restart test if dev tools opened
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || 
          (e.ctrlKey && e.shiftKey && e.key === 'C') || 
          (e.ctrlKey && e.shiftKey && e.key === 'J')) {
        e.preventDefault();
        if (!showResults) {
          resetTest();
        }
      }
    };
    document.addEventListener('keydown', preventKeys);

    // Prevent window blur (tab switching) - restart test if user switches tabs
    // But ignore blur events during fullscreen transition
    const handleBlur = () => {
      if (!showResults && !isTransitioningToFullscreen.current) {
        // Only reset if we're not in the grace period after fullscreen activation
        const timeSinceFullscreen = fullscreenActivatedTime.current 
          ? Date.now() - fullscreenActivatedTime.current 
          : Infinity;
        if (timeSinceFullscreen > 2000) {
          resetTest();
        }
      }
    };
    window.addEventListener('blur', handleBlur);

    // Detect window resize (split screen) - restart test if window size changes significantly
    // But ignore resize events during fullscreen transition
    const handleResize = () => {
      if (!showResults && !isTransitioningToFullscreen.current) {
        const widthChange = Math.abs(window.innerWidth - initialWindowWidth.current);
        const heightChange = Math.abs(window.innerHeight - initialWindowHeight.current);
        // If window size changed significantly (more than 100px), likely split screen
        // But only if we're not in the grace period after fullscreen activation
        const timeSinceFullscreen = fullscreenActivatedTime.current 
          ? Date.now() - fullscreenActivatedTime.current 
          : Infinity;
        if ((widthChange > 100 || heightChange > 100) && timeSinceFullscreen > 2000) {
          resetTest();
        }
      }
    };
    window.addEventListener('resize', handleResize);

    // Detect visibility change (tab switching, minimizing window)
    // But ignore during fullscreen transition
    const handleVisibilityChange = () => {
      if (!showResults && document.hidden && !isTransitioningToFullscreen.current) {
        // Only reset if we're not in the grace period after fullscreen activation
        const timeSinceFullscreen = fullscreenActivatedTime.current 
          ? Date.now() - fullscreenActivatedTime.current 
          : Infinity;
        if (timeSinceFullscreen > 2000) {
          resetTest();
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Prevent copy/paste
    const preventCopy = (e) => {
      if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'x')) {
        e.preventDefault();
        setWarnings(prev => prev + 1);
      }
    };
    document.addEventListener('keydown', preventCopy);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
      document.removeEventListener('contextmenu', preventContext);
      document.removeEventListener('keydown', preventKeys);
      document.removeEventListener('keydown', preventCopy);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [showResults, resetTest, showInstructions]);

  const handleBeginTest = async () => {
    console.log('handleBeginTest called');
    initialWindowWidth.current = window.innerWidth;
    initialWindowHeight.current = window.innerHeight;
    setWarnings(0);
    setTestRestarted(false);
    // Set showInstructions to false FIRST so the test content can render
    setShowInstructions(false);
    // Then set fullscreenRequested to true
    setFullscreenRequested(true);
    console.log('State updated: showInstructions=false, fullscreenRequested=true');
    
    // Use requestAnimationFrame to ensure state updates have propagated before requesting fullscreen
    requestAnimationFrame(async () => {
      // Request fullscreen and wait a bit for it to activate
      try {
        await requestFullscreenForContainer();
        console.log('Fullscreen requested');
        // Small delay to ensure fullscreen state is updated
        setTimeout(() => {
          const isCurrentlyFullscreen = !!(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.msFullscreenElement
          );
          console.log('Fullscreen check after timeout:', isCurrentlyFullscreen);
          setIsFullscreen(isCurrentlyFullscreen);
          if (isCurrentlyFullscreen) {
            // Don't clear fullscreenRequested immediately - let the event handler do it
          }
        }, 300);
      } catch (error) {
        console.error('Error requesting fullscreen:', error);
        // Even if fullscreen fails, allow test to proceed
        setIsFullscreen(true);
        setFullscreenRequested(false);
      }
    });
  };

  const renderInstructionList = () => (
    <ul className="list-unstyled text-light mb-0" style={{ lineHeight: 1.7, fontSize: '1rem' }}>
      <li>• This 20-question skill check is mandatory before you start any levels.</li>
      <li>• Score 14+ to open Intermediate, 16+ for instant Advanced access; lower scores unlock Easy only.</li>
      <li>• Low scores mean you must clear every Easy level before Intermediate, and every Intermediate before Advanced.</li>
      <li>• Stay in fullscreen at all times—leaving, switching tabs, or splitting the screen restarts the test.</li>
      <li>• Copy/paste, developer tools, or outside help are blocked. Treat this like a pro gamer challenge.</li>
      <li>• Answer every question; the Finish button unlocks only after all responses are locked in.</li>
    </ul>
  );

  // Check if we have questions - after all hooks are called
  if (!questions || questions.length === 0) {
    console.error('PrerequisiteTest - No questions available for lang:', lang, {
      questions,
      levelDataProvided: !!levelData,
      levelDataKeys: levelData ? Object.keys(levelData) : 'N/A'
    });
    return (
      <div className="gradient-bg d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', padding: '2rem' }}>
        <div className="card-glow p-5 text-center" style={{ maxWidth: '600px', backgroundColor: '#151a2d', borderRadius: '15px' }}>
          <h2 className="neon-text mb-4">⚠️ No Questions Available</h2>
          <p className="text-light mb-3">There are no questions available for <strong>{lang}</strong> yet.</p>
          <p className="text-muted small mb-4">
            This could mean:
            <br />• No quiz questions have been added to the levels yet
            <br />• The language data is not loading correctly
            <br />• Check the browser console for more details
          </p>
          <button onClick={onExit} className="btn btn-neon">
            ← Go Back to Languages
          </button>
        </div>
      </div>
    );
  }

  if (showInstructions) {
    return (
      <div ref={containerRef} className="gradient-bg" style={{ minHeight: '100vh', padding: '2rem' }}>
        <div className="container">
          {testRestarted && (
            <div className="alert alert-danger mb-4 text-center">
              <strong>⚠️ Test Restarted:</strong> You attempted to exit fullscreen, switch tabs, or split the screen. 
              The test has been reset. Please review the instructions and start again.
            </div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-glow p-5 mx-auto text-center"
            style={{ maxWidth: '760px', backgroundColor: '#121a33', borderRadius: '20px' }}
          >
            <h2 className="neon-text mb-3" style={{ fontSize: '2rem' }}>Prerequisite Test Briefing</h2>
            <p className="text-light-50 mb-4">
              Read carefully before you begin. This mission determines which levels unlock for you.
            </p>
            <div className="text-start">
              {renderInstructionList()}
            </div>
            <div className="d-flex flex-column flex-md-row justify-content-center gap-3 mt-5">
              <button
                onClick={onExit}
                className="btn btn-outline-light px-4 py-3"
                style={{ minWidth: '220px', borderRadius: '12px' }}
              >
                ← Back to Languages
              </button>
              <button
                onClick={handleBeginTest}
                className="btn btn-neon px-5 py-3"
                style={{ minWidth: '220px' }}
              >
                Start Prerequisite Test
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (questionIndex, answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Check if all questions are answered
      const allAnswered = questions.every((_, index) => selectedAnswers[index] !== undefined);
      if (!allAnswered) {
        alert('Please answer all questions before finishing the test.');
        return;
      }
      
      // Calculate score
      let correctAnswers = 0;
      questions.forEach((question, index) => {
        if (selectedAnswers[index] === question.answer) {
          correctAnswers++;
        }
      });
      
      setScore(correctAnswers);
      setShowResults(true);
    }
  };

  const handleFinish = () => {
    const percentage = (score / questions.length) * 100;
    // Exit fullscreen before completing
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    onComplete(score, percentage);
  };

  if (showResults) {
    const percentage = (score / questions.length) * 100;
    const maxScore = questions.length;
    const unlockedDifficulty = score > 15 ? 'advanced' : score > 13 ? 'intermediate' : 'easy';
    
    return (
      <div ref={containerRef} className="gradient-bg" style={{ minHeight: '100vh', padding: '2rem' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-glow p-5 mx-auto text-center"
            style={{ maxWidth: '700px', backgroundColor: '#151a2d', borderRadius: '15px' }}
          >
            <h2 className="neon-text display-4 mb-4">Prerequisite Test Results</h2>
            
            <div className="mb-4 p-4" style={{ backgroundColor: '#1a1f3a', borderRadius: '10px' }}>
              <h3 className="text-light mb-3">Your Score</h3>
              <div className="display-1 fw-bold" style={{ 
                color: percentage >= 90 ? '#28a745' : percentage >= 70 ? '#ffc107' : '#dc3545' 
              }}>
                {score} / {maxScore}
              </div>
              <div className="h4 mt-2" style={{ 
                color: percentage >= 90 ? '#28a745' : percentage >= 70 ? '#ffc107' : '#dc3545' 
              }}>
                {percentage.toFixed(1)}%
              </div>
            </div>

            <div className="mb-4 p-4" style={{ backgroundColor: '#1a1f3a', borderRadius: '10px' }}>
              <h4 className="text-light mb-3">Access Level</h4>
              {unlockedDifficulty === 'advanced' ? (
                <div>
                  <p className="text-success h5 mb-2">🎉 Outstanding!</p>
                  <p className="text-light">You can access <strong>all levels</strong> (Easy, Intermediate, Advanced).</p>
                  <p className="text-muted small mt-2">Take advantage of advanced challenges to maximize your learning.</p>
                </div>
              ) : unlockedDifficulty === 'intermediate' ? (
                <div>
                  <p className="text-success h5 mb-2">✅ Great Job!</p>
                  <p className="text-light">You can access <strong>Easy</strong> and <strong>Intermediate</strong> levels.</p>
                  <p className="text-muted small mt-2">Score 16 or higher to unlock Advanced levels.</p>
                </div>
              ) : (
                <div>
                  <p className="text-warning h5 mb-2">📚 Keep Practicing</p>
                  <p className="text-light">You can access <strong>Easy</strong> levels. Review the fundamentals and retake the test to unlock more.</p>
                  <p className="text-muted small mt-2">Score 14+ to unlock Intermediate, 16+ for Advanced.</p>
                </div>
              )}
            </div>

            {warnings > 0 && (
              <div className="alert alert-warning mb-4">
                <strong>Warning:</strong> You attempted to exit or switch tabs {warnings} time(s). 
                Please complete the test without leaving the page.
              </div>
            )}

            <button
              onClick={handleFinish}
              className="btn btn-neon px-5 py-3"
              style={{ fontSize: '1.2rem' }}
            >
              Continue to Levels
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Ensure currentQuestion is within bounds
  const safeCurrentQuestion = Math.max(0, Math.min(currentQuestion, questions.length - 1));
  const currentQ = questions[safeCurrentQuestion];
  
  if (!currentQ) {
    console.error('PrerequisiteTest - currentQ is undefined:', {
      currentQuestion,
      safeCurrentQuestion,
      questionsLength: questions.length,
      questions: questions
    });
    return (
      <div className="gradient-bg d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', padding: '2rem' }}>
        <div className="card-glow p-5 text-center" style={{ maxWidth: '600px', backgroundColor: '#151a2d', borderRadius: '15px' }}>
          <h2 className="neon-text mb-4">Error Loading Question</h2>
          <p className="text-light mb-4">There was an error loading the current question.</p>
          <p className="text-muted small mb-4">Question index: {currentQuestion}, Total questions: {questions.length}</p>
          <button onClick={onExit} className="btn btn-neon">
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  const isAnswered = selectedAnswers[safeCurrentQuestion] !== undefined;
  const progress = ((safeCurrentQuestion + 1) / questions.length) * 100;

  // Debug logging
  console.log('PrerequisiteTest render state:', {
    showInstructions,
    showResults,
    isFullscreen,
    fullscreenRequested,
    currentQuestion,
    safeCurrentQuestion,
    questionsLength: questions.length,
    currentQExists: !!currentQ
  });

  // Show warning if not in fullscreen, but allow test to proceed if fullscreen was just requested
  // Only show warning if we're past instructions, not showing results, and fullscreen wasn't requested
  const shouldShowFullscreenWarning = !isFullscreen && !showResults && !fullscreenRequested && !showInstructions;
  
  // Safety check: if we're past instructions and not showing results, we should always show something
  if (!showInstructions && !showResults && !currentQ) {
    console.error('PrerequisiteTest - Critical error: past instructions but no current question');
    return (
      <div className="gradient-bg d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', padding: '2rem' }}>
        <div className="card-glow p-5 text-center" style={{ maxWidth: '600px', backgroundColor: '#151a2d', borderRadius: '15px' }}>
          <h2 className="neon-text mb-4">Error Loading Test</h2>
          <p className="text-light mb-4">Unable to load the test questions. Please try again.</p>
          <button onClick={onExit} className="btn btn-neon">
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  if (shouldShowFullscreenWarning) {
    return (
      <div ref={containerRef} className="gradient-bg" style={{ minHeight: '100vh', padding: '2rem' }}>
        <div className="container">
          {testRestarted && (
            <div className="alert alert-danger mb-4 text-center">
              <strong>⚠️ Test Restarted:</strong> You attempted to exit fullscreen, switch tabs, or split the screen. 
              The test has been reset. Please complete it without leaving the page.
            </div>
          )}
          <div className="alert alert-warning mb-4 text-center">
            <strong>⚠️ Fullscreen Required:</strong> This test must be taken in fullscreen mode. 
            Please enable fullscreen to continue.
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="card-glow mb-4"
            style={{ backgroundColor: '#121a33', borderRadius: '18px' }}
          >
            <h3 className="neon-text mb-3" style={{ fontSize: '1.3rem' }}>📋 Prerequisite Test Briefing</h3>
            {renderInstructionList()}
          </motion.div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="d-flex justify-content-between mb-2">
              <span className="text-light">Question {safeCurrentQuestion + 1} of {questions.length}</span>
              <span className="text-light">{Math.round(progress)}% Complete</span>
            </div>
            <div className="progress" style={{ height: '20px', backgroundColor: '#333' }}>
              <div
                className="progress-bar bg-info"
                role="progressbar"
                style={{ width: `${progress}%` }}
              >
              </div>
            </div>
            {/* Question Navigation Dots */}
            <div className="d-flex justify-content-center gap-2 mt-3 flex-wrap">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`btn btn-sm ${index === safeCurrentQuestion ? 'btn-neon' : selectedAnswers[index] ? 'btn-success' : 'btn-outline-secondary'}`}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    padding: 0,
                    fontSize: '0.8rem'
                  }}
                  title={`Question ${index + 1}${selectedAnswers[index] ? ' (Answered)' : ' (Not answered)'}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Question Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-glow p-5 mx-auto"
            style={{ maxWidth: '800px', backgroundColor: '#151a2d', borderRadius: '15px' }}
          >
            <h3 className="neon-text mb-4" style={{ fontSize: '1.5rem' }}>
              {currentQ.question}
            </h3>
            
            <div className="options mb-4">
              {currentQ.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswerSelect(safeCurrentQuestion, option)}
                  className={`btn w-100 mb-3 p-3 text-start ${
                    selectedAnswers[safeCurrentQuestion] === option 
                      ? 'btn-neon' 
                      : 'btn-outline-light'
                  }`}
                  style={{ 
                    backgroundColor: selectedAnswers[safeCurrentQuestion] === option ? '#0d6efd' : 'transparent',
                    border: '2px solid #6c757d',
                    fontSize: '1.1rem'
                  }}
                >
                  {option}
                </motion.button>
              ))}
            </div>
            
            <div className="text-center">
              <button
                onClick={handleNext}
                disabled={!isAnswered}
                className="btn btn-neon px-5 py-3"
                style={{ 
                  opacity: isAnswered ? 1 : 0.5,
                  fontSize: '1.1rem',
                  minWidth: '200px'
                }}
              >
                {safeCurrentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Test'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="gradient-bg" style={{ minHeight: '100vh', padding: '2rem' }}>
      <div className="container">
        {/* Test Restarted Banner */}
        {testRestarted && (
          <div className="alert alert-danger mb-3 text-center">
            <strong>⚠️ Test Restarted:</strong> You attempted to exit fullscreen, switch tabs, or split the screen. 
            The test has been reset to question 1. Please complete it without leaving the page.
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="d-flex justify-content-between mb-2">
            <span className="text-light">Question {safeCurrentQuestion + 1} of {questions.length}</span>
            <span className="text-light">{Math.round(progress)}% Complete</span>
          </div>
          <div className="progress" style={{ height: '20px', backgroundColor: '#333' }}>
            <div
              className="progress-bar bg-info"
              role="progressbar"
              style={{ width: `${progress}%` }}
            >
            </div>
          </div>
          {/* Question Navigation Dots */}
          <div className="d-flex justify-content-center gap-2 mt-3 flex-wrap">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`btn btn-sm ${index === safeCurrentQuestion ? 'btn-neon' : selectedAnswers[index] ? 'btn-success' : 'btn-outline-secondary'}`}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  padding: 0,
                  fontSize: '0.8rem'
                }}
                title={`Question ${index + 1}${selectedAnswers[index] ? ' (Answered)' : ' (Not answered)'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Question Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-glow p-5 mx-auto"
          style={{ maxWidth: '800px', backgroundColor: '#151a2d', borderRadius: '15px' }}
        >
          <h3 className="neon-text mb-4" style={{ fontSize: '1.5rem' }}>
            {currentQ.question}
          </h3>
          
          <div className="options mb-4">
            {currentQ.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswerSelect(safeCurrentQuestion, option)}
                className={`btn w-100 mb-3 p-3 text-start ${
                  selectedAnswers[safeCurrentQuestion] === option 
                    ? 'btn-neon' 
                    : 'btn-outline-light'
                }`}
                style={{ 
                  backgroundColor: selectedAnswers[currentQuestion] === option ? '#0d6efd' : 'transparent',
                  border: '2px solid #6c757d',
                  fontSize: '1.1rem'
                }}
              >
                {option}
              </motion.button>
            ))}
          </div>
          
          <div className="text-center">
            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className="btn btn-neon px-5 py-3"
              style={{ 
                opacity: isAnswered ? 1 : 0.5,
                fontSize: '1.1rem',
                minWidth: '200px'
              }}
            >
              {safeCurrentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Test'}
            </button>
          </div>
        </motion.div>

        {/* Instructions */}
        <div className="text-center mt-4">
          <p className="text-muted small">
            ⚠️ Do not exit fullscreen or switch tabs. Your test may be invalidated.
          </p>
        </div>
      </div>
    </div>
  );
}

