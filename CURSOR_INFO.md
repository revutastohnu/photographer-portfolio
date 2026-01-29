# Кастомний Курсор — Документація

## Огляд

Мінімалістичний, абстрактний курсор для преміального портфоліо фотографа. Без використання іконок камер, прицілів чи фотоапаратів.

## Дизайн

### Основні елементи:
1. **Маленька точка** (6px) — основний курсор
2. **Напівпрозоре коло** (40px) — trailing effect, слідує за точкою з затримкою

### Анімації:
- **Smooth trailing effect**: коло запізнюється за точкою (створює відчуття інерції)
- **Apple-level easing**: cubic-bezier(0.16, 1, 0.3, 1)
- **Hover states**:
  - На фото → коло збільшується до 60px
  - На кнопках/посиланнях → коло зменшується до 24px і стає контрастнішим

## Технічна реалізація

### Файл: `components/CustomCursor.tsx`

```tsx
'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  // Використовує:
  // - useRef для зберігання позицій без перерендерів
  // - requestAnimationFrame для плавної анімації (60fps)
  // - Інерційний рух через лінійну інтерполяцію
}
```

### Ключові особливості:

1. **Trailing effect**:
   ```javascript
   // Точка слідує за мишею з smoothness = 0.15
   dotPos.x += (mousePos.x - dotPos.x) * 0.15;
   
   // Коло слідує з меншою швидкістю = 0.08
   ringPos.x += (mousePos.x - ringPos.x) * 0.08;
   ```

2. **Hover detection**:
   ```javascript
   const isInteractive = !!target.closest('button, a, [role="button"]');
   const isHoveringImage = !!target.closest('[data-cursor="hover"]');
   ```

3. **mix-blend-difference**:
   - Курсор автоматично інвертується на різних фонах
   - Завжди контрастний і видимий

4. **Touch devices**:
   ```javascript
   const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
   if (isTouchDevice) return; // Курсор не рендериться
   ```

5. **Accessibility (prefers-reduced-motion)**:
   ```javascript
   const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   const smoothness = prefersReducedMotion ? 1 : 0.15;
   // Якщо користувач вимкнув анімації, курсор рухається миттєво
   ```

## Використання на сайті

### 1. Підключення в Layout

```tsx
// app/layout.tsx
import CustomCursor from '@/components/CustomCursor';

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <body className="cursor-none"> {/* Ховаємо системний курсор */}
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
```

### 2. Додавання до CSS

```css
/* globals.css */
body {
  cursor: none; /* Ховаємо стандартний курсор */
}

/* Для інтерактивних елементів також */
button, a, [role="button"] {
  cursor: none;
}
```

### 3. Маркування фото для hover-ефекту

Додайте `data-cursor="hover"` до будь-якого елемента:

```tsx
<div data-cursor="hover">
  <Image src="..." alt="..." />
</div>
```

## Налаштування

### Зміна розмірів:

```tsx
// У CustomCursor.tsx, функція animate():

if (isHoveringImage) {
  ringRef.current.style.width = '60px';  // Змініть на бажаний розмір
  ringRef.current.style.height = '60px';
}
```

### Зміна швидкості trailing:

```tsx
const smoothness = 0.15;       // Більше = швидше (0.01-1)
const ringSmoothness = 0.08;   // Більше = швидше
```

### Зміна кольору:

```tsx
// У return блоці:
style={{
  backgroundColor: 'white',  // Змініть на інший колір
}}
```

## Browser Support

✅ Chrome, Safari, Firefox, Edge (останні версії)
✅ Автоматично вимикається на мобільних пристроях
✅ Підтримує prefers-reduced-motion

## Performance

- **60 FPS** завдяки `requestAnimationFrame`
- **Мінімум re-renders** через `useRef`
- **Легкий**: ~2KB gzipped

## Кастомізація для різних секцій

Можна додати різні hover-стани для різних секцій:

```tsx
// Приклад: на About секції курсор синій
const isInAboutSection = !!target.closest('#about');

if (isInAboutSection) {
  dotRef.current.style.backgroundColor = 'blue';
}
```

## Troubleshooting

**Проблема**: Курсор не з'являється
- Перевірте чи `cursor: none` додано до `body`
- Перевірте чи компонент імпортовано в `layout.tsx`

**Проблема**: Курсор затримується
- Збільште значення `smoothness` (наприклад, 0.3)

**Проблема**: Курсор невидимий на деяких фонах
- `mix-blend-difference` має працювати на всіх фонах
- Якщо проблема залишається, змініть колір на контрастний для вашого фону
