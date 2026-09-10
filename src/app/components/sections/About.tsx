import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function About({
  t,
  lang,
}: {
  t: any;
  lang: string;
}) {
  return (
    <section id="who-we-are" className="py-24 relative overflow-hidden bg-main text-white">
      {/* Luxury subtle glows */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-black/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Column */}
          <motion.div
            initial={{ opacity: 0, x: lang === "ar" ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 order-2 lg:order-2 relative z-10"
          >
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide text-white leading-tight">
                {t.whoTitle}
              </h2>
              <div className="w-32 h-[1px] bg-gradient-to-r from-white/60 to-transparent" />
            </div>
            <p className="text-white/90 text-lg md:text-xl leading-relaxed font-normal tracking-wide">
              {t.whoText}
            </p>
          </motion.div>

          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: lang === "ar" ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative lg:h-[500px] flex items-center justify-center order-1 lg:order-1"
          >
            {/* Luxury Frame */}
            <div className="relative w-full max-w-[450px] h-[450px] lg:h-[500px] p-3 rounded-[2rem] border border-white/20 bg-white/5 backdrop-blur-sm group">
              <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700 z-20 pointer-events-none" />
                <Image
                  src="/images/sensaProducts.png"
                  alt="Sensa Products"
                  width={800}
                  height={800}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                />
              </div>
              
              {/* Decorative corner accents */}
              <div className="absolute top-0 left-8 w-px h-6 bg-white/40 -translate-y-1/2" />
              <div className="absolute top-8 left-0 w-6 h-px bg-white/40 -translate-x-1/2" />
              <div className="absolute bottom-0 right-8 w-px h-6 bg-white/40 translate-y-1/2" />
              <div className="absolute bottom-8 right-0 w-6 h-px bg-white/40 translate-x-1/2" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
