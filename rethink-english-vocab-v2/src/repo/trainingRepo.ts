import { TrainingAggregate, TrainingKind, TrainingResult, Training } from '../domain/training.js';
import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, query, where, Firestore } from 'firebase/firestore';

export interface TrainingRepository {
  findById(id: string): Promise<TrainingAggregate | null>;
  findByUserId(userId: string): Promise<TrainingAggregate[]>;
  save(training: TrainingAggregate): Promise<void>;
  delete(id: string): Promise<void>;
}

export class InMemoryTrainingRepository implements TrainingRepository {
  private trainings: Map<string, TrainingAggregate> = new Map();

  async findById(id: string): Promise<TrainingAggregate | null> {
    return this.trainings.get(id) || null;
  }

  async findByUserId(userId: string): Promise<TrainingAggregate[]> {
    return Array.from(this.trainings.values()).filter(t => t.user_id === userId);
  }

  async save(training: TrainingAggregate): Promise<void> {
    this.trainings.set(training.id, training);
  }

  async delete(id: string): Promise<void> {
    this.trainings.delete(id);
  }
}

interface TrainingDoc {
  id: string;
  user_id: string;
  trainingKinds: TrainingKind[];
  trainingResults: TrainingResult[];
  trainings: Training[];
  created_at: string;
  updated_at: string;
}

export class FirebaseTrainingRepository implements TrainingRepository {
  constructor(private db: Firestore) {}

  async findById(id: string): Promise<TrainingAggregate | null> {
    try {
      const docRef = doc(this.db, 'trainings', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as TrainingDoc;
        return this.toTrainingAggregate(data);
      }
      return null;
    } catch (error) {
      console.error('Error fetching Training by ID:', error);
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<TrainingAggregate[]> {
    try {
      const q = query(collection(this.db, 'trainings'), where('user_id', '==', userId));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as TrainingDoc;
        return this.toTrainingAggregate(data);
      });
    } catch (error) {
      console.error('Error fetching Trainings by user ID:', error);
      throw error;
    }
  }

  async save(training: TrainingAggregate): Promise<void> {
    try {
      const docData: TrainingDoc = {
        id: training.id,
        user_id: training.user_id,
        trainingKinds: training.trainingKinds(),
        trainingResults: training.trainingResults(),
        trainings: training.getAllTrainings(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      const docRef = doc(this.db, 'trainings', training.id);
      await setDoc(docRef, docData);
    } catch (error) {
      console.error('Error saving Training:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(this.db, 'trainings', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting Training:', error);
      throw error;
    }
  }

  private toTrainingAggregate(data: TrainingDoc): TrainingAggregate {
    const training = new TrainingAggregate(data.user_id, data.id);
    
    data.trainingKinds.forEach(kind => {
      training.addTrainingKind({
        ...kind,
        created_at: new Date(kind.created_at),
        updated_at: new Date(kind.updated_at),
      });
    });
    
    data.trainingResults.forEach(result => {
      training.addTrainingResult({
        ...result,
        created_at: new Date(result.created_at),
        updated_at: new Date(result.updated_at),
      });
    });
    
    return training;
  }
}