# Rethink English Vocab - Design System v2 (Dark Matrix Theme)

## 색상 팔레트 (Color Palette)

### Primary Colors
- **Matrix Green**: `#00FF41` - 메인 액센트 색상
- **Bright Green**: `#39FF14` - 하이라이트, 액션
- **Lime Green**: `#32CD32` - 성공 상태
- **Dark Green**: `#00A86B` - 호버 상태

### Background Colors
- **Deep Dark**: `#0A0E27` - 메인 배경
- **Dark Navy**: `#151A3A` - 카드 배경
- **Navy Blue**: `#1E2444` - 엘리먼트 배경
- **Light Navy**: `#2A3154` - 호버 배경

### Neutral Colors
- **Pure White**: `#FFFFFF` - 주요 텍스트
- **Light Gray**: `#E0E0E0` - 보조 텍스트
- **Medium Gray**: `#A0A0A0` - 비활성 텍스트
- **Dark Gray**: `#4A4A4A` - 경계선

### Accent Colors
- **Electric Blue**: `#00D4FF` - 링크, 정보
- **Warning Orange**: `#FF6B35` - 경고
- **Error Red**: `#FF3366` - 오류

## 타이포그래피 (Typography)

### Font Family
- **Primary**: `'Space Mono', 'JetBrains Mono', monospace` - 코드 스타일
- **Secondary**: `'Inter', -apple-system, sans-serif` - 일반 텍스트

### Font Sizes
- **h1**: 48px (3rem) - 메인 타이틀
- **h2**: 32px (2rem) - 섹션 제목
- **h3**: 24px (1.5rem) - 서브섹션
- **body**: 16px (1rem) - 본문
- **small**: 14px (0.875rem) - 보조 텍스트
- **caption**: 12px (0.75rem) - 캡션

### Font Weights
- **Regular**: 400
- **Medium**: 500
- **Bold**: 700

## 간격 (Spacing)
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px
- **3xl**: 64px

## 컴포넌트 스타일

### Layout
```css
.dark-layout {
  background: #0A0E27;
  min-height: 100vh;
  color: #FFFFFF;
}

.matrix-pattern {
  background-image: 
    repeating-linear-gradient(
      0deg,
      rgba(0, 255, 65, 0.03) 0px,
      transparent 1px,
      transparent 2px,
      rgba(0, 255, 65, 0.03) 3px
    );
  background-size: 3px 3px;
}

.pixel-grid {
  background-image: 
    linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}
```

### Cards
```css
.matrix-card {
  background: #151A3A;
  border: 1px solid rgba(0, 255, 65, 0.2);
  border-radius: 4px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.matrix-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00FF41, transparent);
  animation: scan 3s infinite;
}

@keyframes scan {
  0% { left: -100%; }
  100% { left: 100%; }
}

.matrix-card:hover {
  border-color: #00FF41;
  box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
  transform: translateY(-2px);
}
```

### Buttons
```css
.btn-matrix {
  background: transparent;
  color: #00FF41;
  border: 1px solid #00FF41;
  border-radius: 2px;
  padding: 12px 24px;
  font-family: 'Space Mono', monospace;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.btn-matrix::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: #00FF41;
  transition: left 0.3s ease;
  z-index: -1;
}

.btn-matrix:hover::before {
  left: 0;
}

.btn-matrix:hover {
  color: #0A0E27;
  box-shadow: 0 0 15px rgba(0, 255, 65, 0.5);
}

.btn-primary {
  background: #00FF41;
  color: #0A0E27;
  border: none;
}

.btn-secondary {
  background: transparent;
  border: 1px solid #00D4FF;
  color: #00D4FF;
}
```

