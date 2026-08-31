import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

export default function SensaHero({ t, lang }: { t: any; lang: string }) {
  const isArabic = lang === "ar";

  return (
    <section className="relative w-full min-h-[100svh] flex items-center justify-center bg-[#FDFDFD] overflow-hidden">
      {/* Abstract Background Shapes for organic feel */}
      <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-bl from-[#E8F0EC]/80 to-transparent rounded-bl-[300px] opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-[40%] h-[60%] bg-gradient-to-tr from-[#E8F0EC]/60 to-transparent rounded-tr-[300px] opacity-70"></div>
      
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

          <span className="text-main/80 font-bold tracking-[0.2em] uppercase mb-4 text-xs md:text-sm flex items-center gap-2">
            <Sparkles size={14} className="text-main" />
            {isArabic ? "العناية الفائقة بالشعر" : "Premium Haircare"}
            <Sparkles size={14} className="text-main" />
          </span>

          <h1 className="text-5xl md:text-6xl lg:text-[72px] font-black mb-6 text-[#093526] tracking-tight leading-[1.1] drop-shadow-sm">
            {t.heroTitle}
          </h1>

          <p className="text-lg md:text-xl text-gray-500 mb-10 leading-relaxed font-normal max-w-lg">
            {t.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="#products"
              className="group flex items-center justify-center gap-3 bg-[#0E4D38] text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:bg-[#0a3a2a] hover:shadow-[0_10px_30px_rgba(14,77,56,0.25)] hover:-translate-y-1 w-full sm:w-auto"
            >
              <span>{t.ctaBtn}</span>
              {isArabic ? (
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              ) : (
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              )}
            </Link>
            
            <Link
              href="#contact-us"
              className="flex items-center justify-center gap-3 text-[#0E4D38] hover:text-[#0a3a2a] px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 w-full sm:w-auto border-2 border-[#0E4D38]/10 hover:border-[#0E4D38]/30 hover:bg-[#0E4D38]/5"
            >
              {isArabic ? "تواصل معنا" : "Contact Us"}
            </Link>
          </div>
        </motion.div>

        {/* Image / Visuals */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="relative h-[450px] md:h-[600px] w-full flex justify-center items-center lg:mt-0 mt-8"
        >
          {/* Decorative abstract framing */}
          <div className="absolute inset-0 border-2 border-[#0E4D38]/10 rounded-[40px] md:rounded-[60px] transform rotate-3 scale-105 transition-transform duration-700 hover:rotate-6"></div>
          <div className="absolute inset-0 bg-white shadow-2xl rounded-[40px] md:rounded-[60px] transform -rotate-2 scale-100"></div>
          
          <div className="relative w-full h-full rounded-[40px] md:rounded-[60px] overflow-hidden shadow-inner">
            <Image
              src="/images/bgHero1.jpg"
              alt="Sensa Premium Haircare"
              fill
              className="object-cover object-center hover:scale-110 transition-transform duration-[3s] ease-out"
              priority
              quality={100}
            />
            {/* Soft overlay for luxury feel */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          </div>

          {/* Floating element for added luxury feel */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-8 -left-4 md:-left-12 bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-white/50 flex items-center gap-4 z-20"
          >
            <div className="w-12 h-12 bg-[#0E4D38]/10 rounded-full flex items-center justify-center text-[#0E4D38]">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="font-black text-gray-900 text-lg leading-tight">100%</p>
              <p className="text-gray-500 text-xs font-semibold">{isArabic ? "شعر صحي وحيوي" : "Healthy & Vibrant"}</p>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
