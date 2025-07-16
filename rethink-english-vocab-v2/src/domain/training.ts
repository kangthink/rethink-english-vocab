import { v4 as uuidv4 } from 'uuid';
import { WordMapAggregate } from './wordmap.js';

export interface TrainingKind {
  id: string;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export interface TrainingResult {
  id: string;
  training_id: string;
  result: string;
  created_at: Date;
  updated_at: Date;
}

export interface Training {
  id: string;
  kind: TrainingKind;
  wordMap: WordMapAggregate;
  created_at: Date;
  updated_at: Date;
}

export interface TrainingAggregateInterface {
  readonly id: string;
  readonly user_id: string;
  
  trainingKinds(): TrainingKind[];
  create(kind: TrainingKind, wordMap: WordMapAggregate): Training;
  trainingResults(): TrainingResult[];
  
  addTrainingKind(kind: TrainingKind): void;
  addTrainingResult(result: TrainingResult): void;
  updateTrainingKind(id: string, kind: TrainingKind): void;
  removeTrainingKind(id: string): void;
}

export class TrainingAggregate implements TrainingAggregateInterface {
  public readonly id: string;
  public readonly user_id: string;
  private _trainingKinds: TrainingKind[] = [];
  private _trainingResults: TrainingResult[] = [];
  private _trainings: Training[] = [];

  constructor(user_id: string, id?: string) {
    this.id = id || uuidv4();
    this.user_id = user_id;
  }

  trainingKinds(): TrainingKind[] {
    return [...this._trainingKinds];
  }

  create(kind: TrainingKind, wordMap: WordMapAggregate): Training {
    const training: Training = {
      id: uuidv4(),
      kind,
      wordMap,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    this._trainings.push(training);
    return training;
  }

  trainingResults(): TrainingResult[] {
    return [...this._trainingResults];
  }

  addTrainingKind(kind: TrainingKind): void {
    this._trainingKinds.push(kind);
  }

  addTrainingResult(result: TrainingResult): void {
    this._trainingResults.push(result);
  }

  updateTrainingKind(id: string, kind: TrainingKind): void {
    const index = this._trainingKinds.findIndex(tk => tk.id === id);
    if (index !== -1) {
      this._trainingKinds[index] = kind;
    }
  }

  removeTrainingKind(id: string): void {
    this._trainingKinds = this._trainingKinds.filter(tk => tk.id !== id);
  }

  getAllTrainings(): Training[] {
    return [...this._trainings];
  }
}