"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

import {
  content,
  type WikiConfiguratorLoadLevel,
  type WikiConfiguratorProjectType,
} from "@/content/ru";

type ConfiguratorAnswers = {
  type?: WikiConfiguratorProjectType;
  load?: WikiConfiguratorLoadLevel;
};

function getRecommendedStack(answers: ConfiguratorAnswers): string {
  const { configurator } = content.wiki;
  const type = answers.type ?? "tg";
  const load = answers.load ?? "mid";
  return configurator.stacks[type][load];
}

export function TechConfigurator() {
  const { configurator, contactHref } = content.wiki;
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<ConfiguratorAnswers>({});

  const questionCount = configurator.questions.length;
  const isFinal = step > questionCount;

  const handleSelect = (qId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
    if (step < questionCount) setStep(step + 1);
    else setStep(configurator.totalSteps);
  };

  const stack = getRecommendedStack(answers);
  const finalText = configurator.finalDescription.replace("{stack}", stack);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="mx-auto w-full max-w-2xl rounded-xl border border-white/5 bg-[#0d0d11] p-6"
    >
      <div className="mb-4 flex items-center justify-between font-mono text-xs text-gray-500">
        <span>{configurator.headerLabel}</span>
        <span>
          {configurator.stepPrefix} {step} {configurator.stepOf} {configurator.totalSteps}
        </span>
      </div>

      {!isFinal ? (
        <div className="space-y-4">
          <h4 className="text-base font-bold tracking-tight text-white">
            {configurator.questions[step - 1].title}
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {configurator.questions[step - 1].options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(configurator.questions[step - 1].id, opt.value)}
                className="group flex w-full flex-col gap-0.5 rounded-xl border border-white/5 bg-black/20 p-4 text-left transition-all hover:border-white/10 hover:bg-white/[0.02]"
              >
                <span className="text-sm font-semibold text-white transition-colors group-hover:text-[#00d2ff]">
                  {opt.label}
                </span>
                <span className="text-xs text-gray-400">{opt.sub}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4 py-4 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-lg font-bold text-emerald-400">
            OK
          </div>
          <h4 className="text-base font-bold text-white">{configurator.finalTitle}</h4>
          <p className="mx-auto max-w-md text-xs leading-relaxed text-gray-400">{finalText}</p>
          <Link
            href={contactHref}
            className="mt-2 inline-block rounded-xl bg-white px-5 py-2.5 text-xs font-semibold text-black transition-colors hover:bg-gray-200"
          >
            {configurator.ctaButton}
          </Link>
        </div>
      )}
    </motion.div>
  );
}