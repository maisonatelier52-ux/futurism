// lib/useNewsletterSubscribe.js
"use client";

import { useState } from "react";
import { apiFetch } from "./apiConfig";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Shared logic behind every "Sign up to see the future" / newsletter box
 * across the site. Handles the email input's state, client-side
 * validation, the actual POST /api/subscribe call, and a status message
 * ("idle" | "loading" | "success" | "error") so any template can wire up
 * a real, working subscribe form with a few lines instead of duplicating
 * this logic in every component.
 *
 * @param {string} [source] where this form lives (e.g. "homepage-feed",
 *   "footer", "article-page") -- stored with the subscriber so you can see
 *   which sections actually convert.
 */
export function useNewsletterSubscribe(source = "") {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  async function submit(e) {
    if (e?.preventDefault) e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) {
      setStatus("error");
      setMessage("Please enter your email.");
      return;
    }
    if (!EMAIL_PATTERN.test(trimmed)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await apiFetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, source }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setMessage(data.alreadySubscribed ? "You're already subscribed!" : "You're subscribed — welcome aboard!");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return { email, setEmail, status, message, submit };
}
