"use client";

import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { translations } from "../translations";
import { Product } from "../types";
import SensaProducts from "../components/sensa/SensaProducts";
import SensaHeader from "../components/sensa/SensaHeader";
import SensaContact from "../components/sensa/SensaContact";
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
    <main dir={t.dir} className="min-h-screen bg-gradient-to-b from-white via-white to-[#D0DAD6]/20 pt-24">
      <SensaHeader />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-main transition-colors font-medium text-sm mb-8"
        >
          {isArabic ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          {isArabic ? "العودة للرئيسية" : "Back to Home"}
        </Link>

        {query && (
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {isArabic ? `نتائج البحث عن: "${query}"` : `Search results for: "${query}"`}
            </h1>
            <p className="text-gray-500 mt-2">
              {isArabic 
                ? `تم العثور على ${initialProducts.length} منتجات` 
                : `Found ${initialProducts.length} products`}
            </p>
          </div>
        )}
      </div>

      <SensaProducts
        t={t}
        lang={lang}
        isArabic={isArabic}
        grouped={grouped}
        liked={liked}
        toggleLike={toggleLike}
        fadeUp={fadeUp}
        loading={false}
      />
      
      <SensaContact t={t} lang={lang} />
    </main>
  );
}
