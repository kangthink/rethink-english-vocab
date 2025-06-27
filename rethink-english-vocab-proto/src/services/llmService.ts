import { WordNode, RelationshipType, ExpansionRequest, ExpansionResponse, LanguageSettings } from '../types';
import { getLanguageInfo } from '../utils/languages';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// 언어별 프롬프트 생성
const createMultilingualPrompt = (
  word: string,
  relationship: RelationshipType,
  languageSettings: LanguageSettings
): string => {
  const learningLang = getLanguageInfo(languageSettings.learningLanguage);
  const nativeLang = getLanguageInfo(languageSettings.nativeLanguage);

  const relationshipPrompts = {
    synonym: {
      en: 'synonyms (words with similar meanings)',
      ko: '동의어 (비슷한 의미의 단어들)',
      ja: '同義語 (似たような意味の言葉)',
      zh: '同义词 (意思相近的词语)',
      es: 'sinónimos (palabras con significados similares)',
      fr: 'synonymes (mots ayant des significations similaires)',
      de: 'Synonyme (Wörter mit ähnlicher Bedeutung)',
      it: 'sinonimi (parole con significati simili)',
      pt: 'sinônimos (palavras com significados similares)',
      ru: 'синонимы (слова с похожими значениями)'
    },
    antonym: {
      en: 'antonyms (words with opposite meanings)',
      ko: '반의어 (반대 의미의 단어들)',
      ja: '反義語 (反対の意味の言葉)',
      zh: '反义词 (意思相反的词语)',
      es: 'antónimos (palabras con significados opuestos)',
      fr: 'antonymes (mots ayant des significations opposées)',
      de: 'Antonyme (Wörter mit gegensätzlicher Bedeutung)',
      it: 'contrari (parole con significati opposti)',
      pt: 'antônimos (palavras com significados opostos)',
      ru: 'антонимы (слова с противоположными значениями)'
    },
    context: {
      en: 'contextually related words (words commonly used in similar situations)',
      ko: '문맥상 관련된 단어들 (비슷한 상황에서 자주 사용되는 단어들)',
      ja: '文脈上関連する言葉 (似たような状況でよく使われる言葉)',
      zh: '上下文相关词语 (在类似情况下常用的词语)',
      es: 'palabras relacionadas contextualmente (palabras comúnmente usadas en situaciones similares)',
      fr: 'mots liés contextuellement (mots couramment utilisés dans des situations similaires)',
      de: 'kontextuell verwandte Wörter (Wörter, die in ähnlichen Situationen verwendet werden)',
      it: 'parole correlate contestualmente (parole comunemente usate in situazioni simili)',
      pt: 'palavras relacionadas contextualmente (palavras comumente usadas em situações similares)',
      ru: 'контекстно связанные слова (слова, часто используемые в похожих ситуациях)'
    },
    metaphor: {
      en: 'metaphorically related words (words connected through imagery or symbolism)',
      ko: '은유적으로 관련된 단어들 (이미지나 상징을 통해 연결된 단어들)',
      ja: '比喩的に関連する言葉 (イメージや象徴を通して繋がった言葉)',
      zh: '隐喻相关词语 (通过意象或象征连接的词语)',
      es: 'palabras relacionadas metafóricamente (palabras conectadas a través de imágenes o simbolismo)',
      fr: 'mots liés métaphoriquement (mots connectés par l\'imagerie ou le symbolisme)',
      de: 'metaphorisch verwandte Wörter (Wörter, die durch Bilder oder Symbolik verbunden sind)',
      it: 'parole correlate metaforicamente (parole connesse attraverso immagini o simbolismo)',
      pt: 'palavras relacionadas metaforicamente (palavras conectadas através de imagens ou simbolismo)',
      ru: 'метафорически связанные слова (слова, связанные через образы или символизм)'
    },
    related: {
      en: 'related words (words from the same semantic field or topic)',
      ko: '관련된 단어들 (같은 의미 영역이나 주제의 단어들)',
      ja: '関連する言葉 (同じ意味分野や話題の言葉)',
      zh: '相关词语 (同一语义领域或话题的词语)',
      es: 'palabras relacionadas (palabras del mismo campo semántico o tema)',
      fr: 'mots liés (mots du même champ sémantique ou sujet)',
      de: 'verwandte Wörter (Wörter aus demselben semantischen Feld oder Thema)',
      it: 'parole correlate (parole dello stesso campo semantico o argomento)',
      pt: 'palavras relacionadas (palavras do mesmo campo semântico ou tópico)',
      ru: 'связанные слова (слова из одной семантической области или темы)'
    }
  };

  const relationshipDesc = relationshipPrompts[relationship][languageSettings.nativeLanguage] || 
                          relationshipPrompts[relationship]['en'];

  return `You are a multilingual vocabulary expansion assistant. Given a word in ${learningLang.nativeName} (${learningLang.name}), provide ${relationshipDesc}.

Word to expand: "${word}" (in ${learningLang.nativeName})
Relationship type: ${relationshipDesc}

Please respond with exactly 5 words and provide explanations in ${nativeLang.nativeName} (${nativeLang.name}).

Respond in this exact JSON format:
{
  "words": [
    {
      "word": "word1_in_${learningLang.code}",
      "definition": "definition_in_${nativeLang.code}",
      "example": "example_sentence_in_${learningLang.code}",
      "category": "emotion|nature|action|concept|abstract|object|person|place|time|quality"
    },
    {
      "word": "word2_in_${learningLang.code}",
      "definition": "definition_in_${nativeLang.code}",
      "example": "example_sentence_in_${learningLang.code}",
      "category": "emotion|nature|action|concept|abstract|object|person|place|time|quality"
    }
    // ... continue for 5 words total
  ]
}

Make sure to:
1. Provide words in ${learningLang.nativeName}
2. Provide definitions in ${nativeLang.nativeName}
3. Provide example sentences in ${learningLang.nativeName}
4. Choose appropriate categories from the given options
5. Ensure the relationship type is accurately reflected`;
};

