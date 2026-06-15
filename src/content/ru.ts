export type ServiceIcon = "bot" | "terminal" | "layout-dashboard";

export type ServiceItem = {
  icon: ServiceIcon;
  badge: string;
  title: string;
  description: string;
  techs: readonly string[];
  glowColor: string;
  beamColorFrom: string;
  beamColorTo: string;
};

export type WorkflowIcon = "searchCode" | "cpu" | "shieldCheck";

export type WorkflowStep = {
  num: string;
  phase: string;
  title: string;
  description: string;
  icon: WorkflowIcon;
  badge: string;
};

export type PortfolioItem = {
  title: string;
  description: string;
  techs: readonly string[];
  githubUrl: string;
  demoUrl: string;
  previewBg: string;
  patternText: string;
};

export const SERVICES_ITEMS: readonly ServiceItem[] = [
  {
    icon: "bot",
    badge: "Автоматизация в Telegram",
    title: "Умные Telegram-боты",
    description:
      "Разработка многофункциональных ботов для автоматизации воронок продаж, интеграции с внешними базами данных и сервисами. Полное управление бизнес-логикой внутри мессенджера.",
    techs: ["Aiogram", "FastAPI", "Webhooks", "Node.js"],
    glowColor: "rgba(6, 182, 212, 0.15)",
    beamColorFrom: "#22d3ee",
    beamColorTo: "#06b6d4",
  },
  {
    icon: "terminal",
    badge: "Парсинг & Big Data",
    title: "Высокоскоростные парсеры",
    description:
      "Скрипты для мгновенного сбора, фильтрации и мониторинга любых объемов данных. Автоматизация рутинных процессов, парсинг маркетплейсов, площадок и API-интеграции любой сложности.",
    techs: ["Python", "Playwright", "Asyncio", "Scrapy"],
    glowColor: "rgba(168, 85, 247, 0.15)",
    beamColorFrom: "#c084fc",
    beamColorTo: "#a855f7",
  },
  {
    icon: "layout-dashboard",
    badge: "Бизнес-инфраструктура",
    title: "Кастомные CRM-системы",
    description:
      "Разработка индивидуальных систем учета клиентов, лидогенерации и аналитики под ключ. Интуитивные интерфейсы для контроля внутренних процессов вашей компании без абонентских плат.",
    techs: ["Next.js", "Tailwind v4", "TypeScript", "PostgreSQL"],
    glowColor: "rgba(236, 72, 153, 0.15)",
    beamColorFrom: "#f472b6",
    beamColorTo: "#ec4899",
  },
] as const;

export const WORKFLOW_STEPS: readonly WorkflowStep[] = [
  {
    num: "01",
    phase: "Анализ & Архитектура",
    title: "Декомпозиция боли и логики бизнеса",
    description:
      "Разбираем ваши текущие бизнес-процессы. Вместо написания ТЗ на 50 страниц, мы создаем верхнеуровневую логику интерфейса и потоков данных. Выявляем узкие места, которые нужно автоматизировать в первую очередь.",
    icon: "searchCode",
    badge: "Старт за 24 часа",
  },
  {
    num: "02",
    phase: "AI-Вайбкодинг",
    title: "Скоростная сборка MVP и генерация кода",
    description:
      "Используя связку Cursor + Claude Code на базе продвинутых промптов и open-source компонентов, я разворачиваю полноценную рабочую экосистему (боты, CRM, парсеры) в 3-4 раза быстрее ручного кодинга. Весь фокус — на UX/UI и бизнес-смыслах.",
    icon: "cpu",
    badge: "Чистый стек без легаси",
  },
  {
    num: "03",
    phase: "Тесты & Деплой",
    title: "Visual QA, автотесты и запуск в Docker",
    description:
      "Прогоняем интерфейсы через Playwright/Puppeteer тесты для проверки адаптивности на смартфонах и мониторах. Исправляем микробаги, упаковываем проект в изолированный Docker-контейнер и деплоим на Vercel или VPS. Вы получаете готовый инструмент.",
    icon: "shieldCheck",
    badge: "100% готовность к нагрузкам",
  },
] as const;

