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
    <div className="max-w-7xl mx-auto space-y-8 p-6 md:p-10 min-h-screen" dir="rtl">
      
      {/* Luxury Header */}
      <div className="relative overflow-hidden rounded-[1.5rem] bg-white border border-[#E8E2D9] shadow-[0_8px_30px_rgba(197,160,89,0.06)] p-8 md:p-10 z-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#C5A059]/10 to-transparent rounded-full blur-2xl opacity-60 -mr-10 -mt-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-main/5 to-transparent rounded-full blur-3xl opacity-70 -ml-10 -mb-10 pointer-events-none"></div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="bg-[#FDFBF7] border border-[#E8E2D9] p-4 rounded-2xl text-[#C5A059] shadow-sm">
              <PackageSearch size={32} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#C5A059] uppercase tracking-[0.2em] mb-1.5">Product Management</p>
              <h1 className="text-3xl md:text-4xl font-bold text-[#2A3B32] tracking-tight">إدارة المنتجات</h1>
            </div>
          </div>
          <Link 
            href="/admin/products/new"
            className="group flex items-center gap-2.5 bg-main text-white px-8 py-3.5 rounded-xl font-bold transition-all hover:bg-[#0A3627] hover:shadow-[0_8px_20px_rgba(14,77,56,0.2)] border border-[#0A3627]/50 w-full sm:w-auto justify-center"
          >
            <Plus size={20} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-300" />
            <span>إضافة منتج</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(197,160,89,0.04)] border border-[#E8E2D9] flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#C5A059]/40 group-hover:bg-[#C5A059] transition-colors"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="bg-[#FDFBF7] text-[#C5A059] p-3 rounded-xl border border-[#E8E2D9]">
                <PackageOpen size={20} strokeWidth={2} />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#2A3B32] mb-1">{products.length}</p>
              <p className="text-[#8C8374] text-xs font-bold uppercase tracking-widest">إجمالي المنتجات</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(197,160,89,0.04)] border border-[#E8E2D9] flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-main/40 group-hover:bg-main transition-colors"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="bg-[#FDFBF7] text-main p-3 rounded-xl border border-[#E8E2D9]">
                <Star size={20} strokeWidth={2} />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#2A3B32] mb-1">{products.filter((p: any) => p.best_selling).length}</p>
              <p className="text-[#8C8374] text-xs font-bold uppercase tracking-widest">الأكثر مبيعاً</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(197,160,89,0.04)] border border-[#E8E2D9] flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#8C8374]/40 group-hover:bg-[#8C8374] transition-colors"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="bg-[#FDFBF7] text-[#8C8374] p-3 rounded-xl border border-[#E8E2D9]">
                <Tag size={20} strokeWidth={2} />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#2A3B32] mb-1">
                {Array.from(new Set(products.map(p => p.category?.[0]).filter(Boolean))).length}
              </p>
              <p className="text-[#8C8374] text-xs font-bold uppercase tracking-widest">الأقسام</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-[1.5rem] shadow-[0_8px_30px_rgba(197,160,89,0.06)] border border-[#E8E2D9] overflow-hidden">
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-4">
            <div className="animate-spin h-8 w-8 border-2 border-[#E8E2D9] border-t-[#C5A059] rounded-full"></div>
            <p className="text-[#8C8374] text-xs font-bold uppercase tracking-widest">جاري التحميل</p>
          </div>
        ) : error ? (
          <div className="py-24 text-center">
            <p className="text-[#B44C4C] font-bold">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-32 text-center bg-white flex flex-col items-center">
            <Box size={48} className="text-[#E8E2D9] mb-4" strokeWidth={1} />
            <p className="text-[#8C8374] font-bold text-lg">لا توجد منتجات حالياً</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-right text-[#2A3B32] border-collapse">
                <thead>
                  <tr className="bg-[#FDFBF7] border-b border-[#E8E2D9]">
                    <th className="py-5 px-6 text-[11px] font-bold text-[#8C8374] uppercase tracking-wider w-[350px]">المنتج</th>
                    <th className="py-5 px-6 text-[11px] font-bold text-[#8C8374] uppercase tracking-wider">الاسم بالإنجليزي</th>
                    <th className="py-5 px-6 text-[11px] font-bold text-[#8C8374] uppercase tracking-wider">الحجم</th>
                    <th className="py-5 px-6 text-[11px] font-bold text-[#8C8374] uppercase tracking-wider">الحالة</th>
                    <th className="py-5 px-6 text-[11px] font-bold text-[#8C8374] uppercase tracking-wider text-left">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D9]">
                  {products.map((product: any) => (
                    <tr key={product.id} className="hover:bg-[#FDFBF7]/60 transition-colors group">
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-5">
                          <div className="relative w-14 h-16 bg-[#FDFBF7] rounded-xl overflow-hidden flex-shrink-0 border border-[#E8E2D9]">
                            {product.images && product.images[0] ? (
                              <Image 
                                src={product.images[0]} 
                                alt={product.name_ar} 
                                fill 
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-[#D6D0C4]">
                                <Box size={20} strokeWidth={1.5} />
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-sm text-[#2A3B32] block mb-1.5">{product.name_ar}</span>
                            {product.category && product.category.length > 0 && (
                              <span className="text-[10px] uppercase tracking-widest text-[#8C8374] font-bold border border-[#E8E2D9] px-2 py-0.5 rounded bg-white">
                                {product.category[0]}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6 font-semibold text-sm text-[#5C6B61]" dir="ltr">{product.name_en || '-'}</td>
                      <td className="py-5 px-6">
                        <span className="bg-[#FDFBF7] text-[#5C6B61] border border-[#E8E2D9] px-3 py-1 rounded-lg text-xs font-bold inline-block" dir="ltr">
                          {product.volume || '-'}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        {product.best_selling ? (
                          <div className="flex items-center gap-1.5 text-[#B8860B] bg-[#FDFBF7] border border-[#C5A059]/30 px-3 py-1.5 rounded-lg text-xs font-bold w-fit">
                            <Star size={14} className="fill-[#C5A059] text-[#C5A059]" />
                            <span>أكثر مبيعاً</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-[#8C8374] bg-[#FDFBF7] border border-[#E8E2D9] px-3 py-1.5 rounded-lg text-xs font-bold w-fit">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#D6D0C4]"></div>
                            <span>عادي</span>
                          </div>
                        )}
                      </td>
                      <td className="py-5 px-6 text-left">
                        <div className="flex items-center justify-end gap-3 opacity-70 group-hover:opacity-100 transition-opacity">
                          <Link 
                            href={`/admin/products/${product.id}/edit`}
                            className="flex items-center justify-center w-9 h-9 bg-white border border-[#E8E2D9] text-[#5C6B61] hover:text-main hover:border-main hover:bg-[#FDFBF7] rounded-lg transition-all shadow-sm"
                            title="تعديل"
                          >
                            <Edit size={16} strokeWidth={2} />
                          </Link>
                          <DeleteButton id={product.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden flex flex-col divide-y divide-[#E8E2D9]">
              {products.map((product: any) => (
                <div key={product.id} className="p-4 bg-white flex flex-col gap-3">
                  <div className="flex gap-4">
                    <div className="relative w-20 h-24 bg-[#FDFBF7] rounded-xl overflow-hidden flex-shrink-0 border border-[#E8E2D9]">
                      {product.images && product.images[0] ? (
                        <Image 
                          src={product.images[0]} 
                          alt={product.name_ar} 
                          fill 
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-[#D6D0C4]">
                          <Box size={24} strokeWidth={1.5} />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h3 className="font-bold text-sm text-[#2A3B32]">{product.name_ar}</h3>
                        <p className="text-xs text-[#8C8374] mt-0.5 font-medium" dir="ltr">{product.name_en || '-'}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {product.category && product.category.length > 0 && (
                          <span className="text-[9px] uppercase tracking-widest text-[#8C8374] font-bold border border-[#E8E2D9] px-2 py-0.5 rounded bg-[#FDFBF7]">
                            {product.category[0]}
                          </span>
                        )}
                        {product.volume && (
                          <span className="text-[9px] text-[#5C6B61] border border-[#E8E2D9] px-2 py-0.5 rounded bg-[#FDFBF7]" dir="ltr">
                            {product.volume}
                          </span>
                        )}
                        {product.best_selling && (
                          <span className="flex items-center gap-1 text-[9px] text-[#B8860B] border border-[#C5A059]/30 px-2 py-0.5 rounded bg-[#FDFBF7]">
                            <Star size={9} className="fill-[#C5A059] text-[#C5A059]" />
                            أكثر مبيعاً
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-1">
                    <Link 
                      href={`/admin/products/${product.id}/edit`}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-[#FDFBF7] border border-[#E8E2D9] text-[#5C6B61] rounded-lg text-xs font-bold active:bg-[#E8E2D9]"
                    >
                      <Edit size={14} strokeWidth={2} />
                      تعديل
                    </Link>
                    <DeleteButton id={product.id} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      
      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
