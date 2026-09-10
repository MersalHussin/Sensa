import React from "react";
import { motion } from "framer-motion";
import {
  Microscope,
  Blend,
  ClipboardCheck,
  FileBadge,
  Rocket,
  Globe,
} from "lucide-react";

export default function Timeline({ t }: { t: any }) {
  const isArabic = t.dir === "rtl" || t.timelineTitle === "رحلة المنتج" || t.timelineTitle?.match(/[\u0600-\u06FF]/);

  return (
    <section id="product-journey" className="py-32 bg-main relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-24">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white"
          >
            {t.timelineTitle}
          </motion.h3>
        </div>

        {/* Timeline Container */}
        <div className="relative mt-20">
          {/* Horizontal Line (Desktop) */}
          <div className="hidden lg:block absolute top-[120px] left-0 right-0 h-[1px] bg-white/30 z-0" />
          
          {/* Vertical Line (Mobile/Tablet) */}
          <div className="lg:hidden absolute top-0 bottom-0 left-[28px] rtl:right-[28px] rtl:left-auto w-[1px] bg-white/30 z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-0 relative z-10">
            {t.timeline.map((step: string, i: number) => {
              const icons = [Microscope, Blend, ClipboardCheck, FileBadge, Rocket];
              const Icon = icons[i] || Globe;
              const numberString = (i + 1).toString().padStart(2, "0");

              return (
                <motion.div
                  key={i}
                  className="group relative flex flex-row lg:flex-col items-center lg:items-center gap-8 lg:gap-0 cursor-default"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.7, ease: "easeOut" }}
                >
                  {/* Step Number */}
                  <div className="lg:mb-12 w-16 lg:w-auto text-center flex-shrink-0">
                    <span className="text-5xl lg:text-7xl font-light text-white/20 group-hover:text-white/50 transition-colors duration-700 font-serif">
                      {numberString}
                    </span>
                  </div>

                  {/* Node Dot */}
                  <div className="relative flex items-center justify-center lg:mb-12">
                    <div className="w-20 h-20 bg-main rounded-full border border-white/40 flex items-center justify-center shadow-lg group-hover:border-white group-hover:bg-white/10 transition-all duration-500 z-10 relative">
                    <div className="w-20 h-20 bg-main rounded-full border border-white/60 flex items-center justify-center shadow-lg group-hover:border-white group-hover:bg-white/10 transition-all duration-500 z-10 relative">
                      <Icon strokeWidth={2} className="w-8 h-8 text-white group-hover:scale-110 transition-all duration-500" />
                    </div>
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 lg:text-center px-4">
                    <h4 className="text-xl font-bold text-white group-hover:text-white transition-colors duration-500 tracking-wide">
                      {step}
                    </h4>
                    {/* Subtle underline that animates on hover */}
                    <div className="w-0 h-[2px] bg-white mt-4 lg:mx-auto group-hover:w-12 transition-all duration-500 ease-out" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