// Mock 데이터 생성 (다국어 지원)
const generateMockData = (
  word: string,
  relationship: RelationshipType,
  languageSettings: LanguageSettings
): WordNode[] => {
  // 간단한 다국어 Mock 데이터
  const mockDataByLanguage: Record<string, Record<RelationshipType, WordNode[]>> = {
    'en_ko': {
      synonym: [
        { id: 'happy_joy', word: 'joyful', definition: '기쁨에 찬, 즐거운', example: 'She felt joyful after hearing the good news.', category: 'emotion', frequency: 85 },
        { id: 'happy_glad', word: 'glad', definition: '기쁜, 만족하는', example: 'I am glad to see you again.', category: 'emotion', frequency: 90 },
        { id: 'happy_cheerful', word: 'cheerful', definition: '밝고 활기찬', example: 'He has a cheerful personality.', category: 'emotion', frequency: 75 },
        { id: 'happy_content', word: 'content', definition: '만족하는, 흡족한', example: 'She is content with her simple life.', category: 'emotion', frequency: 70 },
        { id: 'happy_delighted', word: 'delighted', definition: '매우 기쁜, 즐거워하는', example: 'I am delighted to meet you.', category: 'emotion', frequency: 65 }
      ],
      antonym: [
        { id: 'happy_sad', word: 'sad', definition: '슬픈, 우울한', example: 'She felt sad when her friend moved away.', category: 'emotion', frequency: 95 },
        { id: 'happy_angry', word: 'angry', definition: '화난, 분노한', example: 'He was angry about the unfair decision.', category: 'emotion', frequency: 90 },
        { id: 'happy_depressed', word: 'depressed', definition: '우울한, 침울한', example: 'The rainy weather made her feel depressed.', category: 'emotion', frequency: 80 },
        { id: 'happy_miserable', word: 'miserable', definition: '비참한, 불행한', example: 'He looked miserable after losing his job.', category: 'emotion', frequency: 70 },
        { id: 'happy_gloomy', word: 'gloomy', definition: '우울한, 침체된', example: 'The room had a gloomy atmosphere.', category: 'emotion', frequency: 65 }
      ],
      context: [
        { id: 'happy_smile', word: 'smile', definition: '미소, 웃음', example: 'Her smile made everyone happy.', category: 'action', frequency: 95 },
        { id: 'happy_laugh', word: 'laugh', definition: '웃다', example: 'Children laugh when they play together.', category: 'action', frequency: 90 },
        { id: 'happy_celebrate', word: 'celebrate', definition: '축하하다', example: 'They celebrated their success with a party.', category: 'action', frequency: 85 },
        { id: 'happy_enjoy', word: 'enjoy', definition: '즐기다', example: 'I enjoy spending time with my family.', category: 'action', frequency: 95 },
        { id: 'happy_fun', word: 'fun', definition: '재미, 즐거움', example: 'We had so much fun at the beach.', category: 'concept', frequency: 90 }
      ],
      metaphor: [
        { id: 'happy_sunshine', word: 'sunshine', definition: '햇빛, 태양빛', example: 'You are my sunshine on a cloudy day.', category: 'nature', frequency: 85 },
        { id: 'happy_rainbow', word: 'rainbow', definition: '무지개', example: 'After the storm, a beautiful rainbow appeared.', category: 'nature', frequency: 70 },
        { id: 'happy_butterfly', word: 'butterfly', definition: '나비', example: 'Butterflies danced in the garden.', category: 'nature', frequency: 75 },
        { id: 'happy_bloom', word: 'bloom', definition: '꽃피다, 개화하다', example: 'Flowers bloom in spring.', category: 'nature', frequency: 80 },
        { id: 'happy_sparkle', word: 'sparkle', definition: '반짝이다', example: 'Her eyes sparkled with happiness.', category: 'quality', frequency: 70 }
      ],
      related: [
        { id: 'happy_emotion', word: 'emotion', definition: '감정', example: 'Happiness is a positive emotion.', category: 'concept', frequency: 85 },
        { id: 'happy_feeling', word: 'feeling', definition: '느낌, 감정', example: 'I have a good feeling about this.', category: 'concept', frequency: 90 },
        { id: 'happy_mood', word: 'mood', definition: '기분', example: 'She is in a good mood today.', category: 'concept', frequency: 85 },
        { id: 'happy_positive', word: 'positive', definition: '긍정적인', example: 'Try to stay positive in difficult times.', category: 'quality', frequency: 90 },
        { id: 'happy_optimistic', word: 'optimistic', definition: '낙관적인', example: 'He has an optimistic view of life.', category: 'quality', frequency: 75 }
      ]
    },
    'ko_en': {
      synonym: [
        { id: 'happy_joy', word: '기쁨', definition: 'a feeling of great pleasure and happiness', example: '그녀는 기쁨으로 가득했다.', category: 'emotion', frequency: 85 },
        { id: 'happy_pleasure', word: '즐거움', definition: 'a feeling of happy satisfaction and enjoyment', example: '음악을 듣는 즐거움을 느꼈다.', category: 'emotion', frequency: 90 },
        { id: 'happy_delight', word: '기쁨', definition: 'a feeling of extreme pleasure or satisfaction', example: '아이들의 웃음소리는 기쁨을 준다.', category: 'emotion', frequency: 75 },
        { id: 'happy_bliss', word: '행복', definition: 'perfect happiness; great joy', example: '완전한 행복을 느꼈다.', category: 'emotion', frequency: 70 },
        { id: 'happy_elation', word: '환희', definition: 'great happiness and exhilaration', example: '승리의 환희를 맛보았다.', category: 'emotion', frequency: 65 }
      ],
      antonym: [
        { id: 'happy_sadness', word: '슬픔', definition: 'the feeling of being sad', example: '이별의 슬픔이 깊었다.', category: 'emotion', frequency: 95 },
        { id: 'happy_sorrow', word: '서러움', definition: 'a feeling of deep distress', example: '서러움에 눈물을 흘렸다.', category: 'emotion', frequency: 80 },
        { id: 'happy_grief', word: '비애', definition: 'intense sorrow', example: '상실의 비애를 달래기 어려웠다.', category: 'emotion', frequency: 70 },
        { id: 'happy_depression', word: '우울', definition: 'feelings of severe despondency', example: '우울한 기분이 계속됐다.', category: 'emotion', frequency: 85 },
        { id: 'happy_melancholy', word: '우수', definition: 'a pensive sadness', example: '가을 우수가 깃들었다.', category: 'emotion', frequency: 65 }
      ],
      context: [
        { id: 'happy_smile', word: '미소', definition: 'a pleased, kind, or amused expression', example: '따뜻한 미소를 지었다.', category: 'action', frequency: 95 },
        { id: 'happy_laughter', word: '웃음', definition: 'the action or sound of laughing', example: '아이들의 웃음소리가 들렸다.', category: 'action', frequency: 90 },
        { id: 'happy_celebration', word: '축하', definition: 'the action of celebrating an important day or event', example: '생일 축하를 받았다.', category: 'action', frequency: 85 },
        { id: 'happy_party', word: '파티', definition: 'a social gathering of invited guests', example: '즐거운 파티를 열었다.', category: 'concept', frequency: 80 },
        { id: 'happy_festival', word: '축제', definition: 'an organized series of concerts, plays, or films', example: '마을 축제에 참가했다.', category: 'concept', frequency: 75 }
      ],
      metaphor: [
        { id: 'happy_sunshine', word: '햇살', definition: 'direct sunlight unbroken by cloud', example: '따뜻한 햇살이 비췄다.', category: 'nature', frequency: 85 },
        { id: 'happy_flower', word: '꽃', definition: 'the reproductive structure of flowering plants', example: '아름다운 꽃이 피었다.', category: 'nature', frequency: 90 },
        { id: 'happy_bird', word: '새', definition: 'a warm-blooded vertebrate animal', example: '새들이 즐겁게 노래했다.', category: 'nature', frequency: 80 },
        { id: 'happy_spring', word: '봄', definition: 'the season after winter', example: '봄이 찾아왔다.', category: 'time', frequency: 85 },
        { id: 'happy_light', word: '빛', definition: 'natural agent that stimulates sight', example: '희망의 빛이 보였다.', category: 'concept', frequency: 75 }
      ],
      related: [
        { id: 'happy_emotion', word: '감정', definition: 'a strong feeling deriving from circumstances', example: '복잡한 감정이 들었다.', category: 'concept', frequency: 85 },
        { id: 'happy_heart', word: '마음', definition: 'the center of a person\'s thoughts and emotions', example: '마음이 편해졌다.', category: 'concept', frequency: 95 },
        { id: 'happy_spirit', word: '정신', definition: 'the non-physical part of a person', example: '정신이 맑아졌다.', category: 'concept', frequency: 80 },
        { id: 'happy_soul', word: '영혼', definition: 'the spiritual part of a human being', example: '영혼이 평안해졌다.', category: 'concept', frequency: 70 },
        { id: 'happy_peace', word: '평화', definition: 'freedom from disturbance; tranquility', example: '마음의 평화를 찾았다.', category: 'concept', frequency: 85 }
      ]
    }
  };

  const languageKey = `${languageSettings.learningLanguage}_${languageSettings.nativeLanguage}`;
  const fallbackKey = 'en_ko'; // 기본값

  const mockWords = mockDataByLanguage[languageKey]?.[relationship] || 
                   mockDataByLanguage[fallbackKey][relationship];

  return mockWords.map(mockWord => ({
    ...mockWord,
    expandedFrom: {
      originalWord: word,
      relationship: relationship
    }
  }));
};

