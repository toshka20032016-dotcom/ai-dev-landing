"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  Zap,
  type LucideIcon,
} from "lucide-react";

import PremiumCanvas from "@/components/canvas/PremiumCanvas";
import { HeroSection } from "@/components/sections/HeroVariants";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import {
  content,
  type PricingBenefitIcon,
  type PricingOptionId,
  type PricingProjectTypeId,
} from "@/content/ru";
import { cn } from "@/lib/utils";

const SPRING = { type: "spring" as const, stiffness: 320, damping: 28 };
const SPRING_SOFT = { type: "spring" as const, stiffness: 200, damping: 24 };

const PROJECT_ICONS: Record<PricingProjectTypeId, LucideIcon> = {
  landing: LayoutTemplate,
  parser: Code2,
  crm: Database,
};

const OPTION_ICONS: Record<PricingOptionId, LucideIcon> = {
  telegram: Bot,
  supabase: Database,
  ai: Sparkles,
};

const BENEFIT_ICONS: Record<PricingBenefitIcon, LucideIcon> = {
  zap: Zap,
  code: Code2,
  shield: Shield,
  rocket: Rocket,
};

function calcTotal(
  basePrice: number,
  pages: number,
  optionsSum: number,
  urgent: boolean,
  pricePerPageStep: number,
  urgentMultiplier: number,
): number {
  const subtotal = basePrice + (pages - 1) * pricePerPageStep + optionsSum;
  return Math.round(subtotal * (urgent ? urgentMultiplier : 1));
}

function calcDays(baseDays: number, urgent: boolean): number {
  return urgent ? Math.max(1, Math.ceil(baseDays / 2)) : baseDays;
}

function AnimatedCounter({ value }: { value: number }) {
  const motionValue = useMotionValue(value);
  const spring = useSpring(motionValue, { stiffness: 120, damping: 24 });
  const display = useTransform(spring, (v) =>
    Math.round(v).toLocaleString("ru-RU"),
  );

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  return <motion.span>{display}</motion.span>;
}

type ProjectTypeCardsProps = {
  selected: PricingProjectTypeId;
  onSelect: (id: PricingProjectTypeId) => void;
};

function ProjectTypeCards({ selected, onSelect }: ProjectTypeCardsProps) {
  const { projectTypes, projectTypesLabel } = content.pricingPage.calculator;

  return (
    <div className="space-y-3">
      <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
        {projectTypesLabel}
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        {projectTypes.map((type) => {
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
                  ? "border-cyan-400/40 bg-gradient-to-br from-cyan-500/10 via-indigo-500/5 to-violet-500/10 shadow-[0_0_30px_rgba(6,182,212,0.15)]"
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
              <p className="relative mt-3 font-semibold text-white">{type.label}</p>
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

type OptionCheckboxProps = {
  id: PricingOptionId;
  label: string;
  price: number;
  description: string;
  checked: boolean;
  onChange: (id: PricingOptionId, checked: boolean) => void;
};

function OptionCheckbox({
  id,
  label,
  price,
  description,
  checked,
  onChange,
}: OptionCheckboxProps) {
  const Icon = OPTION_ICONS[id];

  return (
    <motion.label
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={SPRING}
      className={cn(
        "flex cursor-pointer items-start gap-4 rounded-2xl border p-4 backdrop-blur-md transition-colors",
        checked
          ? "border-indigo-400/30 bg-indigo-500/5 shadow-[0_0_20px_rgba(99,102,241,0.1)]"
          : "border-white/10 bg-slate-950/30 hover:border-white/15",
      )}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(id, e.target.checked)}
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
          <span className="font-medium text-white">{label}</span>
          <span className="ml-auto font-mono text-sm font-bold text-indigo-300">
            +{price.toLocaleString("ru-RU")} ₽
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      </div>
    </motion.label>
  );
}

type ComplexitySliderProps = {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
};

function ComplexitySlider({ value, min, max, onChange }: ComplexitySliderProps) {
  const { sliderLabel, sliderUnit, sliderHint } = content.pricingPage.calculator;
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const percent = ((value - min) / (max - min)) * 100;

  const updateFromPointer = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      const raw = min + ratio * (max - min);
      onChange(Math.round(raw));
    },
    [min, max, onChange],
  );

  useEffect(() => {
    if (!dragging) return;

    const onMove = (e: PointerEvent) => updateFromPointer(e.clientX);
    const onUp = () => setDragging(false);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragging, updateFromPointer]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
          {sliderLabel}
        </p>
        <span className="font-mono text-sm font-bold text-violet-300">
          {value} {sliderUnit}
        </span>
      </div>

      <div
        ref={trackRef}
        className="relative h-10 select-none"
        onPointerEnter={() => setShowTooltip(true)}
        onPointerLeave={() => !dragging && setShowTooltip(false)}
      >
        <div className="absolute top-1/2 h-2 w-full -translate-y-1/2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-500"
            animate={{ width: `${percent}%` }}
            transition={SPRING_SOFT}
          />
        </div>

        <motion.div
          className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-2 border-white bg-gradient-to-br from-cyan-400 to-violet-500 shadow-[0_0_16px_rgba(6,182,212,0.5)] active:cursor-grabbing"
          style={{ left: `${percent}%` }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          transition={SPRING}
          onPointerDown={(e) => {
            e.preventDefault();
            setDragging(true);
            setShowTooltip(true);
            updateFromPointer(e.clientX);
          }}
        />

        <AnimatePresence>
          {(showTooltip || dragging) && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.9 }}
              transition={SPRING}
              className="pointer-events-none absolute -top-10 z-10 -translate-x-1/2 rounded-lg border border-white/10 bg-slate-900/95 px-2.5 py-1 font-mono text-[11px] text-cyan-300 shadow-lg backdrop-blur-md"
              style={{ left: `${percent}%` }}
            >
              {value} {sliderUnit}
            </motion.div>
          )}
        </AnimatePresence>

        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          aria-label={sliderLabel}
        />
      </div>

      <p className="text-xs text-gray-500">{sliderHint}</p>
    </div>
  );
}

