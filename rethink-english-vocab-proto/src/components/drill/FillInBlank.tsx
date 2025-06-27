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

const SentenceContainer = styled.div`
  background: #f8f9fa;
  border-left: 4px solid #007bff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  font-size: 1.2rem;
  line-height: 1.8;
  color: #333;
  text-align: center;
`;

const BlankSpace = styled.span`
  display: inline-block;
  min-width: 100px;
  padding: 8px 12px;
  border: 2px dashed #007bff;
  border-radius: 6px;
  background: #e3f2fd;
  margin: 0 4px;
  font-weight: bold;
  color: #1565c0;
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

const FeedbackContainer = styled.div<{ isCorrect: boolean }>`
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
  background: ${props => props.isCorrect ? '#d4edda' : '#f8d7da'};
  border: 1px solid ${props => props.isCorrect ? '#c3e6cb' : '#f5c6cb'};
  color: ${props => props.isCorrect ? '#155724' : '#721c24'};
`;

interface FillInBlankProps {
  question: DrillQuestion;
  onAnswer: (answer: string, timeSpent: number) => void;
}

const FillInBlank: React.FC<FillInBlankProps> = ({ question, onAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [startTime] = useState(Date.now());
  const [showFeedback, setShowFeedback] = useState(false);

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

  const renderSentence = () => {
    if (!question.context) return question.targetWord.example;
    
    return question.context.split('_____').map((part, index, array) => (
      <React.Fragment key={index}>
        {part}
        {index < array.length - 1 && (
          <BlankSpace>
            {selectedAnswer || '_____'}
          </BlankSpace>
        )}
      </React.Fragment>
    ));
  };

  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <QuestionContainer>
      <QuestionHeader>
        <QuestionTitle>Fill in the blank</QuestionTitle>
        <QuestionSubtitle>Choose the word that completes the sentence</QuestionSubtitle>
      </QuestionHeader>

      <SentenceContainer>
        {renderSentence()}
      </SentenceContainer>

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

export default FillInBlank; 