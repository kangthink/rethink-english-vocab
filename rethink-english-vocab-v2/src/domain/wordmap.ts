import { v4 as uuidv4 } from 'uuid';

export interface Word {
  word: string;
  definition: string;
  concept: string;
  examples: string[];
  reactions: string[];
  created_at: Date;
  updated_at: Date;
}

export interface Thread {
  name: string;
  words: Word[];
  created_at: Date;
  updated_at: Date;
}

export interface ComparisonResult {
  commonalities: string[];
  analysis: string;
}

export interface ContrastResult {
  differences: string[];
  analysis: string;
}

export type ExpandType = 'synonym' | 'antonym' | 'context';

export interface WordMapAggregateInterface {
  readonly id: string;
  readonly user_id: string;
  
  word_count(): number;
  thread_count(): number;
  words(page: number, size: number): Promise<Word[]>;
  threads(page: number, size: number): Promise<Thread[]>;
  search(word: string): Promise<Word[]>;
  
  expand(word: string, type: ExpandType): Promise<Word[]>;
  compare(word1: string, word2: string): Promise<ComparisonResult>;
  contrast(word1: string, word2: string): Promise<ContrastResult>;
  
  addWord(word: Word): void;
  addThread(thread: Thread): void;
  updateWord(wordToUpdate: string, updatedWord: Word): void;
  removeWord(word: string): void;
}

export class WordMapAggregate implements WordMapAggregateInterface {
  public readonly id: string;
  public readonly user_id: string;
  private _words: Word[] = [];
  private _threads: Thread[] = [];

  constructor(user_id: string, id?: string) {
    this.id = id || uuidv4();
    this.user_id = user_id;
  }

  word_count(): number {
    return this._words.length;
  }

  thread_count(): number {
    return this._threads.length;
  }

  async words(page: number, size: number): Promise<Word[]> {
    const start = page * size;
    const end = start + size;
    return this._words.slice(start, end);
  }

  async threads(page: number, size: number): Promise<Thread[]> {
    const start = page * size;
    const end = start + size;
    return this._threads.slice(start, end);
  }

  async search(word: string): Promise<Word[]> {
    return this._words.filter(w => 
      w.word.toLowerCase().includes(word.toLowerCase()) ||
      w.definition.toLowerCase().includes(word.toLowerCase()) ||
      w.concept.toLowerCase().includes(word.toLowerCase())
    );
  }

  async expand(word: string, type: ExpandType): Promise<Word[]> {
    throw new Error('Expand method requires AI service implementation');
  }

  async compare(word1: string, word2: string): Promise<ComparisonResult> {
    throw new Error('Compare method requires AI service implementation');
  }

  async contrast(word1: string, word2: string): Promise<ContrastResult> {
    throw new Error('Contrast method requires AI service implementation');
  }

  addWord(word: Word): void {
    this._words.push(word);
  }

  addThread(thread: Thread): void {
    this._threads.push(thread);
  }

  updateWord(wordToUpdate: string, updatedWord: Word): void {
    const index = this._words.findIndex(w => w.word === wordToUpdate);
    if (index !== -1) {
      this._words[index] = updatedWord;
    }
  }

  removeWord(word: string): void {
    this._words = this._words.filter(w => w.word !== word);
  }

  getAllWords(): Word[] {
    return [...this._words];
  }

  getAllThreads(): Thread[] {
    return [...this._threads];
  }
}