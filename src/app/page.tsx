"use client";

import React, { useMemo, useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { supabase } from "./lib/supabaseClient";


// Data and Types
import { translations } from "./translations";
import { Product } from "./types";

// Extracted Sections
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Features from "./components/sections/Features";
import Categories from "./components/sections/Categories";
import Achievements from "./components/sections/Achievements";
import Timeline from "./components/sections/Timeline";
import Products from "./components/sections/Products";
import Contact from "./components/sections/Contact";
import { mockProducts } from "./products/data";

export default function SensaPage() {
  const { i18n } = useTranslation();
  const lang = i18n?.language === "ar" ? "ar" : "en";
  const t = useMemo(() => translations[lang], [lang]);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      setLoading(true);
      
      try {
        const fetchPromise = supabase
          .from("sensa_products")
          .select("*")
          .order('created_at', { ascending: false });
          
        const timeoutPromise = new Promise<{ data: any, error: any }>((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 10000)
        );
        
        const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

        if (mounted && !error && data) {
          setProducts(data);
        } else if (error) {
          console.error("Error fetching products:", error);
        }
      } catch (err) {
        console.error("Fetch timed out or failed:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProducts();
    
    return () => {
      mounted = false;
    };
  }, []);

  const fadeUp = {
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
  };

  const isArabic = lang === "ar";

  /* ===== Like System ===== */
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  const toggleLike = (product: Product) => {
    setLiked((prev) => ({
      ...prev,
      [product.id]: !prev[product.id],
    }));
  };

  /* ===== Group Products By Brand ===== */
  const grouped = useMemo(() => {
    const map: Record<string, Product[]> = {};

    products.forEach((p) => {
      const brand = p.brand || "Sensa";
      if (!map[brand]) map[brand] = [];
      map[brand].push(p as Product);
    });

    return map;
  }, [products]);


  return (
    <>
      <main dir={t.dir} className="min-h-screen bg-gradient-to-b from-white via-white to-[#D0DAD6]/20">
        <Hero t={t} lang={lang} />
        
        <About t={t} lang={lang} />
        
        <Features t={t} />        
        
        <Products
          t={t}
          lang={lang}
          isArabic={isArabic}
          grouped={grouped}
          liked={liked}
          toggleLike={toggleLike}
          fadeUp={fadeUp}
          loading={loading}
        />
        <Timeline t={t} />
        

        <Contact t={t} lang={lang} />
      </main>
    </>
  );
}
