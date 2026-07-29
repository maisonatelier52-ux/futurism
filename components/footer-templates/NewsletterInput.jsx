// components/footer-templates/NewsletterInput.jsx
"use client";

import { useNewsletterSubscribe } from "@/lib/useNewsletterSubscribe";
import NewsletterStatus from "@/components/shared/NewsletterStatus";

// Inline variant: email input + button side by side
export function NewsletterInline({ newsletter = {}, dark = false }) {
  const { email, setEmail, status, message, submit } = useNewsletterSubscribe("footer");
  const bg = dark ? 'bg-white/10 border-white/20 text-white placeholder:text-white/40' : 'bg-white border-gray-300 text-black';
  const btn = dark ? 'bg-white text-black hover:bg-gray-200' : 'bg-[#1f2326] text-white hover:bg-black';
  return (
    <form onSubmit={submit} className="w-full">
      <div className="flex gap-2 w-full">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`flex-1 min-w-0 h-10 px-3 text-sm border focus:outline-none ${bg}`}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={`h-10 px-4 font-bold uppercase tracking-widest text-xs whitespace-nowrap transition-colors disabled:opacity-60 ${btn}`}
        >
          {status === "loading" ? "..." : (newsletter.buttonLabel || 'SIGN UP')}
        </button>
      </div>
      <NewsletterStatus status={status} message={message} light={dark} />
    </form>
  );
}

// Box variant: dark box with heading, subtext, stacked inputs
export function NewsletterBox({ newsletter = {} }) {
  const { email, setEmail, status, message, submit } = useNewsletterSubscribe("footer");
  const bg = newsletter.bgColor || '#1f2326';
  return (
    <div className="text-white p-4 border border-gray-700" style={{ backgroundColor: bg }}>
      <h3 className="text-xl font-black leading-tight uppercase tracking-tight whitespace-pre-line">
        {newsletter.heading || 'Sign up to see the future,\ntoday'}
      </h3>
      <p className="text-gray-300 text-xs leading-relaxed mt-2 mb-4">
        {newsletter.subtext || "Can't-miss innovations from the bleeding edge of science and tech"}
      </p>
      <form onSubmit={submit} className="space-y-2">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-10 px-3 bg-white text-black text-sm border border-gray-300 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full h-10 bg-white text-black font-bold uppercase tracking-widest border border-white hover:bg-gray-200 transition text-sm disabled:opacity-60"
        >
          {status === "loading" ? "Signing up…" : (newsletter.buttonLabel || 'SIGN UP')}
        </button>
      </form>
      <NewsletterStatus status={status} message={message} light />
    </div>
  );
}
