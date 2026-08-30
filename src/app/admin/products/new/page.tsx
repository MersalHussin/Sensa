import ProductForm from '../../components/ProductForm';
import Link from 'next/link';
import { ArrowRight, PlusCircle } from 'lucide-react';

export default function NewProductPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 md:p-8 min-h-[80vh]" dir="rtl">
      
      {/* Polished Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white p-6 md:p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-main to-[#D0DAD6] rounded-r-3xl"></div>
        <Link 
          href="/admin" 
          className="p-2.5 text-gray-500 hover:text-main bg-gray-50 hover:bg-main/10 rounded-xl transition-colors shrink-0"
        >
          <ArrowRight size={22} />
        </Link>
        <div className="flex items-center gap-4">
          <div className="bg-main/10 p-3.5 rounded-2xl text-main hidden sm:block">
            <PlusCircle size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">إضافة منتج جديد</h1>
            <p className="text-gray-500 mt-1 font-medium">أدخل بيانات المنتج الجديد لعلامة Sensa</p>
          </div>
        </div>
      </div>
      
      <ProductForm />
    </div>
  );
}
