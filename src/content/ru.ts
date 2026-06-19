export type ServiceIcon = "bot" | "terminal" | "layout-dashboard";

export type WikiSlug = "telegram-bots" | "parsers" | "crm";

export type WikiArchitectureStep = {
  step: string;
  title: string;
  text: string;
};

export type WikiFaqItem = {
  q: string;
  a: string;
};

export type WikiEdgeCase = {
  title: string;
  trigger: string;
  resolution: string;
};

export type WikiApiSpecTabKey = "request" | "response200" | "error400";

export type WikiApiSpecs = Record<WikiApiSpecTabKey, string>;

export type WikiRoadmapStepStatus = "done" | "current" | "pending";

export type WikiRoadmapStep = {
  num: string;
  name: string;
  status: WikiRoadmapStepStatus;
  desc: string;
  badge: string;
};

export type WikiConfiguratorProjectType = "tg" | "parser" | "crm";

export type WikiConfiguratorLoadLevel = "low" | "mid" | "high";

export type WikiConfiguratorOption = {
  value: string;
  label: string;
  sub: string;
};

export type WikiConfiguratorQuestion = {
  id: string;
  title: string;
  options: readonly WikiConfiguratorOption[];
};

export type WikiComplianceIcon = "iac" | "security" | "production";

export type WikiComplianceCard = {
  icon: WikiComplianceIcon;
  title: string;
  description: string;
};

export type WikiPipelineLogKind = "success" | "command" | "info";

export type WikiPipelineLogLine = {
  kind: WikiPipelineLogKind;
  text: string;
};

export type WikiPage = {
  title: string;
  category: string;
  description: string;
  dataFlowGraph: string;
  edgeCases: readonly [WikiEdgeCase, WikiEdgeCase];
  apiSpecs: WikiApiSpecs;
  observability: string;
  architecture: readonly WikiArchitectureStep[];
  stack: readonly string[];
  faq: readonly WikiFaqItem[];
};

export type ServiceItem = {
  icon: ServiceIcon;
  badge: string;
  title: string;
  description: string;
  techs: readonly string[];
  glowColor: string;
  beamColorFrom: string;
  beamColorTo: string;
  wikiSlug: WikiSlug;
};

export type WorkflowIcon = "searchCode" | "cpu" | "plug" | "shieldCheck";

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

export type StackKey = "frontend" | "backend" | "infra";

export type ArchitecturePhase = "input" | "core" | "output";

export type ArchitectureNode = {
  id: string;
  phase: ArchitecturePhase;
  name: string;
  tech: string;
  connectionText: string;
  description: string;
};

export type ArchitectureStackLayer = {
  title: string;
  desc: string;
  nodes: readonly ArchitectureNode[];
};

