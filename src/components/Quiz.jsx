import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Quiz({ questions, onComplete, maxXP }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

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

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
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

  const handleComplete = () => {
    onComplete(score);
  };

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
        </div>
        
        <div className="mb-4">
          <h5 className="text-light">Review:</h5>
          {questions.map((question, index) => (
            <div key={index} className="mb-3 p-3" style={{ backgroundColor: '#1a1f3a', borderRadius: '5px' }}>
              <p className="text-light mb-2">{question.question}</p>
              <p className={`mb-1 ${selectedAnswers[index] === question.answer ? 'text-success' : 'text-danger'}`}>
                Your answer: {selectedAnswers[index] || 'Not answered'}
              </p>
              <p className="text-success">
                Correct answer: {question.answer}
              </p>
            </div>
          ))}
        </div>
        
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
