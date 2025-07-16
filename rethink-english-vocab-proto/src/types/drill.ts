import { WordNode } from './index';

export type DrillType = 
  | 'definition-matching'
  | 'word-recall'
  | 'multiple-choice'
  | 'audio-recognition'
  | 'fill-in-blank'
  | 'sentence-creation'
  | 'speech-shadowing';

export interface DrillQuestion {
  id: string;
  type: DrillType;
  targetWord: WordNode;
  options?: string[];
  correctAnswer: string;
  timeLimit?: number;
  context?: string; // for fill-in-blank
}

export interface DrillSession {
  id: string;
  type: DrillType;
  questions: DrillQuestion[];
  currentQuestionIndex: number;
  score: number;
  startTime: Date;
  endTime?: Date;
  totalTime?: number;
}

export interface DrillResult {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
  hintsUsed?: number;
}

export interface DrillProgress {
  wordId: string;
  totalAttempts: number;
  correctAttempts: number;
  lastAttempt: Date;
  difficulty: number;
  drillTypes: {
    [key in DrillType]?: {
      attempts: number;
      correct: number;
      averageTime: number;
    }
  };
}

export interface EvaluationResult {
  grammarScore: number;
  naturalnessScore: number;
  wordUsageScore: number;
  overallScore: number;
  feedback: string;
  suggestions: string[];
}

export interface WordProgress {
  wordId: string;
  difficulty: number;
  interval: number;
  repetition: number;
  nextReview: Date;
  easinessFactor: number;
} 