// API 키 유효성 검사
const isValidApiKey = (apiKey: string | null): boolean => {
  return Boolean(apiKey && apiKey.startsWith('sk-') && apiKey.length > 20);
};

// 단어의 기본 정의와 예문을 가져오는 함수
export const getWordDefinition = async (word: string, languageSettings: LanguageSettings): Promise<{ definition: string; example: string }> => {
  try {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY || localStorage.getItem('openai_api_key');
    
    if (!isValidApiKey(apiKey)) {
      console.log('API key not found or invalid, using basic definition');
      return {
        definition: `${word}: A ${languageSettings.learningLanguage} word`,
        example: `Example sentence with "${word}".`
      };
    }

    const learningLang = getLanguageInfo(languageSettings.learningLanguage);
    const nativeLang = getLanguageInfo(languageSettings.nativeLanguage);

    const prompt = `You are a language learning assistant. Provide a clear definition and example sentence for the word "${word}" in ${learningLang.nativeName}.

Please respond in this exact JSON format:
{
  "definition": "clear_definition_in_${nativeLang.code}",
  "example": "example_sentence_in_${learningLang.code}_using_the_word"
}

Make sure to:
1. Provide the definition in ${nativeLang.nativeName}
2. Provide the example sentence in ${learningLang.nativeName}
3. Keep the definition concise but clear
4. Make the example sentence natural and contextual`;

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content in API response');
    }

    const parsedData = JSON.parse(content);
    return {
      definition: parsedData.definition || `${word}: A ${languageSettings.learningLanguage} word`,
      example: parsedData.example || `Example sentence with "${word}".`
    };

  } catch (error) {
    console.error('Error getting word definition:', error);
    return {
      definition: `${word}: A ${languageSettings.learningLanguage} word`,
      example: `Example sentence with "${word}".`
    };
  }
};

