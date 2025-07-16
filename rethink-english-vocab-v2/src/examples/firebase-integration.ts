import { WordMapAggregate } from '../domain/wordmap.js';
import { TrainingAggregate } from '../domain/training.js';
import { FirebaseWordMapRepository } from '../repo/wordmapRepo.js';
import { FirebaseTrainingRepository } from '../repo/trainingRepo.js';
import { createFirebaseService, defaultFirebaseConfig } from '../infra/firebase.js';

export async function testFirebaseIntegration() {
  console.log('🔥 Testing Firebase Integration...');
  
  const firebaseService = createFirebaseService(defaultFirebaseConfig);
  const db = firebaseService.getFirestore();
  
  const wordMapRepo = new FirebaseWordMapRepository(db);
  const trainingRepo = new FirebaseTrainingRepository(db);
  
  const testUserId = 'test-user-' + Date.now();
  
  try {
    console.log('1. Creating WordMap...');
    const wordMap = new WordMapAggregate(testUserId);
    
    const sampleWords = [
      {
        word: 'serendipity',
        definition: 'the occurrence of events by chance in a happy way',
        concept: 'fortunate accident',
        examples: ['It was serendipity that led to the discovery', 'Pure serendipity brought them together'],
        reactions: ['✨', '🍀'],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        word: 'ephemeral',
        definition: 'lasting for a very short time',
        concept: 'temporary nature',
        examples: ['The beauty of cherry blossoms is ephemeral', 'Youth is ephemeral'],
        reactions: ['🌸', '⏰'],
        created_at: new Date(),
        updated_at: new Date(),
      }
    ];
    
    sampleWords.forEach(word => wordMap.addWord(word));
    
    const thread = {
      name: 'Beautiful English Words',
      words: sampleWords,
      created_at: new Date(),
      updated_at: new Date(),
    };
    
    wordMap.addThread(thread);
    
    console.log('2. Saving WordMap to Firebase...');
    await wordMapRepo.save(wordMap);
    console.log('✅ WordMap saved successfully');
    
    console.log('3. Retrieving WordMap from Firebase...');
    const retrievedWordMap = await wordMapRepo.findById(wordMap.id);
    console.log('✅ WordMap retrieved:', {
      id: retrievedWordMap?.id,
      user_id: retrievedWordMap?.user_id,
      word_count: retrievedWordMap?.word_count(),
      thread_count: retrievedWordMap?.thread_count(),
    });
    
    console.log('4. Creating Training...');
    const training = new TrainingAggregate(testUserId);
    
    const trainingKinds = [
      {
        id: 'vocab-quiz-1',
        name: 'Vocabulary Quiz',
        description: 'Test your vocabulary knowledge',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'definition-match-1',
        name: 'Definition Matching',
        description: 'Match words with their definitions',
        created_at: new Date(),
        updated_at: new Date(),
      }
    ];
    
    trainingKinds.forEach(kind => training.addTrainingKind(kind));
    
    const trainingResults = [
      {
        id: 'result-1',
        training_id: 'training-1',
        result: 'Score: 85% (17/20 correct)',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'result-2',
        training_id: 'training-1',
        result: 'Score: 90% (18/20 correct)',
        created_at: new Date(),
        updated_at: new Date(),
      }
    ];
    
    trainingResults.forEach(result => training.addTrainingResult(result));
    
    console.log('5. Saving Training to Firebase...');
    await trainingRepo.save(training);
    console.log('✅ Training saved successfully');
    
    console.log('6. Retrieving Training from Firebase...');
    const retrievedTraining = await trainingRepo.findById(training.id);
    console.log('✅ Training retrieved:', {
      id: retrievedTraining?.id,
      user_id: retrievedTraining?.user_id,
      training_kinds_count: retrievedTraining?.trainingKinds().length,
      training_results_count: retrievedTraining?.trainingResults().length,
    });
    
    console.log('7. Testing search functionality...');
    const searchResults = await retrievedWordMap?.search('ephemeral');
    console.log('✅ Search results:', searchResults?.map(w => w.word));
    
    console.log('8. Testing pagination...');
    const page1 = await retrievedWordMap?.words(0, 1);
    console.log('✅ Page 1 words:', page1?.map(w => w.word));
    
    const page2 = await retrievedWordMap?.words(1, 1);
    console.log('✅ Page 2 words:', page2?.map(w => w.word));
    
    console.log('9. Testing findByUserId...');
    const userWordMaps = await wordMapRepo.findByUserId(testUserId);
    console.log('✅ User WordMaps count:', userWordMaps.length);
    
    const userTrainings = await trainingRepo.findByUserId(testUserId);
    console.log('✅ User Trainings count:', userTrainings.length);
    
    console.log('10. Cleaning up test data...');
    await wordMapRepo.delete(wordMap.id);
    await trainingRepo.delete(training.id);
    console.log('✅ Test data cleaned up');
    
    console.log('🎉 Firebase integration test completed successfully!');
    
  } catch (error) {
    console.error('❌ Firebase integration test failed:', error);
    throw error;
  }
}