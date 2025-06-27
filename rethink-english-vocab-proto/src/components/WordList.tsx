import React, { useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { WordNode, RelationshipType, LanguageSettings, SupportedLanguage } from '../types';
import { getUITranslation, getRelationshipTranslation } from '../utils/languages';

const ListContainer = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #ddd;
  max-height: 600px;
  overflow-y: auto;
`;

// 새로 추가된 단어 하이라이트 애니메이션
const highlightAnimation = keyframes`
  0% {
    background-color: #e3f2fd;
    transform: scale(1.02);
    box-shadow: 0 4px 20px rgba(33, 150, 243, 0.3);
  }
  50% {
    background-color: #bbdefb;
    transform: scale(1.01);
    box-shadow: 0 6px 25px rgba(33, 150, 243, 0.4);
  }
  100% {
    background-color: transparent;
    transform: scale(1);
    box-shadow: none;
  }
`;

const WordItem = styled.div<{ isNew?: boolean }>`
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s, transform 0.2s, box-shadow 0.2s;
  border-radius: 8px;
  margin-bottom: 2px;

  ${props => props.isNew && css`
    animation: ${highlightAnimation} 2s ease-out;
    border-left: 4px solid #2196f3;
  `}

  &:hover {
    background-color: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const WordHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const WordInfo = styled.div`
  flex: 1;
`;

const WordTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const WordDefinition = styled.p`
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
`;

const WordExample = styled.div`
  font-size: 12px;
  color: #888;
  font-style: italic;
  margin-bottom: 8px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 3px solid #007bff;
`;

const WordStats = styled.div`
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
`;

const CategoryBadge = styled.span<{ category: string }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: bold;
  color: white;
  background-color: ${props => {
    const colors: Record<string, string> = {
      emotion: '#ff6b6b',
      nature: '#51cf66',
      action: '#339af0',
      concept: '#845ef7',
      default: '#868e96'
    };
    return colors[props.category] || colors.default;
  }};
`;

const ExpansionInfo = styled.div`
  margin-top: 8px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #007bff;
  font-size: 12px;
  color: #666;
`;

const RelationshipTag = styled.span<{ relationship: RelationshipType }>`
  display: inline-block;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 9px;
  font-weight: bold;
  margin-left: 4px;
  color: white;
  background-color: ${props => {
    const colors: Record<RelationshipType, string> = {
      synonym: '#51cf66',
      antonym: '#ff6b6b',
      context: '#339af0',
      metaphor: '#845ef7',
      related: '#ffd43b'
    };
    return colors[props.relationship];
  }};
`;

const ExpandButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-left: 16px;
  min-width: 120px;
`;

const ExpandButton = styled.button<{ relationship: RelationshipType; disabled?: boolean }>`
  padding: 4px 8px;
  border: 1px solid;
  background: white;
  border-radius: 4px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 10px;
  font-weight: 500;
  transition: all 0.2s;
  opacity: ${props => props.disabled ? 0.5 : 1};

  ${props => {
    const colors: Record<RelationshipType, { border: string; bg: string; color: string; hover: string }> = {
      synonym: { border: '#51cf66', bg: '#51cf6620', color: '#2b8a3e', hover: '#51cf6640' },
      antonym: { border: '#ff6b6b', bg: '#ff6b6b20', color: '#c92a2a', hover: '#ff6b6b40' },
      context: { border: '#339af0', bg: '#339af020', color: '#1864ab', hover: '#339af040' },
      metaphor: { border: '#845ef7', bg: '#845ef720', color: '#5f3dc4', hover: '#845ef740' },
      related: { border: '#ffd43b', bg: '#ffd43b20', color: '#e67700', hover: '#ffd43b40' }
    };
    const style = colors[props.relationship];
    return `
      border-color: ${style.border};
      background: ${style.bg};
      color: ${style.color};
      
      &:hover:not(:disabled) {
        background: ${style.hover};
        transform: translateY(-1px);
      }
    `;
  }}

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const EmptyState = styled.div`
  padding: 40px;
  text-align: center;
  color: #666;
  font-size: 14px;
`;

interface WordListProps {
  words: WordNode[];
  onExpandWord: (word: string, relationship: RelationshipType) => void;
  isLoading: boolean;
  languageSettings: LanguageSettings;
  uiLanguage: SupportedLanguage;
  newWordId?: string; // 새로 추가된 단어의 ID
}

const WordList: React.FC<WordListProps> = ({ words, onExpandWord, isLoading, languageSettings, uiLanguage, newWordId }) => {
  const relationshipTypes: RelationshipType[] = ['synonym', 'antonym', 'context', 'metaphor', 'related'];
  const containerRef = useRef<HTMLDivElement>(null);
  const newWordRef = useRef<HTMLDivElement>(null);

  // 새 단어가 추가되면 해당 위치로 스크롤
  useEffect(() => {
    if (newWordId && newWordRef.current && containerRef.current) {
      // 약간의 지연을 두고 스크롤 (DOM 업데이트 완료 후)
      setTimeout(() => {
        newWordRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }, 100);
    }
  }, [newWordId]);

  if (words.length === 0) {
    return (
      <ListContainer>
        <EmptyState>
          📝 {getUITranslation('addWords', uiLanguage)}
        </EmptyState>
      </ListContainer>
    );
  }

  return (
    <ListContainer ref={containerRef}>
      {words.map(word => {
        const isNewWord = word.id === newWordId;
        return (
          <WordItem 
            key={word.id} 
            isNew={isNewWord}
            ref={isNewWord ? newWordRef : undefined}
          >
            <WordHeader>
              <WordInfo>
                <WordTitle>
                  {word.word}
                  <CategoryBadge category={word.category}>{word.category}</CategoryBadge>
                </WordTitle>
                
                <WordDefinition>{word.definition}</WordDefinition>
                
                {word.example && (
                  <WordExample>
                    💬 {word.example}
                  </WordExample>
                )}
                
                <WordStats>
                  <span>{getUITranslation('frequency', uiLanguage)}: {word.frequency}</span>
                </WordStats>

                {word.expandedFrom && (
                  <ExpansionInfo>
                    📍 '{word.expandedFrom.originalWord}' {getUITranslation('expandedFrom', uiLanguage)} [
                    <RelationshipTag relationship={word.expandedFrom.relationship}>
                      {getRelationshipTranslation(word.expandedFrom.relationship, uiLanguage)}
                    </RelationshipTag>
                    ] {getUITranslation('expandedWith', uiLanguage)}
                  </ExpansionInfo>
                )}
              </WordInfo>

              <ExpandButtons>
                {relationshipTypes.map(relationship => (
                  <ExpandButton
                    key={relationship}
                    relationship={relationship}
                    disabled={isLoading}
                    onClick={() => onExpandWord(word.word, relationship)}
                  >
                    {getRelationshipTranslation(relationship, uiLanguage)}
                  </ExpandButton>
                ))}
              </ExpandButtons>
            </WordHeader>
          </WordItem>
        );
      })}
    </ListContainer>
  );
};

export default WordList; 