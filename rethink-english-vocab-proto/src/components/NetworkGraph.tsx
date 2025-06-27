import React, { useRef, useState, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { GraphData, WordNode, RelationshipType, LanguageSettings, SupportedLanguage } from '../types';
import { getUITranslation, getRelationshipTranslation } from '../utils/languages';
import styled from 'styled-components';

const GraphContainer = styled.div`
  width: 100%;
  height: 600px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fafafa;
  position: relative;
  overflow: hidden; /* 화면 벗어남 방지 */
  
  canvas {
    max-width: 100% !important;
    max-height: 100% !important;
  }
`;

const ControlPanel = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 8px;
  align-items: center;
  flex-wrap: wrap;
`;

const Button = styled.button<{ active?: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: ${props => props.active ? '#007bff' : '#6c757d'};
  color: white;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const NodeInfoPanel = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px;
  border-radius: 8px;
  max-width: 250px;
  font-size: 12px;
  z-index: 10;
`;

const ZoomControls = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  z-index: 20;
`;

const ZoomButton = styled.button`
  width: 35px;
  height: 35px;
  border: none;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
  
  &:disabled {
    background: rgba(0, 0, 0, 0.3);
    cursor: not-allowed;
  }
`;

interface NetworkGraphProps {
  data: GraphData;
  onExpandWord: (word: string, relationship: RelationshipType) => void;
  languageSettings: LanguageSettings;
  uiLanguage: SupportedLanguage;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ data, onExpandWord, languageSettings, uiLanguage }) => {
  const fgRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedDirection, setSelectedDirection] = useState<RelationshipType>('synonym');
  const [selectedNode, setSelectedNode] = useState<WordNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<WordNode | null>(null);
  const [graphDimensions, setGraphDimensions] = useState({ width: 800, height: 580 });
  const [currentZoom, setCurrentZoom] = useState(1);

  const directions: RelationshipType[] = ['synonym', 'antonym', 'context', 'metaphor', 'related'];

  // 줌 제한 설정
  const MIN_ZOOM = 0.1;  // 최소 10% 축소 (더 넓은 뷰)
  const MAX_ZOOM = 5;    // 최대 500% 확대 (더 세밀한 확대)
  const ZOOM_STEP = 0.2;  // 줌 단계 (더 세밀하게)

  // 줌 제어 함수들
  const handleZoomIn = () => {
    if (fgRef.current && currentZoom < MAX_ZOOM) {
      const newZoom = Math.min(currentZoom + ZOOM_STEP, MAX_ZOOM);
      fgRef.current.zoom(newZoom, 400);
      setCurrentZoom(newZoom);
    }
  };

  const handleZoomOut = () => {
    if (fgRef.current && currentZoom > MIN_ZOOM) {
      const newZoom = Math.max(currentZoom - ZOOM_STEP, MIN_ZOOM);
      fgRef.current.zoom(newZoom, 400);
      setCurrentZoom(newZoom);
    }
  };

  const handleZoomReset = () => {
    if (fgRef.current) {
      fgRef.current.zoomToFit(400, 50);
      setCurrentZoom(1);
    }
  };

  // 줌 변경 감지
  const handleZoomChange = (transform: { k: number; x: number; y: number; }) => {
    setCurrentZoom(transform.k);
  };

  // 데이터 검증 및 정리
  const validateGraphData = (graphData: any) => {
    const nodeIds = new Set(graphData.nodes.map((n: any) => n.id));
    
    // 유효한 링크만 필터링 (source와 target이 모두 존재하는 노드)
    const validLinks = graphData.links.filter((link: any) => {
      const sourceExists = nodeIds.has(link.source) || nodeIds.has(link.source.id);
      const targetExists = nodeIds.has(link.target) || nodeIds.has(link.target.id);
      
      if (!sourceExists || !targetExists) {
        console.warn(`Invalid link found:`, link, 'Available nodes:', Array.from(nodeIds));
        return false;
      }
      return true;
    });

    return {
      nodes: graphData.nodes,
      links: validLinks
    };
  };

  // 검증된 데이터
  const validatedData = validateGraphData(data);

  // 노드 색상 결정
  const getNodeColor = (node: any): string => {
    if (selectedNode && node.id === selectedNode.id) return '#ff6b6b';
    
    const colors: Record<string, string> = {
      emotion: '#ff6b6b',
      nature: '#51cf66',
      action: '#339af0',
      concept: '#845ef7',
      related: '#ffd43b',
      default: '#69b3a2'
    };
    return colors[node.category] || colors.default;
  };

  // 링크 색상 결정
  const getLinkColor = (link: any): string => {
    const colors: Record<RelationshipType, string> = {
      synonym: '#51cf66',
      antonym: '#ff6b6b',
      context: '#339af0',
      metaphor: '#845ef7',
      related: '#ffd43b'
    };
    return colors[link.relationship as RelationshipType] || '#999';
  };

  // 노드 크기 결정
  const getNodeSize = (node: any): number => {
    return Math.max(6, Math.min(16, node.frequency || 8));
  };

  const handleNodeClick = (node: any) => {
    const wordNode = node as WordNode;
    setSelectedNode(wordNode);
  };

  const handleExpandClick = () => {
    if (selectedNode) {
      onExpandWord(selectedNode.word, selectedDirection);
    }
  };

  // 그래프 데이터가 변경될 때 자동으로 화면에 맞춤
  useEffect(() => {
    if (fgRef.current && validatedData.nodes.length > 0) {
      // 노드들을 중앙 근처에 초기 배치
      const centerX = graphDimensions.width / 2;
      const centerY = graphDimensions.height / 2;
      const maxRadius = Math.min(graphDimensions.width, graphDimensions.height) * 0.15; // 화면의 15% 반경 내로 더 조밀하게
      
      validatedData.nodes.forEach((node: any, index: number) => {
        if (!node.fx && !node.fy) {  // 고정되지 않은 노드만
          // 원형으로 배치하되 반경을 제한
          const angle = (index * 2 * Math.PI) / validatedData.nodes.length;
          const radius = Math.min(maxRadius, Math.max(30, validatedData.nodes.length * 3)); // 최소 30px 반경
          node.x = centerX + radius * Math.cos(angle);
          node.y = centerY + radius * Math.sin(angle);
          
          // 초기 속도를 0으로 설정하여 안정화
          node.vx = 0;
          node.vy = 0;
        }
      });

      // 시뮬레이션 완료 후 노드들을 고정시키는 타이머
      setTimeout(() => {
        validatedData.nodes.forEach((node: any) => {
          // 노드들을 현재 위치에 고정
          node.fx = node.x;
          node.fy = node.y;
        });
        
        // 그 후에 화면에 맞춤
        setTimeout(() => {
          if (fgRef.current) {
            try {
              fgRef.current.centerAt(centerX, centerY, 500);
              setTimeout(() => {
                fgRef.current?.zoomToFit(800, 60);
              }, 200);
            } catch (error) {
              console.warn('Graph positioning failed:', error);
            }
          }
        }, 100);
      }, 3000); // 3초 후 노드 고정

      // 초기 그래프 위치 조정
      setTimeout(() => {
        try {
          if (fgRef.current) {
            fgRef.current.centerAt(centerX, centerY, 300);
          }
        } catch (error) {
          console.warn('Initial positioning failed:', error);
        }
      }, 100);
    }
  }, [validatedData, graphDimensions]);

  // 컨테이너 크기 감지
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setGraphDimensions({
          width: Math.max(600, rect.width - 20), // 최소 600px, 패딩 20px
          height: 580
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // 데이터가 없을 때의 처리
  if (validatedData.nodes.length === 0) {
    return (
      <div>
        <ControlPanel>
          <span style={{ fontSize: '14px', color: '#666' }}>
            💡 단어를 추가하여 네트워크 그래프를 시작하세요
          </span>
        </ControlPanel>
        <GraphContainer style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '18px',
          color: '#666'
        }}>
          네트워크 그래프가 비어있습니다
        </GraphContainer>
      </div>
    );
  }

  return (
    <div>
      <ControlPanel>
        <span>확장 방향:</span>
        {directions.map(relationship => (
          <Button
            key={relationship}
            active={selectedDirection === relationship}
            onClick={() => setSelectedDirection(relationship)}
          >
            {getRelationshipTranslation(relationship, uiLanguage)}
          </Button>
        ))}
        <Button 
          onClick={handleExpandClick}
          disabled={!selectedNode}
        >
          {selectedNode ? `"${selectedNode.word}" 확장` : '노드를 선택하세요'}
        </Button>
        <span style={{ fontSize: '12px', color: '#666' }}>
          💡 노드를 클릭한 후 확장 버튼을 누르세요
        </span>
      </ControlPanel>
      
      <GraphContainer ref={containerRef}>
        <ForceGraph2D
          ref={fgRef}
          graphData={validatedData}
          nodeId="id"
          nodeLabel={(node: any) => `
              <div style="background: rgba(0,0,0,0.8); color: white; padding: 8px; border-radius: 4px; max-width: 250px;">
                <strong>${node.word}</strong><br/>
                ${node.definition ? node.definition.substring(0, 80) + '...' : ''}<br/>
                ${node.expandedFrom ? `<div style="margin-top: 4px; padding: 4px; background: rgba(255,255,255,0.1); border-radius: 3px; font-size: 11px;">📍 "${node.expandedFrom.originalWord}"에서 ${getRelationshipTranslation(node.expandedFrom.relationship, uiLanguage)}로 확장</div>` : ''}
                <small>빈도: ${node.frequency || 'N/A'} | ${node.category || 'general'}</small>
              </div>
          `}
          nodeColor={getNodeColor}
          nodeVal={getNodeSize}
          linkColor={getLinkColor}
          linkWidth={(link: any) => Math.max(1, (link.strength || 1) * 2)}
          linkDirectionalArrowLength={4}
          linkDirectionalArrowRelPos={1}
          onNodeClick={handleNodeClick}
          onNodeHover={(node: any) => setHoveredNode(node)}
          cooldownTicks={300}
          d3AlphaDecay={0.1}
          d3VelocityDecay={0.8}
          d3AlphaMin={0.001}
          enableZoomInteraction={true}
          enablePanInteraction={true}
          width={graphDimensions.width}
          height={graphDimensions.height}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          onZoom={handleZoomChange}
          onEngineStop={() => {
            if (fgRef.current) {
              setTimeout(() => {
                try {
                  fgRef.current?.zoomToFit(600, 50);
                  setCurrentZoom(1);
                } catch (error) {
                  console.warn('Auto-fit failed:', error);
                }
              }, 200);
            }
          }}
        />
        
        {/* 줌 제어 버튼들 */}
        <ZoomControls>
          <ZoomButton 
            onClick={handleZoomIn}
            disabled={currentZoom >= MAX_ZOOM}
            title={`확대 (현재: ${Math.round(currentZoom * 100)}%)`}
          >
            +
          </ZoomButton>
          <ZoomButton 
            onClick={handleZoomOut}
            disabled={currentZoom <= MIN_ZOOM}
            title={`축소 (현재: ${Math.round(currentZoom * 100)}%)`}
          >
            −
          </ZoomButton>
          <ZoomButton 
            onClick={handleZoomReset}
            title="화면에 맞춤"
            style={{ fontSize: '12px', background: 'rgba(0, 123, 255, 0.8)' }}
          >
            ⌂
          </ZoomButton>
          {/* 줌 레벨 표시 */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            textAlign: 'center',
            minWidth: '35px'
          }}>
            {Math.round(currentZoom * 100)}%
          </div>
        </ZoomControls>
        
        {(hoveredNode || selectedNode) && (
          <NodeInfoPanel>
            {selectedNode && (
              <div>
                <strong>선택된 단어: {selectedNode.word}</strong>
                <div style={{ marginTop: '8px' }}>
                  {selectedNode.definition && <div>{selectedNode.definition}</div>}
                  {selectedNode.example && (
                    <div style={{ marginTop: '4px', fontStyle: 'italic' }}>
                      {getUITranslation('example', uiLanguage)}: "{selectedNode.example}"
                    </div>
                  )}
                </div>
              </div>
            )}
            {hoveredNode && !selectedNode && (
              <div>
                <strong>{hoveredNode.word}</strong>
                <div>카테고리: {hoveredNode.category || 'general'}</div>
                <div>빈도: {hoveredNode.frequency || 'N/A'}</div>
              </div>
            )}
          </NodeInfoPanel>
        )}
      </GraphContainer>
    </div>
  );
};

export default NetworkGraph; 