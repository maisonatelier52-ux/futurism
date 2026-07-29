// components/shared/NewsletterStatus.jsx
"use client";

// Small status line shown under a newsletter form after submitting.
// `light` controls whether it renders for a dark or light background.
export default function NewsletterStatus({ status, message, light = false }) {
  if (status === "idle" || !message) return null;

  const color =
    status === "success"
      ? light
        ? "text-emerald-300"
        : "text-emerald-600"
      : status === "error"
      ? light
        ? "text-red-300"
        : "text-red-600"
      : light
      ? "text-white/60"
      : "text-gray-500";

  return <p className={`text-xs mt-2 ${color}`}>{message}</p>;
}