export const PORTFOLIO_ITEMS: readonly PortfolioItem[] = [
  {
    title: "GhostGarage CRM",
    description:
      "Полноценная экосистема для автоматизации процессов в автосервисах и детейлинг-студиях. Включает 3D-конфигуратор выхлопных систем, интерактивный планировщик постов для мастеров и продвинутый учет клиентов. Развернута и протестирована под ключ.",
    techs: ["Next.js", "Tailwind v4", "Framer Motion", "Three.js", "PostgreSQL"],
    githubUrl: "https://github.com/Alotyn/GhostGarage",
    demoUrl: "https://ghost-garage-demo.vercel.app",
    previewBg: "from-slate-900 via-purple-950/40 to-slate-900",
    patternText: "CRM",
  },
  {
    title: "Yandex Pet Day — Landing Page",
    description:
      "Высокотехнологичный одностраничный сайт для технической конференции Yandex Pet Day. Интерактивная программа мероприятия, кастомные таймлайны расписания, сложные адаптивные сетки спикеров и плавная инерционная прокрутка.",
    techs: ["Next.js 16", "Tailwind v4", "Framer Motion", "Lenis Scroll", "Playwright"],
    githubUrl: "https://github.com/Alotyn/yandex-pet-day",
    demoUrl: "https://yandex-pet-day-opal.vercel.app",
    previewBg: "from-slate-900 via-cyan-950/40 to-slate-900",
    patternText: "MVP",
  },
  {
    title: "CS:GO Sniper Arbitrage Bot",
    description:
      "Высокоскоростной скрипт для мониторинга и автоматического перекрестного поиска выгодных сделок на скины между торговыми площадками Steam и DMarket. Обрабатывает API-потоки данных в реальном времени с защитой от банов.",
    techs: ["Python", "Asyncio", "Playwright", "PriceEmpire API", "Docker"],
    githubUrl: "https://github.com/Alotyn/csgo-sniper-bot",
    demoUrl: "https://github.com/Alotyn/csgo-sniper-bot",
    previewBg: "from-slate-900 via-pink-950/40 to-slate-900",
    patternText: "BOT",
  },
] as const;

