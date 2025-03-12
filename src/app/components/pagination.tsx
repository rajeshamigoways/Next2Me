import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const Pagination = ({ page, totalPages, setPage }) => {
  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      {/* Previous Button */}
      <motion.button
        whileHover={{ scale: page > 1 ? 1.1 : 1 }}
        whileTap={{ scale: 0.9 }}
        disabled={page === 1}
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all
          ${page === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-indigo-500 text-white hover:bg-indigo-600"}`}
      >
        <ChevronLeft size={18} />
        Previous
      </motion.button>

      {/* Page Info */}
      <span className="text-lg font-medium">
        Page <span className="text-indigo-600">{page}</span> of {totalPages}
      </span>

      {/* Next Button */}
      <motion.button
        whileHover={{ scale: page < totalPages ? 1.1 : 1 }}
        whileTap={{ scale: 0.9 }}
        disabled={page >= totalPages}
        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all
          ${page >= totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-indigo-500 text-white hover:bg-indigo-600"}`}
      >
        Next
        <ChevronRight size={18} />
      </motion.button>
    </div>
  );
};

export default Pagination;
