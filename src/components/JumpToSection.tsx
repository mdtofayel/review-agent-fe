// src/components/JumpToSection.tsx
import { useState } from "react";

export type JumpSection = {
  id: string;
  label: string;
};

type Props = {
  sections: JumpSection[];
};

export default function JumpToSection({ sections }: Props) {
  const [value, setValue] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    setValue(next);
    if (!next) return;

    const el = document.getElementById(next);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    // changed: top-0 -> top-[64px]
    <div className="bg-black text-white sticky top-[64px] z-30">
      <div className="max-w-6xl mx-auto px-4 py-2">
        <div className="text-sm font-semibold mb-1">Jump to section</div>
        <select
          value={value}
          onChange={handleChange}
          className="w-full text-sm text-black px-3 py-2 rounded-sm"
        >
          <option value="">Jump to section</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
