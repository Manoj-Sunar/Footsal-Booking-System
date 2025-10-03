import React, { useMemo, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

/**
 * Pagination (Smaller version)
 * - Rectangular page items with smooth animations
 * - Default size set to small for compact buttons
 */

const sizes = {
  sm: {
    px: "px-2",
    py: "py-1",
    text: "text-xs", // smaller text
    gap: "gap-1.5",
    minw: "min-w-[28px]", // slightly narrower
  },
  md: {
    px: "px-3",
    py: "py-2",
    text: "text-sm",
    gap: "gap-2",
    minw: "min-w-[36px]",
  },
  lg: {
    px: "px-4",
    py: "py-3",
    text: "text-base",
    gap: "gap-3",
    minw: "min-w-[44px]",
  },
};

function range(start, end) {
  const out = [];
  for (let i = start; i <= end; i++) out.push(i);
  return out;
}

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  showFirstLast = true,
  size = "sm", // default changed to small
  className = "",
}) {
  const tp = Math.max(1, Math.floor(totalPages || 0));
  const cp = Math.min(Math.max(1, Math.floor(currentPage || 1)), tp);
  const s = sizes[size] ? size : "sm";

  const paginationRange = useMemo(() => {
    const totalNumbers = siblingCount * 2 + 3 + boundaryCount * 2;
    const totalBlocks = totalNumbers;

    if (tp <= totalBlocks) {
      return range(1, tp);
    }

    const leftSiblingIndex = Math.max(cp - siblingCount, boundaryCount + 2);
    const rightSiblingIndex = Math.min(
      cp + siblingCount,
      tp - (boundaryCount + 1)
    );

    const shouldShowLeftDots = leftSiblingIndex > boundaryCount + 2;
    const shouldShowRightDots = rightSiblingIndex < tp - (boundaryCount + 1);

    const firstPages = range(1, boundaryCount);
    const lastPages = range(tp - boundaryCount + 1, tp);

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = boundaryCount + 2 * siblingCount + 2;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, "dots", ...lastPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = boundaryCount + 2 * siblingCount + 2;
      const rightRange = range(tp - rightItemCount + 1, tp);
      return [...firstPages, "dots", ...rightRange];
    }

    return [
      ...firstPages,
      "dots",
      ...range(leftSiblingIndex, rightSiblingIndex),
      "dots",
      ...lastPages,
    ];
  }, [tp, cp, siblingCount, boundaryCount]);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "ArrowLeft") {
        if (cp > 1) onPageChange(cp - 1);
      } else if (e.key === "ArrowRight") {
        if (cp < tp) onPageChange(cp + 1);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [cp, tp, onPageChange]);

  const goTo = useCallback(
    (page) => {
      if (page < 1 || page > tp || page === cp) return;
      onPageChange(page);
    },
    [tp, cp, onPageChange]
  );

  if (tp === 1) return null;

  return (
    <nav
      className={`flex items-center justify-center ${className}`}
      aria-label="Pagination Navigation"
    >
      <div className={`inline-flex ${sizes[s].gap} items-center`}>
        {showFirstLast && (
          <button
            onClick={() => goTo(1)}
            disabled={cp === 1}
            aria-label="Go to first page"
            className={`inline-flex items-center ${sizes[s].px} ${sizes[s].py} ${sizes[s].text} ${sizes[s].minw} justify-center border rounded-sm shadow-sm bg-white disabled:opacity-50`}
          >
            «
          </button>
        )}

        <button
          onClick={() => goTo(cp - 1)}
          disabled={cp === 1}
          aria-label="Previous page"
          className={`inline-flex items-center ${sizes[s].px} ${sizes[s].py} ${sizes[s].text} ${sizes[s].minw} justify-center border rounded-sm shadow-sm bg-white disabled:opacity-50`}
        >
          ‹
        </button>

        {paginationRange.map((item, idx) => {
          if (item === "dots") {
            return (
              <div
                key={`dots-${idx}`}
                className={`flex items-center ${sizes[s].px} ${sizes[s].py} ${sizes[s].text} ${sizes[s].minw} justify-center border rounded-sm shadow-sm bg-white`}
                aria-hidden
              >
                •••
              </div>
            );
          }

          const page = item;
          const isActive = page === cp;

          return (
            <motion.button
              key={page}
              onClick={() => goTo(page)}
              whileTap={{ scale: 0.96 }}
              aria-current={isActive ? "page" : undefined}
              aria-label={`Go to page ${page}`}
              className={`relative inline-flex items-center ${sizes[s].px} ${sizes[s].py} ${sizes[s].text} ${sizes[s].minw} justify-center border rounded-sm shadow-sm ${
                isActive
                  ? "bg-sky-600 text-white border-sky-600"
                  : "bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span>{page}</span>
              {isActive && (
                <motion.span
                  layoutId="active-pill"
                  className="pointer-events-none absolute inset-0 rounded-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.06 }}
                />
              )}
            </motion.button>
          );
        })}

        <button
          onClick={() => goTo(cp + 1)}
          disabled={cp === tp}
          aria-label="Next page"
          className={`inline-flex items-center ${sizes[s].px} ${sizes[s].py} ${sizes[s].text} ${sizes[s].minw} justify-center border rounded-sm shadow-sm bg-white disabled:opacity-50`}
        >
          ›
        </button>

        {showFirstLast && (
          <button
            onClick={() => goTo(tp)}
            disabled={cp === tp}
            aria-label="Go to last page"
            className={`inline-flex items-center ${sizes[s].px} ${sizes[s].py} ${sizes[s].text} ${sizes[s].minw} justify-center border rounded-sm shadow-sm bg-white disabled:opacity-50`}
          >
            »
          </button>
        )}
      </div>

      <div className="ml-2 hidden sm:flex items-center text-xs text-slate-600">
        Page <span className="mx-1 font-semibold text-slate-800">{cp}</span> of{" "}
        <span className="ml-1">{tp}</span>
      </div>
    </nav>
  );
}
