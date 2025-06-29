# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Rethink English Vocab is a React-based vocabulary learning application that uses network graphs to visualize word relationships. It helps Korean users expand their English vocabulary through intelligent word connections and practice drills.

## Essential Commands
```bash
# Install dependencies
npm install

# Start development server (port 3003)
npm start

# Build for production
npm build

# Run tests
npm test

# Run a specific test file
npm test src/components/WordList.test.tsx
```

## Custom Commands

이 섹션에서는 이 프로젝트를 위한 custom commands를 정의합니다. Claude Code에서 이 명령어들을 사용할 수 있습니다.

### @new-drill
새로운 drill 컴포넌트를 생성합니다.
- `src/components/drill/` 폴더에 새 컴포넌트 생성
- TypeScript와 styled-components 사용
- `DrillProps` interface 구현
- 기본 테스트 파일도 함께 생성

### @add-word-type
새로운 단어 관계 타입을 추가합니다.
- `src/types/index.ts`에 새 관계 타입 추가
- `llmService.ts`의 mock data에 예시 추가
- `NetworkGraph.tsx`에서 새 타입 시각화 지원

### @setup-env
환경 설정 파일을 생성합니다.
- `.env` 파일 생성 with 필요한 환경 변수들
- OpenAI API 키 설정 가이드 제공
- Mock data 설정 옵션 설명

### @debug-llm
LLM 서비스 디버깅을 위한 로그 추가:
- API 호출 상태 확인
- Mock data vs Real API 전환 상태 표시
- 에러 핸들링 개선

### @test-component [component-name]
특정 컴포넌트에 대한 comprehensive test 생성:
- React Testing Library 사용
- 사용자 상호작용 테스트 포함
- llmService mocking 포함

### @optimize-graph
NetworkGraph 성능 최적화:
- 노드 수가 많을 때의 렌더링 최적화
- 메모리 사용량 최적화
- 애니메이션 성능 개선

### @refactor-styles
styled-components 스타일링 리팩토링:
- 공통 테마 변수 추출
- 반응형 디자인 개선
- 다크모드 지원 추가

### @add-language [language-code]
새로운 언어 지원 추가:
- `src/utils/languages.ts`에 새 언어 추가
- UI 텍스트 번역 추가
- 언어별 단어 확장 로직 구현

## Architecture Overview

### Core Technologies
- React 19.1.0 with TypeScript
- Styled-components for styling
- react-force-graph-2d/3d for network visualization
- OpenAI GPT API for word expansion
- Create React App as build tool

### Key Application Flow
1. **Word Input** → User adds a word in App.tsx
2. **Word Expansion** → llmService.ts calls OpenAI API to generate related words
3. **Visualization** → NetworkGraph.tsx renders word relationships as a graph
4. **Practice** → DrillContainer.tsx orchestrates vocabulary practice exercises

### Service Layer Architecture
- `llmService.ts`: Handles all OpenAI API interactions with automatic fallback to mock data
- `drillService.ts`: Generates practice exercises based on current vocabulary

### Component Hierarchy
```
App.tsx
├── LanguageSettings.tsx (language configuration)
├── NetworkGraph.tsx (word relationship visualization)
├── WordList.tsx (linear word view)
└── DrillContainer.tsx (practice mode)
    ├── DefinitionMatching.tsx
    ├── WordRecall.tsx
    └── FillInBlank.tsx
```

### Data Flow Patterns
- Words are stored in App.tsx state as an array of Word objects
- Word relationships use 5 types: synonym, antonym, context, metaphor, related
- All components receive word data via props from App.tsx
- Language settings affect both UI language and word expansion behavior

## Development Guidelines

### Adding New Features
- New drill types go in `src/components/drill/`
- API integrations belong in `src/services/`
- Type definitions must be added to `src/types/`
- Follow existing styled-components patterns for styling

### Working with the LLM Service
- Check `REACT_APP_USE_MOCK_DATA` env var to toggle between real API and mock data
- Mock data is extensive and covers all relationship types
- API responses are typed with `LLMResponse` interface

### Testing Approach
- Component tests use React Testing Library
- Mock the llmService for predictable test results
- Focus on user interactions and visible outcomes

### Environment Setup
Create a `.env` file with:
```
REACT_APP_OPENAI_API_KEY=your-key-here
REACT_APP_USE_MOCK_DATA=false
REACT_APP_MAX_EXPANSIONS=5
```

### Key Implementation Details
- Word categories: emotion, nature, action, concept
- UI is bilingual (Korean/English) with Korean as primary
- No backend/persistence - frontend prototype only
- Network graph uses force-directed layout algorithms

### 사용 방법
Claude Code에서 이 명령어들을 사용하려면:

1. **Direct Command**: `@new-drill` 형태로 직접 명령어 입력
2. **With Parameters**: `@test-component WordList` 형태로 파라미터와 함께 사용
3. **Combined**: `@new-drill WordConnection을 위한 새로운 drill을 만들어줘` 형태로 자연어와 함께 사용

**예시:**
- `@setup-env` → 환경설정 파일을 자동으로 생성
- `@new-drill MultipleChoice` → 객관식 문제 drill 컴포넌트 생성
- `@test-component NetworkGraph` → NetworkGraph 컴포넌트 테스트 작성
- `@add-word-type "rhyme"` → 운율 관계 타입 추가