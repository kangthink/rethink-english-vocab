# Rethink English Vocab - Design System

## 색상 팔레트 (Color Palette)

### Primary Colors
- **Primary Blue**: `#4A90E2` - 메인 브랜드 색상
- **Primary Green**: `#2ECC71` - 성공, 완료 상태
- **Primary Yellow**: `#F1C40F` - 강조, 주의 색상
- **Primary Orange**: `#FF8C42` - 액션, 경고 색상

### Secondary Colors
- **Light Blue**: `#E8F4FD` - 배경, 카드 배경
- **Light Green**: `#E8F8F5` - 성공 배경
- **Light Yellow**: `#FEF9E7` - 주의 배경
- **Light Orange**: `#FFF4E6` - 경고 배경

### Neutral Colors
- **Dark**: `#2C3E50` - 주요 텍스트
- **Medium**: `#7F8C8D` - 보조 텍스트
- **Light**: `#BDC3C7` - 비활성 텍스트
- **Background**: `#F8F9FA` - 페이지 배경
- **White**: `#FFFFFF` - 카드, 모달 배경

## 타이포그래피 (Typography)

### Font Family
- **Primary**: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Secondary**: `'Poppins', sans-serif` (제목용)

### Font Sizes
- **h1**: 32px (2rem) - 페이지 제목
- **h2**: 24px (1.5rem) - 섹션 제목
- **h3**: 20px (1.25rem) - 서브섹션 제목
- **body**: 16px (1rem) - 본문 텍스트
- **small**: 14px (0.875rem) - 보조 텍스트
- **caption**: 12px (0.75rem) - 캡션, 라벨

### Font Weights
- **Light**: 300
- **Regular**: 400
- **Medium**: 500
- **Semi-bold**: 600
- **Bold**: 700

## 간격 (Spacing)

### 기본 단위: 4px
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px
- **3xl**: 64px

## 컴포넌트 스타일

### Cards
```css
.card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 16px;
}

.card-hover {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}
```

### Buttons
```css
.btn-primary {
  background: #4A90E2;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #357ABD;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #E8F4FD;
  color: #4A90E2;
  border: 1px solid #4A90E2;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-success {
  background: #2ECC71;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
}

.btn-warning {
  background: #FF8C42;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
}
```

### Input Fields
```css
.input-field {
  background: white;
  border: 2px solid #E8F4FD;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 16px;
  transition: border-color 0.2s ease;
}

.input-field:focus {
  border-color: #4A90E2;
  outline: none;
}

.search-bar {
  background: white;
  border: 2px solid #E8F4FD;
  border-radius: 24px;
  padding: 16px 24px;
  font-size: 16px;
  width: 100%;
}
```

### Progress Bars
```css
.progress-bar {
  background: #E8F4FD;
  border-radius: 12px;
  height: 8px;
  overflow: hidden;
}

.progress-fill {
  background: linear-gradient(90deg, #FF8C42 0%, #F1C40F 100%);
  height: 100%;
  border-radius: 12px;
  transition: width 0.3s ease;
}
```

### Word Cards
```css
.word-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 12px;
  border-left: 4px solid #4A90E2;
}

.word-card-title {
  font-size: 20px;
  font-weight: 600;
  color: #2C3E50;
  margin-bottom: 8px;
}

.word-card-definition {
  font-size: 14px;
  color: #7F8C8D;
  margin-bottom: 12px;
}

.word-card-reactions {
  display: flex;
  gap: 8px;
  font-size: 20px;
}
```

## 아이콘 시스템

### 아이콘 라이브러리
- **Primary**: Lucide Icons
- **Fallback**: Heroicons

### 아이콘 크기
- **Small**: 16px
- **Medium**: 20px
- **Large**: 24px
- **Extra Large**: 32px

## 애니메이션 (Animation)

### 기본 Transitions
```css
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.slide-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
```

### 호버 효과
```css
.hover-lift {
  transition: transform 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
}

.hover-glow {
  transition: box-shadow 0.2s ease;
}

.hover-glow:hover {
  box-shadow: 0 0 20px rgba(74, 144, 226, 0.3);
}
```

## 반응형 디자인 (Responsive Design)

### 브레이크포인트
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### 그리드 시스템
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.grid {
  display: grid;
  gap: 16px;
}

.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }

@media (max-width: 768px) {
  .grid-cols-2, .grid-cols-3 {
    grid-template-columns: 1fr;
  }
}
```

## 다크 모드 (Dark Mode)

### 다크 모드 색상
- **Dark Background**: `#1a1a1a`
- **Dark Card**: `#2d2d2d`
- **Dark Text**: `#f0f0f0`
- **Dark Secondary**: `#a0a0a0`

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1a1a1a;
    --bg-secondary: #2d2d2d;
    --text-primary: #f0f0f0;
    --text-secondary: #a0a0a0;
  }
}
```

## 접근성 (Accessibility)

### 색상 대비
- **Text/Background**: 최소 4.5:1 대비율
- **Large Text**: 최소 3:1 대비율

### 포커스 스타일
```css
.focus-ring:focus {
  outline: 2px solid #4A90E2;
  outline-offset: 2px;
}
```

### 애니메이션 감소
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```