export const WIKI_PAGES: Record<WikiSlug, WikiPage> = {
  "telegram-bots": {
    title: "Умные Telegram-боты",
    category: "Автоматизация в Telegram",
    description:
      "Инжиниринг цифровых продуктов в Telegram: отказоустойчивые боты с инкапсуляцией бизнес-логики, автоматизация воронок, LLM-контекст и асинхронная обработка запросов по архитектурному контракту.",
    dataFlowGraph:
      "User → Telegram API → FastAPI Gateway → Redis Queue → Workers → PostgreSQL",
    edgeCases: [
      {
        title: "Dead Letter Queue (DLQ)",
        trigger: "Воркер не обработал сообщение после N попыток retry.",
        resolution:
          "Задача попадает в DLQ с полным контекстом ошибки. Оператор получает алерт в Telegram log-gateway и может переотправить задачу вручную без потери данных.",
      },
      {
        title: "Rate limiting и retry",
        trigger: "Telegram API возвращает 429 Too Many Requests.",
        resolution:
          "Token bucket с экспоненциальным backoff замедляет отправку. Порядок сообщений в рамках одного чата сохраняется, рассылка не блокирует webhook-поток.",
      },
    ],
    apiSpecs: {
      request: `{
  "update_id": 9485721,
  "message": {
    "message_id": 1024,
    "from": { "id": 418293847, "username": "client_user" },
    "chat": { "id": 418293847, "type": "private" },
    "text": "/start",
    "date": 1718812800
  }
}`,
      response200: `{
  "status": "queued",
  "job_id": "tg-msg-7f3a2c",
  "worker": "celery@worker-02",
  "estimated_ms": 120
}`,
      error400: `{
  "error": "invalid_payload",
  "detail": "message.text exceeds 4096 chars",
  "request_id": "req-9d4e1b"
}`,
    },
    observability:
      "Структурированные логи в Grafana Loki с метками bot_id, chat_id и update_id. Критические ошибки дублируются в Telegram log-gateway для мгновенного реагирования. Uptime-мониторинг webhook-эндпоинта через healthcheck каждые 30 секунд с алертом при latency > 500 ms.",
    stack: ["Aiogram 3.x", "FastAPI", "PostgreSQL", "Redis (Очереди)", "Docker"],
    architecture: [
      {
        step: "01",
        title: "Прием событий через Webhooks",
        text: "Отказ от Long Polling в пользу вебхуков на FastAPI. Бот моментально реагирует на сообщения, выдерживая тысячи RPS.",
      },
      {
        step: "02",
        title: "Очереди задач и Менеджер состояний",
        text: 'Использование Redis для хранения FSM состояний пользователя и Celery/RabbitMQ для фоновых "тяжелых" задач (генерация отчетов, рассылки).',
      },
      {
        step: "03",
        title: "Изоляция и Деплой",
        text: "Упаковка в Docker-контейнеры и автоматический деплой на сервер. Логирование через чат-блок для контроля ошибок в реальном времени.",
      },
    ],
    faq: [
      {
        q: "Как бот справляется с высокой нагрузкой во время рассылок?",
        a: "Все массовые запросы уходят в очередь Redis. Бот не блокирует основной поток выполнения и отправляет сообщения строго по лимитам Telegram API, исключая баны.",
      },
      {
        q: "Можно ли интегрировать бота с CRM, которой уже пользуется компания?",
        a: "Да, благодаря FastAPI мы пишем гибкие шлюзы для интеграции с любой CRM (Amo, Bitrix) или внутренними базами данных через REST API / Webhooks.",
      },
    ],
  },
  parsers: {
    title: "Высокоскоростные парсеры",
    category: "Парсинг & Big Data",
    description:
      "Промышленный data-pipeline: многопоточный сбор из API, маркетплейсов и закрытых источников. Инкапсуляция парсинг-логики, обход anti-bot систем и структурирование данных в enterprise-масштабах.",
    dataFlowGraph:
      "Target Site → Playwright → Proxy Pool → Parser Workers → PostgreSQL/CSV",
    edgeCases: [
      {
        title: "Ротация прокси при 403/423",
        trigger: "Целевой сайт отвечает 403 Forbidden или 423 Locked.",
        resolution:
          "Воркер помечает прокси как burned, берёт следующий из пула и повторяет запрос с новым fingerprint. Статистика по IP ведётся в Redis для балансировки.",
      },
      {
        title: "Exponential backoff",
        trigger: "Временные сбои: 502, timeout, rate limit от донора.",
        resolution:
          "Интервал между повторами удваивается (1s → 2s → 4s → 8s) с jitter ±20%. После 5 неудач задача уходит в DLQ без блокировки всего конвейера.",
      },
    ],
    apiSpecs: {
      request: `{
  "target_url": "https://market.example.com/catalog?page=1",
  "proxy_pool": "residential-eu",
  "output_format": "postgresql",
  "max_concurrency": 32
}`,
      response200: `{
  "status": "completed",
  "records_parsed": 1847,
  "duration_sec": 42.3,
  "output": { "table": "catalog_items", "rows_written": 1847 }
}`,
      error400: `{
  "error": "invalid_target",
  "detail": "URL scheme must be https",
  "request_id": "parse-3c8f2a"
}`,
    },
    observability:
      "Метрики throughput и error rate в Grafana: requests/sec, proxy burn rate, avg parse time. Логи Playwright-сессий с trace_id для воспроизведения падений. Telegram-алерты при падении success rate ниже 95% за 5-минутное окно.",
    stack: ["Python", "Playwright", "Asyncio", "BeautifulSoup4", "Scrapy"],
    architecture: [
      {
        step: "01",
        title: "Имитация поведения человека",
        text: "Использование Playwright в stealth-режиме, динамическая подмена фингерпринтов браузера, заголовков и WebGL контекста.",
      },
      {
        step: "02",
        title: "Ротация резидентных прокси",
        text: "Подключение пула мобильных и резидентных прокси с автоматической сменой IP-адреса при каждой сессии или по таймеру.",
      },
      {
        step: "03",
        title: "Конвейер обработки данных (Pipeline)",
        text: "Асинхронный стриминг данных напрямую в СУБД или JSON/CSV файлы без перегрузки оперативной памяти сервера.",
      },
    ],
    faq: [
      {
        q: "Как скрипт обходит защиту Cloudflare или капчу?",
        a: "Мы используем кастомные сборки браузеров на базе Playwright/Puppeteer со встроенными плагинами обхода капч и умными задержками между кликами, имитирующими реального пользователя.",
      },
      {
        q: "Какая скорость сбора данных?",
        a: "Благодаря архитектуре Asyncio скрипт может одновременно обрабатывать до нескольких сотен веб-страниц в секунду, упираясь только в пропускную способность прокси.",
      },
    ],
  },
  crm: {
    title: "Кастомные CRM-системы",
    category: "Бизнес-инфраструктура",
    description:
      "Кастомные ERP/CRM без абонентской платы: интерфейсы под бизнес-процессы заказчика, учёт, воронки сделок и сквозная аналитика. Асинхронная доставка кода по согласованному архитектурному контракту.",
    dataFlowGraph: "Browser → Next.js → API Routes → Prisma → PostgreSQL",
    edgeCases: [
      {
        title: "Redis cache fallback",
        trigger: "PostgreSQL недоступна, read-only запросы продолжают поступать.",
        resolution:
          "Данные обслуживаются из Redis-кэша с TTL 5 минут. UI показывает баннер «данные могут быть устаревшими», write-операции ставятся в очередь до восстановления БД.",
      },
      {
        title: "JWT/session при сбое БД",
        trigger: "PostgreSQL падает во время refresh сессии.",
        resolution:
          "Access token (15 min) в httpOnly cookie, refresh в Redis. При падении БД refresh отклоняется безопасно — пользователь перенаправляется на login, токены не компрометируются.",
      },
    ],
    apiSpecs: {
      request: `{
  "action": "get_profile",
  "user_id": "usr_8k2m9p",
  "fields": ["name", "role", "deals_count", "last_activity"]
}`,
      response200: `{
  "id": "usr_8k2m9p",
  "name": "Анна Петрова",
  "role": "manager",
  "deals_count": 47,
  "last_activity": "2026-06-19T10:32:00Z"
}`,
      error400: `{
  "error": "validation_error",
  "detail": "user_id format invalid",
  "fields": { "user_id": "must match pattern usr_[a-z0-9]+" }
}`,
    },
    observability:
      "Grafana Loki собирает server-side логи Next.js API с user_id и route. Prometheus метрики: p95 latency, Prisma query duration, cache hit ratio. Uptime Kuma проверяет /api/health каждую минуту; критические инциденты — в Telegram ops-канал.",
    stack: ["Next.js 15", "Tailwind v4", "TypeScript", "PostgreSQL", "Prisma"],
    architecture: [
      {
        step: "01",
        title: "Реактивный интерфейс",
        text: "Сборка SPA/SSR приложения на Next.js. Мгновенный отклик таблиц, интерактивных календарей и дашбордов без перезагрузки страниц.",
      },
      {
        step: "02",
        title: "Безопасность и Роли",
        text: "Разграничение прав доступа (Админ, Мастер, Менеджер) на уровне базы данных PostgreSQL с шифрованием JWT-токенов сессий.",
      },
      {
        step: "03",
        title: "Интегрированная автоматизация",
        text: "Связка CRM с Telegram-уведомлениями для сотрудников о новых заказах и автоматическая генерация счетов/актов в PDF.",
      },
    ],
    faq: [
      {
        q: "В чём выгода кастомной CRM по сравнению с готовыми решениями?",
        a: "Вы не платите ежемесячную подписку за каждого сотрудника. Система создается строго под ваши бизнес-процессы, в ней нет лишнего мусора, и её можно бесконечно масштабировать.",
      },
      {
        q: "Где хранятся данные клиентов и насколько это безопасно?",
        a: "Все данные хранятся на вашем личном выделенном сервере. Доступ к бэкапам и базам данных есть только у вас, что исключает утечки к конкурентам.",
      },
    ],
  },
};

