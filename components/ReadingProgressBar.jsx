"use client";
// components/ReadingProgressBar.jsx
// A thin bar fixed to the top of the viewport that fills as the reader
// scrolls through the article. Rendered by ArticlePageResolver.jsx (a
// Server Component) as the one other small client island on the article
// page, alongside ViewTracker.
import { useEffect, useState } from "react";

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      if (scrollable <= 0) {
        setProgress(0);
        return;
      }
      const pct = Math.min(100, Math.max(0, (doc.scrollTop / scrollable) * 100));
      setProgress(pct);
    }
    handleScroll(); // set an initial value instead of waiting for the first scroll event
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-transparent pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full bg-red-600 transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
