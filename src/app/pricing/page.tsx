"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Bot,
  Check,
  ChevronDown,
  Code2,
  LayoutTemplate,
  MessageCircle,
  Rocket,
  Shield,
  Sparkles,
  Database,
  Terminal,
  Zap,
  type LucideIcon,
} from "lucide-react";

import PremiumCanvas from "@/components/canvas/PremiumCanvas";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { content, type PricingBenefitIcon } from "@/content/ru";
import { cn } from "@/lib/utils";

const SPRING = { type: "spring" as const, stiffness: 320, damping: 28 };
const SPRING_SOFT = { type: "spring" as const, stiffness: 200, damping: 24 };

const PAGE_PRICE_STEP = 1000;
const URGENT_MULTIPLIER = 1.3;
const URGENT_DAYS_FACTOR = 0.6;
const TELEGRAM_USERNAME = "Zavod_Worker";

const INFO_NOTICE =
  "[INFO]: Ссылка сформирована. После перехода в Telegram просто отправьте готовый текст в чат.";

type ProjectTypeId = "landing" | "parser" | "crm" | "script";
type ModuleId = "telegram" | "supabase" | "ai";

type ProjectType = {
  id: ProjectTypeId;
  label: string;
  price: number;
  days: number;
  description: string;
};

type ModuleOption = {
  id: ModuleId;
  label: string;
  price: number;
  days: number;
  description: string;
};

const PROJECT_TYPES: readonly ProjectType[] = [
  {
    id: "landing",
    label: "Лендинг",
    price: 5900,
    days: 2,
    description: "Премиум-страница с анимациями, SEO и формой заявки",
  },
  {
    id: "parser",
    label: "Парсер",
    price: 9900,
    days: 3,
    description: "Сбор данных, мониторинг цен, anti-ban и cron-расписание",
  },
  {
    id: "crm",
    label: "CRM",
    price: 19900,
    days: 5,
    description: "Кастомная панель, роли, аналитика и интеграции",
  },
  {
    id: "script",
    label: "Микро-скрипт / Бот",
    price: 2900,
    days: 1,
    description:
      "Простые парсеры, автоматизация таблиц, легкие скрипты и боты-автоответчики",
  },
];

const MODULES: readonly ModuleOption[] = [
  {
    id: "telegram",
    label: "Telegram-бот",
    price: 3000,
    days: 1,
    description: "Уведомления, команды, webhook-интеграция с продуктом",
  },
  {
    id: "supabase",
    label: "Supabase / БД",
    price: 4000,
    days: 2,
    description: "Auth, PostgreSQL, RLS-политики и realtime-подписки",
  },
  {
    id: "ai",
    label: "AI-модуль",
    price: 6000,
    days: 2,
    description: "LLM-контекст, RAG, генерация контента и классификация",
  },
];

const PROJECT_ICONS: Record<ProjectTypeId, LucideIcon> = {
  landing: LayoutTemplate,
  parser: Code2,
  crm: Database,
  script: Terminal,
};

const MODULE_ICONS: Record<ModuleId, LucideIcon> = {
  telegram: Bot,
  supabase: Database,
  ai: Sparkles,
};

const TECH_STACKS: Record<ProjectTypeId, readonly string[]> = {
  landing: ["Next.js", "Tailwind", "Vercel"],
  parser: ["Python", "Playwright", "Asyncio"],
  crm: ["Supabase", "PostgreSQL", "TypeScript", "Docker"],
  script: ["Python", "Node.js", "Axios", "Cron"],
};

const BENEFIT_ICONS: Record<PricingBenefitIcon, LucideIcon> = {
  zap: Zap,
  code: Code2,
  shield: Shield,
  rocket: Rocket,
};

const SLIDER_MIN = 1;
const SLIDER_MAX = 10;

function usesPageSlider(id: ProjectTypeId): boolean {
  return id === "landing" || id === "crm";
}

function comboDiscountPercent(moduleCount: number): number {
  if (moduleCount >= 3) return 10;
  if (moduleCount >= 2) return 5;
  return 0;
}

type CalculateTotalInput = {
  basePrice: number;
  baseDays: number;
  pages: number;
  selectedModules: readonly ModuleOption[];
  urgent: boolean;
};

