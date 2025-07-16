# Rethink English Vocab - Design System v3 (Feminine Aesthetic Theme)

## 색상 팔레트 (Color Palette)

### Primary Colors - 감성적이고 따뜻한 색상
- **Rose Pink**: `#FF6B9D` - 메인 액센트 색상 (기존 Matrix Green 대체)
- **Coral Pink**: `#FF8FA3` - 하이라이트, 밝은 액션
- **Lavender**: `#B19CD9` - 성공 상태, 부드러운 강조
- **Soft Purple**: `#A855F7` - 호버 상태, 고급스러운 액센트

### Background Colors - 따뜻하고 아늑한 배경
- **Deep Plum**: `#2D1B4E` - 메인 배경 (기존 Deep Dark 대체)
- **Warm Purple**: `#3D2A5C` - 카드 배경 (기존 Dark Navy 대체)
- **Dusty Rose**: `#4A3B5C` - 엘리먼트 배경 (기존 Navy Blue 대체)
- **Light Mauve**: `#5C4A6B` - 호버 배경 (기존 Light Navy 대체)

### Neutral Colors - 부드럽고 따뜻한 중성색
- **Pure White**: `#FFFFFF` - 주요 텍스트
- **Cream**: `#FDF2F8` - 밝은 배경, 카드
- **Warm Gray**: `#E5D4DD` - 보조 텍스트 (기존 Light Gray 대체)
- **Medium Gray**: `#B299A6` - 비활성 텍스트
- **Dark Gray**: `#6B5B73` - 경계선

### Accent Colors - 포인트 색상
- **Sky Blue**: `#87CEEB` - 링크, 정보 (기존 Electric Blue 대체)
- **Peach**: `#FFCAB0` - 경고, 따뜻한 알림
- **Mint**: `#B2F5EA` - 성공, 완료 상태

## 디자인 철학

### 여성 친화적 요소
1. **부드러운 색조**: 강렬한 네온 대신 파스텔과 중간 톤 사용
2. **따뜻함**: 차가운 파란색 대신 따뜻한 핑크/퍼플 계열
3. **감성적**: 딱딱한 기술적 느낌 대신 부드럽고 편안한 분위기
4. **세련됨**: 고급스러운 색상 조합으로 세련된 느낌

### 기존 Matrix 테마에서 변경된 점
- **메인 색상**: Matrix Green (#00FF41) → Rose Pink (#FF6B9D)
- **배경**: 차가운 네이비 → 따뜻한 퍼플 계열
- **강조색**: 형광 그린 → 부드러운 핑크/라벤더
- **전체 톤**: 사이버펑크 → 로맨틱 모던

## 컴포넌트 스타일

### Layout - 따뜻한 배경
```css
.feminine-layout {
  background: #2D1B4E;
  background-image: 
    repeating-linear-gradient(
      45deg,
      rgba(255, 107, 157, 0.03) 0px,
      transparent 1px,
      transparent 2px,
      rgba(255, 107, 157, 0.03) 3px
    ),
    radial-gradient(
      circle at 20% 50%,
      rgba(177, 156, 217, 0.05) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(255, 143, 163, 0.05) 0%,
      transparent 50%
    );
  min-height: 100vh;
  color: #FFFFFF;
}
```

### Cards - 부드러운 핑크 강조
```css
.feminine-card {
  background: #3D2A5C;
  border: 1px solid rgba(255, 107, 157, 0.2);
  border-radius: 4px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.feminine-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #FF6B9D, transparent);
  animation: scan 3s infinite;
}

.feminine-card:hover {
  border-color: #FF6B9D;
  box-shadow: 0 8px 25px rgba(255, 107, 157, 0.15);
  transform: translateY(-2px);
}
```

### Buttons - 로즈 핑크 테마
```css
.btn-feminine {
  background: #FF6B9D;
  color: #2D1B4E;
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  font-family: 'Space Mono', monospace;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-feminine:hover {
  background: #FF8FA3;
  box-shadow: 0 8px 25px rgba(255, 107, 157, 0.3);
  transform: translateY(-1px);
}

.btn-secondary-feminine {
  background: transparent;
  border: 1px solid #FF6B9D;
  color: #FF6B9D;
}

.btn-accent-feminine {
  background: #B19CD9;
  color: #2D1B4E;
}
```

### Input Fields - 따뜻한 스타일
```css
.input-feminine {
  background: #4A3B5C;
  border: 1px solid rgba(255, 107, 157, 0.3);
  border-radius: 4px;
  padding: 12px 16px;
  color: #FFFFFF;
  font-family: 'Space Mono', monospace;
  transition: all 0.3s ease;
}

.input-feminine:focus {
  border-color: #FF6B9D;
  outline: none;
  box-shadow: 0 0 15px rgba(255, 107, 157, 0.2);
}

.input-feminine::placeholder {
  color: #B299A6;
}
```

### Navigation - 로맨틱 네비게이션
```css
.nav-feminine {
  background: #3D2A5C;
  border-right: 1px solid rgba(255, 107, 157, 0.2);
}

.nav-item-feminine {
  padding: 16px 24px;
  border-left: 3px solid transparent;
  transition: all 0.2s ease;
  font-family: 'Space Mono', monospace;
}

.nav-item-feminine:hover {
  background: rgba(255, 107, 157, 0.1);
  border-left-color: #FF6B9D;
}

.nav-item-feminine.active {
  background: rgba(255, 107, 157, 0.2);
  border-left-color: #FF6B9D;
  color: #FF6B9D;
}
```

### Progress Bars - 부드러운 그라데이션
```css
.progress-feminine {
  background: rgba(255, 107, 157, 0.1);
  border: 1px solid rgba(255, 107, 157, 0.2);
  border-radius: 3px;
  height: 8px;
  overflow: hidden;
}

.progress-fill-feminine {
  background: linear-gradient(90deg, #FF6B9D, #B19CD9, #FF8FA3);
  height: 100%;
  transition: width 0.5s ease;
  position: relative;
  overflow: hidden;
}

.progress-fill-feminine::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shimmer 2s infinite;
}
```

### Typography Effects - 부드러운 글리치
```css
.soft-glow-text {
  color: #FF6B9D;
  font-family: 'Space Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(255, 107, 157, 0.3);
}

.dreamy-text {
  background: linear-gradient(45deg, #FF6B9D, #B19CD9, #FF8FA3);
  background-size: 200% 200%;
  animation: dreamyGradient 3s ease infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@keyframes dreamyGradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

## 반응형 디자인
- **Mobile**: < 768px - 단일 컬럼, 핑크 강조
- **Tablet**: 768px - 1024px - 2 컬럼, 부드러운 전환
- **Desktop**: > 1024px - 다중 컬럼, 풀 경험

## 접근성
- 충분한 색상 대비 (WCAG AA 준수)
- 키보드 네비게이션 지원
- 스크린 리더 호환성
- 애니메이션 감소 옵션

## 감정적 톤
- **따뜻함**: 차가운 기술 → 따뜻한 감성
- **부드러움**: 날카로운 엣지 → 둥근 모서리
- **세련됨**: 사이버펑크 → 모던 로맨틱
- **친근함**: 위압적 → 접근하기 쉬운