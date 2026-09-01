import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

export default function SensaHero({ t, lang }: { t: any; lang: string }) {
  const isArabic = lang === "ar";

  return (
    <section className="relative w-full min-h-[100svh] flex items-center justify-center bg-[#FAFAFA] overflow-hidden">
      {/* Luxury subtle glows */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-main/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-main/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10 pt-28 pb-16">
        
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`flex flex-col justify-center ${isArabic ? 'lg:pl-10 text-right' : 'lg:pr-10 text-left'}`}
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          <div className="mb-6 flex">
            <Image
              src="/images/Sensa.png"
              alt="Sensa Logo"
              width={200}
              height={70}
              className="object-contain h-14 md:h-16 w-auto"
              priority
            />
          </div>

          <span className="text-main font-medium tracking-[0.25em] uppercase mb-6 text-xs md:text-sm flex items-center gap-3">
            <div className="w-8 h-[1px] bg-main/40" />
            {isArabic ? "العناية الفائقة بالشعر" : "Premium Haircare"}
            <div className="w-8 h-[1px] bg-main/40" />
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-[60px] font-bold mb-6 text-[#093526] tracking-wide leading-[1.1] drop-shadow-sm">
            {t.heroTitle}
          </h1>

          <p className="text-lg md:text-xl text-gray-500 mb-10 leading-relaxed font-medium tracking-wide max-w-md">
            {t.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="#products"
              className="group flex items-center justify-center gap-3 bg-[#0E4D38] text-white px-8 py-4 rounded-full font-medium tracking-wide text-lg transition-all duration-500 hover:bg-[#0a3a2a] hover:shadow-[0_10px_40px_rgba(14,77,56,0.3)] hover:-translate-y-1 w-full sm:w-auto border border-transparent hover:border-[#0E4D38]/50"
            >
              <span>{t.ctaBtn}</span>
              {isArabic ? (
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-500 stroke-[1.5]" />
              ) : (
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-500 stroke-[1.5]" />
              )}
            </Link>
            
            <Link
              href="#contact-us"
              className="flex items-center justify-center gap-3 text-[#0E4D38] hover:text-[#0a3a2a] px-8 py-4 rounded-full font-medium tracking-wide text-lg transition-all duration-500 w-full sm:w-auto border border-[#0E4D38]/20 hover:border-[#0E4D38]/40 hover:bg-[#0E4D38]/5"
            >
              {isArabic ? "تواصل معنا" : "Contact Us"}
            </Link>
          </div>
        </motion.div>

        {/* Image / Visuals */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          className="relative h-[450px] md:h-[600px] w-full flex justify-center items-center lg:mt-0 mt-8"
        >
          {/* Luxury Frame */}
          <div className="relative w-full max-w-[500px] h-full p-4 rounded-[2.5rem] border border-gray-200 bg-white/40 backdrop-blur-md group shadow-xl">
            <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-1000 z-20 pointer-events-none" />
              <Image
                src="/images/bgHero1.jpg"
                alt="Sensa Premium Haircare"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-[2s] ease-out"
                priority
                quality={100}
              />
              {/* Soft overlay for luxury feel */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"></div>
            </div>
            
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-10 w-px h-8 bg-gray-300 -translate-y-1/2" />
            <div className="absolute top-10 left-0 w-8 h-px bg-gray-300 -translate-x-1/2" />
            <div className="absolute bottom-0 right-10 w-px h-8 bg-gray-300 translate-y-1/2" />
            <div className="absolute bottom-10 right-0 w-8 h-px bg-gray-300 translate-x-1/2" />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
