import { WordMapAggregate, Word, Thread } from '../domain/wordmap.js';
import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, query, where, Firestore } from 'firebase/firestore';

export interface WordMapRepository {
  findById(id: string): Promise<WordMapAggregate | null>;
  findByUserId(userId: string): Promise<WordMapAggregate[]>;
  save(wordMap: WordMapAggregate): Promise<void>;
  delete(id: string): Promise<void>;
}

export class InMemoryWordMapRepository implements WordMapRepository {
  private wordMaps: Map<string, WordMapAggregate> = new Map();

  async findById(id: string): Promise<WordMapAggregate | null> {
    return this.wordMaps.get(id) || null;
  }

  async findByUserId(userId: string): Promise<WordMapAggregate[]> {
    return Array.from(this.wordMaps.values()).filter(wm => wm.user_id === userId);
  }

  async save(wordMap: WordMapAggregate): Promise<void> {
    this.wordMaps.set(wordMap.id, wordMap);
  }

  async delete(id: string): Promise<void> {
    this.wordMaps.delete(id);
  }
}

interface WordMapDoc {
  id: string;
  user_id: string;
  words: Word[];
  threads: Thread[];
  created_at: string;
  updated_at: string;
}

export class FirebaseWordMapRepository implements WordMapRepository {
  constructor(private db: Firestore) {}

  async findById(id: string): Promise<WordMapAggregate | null> {
    try {
      const docRef = doc(this.db, 'wordmaps', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as WordMapDoc;
        return this.toWordMapAggregate(data);
      }
      return null;
    } catch (error) {
      console.error('Error fetching WordMap by ID:', error);
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<WordMapAggregate[]> {
    try {
      const q = query(collection(this.db, 'wordmaps'), where('user_id', '==', userId));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as WordMapDoc;
        return this.toWordMapAggregate(data);
      });
    } catch (error) {
      console.error('Error fetching WordMaps by user ID:', error);
      throw error;
    }
  }

  async save(wordMap: WordMapAggregate): Promise<void> {
    try {
      const docData: WordMapDoc = {
        id: wordMap.id,
        user_id: wordMap.user_id,
        words: wordMap.getAllWords(),
        threads: wordMap.getAllThreads(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      const docRef = doc(this.db, 'wordmaps', wordMap.id);
      await setDoc(docRef, docData);
    } catch (error) {
      console.error('Error saving WordMap:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(this.db, 'wordmaps', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting WordMap:', error);
      throw error;
    }
  }

  private toWordMapAggregate(data: WordMapDoc): WordMapAggregate {
    const wordMap = new WordMapAggregate(data.user_id, data.id);
    
    data.words.forEach(word => {
      wordMap.addWord({
        ...word,
        created_at: new Date(word.created_at),
        updated_at: new Date(word.updated_at),
      });
    });
    
    data.threads.forEach(thread => {
      wordMap.addThread({
        ...thread,
        words: thread.words.map(word => ({
          ...word,
          created_at: new Date(word.created_at),
          updated_at: new Date(word.updated_at),
        })),
        created_at: new Date(thread.created_at),
        updated_at: new Date(thread.updated_at),
      });
    });
    
    return wordMap;
  }
}