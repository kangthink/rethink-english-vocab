import { WordMapAggregate } from './domain/wordmap.js';
import { TrainingAggregate } from './domain/training.js';
import { InMemoryWordMapRepository, FirebaseWordMapRepository } from './repo/wordmapRepo.js';
import { InMemoryTrainingRepository, FirebaseTrainingRepository } from './repo/trainingRepo.js';
import { OpenAIService } from './service/aiservice.js';
import { testFirebaseAuthIntegration } from './examples/firebase-auth-integration.js';

console.log('Rethink English Vocab V2 - Domain Implementation');

const wordMap = new WordMapAggregate('user-123');
const training = new TrainingAggregate('user-123');

console.log('WordMap ID:', wordMap.id);
console.log('Training ID:', training.id);

const sampleWord = {
  word: 'example',
  definition: 'a thing characteristic of its kind',
  concept: 'demonstration',
  examples: ['For example, this is a sample sentence.', 'This serves as an example.'],
  reactions: ['👍', '💡'],
  created_at: new Date(),
  updated_at: new Date(),
};

wordMap.addWord(sampleWord);
console.log('Word count:', wordMap.word_count());

if (process.env.NODE_ENV !== 'test') {
  testFirebaseAuthIntegration().catch(console.error);
}

export {
  WordMapAggregate,
  TrainingAggregate,
  InMemoryWordMapRepository,
  InMemoryTrainingRepository,
  FirebaseWordMapRepository,
  FirebaseTrainingRepository,
  OpenAIService,
};