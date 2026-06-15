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

  const { tags = [], message, ...rest } = parsed.data;

  console.log("[contact] New submission:", {
    ...rest,
    tags,
    message,
  });

  if (tags.length > 0) {
    console.log("[contact] Selected service tags:", tags.join(", "));
  }

  return { success: true };
}
