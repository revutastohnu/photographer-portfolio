# Локальне тестування webhook з ngrok

## Проблема
Monobank не може відправити webhook на `localhost:3000`, тому подія не створюється в Calendar.

## Рішення: ngrok

### 1. Встановити ngrok
```bash
brew install ngrok
# або
npm install -g ngrok
```

### 2. Запустити ngrok
```bash
ngrok http 3000
```

Отримаєш URL типу: `https://abc123.ngrok.io`

### 3. Оновити .env.local
```bash
NEXT_PUBLIC_BASE_URL=https://abc123.ngrok.io
```

### 4. Рестартувати dev server
```bash
npm run dev
```

### 5. Протестувати
Тепер webhook буде приходити через ngrok → створюватиметься подія в Calendar!

## Альтернатива: Deploy на Vercel
Задеплой на Vercel - там webhook працюватиме автоматично.
