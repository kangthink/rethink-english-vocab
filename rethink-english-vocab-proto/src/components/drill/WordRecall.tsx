import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DrillQuestion } from '../../types/drill';
import { DrillService } from '../../services/drillService';

const QuestionContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
`;

const QuestionHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const QuestionTitle = styled.h2`
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const QuestionSubtitle = styled.p`
  color: #666;
  font-size: 1rem;
  margin: 0;
`;

const DefinitionText = styled.div`
  background: #f8f9fa;
  border-left: 4px solid #007bff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 1.1rem;
  line-height: 1.6;
  color: #333;
`;

const ExampleText = styled.div`
  background: #e3f2fd;
  border-left: 4px solid #2196f3;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 30px;
  font-style: italic;
  color: #1565c0;
  font-size: 0.95rem;
`;

const InputField = styled.input`
  width: 100%;
  padding: 15px 20px;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  font-size: 1.1rem;
  margin-bottom: 20px;
  outline: none;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
  
  &:disabled {
    background: #f8f9fa;
    color: #6c757d;
  }
`;

const HintContainer = styled.div`
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
`;

const HintButton = styled.button`
  background: #ffc107;
  color: #212529;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 10px;
  transition: background-color 0.2s;
  
  &:hover {
    background: #e0a800;
  }
  
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const HintText = styled.div`
  font-size: 0.95rem;
  color: #856404;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 15px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover:not(:disabled) {
    background: #0056b3;
  }
  
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const FeedbackContainer = styled.div<{ isCorrect: boolean }>`
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
  background: ${props => props.isCorrect ? '#d4edda' : '#f8d7da'};
  border: 1px solid ${props => props.isCorrect ? '#c3e6cb' : '#f5c6cb'};
  color: ${props => props.isCorrect ? '#155724' : '#721c24'};
`;

interface WordRecallProps {
  question: DrillQuestion;
  onAnswer: (answer: string, timeSpent: number, hintsUsed: number) => void;
}

const WordRecall: React.FC<WordRecallProps> = ({ question, onAnswer }) => {
  const [userInput, setUserInput] = useState('');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [startTime] = useState(Date.now());
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSubmit = () => {
    if (isAnswered || !userInput.trim()) return;

    const timeSpent = (Date.now() - startTime) / 1000;
    setIsAnswered(true);
    setShowFeedback(true);

    // 1.5초 후 다음 문제로 진행
    setTimeout(() => {
      onAnswer(userInput.trim(), timeSpent, hintsUsed);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userInput.trim()) {
      handleSubmit();
    }
  };

  const getHint = () => {
    if (hintsUsed >= 3) return '';
    return DrillService.generateHint(question.correctAnswer, hintsUsed);
  };

  const showHint = () => {
    if (hintsUsed < 3) {
      setHintsUsed(prev => prev + 1);
    }
  };

  const isCorrect = DrillService.checkAnswer(userInput, question.correctAnswer);

  return (
    <QuestionContainer>
      <QuestionHeader>
        <QuestionTitle>What word is this?</QuestionTitle>
        <QuestionSubtitle>Type the word that matches the definition</QuestionSubtitle>
      </QuestionHeader>

      <DefinitionText>
        {question.targetWord.definition}
      </DefinitionText>

      {question.targetWord.example && (
        <ExampleText>
          Example: "{question.targetWord.example}"
        </ExampleText>
      )}

      {hintsUsed > 0 && (
        <HintContainer>
          <HintText>
            <strong>Hint:</strong> {getHint()}
          </HintText>
        </HintContainer>
      )}

      <InputField
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type the word..."
        disabled={isAnswered}
        autoFocus
      />

      <HintButton 
        onClick={showHint}
        disabled={hintsUsed >= 3 || isAnswered}
      >
        💡 Get Hint ({3 - hintsUsed} left)
      </HintButton>

      <SubmitButton
        onClick={handleSubmit}
        disabled={!userInput.trim() || isAnswered}
      >
        Submit Answer
      </SubmitButton>

      {showFeedback && (
        <FeedbackContainer isCorrect={isCorrect}>
          {isCorrect ? (
            <div>
              <strong>✅ Correct!</strong> 
              {hintsUsed > 0 && ` (Used ${hintsUsed} hint${hintsUsed > 1 ? 's' : ''})`}
            </div>
          ) : (
            <div>
              <strong>❌ Incorrect</strong> - The correct answer is: <strong>{question.correctAnswer}</strong>
            </div>
          )}
        </FeedbackContainer>
      )}
    </QuestionContainer>
  );
};

export default WordRecall; 