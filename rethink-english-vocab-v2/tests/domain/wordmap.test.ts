import { describe, it, expect, beforeEach } from 'bun:test';
import { WordMapAggregate, Word, Thread } from '../../src/domain/wordmap.js';

describe('WordMapAggregate', () => {
  let wordMap: WordMapAggregate;
  let sampleWord: Word;
  let sampleThread: Thread;

  beforeEach(() => {
    wordMap = new WordMapAggregate('user-123');
    sampleWord = {
      word: 'test',
      definition: 'a procedure to check something',
      concept: 'verification',
      examples: ['This is a test', 'Run the test'],
      reactions: ['👍', '💡'],
      created_at: new Date(),
      updated_at: new Date(),
    };
    sampleThread = {
      name: 'Programming Terms',
      words: [sampleWord],
      created_at: new Date(),
      updated_at: new Date(),
    };
  });

  describe('constructor', () => {
    it('should create WordMapAggregate with generated id', () => {
      expect(wordMap.id).toBeDefined();
      expect(wordMap.user_id).toBe('user-123');
    });

    it('should create WordMapAggregate with provided id', () => {
      const customId = 'custom-id';
      const customWordMap = new WordMapAggregate('user-123', customId);
      expect(customWordMap.id).toBe(customId);
    });
  });

  describe('word management', () => {
    it('should add word', () => {
      wordMap.addWord(sampleWord);
      expect(wordMap.word_count()).toBe(1);
    });

    it('should update word', () => {
      wordMap.addWord(sampleWord);
      const updatedWord = { ...sampleWord, definition: 'updated definition' };
      wordMap.updateWord('test', updatedWord);
      
      const words = wordMap.getAllWords();
      expect(words[0].definition).toBe('updated definition');
    });

    it('should remove word', () => {
      wordMap.addWord(sampleWord);
      wordMap.removeWord('test');
      expect(wordMap.word_count()).toBe(0);
    });

    it('should get words with pagination', async () => {
      const words = ['test1', 'test2', 'test3'].map(word => ({
        ...sampleWord,
        word,
      }));
      
      words.forEach(word => wordMap.addWord(word));
      
      const page1 = await wordMap.words(0, 2);
      expect(page1.length).toBe(2);
      
      const page2 = await wordMap.words(1, 2);
      expect(page2.length).toBe(1);
    });
  });

  describe('thread management', () => {
    it('should add thread', () => {
      wordMap.addThread(sampleThread);
      expect(wordMap.thread_count()).toBe(1);
    });

    it('should get threads with pagination', async () => {
      const threads = ['Thread1', 'Thread2', 'Thread3'].map(name => ({
        ...sampleThread,
        name,
      }));
      
      threads.forEach(thread => wordMap.addThread(thread));
      
      const page1 = await wordMap.threads(0, 2);
      expect(page1.length).toBe(2);
      
      const page2 = await wordMap.threads(1, 2);
      expect(page2.length).toBe(1);
    });
  });

  describe('search functionality', () => {
    beforeEach(() => {
      const words = [
        { ...sampleWord, word: 'javascript', definition: 'programming language' },
        { ...sampleWord, word: 'typescript', definition: 'superset of javascript' },
        { ...sampleWord, word: 'python', definition: 'high-level programming language' },
      ];
      words.forEach(word => wordMap.addWord(word));
    });

    it('should search words by word name', async () => {
      const results = await wordMap.search('script');
      expect(results.length).toBe(2);
      expect(results.map(r => r.word)).toEqual(['javascript', 'typescript']);
    });

    it('should search words by definition', async () => {
      const results = await wordMap.search('programming');
      expect(results.length).toBe(2);
    });

    it('should search words by concept', async () => {
      const conceptWord = { ...sampleWord, word: 'concept-test', concept: 'unique-concept' };
      wordMap.addWord(conceptWord);
      
      const results = await wordMap.search('unique-concept');
      expect(results.length).toBe(1);
      expect(results[0].word).toBe('concept-test');
    });

    it('should return empty array for no matches', async () => {
      const results = await wordMap.search('nonexistent');
      expect(results.length).toBe(0);
    });
  });

  describe('AI methods', () => {
    it('should throw error for expand method', async () => {
      expect(async () => {
        await wordMap.expand('test', 'synonym');
      }).toThrow('Expand method requires AI service implementation');
    });

    it('should throw error for compare method', async () => {
      expect(async () => {
        await wordMap.compare('test1', 'test2');
      }).toThrow('Compare method requires AI service implementation');
    });

    it('should throw error for contrast method', async () => {
      expect(async () => {
        await wordMap.contrast('test1', 'test2');
      }).toThrow('Contrast method requires AI service implementation');
    });
  });
});