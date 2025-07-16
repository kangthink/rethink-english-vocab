import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { WordNode } from '../../types';
import { DrillType, DrillSession, DrillResult } from '../../types/drill';
import { DrillService } from '../../services/drillService';
import DefinitionMatching from './DefinitionMatching';
import WordRecall from './WordRecall';
import FillInBlank from './FillInBlank';
import MultipleChoice from './MultipleChoice';

const DrillInterface = styled.div`
  min-height: 500px;
  padding: 20px;
`;

const DrillHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const DrillTitle = styled.h1`
  color: #333;
  font-size: 2rem;
  margin-bottom: 10px;
`;

const DrillSubtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
  margin: 0;
`;

const DrillSelector = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: 0 auto;
`;

const DrillTypeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 30px;
`;

const DrillTypeButton = styled.button<{ selected: boolean }>`
  padding: 20px;
  border: 2px solid ${props => props.selected ? '#007bff' : '#dee2e6'};
  background: ${props => props.selected ? '#e3f2fd' : 'white'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  
  &:hover {
    border-color: #007bff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
  }
`;

const DrillTypeTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
`;

const DrillTypeDescription = styled.div`
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
`;

const SettingsSection = styled.div`
  margin-bottom: 20px;
`;

const SettingLabel = styled.label`
  display: block;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
`;

const SettingInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #dee2e6;
  border-radius: 6px;
  font-size: 1rem;
  
  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const StartButton = styled.button`
  width: 100%;
  padding: 15px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
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

const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  margin-bottom: 20px;
  overflow: hidden;
  
  &::after {
    content: '';
    display: block;
    width: ${props => props.progress}%;
    height: 100%;
    background: linear-gradient(90deg, #007bff, #28a745);
    transition: width 0.3s ease;
  }
`;

const ProgressText = styled.div`
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 20px;
`;

const ScoreDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const ScoreItem = styled.div`
  text-align: center;
`;

const ScoreNumber = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #007bff;
`;

const ScoreLabel = styled.div`
  font-size: 0.8rem;
  color: #666;
  text-transform: uppercase;
`;

const ResultsContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
`;

const ResultTitle = styled.h2`
  color: #333;
  font-size: 1.8rem;
  margin-bottom: 20px;
`;

const FinalScore = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: #28a745;
  margin-bottom: 20px;
`;

const RetryButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-right: 15px;
  transition: background-color 0.2s;
  
  &:hover {
    background: #218838;
  }
`;

const BackButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #5a6268;
  }