type CalculateTotalResult = {
  basePrice: number;
  baseDays: number;
  pages: number;
  pagesExtra: number;
  modulesSum: number;
  modulesDays: number;
  subtotal: number;
  moduleCount: number;
  discountPercent: number;
  discountAmount: number;
  afterDiscount: number;
  urgent: boolean;
  final: number;
  days: number;
};

function calculateTotal(input: CalculateTotalInput): CalculateTotalResult {
  const pagesExtra = Math.max(0, input.pages - 1) * PAGE_PRICE_STEP;
  const modulesSum = input.selectedModules.reduce((sum, m) => sum + m.price, 0);
  const modulesDays = input.selectedModules.reduce((sum, m) => sum + m.days, 0);
  const subtotal = input.basePrice + pagesExtra + modulesSum;
  const moduleCount = input.selectedModules.length;

  // ponytail: combo % applies to subtotal (base + modules + pages) before urgent surcharge
  const discountPercent = comboDiscountPercent(moduleCount);
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const afterDiscount = subtotal - discountAmount;

  const final = Math.round(
    afterDiscount * (input.urgent ? URGENT_MULTIPLIER : 1),
  );

  const rawDays = input.baseDays + modulesDays;
  const days = input.urgent
    ? Math.max(1, Math.ceil(rawDays * URGENT_DAYS_FACTOR))
    : rawDays;

  return {
    basePrice: input.basePrice,
    baseDays: input.baseDays,
    pages: input.pages,
    pagesExtra,
    modulesSum,
    modulesDays,
    subtotal,
    moduleCount,
    discountPercent,
    discountAmount,
    afterDiscount,
    urgent: input.urgent,
    final,
    days,
  };
}

function buildTelegramMessage(
  project: ProjectType,
  selectedModules: readonly ModuleOption[],
  calc: CalculateTotalResult,
): string {
  const lines: string[] = [
    "Здравствуйте! Посчитал проект у вас на сайте. Мне понравились условия, хочу предложить сотрудничество и обсудить детали.",
    "",
    "Вот какая конфигурация мне нужна:",
    `• Основной продукт: ${project.label} (База: ${calc.basePrice.toLocaleString("ru-RU")} ₽, ${calc.baseDays} дн.)`,
  ];

  if (usesPageSlider(project.id) && calc.pages > 1) {
    lines.push(
      `• Объем / Сложность: ${calc.pages} ед. (Доп. страницы: +${calc.pagesExtra.toLocaleString("ru-RU")} ₽)`,
    );
  }

  if (selectedModules.length > 0) {
    lines.push("• Подключенные модули:");
    for (const mod of selectedModules) {
      lines.push(`  - ${mod.label} (+${mod.price.toLocaleString("ru-RU")} ₽)`);
    }
  } else {
    lines.push("• Дополнительные модули: Не требуются");
  }

  if (calc.discountPercent > 0) {
    lines.push(
      `• Пакетная скидка: Выбрано несколько модулей, применена скидка ${calc.discountPercent}% (-${calc.discountAmount.toLocaleString("ru-RU")} ₽)`,
    );
  }

  if (calc.urgent) {
    lines.push(
      "• Режим сборки: ⚡ СРОЧНЫЙ (+30% к стоимости, срок уменьшен на 40%)",
    );
  }

  lines.push(
    "",
    "---",
    "📊 ИТОГОВАЯ СМЕТА ПРОЕКТА:",
    `💰 Финальная стоимость: ${calc.final.toLocaleString("ru-RU")} ₽`,
    `⏱️ Расчетный срок: ~${calc.days} дн.`,
    "",
    "Подскажите, когда вам удобно созвониться или списать здесь, чтобы запустить проект в работу?",
  );

  return lines.join("\n");
}

function generateTgLink(message: string): string {
  return `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(message)}`;
}

function useAnimatedNumber(value: number) {
  const motionValue = useMotionValue(value);
  const spring = useSpring(motionValue, { stiffness: 120, damping: 24 });

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  return spring;
}

function AnimatedNumber({
  value,
  format = "integer",
}: {
  value: number;
  format?: "integer" | "decimal";
}) {
  const spring = useAnimatedNumber(value);
  const display = useTransform(spring, (v) =>
    format === "decimal"
      ? v.toFixed(0)
      : Math.round(v).toLocaleString("ru-RU"),
  );

  return <motion.span>{display}</motion.span>;
}

