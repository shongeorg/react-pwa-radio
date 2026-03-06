# 📻 Українське Радіо PWA

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/shongeorg/react-pwa-radio)

**Українське Радіо** - це Progressive Web Application для прослуховування українських радіостанцій онлайн.

🌐 **Live Demo**: [https://react-pwa-radio.vercel.app/](https://react-pwa-radio.vercel.app/)

## ✨ Можливості

- 📻 300+ українських радіостанцій
- 🎵 Повнофункціональний плеєр (play/pause, stop, prev/next)
- 🌓 Темна/світла тема
- 💾 Збереження налаштувань в LocalStorage
- 📱 Повністю адаптивний дизайн
- 🔄 PWA з офлайн-підтримкою
- 🌐 Web Share API з поділом посиланням на станцію
- 📊 Моніторинг мережі
- 🔍 Пошук по станціях
- ♿ Повна доступність (ARIA, keyboard navigation)

## 🚀 Швидкий старт

### Вимоги
- Node.js 18+
- npm або pnpm

### Встановлення

```bash
# Клонуйте репозиторій
git clone https://github.com/shongeorg/react-pwa-radio.git
cd react-pwa-radio

# Встановіть залежності
npm install
# або
pnpm install
```

### Розробка

```bash
# Запуск dev сервера
npm run dev
```

Додаток буде доступний за адресою [http://localhost:5173](http://localhost:5173)

### Production build

```bash
# Створення production збірки
npm run build

# Перегляд production збірки
npm run preview
```

### Тести

```bash
# Запуск всіх тестів
npm run test

# Тести з UI
npm run test:ui

# Тести в debug режимі
npm run test:debug
```

## 📁 Структура проекту

```
react-pwa-radio/
├── public/              # Статичні файли
├── src/
│   ├── components/      # React компоненти
│   ├── hooks/           # Custom React hooks
│   ├── styles/          # CSS файли
│   ├── App.jsx          # Головний компонент
│   └── main.jsx         # Entry point
├── tests/               # Playwright тести
└── package.json
```

## 🔧 Технології

- **React 18** - UI framework
- **Vite 5** - Build tool
- **vite-plugin-pwa** - PWA support
- **Playwright** - E2E testing
- **CSS3** - Custom properties, BEM methodology

## 🌐 Share Feature

Додаток підтримує поділ посиланнями на конкретні станції:

```
https://react-pwa-radio.vercel.app/#station-uuid
```

При відкритті такого посилання:
1. Автоматично вибирається вказана станція
2. Починається відтворення
3. Скрол до станції в списку

## 📱 PWA

Додаток можна встановити на домашній екран:

1. Відкрийте [react-pwa-radio.vercel.app](https://react-pwa-radio.vercel.app/)
2. Натисніть "Додати на головний екран" у браузері
3. Додаток буде доступний як нативний

## 🎨 CSS Архітектура

Використовується BEM + SMACSS methodology з CSS variables:

```css
/* Block */
.player { }

/* Element */
.player__controls { }

/* Modifier */
.player__button--primary { }
```

## 🤝 Contributing

1. Fork the repository
2. Створіть feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Відкрийте Pull Request

## 📄 Ліцензія

MIT License

## 👤 Автор

- GitHub: [@shongeorg](https://github.com/shongeorg)

## 🔗 Посилання

- [Vercel Deployment](https://react-pwa-radio.vercel.app/)
- [GitHub Repository](https://github.com/shongeorg/react-pwa-radio)
