# Инструкция по запуску проекта Alhimik Studio

## Быстрый старт

### 1. Установка Node.js
Убедитесь, что у вас установлен Node.js версии 18 или выше:
```bash
node --version
```

Если Node.js не установлен, скачайте его с https://nodejs.org/

### 2. Установка зависимостей
Откройте терминал в папке проекта и выполните:
```bash
npm install
```

Это установит все необходимые пакеты из package.json.

### 3. Запуск development сервера
```bash
npm run dev
```

Сайт будет доступен по адресу: http://localhost:3000

### 4. Сборка для production
```bash
npm run build
npm start
```

## Возможные проблемы и решения

### Ошибка "Cannot find module"
Решение: Удалите node_modules и переустановите:
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### Ошибка порта (Port already in use)
Решение: Используйте другой порт:
```bash
PORT=3001 npm run dev
```

### Ошибки TypeScript
Решение: Убедитесь, что используется правильная версия TypeScript:
```bash
npm install typescript@latest --save-dev
```

## Настройка для вашего проекта

### 1. Обновите контент
Отредактируйте следующие файлы:
- `app/layout.tsx` - метаданные сайта (title, description)
- `components/sections/Footer.tsx` - контактная информация
- `components/sections/Header.tsx` - логотип и навигация

### 2. Добавьте изображения
Разместите изображения в папке `public/images/`:
- `public/images/portfolio/` - изображения проектов
- `public/images/team/` - фото команды
- `public/images/logo.png` - логотип компании

### 3. Настройте форму обратной связи
В файле `app/contact/page.tsx` найдите функцию `handleSubmit` и настройте отправку:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Вариант 1: Отправка на ваш backend
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  
  // Вариант 2: Использование EmailJS
  // import emailjs from '@emailjs/browser';
  // await emailjs.send('service_id', 'template_id', formData, 'public_key');
  
  // Вариант 3: Telegram Bot
  // await fetch(`https://api.telegram.org/bot{TOKEN}/sendMessage`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     chat_id: 'YOUR_CHAT_ID',
  //     text: `Новая заявка: ${formData.name}...`
  //   })
  // });
};
```

### 4. Настройте Google Analytics
Создайте файл `lib/gtag.ts` и добавьте в layout:

```typescript
// lib/gtag.ts
export const GA_TRACKING_ID = 'G-XXXXXXXXXX';

// В app/layout.tsx добавьте скрипты
<Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
<Script id="google-analytics">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_TRACKING_ID}');
  `}
</Script>
```

### 5. Настройте цвета бренда
Откройте `tailwind.config.ts` и измените цвета:

```typescript
colors: {
  primary: {
    500: '#ВАШ_ЦВЕТ', // Основной цвет
  },
  accent: {
    500: '#ВАШ_ЦВЕТ', // Акцентный цвет
  },
}
```

## Развертывание на Vercel

### Способ 1: Через GitHub
1. Загрузите проект на GitHub
2. Зайдите на https://vercel.com
3. Нажмите "Import Project"
4. Выберите ваш репозиторий
5. Нажмите "Deploy"

### Способ 2: Через CLI
```bash
npm install -g vercel
vercel login
vercel
```

## Развертывание на других платформах

### Netlify
1. Зайдите на https://netlify.com
2. Перетащите папку проекта (после npm run build)
3. Или подключите через GitHub

### Хостинг с cPanel
1. Соберите проект: `npm run build`
2. Загрузите на сервер через FTP
3. Установите Node.js на хостинге
4. Запустите: `npm start`

## Добавление 3D элементов

Для добавления интерактивных 3D элементов создайте компонент:

```typescript
// components/3d/Scene.tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export function Scene() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <OrbitControls />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </Canvas>
  );
}
```

## Полезные команды

```bash
# Проверка кода
npm run lint

# Очистка кэша Next.js
rm -rf .next

# Обновление зависимостей
npm update

# Проверка устаревших пакетов
npm outdated

# Анализ размера bundle
npm run build
npx @next/bundle-analyzer
```

## Рекомендуемые расширения VS Code

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Importer
- Auto Rename Tag
- Path Intellisense

## Дополнительные ресурсы

- Next.js документация: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- React Three Fiber: https://docs.pmnd.rs/react-three-fiber
- TypeScript: https://www.typescriptlang.org/docs

## Поддержка

Если возникли вопросы:
1. Проверьте документацию Next.js
2. Поищите решение на Stack Overflow
3. Создайте issue в репозитории проекта
