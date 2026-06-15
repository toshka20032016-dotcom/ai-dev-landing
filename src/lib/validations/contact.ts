import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Укажите имя")
    .max(100, "Имя слишком длинное"),
  contact: z
    .string()
    .trim()
    .min(3, "Укажите Telegram или Email")
    .max(200, "Контакт слишком длинный"),
  message: z
    .string()
    .trim()
    .max(2000, "Описание слишком длинное")
    .optional()
    .transform((val) => val || undefined),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export type ContactFormState = {
  success: boolean;
  errors?: {
    name?: string[];
    contact?: string[];
    message?: string[];
  };
};
