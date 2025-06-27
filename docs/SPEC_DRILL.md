# Drill 기능 구현 스펙

## 🎯 개요

PLAN.md를 기반으로 추가된 단어 중심의 drill 기능을 구현합니다. 사용자가 탐색한 단어들을 다양한 방식으로 반복 학습할 수 있는 시스템입니다.

## 📊 기존 프로젝트 구조 분석

### 현재 구조
- **types/index.ts**: WordNode, RelationshipType, LanguageSettings 등 타입 정의
- **services/llmService.ts**: LLM API 호출 및 단어 확장 기능
- **components/**: WordList, NetworkGraph, LanguageSettings 컴포넌트
- **App.tsx**: 메인 앱 로직 (단어 추가, 확장 등)

### 기존 데이터 구조
```typescript
interface WordNode {
  id: string;
  word: string;
  definition: string;
  example: string;
  frequency: number;
  category: string;
  expandedFrom?: {
    originalWord: string;
    relationship: RelationshipType;
  };
}
```

## 🧩 1. 반복 노출형 (Repetitive Exposure) Drills

### 1.1 뜻 맞히기 (Definition Matching)

#### 알고리즘
1. 사용자가 추가한 단어들 중 랜덤 선택
2. 정답 단어의 definition 표시
3. 4개 선택지 제공 (정답 1개 + 오답 3개)
4. 오답은 같은 카테고리나 비슷한 frequency의 단어들에서 선택

#### 구현 위치
```
src/
├── components/
│   └── drill/
│       ├── DefinitionMatching.tsx
│       ├── DrillContainer.tsx
│       └── DrillNavigation.tsx
├── services/
│   └── drillService.ts
└── types/
    └── drill.ts
```

#### 코드 샘플
```typescript
// types/drill.ts
export interface DrillQuestion {
  id: string;
  type: DrillType;
  targetWord: WordNode;
  options: string[];
  correctAnswer: string;
  timeLimit?: number;
}

export interface DrillSession {
  id: string;
  type: DrillType;
  questions: DrillQuestion[];
  currentQuestionIndex: number;
  score: number;
  startTime: Date;
  endTime?: Date;
}

// services/drillService.ts
export class DrillService {
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
}

// components/drill/DefinitionMatching.tsx
const DefinitionMatching: React.FC<{
  question: DrillQuestion;
  onAnswer: (answer: string) => void;
}> = ({ question, onAnswer }) => {
  return (
    <QuestionContainer>
      <DefinitionText>{question.targetWord.definition}</DefinitionText>
      <OptionsGrid>
        {question.options.map(option => (
          <OptionButton
            key={option}
            onClick={() => onAnswer(option)}
          >
            {option}
          </OptionButton>
        ))}
      </OptionsGrid>
    </QuestionContainer>
  );
};
```

### 1.2 뜻 → 단어 (Word Recall)

#### 알고리즘
1. 단어의 definition을 보여주고 단어를 입력받음
2. 부분 일치, 대소문자 무시하여 정답 판별
3. 힌트 시스템 (첫 글자, 글자 수 등)

#### 구현
```typescript
// components/drill/WordRecall.tsx
const WordRecall: React.FC<{
  question: DrillQuestion;
  onAnswer: (answer: string) => void;
}> = ({ question, onAnswer }) => {
  const [userInput, setUserInput] = useState('');
  const [hintsUsed, setHintsUsed] = useState(0);
  
  const checkAnswer = (input: string) => {
    const normalized = input.toLowerCase().trim();
    const correct = question.correctAnswer.toLowerCase();
    return normalized === correct || 
           // 부분 일치도 허용 (편집 거리 기반)
           levenshteinDistance(normalized, correct) <= 1;
  };
  
  const getHint = () => {
    const word = question.correctAnswer;
    switch(hintsUsed) {
      case 0: return `${word.length} letters`;
      case 1: return `Starts with "${word[0]}"`;
      case 2: return `${word[0]}${'_'.repeat(word.length-2)}${word[word.length-1]}`;
      default: return word;
    }
  };
  
  return (
    <QuestionContainer>
      <DefinitionText>{question.targetWord.definition}</DefinitionText>
      <ExampleText>"{question.targetWord.example}"</ExampleText>
      <InputField
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onAnswer(userInput)}
        placeholder="Type the word..."
      />
      <HintButton onClick={() => setHintsUsed(h => h + 1)}>
        Hint ({3 - hintsUsed} left): {getHint()}
      </HintButton>
    </QuestionContainer>
  );
};
```

### 1.3 듣고 고르기 (Audio Recognition)

#### 알고리즘
1. Web Speech API 또는 Text-to-Speech로 단어 발음 재생
2. 시각적 옵션 제공하여 선택
3. 발음 속도 조절 기능

#### 구현
```typescript
// services/speechService.ts
export class SpeechService {
  private static synthesis = window.speechSynthesis;
  
  static speak(text: string, language: string = 'en-US', rate: number = 0.8) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    this.synthesis.speak(utterance);
  }
  
  static getVoices(language: string) {
    return this.synthesis.getVoices().filter(voice => 
      voice.lang.startsWith(language.split('-')[0])
    );
  }
}

// components/drill/AudioRecognition.tsx
const AudioRecognition: React.FC<{
  question: DrillQuestion;
  onAnswer: (answer: string) => void;
}> = ({ question, onAnswer }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(0.8);
  
  const playAudio = () => {
    setIsPlaying(true);
    SpeechService.speak(question.correctAnswer, 'en-US', playbackRate);
    setTimeout(() => setIsPlaying(false), 2000);
  };
  
  return (
    <QuestionContainer>
      <AudioControls>
        <PlayButton onClick={playAudio} disabled={isPlaying}>
          {isPlaying ? '🔊 Playing...' : '▶️ Listen'}
        </PlayButton>
        <SpeedControl>
          <label>Speed: {playbackRate}x</label>
          <input 
            type="range" 
            min="0.5" 
            max="1.5" 
            step="0.1"
            value={playbackRate}
            onChange={(e) => setPlaybackRate(Number(e.target.value))}
          />
        </SpeedControl>
      </AudioControls>
      <OptionsGrid>
        {question.options.map(option => (
          <OptionButton key={option} onClick={() => onAnswer(option)}>
            {option}
          </OptionButton>
        ))}
      </OptionsGrid>
    </QuestionContainer>
  );
};
```

## 🧠 2. 기억 회상형 (Memory Recall) Drills

### 2.1 빈칸 예문 채우기 (Fill in the Blank)

#### 알고리즘
1. 단어의 example에서 해당 단어를 빈칸으로 처리
2. 문맥상 유의미한 단어들을 추가 선택지로 제공
3. 문장 구조 분석하여 품사 일치하는 오답 생성

#### 구현
```typescript
// services/sentenceService.ts
export class SentenceService {
  static createFillInBlank(word: WordNode, relatedWords: WordNode[]): DrillQuestion {
    const sentence = word.example;
    const wordRegex = new RegExp(`\\b${word.word}\\b`, 'gi');
    const blankedSentence = sentence.replace(wordRegex, '_____');
    
    const distractors = relatedWords
      .filter(w => this.isSamePartOfSpeech(w.word, word.word))
      .slice(0, 3);
    
    return {
      id: `fill_${word.id}_${Date.now()}`,
      type: 'fill-in-blank',
      targetWord: word,
      options: this.shuffleArray([
        word.word,
        ...distractors.map(d => d.word)
      ]),
      correctAnswer: word.word,
      context: blankedSentence
    };
  }
  
  private static isSamePartOfSpeech(word1: string, word2: string): boolean {
    // 간단한 품사 추론 (실제로는 NLP 라이브러리 사용 권장)
    const patterns = {
      verb: /ing$|ed$|s$/,
      adjective: /ly$|ful$|less$/,
      noun: /ion$|ness$/
    };
    
    for (const [pos, pattern] of Object.entries(patterns)) {
      if (pattern.test(word1) && pattern.test(word2)) return true;
    }
    return false;
  }
}
```

### 2.2 리콜 모드 (Spaced Repetition)

#### 알고리즘 - SM-2 기반 간격 반복
1. 각 단어마다 difficulty, interval, repetition 값 추적
2. 정답률에 따라 다음 출현 간격 조정
3. 망각 곡선을 고려한 최적 타이밍 계산

#### 구현
```typescript
// services/spacedRepetitionService.ts
interface WordProgress {
  wordId: string;
  difficulty: number; // 1.3 ~ 2.5
  interval: number; // days
  repetition: number;
  nextReview: Date;
  easinessFactor: number; // 2.5 기본값
}

export class SpacedRepetitionService {
  private static readonly MIN_EF = 1.3;
  private static readonly DEFAULT_EF = 2.5;
  
  static calculateNextReview(
    progress: WordProgress, 
    responseQuality: number // 0-5 scale
  ): WordProgress {
    const { difficulty, interval, repetition, easinessFactor } = progress;
    
    // SM-2 알고리즘 적용
    let newEF = easinessFactor + (0.1 - (5 - responseQuality) * (0.08 + (5 - responseQuality) * 0.02));
    newEF = Math.max(newEF, this.MIN_EF);
    
    let newInterval: number;
    let newRepetition: number;
    
    if (responseQuality < 3) {
      // 틀린 경우 - 처음부터 시작
      newInterval = 1;
      newRepetition = 0;
    } else {
      newRepetition = repetition + 1;
      if (newRepetition === 1) {
        newInterval = 1;
      } else if (newRepetition === 2) {
        newInterval = 6;
      } else {
        newInterval = Math.round(interval * newEF);
      }
    }
    
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + newInterval);
    
    return {
      ...progress,
      easinessFactor: newEF,
      interval: newInterval,
      repetition: newRepetition,
      nextReview
    };
  }
  
  static getWordsForReview(allProgress: WordProgress[]): WordProgress[] {
    const now = new Date();
    return allProgress
      .filter(p => p.nextReview <= now)
      .sort((a, b) => a.nextReview.getTime() - b.nextReview.getTime());
  }
}
```

## 🎨 3. 창의 적용형 (Creative Application) Drills

### 3.1 나만의 예문 만들기 (Custom Sentence Creation)

#### 알고리즘
1. 사용자가 단어를 사용해 새로운 예문 작성
2. LLM API로 문법 검사 및 자연스러움 평가
3. 피드백 및 개선 제안 제공

#### 구현
```typescript
// services/sentenceEvaluationService.ts
export class SentenceEvaluationService {
  static async evaluateSentence(
    sentence: string, 
    targetWord: string, 
    languageSettings: LanguageSettings
  ): Promise<EvaluationResult> {
    const prompt = `
Evaluate this sentence for grammar, naturalness, and proper usage of the word "${targetWord}":

Sentence: "${sentence}"
Target word: "${targetWord}"

Please provide:
1. Grammar score (0-10)
2. Naturalness score (0-10)
3. Word usage correctness (0-10)
4. Specific feedback
5. Improvement suggestions

Respond in JSON format:
{
  "grammarScore": number,
  "naturalnessScore": number,
  "wordUsageScore": number,
  "overallScore": number,
  "feedback": "string",
  "suggestions": ["string"]
}
    `;
    
    // LLM API 호출 로직
    const response = await llmService.evaluateText(prompt, languageSettings);
    return JSON.parse(response);
  }
}

// components/drill/SentenceCreation.tsx
const SentenceCreation: React.FC<{
  targetWord: WordNode;
  onComplete: (result: any) => void;
}> = ({ targetWord, onComplete }) => {
  const [userSentence, setUserSentence] = useState('');
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  const handleSubmit = async () => {
    if (!userSentence.includes(targetWord.word)) {
      alert(`Please include the word "${targetWord.word}" in your sentence.`);
      return;
    }
    
    setIsEvaluating(true);
    try {
      const result = await SentenceEvaluationService.evaluateSentence(
        userSentence, 
        targetWord.word, 
        languageSettings
      );
      setEvaluation(result);
    } catch (error) {
      console.error('Evaluation failed:', error);
    } finally {
      setIsEvaluating(false);
    }
  };
  
  return (
    <CreationContainer>
      <WordPrompt>
        Create a sentence using: <HighlightWord>{targetWord.word}</HighlightWord>
      </WordPrompt>
      <DefinitionHint>Definition: {targetWord.definition}</DefinitionHint>
      
      <SentenceInput
        value={userSentence}
        onChange={(e) => setUserSentence(e.target.value)}
        placeholder={`Write a sentence using "${targetWord.word}"...`}
        rows={3}
      />
      
      <SubmitButton 
        onClick={handleSubmit} 
        disabled={!userSentence || isEvaluating}
      >
        {isEvaluating ? 'Evaluating...' : 'Submit'}
      </SubmitButton>
      
      {evaluation && (
        <EvaluationResult>
          <ScoreDisplay>
            Overall Score: {evaluation.overallScore}/10
          </ScoreDisplay>
          <FeedbackText>{evaluation.feedback}</FeedbackText>
          {evaluation.suggestions.map((suggestion, index) => (
            <SuggestionItem key={index}>{suggestion}</SuggestionItem>
          ))}
        </EvaluationResult>
      )}
    </CreationContainer>
  );
};
```

## 🎵 4. 리듬/감각형 (Rhythmic/Sensory) Drills

### 4.1 음성 따라 말하기 (Speech Shadowing)

#### 알고리즘
1. Web Speech Recognition API로 음성 인식
2. 발음 유사도 비교 (음성학적 거리 계산)
3. 실시간 피드백 제공

#### 구현
```typescript
// services/speechRecognitionService.ts
export class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  
  constructor() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
    }
  }
  
  async startListening(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }
      
      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };
      
      this.recognition.onerror = reject;
      this.recognition.start();
    });
  }
  
  static calculatePronunciationScore(
    target: string, 
    spoken: string
  ): number {
    // 간단한 음성 유사도 계산 (실제로는 음성학적 알고리즘 필요)
    const similarity = this.stringSimilarity(
      target.toLowerCase(), 
      spoken.toLowerCase()
    );
    return Math.round(similarity * 100);
  }
  
  private static stringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }
}
```

## 📱 5. Drill UI/UX 구조

### 5.1 메인 Drill 인터페이스

#### 구현
```typescript
// components/drill/DrillContainer.tsx
const DrillContainer: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<DrillSession | null>(null);
  const [availableWords, setAvailableWords] = useState<WordNode[]>([]);
  const [drillType, setDrillType] = useState<DrillType>('definition-matching');
  
  const startDrill = (type: DrillType, wordCount: number = 10) => {
    const words = DrillService.selectWordsForDrill(availableWords, wordCount);
    const questions = DrillService.generateQuestions(type, words);
    
    const session: DrillSession = {
      id: `session_${Date.now()}`,
      type,
      questions,
      currentQuestionIndex: 0,
      score: 0,
      startTime: new Date()
    };
    
    setCurrentSession(session);
  };
  
  return (
    <DrillInterface>
      {!currentSession ? (
        <DrillSelector onStart={startDrill} />
      ) : (
        <ActiveDrill session={currentSession} onComplete={handleDrillComplete} />
      )}
    </DrillInterface>
  );
};

// App.tsx에 추가할 모드 전환
const App = () => {
  const [mode, setMode] = useState<'explore' | 'drill'>('explore');
  
  return (
    <AppContainer>
      <Header>
        <ModeToggle>
          <ModeButton 
            active={mode === 'explore'} 
            onClick={() => setMode('explore')}
          >
            Explore
          </ModeButton>
          <ModeButton 
            active={mode === 'drill'} 
            onClick={() => setMode('drill')}
          >
            Drill
          </ModeButton>
        </ModeToggle>
      </Header>
      
      {mode === 'explore' ? (
        <ExploreMode />
      ) : (
        <DrillContainer />
      )}
    </AppContainer>
  );
};
```

## 💾 6. 데이터 저장 및 진행 상황 추적

### 6.1 로컬 스토리지 스키마

```typescript
// services/storageService.ts
interface DrillProgress {
  wordId: string;
  totalAttempts: number;
  correctAttempts: number;
  lastAttempt: Date;
  difficulty: number;
  drillTypes: {
    [key in DrillType]: {
      attempts: number;
      correct: number;
      averageTime: number;
    }
  };
}

export class StorageService {
  private static readonly STORAGE_KEYS = {
    DRILL_PROGRESS: 'drill_progress',
    DRILL_HISTORY: 'drill_history',
    WORDS: 'vocabulary_words'
  };
  
  static saveDrillProgress(progress: DrillProgress[]): void {
    localStorage.setItem(
      this.STORAGE_KEYS.DRILL_PROGRESS, 
      JSON.stringify(progress)
    );
  }
  
  static loadDrillProgress(): DrillProgress[] {
    const data = localStorage.getItem(this.STORAGE_KEYS.DRILL_PROGRESS);
    return data ? JSON.parse(data) : [];
  }
  
  static updateWordProgress(
    wordId: string, 
    drillType: DrillType, 
    isCorrect: boolean, 
    timeSpent: number
  ): void {
    const progress = this.loadDrillProgress();
    let wordProgress = progress.find(p => p.wordId === wordId);
    
    if (!wordProgress) {
      wordProgress = {
        wordId,
        totalAttempts: 0,
        correctAttempts: 0,
        lastAttempt: new Date(),
        difficulty: 2.5,
        drillTypes: {} as any
      };
      progress.push(wordProgress);
    }
    
    // 진행 상황 업데이트 로직
    wordProgress.totalAttempts++;
    if (isCorrect) wordProgress.correctAttempts++;
    wordProgress.lastAttempt = new Date();
    
    if (!wordProgress.drillTypes[drillType]) {
      wordProgress.drillTypes[drillType] = { attempts: 0, correct: 0, averageTime: 0 };
    }
    
    const drillProgress = wordProgress.drillTypes[drillType];
    drillProgress.attempts++;
    if (isCorrect) drillProgress.correct++;
    drillProgress.averageTime = (drillProgress.averageTime * (drillProgress.attempts - 1) + timeSpent) / drillProgress.attempts;
    
    this.saveDrillProgress(progress);
  }
}
```

## 🚀 7. 구현 우선순위 및 다음 단계

### Phase 1 (MVP)
1. ✅ 기본 타입 정의 (`types/drill.ts`)
2. ✅ DrillService 핵심 로직 (`services/drillService.ts`)
3. ✅ 뜻 맞히기 컴포넌트 (`components/drill/DefinitionMatching.tsx`)
4. ✅ 기본 Drill Container (`components/drill/DrillContainer.tsx`)

### Phase 2 (확장)
1. 빈칸 채우기 및 단어 회상 기능
2. 음성 인식 및 TTS 기능
3. 간격 반복 알고리즘 적용
4. 진행 상황 시각화

### Phase 3 (고도화)
1. LLM 기반 예문 평가
2. 개인화된 난이도 조절
3. 소셜 기능 (점수 공유 등)
4. 오프라인 모드 지원

### 구현 시작 명령어
```bash
# Phase 1 파일 구조 생성
mkdir -p src/components/drill
mkdir -p src/services
touch src/types/drill.ts
touch src/services/drillService.ts
touch src/components/drill/DrillContainer.tsx
touch src/components/drill/DefinitionMatching.tsx
```

이제 이 스펙을 기반으로 각 Phase별로 구현을 진행할 수 있습니다. 