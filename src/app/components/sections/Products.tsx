import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Product } from "../../types";

export default function Products({
  t,
  lang,
  isArabic,
  grouped,
  liked,
  toggleLike,
  fadeUp,
  loading,
}: {
  t: any;
  lang: string;
  isArabic: boolean;
  grouped: Record<string, Product[]>;
  liked: Record<string, boolean>;
  toggleLike: (p: Product) => void;
  fadeUp: any;
  loading: boolean;
}) {
  return (
    <section
      id="products"
      className="py-32 bg-[#FAFAFA] relative overflow-hidden"
    >
      {/* Elegant minimalist background accents */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-main/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-main/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-24">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="space-y-6">
            <motion.h2
              {...fadeUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide text-main uppercase"
            >
              {lang === "ar" ? "المنتجات" : "Products"}
            </motion.h2>
            <motion.div 
              {...fadeUp}
              className="w-24 h-[1px] bg-main mx-auto" 
            />
          </div>
        </div>

        {/* PRODUCTS CAROUSEL */}
        {loading ? (
          <div className="space-y-8 w-full">
            <div dir={isArabic ? "rtl" : "ltr"} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-8 md:gap-y-16 pb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="group flex flex-col animate-pulse">
                  <div className="w-full pt-[125%] bg-gray-200 rounded-2xl md:rounded-[2rem] mb-4 md:mb-6" />
                  <div className="flex-1 flex flex-col items-center space-y-4">
                     <div className="h-5 bg-gray-200 rounded w-2/3" />
                     <div className="h-3 bg-gray-200 rounded w-full" />
                     <div className="h-3 bg-gray-200 rounded w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="text-center py-24 text-gray-400 font-light text-xl tracking-wide">
            {isArabic ? "المجموعة غير متوفرة حالياً" : "Collection currently unavailable"}
          </div>
        ) : (
          Object.entries(grouped).map(([brandName, items]) => {
          return (
            <div key={brandName} className="space-y-12">
              <div
                dir={isArabic ? "rtl" : "ltr"}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8"
              >
                {items.map((p) => (
                  <motion.div
                    key={p.id}
                    className="group flex flex-col bg-transparent h-full cursor-pointer"
                  >
                    <Link
                      href={`/products/${p.slug}`}
                      className="block relative w-full pt-[125%] bg-white overflow-hidden rounded-2xl md:rounded-[2rem] shadow-sm hover:shadow-xl transition-shadow duration-500"
                    >
                      {/* Subtle hover overlay in main color */}
                      <div className="absolute inset-0 bg-main/0 group-hover:bg-main/5 transition-colors duration-700 z-10 pointer-events-none" />
                      
                      <Image
                        src={p.images?.[0] || "/images/Sensa.png"}
                        alt={isArabic ? p.name_ar : p.name_en}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-[1.5s] ease-out absolute top-0 left-0 w-full h-full"
                      />
                      
                      {p.best_selling && (
                        <div className="absolute top-3 rtl:right-3 ltr:left-3 md:top-5 md:rtl:right-5 md:ltr:left-5 z-20">
                          <span className="text-[8px] md:text-[10px] font-bold tracking-wider uppercase px-2 py-1 md:px-4 md:py-2 rounded-full bg-main text-white shadow-sm">
                            {isArabic ? "الأكثر مبيعاً" : "Best Seller"}
                          </span>
                        </div>
                      )}
                    </Link>
                    
                    <div className="pt-4 md:pt-6 flex flex-col flex-grow text-center">
                      <Link
                        href={`/products/${p.slug}`}
                        className="block mb-1 md:mb-2 flex-grow"
                      >
                        <h3
                          className="font-bold text-sm md:text-lg text-gray-900 transition-colors group-hover:text-main mb-1 md:mb-2 line-clamp-1"
                        >
                          {isArabic ? p.name_ar : p.name_en}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-500 line-clamp-2 leading-relaxed px-1 md:px-2">
                          {isArabic ? p.description_ar : p.description_en}
                        </p>
                      </Link>

                      <div className="flex items-center justify-center mt-3 md:mt-4 w-full">
                        <Link
                          href={`/products/${p.slug}`}
                          className="relative text-main font-bold tracking-wider uppercase text-[10px] md:text-xs hover:text-gray-900 transition-colors duration-300 overflow-hidden group/link flex items-center gap-1 md:gap-2"
                        >
                          {isArabic ? "التفاصيل" : "Discover"}
                          <span className="absolute bottom-0 left-0 w-full h-[2px] bg-main group-hover/link:bg-gray-900 transition-colors duration-300" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })
        )}
      </div>
    </section>
  );
}
