'use client';

import { useEffect, useState } from 'react';
import { getAllReviews, updateReviewStatus } from '@/app/actions/reviewActions';
import { Star, MessageSquare, CheckCircle, XCircle, PauseCircle, Clock, X } from 'lucide-react';
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
        // Update local state
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4" dir="rtl">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-100 border-t-main"></div>
        <p className="text-gray-500 font-medium">جاري تحميل التقييمات...</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'accepted':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 w-fit"><CheckCircle size={14} /> مقبول</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 w-fit"><XCircle size={14} /> مرفوض</span>;
      case 'paused':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 w-fit"><PauseCircle size={14} /> متوقف</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 w-fit"><Clock size={14} /> قيد المراجعة</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8 min-h-[80vh]" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-main to-[#D0DAD6] rounded-r-3xl"></div>
        
        <div className="flex items-center gap-4">
          <div className="bg-main/10 p-4 rounded-2xl text-main hidden sm:flex items-center justify-center">
            <Star size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">تقييمات المنتجات</h1>
            <p className="text-gray-500 mt-1 font-medium">إدارة آراء وتقييمات العملاء</p>
          </div>
        </div>
        
        <div className="bg-gray-50 px-5 py-3 rounded-xl border border-gray-100 flex flex-col items-center">
          <span className="text-3xl font-black text-main">{reviews.length}</span>
          <span className="text-xs font-bold text-gray-500">إجمالي التقييمات</span>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-500 p-6 rounded-2xl border border-red-100 font-medium text-center">
          {error}
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 text-center flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <Star className="text-gray-300" size={48} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">لا توجد تقييمات بعد</h3>
          <p className="text-gray-500">لم يقم أي عميل بإضافة تقييم حتى الآن.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-sm">
                  <th className="py-4 px-6 font-bold w-[200px]">الاسم / المنتج</th>
                  <th className="py-4 px-6 font-bold w-[120px]">التقييم</th>
                  <th className="py-4 px-6 font-bold w-[120px]">الحالة</th>
                  <th className="py-4 px-6 font-bold">الرأي</th>
                  <th className="py-4 px-6 font-bold w-[200px]">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reviews.map((review) => (
                  <tr key={review.id} className={`transition-colors group align-top ${updatingId === review.id ? 'opacity-50 pointer-events-none' : 'hover:bg-gray-50/50'}`}>
                    <td className="py-5 px-6">
                      <div className="font-bold text-gray-900 mb-1">{review.name}</div>
                      <Link href={`/products/${review.product_id}`} target="_blank" className="text-xs font-bold text-main hover:underline bg-main/5 px-2 py-1 rounded w-fit inline-block mb-1">
                        المنتج: {review.product_id}
                      </Link>
                      <div className="text-xs font-medium text-gray-500 block">
                        {new Date(review.created_at).toLocaleDateString('ar-EG')}
                      </div>
                    </td>
                    
                    <td className="py-5 px-6">
                      <div className="flex gap-1 text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-gray-300" : ""} />
                        ))}
                      </div>
                    </td>
                    
                    <td className="py-5 px-6">
                      {getStatusBadge(review.status)}
                    </td>
                    
                    <td className="py-5 px-6">
                      <div className="text-sm text-gray-700 leading-relaxed font-medium bg-gray-50 p-4 rounded-2xl border border-gray-100 max-h-[100px] overflow-y-auto">
                        {review.comment}
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex flex-col gap-2">
                        {review.status !== 'accepted' && (
                          <button 
                            onClick={() => handleUpdateStatus(review.id, 'accepted')}
                            className="bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
                          >
                            <CheckCircle size={14} /> قبول
                          </button>
                        )}
                        {review.status !== 'rejected' && (
                          <button 
                            onClick={() => handleUpdateStatus(review.id, 'rejected')}
                            className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
                          >
                            <XCircle size={14} /> رفض
                          </button>
                        )}
                        {review.status !== 'paused' && review.status === 'accepted' && (
                          <button 
                            onClick={() => handleUpdateStatus(review.id, 'paused')}
                            className="bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
                          >
                            <PauseCircle size={14} /> إيقاف مؤقت
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
