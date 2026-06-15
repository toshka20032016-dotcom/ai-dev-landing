import { z } from "zod";

const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
const telegramRegex = /^@[a-zA-Z][a-zA-Z0-9_]{0,31}$/;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Укажите имя")
    .max(100, "Имя слишком длинное"),
  contact: z
    .string()
    .trim()
    .min(3, "Укажите Telegram или телефон")
    .max(32, "Контакт слишком длинный")
    .refine(
      (val) => phoneRegex.test(val) || telegramRegex.test(val),
      "Укажите @username или номер +7 (XXX) XXX-XX-XX",
    ),
  message: z
    .string()
    .trim()
    .max(2000, "Описание слишком длинное")
    .optional()
    .transform((val) => val || undefined),
  tags: z.array(z.string()).optional().default([]),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export type ContactFormState = {
  success: boolean;
  errors?: {
    name?: string[];
    contact?: string[];
    message?: string[];
    tags?: string[];
  };
};
