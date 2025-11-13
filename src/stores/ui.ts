import { create } from "zustand";
type UI = { theme: "light" | "dark"; setTheme: (t: UI["theme"]) => void; };
export const useUI = create<UI>((set) => ({
  theme: (localStorage.getItem("theme") as UI["theme"]) || "light",
  setTheme: (t) => { localStorage.setItem("theme", t); set({ theme: t }); }
}));
