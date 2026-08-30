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
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-100 border-t-main"></div>
        <p className="text-gray-500 font-medium">جاري تحميل بيانات المنتج...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 mt-8" dir="rtl">
        <div className="bg-red-50 text-red-500 p-4 rounded-full w-fit mx-auto mb-4">
          <Edit3 size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">تعذر إيجاد المنتج</h2>
        <p className="text-red-500 font-medium text-lg mb-6">{error || 'المنتج غير موجود'}</p>
        <Link href="/admin" className="bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors inline-block font-bold">
          العودة للمنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 md:p-8 min-h-[80vh]" dir="rtl">
      
      {/* Polished Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white p-6 md:p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-blue-500 to-blue-300 rounded-r-3xl"></div>
        <Link 
          href="/admin" 
          className="p-2.5 text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-xl transition-colors shrink-0"
        >
          <ArrowRight size={22} />
        </Link>
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 p-3.5 rounded-2xl text-blue-600 hidden sm:block">
            <Edit3 size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">تعديل المنتج</h1>
            <p className="text-gray-500 mt-1 font-medium">تعديل بيانات المنتج: <span className="text-gray-900 font-bold">{product.name_ar}</span></p>
          </div>
        </div>
      </div>
      
      <ProductForm initialData={product} />
    </div>
  );
}
