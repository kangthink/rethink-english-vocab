

# Spec
- 웹앱
- 모바일 만응형 지원

## 디자인
- @design/clean.png 참고한 디자인시스템 만들어서 디자인
- 완성된 디자인 시스템은 @design/style.md 에 생성

## 도메인
- Aggregate로 묶어서 설계

[WordMapAggregate]
**필드**
- id: uuid
- user_id: uuid (user 참조)
**조회메소드**
+ word_count: int # 사용자가 탐색한 모든 단어 개수
+ thread_count: int # 사용자가 탐색한 모든 스레드 개수
+ words(page, size) : [Word] # 사용자가 탐색한 모든 단어, 실제로 데이터 많으니 lazy 로딩같이 작동해야함 
+ threads(page, size) : [Thread] # 사용자가 탐색한 모든 스레드
+ search(word: string): [Word] # 학습한 단어 내 검색
**확장메소드** (확장 메소드는 ai를 활용해 프롬프트 실행함)
+ expand(word: string, type: synonym | antonym | context): [Word]
+ compare(word1: string, word2: string): ComparisonResult (word1과 word2의 공통점 비교)
+ contrast(word1: string, word2: string): ContrastResult (word1과 word2의 차이점을 비교)
**변경메소드**
+ addR

[Word]
- word: string
- definition: string
- concept: string
- examples: [string]
- reactions: [string] # 사용자가 단어에 대해 표현한 반응, 이모지로 표현
- created_at: datetime
- updated_at: datetime

[Thread]
- name: string
- words: [Word]
- created_at: datetime
- updated_at: datetime



[TrainingAggregate]
- id: uuid
- user_id: uuid (user 참조)
+ trainingKinds: [TrainingKind]
+ create(kind: TrainingKind, wordMap: WordMap): Training # 학습 생성
+ trainingResults: [TrainingResult] # 학습 결과


[TrainingKind]
- id: uuid
- name: string
- description: string
- created_at: datetime
- updated_at: datetime


[TrainingResult]
- id: uuid
- training_id: uuid (training 참조)
- result: string
- created_at: datetime
- updated_at: datetime

## Repository
- 리파지토리는 아이디별 조회, 사용자 아이디별 조회 가능해야함

## 서비스
[AIService] # 인터페이스
- run(input: string, prompt: string): string 
- changeModel(name: string): void # 모델명 변경

[OpenAIService] # openAI API 호출하는 구현체
- run(input: string, prompt: string): string
- changeModel(name: string): void # 모델명 변경



## Implementation Guide
- bun을 기반으로 백엔드 API 구성
- SvelteKit을 사용한 프론트엔드 구성
- aggregate에 lazy loading 필요한 부분은 어떻게 구현할지 고민 필요

### 전체 폴더 구조

```
<root>
    /backend
        /prompts
            /synonym.txt # 반의어를 생성하게 유도하는 프롬프트 템플릿
            ...
        /src
            /infra
                /firebase.ts # 파이어베이스 관련 코드
            /service
                /aiservice.ts # 내부에 인터페이스 및 구현체 포함
            /domain
                /wordmap.ts # aggregate and sub models
                /training.ts
            /repo
                /wordmapRepo.ts
                /trainingRepo.ts
            /api
                /routes
                    /explore.ts
                    /train.ts
                    /history.ts
                    /rank.ts
                    /profile.ts
        /tests
            /domain
                /wordmap.test.ts
                ...
    /frontend
        /src
            /lib
                /components
                /stores
                /utils
            /routes
                /+layout.svelte
                /+page.svelte
                /explore
                /train
                /history
                /rank
                /profile
            /app.html
            /app.css
        /static
        /vite.config.js
        /svelte.config.js
        /package.json

```

### 구현 방식
1. **Backend**: domain 핵심 기능 → 유닛 테스트 → repository 구현 → API 엔드포인트
2. **Frontend**: SvelteKit 프로젝트 → 디자인 시스템 → 컴포넌트 구현 → 라우팅
3. **Integration**: API 연동 → 상태 관리 → 배포

## 화면 구성 (Screen)

### 메인 화면 레이아웃
```
[Header]
- 로고 및 타이틀
- 사용자 프로필 아이콘

[Navigation]
- Explore (탐색)
- Train (학습)
- History (기록)
- Rank (순위)
- Profile (프로필)

[Content Area]
- 각 섹션별 콘텐츠 표시
```

### 화면 구성 요소

