import ProductForm from '../../components/ProductForm';
import Link from 'next/link';
import { ArrowRight, Plus } from 'lucide-react';

export default function NewProductPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6 md:p-10 min-h-screen" dir="rtl">
      
      {/* Luxury Header */}
      <div className="relative overflow-hidden rounded-[1.5rem] bg-white border border-[#E8E2D9] shadow-[0_8px_30px_rgba(197,160,89,0.06)] p-8 md:p-10 z-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#C5A059]/10 to-transparent rounded-full blur-2xl opacity-60 -mr-10 -mt-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-main/5 to-transparent rounded-full blur-3xl opacity-70 -ml-10 -mb-10 pointer-events-none"></div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="bg-[#FDFBF7] border border-[#E8E2D9] p-4 rounded-2xl text-[#C5A059] shadow-sm">
              <Plus size={32} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#C5A059] uppercase tracking-[0.2em] mb-1.5">New Product</p>
              <h1 className="text-3xl md:text-4xl font-bold text-[#2A3B32] tracking-tight">إضافة منتج</h1>
            </div>
          </div>
          <Link 
            href="/admin"
            className="group flex items-center gap-2.5 bg-white text-[#2A3B32] px-6 py-3.5 rounded-xl font-bold transition-all hover:bg-[#FDFBF7] border border-[#E8E2D9] shadow-sm w-full sm:w-auto justify-center"
          >
            <ArrowRight size={18} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span>العودة للمنتجات</span>
          </Link>
        </div>
      </div>
      
      <div className="bg-white rounded-[1.5rem] shadow-[0_8px_30px_rgba(197,160,89,0.06)] border border-[#E8E2D9] p-8 md:p-10 overflow-hidden">
        <ProductForm />
      </div>
    </div>
  );
}
