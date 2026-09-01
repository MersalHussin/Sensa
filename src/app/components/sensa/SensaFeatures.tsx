import React from "react";
import { motion } from "framer-motion";
import { iconMap, Feature } from "../../types";
import { Globe } from "lucide-react";

export default function SensaFeatures({ t }: { t: any }) {
  return (
    <section id="why-us" className="py-24 relative overflow-hidden bg-[#FAFAFA]">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-main/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-main/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center justify-center text-center mb-20">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide text-main">
              {t.featuresTitle}
            </h2>
            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-main/40 to-transparent mx-auto" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {t.features.map((f: Feature, i: number) => {
            const Icon = iconMap[f.icon] || Globe;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.1, duration: 0.7, ease: "easeOut" }}
                className="group relative p-8 bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_20px_40px_rgba(14,77,56,0.08)] hover:border-main/20 transition-all duration-[0.6s] hover:-translate-y-2 flex flex-col items-center text-center"
              >
                {/* Thin inner border for luxury feel */}
                <div className="absolute inset-1.5 border border-main/5 rounded-[1.35rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="relative w-20 h-20 flex items-center justify-center mb-6 rounded-full bg-main/5 border border-main/10 group-hover:bg-main group-hover:border-main transition-all duration-700">
                  <Icon size={30} className="text-main group-hover:text-white transition-colors duration-700 stroke-[1.5]" />
                </div>
                <h3 className="text-xl font-semibold tracking-wide mb-3 text-gray-900 group-hover:text-main transition-colors duration-500">
                  {f.title}
                </h3>
                <p className="text-gray-500 font-medium leading-relaxed relative z-10">
                  {f.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
