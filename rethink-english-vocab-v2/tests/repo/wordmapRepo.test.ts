import { describe, it, expect, beforeEach } from 'bun:test';
import { FirebaseWordMapRepository } from '../../src/repo/wordmapRepo.js';
import { WordMapAggregate, Word } from '../../src/domain/wordmap.js';
import { createFirebaseService, defaultFirebaseConfig } from '../../src/infra/firebase.js';

describe('FirebaseWordMapRepository', () => {
  let repository: FirebaseWordMapRepository;
  let wordMap: WordMapAggregate;
  let sampleWord: Word;

  beforeEach(() => {
    const firebaseService = createFirebaseService(defaultFirebaseConfig);
    repository = new FirebaseWordMapRepository(firebaseService.getFirestore());
    
    wordMap = new WordMapAggregate('test-user-123');
    sampleWord = {
      word: 'firebase',
      definition: 'a backend-as-a-service platform',
      concept: 'cloud service',
      examples: ['Firebase provides authentication', 'Store data in Firebase'],
      reactions: ['🔥', '⚡'],
      created_at: new Date(),
      updated_at: new Date(),
    };
    
    wordMap.addWord(sampleWord);
  });

  describe('save and findById', () => {
    it('should save and retrieve WordMap', async () => {
      await repository.save(wordMap);
      
      const retrieved = await repository.findById(wordMap.id);
      
      expect(retrieved).not.toBeNull();
      expect(retrieved!.id).toBe(wordMap.id);
      expect(retrieved!.user_id).toBe(wordMap.user_id);
      expect(retrieved!.word_count()).toBe(1);
      
      const words = retrieved!.getAllWords();
      expect(words[0].word).toBe('firebase');
      expect(words[0].definition).toBe('a backend-as-a-service platform');
    });

    it('should return null for non-existent WordMap', async () => {
      const retrieved = await repository.findById('non-existent-id');
      expect(retrieved).toBeNull();
    });
  });

  describe('findByUserId', () => {
    it('should find WordMaps by user ID', async () => {
      await repository.save(wordMap);
      
      const wordMap2 = new WordMapAggregate('test-user-123');
      wordMap2.addWord({
        ...sampleWord,
        word: 'typescript',
        definition: 'typed superset of JavaScript',
      });
      await repository.save(wordMap2);
      
      const results = await repository.findByUserId('test-user-123');
      
      expect(results.length).toBe(2);
      expect(results.every(wm => wm.user_id === 'test-user-123')).toBe(true);
    });

    it('should return empty array for user with no WordMaps', async () => {
      const results = await repository.findByUserId('non-existent-user');
      expect(results).toEqual([]);
    });
  });

  describe('delete', () => {
    it('should delete WordMap', async () => {
      await repository.save(wordMap);
      
      const retrieved = await repository.findById(wordMap.id);
      expect(retrieved).not.toBeNull();
      
      await repository.delete(wordMap.id);
      
      const deletedWordMap = await repository.findById(wordMap.id);
      expect(deletedWordMap).toBeNull();
    });
  });

  describe('complex data handling', () => {
    it('should handle WordMap with threads', async () => {
      const thread = {
        name: 'Programming Terms',
        words: [sampleWord],
        created_at: new Date(),
        updated_at: new Date(),
      };
      
      wordMap.addThread(thread);
      await repository.save(wordMap);
      
      const retrieved = await repository.findById(wordMap.id);
      
      expect(retrieved!.thread_count()).toBe(1);
      const threads = retrieved!.getAllThreads();
      expect(threads[0].name).toBe('Programming Terms');
      expect(threads[0].words.length).toBe(1);
    });

    it('should handle WordMap with multiple words and reactions', async () => {
      const additionalWords = [
        {
          word: 'react',
          definition: 'JavaScript library for building user interfaces',
          concept: 'frontend framework',
          examples: ['React components', 'React hooks'],
          reactions: ['⚛️', '👍'],
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          word: 'node',
          definition: 'JavaScript runtime built on Chrome V8',
          concept: 'backend runtime',
          examples: ['Node.js server', 'npm packages'],
          reactions: ['🟢', '🚀'],
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];
      
      additionalWords.forEach(word => wordMap.addWord(word));
      await repository.save(wordMap);
      
      const retrieved = await repository.findById(wordMap.id);
      
      expect(retrieved!.word_count()).toBe(3);
      const words = retrieved!.getAllWords();
      expect(words.map(w => w.word)).toEqual(['firebase', 'react', 'node']);
    });
  });
});