import { WordNode } from '../types';
import { DrillQuestion, DrillType, DrillSession } from '../types/drill';

export class DrillService {
  /**
   * 주어진 단어들 중에서 drill용 단어를 선택
   */
  static selectWordsForDrill(allWords: WordNode[], count: number = 10): WordNode[] {
    if (allWords.length <= count) {
      return [...allWords];
    }

    // 빈도수와 카테고리를 고려한 선택 (최근 추가된 단어 우선)
    const sortedWords = allWords.sort((a, b) => {
      // 빈도수가 낮은 것 우선 (더 연습 필요)
      if (a.frequency !== b.frequency) {
        return a.frequency - b.frequency;
      }
      // 같은 빈도수면 랜덤
      return Math.random() - 0.5;
    });

    return sortedWords.slice(0, count);
  }

  /**
   * 특정 drill 타입에 맞는 질문들을 생성
   */
  static generateQuestions(type: DrillType, words: WordNode[]): DrillQuestion[] {
    switch (type) {
      case 'definition-matching':
        return words.map(word => this.generateDefinitionQuestion(word, words));
      case 'word-recall':
        return words.map(word => this.generateWordRecallQuestion(word));
      case 'multiple-choice':
        return words.map(word => this.generateMultipleChoiceQuestion(word, words));
      case 'fill-in-blank':
        return words.map(word => this.generateFillInBlankQuestion(word, words));
      default:
        return words.map(word => this.generateDefinitionQuestion(word, words));
    }
  }

  /**
   * 뜻 맞히기 질문 생성
   */
  static generateDefinitionQuestion(
    targetWord: WordNode, 
    allWords: WordNode[]
  ): DrillQuestion {
    const distractors = this.getDistractors(targetWord, allWords, 3);
    const options = this.shuffleArray([
      targetWord.word,
      ...distractors.map(w => w.word)
    ]);
    
    return {
      id: `def_${targetWord.id}_${Date.now()}`,
      type: 'definition-matching',
      targetWord,
      options,
      correctAnswer: targetWord.word
    };
  }

  /**
   * 단어 회상 질문 생성
   */
  static generateWordRecallQuestion(targetWord: WordNode): DrillQuestion {
    return {
      id: `recall_${targetWord.id}_${Date.now()}`,
      type: 'word-recall',
      targetWord,
      correctAnswer: targetWord.word
    };
  }

  /**
   * 객관식 질문 생성
   */
  static generateMultipleChoiceQuestion(
    targetWord: WordNode,
    allWords: WordNode[]
  ): DrillQuestion {
    const distractors = this.getDistractors(targetWord, allWords, 3);
    const options = this.shuffleArray([
      targetWord.definition,
      ...distractors.map(w => w.definition)
    ]);
    
    return {
      id: `mc_${targetWord.id}_${Date.now()}`,
      type: 'multiple-choice',
      targetWord,
      options,
      correctAnswer: targetWord.definition
    };
  }

  /**
   * 빈칸 채우기 질문 생성
   */
  static generateFillInBlankQuestion(
    targetWord: WordNode,
    allWords: WordNode[]
  ): DrillQuestion {
    const sentence = targetWord.example;
    const wordRegex = new RegExp(`\\b${targetWord.word}\\b`, 'gi');
    const blankedSentence = sentence.replace(wordRegex, '_____');
    
    const distractors = this.getDistractors(targetWord, allWords, 3);
    const options = this.shuffleArray([
      targetWord.word,
      ...distractors.map(d => d.word)
    ]);

    return {
      id: `fill_${targetWord.id}_${Date.now()}`,
      type: 'fill-in-blank',
      targetWord,
      options,
      correctAnswer: targetWord.word,
      context: blankedSentence
    };
  }

  /**
   * 오답 선택지 생성
   */
  private static getDistractors(
    target: WordNode, 
    wordPool: WordNode[], 
    count: number
  ): WordNode[] {
    return wordPool
      .filter(w => w.id !== target.id)
      .filter(w => w.category === target.category || 
                   Math.abs(w.frequency - target.frequency) < 20)
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
  }

  /**
   * 배열 섞기
   */
  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * 정답 확인 (대소문자 무시, 부분 일치 허용)
   */
  static checkAnswer(userAnswer: string, correctAnswer: string, strict: boolean = false): boolean {
    const normalized = userAnswer.toLowerCase().trim();
    const correct = correctAnswer.toLowerCase().trim();
    
    if (strict) {
      return normalized === correct;
    }
    
    // 부분 일치 허용 (편집 거리 기반)
    return normalized === correct || this.levenshteinDistance(normalized, correct) <= 1;
  }

  /**
   * 편집 거리 계산 (Levenshtein Distance)
   */
  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  /**
   * 힌트 생성
   */
  static generateHint(word: string, hintLevel: number): string {
    switch (hintLevel) {
      case 0:
        return `${word.length} letters`;
      case 1:
        return `Starts with "${word[0]}"`;
      case 2:
        return `${word[0]}${'_'.repeat(word.length - 2)}${word[word.length - 1]}`;
      case 3:
        return word.split('').map((char, index) => 
          index % 2 === 0 ? char : '_'
        ).join('');
      default:
        return word;
    }
  }
} 