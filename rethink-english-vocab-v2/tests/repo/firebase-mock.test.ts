import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { FirebaseWordMapRepository } from '../../src/repo/wordmapRepo.js';
import { FirebaseTrainingRepository } from '../../src/repo/trainingRepo.js';
import { WordMapAggregate, Word } from '../../src/domain/wordmap.js';
import { TrainingAggregate, TrainingKind } from '../../src/domain/training.js';

const mockFirestore = {
  collection: mock(() => ({})),
  doc: mock(() => ({})),
  getDoc: mock(() => ({ exists: () => false })),
  getDocs: mock(() => ({ docs: [] })),
  setDoc: mock(() => Promise.resolve()),
  deleteDoc: mock(() => Promise.resolve()),
  query: mock(() => ({})),
  where: mock(() => ({})),
};

describe('Firebase Repository Structure Tests', () => {
  let wordMapRepo: FirebaseWordMapRepository;
  let trainingRepo: FirebaseTrainingRepository;

  beforeEach(() => {
    wordMapRepo = new FirebaseWordMapRepository(mockFirestore as any);
    trainingRepo = new FirebaseTrainingRepository(mockFirestore as any);
  });

  describe('Repository instantiation', () => {
    it('should create Firebase WordMapRepository', () => {
      expect(wordMapRepo).toBeDefined();
      expect(wordMapRepo).toBeInstanceOf(FirebaseWordMapRepository);
    });

    it('should create Firebase TrainingRepository', () => {
      expect(trainingRepo).toBeDefined();
      expect(trainingRepo).toBeInstanceOf(FirebaseTrainingRepository);
    });
  });

  describe('Method signatures', () => {
    it('should have all required WordMapRepository methods', () => {
      expect(typeof wordMapRepo.findById).toBe('function');
      expect(typeof wordMapRepo.findByUserId).toBe('function');
      expect(typeof wordMapRepo.save).toBe('function');
      expect(typeof wordMapRepo.delete).toBe('function');
    });

    it('should have all required TrainingRepository methods', () => {
      expect(typeof trainingRepo.findById).toBe('function');
      expect(typeof trainingRepo.findByUserId).toBe('function');
      expect(typeof trainingRepo.save).toBe('function');
      expect(typeof trainingRepo.delete).toBe('function');
    });
  });

  describe('Domain model compatibility', () => {
    it('should work with WordMapAggregate', () => {
      const wordMap = new WordMapAggregate('test-user');
      const word: Word = {
        word: 'test',
        definition: 'a test word',
        concept: 'testing',
        examples: ['This is a test'],
        reactions: ['👍'],
        created_at: new Date(),
        updated_at: new Date(),
      };
      
      wordMap.addWord(word);
      
      expect(wordMap.word_count()).toBe(1);
      expect(wordMap.getAllWords()).toHaveLength(1);
    });

    it('should work with TrainingAggregate', () => {
      const training = new TrainingAggregate('test-user');
      const kind: TrainingKind = {
        id: 'test-kind',
        name: 'Test Kind',
        description: 'A test training kind',
        created_at: new Date(),
        updated_at: new Date(),
      };
      
      training.addTrainingKind(kind);
      
      expect(training.trainingKinds()).toHaveLength(1);
    });
  });

  describe('Error handling structure', () => {
    it('should handle Firebase errors gracefully', async () => {
      const errorFirestore = {
        ...mockFirestore,
        getDoc: mock(() => Promise.reject(new Error('Network error'))),
      };
      
      const errorRepo = new FirebaseWordMapRepository(errorFirestore as any);
      
      await expect(errorRepo.findById('test-id')).rejects.toThrow();
    });
  });
});