### Input Fields
```css
.input-matrix {
  background: #1E2444;
  border: 1px solid rgba(0, 255, 65, 0.3);
  border-radius: 2px;
  padding: 12px 16px;
  color: #FFFFFF;
  font-family: 'Space Mono', monospace;
  transition: all 0.3s ease;
}

.input-matrix:focus {
  border-color: #00FF41;
  outline: none;
  box-shadow: 0 0 10px rgba(0, 255, 65, 0.2);
}

.input-matrix::placeholder {
  color: #A0A0A0;
}
```

### Navigation
```css
.nav-matrix {
  background: #151A3A;
  border-right: 1px solid rgba(0, 255, 65, 0.2);
}

.nav-item {
  padding: 16px 24px;
  border-left: 3px solid transparent;
  transition: all 0.2s ease;
  font-family: 'Space Mono', monospace;
}

.nav-item:hover {
  background: rgba(0, 255, 65, 0.1);
  border-left-color: #00FF41;
}

.nav-item.active {
  background: rgba(0, 255, 65, 0.2);
  border-left-color: #00FF41;
  color: #00FF41;
}
```

### Typography Effects
```css
.glitch-text {
  position: relative;
  color: #00FF41;
  font-family: 'Space Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch-text::before {
  animation: glitch-1 0.5s infinite;
  color: #00D4FF;
  z-index: -1;
}

.glitch-text::after {
  animation: glitch-2 0.5s infinite;
  color: #FF3366;
  z-index: -2;
}

@keyframes glitch-1 {
  0%, 100% { clip-path: inset(0 0 0 0); transform: translate(0); }
  20% { clip-path: inset(33% 0 0 0); transform: translate(-2px, -2px); }
  40% { clip-path: inset(0 0 66% 0); transform: translate(2px, 2px); }
  60% { clip-path: inset(0 0 0 0); transform: translate(0); }
}

@keyframes glitch-2 {
  0%, 100% { clip-path: inset(0 0 0 0); transform: translate(0); }
  20% { clip-path: inset(0 0 66% 0); transform: translate(2px, -2px); }
  40% { clip-path: inset(66% 0 0 0); transform: translate(-2px, 2px); }
  60% { clip-path: inset(0 0 0 0); transform: translate(0); }
}
```

### Progress Bars
```css
.progress-matrix {
  background: #1E2444;
  border: 1px solid rgba(0, 255, 65, 0.3);
  border-radius: 2px;
  height: 8px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  background: linear-gradient(90deg, #00A86B, #00FF41, #39FF14);
  height: 100%;
  transition: width 0.5s ease;
  position: relative;
  overflow: hidden;
}

.progress-fill::after {
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

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

### Loading States
```css
.loader-matrix {
  display: inline-block;
  width: 80px;
  height: 80px;
}

.loader-matrix:after {
  content: " ";
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #00FF41;
  border-color: #00FF41 transparent #00FF41 transparent;
  animation: loader-rotate 1.2s linear infinite;
}

@keyframes loader-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

### Terminal Style
```css
.terminal-window {
  background: #0A0E27;
  border: 1px solid #00FF41;
  border-radius: 4px;
  padding: 16px;
  font-family: 'Space Mono', monospace;
  font-size: 14px;
}

.terminal-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 255, 65, 0.3);
}

.terminal-prompt {
  color: #00FF41;
  margin-right: 8px;
}

.terminal-cursor {
  display: inline-block;
  width: 8px;
  height: 16px;
  background: #00FF41;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
```

### Special Effects
```css
.matrix-rain {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: -1;
}

.matrix-rain::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="20" font-family="monospace" font-size="10" fill="%2300FF41" opacity="0.5">1010101</text></svg>');
  animation: rain 20s linear infinite;
}

@keyframes rain {
  from { transform: translateY(-100%); }
  to { transform: translateY(100%); }
}
```

## 반응형 디자인
- **Mobile**: < 768px - 단일 컬럼
- **Tablet**: 768px - 1024px - 2 컬럼
- **Desktop**: > 1024px - 다중 컬럼

## 접근성
- 고대비 모드 지원
- 키보드 네비게이션
- 스크린 리더 호환
- 애니메이션 감소 옵션