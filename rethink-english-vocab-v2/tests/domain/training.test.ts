import { describe, it, expect, beforeEach } from 'bun:test';
import { TrainingAggregate, TrainingKind, TrainingResult } from '../../src/domain/training.js';
import { WordMapAggregate } from '../../src/domain/wordmap.js';

describe('TrainingAggregate', () => {
  let trainingAggregate: TrainingAggregate;
  let sampleTrainingKind: TrainingKind;
  let sampleWordMap: WordMapAggregate;

  beforeEach(() => {
    trainingAggregate = new TrainingAggregate('user-123');
    sampleTrainingKind = {
      id: 'kind-1',
      name: 'Vocabulary Quiz',
      description: 'Test vocabulary knowledge',
      created_at: new Date(),
      updated_at: new Date(),
    };
    sampleWordMap = new WordMapAggregate('user-123');
  });

  describe('constructor', () => {
    it('should create TrainingAggregate with generated id', () => {
      expect(trainingAggregate.id).toBeDefined();
      expect(trainingAggregate.user_id).toBe('user-123');
    });

    it('should create TrainingAggregate with provided id', () => {
      const customId = 'custom-id';
      const customTraining = new TrainingAggregate('user-123', customId);
      expect(customTraining.id).toBe(customId);
    });
  });

  describe('training kind management', () => {
    it('should add training kind', () => {
      trainingAggregate.addTrainingKind(sampleTrainingKind);
      const kinds = trainingAggregate.trainingKinds();
      expect(kinds.length).toBe(1);
      expect(kinds[0]).toEqual(sampleTrainingKind);
    });

    it('should update training kind', () => {
      trainingAggregate.addTrainingKind(sampleTrainingKind);
      const updatedKind = { ...sampleTrainingKind, name: 'Updated Quiz' };
      trainingAggregate.updateTrainingKind('kind-1', updatedKind);
      
      const kinds = trainingAggregate.trainingKinds();
      expect(kinds[0].name).toBe('Updated Quiz');
    });

    it('should remove training kind', () => {
      trainingAggregate.addTrainingKind(sampleTrainingKind);
      trainingAggregate.removeTrainingKind('kind-1');
      
      const kinds = trainingAggregate.trainingKinds();
      expect(kinds.length).toBe(0);
    });

    it('should not update non-existent training kind', () => {
      const updatedKind = { ...sampleTrainingKind, name: 'Updated Quiz' };
      trainingAggregate.updateTrainingKind('non-existent', updatedKind);
      
      const kinds = trainingAggregate.trainingKinds();
      expect(kinds.length).toBe(0);
    });
  });

  describe('training creation', () => {
    it('should create training', () => {
      const training = trainingAggregate.create(sampleTrainingKind, sampleWordMap);
      
      expect(training.id).toBeDefined();
      expect(training.kind).toEqual(sampleTrainingKind);
      expect(training.wordMap).toEqual(sampleWordMap);
      expect(training.created_at).toBeInstanceOf(Date);
      expect(training.updated_at).toBeInstanceOf(Date);
      
      const trainings = trainingAggregate.getAllTrainings();
      expect(trainings.length).toBe(1);
      expect(trainings[0]).toEqual(training);
    });

    it('should create multiple trainings', () => {
      const training1 = trainingAggregate.create(sampleTrainingKind, sampleWordMap);
      const training2 = trainingAggregate.create(sampleTrainingKind, sampleWordMap);
      
      expect(training1.id).not.toBe(training2.id);
      
      const trainings = trainingAggregate.getAllTrainings();
      expect(trainings.length).toBe(2);
    });
  });

  describe('training result management', () => {
    it('should add training result', () => {
      const result: TrainingResult = {
        id: 'result-1',
        training_id: 'training-1',
        result: 'Score: 85%',
        created_at: new Date(),
        updated_at: new Date(),
      };
      
      trainingAggregate.addTrainingResult(result);
      
      const results = trainingAggregate.trainingResults();
      expect(results.length).toBe(1);
      expect(results[0]).toEqual(result);
    });

    it('should add multiple training results', () => {
      const result1: TrainingResult = {
        id: 'result-1',
        training_id: 'training-1',
        result: 'Score: 85%',
        created_at: new Date(),
        updated_at: new Date(),
      };
      
      const result2: TrainingResult = {
        id: 'result-2',
        training_id: 'training-1',
        result: 'Score: 90%',
        created_at: new Date(),
        updated_at: new Date(),
      };
      
      trainingAggregate.addTrainingResult(result1);
      trainingAggregate.addTrainingResult(result2);
      
      const results = trainingAggregate.trainingResults();
      expect(results.length).toBe(2);
    });
  });

  describe('immutability', () => {
    it('should return copy of training kinds', () => {
      trainingAggregate.addTrainingKind(sampleTrainingKind);
      const kinds = trainingAggregate.trainingKinds();
      
      kinds.push({
        id: 'new-kind',
        name: 'New Kind',
        description: 'New description',
        created_at: new Date(),
        updated_at: new Date(),
      });
      
      expect(trainingAggregate.trainingKinds().length).toBe(1);
    });

    it('should return copy of training results', () => {
      const result: TrainingResult = {
        id: 'result-1',
        training_id: 'training-1',
        result: 'Score: 85%',
        created_at: new Date(),
        updated_at: new Date(),
      };
      
      trainingAggregate.addTrainingResult(result);
      const results = trainingAggregate.trainingResults();
      
      results.push({
        id: 'new-result',
        training_id: 'training-1',
        result: 'Score: 95%',
        created_at: new Date(),
        updated_at: new Date(),
      });
      
      expect(trainingAggregate.trainingResults().length).toBe(1);
    });
  });
});