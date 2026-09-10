"use client";

import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { translations } from "../translations";
import { Product } from "../types";
import Products from "../components/sections/Products";
import Header from "../components/sections/Header";
import Contact from "../components/sections/Contact";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function ProductsClientPage({ initialProducts, query }: { initialProducts: Product[], query: string }) {
  const { i18n } = useTranslation();
  const lang = i18n?.language === "ar" ? "ar" : "en";
  const t = useMemo(() => translations[lang] || translations["en"], [lang]);
  const isArabic = lang === "ar";

  const [liked, setLiked] = useState<Record<string, boolean>>({});

  const toggleLike = (product: Product) => {
    setLiked((prev) => ({
      ...prev,
      [product.id]: !prev[product.id],
    }));
  };

  const grouped = useMemo(() => {
    const map: Record<string, Product[]> = {};
    initialProducts.forEach((p) => {
      const brand = p.brand || "Sensa";
      if (!map[brand]) map[brand] = [];
      map[brand].push(p as Product);
    });
    return map;
  }, [initialProducts]);

  const fadeUp = {
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
  };

  return (
    <main dir={t.dir} className="min-h-screen bg-[#FAFAFA] pt-24">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-20">
        <Link 
          href="/" 
          className="inline-flex items-center gap-3 text-gray-400 hover:text-gray-900 transition-colors font-medium text-sm tracking-wider uppercase mb-8"
        >
          {isArabic ? <ArrowRight size={16} className="text-main" /> : <ArrowLeft size={16} className="text-main" />}
          {isArabic ? "العودة للرئيسية" : "Back to Home"}
        </Link>

        {query && (
          <div className="mb-8 border-b border-gray-200 pb-8">
            <h1 className="text-3xl md:text-4xl font-light text-gray-900 tracking-wide uppercase">
              {isArabic ? `نتائج البحث عن: "${query}"` : `Search results for: "${query}"`}
            </h1>
            <p className="text-main mt-3 tracking-widest font-medium text-sm uppercase">
              {isArabic 
                ? `تم العثور على ${initialProducts.length} منتجات` 
                : `Found ${initialProducts.length} products`}
            </p>
          </div>
        )}
      </div>

      <Products
        t={t}
        lang={lang}
        isArabic={isArabic}
        grouped={grouped}
        liked={liked}
        toggleLike={toggleLike}
        fadeUp={fadeUp}
        loading={false}
      />
      
      <Contact t={t} lang={lang} />
    </main>
  );
}
