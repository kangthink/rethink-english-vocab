# 🧠 Rethink English Vocab - Prototype

> 단어를 확장하며 배우는 새로운 방법

## 📋 프로젝트 소개

Rethink English Vocab은 단어 학습의 새로운 패러다임을 제시합니다. 기존의 단순 암기식 학습에서 벗어나, **단어 간의 연관성과 의미적 네트워크를 통한 학습**을 지원합니다.

### 🎯 핵심 아이디어

- **연관 확장**: 하나의 단어에서 시작해 동의어, 반의어, 문맥적 연관어로 확장
- **시각적 학습**: 네트워크 그래프를 통한 단어 관계 시각화 (개발 예정)
- **AI 기반**: LLM을 활용한 지능적인 단어 확장 및 예문 생성
- **개인화**: 사용자의 학습 패턴에 맞춘 맞춤형 단어 추천

## 🚀 현재 구현된 기능

### ✅ 완성된 기능
- **단어 추가**: 학습할 단어를 입력하여 어휘 목록에 추가
- **단어 확장**: 5개 방향(동의어, 반의어, 문맥, 은유, 관련어)으로 단어 확장
- **리스트 뷰**: 추가된 단어들을 리스트 형태로 정리하여 표시
- **네트워크 그래프**: 단어 간 관계를 시각적으로 표현하는 인터랙티브 그래프
- **실시간 LLM 연동**: OpenAI GPT API를 통한 실시간 단어 확장 (설정 가능)
- **통계 패널**: 총 단어 수, 연결 수, 카테고리 수 실시간 표시
- **카테고리 자동 분류**: 단어를 감정, 자연, 행동, 개념으로 자동 분류
- **반응형 UI**: 모던하고 직관적인 사용자 인터페이스

### 🚧 개발 중인 기능
- **사용자 데이터 저장**: 로컬스토리지 또는 백엔드 연동
- **고급 필터링**: 카테고리, 빈도, 관계 타입별 필터링
- **음성 발음**: 단어 발음 재생 기능
- **학습 진도 추적**: 개인별 학습 기록 및 분석

## 🛠️ 기술 스택

- **Frontend**: React 18 + TypeScript
- **스타일링**: Styled-components
- **그래프 시각화**: react-force-graph-2d (준비중)
- **상태 관리**: React Hooks (useState, useCallback)
- **AI 연동**: OpenAI API (Mock 데이터로 시뮬레이션)

## 📦 설치 및 실행

### 필수 조건
- Node.js 16.0 이상
- npm 또는 yarn

### 설치
```bash
# 저장소 클론
git clone [repository-url]
cd rethink-english-vocab-proto

# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

### 환경 변수 설정 (선택사항)
프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# OpenAI API 키 (실제 LLM 사용 시 필요)
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here

# Mock 데이터 사용 여부 (true: Mock 사용, false: 실제 API 사용)
REACT_APP_USE_MOCK_DATA=true

# 최대 확장 단어 수
REACT_APP_MAX_EXPANSIONS=5
```

**주의사항:**
- API 키 없이도 Mock 데이터로 모든 기능을 체험할 수 있습니다
- 실제 OpenAI API를 사용하려면 `REACT_APP_USE_MOCK_DATA=false`로 설정하세요
- OpenAI API 사용 시 요금이 발생할 수 있습니다

## 🎮 사용 방법

1. **단어 입력**: 상단 입력창에 학습하고 싶은 영어 단어를 입력합니다
2. **단어 추가**: Enter 키를 누르거나 "단어 추가" 버튼을 클릭합니다
3. **뷰 모드 선택**: "리스트 모드" 또는 "맵 모드"를 선택합니다
4. **단어 확장**: 
   - **리스트 모드**: 각 단어의 "확장" 버튼을 클릭
   - **맵 모드**: 노드를 클릭한 후 원하는 관계 방향을 선택하고 "확장" 버튼 클릭
5. **관계 탐색**: 확장된 단어들을 통해 어휘의 의미적 네트워크를 탐색합니다

### 🗺️ 네트워크 그래프 사용법
- **노드 클릭**: 단어 정보 확인 및 선택
- **확장 방향 선택**: 동의어, 반의어, 문맥, 은유, 관련어 중 선택
- **줌/팬**: 마우스 휠로 확대/축소, 드래그로 이동
- **색상 구분**: 카테고리별로 다른 색상으로 표시
  - 🔴 감정 (emotion)
  - 🟢 자연 (nature) 
  - 🔵 행동 (action)
  - 🟣 개념 (concept)

### 추천 시작 단어
- **감정**: happy, sad, angry, excited
- **자연**: beautiful, ocean, mountain, forest  
- **행동**: travel, study, work, play
- **개념**: freedom, justice, creativity, wisdom

## 🔮 향후 계획

### Phase 1: 기본 기능 완성
- [x] 리스트 뷰 구현
- [x] Mock 데이터 기반 단어 확장
- [ ] 네트워크 그래프 뷰 구현
- [ ] 실제 LLM API 연동

### Phase 2: 고급 기능
- [ ] 사용자 인증 및 데이터 저장
- [ ] 학습 진도 추적
- [ ] 단어 퀴즈 및 테스트 기능
- [ ] 음성 발음 기능

### Phase 3: 소셜 기능
- [ ] 어휘 맵 공유
- [ ] 협업 학습 기능
- [ ] 커뮤니티 단어 추천

## 🤝 기여하기

이 프로젝트는 영어 학습의 혁신을 목표로 합니다. 기여를 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 연락처

프로젝트 관련 문의나 제안사항이 있으시면 언제든 연락주세요!

---

**"단어는 혼자 존재하지 않습니다. 의미의 네트워크 속에서 서로 연결되어 있죠."** 🌐
