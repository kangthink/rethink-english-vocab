import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DrillQuestion } from '../../types/drill';

const Container = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const Title = styled.h2`
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1rem;
  margin: 0;
`;

const ProgressBar = styled.div<{ progress: number }>`
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

const QuestionText = styled.div`
  background: #f8f9fa;
  border-left: 4px solid #007bff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  font-size: 1.2rem;
  line-height: 1.6;
  color: #333;
  text-align: center;
  font-weight: 500;
`;

const ChoicesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 20px;
`;

const ChoiceButton = styled.button<{ selected?: boolean; disabled?: boolean; isCorrect?: boolean; isWrong?: boolean }>`
  padding: 18px 24px;
  border: 2px solid ${props => {
    if (props.isCorrect) return '#28a745';
    if (props.isWrong) return '#dc3545';
    if (props.selected) return '#007bff';
    return '#dee2e6';
  }};
  background: ${props => {
    if (props.isCorrect) return '#d4edda';
    if (props.isWrong) return '#f8d7da';
    if (props.selected) return '#e3f2fd';
    return 'white';
  }};
  border-radius: 8px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 1.1rem;
  font-weight: 500;
  transition: all 0.2s;
  opacity: ${props => props.disabled ? 0.8 : 1};
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  &:hover:not(:disabled) {
    border-color: #007bff;
    background: #f8f9fa;
    transform: translateX(5px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
  }
  
  &:active:not(:disabled) {
    transform: translateX(0);
  }
`;

const OptionLabel = styled.span`
  font-weight: 600;
  margin-right: 15px;
  color: #6c757d;
`;

const OptionText = styled.span`
  flex: 1;
  text-align: left;
`;

const OptionIndicator = styled.span`
  font-size: 1.2rem;
  margin-left: 10px;
`;

const Hint = styled.div`
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  color: #856404;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const HintIcon = styled.span`
  font-size: 1.2rem;
`;

interface DrillProps {
  question: DrillQuestion;
  onAnswer: (answer: string, timeSpent: number) => void;
  timeLimit?: number;
}

const MultipleChoice: React.FC<DrillProps> = ({ 
  question, 
  onAnswer, 
  timeLimit = 30 
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [startTime] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0 && !isAnswered) {
      handleAnswer('');
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 0.1));
    }, 100);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered]);

  useEffect(() => {
    if (timeLeft <= 10 && !showHint && !isAnswered) {
      setShowHint(true);
    }
  }, [timeLeft, showHint, isAnswered]);

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;

    const timeSpent = (Date.now() - startTime) / 1000;
    setSelectedAnswer(answer);
    setIsAnswered(true);

    setTimeout(() => {
      onAnswer(answer, timeSpent);
    }, 2000);
  };

  const timeProgress = ((timeLimit - timeLeft) / timeLimit) * 100;
  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <Container>
      <Header>
        <Title>Multiple Choice Question</Title>
        <Subtitle>Select the best answer</Subtitle>
      </Header>

      <ProgressBar progress={timeProgress} />

      <QuestionText>
        What is the meaning of "{question.targetWord.word}"?
      </QuestionText>

      {showHint && !isAnswered && (
        <Hint>
          <HintIcon>💡</HintIcon>
          <span>Hint: {question.targetWord.example}</span>
        </Hint>
      )}

      <ChoicesGrid>
        {question.options?.map((option, index) => {
          const isCorrect = isAnswered && option === question.correctAnswer;
          const isWrong = isAnswered && selectedAnswer === option && option !== question.correctAnswer;
          
          return (
            <ChoiceButton
              key={option}
              selected={selectedAnswer === option}
              disabled={isAnswered}
              isCorrect={isCorrect}
              isWrong={isWrong}
              onClick={() => handleAnswer(option)}
            >
              <OptionLabel>{optionLabels[index]})</OptionLabel>
              <OptionText>{option}</OptionText>
              <OptionIndicator>
                {isCorrect && '✓'}
                {isWrong && '✗'}
              </OptionIndicator>
            </ChoiceButton>
          );
        })}
      </ChoicesGrid>
    </Container>
  );
};

export default MultipleChoice;