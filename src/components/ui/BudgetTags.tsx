"use client";

import { content } from "@/content/ru";

type BudgetTagsProps = {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
};

export default function BudgetTags({
  selectedTags,
  onChange,
  disabled = false,
}: BudgetTagsProps) {
  const { contact } = content;

  const toggleTag = (label: string) => {
    if (disabled) return;

    const updated = selectedTags.includes(label)
      ? selectedTags.filter((t) => t !== label)
      : [...selectedTags, label];

    onChange(updated);
  };

  return (
    <div className="transform-gpu space-y-3 will-change-transform">
      <label className="block font-mono text-[11px] tracking-widest text-gray-500 uppercase">
        {contact.tagsLabel}
      </label>
      <div className="flex flex-wrap gap-2">
        {contact.serviceTags.map((tag) => {
          const isSelected = selectedTags.includes(tag.label);

          return (
            <button
              key={tag.id}
              type="button"
              disabled={disabled}
              onClick={() => toggleTag(tag.label)}
              className={`cursor-pointer rounded-xl border px-3.5 py-2 font-mono text-[11px] font-medium transition-all duration-300 select-none disabled:cursor-not-allowed disabled:opacity-50 ${
                isSelected
                  ? "border-cyan-400 bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                  : "border-white/5 bg-white/[0.02] text-gray-400 hover:border-white/10 hover:text-white"
              }`}
            >
              {tag.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