function PricingHero() {
  const { hero } = content.pricingPage;

  return (
    <section className="relative px-4 pb-16 pt-8 text-center md:pb-20 md:pt-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.05 }}
        className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-xs font-medium text-cyan-300 backdrop-blur-sm"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
        </span>
        {hero.badge}
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.12 }}
        className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight text-white md:text-6xl"
      >
        {hero.title}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.2 }}
        className="mx-auto mt-5 max-w-2xl text-base font-light leading-relaxed text-gray-400 md:text-lg"
      >
        {hero.subtitle}
      </motion.p>
    </section>
  );
}

type ProjectTypeCardsProps = {
  selected: ProjectTypeId;
  onSelect: (id: ProjectTypeId) => void;
};

function ProjectTypeCards({ selected, onSelect }: ProjectTypeCardsProps) {
  return (
    <div className="space-y-3">
      <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
        Тип проекта
      </p>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {PROJECT_TYPES.map((type) => {
          const Icon = PROJECT_ICONS[type.id];
          const isSelected = selected === type.id;

          return (
            <motion.button
              key={type.id}
              type="button"
              onClick={() => onSelect(type.id)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={SPRING}
              className={cn(
                "relative overflow-hidden rounded-2xl border p-4 text-left backdrop-blur-md transition-shadow",
                isSelected
                  ? "border-cyan-500/40 bg-slate-900/50 shadow-[0_0_30px_rgba(6,182,212,0.15)]"
                  : "border-white/10 bg-slate-950/40 hover:border-white/20 hover:shadow-[0_0_20px_rgba(99,102,241,0.08)]",
              )}
            >
              {isSelected && (
                <motion.div
                  layoutId="project-type-glow"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-violet-500/5"
                  transition={SPRING_SOFT}
                />
              )}
              <div className="relative flex items-start justify-between gap-2">
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0",
                    isSelected ? "text-cyan-400" : "text-gray-500",
                  )}
                />
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                    isSelected
                      ? "border-cyan-400 bg-cyan-400"
                      : "border-white/20 bg-transparent",
                  )}
                >
                  {isSelected && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={SPRING}
                      className="h-1.5 w-1.5 rounded-full bg-slate-950"
                    />
                  )}
                </span>
              </div>
              <p className="relative mt-3 text-sm font-semibold leading-snug text-white">
                {type.label}
              </p>
              <p className="relative mt-1 font-mono text-lg font-bold text-cyan-300">
                {type.price.toLocaleString("ru-RU")} ₽
              </p>
              <p className="relative mt-0.5 font-mono text-[11px] text-violet-300/80">
                {type.days} дн.
              </p>
              <p className="relative mt-2 text-xs leading-relaxed text-gray-500">
                {type.description}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

type ModuleCheckboxProps = {
  module: ModuleOption;
  checked: boolean;
  onChange: (id: ModuleId, checked: boolean) => void;
};

function ModuleCheckbox({ module: mod, checked, onChange }: ModuleCheckboxProps) {
  const Icon = MODULE_ICONS[mod.id];

  return (
    <motion.label
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={SPRING}
      className={cn(
        "flex cursor-pointer items-start gap-4 rounded-2xl border p-4 backdrop-blur-md transition-colors",
        checked
          ? "border-cyan-500/40 bg-slate-900/50 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
          : "border-white/10 bg-slate-950/30 hover:border-white/15",
      )}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(mod.id, e.target.checked)}
      />
      <div
        className={cn(
          "relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
          checked
            ? "border-indigo-400 bg-indigo-500/20"
            : "border-white/20 bg-white/5",
        )}
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
          <motion.path
            d="M5 13l4 4L19 7"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={checked ? "text-indigo-300" : "text-transparent"}
            initial={false}
            animate={{
              pathLength: checked ? 1 : 0,
              opacity: checked ? 1 : 0,
            }}
            transition={SPRING}
          />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-indigo-400" />
          <span className="font-medium text-white">{mod.label}</span>
          <span className="ml-auto font-mono text-sm font-bold text-indigo-300">
            +{mod.price.toLocaleString("ru-RU")} ₽
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-500">{mod.description}</p>
      </div>
    </motion.label>
  );
}

type ComplexitySliderProps = {
  sliderValue: number;
  displayValue: number;
  min: number;
  max: number;
  onSliderChange: (value: number) => void;
  onSnap: () => void;
};

function ComplexitySlider({
  sliderValue,
  displayValue,
  min,
  max,
  onSliderChange,
  onSnap,
}: ComplexitySliderProps) {
  const percent = ((sliderValue - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <style>{`
        .pricing-range {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 9999px;
          background: linear-gradient(
            to right,
            rgb(6 182 212) 0%,
            rgb(99 102 241) ${percent}%,
            rgba(255, 255, 255, 0.1) ${percent}%
          );
          outline: none;
          cursor: pointer;
        }
        .pricing-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #22d3ee, #818cf8);
          border: 2px solid white;
          box-shadow: 0 0 14px rgba(6, 182, 212, 0.65);
          cursor: grab;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .pricing-range::-webkit-slider-thumb:hover {
          transform: scale(1.25);
          box-shadow:
            0 0 24px rgba(6, 182, 212, 0.95),
            0 0 40px rgba(99, 102, 241, 0.45);
        }
        .pricing-range::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #22d3ee, #818cf8);
          border: 2px solid white;
          box-shadow: 0 0 14px rgba(6, 182, 212, 0.65);
          cursor: grab;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .pricing-range::-moz-range-thumb:hover {
          transform: scale(1.25);
          box-shadow:
            0 0 24px rgba(6, 182, 212, 0.95),
            0 0 40px rgba(99, 102, 241, 0.45);
        }
        .pricing-range::-moz-range-track {
          height: 8px;
          border-radius: 9999px;
          background: transparent;
        }
      `}</style>

      <div className="flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
          Страницы / сложность
        </p>
        <span className="font-mono text-sm font-bold text-violet-300">
          <AnimatedNumber value={displayValue} format="decimal" /> ед.
        </span>
      </div>

      <input
        type="range"
        className="pricing-range w-full"
        min={min}
        max={max}
        step={0.01}
        value={sliderValue}
        onChange={(e) => onSliderChange(parseFloat(e.target.value))}
        onPointerUp={onSnap}
        onMouseUp={onSnap}
        onTouchEnd={onSnap}
        onKeyUp={onSnap}
        aria-label="Страницы / сложность"
        aria-valuenow={displayValue}
        aria-valuemin={min}
        aria-valuemax={max}
      />

      <p className="text-xs text-gray-500">
        +{PAGE_PRICE_STEP.toLocaleString("ru-RU")} ₽ за каждую единицу выше базовой
      </p>
    </div>
  );
}

type UrgentToggleProps = {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
};

function UrgentToggle({ enabled, onChange }: UrgentToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4 backdrop-blur-md">
      <div>
        <p className="flex items-center gap-2 font-medium text-white">
          <Zap className="h-4 w-4 text-amber-400" />
          Срочная сборка
        </p>
        <p className="mt-1 text-xs text-gray-500">
          +30% к стоимости · срок сокращается на 40%
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full border transition-colors",
          enabled
            ? "border-amber-400/40 bg-amber-500/20"
            : "border-white/15 bg-white/5",
        )}
      >
        <motion.span
          layout
          transition={SPRING}
          className={cn(
            "absolute top-0.5 block h-5 w-5 rounded-full shadow-md",
            enabled
              ? "left-[calc(100%-1.375rem)] bg-gradient-to-br from-amber-300 to-orange-500 shadow-[0_0_12px_rgba(251,191,36,0.5)]"
              : "left-0.5 bg-gray-400",
          )}
        />
      </button>
    </div>
  );
}