export const WIKI_SLUGS = Object.keys(WIKI_PAGES) as WikiSlug[];

export function isWikiSlug(value: string): value is WikiSlug {
  return value in WIKI_PAGES;
}

export type WikiSeo = {
  title: string;
  description: string;
};

export const WIKI_SEO: Record<WikiSlug, WikiSeo> = {
  "telegram-bots": {
    title: "Умные Telegram-боты | AFANASYEV.DEV",
    description: WIKI_PAGES["telegram-bots"].description,
  },
  parsers: {
    title: "Высокоскоростные парсеры | AFANASYEV.DEV",
    description: WIKI_PAGES.parsers.description,
  },
  crm: {
    title: "Кастомные CRM-системы | AFANASYEV.DEV",
    description: WIKI_PAGES.crm.description,
  },
};

export const WIKI_SEO_FALLBACK: WikiSeo = {
  title: "База знаний | AFANASYEV.DEV",
  description:
    "Техническая база знаний AFANASYEV.DEV: архитектура, API-спецификации и отказоустойчивость решений для автоматизации бизнеса.",
};

export function getWikiSeo(slug: string): WikiSeo {
  return isWikiSlug(slug) ? WIKI_SEO[slug] : WIKI_SEO_FALLBACK;
}

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
    wikiSlug: "telegram-bots",
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
    wikiSlug: "parsers",
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
    wikiSlug: "crm",
  },
] as const;

