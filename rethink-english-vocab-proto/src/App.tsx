import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { WordNode, WordLink, GraphData, RelationshipType, LanguageSettings, SupportedLanguage } from './types';
import { expandWord, getWordDefinition } from './services/llmService';
import { getUITranslation, getRelationshipTranslation } from './utils/languages';
import WordList from './components/WordList';
import NetworkGraph from './components/NetworkGraph';
import LanguageSettingsComponent from './components/LanguageSettings';
import DrillContainer from './components/drill/DrillContainer';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 30px;
  color: white;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin: 0;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  margin: 10px 0;
  opacity: 0.9;
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
`;

const InputSection = styled.div`
  margin-bottom: 30px;
  display: flex;
  gap: 15px;
  align-items: center;
`;

const WordInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #007bff;
  }
`;

const AddButton = styled.button`
  padding: 12px 24px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ModeSelector = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const ModeButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border: 2px solid #007bff;
  background: ${props => props.active ? '#007bff' : 'white'};
  color: ${props => props.active ? 'white' : '#007bff'};
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? '#0056b3' : '#f8f9fa'};
  }
`;

const StatsPanel = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #007bff;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
`;

type ViewMode = 'explore' | 'drill';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('explore');
  const [exploreViewMode, setExploreViewMode] = useState<'map' | 'list'>('list');
  const [inputWord, setInputWord] = useState('');
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [languageSettings, setLanguageSettings] = useState<LanguageSettings>({
    learningLanguage: 'en',
    nativeLanguage: 'ko'
  });
  const [uiLanguage, setUILanguage] = useState<SupportedLanguage>('ko');
  const [newWordId, setNewWordId] = useState<string | undefined>(undefined);

  // 단어 카테고리 추론
  const inferCategory = (word: string): string => {
    const emotions = ['happy', 'sad', 'angry', 'excited', 'calm', 'nervous', 'joyful', 'depressed', 
                      '기쁨', '슬픔', '화남', '흥미진진', '평온', '긴장', '즐거움', '우울'];
    const nature = ['beautiful', 'ocean', 'mountain', 'forest', 'flower', 'sunset', 'rain',
                    '아름다운', '바다', '산', '숲', '꽃', '일몰', '비'];
    const actions = ['travel', 'study', 'work', 'play', 'run', 'write', 'read', 'dance',
                     '여행', '공부', '일', '놀다', '달리기', '쓰기', '읽기', '춤'];
    
    const lowerWord = word.toLowerCase();
    if (emotions.some(emotion => lowerWord.includes(emotion.toLowerCase()))) return 'emotion';
    if (nature.some(nat => lowerWord.includes(nat.toLowerCase()))) return 'nature';
    if (actions.some(action => lowerWord.includes(action.toLowerCase()))) return 'action';
    return 'concept';
  };

  // 초기 단어 추가
  const addInitialWord = useCallback(async (word: string) => {
    if (!word.trim()) return;

    setIsLoading(true);
    try {
      // LLM API를 사용해서 단어의 기본 정보 가져오기
      const { definition, example } = await getWordDefinition(word.trim(), languageSettings);

      const newNode: WordNode = {
        id: word.toLowerCase(),
        word: word.trim(),
        definition: definition,
        example: example,
        frequency: 5,
        category: inferCategory(word)
      };

      setGraphData(prev => ({
        nodes: [...prev.nodes.filter(n => n.id !== newNode.id), newNode],
        links: prev.links
      }));

      // 새로 추가된 단어 ID 설정 (애니메이션 및 스크롤용)
      setNewWordId(newNode.id);
      // 2초 후 새 단어 하이라이트 제거
      setTimeout(() => setNewWordId(undefined), 2000);

      setInputWord('');
    } catch (error) {
      console.error('Error adding word:', error);
    } finally {
      setIsLoading(false);
    }
  }, [languageSettings]);

  // 단어 확장
  const expandWordCallback = useCallback(async (word: string, relationship: RelationshipType) => {
    setIsLoading(true);
    try {
      const response = await expandWord({ word, relationship }, languageSettings);
      
      if (!response.success) {
        console.error('Failed to expand word:', response.message);
        setIsLoading(false);
        return;
      }

      // 원본 노드를 찾기
      const originalNode = graphData.nodes.find(n => n.word.toLowerCase() === word.toLowerCase());
      if (!originalNode) {
        console.error(`Original node not found for word: ${word}`);
        setIsLoading(false);
        return;
      }
      
      // 중복되지 않는 새로운 노드만 생성
      const existingWords = new Set(graphData.nodes.map(n => n.word.toLowerCase()));
      const newNodes: WordNode[] = response.words
        .filter((expandedWord: WordNode) => !existingWords.has(expandedWord.word.toLowerCase()));

      // 새로운 링크 생성
      const newLinks: WordLink[] = newNodes.map(node => ({
        source: originalNode.id,
        target: node.id,
        relationship: relationship,
        strength: 1
      }));

      setGraphData(prev => ({
        nodes: [...prev.nodes, ...newNodes],
        links: [...prev.links, ...newLinks]
      }));

      // 첫 번째 새 단어로 스크롤 (확장된 단어들 중 첫 번째)
      if (newNodes.length > 0) {
        setNewWordId(newNodes[0].id);
        setTimeout(() => setNewWordId(undefined), 2000);
      }

    } catch (error) {
      console.error('Error expanding word:', error);
    } finally {
      setIsLoading(false);
    }
  }, [graphData.nodes, languageSettings]);

  // 키보드 이벤트 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addInitialWord(inputWord);
    }
  };

  // 통계 계산
  const stats = {
    totalWords: graphData.nodes.length,
    connections: graphData.links.length,
    categories: new Set(graphData.nodes.map(node => node.category)).size
  };

  return (
    <AppContainer>
      <Header>
        <Title>{getUITranslation('appTitle', uiLanguage)}</Title>
        <Subtitle>{getUITranslation('appSubtitle', uiLanguage)}</Subtitle>
      </Header>

      <MainContent>
        {/* 언어 설정 */}
        <LanguageSettingsComponent
          settings={languageSettings}
          onSettingsChange={setLanguageSettings}
          uiLanguage={uiLanguage}
        />

        {/* 입력 섹션 */}
        <InputSection>
          <WordInput
            type="text"
            value={inputWord}
            onChange={(e) => setInputWord(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={getUITranslation('inputPlaceholder', uiLanguage)}
            disabled={isLoading}
          />
          <AddButton
            onClick={() => addInitialWord(inputWord)}
            disabled={isLoading || !inputWord.trim()}
          >
            {isLoading ? getUITranslation('adding', uiLanguage) : getUITranslation('addWord', uiLanguage)}
          </AddButton>
        </InputSection>

        {/* 메인 모드 선택 */}
        <ModeSelector>
          <ModeButton
            active={viewMode === 'explore'}
            onClick={() => setViewMode('explore')}
          >
            🔍 Explore
          </ModeButton>
          <ModeButton
            active={viewMode === 'drill'}
            onClick={() => setViewMode('drill')}
          >
            🎯 Drill
          </ModeButton>
        </ModeSelector>

        {/* Explore 모드에서의 서브 모드 선택 */}
        {viewMode === 'explore' && (
          <ModeSelector>
            <ModeButton
              active={exploreViewMode === 'list'}
              onClick={() => setExploreViewMode('list')}
            >
              {getUITranslation('listMode', uiLanguage)}
            </ModeButton>
            <ModeButton
              active={exploreViewMode === 'map'}
              onClick={() => setExploreViewMode('map')}
            >
              {getUITranslation('mapMode', uiLanguage)}
            </ModeButton>
          </ModeSelector>
        )}

        {/* 통계 패널 */}
        <StatsPanel>
          <StatItem>
            <StatNumber>{stats.totalWords}</StatNumber>
            <StatLabel>{getUITranslation('totalWords', uiLanguage)}</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>{stats.connections}</StatNumber>
            <StatLabel>{getUITranslation('connections', uiLanguage)}</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>{stats.categories}</StatNumber>
            <StatLabel>{getUITranslation('categories', uiLanguage)}</StatLabel>
          </StatItem>
        </StatsPanel>

        {/* 컨텐츠 영역 */}
        {viewMode === 'explore' ? (
          exploreViewMode === 'list' ? (
            <WordList
              words={graphData.nodes}
              onExpandWord={expandWordCallback}
              isLoading={isLoading}
              languageSettings={languageSettings}
              uiLanguage={uiLanguage}
              newWordId={newWordId}
            />
          ) : (
            <NetworkGraph
              data={graphData}
              onExpandWord={expandWordCallback}
              languageSettings={languageSettings}
              uiLanguage={uiLanguage}
            />
          )
        ) : (
          <DrillContainer availableWords={graphData.nodes} />
        )}
      </MainContent>
    </AppContainer>
  );
}

export default App;
