"use client";

import { useRef } from "react";

interface ContactInputProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

const PHONE_MASK_LENGTH = 18;

function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "");

  if (!digits.length) return "";

  let cleanDigits = digits;
  if (digits[0] === "7" || digits[0] === "8") {
    cleanDigits = digits.substring(1);
  }

  let formatted = "+7 ";
  if (cleanDigits.length > 0) {
    formatted += "(" + cleanDigits.substring(0, 3);
  }
  if (cleanDigits.length >= 4) {
    formatted += ") " + cleanDigits.substring(3, 6);
  }
  if (cleanDigits.length >= 7) {
    formatted += "-" + cleanDigits.substring(6, 8);
  }
  if (cleanDigits.length >= 9) {
    formatted += "-" + cleanDigits.substring(8, 10);
  }

  return formatted;
}

function isPhoneInput(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return false;

  const stripped = trimmed.replace(/^@+/, "");
  const firstChar = stripped[0];

  return Boolean(firstChar && (/[\d+]/.test(firstChar) || trimmed.startsWith("+7")));
}

export default function ContactInput({
  value,
  onChange,
  disabled = false,
  placeholder,
  className,
  required,
}: ContactInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const phoneMode = isPhoneInput(value);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    if (!rawValue) {
      onChange("");
      return;
    }

    const trimmed = rawValue.trim();
    const stripped = trimmed.replace(/^@+/, "");
    const firstChar = stripped[0];

    if (firstChar && (/[\d+]/.test(firstChar) || trimmed.startsWith("+7"))) {
      onChange(formatPhoneNumber(rawValue));
      return;
    }

    if (!trimmed.startsWith("@")) {
      onChange(`@${stripped}`);
      return;
    }

    onChange(trimmed);
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={handleInputChange}
      disabled={disabled}
      required={required}
      placeholder={placeholder}
      className={className}
      maxLength={phoneMode ? PHONE_MASK_LENGTH : 32}
    />
  );
}
