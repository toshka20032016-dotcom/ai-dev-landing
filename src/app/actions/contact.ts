"use server";

import {
  contactSchema,
  type ContactFormState,
} from "@/lib/validations/contact";

export async function submitContactForm(
  data: unknown,
): Promise<ContactFormState> {
  const parsed = contactSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  console.log("[contact] New submission:", parsed.data);

  return { success: true };
}
