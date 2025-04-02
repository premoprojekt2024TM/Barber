import { Search, List, Grid } from "lucide-react";
import { SearchBarProps } from "./hairdresser";
export default function SearchBar({
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
}: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center">
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Fodrász keresése..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>

      <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-full">
        <button
          onClick={() => setViewMode("bubble")}
          className={`p-2 rounded-full ${viewMode === "bubble" ? "bg-white shadow" : "hover:bg-gray-200"}`}
          aria-label="Bubble View"
        >
          <Grid size={18} className="text-gray-700" />
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`p-2 rounded-full ${viewMode === "list" ? "bg-white shadow" : "hover:bg-gray-200"}`}
          aria-label="List View"
        >
          <List size={18} className="text-gray-700" />
        </button>
      </div>
    </div>
  );
}