type ResultCardProps = {
  calc: CalculateTotalResult;
  selectedLabel: string;
  projectTypeId: ProjectTypeId;
  telegramUrl: string;
  logLines: readonly [string, string, string];
};

function MicroLogger({ lines }: { lines: readonly [string, string, string] }) {
  return (
    <div className="mt-4 rounded-xl border border-white/5 bg-black/40 p-3 font-mono text-[11px] leading-relaxed text-emerald-400/90">
      {lines.map((line, i) => (
        <motion.p
          key={`${i}-${line}`}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...SPRING, delay: i * 0.05 }}
          className="truncate"
        >
          <span className="text-cyan-500/70">$</span> {line}
        </motion.p>
      ))}
    </div>
  );
}

function ResultCard({
  calc,
  selectedLabel,
  projectTypeId,
  telegramUrl,
  logLines,
}: ResultCardProps) {
  const stack = TECH_STACKS[projectTypeId];

  return (
    <motion.div
      layout
      className="sticky top-28 overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-slate-950/90 via-indigo-950/40 to-slate-950/90 p-6 shadow-[0_0_40px_rgba(6,182,212,0.12)] backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl" />

      <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-400/80">
        Итоговая смета
      </p>
      <p className="mt-1 text-sm text-gray-400">{selectedLabel}</p>

      {calc.discountPercent > 0 && (
        <motion.p
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={SPRING}
          className="mt-3 inline-block rounded-md border border-cyan-400/40 bg-cyan-500/10 px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wide text-cyan-300 shadow-[0_0_16px_rgba(6,182,212,0.35)]"
        >
          [ КОМБО-СКИДКА: -{calc.discountPercent}% ]
        </motion.p>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {stack.map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-cyan-500/20 bg-slate-900/60 px-2 py-0.5 font-mono text-[10px] text-cyan-200/80"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-baseline gap-1">
        <motion.span
          key={calc.final}
          initial={{ opacity: 0.5, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING}
          className="font-mono text-4xl font-extrabold tracking-tight text-white md:text-5xl"
        >
          <AnimatedNumber value={calc.final} />
        </motion.span>
        <span className="font-mono text-xl text-gray-400">₽</span>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
        <div>
          <p className="text-xs text-gray-500">Срок реализации</p>
          <p className="font-mono text-lg font-bold text-violet-300">
            <AnimatedNumber value={calc.days} /> дн.
            {calc.urgent && (
              <span className="ml-2 text-[10px] font-normal text-amber-400">
                ⚡ срочно
              </span>
            )}
          </p>
        </div>
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
        <Check className="h-3.5 w-3.5 text-emerald-400" />
        Включено: код, деплой, документация
      </p>

      <p className="mt-5 rounded-lg border border-cyan-500/15 bg-slate-900/50 px-3 py-2 font-mono text-[11px] leading-relaxed text-cyan-300/90">
        {INFO_NOTICE}
      </p>

      <motion.a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={SPRING}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-violet-500/20 px-4 py-3.5 font-mono text-sm font-semibold text-cyan-100 shadow-[0_0_24px_rgba(6,182,212,0.2)] transition-shadow hover:shadow-[0_0_32px_rgba(6,182,212,0.35)]"
      >
        <motion.span
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <MessageCircle className="h-4 w-4" />
        </motion.span>
        Обсудить в Telegram
      </motion.a>

      <MicroLogger lines={logLines} />
    </motion.div>
  );
}

function BenefitsGrid() {
  const { benefits } = content.pricingPage;

  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={SPRING}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            {benefits.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-gray-400">
            {benefits.subtitle}
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2">
          {benefits.items.map((item, i) => {
            const Icon = BENEFIT_ICONS[item.icon];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ ...SPRING, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-white/10 bg-slate-950/40 p-6 backdrop-blur-md transition-shadow hover:border-cyan-500/20 hover:shadow-[0_0_30px_rgba(6,182,212,0.08)]"
              >
                <div className="mb-4 inline-flex rounded-xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 p-2.5">
                  <Icon className="h-5 w-5 text-cyan-400" />
                </div>
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PricingFaq() {
  const { faq } = content.pricingPage;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="px-4 pb-24 pt-8">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={SPRING}
          className="mb-10 text-center"
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            {faq.title}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-gray-400">
            {faq.subtitle}
          </p>
        </motion.div>

        <div className="space-y-3">
          {faq.items.map((item, i) => {
            const isOpen = open === i;

            return (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...SPRING, delay: i * 0.06 }}
                className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/30 backdrop-blur-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left font-medium text-white"
                  aria-expanded={isOpen}
                >
                  {item.q}
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-cyan-400 transition-transform duration-300",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.28,
                        ease: [0.04, 0.62, 0.23, 0.98],
                      }}
                    >
                      <p className="border-t border-white/5 px-6 pb-4 pt-3 text-sm leading-relaxed text-gray-400">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          <Link
            href="/"
            className="text-cyan-400 transition-colors hover:text-cyan-300"
          >
            ← На главную
          </Link>
        </motion.p>
      </div>
    </section>
  );
}

function PricingCalculator() {
  const [projectType, setProjectType] = useState<ProjectTypeId>("landing");
  const [modules, setModules] = useState<Record<ModuleId, boolean>>({
    telegram: false,
    supabase: false,
    ai: false,
  });
  const [pages, setPages] = useState<number>(SLIDER_MIN);
  const [sliderValue, setSliderValue] = useState<number>(SLIDER_MIN);
  const [urgent, setUrgent] = useState(false);

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
  };

  const snapSlider = () => {
    const snapped = Math.round(sliderValue);
    const clamped = Math.min(SLIDER_MAX, Math.max(SLIDER_MIN, snapped));
    setPages(clamped);
    setSliderValue(clamped);
  };

  const selectedProject = useMemo(
    () =>
      PROJECT_TYPES.find((t) => t.id === projectType) ?? PROJECT_TYPES[0],
    [projectType],
  );

  const showSlider = usesPageSlider(projectType);
  const effectivePages = showSlider ? pages : 1;

  const selectedModules = useMemo(
    () => MODULES.filter((m) => modules[m.id]),
    [modules],
  );

  const calc = useMemo(
    () =>
      calculateTotal({
        basePrice: selectedProject.price,
        baseDays: selectedProject.days,
        pages: effectivePages,
        selectedModules,
        urgent,
      }),
    [selectedProject, effectivePages, selectedModules, urgent],
  );

  const telegramUrl = useMemo(() => {
    const message = buildTelegramMessage(
      selectedProject,
      selectedModules,
      calc,
    );
    return generateTgLink(message);
  }, [selectedProject, selectedModules, calc]);

  const logLines = useMemo((): [string, string, string] => {
    const modsLabel =
      selectedModules.length > 0
        ? selectedModules.map((m) => m.label).join(" + ")
        : "base only";
    return [
      `init :: ${selectedProject.label.toLowerCase()} · vol=${effectivePages}`,
      `mods :: ${modsLabel}`,
      calc.discountPercent > 0
        ? `[system]: применен пакетный тариф`
        : `done :: ${calc.final.toLocaleString("ru-RU")} ₽ · ${calc.days}d${urgent ? " [rush]" : ""}`,
    ];
  }, [
    selectedProject.label,
    effectivePages,
    selectedModules,
    calc.discountPercent,
    calc.final,
    calc.days,
    urgent,
  ]);

  const handleModuleChange = (id: ModuleId, checked: boolean) => {
    setModules((prev) => ({ ...prev, [id]: checked }));
  };

  return (
    <section className="px-4 pb-8">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={SPRING}
          className="mb-8 text-center text-2xl font-bold text-white md:text-3xl"
        >
          Конфигуратор проекта
        </motion.h2>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={SPRING}
            className="space-y-8 rounded-2xl border border-white/10 bg-slate-950/30 p-6 backdrop-blur-md md:p-8"
          >
            <ProjectTypeCards
              selected={projectType}
              onSelect={setProjectType}
            />

            <div className="space-y-3">
              <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
                Дополнительные модули
              </p>
              <div className="space-y-3">
                {MODULES.map((mod) => (
                  <ModuleCheckbox
                    key={mod.id}
                    module={mod}
                    checked={modules[mod.id]}
                    onChange={handleModuleChange}
                  />
                ))}
              </div>
            </div>

            <AnimatePresence initial={false}>
              {showSlider && (
                <motion.div
                  key="complexity-slider"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: 0.28,
                    ease: [0.04, 0.62, 0.23, 0.98],
                  }}
                  className="overflow-hidden"
                >
                  <ComplexitySlider
                    sliderValue={sliderValue}
                    displayValue={Math.round(sliderValue)}
                    min={SLIDER_MIN}
                    max={SLIDER_MAX}
                    onSliderChange={handleSliderChange}
                    onSnap={snapSlider}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <UrgentToggle enabled={urgent} onChange={setUrgent} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ ...SPRING, delay: 0.1 }}
          >
            <ResultCard
              calc={calc}
              selectedLabel={selectedProject.label}
              projectTypeId={projectType}
              telegramUrl={telegramUrl}
              logLines={logLines}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="relative min-h-screen overflow-x-hidden bg-[#030408] pt-20 text-white selection:bg-cyan-500/30">
        <PremiumCanvas />
        <div className="relative z-10">
          <PricingHero />
          <PricingCalculator />
          <div className="mx-auto h-px max-w-5xl bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <BenefitsGrid />
          <div className="mx-auto h-px max-w-5xl bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <PricingFaq />
        </div>
      </main>
      <Footer />
    </>
  );
}
