import { Search } from "lucide-react";

export function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative flex-1">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search your notes…"
        className="w-full rounded-lg border border-zinc-200 bg-white py-1.5 pl-8 pr-3 text-sm outline-none focus:border-indigo-400"
      />
    </div>
  );
}
