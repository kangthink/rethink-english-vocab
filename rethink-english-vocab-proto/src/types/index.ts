export interface WordNode {
  id: string;
  word: string;
  definition: string;
  example: string;
  frequency: number;
  category: string;
  x?: number;
  y?: number;
  // 확장 정보
  expandedFrom?: {
    originalWord: string;
    relationship: RelationshipType;
  };
}

export interface WordLink {
  source: string;
  target: string;
  relationship: RelationshipType;
  strength: number;
}

export type RelationshipType = 
  | 'synonym' 
  | 'antonym' 
  | 'context' 
  | 'metaphor' 
  | 'related';

export type SupportedLanguage = 
  | 'ko' // 한국어
  | 'en' // 영어
  | 'ja' // 일본어
  | 'zh' // 중국어
  | 'es' // 스페인어
  | 'fr' // 프랑스어
  | 'de' // 독일어
  | 'it' // 이탈리아어
  | 'pt' // 포르투갈어
  | 'ru'; // 러시아어

export interface LanguageSettings {
  learningLanguage: SupportedLanguage; // 배우고자 하는 언어
  nativeLanguage: SupportedLanguage;   // 모국어 (설명 언어)
}

export interface GraphData {
  nodes: WordNode[];
  links: WordLink[];
}

export interface ExpansionRequest {
  word: string;
  relationship: RelationshipType;
  count?: number;
}

export interface ExpansionResponse {
  success: boolean;
  words: WordNode[];
  message: string;
} 