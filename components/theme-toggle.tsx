"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | "red">("dark");
  useEffect(() => {
    const saved = localStorage.getItem("astrolab.theme") as "light" | "dark" | "red" | null;
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const value = saved ?? (prefers ? "dark" : "light");
    setTheme(value);
    document.documentElement.dataset.theme = value;
  }, []);
  function toggle() {
    const value = theme === "light" ? "dark" : theme === "dark" ? "red" : "light";
    setTheme(value);
    localStorage.setItem("astrolab.theme", value);
    document.documentElement.dataset.theme = value;
  }
  const label = theme === "light" ? "切換夜間模式" : theme === "dark" ? "切換紅移模式" : "切換日間模式";
  return <button className={`theme-toggle theme-${theme}`} type="button" onClick={toggle} aria-label={label} title={label}>{theme === "light" ? "☼" : theme === "dark" ? "◐" : "◒"}</button>;
}