type UrgentToggleProps = {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
};

function UrgentToggle({ enabled, onChange }: UrgentToggleProps) {
  const { urgentLabel, urgentHint } = content.pricingPage.calculator;

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4 backdrop-blur-md">
      <div>
        <p className="flex items-center gap-2 font-medium text-white">
          <Zap className="h-4 w-4 text-amber-400" />
          {urgentLabel}
        </p>
        <p className="mt-1 text-xs text-gray-500">{urgentHint}</p>
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
  total: number;
  days: number;
  urgent: boolean;
  selectedLabel: string;
};

function ResultCard({ total, days, urgent, selectedLabel }: ResultCardProps) {
  const {
    resultTitle,
    resultDaysLabel,
    resultDaysUnit,
    resultIncludes,
    resultCta,
    resultCtaHref,
    currency,
  } = content.pricingPage.calculator;

  return (
    <motion.div
      layout
      className="sticky top-28 overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-slate-950/90 via-indigo-950/40 to-slate-950/90 p-6 shadow-[0_0_40px_rgba(6,182,212,0.12)] backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl" />

      <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-400/80">
        {resultTitle}
      </p>
      <p className="mt-1 text-sm text-gray-400">{selectedLabel}</p>

      <div className="mt-4 flex items-baseline gap-1">
        <motion.span
          key={total}
          initial={{ opacity: 0.5, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING}
          className="font-mono text-4xl font-extrabold tracking-tight text-white md:text-5xl"
        >
          <AnimatedCounter value={total} />
        </motion.span>
        <span className="font-mono text-xl text-gray-400">{currency}</span>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
        <div>
          <p className="text-xs text-gray-500">{resultDaysLabel}</p>
          <p className="font-mono text-lg font-bold text-violet-300">
            <AnimatedCounter value={days} /> {resultDaysUnit}
            {urgent && (
              <span className="ml-2 text-[10px] font-normal text-amber-400">
                ⚡ urgent
              </span>
            )}
          </p>
        </div>
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
        <Check className="h-3.5 w-3.5 text-emerald-400" />
        {resultIncludes}
      </p>

      <motion.a
        href={resultCtaHref}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={SPRING}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-violet-500/20 px-4 py-3.5 font-mono text-sm font-semibold text-cyan-100 shadow-[0_0_24px_rgba(6,182,212,0.2)] transition-shadow hover:shadow-[0_0_32px_rgba(6,182,212,0.35)]"
      >
        <motion.span
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <MessageCircle className="h-4 w-4" />
        </motion.span>
        {resultCta}
      </motion.a>
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
                      transition={{ duration: 0.28, ease: [0.04, 0.62, 0.23, 0.98] }}
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
          <Link href="/" className="text-cyan-400 transition-colors hover:text-cyan-300">
            ← На главную
          </Link>
        </motion.p>
      </div>
    </section>
  );
}

function PricingCalculator() {
  const calc = content.pricingPage.calculator;
  const [projectType, setProjectType] = useState<PricingProjectTypeId>("landing");
  const [options, setOptions] = useState<Record<PricingOptionId, boolean>>({
    telegram: false,
    supabase: false,
    ai: false,
  });
  const [pages, setPages] = useState<number>(calc.sliderMin);
  const [urgent, setUrgent] = useState(false);

  const selectedType = useMemo(
    () => calc.projectTypes.find((t) => t.id === projectType) ?? calc.projectTypes[0],
    [calc.projectTypes, projectType],
  );

  const optionsSum = useMemo(
    () =>
      calc.options.reduce(
        (sum, opt) => sum + (options[opt.id] ? opt.price : 0),
        0,
      ),
    [calc.options, options],
  );

  const total = calcTotal(
    selectedType.price,
    pages,
    optionsSum,
    urgent,
    calc.pricePerPageStep,
    calc.urgentMultiplier,
  );

  const days = calcDays(selectedType.days, urgent);

  const handleOptionChange = (id: PricingOptionId, checked: boolean) => {
    setOptions((prev) => ({ ...prev, [id]: checked }));
  };

  return (
    <section id="calculator" className="px-4 pb-8 scroll-mt-28">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={SPRING}
          className="mb-8 text-center text-2xl font-bold text-white md:text-3xl"
        >
          {calc.title}
        </motion.h2>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={SPRING}
            className="space-y-8 rounded-2xl border border-white/10 bg-slate-950/30 p-6 backdrop-blur-md md:p-8"
          >
            <ProjectTypeCards selected={projectType} onSelect={setProjectType} />

            <div className="space-y-3">
              <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
                {calc.optionsLabel}
              </p>
              <div className="space-y-3">
                {calc.options.map((opt) => (
                  <OptionCheckbox
                    key={opt.id}
                    id={opt.id}
                    label={opt.label}
                    price={opt.price}
                    description={opt.description}
                    checked={options[opt.id]}
                    onChange={handleOptionChange}
                  />
                ))}
              </div>
            </div>

            <ComplexitySlider
              value={pages}
              min={calc.sliderMin}
              max={calc.sliderMax}
              onChange={setPages}
            />

            <UrgentToggle enabled={urgent} onChange={setUrgent} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ ...SPRING, delay: 0.1 }}
          >
            <ResultCard
              total={total}
              days={days}
              urgent={urgent}
              selectedLabel={selectedType.label}
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
          <HeroSection pageContext="pricing" compact />
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
