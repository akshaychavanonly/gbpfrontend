"use client";

export default function PostSearch({
  value,
  onChange,
  placeholder = "Search posts...",
}) {
  return (
    <div className="w-full">
      <label
        htmlFor="post-search"
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        Search
      </label>

      <input
        id="post-search"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
      />
    </div>
  );
}
