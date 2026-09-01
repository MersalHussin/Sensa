import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Heart } from "lucide-react";
import { Product, BRAND_UI } from "../../types";

export default function SensaProducts({
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
      className="py-24 bg-[#FDFDFD] relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-main/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-main/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-16">
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <div className="space-y-4">
            <motion.h2
              {...fadeUp}
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide text-main"
            >
              {lang === "ar" ? "منتجات سينسا" : "Sensa Products"}
            </motion.h2>
            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-main/40 to-transparent mx-auto" />
          </div>
          <motion.p
            {...fadeUp}
            className="text-lg md:text-xl font-medium tracking-wide text-gray-500 max-w-2xl mt-6"
          >
            {t.ctaTitle}
          </motion.p>
        </div>

        {/* PRODUCTS CAROUSEL */}
        {loading ? (
          <div className="space-y-8 w-full">
            <div dir={isArabic ? "rtl" : "ltr"} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="group rounded-3xl overflow-hidden bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col animate-pulse h-[400px]">
                  <div className="h-[240px] bg-gray-50" />
                  <div className="p-6 bg-white flex-1 flex flex-col space-y-4">
                     <div className="h-6 bg-gray-100 rounded w-3/4" />
                     <div className="h-4 bg-gray-100 rounded w-full" />
                     <div className="h-4 bg-gray-100 rounded w-5/6" />
                     <div className="pt-5 border-t border-gray-50 mt-auto">
                        <div className="h-4 bg-gray-100 rounded w-1/4" />
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-medium text-lg">
            {isArabic ? "لا توجد منتجات حالياً" : "No products available currently"}
          </div>
        ) : (
          Object.entries(grouped).map(([brandName, items]) => {
          return (
            <div key={brandName} className="space-y-8">
              {/* Products */}
              <div
                dir={isArabic ? "rtl" : "ltr"}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-6"
              >
                {items.map((p) => (
                  <motion.div
                    key={p.id}
                    className="group relative flex flex-col bg-transparent cursor-pointer"
                  >
                    <Link
                      href={`/products/${p.slug}`}
                      className="block relative overflow-hidden aspect-[4/5] bg-gray-50/50 w-full rounded-sm"
                    >
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none" />
                      <Image
                        src={p.images?.[0] || "/placeholder.png"}
                        alt={isArabic ? p.name_ar : p.name_en}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                      />
                      {p.best_selling && (
                        <div className="absolute top-4 rtl:right-4 ltr:left-4 z-20">
                          <span className="text-[9px] uppercase tracking-widest px-3 py-1.5 bg-black/80 backdrop-blur-sm text-white font-medium">
                            {isArabic ? "الأكثر مبيعاً" : "Best Seller"}
                          </span>
                        </div>
                      )}
                    </Link>
                    <div className="pt-6 pb-2 flex-1 flex flex-col items-center text-center">
                      <Link
                        href={`/products/${p.slug}`}
                        className="block space-y-2 mb-4 flex-1"
                      >
                        <h3
                          className="font-medium text-lg tracking-widest leading-tight text-gray-900 uppercase"
                        >
                          {isArabic ? p.name_ar : p.name_en}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed font-light px-4">
                          {isArabic ? p.description_ar : p.description_en}
                        </p>
                      </Link>

                      <div className="flex items-center justify-center mt-auto w-full">
                        <Link
                          href={`/products/${p.slug}`}
                          className="relative text-gray-900 font-light tracking-[0.2em] uppercase text-xs hover:text-main transition-colors duration-500 overflow-hidden group/link pb-1"
                        >
                          {isArabic ? "اكتشف المنتج" : "Discover"}
                          <span className="absolute bottom-0 left-0 w-full h-[1px] bg-main -translate-x-full group-hover/link:translate-x-0 transition-transform duration-500 ease-out" />
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
