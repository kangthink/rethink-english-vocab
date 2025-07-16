import { signInAnonymously, User } from 'firebase/auth';
import { WordMapAggregate } from '../domain/wordmap.js';
import { TrainingAggregate } from '../domain/training.js';
import { FirebaseWordMapRepository } from '../repo/wordmapRepo.js';
import { FirebaseTrainingRepository } from '../repo/trainingRepo.js';
import { createFirebaseService, defaultFirebaseConfig } from '../infra/firebase.js';

export async function testFirebaseAuthIntegration() {
  console.log('🔐 Testing Firebase Auth Integration...');
  
  const firebaseService = createFirebaseService(defaultFirebaseConfig);
  const db = firebaseService.getFirestore();
  const auth = firebaseService.getAuth();
  
  const wordMapRepo = new FirebaseWordMapRepository(db);
  const trainingRepo = new FirebaseTrainingRepository(db);
  
  try {
    console.log('1. Signing in anonymously...');
    const userCredential = await signInAnonymously(auth);
    const user: User = userCredential.user;
    console.log('✅ Signed in as:', user.uid);
    
    console.log('2. Creating WordMap with authenticated user...');
    const wordMap = new WordMapAggregate(user.uid);
    
    const sampleWords = [
      {
        word: 'authentication',
        definition: 'the process of verifying the identity of a user',
        concept: 'security',
        examples: ['User authentication is required', 'Firebase provides authentication'],
        reactions: ['🔒', '✅'],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        word: 'authorization',
        definition: 'the process of giving someone permission to access a resource',
        concept: 'permissions',
        examples: ['Authorization rules control access', 'User lacks authorization'],
        reactions: ['🛡️', '⚖️'],
        created_at: new Date(),
        updated_at: new Date(),
      }
    ];
    
    sampleWords.forEach(word => wordMap.addWord(word));
    
    const thread = {
      name: 'Security Terms',
      words: sampleWords,
      created_at: new Date(),
      updated_at: new Date(),
    };
    
    wordMap.addThread(thread);
    
    console.log('3. Saving WordMap to Firebase with authentication...');
    await wordMapRepo.save(wordMap);
    console.log('✅ WordMap saved successfully');
    
    console.log('4. Retrieving WordMap from Firebase...');
    const retrievedWordMap = await wordMapRepo.findById(wordMap.id);
    console.log('✅ WordMap retrieved:', {
      id: retrievedWordMap?.id,
      user_id: retrievedWordMap?.user_id,
      word_count: retrievedWordMap?.word_count(),
      thread_count: retrievedWordMap?.thread_count(),
    });
    
    console.log('5. Creating Training with authenticated user...');
    const training = new TrainingAggregate(user.uid);
    
    const trainingKinds = [
      {
        id: 'security-quiz-1',
        name: 'Security Quiz',
        description: 'Test your security knowledge',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'auth-challenge-1',
        name: 'Authentication Challenge',
        description: 'Challenge about authentication concepts',
        created_at: new Date(),
        updated_at: new Date(),
      }
    ];
    
    trainingKinds.forEach(kind => training.addTrainingKind(kind));
    
    const trainingResults = [
      {
        id: 'result-1',
        training_id: 'training-1',
        result: 'Score: 92% (23/25 correct)',
        created_at: new Date(),
        updated_at: new Date(),
      }
    ];
    
    trainingResults.forEach(result => training.addTrainingResult(result));
    
    console.log('6. Saving Training to Firebase...');
    await trainingRepo.save(training);
    console.log('✅ Training saved successfully');
    
    console.log('7. Retrieving Training from Firebase...');
    const retrievedTraining = await trainingRepo.findById(training.id);
    console.log('✅ Training retrieved:', {
      id: retrievedTraining?.id,
      user_id: retrievedTraining?.user_id,
      training_kinds_count: retrievedTraining?.trainingKinds().length,
      training_results_count: retrievedTraining?.trainingResults().length,
    });
    
    console.log('8. Testing user-specific queries...');
    const userWordMaps = await wordMapRepo.findByUserId(user.uid);
    console.log('✅ User WordMaps count:', userWordMaps.length);
    
    const userTrainings = await trainingRepo.findByUserId(user.uid);
    console.log('✅ User Trainings count:', userTrainings.length);
    
    console.log('9. Testing search functionality...');
    const searchResults = await retrievedWordMap?.search('authentication');
    console.log('✅ Search results:', searchResults?.map(w => w.word));
    
    console.log('10. Testing pagination...');
    const page1 = await retrievedWordMap?.words(0, 1);
    console.log('✅ Page 1 words:', page1?.map(w => w.word));
    
    console.log('11. Cleaning up test data...');
    await wordMapRepo.delete(wordMap.id);
    await trainingRepo.delete(training.id);
    console.log('✅ Test data cleaned up');
    
    console.log('12. Signing out...');
    await auth.signOut();
    console.log('✅ Signed out successfully');
    
    console.log('🎉 Firebase Auth integration test completed successfully!');
    
  } catch (error) {
    console.error('❌ Firebase Auth integration test failed:', error);
    throw error;
  }
}