import type React from "react";

import { useState, useEffect, useRef } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const previousQueryRef = useRef("");

  useEffect(() => {
    if (query !== previousQueryRef.current) {
      previousQueryRef.current = query;
      onSearch(query);
    }
  }, [query, onSearch]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <div className="flex justify-center w-full my-3 max-w-3xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-xl p-[2px] flex items-center rounded-full
          bg-white/80 backdrop-blur-xl shadow-lg border border-white/20
          transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 hover:bg-white/90
          before:content-[''] before:absolute before:inset-x-0 before:top-0 before:h-1/2
          before:rounded-t-full before:bg-gradient-to-b before:from-white/30 before:to-transparent
          before:pointer-events-none"
      >
        <input
          className="w-full px-4 py-3 bg-transparent text-lg text-slate-800 placeholder:text-slate-500 focus:outline-none"
          placeholder="Barát keresése..."
          aria-label="search for friends"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
    </div>
  );
}