export const content = {
  meta: {
    title: "OSS Landing Template",
    description: "Премиум лендинг на Next.js, Tailwind, shadcn/ui и Magic UI",
  },
  systemStatus: {
    operational: "SYSTEM STATUS: OPERATIONAL",
    edge: "VERCEL EDGE SITES: ACTIVE",
  },
  nav: {
    brand: "Astrix",
    links: [
      { label: "Услуги", href: "#services" },
      { label: "Процесс", href: "#workflow" },
      { label: "Портфолио", href: "#portfolio" },
      { label: "Контакты", href: "#contact" },
    ],
    cta: "Оставить заявку",
  },
  header: {
    logo: "AFANASYEV.DEV",
    status: "STATUS: ACTIVE FOR PROJECTS",
    edge: "VERCEL EDGE: RUNNING",
  },
  techTicker: {
    items: [
      "NEXT.JS 15",
      "TAILWIND V4",
      "TYPESCRIPT",
      "FRAMER MOTION",
      "PYTHON",
      "PLAYWRIGHT",
      "ASYNCIO",
      "AI-DRIVEN DEV",
      "CURSOR AGENT",
      "CLAUDE 3.5 SONNET",
      "DOCKER",
      "POSTGRESQL",
      "FASTAPI",
      "AIOGRAM",
      "VERCEL EDGE",
    ],
  },
  kpi: {
    items: [
      {
        icon: "timer" as const,
        value: "3-5 дней",
        label: "Скорость сборки MVP",
        desc: "От идеи до готового и протестированного интерфейса в продакшене.",
      },
      {
        icon: "zap" as const,
        value: "в 3 раза",
        label: "Выше эффективность",
        desc: "AI-ассистенты берут на себя рутину, я фокусируюсь на архитектуре и UX.",
      },
      {
        icon: "code" as const,
        value: "0% Legacy",
        label: "Чистота кодовой базы",
        desc: "Современный стек Tailwind v4 и Next.js. Никакого устаревшего мусора.",
      },
      {
        icon: "shield" as const,
        value: "100%",
        label: "Visual QA контроль",
        desc: "Каждый интерфейс автоматически валидируется тестами Playwright.",
      },
    ],
  },
  hero: {
    badge: "Open Source · Next.js · Vercel",
    title: "Мы — рост вашего проекта",
    subtitle:
      "Собираем премиум-лендинги с анимациями, glassmorphism и адаптивом. Стек полностью open source.",
    primaryCta: "Начать проект",
    secondaryCta: "Смотреть кейсы",
    terminal: {
      title: "AI_CORE_GENERATOR.SH",
      engine: "Engine: Cursor Agent + Claude 3.5",
      runLabel: "Запустить тест",
      compiling: "> ИИ компилирует блоки...",
      tabs: {
        bot: "TG BOT",
        parser: "PARSER",
        crm: "CRM SYSTEM",
      },
      commands: {
        bot: [
          "⚡ afanasyev.dev --create-bot --target=telegram",
          "⚙️ Инициализация aiogram & fastapi архитектуры...",
          "🧠 Подключение LLM контекста и промпт-матрицы...",
          "📦 Компиляция Docker-контейнера...",
          "🚀 ДЕПЛОЙ: @tg_business_bot активен [Edge Node: Vercel]",
        ],
        parser: [
          "⚡ afanasyev.dev --init-parser --async=true",
          "🌐 Запуск headless-браузера через Playwright...",
          "🔄 Настройка ротации резидентных прокси...",
          "📊 Поток данных сопряжен с PostgreSQL...",
          "🚀 СТАТУС: Парсинг 50k товаров/мин запущен успешно!",
        ],
        crm: [
          "⚡ afanasyev.dev --generate-crm --stack=nextjs-v4",
          "🎨 Сборка интерфейса на паттернах Magic UI & Tailwind...",
          "🔒 Настройка авторизации JWT & ролей сотрудников...",
          "📈 Интеграция графиков и лидогенерации...",
          "🚀 ГОТОВО: CRM запущена. Время генерации: 4.2 сек.",
        ],
      },
    },
  },
  services: {
    badge: "Сверхскоростная разработка через ИИ",
    title: "Стек моих решений для",
    titleHighlight: "вашего бизнеса",
    subtitle:
      "Использование продвинутых AI-ассистентов позволяет мне проектировать, кодить и тестировать сложнейшие архитектурные модули в 3 раза быстрее классических студий.",
    ctaLabel: "Подробнее о решениях",
    items: SERVICES_ITEMS,
  },
  features: {
    title: "Почему этот шаблон",
    subtitle: "Готовая база для сайтов уровня ваших референсов",
    items: [
      {
        title: "Высокое качество",
        description: "Tailwind + shadcn/ui + Magic UI паттерны из коробки.",
        icon: "sparkles",
      },
      {
        title: "Быстрая доставка",
        description: "Секции как компоненты — собирайте страницу по блокам.",
        icon: "zap",
      },
      {
        title: "Анимации",
        description: "Framer Motion и Lenis для плавного премиум-ощущения.",
        icon: "wand",
      },
      {
        title: "MCP-ready",
        description: "Playwright, Context7, Iconify — Cursor проверяет верстку сам.",
        icon: "bot",
      },
    ],
  },
  workflow: {
    badge: "⚡ Эффективность процесса",
    title: "Как строится",
    titleHighlight: "наша работа",
    subtitle:
      "Проверенный продуктовый подход: от понимания задачи до готового безбагового MVP в продакшене без лишней бюрократии.",
    steps: WORKFLOW_STEPS,
  },
  portfolio: {
    badge: "🚀 Реальные кейсы",
    title: "Живое портфолио &",
    titleHighlight: "тест-драйв продуктов",
    subtitle:
      "Любой проект можно пощупать в один клик. Открытый исходный код на GitHub и рабочие демо-версии, развернутые на Vercel.",
    previewLabel: "Production Build",
    githubLabel: "Исходный код",
    demoLabel: "Запустить демо",
    items: PORTFOLIO_ITEMS,
  },
  process: {
    title: "Как работать с Cursor",
    steps: [
      { step: "01", title: "Скриншот референса", text: "Прикрепите макет в чат Agent." },
      { step: "02", title: "Секция за секцией", text: "Hero → Features → Pricing → FAQ." },
      { step: "03", title: "Visual QA", text: "Playwright или Browser MCP на 375/1280px." },
      { step: "04", title: "Деплой", text: "Vercel MCP — preview за минуты." },
    ],
  },
  testimonials: {
    title: "Что говорят клиенты",
    items: [
      {
        name: "Алексей",
        role: "Founder",
        text: "За вечер собрали лендинг уровня агентства. Cursor + Magic UI — огонь.",
        rating: 5,
      },
      {
        name: "Мария",
        role: "Product",
        text: "MCP с браузером сразу ловит кривую мобильную вёрстку.",
        rating: 5,
      },
      {
        name: "Дмитрий",
        role: "Dev",
        text: "Весь стек OSS, деплой на Vercel без сюрпризов.",
        rating: 5,
      },
      {
        name: "Елена",
        role: "Marketing",
        text: "Анимации как на дорогих Web3-сайтах, но без платных библиотек.",
        rating: 5,
      },
    ],
  },
  faq: {
    badge: "Мифы о вайбкодинге",
    title: "Закрываем главные страхи",
    subtitle:
      "Честные ответы на вопросы, которые задают перед стартом AI-driven разработки.",
    items: [
      {
        q: "А код будет качественным?",
        a: "Да. ИИ ускоряет рутину, а архитектура, ревью и Visual QA остаются за мной. Используется современный стек — Next.js, TypeScript, Tailwind v4 — без легаси и костылей. Каждый интерфейс прогоняется через Playwright на 375px и 1280px.",
      },
      {
        q: "А если ИИ ошибется?",
        a: "Ошибки ловятся на этапе сборки: TypeScript, ESLint, автотесты и ручной code review. Если баг проскочит — исправляю в рамках гарантийного периода. ИИ — инструмент, а не автопилот: финальное решение всегда за разработчиком.",
      },
      {
        q: "Как поддерживать такой проект?",
        a: "Проект упаковывается в Docker, деплоится на Vercel или VPS с понятной структурой папок. Передаю документацию, README и доступ к репозиторию. Любую секцию можно доработать через Cursor Agent — достаточно описать задачу в чате.",
      },
    ],
  },
  cta: {
    title: "Готовы собрать свой лендинг?",
    subtitle: "Форкните шаблон, откройте в Cursor Agent и прикрепите референс.",
    button: "Оставить заявку",
  },
  contact: {
    badge: "💬 Обратная связь",
    title: "Обсудить проект",
    subtitle:
      "Опишите вашу задачу или оставьте контакты. Я изучу логику процессов и свяжусь с вами в течение пары часов.",
    fields: {
      name: {
        label: "Ваше имя",
        placeholder: "Константин",
      },
      contact: {
        label: "Telegram или Email",
        placeholder: "@username или email@domain.com",
      },
      message: {
        label: "Описание задачи (Опционально)",
        placeholder:
          "Нужен телеграм-бот для автосервиса и синхронизация с базой...",
      },
    },
    submit: "Отправить заявку",
    submitting: "Отправка данных...",
    success: "Отправлено!",
  },
  footer: {
    copyright: "© 2026 Astrix · AI-разработка",
    tagline: "Telegram-боты, парсеры, CRM и премиум-лендинги",
    links: [
      { label: "Услуги", href: "#services" },
      { label: "FAQ", href: "#faq" },
      { label: "Портфолио", href: "#portfolio" },
      { label: "Контакты", href: "#contact" },
      { label: "GitHub", href: "https://github.com" },
    ],
  },
} as const;