export const WORKFLOW_STEPS: readonly WorkflowStep[] = [
  {
    num: "01",
    phase: "День 1",
    title: "Проектирование и Архитектурный контракт",
    description:
      "Анализ бизнес-процессов, декомпозиция задач и фиксация финальной стоимости. Формируем структуру базы данных.",
    icon: "searchCode",
    badge: "1 день",
  },
  {
    num: "02",
    phase: "День 2–3",
    title: "Сборка и деплой MVP-ядра",
    description:
      "Развертывание кодовой базы. На 3-й день вы получаете первый стабильный production-билд продукта, который можно тестировать в реальных условиях.",
    icon: "cpu",
    badge: "2–3 дня",
  },
  {
    num: "03",
    phase: "День 4–5",
    title: "Интеграционные шлюзы",
    description:
      "Насыщение MVP логикой: подключение ИИ, сквозных API, платежных систем, кастомных дашбордов или очередей сообщений.",
    icon: "plug",
    badge: "4–5 дней",
  },
  {
    num: "04",
    phase: "День 6–7",
    title: "Стресс-тесты и Безопасность",
    description:
      "Нагрузочное тестирование (имитация пиковых запросов), изоляция баз данных, настройка автоматических бэкапов в S3-облако и передача проекта.",
    icon: "shieldCheck",
    badge: "6–7 дней",
  },
] as const;