`;

interface DrillContainerProps {
  availableWords: WordNode[];
}

const DrillContainer: React.FC<DrillContainerProps> = ({ availableWords }) => {
  const [currentSession, setCurrentSession] = useState<DrillSession | null>(null);
  const [selectedDrillType, setSelectedDrillType] = useState<DrillType>('definition-matching');
  const [wordCount, setWordCount] = useState(10);
  const [drillResults, setDrillResults] = useState<DrillResult[]>([]);

  const drillTypes = [
    {
      type: 'definition-matching' as DrillType,
      title: '뜻 맞히기',
      description: '정의를 보고 알맞은 단어 선택'
    },
    {
      type: 'word-recall' as DrillType,
      title: '단어 회상',
      description: '정의를 보고 단어 직접 입력'
    },
    {
      type: 'multiple-choice' as DrillType,
      title: '객관식 문제',
      description: '단어를 보고 정의 선택하기'
    },
    {
      type: 'fill-in-blank' as DrillType,
      title: '빈칸 채우기',
      description: '예문의 빈칸에 알맞은 단어 넣기'
    }
  ];

  const startDrill = () => {
    if (availableWords.length === 0) {
      alert('먼저 단어를 추가해주세요!');
      return;
    }

    const words = DrillService.selectWordsForDrill(availableWords, wordCount);
    const questions = DrillService.generateQuestions(selectedDrillType, words);
    
    const session: DrillSession = {
      id: `session_${Date.now()}`,
      type: selectedDrillType,
      questions,
      currentQuestionIndex: 0,
      score: 0,
      startTime: new Date()
    };
    
    setCurrentSession(session);
    setDrillResults([]);
  };

  const handleAnswer = (answer: string, timeSpent: number, hintsUsed: number = 0) => {
    if (!currentSession) return;

    const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
    const isCorrect = selectedDrillType === 'definition-matching' 
      ? answer === currentQuestion.correctAnswer
      : DrillService.checkAnswer(answer, currentQuestion.correctAnswer);

    const result: DrillResult = {
      questionId: currentQuestion.id,
      userAnswer: answer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      timeSpent,
      hintsUsed
    };

    setDrillResults(prev => [...prev, result]);

    const newSession = {
      ...currentSession,
      currentQuestionIndex: currentSession.currentQuestionIndex + 1,
      score: currentSession.score + (isCorrect ? 1 : 0)
    };

    if (newSession.currentQuestionIndex >= newSession.questions.length) {
      // 세션 완료
      newSession.endTime = new Date();
      newSession.totalTime = (newSession.endTime.getTime() - newSession.startTime.getTime()) / 1000;
    }

    setCurrentSession(newSession);
  };

  const resetDrill = () => {
    setCurrentSession(null);
    setDrillResults([]);
  };

  const retryDrill = () => {
    startDrill();
  };

  // 세션이 완료된 경우
  if (currentSession && currentSession.currentQuestionIndex >= currentSession.questions.length) {
    const accuracy = (currentSession.score / currentSession.questions.length) * 100;
    const avgTime = drillResults.reduce((sum, r) => sum + r.timeSpent, 0) / drillResults.length;

    return (
      <DrillInterface>
        <ResultsContainer>
          <ResultTitle>🎉 Drill Complete!</ResultTitle>
          <FinalScore>{currentSession.score}/{currentSession.questions.length}</FinalScore>
          
          <ScoreDisplay>
            <ScoreItem>
              <ScoreNumber>{Math.round(accuracy)}%</ScoreNumber>
              <ScoreLabel>Accuracy</ScoreLabel>
            </ScoreItem>
            <ScoreItem>
              <ScoreNumber>{Math.round(avgTime)}s</ScoreNumber>
              <ScoreLabel>Avg Time</ScoreLabel>
            </ScoreItem>
            <ScoreItem>
              <ScoreNumber>{Math.round(currentSession.totalTime || 0)}s</ScoreNumber>
              <ScoreLabel>Total Time</ScoreLabel>
            </ScoreItem>
          </ScoreDisplay>

          <div>
            <RetryButton onClick={retryDrill}>다시 하기</RetryButton>
            <BackButton onClick={resetDrill}>메뉴로 돌아가기</BackButton>
          </div>
        </ResultsContainer>
      </DrillInterface>
    );
  }

  // 현재 drill 진행 중
  if (currentSession) {
    const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
    const progress = (currentSession.currentQuestionIndex / currentSession.questions.length) * 100;

    return (
      <DrillInterface>
        <DrillHeader>
          <DrillTitle>Drill in Progress</DrillTitle>
        </DrillHeader>

        <ProgressBar progress={progress} />
        <ProgressText>
          Question {currentSession.currentQuestionIndex + 1} of {currentSession.questions.length}
        </ProgressText>

        <ScoreDisplay>
          <ScoreItem>
            <ScoreNumber>{currentSession.score}</ScoreNumber>
            <ScoreLabel>Score</ScoreLabel>
          </ScoreItem>
          <ScoreItem>
            <ScoreNumber>{Math.round((currentSession.score / Math.max(1, currentSession.currentQuestionIndex)) * 100)}%</ScoreNumber>
            <ScoreLabel>Accuracy</ScoreLabel>
          </ScoreItem>
        </ScoreDisplay>

        {selectedDrillType === 'definition-matching' && (
          <DefinitionMatching 
            question={currentQuestion} 
            onAnswer={handleAnswer}
          />
        )}

        {selectedDrillType === 'word-recall' && (
          <WordRecall 
            question={currentQuestion} 
            onAnswer={handleAnswer}
          />
        )}

        {selectedDrillType === 'multiple-choice' && (
          <MultipleChoice 
            question={currentQuestion} 
            onAnswer={handleAnswer}
          />
        )}

        {selectedDrillType === 'fill-in-blank' && (
          <FillInBlank 
            question={currentQuestion} 
            onAnswer={handleAnswer}
          />
        )}
      </DrillInterface>
    );
  }

  // Drill 선택 화면
  return (
    <DrillInterface>
      <DrillHeader>
        <DrillTitle>🎯 Vocabulary Drill</DrillTitle>
        <DrillSubtitle>Select a drill type to practice your vocabulary</DrillSubtitle>
      </DrillHeader>

      <DrillSelector>
        <SettingsSection>
          <SettingLabel>Drill Type:</SettingLabel>
          <DrillTypeGrid>
            {drillTypes.map((drill) => (
              <DrillTypeButton
                key={drill.type}
                selected={selectedDrillType === drill.type}
                onClick={() => setSelectedDrillType(drill.type)}
              >
                <DrillTypeTitle>{drill.title}</DrillTypeTitle>
                <DrillTypeDescription>{drill.description}</DrillTypeDescription>
              </DrillTypeButton>
            ))}
          </DrillTypeGrid>
        </SettingsSection>

        <SettingsSection>
          <SettingLabel>Number of Questions:</SettingLabel>
          <SettingInput
            type="number"
            min="5"
            max={Math.min(50, availableWords.length)}
            value={wordCount}
            onChange={(e) => setWordCount(Number(e.target.value))}
          />
        </SettingsSection>

        <StartButton 
          onClick={startDrill}
          disabled={availableWords.length === 0}
        >
          {availableWords.length === 0 ? 'No words available' : `Start Drill (${availableWords.length} words available)`}
        </StartButton>
      </DrillSelector>
    </DrillInterface>
  );
};

export default DrillContainer; 