#### 1. 탐색 화면 (Explore)
**1.1 탐색 시작 화면**
- 검색 입력 바
- 아티클 목록 (짧은글 + 어휘 주석)
- 최근 탐색한 스레드 목록

**1.2 스레드 화면**
- 스레드 제목 및 정보
- 단어 카드 연결 체인 표시
- 각 단어 카드
  - 단어명, 뜻, 개념적 설명
  - 뉘앙스 설명
  - 사례문장 목록
  - 연결 타입 (동의어/반의어/맥락)
- 단어 확장 버튼 (AI 기반)

**1.3 단어 상세 화면**
- 단어 완전한 정보 표시
- 사용자 반응 (이모지)
- 연결된 다른 단어들
- 학습 기록 표시

#### 2. 학습 화면 (Train)
**2.1 학습 종류 선택 화면**
- 사용 가능한 훈련 종류 목록
- 각 훈련별 설명 및 미리보기
- 추천 훈련 표시

**2.2 학습 실행 화면**
- 훈련 종류에 따른 UI
- 진행률 및 남은 시간
- 문제 표시 및 답변 입력
- 점수 실시간 표시

**2.3 학습 결과 화면**
- 최종 점수 및 등급
- 어휘별 숙련도 측정 결과
- 틀린 문제 리뷰
- 개선 제안
- 결과 저장 및 공유

#### 3. 기록 화면 (History)
**3.1 어휘 지도 (Map)**
- 시각적 어휘 지도 표시
- 스레드별 색상 구분
- 단어 간 연결 관계 표시
- 줌인/줌아웃 기능
- 검색 및 필터링

**3.2 세션 목록**
- 일자별 탐색/학습 세션
- 각 세션별 어휘 목록
- 성과 및 통계 요약
- 세션 상세 보기

#### 4. 순위 화면 (Rank)
**4.1 순위 대시보드**
- 전체 순위 표시
- 내 순위 강조
- 상위 랭커 프로필
- 순위 산정 기준 설명

**4.2 비교 분석**
- 다른 사용자와 어휘 지도 비교
- 학습 패턴 분석
- 추천 학습 방향

#### 5. 프로필 화면 (Profile)
**5.1 개인 정보**
- 사용자 기본 정보
- 학습 통계 요약
- 성취 배지 표시

**5.2 구독 정보**
- 현재 구독 상태
- 이용 가능한 기능
- 업그레이드 옵션

## 화면별 동작 DSL

### Explore 화면
```
SCREEN: Explore
  COMPONENT: SearchBar
    ON: search_input_change
      TRIGGER: search_suggestions_update
    ON: search_submit
      TRIGGER: create_new_thread_from_search
      NAVIGATE: /explore/thread/{thread_id}
  
  COMPONENT: ArticleList
    ON: article_click
      TRIGGER: create_thread_from_article
      NAVIGATE: /explore/thread/{thread_id}
  
  COMPONENT: RecentThreads
    ON: thread_click
      NAVIGATE: /explore/thread/{thread_id}

SCREEN: Thread
  COMPONENT: WordCard
    ON: word_click
      NAVIGATE: /explore/word/{word_id}
    ON: expand_button_click
      TRIGGER: ai_expand_word
      UPDATE: thread_with_new_words
    ON: reaction_add
      TRIGGER: save_word_reaction
      UPDATE: word_reactions
  
  COMPONENT: ConnectionButton
    ON: connection_click(type: synonym|antonym|context)
      TRIGGER: ai_find_connected_words
      UPDATE: thread_with_connected_words

SCREEN: WordDetail
  COMPONENT: WordInfo
    ON: reaction_click
      TRIGGER: toggle_word_reaction
      UPDATE: word_reactions
  
  COMPONENT: ConnectedWords
    ON: connected_word_click
      NAVIGATE: /explore/word/{word_id}
```

### Train 화면
```
SCREEN: TrainList
  COMPONENT: TrainingCard
    ON: training_start_click
      TRIGGER: create_training_session
      NAVIGATE: /train/session/{session_id}

SCREEN: TrainingSession
  COMPONENT: Question
    ON: answer_submit
      TRIGGER: evaluate_answer
      UPDATE: session_progress
      CONDITION: if_last_question
        NAVIGATE: /train/result/{session_id}
      ELSE:
        UPDATE: next_question
  
  COMPONENT: ProgressBar
    ON: session_progress_update
      UPDATE: progress_percentage

SCREEN: TrainingResult
  COMPONENT: ResultSummary
    ON: result_save
      TRIGGER: save_training_result
      UPDATE: user_vocabulary_proficiency
  
  COMPONENT: ReviewButton
    ON: review_click
      NAVIGATE: /train/review/{session_id}
  
  COMPONENT: RetryButton
    ON: retry_click
      TRIGGER: create_new_training_session
      NAVIGATE: /train/session/{new_session_id}
```

