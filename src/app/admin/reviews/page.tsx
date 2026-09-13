'use client';

import { useEffect, useState } from 'react';
import { getAllReviews, updateReviewStatus } from '@/app/actions/reviewActions';
import { Star, Check, X, Clock, Pause, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      const res = await getAllReviews();
      if (res.success) {
        setReviews(res.data || []);
      } else {
        setError(res.error || 'فشل في جلب التقييمات');
      }
    } catch (err: any) {
      setError(err.message || 'خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: 'accepted' | 'rejected' | 'paused' | 'pending') => {
    setUpdatingId(id);
    try {
      const res = await updateReviewStatus(id, newStatus);
      if (res.success) {
        setReviews(reviews.map(r => r.id === id ? { ...r, status: newStatus } : r));
      } else {
        alert(res.error || 'فشل في تحديث حالة التقييم');
      }
    } catch (err: any) {
      alert('خطأ غير متوقع');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'accepted':
        return <span className="text-[10px] uppercase tracking-widest font-bold text-[#2A3B32] border border-[#2A3B32]/30 px-2 py-1 rounded bg-[#FDFBF7] w-fit flex items-center gap-1"><Check size={12} /> مقبول</span>;
      case 'rejected':
        return <span className="text-[10px] uppercase tracking-widest font-bold text-[#B44C4C] border border-[#B44C4C]/30 px-2 py-1 rounded bg-white w-fit flex items-center gap-1"><X size={12} /> مرفوض</span>;
      case 'paused':
        return <span className="text-[10px] uppercase tracking-widest font-bold text-[#C5A059] border border-[#C5A059]/30 px-2 py-1 rounded bg-[#FDFBF7] w-fit flex items-center gap-1"><Pause size={12} /> متوقف</span>;
      default:
        return <span className="text-[10px] uppercase tracking-widest font-bold text-[#8C8374] border border-[#E8E2D9] px-2 py-1 rounded bg-white w-fit flex items-center gap-1"><Clock size={12} /> قيد المراجعة</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6 md:p-10 min-h-screen" dir="rtl">
      
      {/* Luxury Header */}
      <div className="relative overflow-hidden rounded-[1.5rem] bg-white border border-[#E8E2D9] shadow-[0_8px_30px_rgba(197,160,89,0.06)] p-8 md:p-10 z-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#C5A059]/10 to-transparent rounded-full blur-2xl opacity-60 -mr-10 -mt-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-main/5 to-transparent rounded-full blur-3xl opacity-70 -ml-10 -mb-10 pointer-events-none"></div>
        
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="bg-[#FDFBF7] border border-[#E8E2D9] p-4 rounded-2xl text-[#C5A059] shadow-sm">
              <Star size={32} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#C5A059] uppercase tracking-[0.2em] mb-1.5">Customer Feedback</p>
              <h1 className="text-3xl md:text-4xl font-bold text-[#2A3B32] tracking-tight">التقييمات</h1>
            </div>
          </div>
          <div className="bg-[#FDFBF7] border border-[#E8E2D9] px-6 py-3.5 rounded-xl shadow-sm text-center">
            <span className="block text-2xl font-bold text-[#2A3B32]">{reviews.length}</span>
            <span className="block text-[10px] uppercase tracking-widest text-[#8C8374] font-bold mt-1">إجمالي التقييمات</span>
          </div>
        </div>
      </div>

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
        ) : reviews.length === 0 ? (
          <div className="py-32 text-center bg-white flex flex-col items-center">
            <MessageSquare size={48} className="text-[#E8E2D9] mb-4" strokeWidth={1} />
            <p className="text-[#8C8374] font-bold text-lg">لا توجد تقييمات حالياً</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-right text-[#2A3B32] border-collapse">
                <thead>
                  <tr className="bg-[#FDFBF7] border-b border-[#E8E2D9]">
                    <th className="py-5 px-6 text-[11px] font-bold text-[#8C8374] uppercase tracking-wider w-[200px]">العميل / التاريخ</th>
                    <th className="py-5 px-6 text-[11px] font-bold text-[#8C8374] uppercase tracking-wider w-[120px]">التقييم</th>
                    <th className="py-5 px-6 text-[11px] font-bold text-[#8C8374] uppercase tracking-wider w-[120px]">الحالة</th>
                    <th className="py-5 px-6 text-[11px] font-bold text-[#8C8374] uppercase tracking-wider">الرأي</th>
                    <th className="py-5 px-6 text-[11px] font-bold text-[#8C8374] uppercase tracking-wider text-left w-[200px]">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D9]">
                  {reviews.map((review) => (
                    <tr key={review.id} className={`hover:bg-[#FDFBF7]/60 transition-colors group align-top ${updatingId === review.id ? 'opacity-50 pointer-events-none' : ''}`}>
                      <td className="py-5 px-6">
                        <div className="font-bold text-sm text-[#2A3B32] mb-1.5">{review.name}</div>
                        <Link href={`/products/${review.product_id}`} target="_blank" className="text-[10px] font-bold text-[#C5A059] hover:text-main uppercase tracking-widest border-b border-transparent hover:border-[#C5A059] transition-colors block mb-2 w-fit">
                          المنتج: {review.product_id.substring(0, 8)}...
                        </Link>
                        <div className="text-[10px] uppercase tracking-widest text-[#8C8374] font-bold border border-[#E8E2D9] px-2 py-0.5 rounded bg-white w-fit" dir="ltr">
                          {new Date(review.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                      </td>
                      
                      <td className="py-5 px-6">
                        <div className="flex gap-1 text-[#C5A059]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-[#E8E2D9]" : ""} />
                          ))}
                        </div>
                      </td>
                      
                      <td className="py-5 px-6">
                        {getStatusBadge(review.status)}
                      </td>
                      
                      <td className="py-5 px-6">
                        <div className="text-xs text-[#5C6B61] leading-relaxed bg-[#FDFBF7] p-3 rounded-xl border border-[#E8E2D9] max-h-[100px] overflow-y-auto">
                          {review.comment}
                        </div>
                      </td>
                      
                      <td className="py-5 px-6 text-left">
                        <div className="flex flex-col gap-2 opacity-80 group-hover:opacity-100 transition-opacity items-end">
                          {review.status !== 'accepted' && (
                            <button 
                              onClick={() => handleUpdateStatus(review.id, 'accepted')}
                              className="text-[10px] font-bold text-main uppercase tracking-widest border border-main hover:bg-main hover:text-white px-3 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-2 w-24"
                            >
                              <Check size={12} /> قبول
                            </button>
                          )}
                          {review.status !== 'rejected' && (
                            <button 
                              onClick={() => handleUpdateStatus(review.id, 'rejected')}
                              className="text-[10px] font-bold text-[#B44C4C] uppercase tracking-widest border border-[#B44C4C] hover:bg-[#B44C4C] hover:text-white px-3 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-2 w-24"
                            >
                              <X size={12} /> رفض
                            </button>
                          )}
                          {review.status !== 'paused' && review.status === 'accepted' && (
                            <button 
                              onClick={() => handleUpdateStatus(review.id, 'paused')}
                              className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest border border-[#C5A059] hover:bg-[#C5A059] hover:text-white px-3 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-2 w-24"
                            >
                              <Pause size={12} /> إيقاف
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden flex flex-col divide-y divide-[#E8E2D9]">
              {reviews.map((review) => (
                <div key={review.id} className={`p-4 bg-white flex flex-col gap-3 relative ${updatingId === review.id ? 'opacity-50 pointer-events-none' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-sm text-[#2A3B32] mb-1">{review.name}</div>
                      <div className="text-[9px] uppercase tracking-widest text-[#8C8374] font-bold border border-[#E8E2D9] px-2 py-0.5 rounded bg-[#FDFBF7] w-fit" dir="ltr">
                        {new Date(review.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <div>
                      {getStatusBadge(review.status)}
                    </div>
                  </div>

                  <Link href={`/products/${review.product_id}`} target="_blank" className="text-[10px] font-bold text-[#5C6B61] hover:text-main uppercase tracking-widest bg-[#FDFBF7] border border-[#E8E2D9] px-2 py-1 rounded inline-block w-fit">
                    المنتج: {review.product_id.substring(0, 8)}...
                  </Link>
                  
                  <div className="flex gap-1 text-[#C5A059]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-[#E8E2D9]" : ""} />
                    ))}
                  </div>

                  <div className="text-xs text-[#5C6B61] leading-relaxed bg-[#FDFBF7] p-3 rounded-xl border border-[#E8E2D9] max-h-[100px] overflow-y-auto">
                    {review.comment}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 justify-end mt-1">
                    {review.status !== 'accepted' && (
                      <button 
                        onClick={() => handleUpdateStatus(review.id, 'accepted')}
                        className="text-[10px] font-bold text-main uppercase tracking-widest border border-main px-3 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 flex-1 shadow-sm active:bg-main active:text-white"
                      >
                        <Check size={12} /> قبول
                      </button>
                    )}
                    {review.status !== 'rejected' && (
                      <button 
                        onClick={() => handleUpdateStatus(review.id, 'rejected')}
                        className="text-[10px] font-bold text-[#B44C4C] uppercase tracking-widest border border-[#B44C4C] px-3 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 flex-1 shadow-sm active:bg-[#B44C4C] active:text-white"
                      >
                        <X size={12} /> رفض
                      </button>
                    )}
                    {review.status !== 'paused' && review.status === 'accepted' && (
                      <button 
                        onClick={() => handleUpdateStatus(review.id, 'paused')}
                        className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest border border-[#C5A059] px-3 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 flex-1 shadow-sm active:bg-[#C5A059] active:text-white"
                      >
                        <Pause size={12} /> إيقاف
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
