import React, { useState } from 'react';
import './Question.css';

interface QuestionProps {
  questionText: string;
  answers: string[];
  onAnswerSelected: (questionText: string, answer: string) => void;  // Add this line
  selectedAnswer: string;
}

export const Question: React.FC<QuestionProps> = ({ questionText, answers, onAnswerSelected, selectedAnswer }) => {  // Update this line
  const handleButtonClick = (value: string) => {
    const newValue = selectedAnswer === value ? "" : value;
    onAnswerSelected(questionText, newValue);  // Add this line
  };
 
  return (
    <>
      <h2 className="question">{questionText}</h2>
      <div className="answerButton-group">
        {answers.map(answer => (
          <button
            key={answer}
            onClick={() => handleButtonClick(answer)}
            className={`answerButton ${selectedAnswer === answer ? 'selected' : ''}`}
          >
            {answer}
          </button>
        ))}
      </div>
    </>
  );
};