export const expandWord = async (request: ExpansionRequest, languageSettings: LanguageSettings): Promise<ExpansionResponse> => {
  try {
    // 환경변수에서 먼저 API 키를 찾고, 없으면 localStorage에서 찾기
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY || localStorage.getItem('openai_api_key');
    
    if (!isValidApiKey(apiKey)) {
      console.log('API key not found or invalid, using mock data');
      const mockWords = generateMockData(request.word, request.relationship, languageSettings);
      return {
        success: true,
        words: mockWords,
        message: `Mock data: Found ${mockWords.length} ${request.relationship} words for "${request.word}"`
      };
    }

    const prompt = createMultilingualPrompt(request.word, request.relationship, languageSettings);

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content in API response');
    }

    // JSON 파싱 시도
    let parsedData;
    try {
      parsedData = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse API response:', content);
      throw new Error('Invalid JSON response from API');
    }

    if (!parsedData.words || !Array.isArray(parsedData.words)) {
      throw new Error('Invalid response format: missing words array');
    }

    const words: WordNode[] = parsedData.words.map((wordData: any, index: number) => ({
      id: `${request.word}_${request.relationship}_${index}`,
      word: wordData.word || '',
      definition: wordData.definition || '',
      example: wordData.example || '',
      category: wordData.category || 'concept',
      frequency: Math.floor(Math.random() * 30) + 70, // 70-100 범위
      expandedFrom: {
        originalWord: request.word,
        relationship: request.relationship
      }
    }));

    return {
      success: true,
      words: words,
      message: `Found ${words.length} ${request.relationship} words for "${request.word}"`
    };

  } catch (error) {
    console.error('Error expanding word:', error);
    
    // 오류 발생 시 Mock 데이터로 대체
    const mockWords = generateMockData(request.word, request.relationship, languageSettings);
    return {
      success: true,
      words: mockWords,
      message: `Using mock data due to API error: Found ${mockWords.length} ${request.relationship} words for "${request.word}"`
    };
  }
}; 