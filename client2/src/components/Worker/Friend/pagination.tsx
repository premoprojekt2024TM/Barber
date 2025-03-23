import { PaginationProps } from "./friends";
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mt-6">
      <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xl rounded-full px-4 py-2 shadow-md border border-white/20">
        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
              currentPage === pageNumber
                ? "bg-black text-white"
                : "bg-white/50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            {pageNumber}
          </button>
        ))}
      </div>
    </div>
  );
}
