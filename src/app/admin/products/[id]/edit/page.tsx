'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductForm from '../../../components/ProductForm';
import Link from 'next/link';
import { ArrowRight, Edit3 } from 'lucide-react';
import { getSensaProduct } from '@/app/actions/sensaProductActions';

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getSensaProduct(id);
        if (res.success) {
          setProduct(res.data);
        } else {
          setError(res.error || 'المنتج غير موجود');
        }
      } catch (e: any) {
        setError(e.message || 'خطأ غير متوقع');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-100 border-t-blue-500 relative z-10"></div>
        </div>
        <p className="text-gray-500 font-bold animate-pulse">جاري تحميل بيانات المنتج...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20 bg-white rounded-[2rem] shadow-sm border border-gray-100 mt-8" dir="rtl">
        <div className="bg-red-50 text-red-500 p-5 rounded-full w-fit mx-auto mb-4 border border-red-100 shadow-inner">
          <Edit3 size={48} strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">تعذر إيجاد المنتج</h2>
        <p className="text-red-500 font-medium text-lg mb-8">{error || 'المنتج غير موجود'}</p>
        <Link href="/admin" className="bg-gray-900 text-white px-8 py-3.5 rounded-xl hover:bg-gray-800 transition-colors inline-block font-bold shadow-lg shadow-gray-900/20">
          العودة للمنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6 md:p-10 min-h-screen" dir="rtl">
      
      {/* Luxury Header */}
      <div className="relative overflow-hidden rounded-[1.5rem] bg-white border border-[#E8E2D9] shadow-[0_8px_30px_rgba(197,160,89,0.06)] p-8 md:p-10 z-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#C5A059]/10 to-transparent rounded-full blur-2xl opacity-60 -mr-10 -mt-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-main/5 to-transparent rounded-full blur-3xl opacity-70 -ml-10 -mb-10 pointer-events-none"></div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="bg-[#FDFBF7] border border-[#E8E2D9] p-4 rounded-2xl text-[#C5A059] shadow-sm">
              <Edit3 size={32} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#C5A059] uppercase tracking-[0.2em] mb-1.5">Edit Product</p>
              <h1 className="text-3xl md:text-4xl font-bold text-[#2A3B32] tracking-tight">تعديل: {product.name_ar}</h1>
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
        <ProductForm initialData={product} />
      </div>
    </div>
  );
}
