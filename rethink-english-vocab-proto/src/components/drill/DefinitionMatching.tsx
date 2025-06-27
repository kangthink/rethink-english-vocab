import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DrillQuestion } from '../../types/drill';

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
  margin-bottom: 30px;
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

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 20px;
`;

const OptionButton = styled.button<{ selected?: boolean; disabled?: boolean }>`
  padding: 15px 20px;
  border: 2px solid ${props => props.selected ? '#007bff' : '#dee2e6'};
  background: ${props => props.selected ? '#e3f2fd' : 'white'};
  border-radius: 8px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s;
  opacity: ${props => props.disabled ? 0.6 : 1};
  
  &:hover:not(:disabled) {
    border-color: #007bff;
    background: #f8f9fa;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const TimerBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 4px;
  background: #e9ecef;
  border-radius: 2px;
  margin-bottom: 20px;
  overflow: hidden;
  
  &::after {
    content: '';
    display: block;
    width: ${props => props.progress}%;
    height: 100%;
    background: linear-gradient(90deg, #28a745, #ffc107, #dc3545);
    transition: width 0.1s linear;
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

interface DefinitionMatchingProps {
  question: DrillQuestion;
  onAnswer: (answer: string, timeSpent: number) => void;
  timeLimit?: number;
}

const DefinitionMatching: React.FC<DefinitionMatchingProps> = ({ 
  question, 
  onAnswer, 
  timeLimit = 30 
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [startTime] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0 && !isAnswered) {
      handleAnswer('');
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 0.1));
    }, 100);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered]);

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;

    const timeSpent = (Date.now() - startTime) / 1000;
    setSelectedAnswer(answer);
    setIsAnswered(true);
    setShowFeedback(true);

    // 1.5초 후 다음 문제로 진행
    setTimeout(() => {
      onAnswer(answer, timeSpent);
    }, 1500);
  };

  const isCorrect = selectedAnswer === question.correctAnswer;
  const timeProgress = ((timeLimit - timeLeft) / timeLimit) * 100;

  return (
    <QuestionContainer>
      <QuestionHeader>
        <QuestionTitle>What word matches this definition?</QuestionTitle>
        <QuestionSubtitle>Choose the correct word</QuestionSubtitle>
      </QuestionHeader>

      <TimerBar progress={timeProgress} />

      <DefinitionText>
        {question.targetWord.definition}
      </DefinitionText>

      {question.targetWord.example && (
        <ExampleText>
          Example: "{question.targetWord.example}"
        </ExampleText>
      )}

      <OptionsGrid>
        {question.options?.map((option) => (
          <OptionButton
            key={option}
            selected={selectedAnswer === option}
            disabled={isAnswered}
            onClick={() => handleAnswer(option)}
          >
            {option}
          </OptionButton>
        ))}
      </OptionsGrid>

      {showFeedback && (
        <FeedbackContainer isCorrect={isCorrect}>
          {isCorrect ? (
            <div>
              <strong>✅ Correct!</strong> Great job!
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

export default DefinitionMatching; 