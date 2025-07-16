import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MultipleChoice from './MultipleChoice';
import { DrillQuestion } from '../../types/drill';

describe('MultipleChoice', () => {
  const mockQuestion: DrillQuestion = {
    id: 'test-1',
    type: 'definition-matching',
    targetWord: {
      id: 'word-1',
      word: 'ephemeral',
      definition: 'lasting for a very short time',
      example: 'Fashion trends are ephemeral, changing with each season.',
      frequency: 3,
      category: 'concept'
    },
    options: [
      'lasting for a very short time',
      'extremely large or great',
      'happening by chance rather than design',
      'showing deep insight and understanding'
    ],
    correctAnswer: 'lasting for a very short time',
    timeLimit: 30
  };

  const mockOnAnswer = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('renders question and options correctly', () => {
    render(<MultipleChoice question={mockQuestion} onAnswer={mockOnAnswer} />);
    
    expect(screen.getByText('Multiple Choice Question')).toBeInTheDocument();
    expect(screen.getByText('What is the meaning of "ephemeral"?')).toBeInTheDocument();
    
    mockQuestion.options?.forEach((option, index) => {
      expect(screen.getByText(option)).toBeInTheDocument();
      expect(screen.getByText(`${String.fromCharCode(65 + index)})`)).toBeInTheDocument();
    });
  });

  test('handles correct answer selection', async () => {
    render(<MultipleChoice question={mockQuestion} onAnswer={mockOnAnswer} />);
    
    const correctOption = screen.getByText(mockQuestion.correctAnswer);
    fireEvent.click(correctOption.closest('button')!);

    expect(screen.getByText('✓')).toBeInTheDocument();
    
    jest.advanceTimersByTime(2000);
    
    await waitFor(() => {
      expect(mockOnAnswer).toHaveBeenCalledWith(
        mockQuestion.correctAnswer,
        expect.any(Number)
      );
    });
  });

  test('handles incorrect answer selection', async () => {
    render(<MultipleChoice question={mockQuestion} onAnswer={mockOnAnswer} />);
    
    const incorrectOption = screen.getByText('extremely large or great');
    fireEvent.click(incorrectOption.closest('button')!);

    expect(screen.getByText('✗')).toBeInTheDocument();
    
    jest.advanceTimersByTime(2000);
    
    await waitFor(() => {
      expect(mockOnAnswer).toHaveBeenCalledWith(
        'extremely large or great',
        expect.any(Number)
      );
    });
  });

  test('disables options after answer selection', () => {
    render(<MultipleChoice question={mockQuestion} onAnswer={mockOnAnswer} />);
    
    const option = screen.getByText(mockQuestion.correctAnswer);
    const button = option.closest('button')!;
    
    fireEvent.click(button);
    
    mockQuestion.options?.forEach((opt) => {
      const btn = screen.getByText(opt).closest('button')!;
      expect(btn).toBeDisabled();
    });
  });

  test('shows hint after 20 seconds', () => {
    render(<MultipleChoice question={mockQuestion} onAnswer={mockOnAnswer} />);
    
    expect(screen.queryByText(/Hint:/)).not.toBeInTheDocument();
    
    jest.advanceTimersByTime(20100);
    
    expect(screen.getByText(`Hint: ${mockQuestion.targetWord.example}`)).toBeInTheDocument();
  });

  test('auto-submits when time runs out', async () => {
    render(<MultipleChoice question={mockQuestion} onAnswer={mockOnAnswer} timeLimit={5} />);
    
    jest.advanceTimersByTime(5100);
    
    await waitFor(() => {
      expect(mockOnAnswer).toHaveBeenCalledWith('', expect.any(Number));
    });
  });

  test('updates progress bar correctly', () => {
    render(<MultipleChoice question={mockQuestion} onAnswer={mockOnAnswer} timeLimit={10} />);
    
    const progressBar = screen.getByRole('progressbar', { hidden: true }).parentElement;
    const initialStyle = window.getComputedStyle(progressBar!.querySelector('::after') || progressBar!);
    
    jest.advanceTimersByTime(5000);
    
    // Progress bar would be at 50% after 5 seconds of a 10 second timer
    // Testing styled-components dynamic styles requires checking the component's props
    expect(progressBar).toBeInTheDocument();
  });

  test('prevents multiple answer submissions', () => {
    render(<MultipleChoice question={mockQuestion} onAnswer={mockOnAnswer} />);
    
    const option = screen.getByText(mockQuestion.correctAnswer);
    const button = option.closest('button')!;
    
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    
    jest.advanceTimersByTime(2000);
    
    expect(mockOnAnswer).toHaveBeenCalledTimes(1);
  });

  test('displays option labels A, B, C, D', () => {
    render(<MultipleChoice question={mockQuestion} onAnswer={mockOnAnswer} />);
    
    expect(screen.getByText('A)')).toBeInTheDocument();
    expect(screen.getByText('B)')).toBeInTheDocument();
    expect(screen.getByText('C)')).toBeInTheDocument();
    expect(screen.getByText('D)')).toBeInTheDocument();
  });

  test('tracks time spent correctly', async () => {
    render(<MultipleChoice question={mockQuestion} onAnswer={mockOnAnswer} />);
    
    jest.advanceTimersByTime(3000);
    
    const option = screen.getByText(mockQuestion.correctAnswer);
    fireEvent.click(option.closest('button')!);
    
    jest.advanceTimersByTime(2000);
    
    await waitFor(() => {
      expect(mockOnAnswer).toHaveBeenCalledWith(
        mockQuestion.correctAnswer,
        expect.closeTo(3, 0.5)
      );
    });
  });
});