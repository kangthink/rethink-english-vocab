import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

export class FirebaseService {
  private app: FirebaseApp;
  private db: Firestore;
  private auth: Auth;

  constructor(config: FirebaseConfig) {
    this.app = initializeApp(config);
    this.db = getFirestore(this.app);
    this.auth = getAuth(this.app);
  }

  getFirestore(): Firestore {
    return this.db;
  }

  getAuth(): Auth {
    return this.auth;
  }

  getApp(): FirebaseApp {
    return this.app;
  }
}

export function createFirebaseService(config: FirebaseConfig): FirebaseService {
  return new FirebaseService(config);
}

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDaClwYIsittflC35xHR6oZmO1Ul1eeFvM",
  authDomain: "rethink-be07f.firebaseapp.com",
  projectId: "rethink-be07f",
  storageBucket: "rethink-be07f.firebasestorage.app",
  messagingSenderId: "838502967740",
  appId: "1:838502967740:web:e403d5a721dfdf2a4ea3b9",
  measurementId: "G-8VWKX1ZGD2"
};

export const defaultFirebaseConfig: FirebaseConfig = {
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId,
  measurementId: firebaseConfig.measurementId,
};