### History 화면
```
SCREEN: VocabularyMap
  COMPONENT: MapCanvas
    ON: word_node_click
      NAVIGATE: /explore/word/{word_id}
    ON: thread_cluster_click
      NAVIGATE: /explore/thread/{thread_id}
    ON: zoom_change
      UPDATE: map_zoom_level
  
  COMPONENT: MapControls
    ON: filter_change
      UPDATE: map_filter_criteria
      TRIGGER: refresh_map_display
    ON: search_input
      TRIGGER: highlight_matching_words
      UPDATE: map_search_results

SCREEN: SessionList
  COMPONENT: SessionCard
    ON: session_click
      NAVIGATE: /history/session/{session_id}
  
  COMPONENT: DateFilter
    ON: date_range_change
      TRIGGER: filter_sessions_by_date
      UPDATE: session_list
```

### Rank 화면
```
SCREEN: RankDashboard
  COMPONENT: RankingList
    ON: user_profile_click
      NAVIGATE: /rank/user/{user_id}
  
  COMPONENT: MyRankCard
    ON: compare_click
      NAVIGATE: /rank/compare/{user_id}

SCREEN: UserComparison
  COMPONENT: ComparisonChart
    ON: metric_toggle
      UPDATE: comparison_metrics
      TRIGGER: refresh_comparison_data
```

### Profile 화면
```
SCREEN: ProfileDashboard
  COMPONENT: UserInfo
    ON: edit_profile_click
      NAVIGATE: /profile/edit
  
  COMPONENT: SubscriptionCard
    ON: upgrade_click
      NAVIGATE: /profile/subscription
  
  COMPONENT: AchievementBadges
    ON: badge_click
      TRIGGER: show_achievement_detail
      UPDATE: achievement_modal
```

### 반응형 디자인
**모바일 (< 768px)**
- 햄버거 메뉴
- 카드 형태 세로 배치
- 터치 친화적 버튼 크기

**태블릿 (768px - 1024px)**
- 사이드바 네비게이션
- 2열 카드 배치
- 터치 및 마우스 지원

**데스크톱 (> 1024px)**
- 고정 사이드바
- 3열 이상 카드 배치
- 키보드 단축키 지원

### 컴포넌트 구조
```
/src/lib/components
  /common
    - Header.svelte
    - Navigation.svelte
    - SearchBar.svelte
    - Card.svelte
    - Button.svelte
    - Modal.svelte
  /explore
    - ExploreHome.svelte
    - ThreadView.svelte
    - WordCard.svelte
    - WordDetail.svelte
    - ArticleList.svelte
  /train
    - TrainingList.svelte
    - TrainingSession.svelte
    - TrainingResult.svelte
    - QuestionCard.svelte
  /history
    - VocabularyMap.svelte
    - SessionList.svelte
    - SessionCard.svelte
  /rank
    - RankDashboard.svelte
    - UserComparison.svelte
    - RankingList.svelte
  /profile
    - ProfileDashboard.svelte
    - UserInfo.svelte
    - SubscriptionCard.svelte
```

### 상태 관리
- Svelte Stores 사용
- 전역 상태: 사용자 정보, 현재 선택된 단어/스레드, 앱 상태
- 로컬 상태: 컴포넌트 내부 상태, 폼 입력, 모달 상태
- API 상태: 로딩, 에러 처리

### 라우팅
```
/ - 메인 대시보드 (Explore)
/explore - 탐색 화면
/explore/thread/:id - 스레드 상세
/explore/word/:id - 단어 상세
/train - 학습 종류 선택
/train/session/:id - 학습 실행
/train/result/:id - 학습 결과
/train/review/:id - 학습 리뷰
/history - 기록 화면
/history/map - 어휘 지도
/history/session/:id - 세션 상세
/rank - 순위 대시보드
/rank/user/:id - 사용자 프로필
/rank/compare/:id - 사용자 비교
/profile - 프로필 화면
/profile/edit - 프로필 편집
/profile/subscription - 구독 관리
```