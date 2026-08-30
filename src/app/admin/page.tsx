'use client';

import { useEffect, useState } from 'react';
import { getSensaProducts } from '@/app/actions/sensaProductActions';
import Link from 'next/link';
import Image from 'next/image';
import { Edit, Plus, PackageSearch, PackageOpen, Tag, Box, Star } from 'lucide-react';
import DeleteButton from './components/DeleteButton';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getSensaProducts();
        if (res.success) {
          setProducts(res.data || []);
        } else {
          setError(res.error || 'فشل في تحميل المنتجات');
        }
      } catch (e: any) {
        setError(e.message || 'خطأ غير متوقع');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-8 min-h-[80vh]" dir="rtl">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="bg-main/10 p-3.5 rounded-2xl text-main hidden sm:block">
            <PackageSearch size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">منتجات Sensa</h1>
            <p className="text-gray-500 mt-1 font-medium">إدارة جميع منتجات العلامة التجارية وتعديلها</p>
          </div>
        </div>
        <Link 
          href="/admin/products/new"
          className="flex items-center gap-2 bg-main text-white px-7 py-3.5 rounded-xl font-bold shadow-md shadow-main/20 hover:bg-main/90 hover:shadow-lg hover:-translate-y-0.5 transition-all w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          إضافة منتج جديد
        </Link>
      </div>

      {/* Stats Cards (Optional but adds professionalism) */}
      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-xl"><PackageOpen size={24} /></div>
            <div>
              <p className="text-gray-500 text-sm font-medium">إجمالي المنتجات</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-green-50 text-green-600 p-3 rounded-xl"><Star size={24} /></div>
            <div>
              <p className="text-gray-500 text-sm font-medium">الأكثر مبيعاً</p>
              <p className="text-2xl font-bold text-gray-900">{products.filter((p: any) => p.best_selling).length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Table Content */}
      <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-100 border-t-main"></div>
            <p className="text-gray-500 font-medium">جاري تحميل المنتجات...</p>
          </div>
        ) : error ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <div className="bg-red-50 text-red-500 p-4 rounded-full">
              <PackageSearch size={40} />
            </div>
            <p className="text-red-500 font-bold text-lg">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center gap-6 text-center">
            <div className="bg-gray-50 text-gray-400 p-8 rounded-full border border-gray-100 border-dashed">
              <Box size={48} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد منتجات حالياً</h3>
              <p className="text-gray-500 max-w-sm">لم تقم بإضافة أي منتجات لعلامة Sensa بعد. اضغط على الزر بالأعلى لإضافة منتجك الأول.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-gray-700">
              <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-900 font-bold">
                <tr>
                  <th className="py-5 px-6 whitespace-nowrap rounded-tr-3xl">المنتج</th>
                  <th className="py-5 px-6 whitespace-nowrap">الاسم (EN)</th>
                  <th className="py-5 px-6 whitespace-nowrap">الحجم</th>
                  <th className="py-5 px-6 whitespace-nowrap">الحالة</th>
                  <th className="py-5 px-6 whitespace-nowrap text-left rounded-tl-3xl">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product: any) => (
                  <tr key={product.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm group-hover:border-main/30 transition-colors">
                          {product.images && product.images[0] ? (
                            <Image 
                              src={product.images[0]} 
                              alt={product.name_ar} 
                              fill 
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs">
                              <Box size={16} className="mb-1" />
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 block">{product.name_ar}</span>
                          {product.category && product.category.length > 0 && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                              <Tag size={12} />
                              <span>{product.category[0]}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-600" dir="ltr">{product.name_en}</td>
                    <td className="py-4 px-6">
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm font-semibold inline-block" dir="ltr">
                        {product.volume || '-'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {product.best_selling ? (
                        <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold w-fit border border-green-100">
                          <Star size={14} className="fill-green-700" />
                          <span>أكثر مبيعاً</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-gray-50 text-gray-500 px-3 py-1.5 rounded-lg text-xs font-bold w-fit border border-gray-100">
                          <span>عادي</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/admin/products/${product.id}/edit`}
                          className="flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors font-semibold text-sm"
                        >
                          <Edit size={16} />
                          تعديل
                        </Link>
                        <DeleteButton id={product.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