export type PricingCard = {
  title: string;
  subtitle: string;
  description: string;
  highlights: readonly string[];
  accent: "cyan" | "purple";
};

export const PRICING_CARDS: readonly PricingCard[] = [
  {
    title: "MVP за неделю",
    subtitle: "Быстрый старт",
    description:
      "Рабочее ядро на 3-й день, полный enterprise-цикл за 7 дней. Фиксированная цена и чёткий scope: один ключевой сценарий, готовый к демо и первым пользователям.",
    highlights: [
      "Production-билд на 3-й день — можно кликать и тестировать",
      "Дни 4–7: интеграции, QA, безопасность и мониторинг",
      "Деплой на Vercel и передача репозитория",
    ],
    accent: "cyan",
  },
  {
    title: "Полноценный продукт",
    subtitle: "Спринты и интеграции",
    description:
      "Итеративная разработка сложных систем: несколько модулей, внешние API, автотесты и масштабирование.",
    highlights: [
      "Спринты по 1–2 недели с приоритетами",
      "Интеграции с CRM, платёжками и API",
      "Docker, CI/CD и долгосрочная поддержка",
    ],
    accent: "purple",
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
  architectureStack: {
    badge: "Production Стек",
    title: "Архитектура моих решений",
    tabs: [
      { key: "frontend" as const, label: "frontend" },
      { key: "backend" as const, label: "backend" },
      { key: "infra" as const, label: "infra" },
    ],
    stacks: {
      frontend: {
        title: "Клиентский слой высокой доступности",
        desc: "Проектирование интерфейсов с упором на Core Web Vitals, гибридный рендеринг и мгновенный отклик без лагов.",
        nodes: [
          {
            id: "fe-1",
            phase: "input",
            name: "User Interaction",
            tech: "Lenis & Motion",
            connectionText: "передает события в →",
            description:
              "Плавный скролл и аппаратные анимации (GPU) для отзывчивости интерфейса.",
          },
          {
            id: "fe-2",
            phase: "core",
            name: "Core Framework",
            tech: "Next.js 15 (App Router)",
            connectionText: "компилирует и деплоит на →",
            description:
              "Серверный рендеринг (SSR) и оптимизация изображений для идеального SEO.",
          },
          {
            id: "fe-3",
            phase: "output",
            name: "Edge Infrastructure",
            tech: "Vercel Edge Network",
            connectionText: "раздает контент пользователю",
            description:
              "Глобальная сеть CDN, минимизирующая Time to First Byte (TTFB) по всему миру.",
          },
        ],
      },
      backend: {
        title: "Асинхронная отказоустойчивая бизнес-логика",
        desc: "Высоконагруженная серверная архитектура, спроектированная под параллельную обработку тысяч запросов без блокировки потоков.",
        nodes: [
          {
            id: "be-1",
            phase: "input",
            name: "Async Event",
            tech: "FastAPI / Aiogram 3",
            connectionText: "обрабатывает событие через →",
            description:
              "Асинхронные роуты и вебхуки для мгновенного приема входящих данных.",
          },
          {
            id: "be-2",
            phase: "core",
            name: "Event Loop Logic",
            tech: "Python (Asyncio)",
            connectionText: "оркестрирует процессы в →",
            description:
              "Многозадачный движок автоматизации, парсинга и ИИ-агентов.",
          },
          {
            id: "be-3",
            phase: "output",
            name: "Isolated Runtime",
            tech: "Docker Containers",
            connectionText: "изолирует и масштабирует код",
            description:
              "Контейнеризация сервисов для безопасной и предсказуемой работы в Cloud.",
          },
        ],
      },
      infra: {
        title: "Автоматизированная инфраструктура & DevOps",
        desc: "Полный цикл CI/CD контроля, автоматическая маршрутизация трафика и изоляция сред.",
        nodes: [
          {
            id: "inf-1",
            phase: "input",
            name: "Code Push",
            tech: "GitHub Actions",
            connectionText: "запускает конвейер сборки →",
            description:
              "Автоматическое тестирование типов TypeScript и проверка линтеров перед деплоем.",
          },
          {
            id: "inf-2",
            phase: "core",
            name: "Data Persistence",
            tech: "PostgreSQL / Prisma",
            connectionText: "синхронизирует данные с →",
            description:
              "Оптимизированные индексы базы данных и безопасные миграции схемы.",
          },
          {
            id: "inf-3",
            phase: "output",
            name: "Network Routing",
            tech: "Proxy-Market / Cloud",
            connectionText: "распределяет нагрузку",
            description:
              "Ротация резидентных прокси для стабильного парсинга и защиты от блокировок.",
          },
        ],
      },
    },
  },
  kpi: {
    items: [
      {
        icon: "timer" as const,
        value: "3-й день",
        label: "MVP в production",
        desc: "Рабочее ядро задеплоено на 3-й день. Полный enterprise-цикл — 7 дней.",
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
    badge: "AI-native · Next.js · Vercel",
    title:
      "Разрабатываю и запускаю цифровые продукты в 3 раза быстрее классических студий",
    stackBadge: {
      label: "Стек: Next.js 16 + Claude",
      href: "https://github.com/toshka20032016-dotcom",
    },
    subtitle:
      "Инжиниринг цифровых продуктов полного цикла: от архитектурного контракта до production-сервиса на Next.js и Tailwind. Асинхронный формат взаимодействия — без раздутых штатов, с прозрачной доставкой кода.",
    primaryCta: "Начать проект",
    secondaryCta: "Смотреть кейсы",
    authorPortrait: {
      alt: "Афанасьев — AI-разработчик, вайбкодер",
      status: "AVAILABLE FOR TASKS",
      captionName: "AFANASYEV.DEV",
      captionRole: "AI PRODUCT ENGINEER",
    },
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
      "Проверенный продуктовый подход: рабочее MVP-ядро на 3-й день, полный production-цикл за 7 дней без лишней бюрократии.",
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
    prevLabel: "Предыдущий проект",
    nextLabel: "Следующий проект",
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
  pricing: {
    badge: "Форматы сотрудничества",
    title: "Выберите",
    titleHighlight: "формат проекта",
    subtitle:
      "От быстрого MVP с фиксированной ценой до полноценного продукта со спринтами и интеграциями.",
    ctaLabel: "Выбрать этот формат",
    cards: PRICING_CARDS,
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
    telegram: {
      label: "Написать в Telegram",
      href: "https://t.me/Zavod_Worker",
    },
    tagsLabel: "Выберите тип задачи (кликните):",
    serviceTags: [
      { id: "bot", label: "Telegram Бот" },
      { id: "crm", label: "Кастомная CRM" },
      { id: "parser", label: "Парсер / Скрипт" },
      { id: "mvp", label: "MVP под ключ" },
      { id: "speed", label: "⚡ Срочная сборка" },
    ],
    fields: {
      name: {
        label: "Ваше имя",
        placeholder: "Константин",
      },
      contact: {
        label: "Telegram или Телефон",
        placeholder: "@username или +7 (999) 000-00-00",
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
  wiki: {
    headerBrand: "AFANASYEV.DEV // WIKI",
    backToHome: "← На главную",
    otherSections: "Другие разделы",
    architectureTitle: "Архитектура и этапы реализации",
    architectureSubtitle:
      "Инкапсуляция логики, асинхронная доставка кода и воспроизводимый деплой по архитектурному контракту",
    dataFlowTitle: "Поток данных (System Architecture)",
    protocolsTitle: "Протоколы надежности и интеграции",
    protocolsSubtitle: "Спецификации API и сценарии отказоустойчивости production-системы",
    edgeCasesTitle: "Граничные случаи (Resilience)",
    apiSpecsTitle: "Спецификация API",
    observabilityTitle: "Наблюдаемость (Metrics & Monitoring)",
    terminal: {
      filename: "architecture_graph.sh",
      copy: "Copy",
      copied: "Copied!",
      command: "cat schema.map",
      noGraph: "Схема недоступна",
    },
    edgeCaseBadge: "Edge Case",
    edgeCaseTriggerLabel: "Trigger:",
    apiSpecTabs: {
      request: "Payload Request",
      response200: "Response JSON (200 OK)",
      error400: "Error 400",
    },
    faqTitle: "Часто задаваемые вопросы (FAQ)",
    faqSubtitle: "Технические нюансы для enterprise-заказчиков и инхаус-команд",
    roadmap: {
      badge: "График доставки",
      title: "Итеративный график инжиниринга",
      nextRelease: "Первый рабочий билд: на 3-й день",
      steps: [
        {
          num: "День 1",
          name: "Архитектура & Контракт",
          status: "done",
          desc: "Фиксация ТЗ, проектирование схем баз данных, развертывание изолированных репозиториев.",
          badge: "100% готовность",
        },
        {
          num: "День 2–3",
          name: "Запуск MVP Ядра",
          status: "current",
          desc: "Сборка основного функционала продукта. На 3-й день вы получаете рабочую, задеплоенную систему, которую можно кликать.",
          badge: "Критический релиз",
        },
        {
          num: "День 4–5",
          name: "Интеграции & ИИ",
          status: "pending",
          desc: "Подключение внешних API, CRM-систем, очередей задач (Redis) и LLM-контекста.",
          badge: "Оптимизация",
        },
        {
          num: "День 6–7",
          name: "QA & Инженерия безопасности",
          status: "pending",
          desc: "Стресс-тестирование, аудит уязвимостей, настройка бэкапов и систем мониторинга.",
          badge: "Enterprise-полировка",
        },
      ],
    },
    configurator: {
      headerLabel: "Конфигуратор архитектуры",
      stepPrefix: "Шаг",
      stepOf: "из",
      totalSteps: 3,
      questions: [
        {
          id: "type",
          title: "Что запускаем?",
          options: [
            { value: "tg", label: "Telegram-бот", sub: "Автоматизация, ИИ, продажи" },
            { value: "parser", label: "Парсер / Скрипт", sub: "Сбор данных, мониторинг" },
            { value: "crm", label: "Кастомная CRM", sub: "Учет, аналитика, ERP" },
          ],
        },
        {
          id: "load",
          title: "Планируемая нагрузка?",
          options: [
            { value: "low", label: "Старт (до 1 000 запр/день)", sub: "Минимальный бюджет" },
            { value: "mid", label: "Бизнес (до 50 000 запр/день)", sub: "Нужна отказоустойчивость" },
            { value: "high", label: "Enterprise (100k+ запр/день)", sub: "Максимальная скорость" },
          ],
        },
      ],
      finalTitle: "Конфигурация успешно подобрана!",
      finalDescription:
        "Оптимальный стек ({stack}) зафиксирован в архитектурном контракте. Запросите смету для согласования scope и итеративной доставки.",
      ctaButton: "Получить смету проекта",
      stacks: {
        tg: {
          low: "Aiogram + SQLite + VPS",
          mid: "FastAPI + Aiogram + Redis",
          high: "FastAPI + Aiogram + Redis + Celery + K8s",
        },
        parser: {
          low: "Python + Requests + Cron",
          mid: "Asyncio + Playwright + PostgreSQL",
          high: "Asyncio + Playwright + Redis Queue + Proxy Pool",
        },
        crm: {
          low: "Next.js + Supabase",
          mid: "Next.js + PostgreSQL + Prisma",
          high: "Next.js + PostgreSQL + Redis + Microservices",
        },
      },
    },
    roi: {
      badge: "ROI Simulator v1.0",
      title: "Расчет эффективности автоматизации",
      hoursLabel: "Часов на рутину в неделю:",
      rateLabel: "Стоимость часа специалиста:",
      hoursUnit: "ч.",
      resultResourceLabel: "Высвобождаемый ресурс:",
      hoursPerWeekUnit: "часов / нед.",
      monthlyBudgetLabel: "Экономия бюджета в месяц:",
      currency: "₽",
      savingsFactors: {
        "telegram-bots": {
          label: "Автоматизация рутины (L1 поддержка, рассылки)",
          ratio: 0.7,
        },
        parsers: {
          label: "Скорость сбора данных и мониторинга цен",
          ratio: 0.9,
        },
        crm: {
          label: "Оптимизация менеджмента и координация постов",
          ratio: 0.6,
        },
      },
      defaultFactor: {
        label: "Автоматизация процессов",
        ratio: 0.5,
      },
    },
    pipeline: {
      title: "CI/CD Pipeline",
      filename: "deploy-pipeline.log",
      lines: [
        { kind: "command", text: "git push origin main" },
        { kind: "info", text: "Trigger: GitHub Actions [build-and-deploy]" },
        { kind: "command", text: "npm run lint && npm run build" },
        { kind: "success", text: "TypeScript compile: 0 errors" },
        { kind: "success", text: "ESLint: passed" },
        { kind: "info", text: "Docker image: afanasyev/app:sha-a4f2c1" },
        { kind: "command", text: "vercel deploy --prod" },
        { kind: "success", text: "Production deployment: READY" },
      ],
    },
    compliance: {
      title: "Enterprise-ready delivery",
      subtitle: "Стандарты, которые ожидает корпоративный заказчик",
      cards: [
        {
          icon: "iac",
          title: "Infrastructure as Code",
          description:
            "Terraform/Pulumi манифесты, версионирование инфраструктуры и воспроизводимые среды dev/staging/prod по архитектурному контракту.",
        },
        {
          icon: "security",
          title: "Security & NDA",
          description:
            "Изолированные окружения, шифрование секретов, NDA и разграничение доступа. Инкапсуляция логики без утечек в multi-tenant.",
        },
        {
          icon: "production",
          title: "Production-ready codebase",
          description:
            "TypeScript strict, CI/CD, автотесты и документированная структура — кодовая база готова к передаче инхаус-команде.",
        },
      ],
    },
    securityGuards: {
      title: "Стандарты качества разработки",
      points: [
        {
          title: "Защита от утечек (Data Isolation)",
          text: "Никаких общих баз данных (Multi-tenant). Каждый проект разворачивается в изолированном Docker-контейнере на вашем сервере с шифрованием секретов через .env.",
        },
        {
          title: "Автоматические Бэкапы (Zero Data Loss)",
          text: "Настройка ежесуточных дампов баз данных PostgreSQL/Redis в независимое облачное хранилище (S3) с глубиной хранения до 30 дней.",
        },
        {
          title: "Чистый и документированный код",
          text: "Соблюдение стандартов архитектуры (Clean Architecture / SOLID). Курс на TypeScript и строгую типизацию — ваш проект сможет легко поддерживать любая инхаус-команда.",
        },
      ],
    },
    notFoundTitle: "Раздел WIKI не найден",
    notFoundCta: "Вернуться на главную",
    seoFallback: WIKI_SEO_FALLBACK,
    seoBySlug: WIKI_SEO,
    ctaTitle: "Нужно похожее решение для бизнеса?",
    ctaSubtitle:
      "Согласуем архитектурный контракт и запустим итеративную доставку — рабочий билд на 3-й день, полный цикл за 7 дней.",
    ctaButton: "Запустить проект →",
    contactHref: "/#contact",
    pages: WIKI_PAGES,
    slugs: WIKI_SLUGS,
  },
} as const;
