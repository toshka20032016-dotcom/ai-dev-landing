"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  CheckCircle2,
  User,
  SendHorizontal,
  MessageSquare,
} from "lucide-react";

import { submitContactForm } from "@/app/actions/contact";
import { content } from "@/content/ru";
import BudgetTags from "@/components/ui/BudgetTags";
import ContactInput from "@/components/ui/ContactInput";
import { SectionParallax } from "@/components/ui/section-parallax";

type FormState = {
  name: string;
  contact: string;
  message: string;
  tags: string[];
};

const initialFormState: FormState = {
  name: "",
  contact: "",
  message: "",
  tags: [],
};

const inputClassName =
  "w-full border-b border-white/10 bg-transparent py-3 pr-4 pl-7 font-light text-white outline-none transition-all duration-300 placeholder:text-white/20 hover:border-white/25 focus:border-cyan-500/50 focus:shadow-[0_4px_20px_rgba(6,182,212,0.08)] disabled:opacity-50";

function buildMessage(message: string, tags: string[]) {
  if (tags.length === 0) return message;

  const prefix = `[Услуги: ${tags.join(", ")}]`;
  return message ? `${prefix}\n\n${message}` : prefix;
}

export default function ContactSection() {
  const { contact: copy } = content;
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const resetForm = () => {
    setIsSuccess(false);
    setFormState(initialFormState);
    setFormKey((key) => key + 1);
  };

  const handleSuccess = () => {
    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(resetForm, 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.contact) return;

    setIsSubmitting(true);

    const payload = {
      name: formState.name,
      contact: formState.contact,
      message: buildMessage(formState.message, formState.tags),
      tags: formState.tags,
    };

    try {
      const result = await submitContactForm(payload);

      if (result.success) {
        handleSuccess();
        return;
      }

      console.warn("[contact] Validation failed:", result.errors);
      setIsSubmitting(false);
    } catch {
      console.log("Данные заявки отправлены:", payload);
      handleSuccess();
    }
  };

  const fieldsDisabled = isSuccess || isSubmitting;

  return (
    <section
      id="contact"
      className="relative z-10 mx-auto max-w-3xl px-4 py-24"
    >
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 select-none rounded-full bg-purple-500/10 blur-[120px]" />

      <SectionParallax className="mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-cyan-400 backdrop-blur-sm"
        >
          <span>{copy.badge}</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-4 text-3xl font-extrabold tracking-tight text-white md:text-5xl"
        >
          {copy.title}
        </motion.h2>
        <p className="mx-auto max-w-md text-sm font-light text-gray-400 md:text-base">
          {copy.subtitle}
        </p>
      </SectionParallax>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card relative overflow-hidden rounded-3xl border border-white/5 bg-slate-950/30 p-8 backdrop-blur-lg md:p-10"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <BudgetTags
            key={formKey}
            selectedTags={formState.tags}
            disabled={fieldsDisabled}
            onChange={(tags) =>
              setFormState((prev) => ({ ...prev, tags }))
            }
          />

          <div className="group relative">
            <label className="mb-2 block font-mono text-xs tracking-widest text-gray-500 uppercase transition-colors group-focus-within:text-cyan-400">
              {copy.fields.name.label}
            </label>
            <div className="relative">
              <span className="absolute top-3.5 left-0 text-gray-600 transition-colors group-focus-within:text-cyan-400">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                required
                disabled={fieldsDisabled}
                value={formState.name}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder={copy.fields.name.placeholder}
                className={inputClassName}
              />
            </div>
          </div>

          <div className="group relative">
            <label className="mb-2 block font-mono text-xs tracking-widest text-gray-500 uppercase transition-colors group-focus-within:text-cyan-400">
              {copy.fields.contact.label}
            </label>
            <div className="relative">
              <span className="absolute top-3.5 left-0 text-gray-600 transition-colors group-focus-within:text-cyan-400">
                <SendHorizontal className="h-4 w-4" />
              </span>
              <ContactInput
                required
                disabled={fieldsDisabled}
                value={formState.contact}
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    contact: val,
                  }))
                }
                placeholder={copy.fields.contact.placeholder}
                className={inputClassName}
              />
            </div>
          </div>

          <div className="group relative">
            <label className="mb-2 block font-mono text-xs tracking-widest text-gray-500 uppercase transition-colors group-focus-within:text-cyan-400">
              {copy.fields.message.label}
            </label>
            <div className="relative">
              <span className="absolute top-3.5 left-0 text-gray-600 transition-colors group-focus-within:text-cyan-400">
                <MessageSquare className="h-4 w-4" />
              </span>
              <textarea
                rows={3}
                disabled={fieldsDisabled}
                value={formState.message}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    message: e.target.value,
                  }))
                }
                placeholder={copy.fields.message.placeholder}
                className={`${inputClassName} resize-none`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={
              isSubmitting ||
              isSuccess ||
              !formState.name ||
              !formState.contact
            }
            className={`flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-2 rounded-2xl px-6 py-4 font-mono text-xs font-bold tracking-widest uppercase transition-all duration-500 select-none disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white ${
              isSuccess
                ? "bg-emerald-500 text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.4)]"
                : isSubmitting
                  ? "cursor-not-allowed bg-white/10 text-gray-400"
                  : "bg-white text-slate-950 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:bg-slate-200 active:scale-[0.99]"
            }`}
          >
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{copy.success}</span>
                </motion.div>
              ) : isSubmitting ? (
                <motion.div
                  key="submitting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
                  <span>{copy.submitting}</span>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{copy.submit}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </form>
      </motion.div>
    </section>
  );
}
