import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

export default function Quiz({ questions, onComplete, maxXP, timeLimit }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(() => (typeof timeLimit === 'number' ? timeLimit : null));
  const [hasTimerExpired, setHasTimerExpired] = useState(false);

  // Validate questions array
  if (!Array.isArray(questions) || questions.length === 0) {
    return (
      <div className="card-glow p-5 text-center mx-auto" style={{ maxWidth: '600px', backgroundColor: '#151a2d', borderRadius: '10px' }}>
        <h3 className="text-warning mb-3">Quiz Error</h3>
        <p className="text-light mb-4">No quiz questions are available.</p>
      </div>
    );
  }

  const handleAnswerSelect = (questionIndex, answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  // Reset timer when timeLimit changes
  useEffect(() => {
    if (typeof timeLimit === 'number' && timeLimit > 0) {
      setTimeLeft(timeLimit);
      setHasTimerExpired(false);
    } else {
      setTimeLeft(null);
      setHasTimerExpired(false);
    }
  }, [timeLimit, questions.length]);

  const calculateResults = useCallback(() => {
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.answer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setShowResults(true);
    setTimeLeft(null);
  }, [questions, selectedAnswers]);

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const handleComplete = () => {
    onComplete(score);
  };

  // Countdown timer
  useEffect(() => {
    if (!timeLimit || showResults || timeLeft === null || timeLeft <= 0) {
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null) return prev;
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLimit, timeLeft, showResults]);

  useEffect(() => {
    if (!timeLimit || showResults) return;
    if (timeLeft === 0) {
      setHasTimerExpired(true);
      calculateResults();
    }
  }, [timeLimit, timeLeft, showResults, calculateResults]);

  if (showResults) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="card-glow p-4 mx-auto text-center"
        style={{ maxWidth: '600px', backgroundColor: '#151a2d', borderRadius: '10px' }}
      >
        <h3 className="neon-text mb-4">Quiz Results</h3>
        <div className="mb-4">
          <h4 className="text-light">
            You scored {score} out of {questions.length}
          </h4>
          <p className="text-muted">
            That's {questions.length > 0 ? Math.round((score / questions.length) * 100) : 0}% correct!
          </p>
          {timeLimit && (
            <p className="text-muted small">
              Time limit: {Math.floor(timeLimit / 60)}m {String(timeLimit % 60).padStart(2, '0')}s
            </p>
          )}
          {hasTimerExpired && (
            <p className="text-warning">Time expired. Your score reflects answers submitted before the timer ended.</p>
          )}
        </div>
        
        <QuestionReview
          questions={questions}
          selectedAnswers={selectedAnswers}
        />
        
        <button
          onClick={handleComplete}
          className="btn btn-neon px-5 py-3"
        >
          Complete Quiz
        </button>
      </motion.div>
    );
  }

  const currentQ = questions[currentQuestion];
  const isAnswered = selectedAnswers[currentQuestion] !== undefined;

  // Safety check for current question
  if (!currentQ) {
    return (
      <div className="card-glow p-5 text-center mx-auto" style={{ maxWidth: '600px', backgroundColor: '#151a2d', borderRadius: '10px' }}>
        <h3 className="text-warning mb-3">Quiz Error</h3>
        <p className="text-light mb-4">Unable to load current question.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card-glow p-4 mx-auto"
      style={{ maxWidth: '700px', backgroundColor: '#151a2d', borderRadius: '10px' }}
    >
      {timeLimit && timeLeft !== null && (
        <div className="d-flex justify-content-end mb-3">
          <span className={`badge ${timeLeft <= 10 ? 'bg-danger' : 'bg-info'} px-3 py-2`}>
            Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </span>
        </div>
      )}
      <div className="mb-3">
        <span className="text-muted">
          Question {currentQuestion + 1} of {questions.length}
        </span>
      </div>
      
      <h3 className="neon-text mb-4">{currentQ.question}</h3>
      
      <div className="options">
        {currentQ.options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAnswerSelect(currentQuestion, option)}
            className={`btn w-100 mb-3 p-3 text-start ${
              selectedAnswers[currentQuestion] === option 
                ? 'btn-neon' 
                : 'btn-outline-light'
            }`}
            style={{ 
              backgroundColor: selectedAnswers[currentQuestion] === option ? '#0d6efd' : 'transparent',
              border: '1px solid #6c757d'
            }}
          >
            {option}
          </motion.button>
        ))}
      </div>
      
      <div className="text-center mt-4">
        <button
          onClick={handleNext}
          disabled={!isAnswered}
          className="btn btn-neon px-5 py-3"
          style={{ opacity: isAnswered ? 1 : 0.5 }}
        >
          {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </button>
      </div>
    </motion.div>
  );
}

function QuestionReview({ questions, selectedAnswers }) {
  const reviewItems = useMemo(() => {
    return questions.map((question, index) => {
      const selected = selectedAnswers[index];
      const correct = question.answer;
      const isCorrect = selected === correct;
      return {
        question,
        selected,
        correct,
        isCorrect,
        wrongExplanation: isCorrect ? null : buildWrongExplanation(question, selected),
        correctExplanation: buildCorrectExplanation(question),
      };
    });
  }, [questions, selectedAnswers]);

  return (
    <div className="mb-4">
      <h5 className="text-light">Review:</h5>
      {reviewItems.map(({ question, selected, correct, isCorrect, wrongExplanation, correctExplanation }, index) => (
        <div key={index} className="mb-3 p-3" style={{ backgroundColor: '#1a1f3a', borderRadius: '5px' }}>
          <p className="text-light mb-2">{question.question}</p>
          <p className={`mb-1 ${isCorrect ? 'text-success' : 'text-danger'}`}>
            Your answer: {selected ?? 'Not answered'}
          </p>
          <p className="text-success mb-2">
            Correct answer: {correct}
          </p>

          {!isCorrect && (
            <div className="mb-2">
              <p className="text-danger fw-semibold mb-1">Why your answer is incorrect</p>
              <p className="text-muted mb-0">{wrongExplanation}</p>
            </div>
          )}

          <div>
            <p className="text-info fw-semibold mb-1">
              {isCorrect ? 'Why this answer is correct' : 'Why the correct answer is right'}
            </p>
            <p className="text-muted mb-0">{correctExplanation}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function buildWrongExplanation(question, selected) {
  if (!selected) {
    return 'You did not select an answer, so the question was marked incorrect.';
  }
  const explanations = getOptionExplanations(question);
  if (explanations && typeof explanations[selected] === 'string') {
    return explanations[selected];
  }
  return `'${selected}' does not fulfill the requirement described in the question. Revisit the theory content for this level to understand why it falls short.`;
}

function buildCorrectExplanation(question) {
  const explanations = getOptionExplanations(question);
  if (explanations && typeof explanations[question.answer] === 'string') {
    return explanations[question.answer];
  }
  if (typeof question.correctExplanation === 'string') {
    return question.correctExplanation;
  }
  if (typeof question.explanation === 'string') {
    return question.explanation;
  }
  return `'${question.answer}' directly satisfies the concept highlighted in the theory section for this level.`;
}

function getOptionExplanations(question) {
  if (question && typeof question.explanations === 'object' && question.explanations !== null) {
    return question.explanations;
  }
  return null;
}
