import { SupportedLanguage, RelationshipType } from '../types';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' }
];

// 관계 타입의 다국어 번역
export const RELATIONSHIP_TRANSLATIONS: Record<SupportedLanguage, Record<RelationshipType, string>> = {
  ko: {
    synonym: '동의어',
    antonym: '반의어', 
    context: '문맥',
    metaphor: '은유',
    related: '관련어'
  },
  en: {
    synonym: 'Synonym',
    antonym: 'Antonym',
    context: 'Context',
    metaphor: 'Metaphor',
    related: 'Related'
  },
  ja: {
    synonym: '同義語',
    antonym: '反義語',
    context: '文脈',
    metaphor: '比喩',
    related: '関連語'
  },
  zh: {
    synonym: '同义词',
    antonym: '反义词',
    context: '语境',
    metaphor: '隐喻',
    related: '相关词'
  },
  es: {
    synonym: 'Sinónimo',
    antonym: 'Antónimo',
    context: 'Contexto',
    metaphor: 'Metáfora',
    related: 'Relacionado'
  },
  fr: {
    synonym: 'Synonyme',
    antonym: 'Antonyme',
    context: 'Contexte',
    metaphor: 'Métaphore',
    related: 'Lié'
  },
  de: {
    synonym: 'Synonym',
    antonym: 'Antonym',
    context: 'Kontext',
    metaphor: 'Metapher',
    related: 'Verwandt'
  },
  it: {
    synonym: 'Sinonimo',
    antonym: 'Antonimo',
    context: 'Contesto',
    metaphor: 'Metafora',
    related: 'Correlato'
  },
  pt: {
    synonym: 'Sinônimo',
    antonym: 'Antônimo',
    context: 'Contexto',
    metaphor: 'Metáfora',
    related: 'Relacionado'
  },
  ru: {
    synonym: 'Синоним',
    antonym: 'Антоним',
    context: 'Контекст',
    metaphor: 'Метафора',
    related: 'Связанный'
  }
};

