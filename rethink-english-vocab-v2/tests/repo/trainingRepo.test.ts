import { describe, it, expect, beforeEach } from 'bun:test';
import { FirebaseTrainingRepository } from '../../src/repo/trainingRepo.js';
import { TrainingAggregate, TrainingKind, TrainingResult } from '../../src/domain/training.js';
import { createFirebaseService, defaultFirebaseConfig } from '../../src/infra/firebase.js';

describe('FirebaseTrainingRepository', () => {
  let repository: FirebaseTrainingRepository;
  let training: TrainingAggregate;
  let sampleTrainingKind: TrainingKind;
  let sampleTrainingResult: TrainingResult;

  beforeEach(() => {
    const firebaseService = createFirebaseService(defaultFirebaseConfig);
    repository = new FirebaseTrainingRepository(firebaseService.getFirestore());
    
    training = new TrainingAggregate('test-user-123');
    sampleTrainingKind = {
      id: 'vocab-quiz-1',
      name: 'Vocabulary Quiz',
      description: 'Test your vocabulary knowledge',
      created_at: new Date(),
      updated_at: new Date(),
    };
    
    sampleTrainingResult = {
      id: 'result-1',
      training_id: 'training-1',
      result: 'Score: 85% (17/20 correct)',
      created_at: new Date(),
      updated_at: new Date(),
    };
    
    training.addTrainingKind(sampleTrainingKind);
    training.addTrainingResult(sampleTrainingResult);
  });

  describe('save and findById', () => {
    it('should save and retrieve Training', async () => {
      await repository.save(training);
      
      const retrieved = await repository.findById(training.id);
      
      expect(retrieved).not.toBeNull();
      expect(retrieved!.id).toBe(training.id);
      expect(retrieved!.user_id).toBe(training.user_id);
      
      const trainingKinds = retrieved!.trainingKinds();
      expect(trainingKinds.length).toBe(1);
      expect(trainingKinds[0].name).toBe('Vocabulary Quiz');
      
      const trainingResults = retrieved!.trainingResults();
      expect(trainingResults.length).toBe(1);
      expect(trainingResults[0].result).toBe('Score: 85% (17/20 correct)');
    });

    it('should return null for non-existent Training', async () => {
      const retrieved = await repository.findById('non-existent-id');
      expect(retrieved).toBeNull();
    });
  });

  describe('findByUserId', () => {
    it('should find Trainings by user ID', async () => {
      await repository.save(training);
      
      const training2 = new TrainingAggregate('test-user-123');
      training2.addTrainingKind({
        ...sampleTrainingKind,
        id: 'spelling-quiz-1',
        name: 'Spelling Quiz',
      });
      await repository.save(training2);
      
      const results = await repository.findByUserId('test-user-123');
      
      expect(results.length).toBe(2);
      expect(results.every(t => t.user_id === 'test-user-123')).toBe(true);
    });

    it('should return empty array for user with no Trainings', async () => {
      const results = await repository.findByUserId('non-existent-user');
      expect(results).toEqual([]);
    });
  });

  describe('delete', () => {
    it('should delete Training', async () => {
      await repository.save(training);
      
      const retrieved = await repository.findById(training.id);
      expect(retrieved).not.toBeNull();
      
      await repository.delete(training.id);
      
      const deletedTraining = await repository.findById(training.id);
      expect(deletedTraining).toBeNull();
    });
  });

  describe('complex data handling', () => {
    it('should handle Training with multiple kinds and results', async () => {
      const additionalKinds = [
        {
          id: 'synonym-quiz-1',
          name: 'Synonym Quiz',
          description: 'Find synonyms for given words',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 'antonym-quiz-1',
          name: 'Antonym Quiz',
          description: 'Find antonyms for given words',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];
      
      const additionalResults = [
        {
          id: 'result-2',
          training_id: 'training-1',
          result: 'Score: 90% (18/20 correct)',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 'result-3',
          training_id: 'training-1',
          result: 'Score: 95% (19/20 correct)',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];
      
      additionalKinds.forEach(kind => training.addTrainingKind(kind));
      additionalResults.forEach(result => training.addTrainingResult(result));
      
      await repository.save(training);
      
      const retrieved = await repository.findById(training.id);
      
      expect(retrieved!.trainingKinds().length).toBe(3);
      expect(retrieved!.trainingResults().length).toBe(3);
      
      const kinds = retrieved!.trainingKinds();
      expect(kinds.map(k => k.name)).toEqual([
        'Vocabulary Quiz',
        'Synonym Quiz',
        'Antonym Quiz',
      ]);
    });

    it('should handle empty Training', async () => {
      const emptyTraining = new TrainingAggregate('test-user-456');
      await repository.save(emptyTraining);
      
      const retrieved = await repository.findById(emptyTraining.id);
      
      expect(retrieved).not.toBeNull();
      expect(retrieved!.trainingKinds()).toEqual([]);
      expect(retrieved!.trainingResults()).toEqual([]);
    });
  });
});