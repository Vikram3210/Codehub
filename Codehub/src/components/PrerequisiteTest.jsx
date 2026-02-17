import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { quizApi } from '../utils/quiz/api';

export default function PrerequisiteTest({ lang, onComplete, onExit }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [testRestarted, setTestRestarted] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const containerRef = useRef(null);

  // Load prerequisite questions from API (MongoDB)
  useEffect(() => {
    let isMounted = true;

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setLoadError(null);

        const data = await quizApi.get(`/prerequisites/random/${lang}?count=20`);

        if (!isMounted) return;

        if (!Array.isArray(data) || data.length === 0) {
          setQuestions([]);
          setLoadError('No prerequisite questions available for this language yet.');
        } else {
          setQuestions(data);
        }
      } catch (error) {
        console.error('PrerequisiteTest - error fetching questions:', error);
        if (isMounted) {
          setLoadError('Failed to load prerequisite questions. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchQuestions();

    return () => {
      isMounted = false;
    };
  }, [lang]);

  // Request fullscreen on container element
  const requestFullscreen = useCallback(async () => {
    try {
      const elem = containerRef.current;
      if (!elem) {
        console.warn('Container ref not available');
        return false;
      }

      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        await elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        await elem.mozRequestFullScreen();
      } else {
        console.warn('Fullscreen API not supported');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Fullscreen error:', error);
      alert('Could not enter fullscreen mode. Please allow fullscreen permissions.');
      return false;
    }
  }, []);

  // Exit fullscreen
  const exitFullscreen = useCallback(() => {
    if (typeof document === 'undefined') return;
    
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(err => console.error('Error exiting fullscreen:', err));
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    }
  }, []);

  // Reset test on violation
  const resetTest = useCallback(() => {
    console.log('Test violation detected - restarting test');
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
    setTestRestarted(true);
    setTestStarted(false);
    setShowInstructions(true);
    setIsFullscreen(false);
    exitFullscreen();
  }, [exitFullscreen]);

  // Check if currently in fullscreen
  const checkFullscreen = useCallback(() => {
    if (typeof document === 'undefined') return false;
    
    return !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement ||
      document.mozFullScreenElement
    );
  }, []);

  // Handle begin test - request fullscreen first
  const handleBeginTest = async () => {
    console.log('handleBeginTest called - requesting fullscreen');
    const success = await requestFullscreen();
    
    if (success) {
      // Wait a moment for fullscreen to activate
      setTimeout(() => {
        const isCurrentlyFullscreen = checkFullscreen();
        if (isCurrentlyFullscreen) {
          setIsFullscreen(true);
          setShowInstructions(false);
          setTestStarted(true);
          setTestRestarted(false);
        } else {
          alert('Please allow fullscreen to continue with the test.');
        }
      }, 300);
    }
  };

  // Fullscreen enforcement listeners
  useEffect(() => {
    if (!testStarted || showInstructions || showResults) {
      return;
    }

    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    // Monitor fullscreen changes
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = checkFullscreen();
      setIsFullscreen(isCurrentlyFullscreen);
      
      // If fullscreen was exited during test, reset
      if (!isCurrentlyFullscreen && testStarted && !showResults) {
        resetTest();
      }
    };

    // Detect tab switch / window blur
    const handleBlur = () => {
      if (testStarted && !showResults) {
        resetTest();
      }
    };

    // Detect visibility change (tab switching, minimizing)
    const handleVisibilityChange = () => {
      if (testStarted && !showResults && document.hidden) {
        resetTest();
      }
    };

    // Add event listeners
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [testStarted, showInstructions, showResults, checkFullscreen, resetTest]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (checkFullscreen()) {
        exitFullscreen();
      }
    };
  }, [checkFullscreen, exitFullscreen]);

  const renderInstructionList = () => (
    <ul className="list-unstyled text-light mb-0" style={{ lineHeight: 1.7, fontSize: '1rem' }}>
      <li>• This 20-question skill check is mandatory before you start any levels.</li>
      <li>• Score 14+ to open Intermediate, 16+ for instant Advanced access; lower scores unlock Easy only.</li>
      <li>• Low scores mean you must clear every Easy level before Intermediate, and every Intermediate before Advanced.</li>
      <li>• The test must be taken in fullscreen mode. Exiting fullscreen or switching tabs will restart the test.</li>
      <li>• Answer every question; the Finish button unlocks only after all responses are locked in.</li>
    </ul>
  );

  // Loading / error states and empty data handling
  if (loading) {
    return (
      <div className="gradient-bg d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', padding: '2rem' }}>
        <div className="card-glow p-5 text-center" style={{ maxWidth: '600px', backgroundColor: '#151a2d', borderRadius: '15px' }}>
          <h2 className="neon-text mb-4">Loading Prerequisite Test...</h2>
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (loadError || !questions || questions.length === 0) {
    console.error('PrerequisiteTest - No questions available for lang:', lang, {
      questions,
      error: loadError,
    });
    return (
      <div className="gradient-bg d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', padding: '2rem' }}>
        <div className="card-glow p-5 text-center" style={{ maxWidth: '600px', backgroundColor: '#151a2d', borderRadius: '15px' }}>
          <h2 className="neon-text mb-4">⚠️ No Questions Available</h2>
          <p className="text-light mb-3">There are no questions available for <strong>{lang}</strong> yet.</p>
          <p className="text-muted small mb-4">
            {loadError || (
              <>
                This could mean:
                <br />• No prerequisite questions have been added yet
                <br />• The language data is not loading correctly
                <br />• Check the browser console for more details
              </>
            )}
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
              <strong>⚠️ Test Restarted:</strong> You exited fullscreen or switched tabs. The test has been reset. Please review the instructions and start again.
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
    // Check if still in fullscreen
    if (!checkFullscreen()) {
      resetTest();
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Check if all questions are answered
      const allAnswered = questions.every((_, index) => selectedAnswers[index] !== undefined);
      if (!allAnswered) {
        alert('Please answer all questions before finishing the test.');
        return;
      }
      
      // Check fullscreen one more time before finishing
      if (!checkFullscreen()) {
        resetTest();
        return;
      }
      
      // Calculate score (compare against correctAnswer from API)
      let correctAnswers = 0;
      questions.forEach((question, index) => {
        const userAnswer = selectedAnswers[index];
        if (userAnswer !== undefined && userAnswer === question.correctAnswer) {
          correctAnswers++;
        }
      });
      
      setScore(correctAnswers);
      setShowResults(true);
      // Exit fullscreen after test completion
      exitFullscreen();
    }
  };

  const handleFinish = () => {
    const percentage = (score / questions.length) * 100;
    exitFullscreen();
    onComplete(score, percentage);
  };

  // Handle manual exit
  const handleExitTest = () => {
    if (window.confirm('Are you sure you want to exit the test? Your progress will be lost.')) {
      exitFullscreen();
      resetTest();
    }
  };

  if (showResults) {
    const percentage = (score / questions.length) * 100;
    const maxScore = questions.length;
    const unlockedDifficulty = score > 15 ? 'advanced' : score > 13 ? 'intermediate' : 'easy';
    
    return (
      <div className="gradient-bg" style={{ minHeight: '100vh', padding: '2rem' }}>
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

  // Check if fullscreen is required but not active
  if (testStarted && !showResults && !checkFullscreen()) {
    return (
      <div ref={containerRef} className="gradient-bg" style={{ minHeight: '100vh', padding: '2rem' }}>
        <div className="container">
          <div className="alert alert-warning mb-4 text-center">
            <strong>⚠️ Fullscreen Required:</strong> The test must be taken in fullscreen mode. Please enter fullscreen to continue.
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-glow p-5 mx-auto text-center"
            style={{ maxWidth: '600px', backgroundColor: '#151a2d', borderRadius: '15px' }}
          >
            <h3 className="neon-text mb-4">Fullscreen Required</h3>
            <p className="text-light mb-4">The prerequisite test must be taken in fullscreen mode.</p>
            <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
              <button
                onClick={handleBeginTest}
                className="btn btn-neon px-5 py-3"
              >
                Enter Fullscreen & Continue
              </button>
              <button
                onClick={handleExitTest}
                className="btn btn-outline-light px-4 py-3"
              >
                Exit Test
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
        {/* Exit Test Button */}
        <div className="text-end mb-3">
          <button
            onClick={handleExitTest}
            className="btn btn-outline-danger btn-sm"
            title="Exit Test"
          >
            Exit Test
          </button>
        </div>

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
                onClick={() => {
                  // Check fullscreen before allowing navigation
                  if (!checkFullscreen()) {
                    resetTest();
                    return;
                  }
                  setCurrentQuestion(index);
                }}
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
                onClick={() => {
                  // Check fullscreen before allowing answer selection
                  if (!checkFullscreen()) {
                    resetTest();
                    return;
                  }
                  handleAnswerSelect(safeCurrentQuestion, option);
                }}
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
              disabled={!isAnswered || !checkFullscreen()}
              className="btn btn-neon px-5 py-3"
              style={{ 
                opacity: (isAnswered && checkFullscreen()) ? 1 : 0.5,
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