// UI 텍스트의 다국어 번역
export const UI_TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  ko: {
    // 헤더
    appTitle: '🧠 Rethink Vocab',
    appSubtitle: '단어를 확장하며 배우는 새로운 방법',
    
    // 언어 설정
    languageSettings: '언어 설정',
    learningLanguage: '학습 언어',
    nativeLanguage: '설명 언어',
    
    // 입력 및 버튼
    inputPlaceholder: '학습할 단어를 입력하세요',
    addWord: '단어 추가',
    adding: '추가 중...',
    expand: '확장',
    
    // 모드
    listMode: '📋 리스트 모드',
    mapMode: '🗺️ 맵 모드',
    
    // 통계
    totalWords: '총 단어',
    connections: '연결',
    categories: '카테고리',
    
    // 확장 정보
    expandedFrom: '에서',
    expandedWith: '로 확장됨',
    
    // 기타
    frequency: '빈도',
    selectNode: '노드를 선택하세요',
    clickToExpand: '노드를 클릭한 후 확장 버튼을 누르세요',
    addWords: '단어를 추가해보세요',
    selectedWord: '선택된 단어',
    example: '예문'
  },
  en: {
    appTitle: '🧠 Rethink Vocab',
    appSubtitle: 'A new way to learn by expanding words',
    
    languageSettings: 'Language Settings',
    learningLanguage: 'Learning Language',
    nativeLanguage: 'Native Language',
    
    inputPlaceholder: 'Enter a word to learn',
    addWord: 'Add Word',
    adding: 'Adding...',
    expand: 'Expand',
    
    listMode: '📋 List Mode',
    mapMode: '🗺️ Map Mode',
    
    totalWords: 'Total Words',
    connections: 'Connections', 
    categories: 'Categories',
    
    expandedFrom: 'from',
    expandedWith: 'expanded with',
    
    frequency: 'Frequency',
    selectNode: 'Select a node',
    clickToExpand: 'Click a node then press expand button',
    addWords: 'Try adding some words',
    selectedWord: 'Selected Word',
    example: 'Example'
  },
  ja: {
    appTitle: '🧠 Rethink Vocab',
    appSubtitle: '単語を拡張して学ぶ新しい方法',
    
    languageSettings: '言語設定',
    learningLanguage: '学習言語',
    nativeLanguage: '母国語',
    
    inputPlaceholder: '学習する単語を入力してください',
    addWord: '単語追加',
    adding: '追加中...',
    expand: '展開',
    
    listMode: '📋 リストモード',
    mapMode: '🗺️ マップモード',
    
    totalWords: '総単語数',
    connections: '接続',
    categories: 'カテゴリ',
    
    expandedFrom: 'から',
    expandedWith: 'で展開',
    
    frequency: '頻度',
    selectNode: 'ノードを選択',
    clickToExpand: 'ノードをクリックして展開ボタンを押してください',
    addWords: '単語を追加してみてください',
    selectedWord: '選択された単語',
    example: '例文'
  },
  zh: {
    appTitle: '🧠 Rethink Vocab',
    appSubtitle: '通过扩展单词学习的新方法',
    
    languageSettings: '语言设置',
    learningLanguage: '学习语言',
    nativeLanguage: '母语',
    
    inputPlaceholder: '输入要学习的单词',
    addWord: '添加单词',
    adding: '添加中...',
    expand: '扩展',
    
    listMode: '📋 列表模式',
    mapMode: '🗺️ 地图模式',
    
    totalWords: '总单词数',
    connections: '连接',
    categories: '类别',
    
    expandedFrom: '从',
    expandedWith: '扩展为',
    
    frequency: '频率',
    selectNode: '选择节点',
    clickToExpand: '点击节点然后按扩展按钮',
    addWords: '尝试添加一些单词',
    selectedWord: '选定的单词',
    example: '例句'
  },
  es: {
    appTitle: '🧠 Rethink Vocab',
    appSubtitle: 'Una nueva forma de aprender expandiendo palabras',
    
    languageSettings: 'Configuración de idioma',
    learningLanguage: 'Idioma de aprendizaje',
    nativeLanguage: 'Idioma nativo',
    
    inputPlaceholder: 'Ingresa una palabra para aprender',
    addWord: 'Agregar palabra',
    adding: 'Agregando...',
    expand: 'Expandir',
    
    listMode: '📋 Modo lista',
    mapMode: '🗺️ Modo mapa',
    
    totalWords: 'Total de palabras',
    connections: 'Conexiones',
    categories: 'Categorías',
    
    expandedFrom: 'desde',
    expandedWith: 'expandido con',
    
    frequency: 'Frecuencia',
    selectNode: 'Selecciona un nodo',
    clickToExpand: 'Haz clic en un nodo y luego presiona el botón expandir',
    addWords: 'Intenta agregar algunas palabras',
    selectedWord: 'Palabra seleccionada',
    example: 'Ejemplo'
  },
  fr: {
    appTitle: '🧠 Rethink Vocab',
    appSubtitle: 'Une nouvelle façon d\'apprendre en étendant les mots',
    
    languageSettings: 'Paramètres de langue',
    learningLanguage: 'Langue d\'apprentissage',
    nativeLanguage: 'Langue maternelle',
    
    inputPlaceholder: 'Entrez un mot à apprendre',
    addWord: 'Ajouter un mot',
    adding: 'Ajout...',
    expand: 'Étendre',
    
    listMode: '📋 Mode liste',
    mapMode: '🗺️ Mode carte',
    
    totalWords: 'Total des mots',
    connections: 'Connexions',
    categories: 'Catégories',
    
    expandedFrom: 'de',
    expandedWith: 'étendu avec',
    
    frequency: 'Fréquence',
    selectNode: 'Sélectionnez un nœud',
    clickToExpand: 'Cliquez sur un nœud puis appuyez sur le bouton étendre',
    addWords: 'Essayez d\'ajouter des mots',
    selectedWord: 'Mot sélectionné',
    example: 'Exemple'
  },
  de: {
    appTitle: '🧠 Rethink Vocab',
    appSubtitle: 'Ein neuer Weg zu lernen durch Erweitern von Wörtern',
    
    languageSettings: 'Spracheinstellungen',
    learningLanguage: 'Lernsprache',
    nativeLanguage: 'Muttersprache',
    
    inputPlaceholder: 'Geben Sie ein Wort zum Lernen ein',
    addWord: 'Wort hinzufügen',
    adding: 'Hinzufügen...',
    expand: 'Erweitern',
    
    listMode: '📋 Listenmodus',
    mapMode: '🗺️ Kartenmodus',
    
    totalWords: 'Gesamtwörter',
    connections: 'Verbindungen',
    categories: 'Kategorien',
    
    expandedFrom: 'von',
    expandedWith: 'erweitert mit',
    
    frequency: 'Häufigkeit',
    selectNode: 'Knoten auswählen',
    clickToExpand: 'Klicken Sie auf einen Knoten und drücken Sie dann die Erweitern-Taste',
    addWords: 'Versuchen Sie, einige Wörter hinzuzufügen',
    selectedWord: 'Ausgewähltes Wort',
    example: 'Beispiel'
  },
  it: {
    appTitle: '🧠 Rethink Vocab',
    appSubtitle: 'Un nuovo modo di imparare espandendo le parole',
    
    languageSettings: 'Impostazioni lingua',
    learningLanguage: 'Lingua di apprendimento',
    nativeLanguage: 'Lingua madre',
    
    inputPlaceholder: 'Inserisci una parola da imparare',
    addWord: 'Aggiungi parola',
    adding: 'Aggiungendo...',
    expand: 'Espandi',
    
    listMode: '📋 Modalità lista',
    mapMode: '🗺️ Modalità mappa',
    
    totalWords: 'Parole totali',
    connections: 'Connessioni',
    categories: 'Categorie',
    
    expandedFrom: 'da',
    expandedWith: 'espanso con',
    
    frequency: 'Frequenza',
    selectNode: 'Seleziona un nodo',
    clickToExpand: 'Clicca su un nodo poi premi il pulsante espandi',
    addWords: 'Prova ad aggiungere alcune parole',
    selectedWord: 'Parola selezionata',
    example: 'Esempio'
  },
  pt: {
    appTitle: '🧠 Rethink Vocab',
    appSubtitle: 'Uma nova forma de aprender expandindo palavras',
    
    languageSettings: 'Configurações de idioma',
    learningLanguage: 'Idioma de aprendizagem',
    nativeLanguage: 'Idioma nativo',
    
    inputPlaceholder: 'Digite uma palavra para aprender',
    addWord: 'Adicionar palavra',
    adding: 'Adicionando...',
    expand: 'Expandir',
    
    listMode: '📋 Modo lista',
    mapMode: '🗺️ Modo mapa',
    
    totalWords: 'Total de palavras',
    connections: 'Conexões',
    categories: 'Categorias',
    
    expandedFrom: 'de',
    expandedWith: 'expandido com',
    
    frequency: 'Frequência',
    selectNode: 'Selecione um nó',
    clickToExpand: 'Clique em um nó e depois pressione o botão expandir',
    addWords: 'Tente adicionar algumas palavras',
    selectedWord: 'Palavra selecionada',
    example: 'Exemplo'
  },
  ru: {
    appTitle: '🧠 Rethink Vocab',
    appSubtitle: 'Новый способ обучения через расширение слов',
    
    languageSettings: 'Настройки языка',
    learningLanguage: 'Язык изучения',
    nativeLanguage: 'Родной язык',
    
    inputPlaceholder: 'Введите слово для изучения',
    addWord: 'Добавить слово',
    adding: 'Добавление...',
    expand: 'Расширить',
    
    listMode: '📋 Режим списка',
    mapMode: '🗺️ Режим карты',
    
    totalWords: 'Всего слов',
    connections: 'Соединения',
    categories: 'Категории',
    
    expandedFrom: 'из',
    expandedWith: 'расширено с',
    
    frequency: 'Частота',
    selectNode: 'Выберите узел',
    clickToExpand: 'Нажмите на узел, затем нажмите кнопку расширения',
    addWords: 'Попробуйте добавить несколько слов',
    selectedWord: 'Выбранное слово',
    example: 'Пример'
  }
};

// 언어 정보 가져오기
export const getLanguageInfo = (code: SupportedLanguage): LanguageInfo => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code) || SUPPORTED_LANGUAGES[1]; // 기본값: 영어
};

// 관계 타입 번역
export const getRelationshipTranslation = (relationship: RelationshipType, language: SupportedLanguage): string => {
  return RELATIONSHIP_TRANSLATIONS[language]?.[relationship] || RELATIONSHIP_TRANSLATIONS['en'][relationship];
};

// UI 텍스트 번역
export const getUITranslation = (key: string, language: SupportedLanguage): string => {
  return UI_TRANSLATIONS[language]?.[key] || UI_TRANSLATIONS['en']?.[key] || key;
}; 