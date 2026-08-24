"use client";

import { ctaOptions } from "@/data/options";

export default function CTASelector({ value, onChange, error = "" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        Call to Action
      </label>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ctaOptions.map((cta) => {
          const isSelected = value === cta;

          return (
            <button
              key={cta}
              type="button"
              onClick={() => onChange(cta)}
              className={`rounded-lg border px-4 py-3 text-sm font-medium transition ${
                isSelected
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
              }`}
            >
              {cta}
            </button>
          );
        })}
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
