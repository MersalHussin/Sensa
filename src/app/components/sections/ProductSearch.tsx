"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { searchSensaProducts } from "../../actions/sensaProductActions";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function ProductSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 1) {
        setLoading(true);
        const res = await searchSensaProducts(query);
        if (res.success) {
          setResults(res.data || []);
        }
        setLoading(false);
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="relative z-50" ref={searchRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center gap-2 bg-slate-50 text-slate-700 hover:bg-main hover:text-white transition-all px-3 py-2 sm:px-4 sm:py-2.5 rounded-full font-bold text-sm shadow-sm hover:shadow-md cursor-pointer border border-slate-100 group"
        aria-label="Search"
      >
        <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className={`absolute top-full mt-4 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] w-[300px] sm:w-[350px] overflow-hidden border border-gray-100 ${
              isArabic ? 'left-0 sm:left-auto sm:-right-4' : 'right-0 sm:right-auto sm:-left-4'
            }`}
            dir={isArabic ? "rtl" : "ltr"}
          >
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isArabic ? "ابحث عن منتج..." : "Search for a product..."}
                className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 placeholder:text-gray-400"
                autoFocus
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-gray-400 hover:text-gray-600 transition">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="max-h-[300px] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center p-8 text-main">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : query.length > 1 && results.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-500">
                  {isArabic ? "لا توجد نتائج مطابقة" : "No results found"}
                </div>
              ) : (
                results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition border-b border-gray-50 last:border-none"
                  >
                    <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <Image
                        src={product.images?.[0] || "/placeholder.png"}
                        alt={isArabic ? product.name_ar : product.name_en}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-gray-800 truncate">
                        {isArabic ? product.name_ar : product.name_en}
                      </h4>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {isArabic ? product.description_ar : product.description_en}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
            
            {results.length > 0 && (
              <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                <Link
                  href={`/products?search=${query}`}
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-bold text-main hover:underline"
                >
                  {isArabic ? "عرض كل النتائج" : "View all results"}
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
