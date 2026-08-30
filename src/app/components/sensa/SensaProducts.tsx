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
      className="py-24 bg-gradient-to-b from-white to-[#D0DAD6]/20 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-main/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-main/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-16">
        <div className="flex flex-col items-center justify-center text-center">
          <motion.h2
            {...fadeUp}
            className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6"
          >
            {lang === "ar" ? "منتجات سينسا" : "Sensa Products"}
          </motion.h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-main to-[#D0DAD6] rounded-full mb-8" />
          <motion.p
            {...fadeUp}
            className="text-xl md:text-2xl font-bold text-main max-w-2xl"
          >
            {t.ctaTitle}
          </motion.p>
        </div>

        {/* PRODUCTS CAROUSEL */}
        {loading ? (
          <div className="space-y-8 w-full">
            <div dir={isArabic ? "rtl" : "ltr"} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="group rounded-[2rem] overflow-hidden bg-white shadow-[0_8px_20px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col animate-pulse h-[400px]">
                  <div className="h-[240px] bg-gray-200" />
                  <div className="p-6 bg-white flex-1 flex flex-col space-y-4">
                     <div className="h-6 bg-gray-200 rounded w-3/4" />
                     <div className="h-4 bg-gray-200 rounded w-full" />
                     <div className="h-4 bg-gray-200 rounded w-5/6" />
                     <div className="pt-5 border-t border-gray-100 mt-auto">
                        <div className="h-4 bg-gray-200 rounded w-1/4" />
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
                    className="group rounded-[2rem] overflow-hidden bg-white shadow-[0_8px_20px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_20px_40px_rgba(14,77,56,0.1)] hover:border-main/30 transition-all duration-300 hover:-translate-y-2 flex flex-col"
                  >
                    <Link
                      href={`/products/${p.slug}`}
                      className="block relative overflow-hidden h-[240px]"
                    >
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10" />
                      <Image
                        src={p.images?.[0] || "/placeholder.png"}
                        alt={isArabic ? p.name_ar : p.name_en}
                        width={400}
                        height={300}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      />
                      {p.best_selling && (
                        <div className="absolute top-4 rtl:right-4 ltr:left-4 z-20">
                          <span className="text-xs px-3 py-1.5 rounded-full bg-main text-white font-bold shadow-md">
                            {isArabic ? "الأكثر مبيعاً" : "Best Seller"}
                          </span>
                        </div>
                      )}
                    </Link>
                    <div className="p-6 bg-white flex-1 flex flex-col">
                      <Link
                        href={`/products/${p.slug}`}
                        className="block space-y-3 mb-6 flex-1"
                      >
                        <h3
                          className="font-extrabold text-xl leading-tight group-hover:text-main transition-colors duration-300 text-gray-900"
                        >
                          {isArabic ? p.name_ar : p.name_en}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed font-medium">
                          {isArabic ? p.description_ar : p.description_en}
                        </p>
                      </Link>

                      <div className="flex items-center justify-between pt-5 border-t border-gray-100 mt-auto">
                        <Link
                          href={`/products/${p.slug}`}
                          className="text-main font-bold text-sm hover:underline flex items-center gap-1 group/link"
                        >
                          {isArabic ? "التفاصيل" : "Details"}
                          {isArabic ? (
                            <ArrowLeft
                              size={18}
                              className="group-hover/link:-translate-x-1 transition-transform"
                            />
                          ) : (
                            <ArrowRight
                              size={18}
                              className="group-hover/link:translate-x-1 transition-transform"
                            />
                          )}
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
