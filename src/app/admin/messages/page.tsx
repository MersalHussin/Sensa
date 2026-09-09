'use client';

import { useEffect, useState } from 'react';
import { getContactMessages, deleteContactMessage } from '@/app/actions/contactActions';
import { MessageSquare, Package, Inbox, X, Mail, Phone, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string | number) => {
    if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;
    
    setIsDeleting(true);
    try {
      const res = await deleteContactMessage(id);
      if (res.success) {
        setMessages(messages.filter((msg) => msg.id !== id));
        setSelectedMessage(null);
      } else {
        alert(res.error || 'فشل في حذف الرسالة');
      }
    } catch (err: any) {
      alert(err.message || 'خطأ غير متوقع');
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await getContactMessages();
        if (res.success) {
          setMessages(res.data || []);
        } else {
          setError(res.error || 'فشل في جلب الرسائل');
        }
      } catch (err: any) {
        setError(err.message || 'خطأ غير متوقع');
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6 md:p-10 min-h-screen" dir="rtl">
      
      {/* Luxury Header */}
      <div className="relative overflow-hidden rounded-[1.5rem] bg-white border border-[#E8E2D9] shadow-[0_8px_30px_rgba(197,160,89,0.06)] p-8 md:p-10 z-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#C5A059]/10 to-transparent rounded-full blur-2xl opacity-60 -mr-10 -mt-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-main/5 to-transparent rounded-full blur-3xl opacity-70 -ml-10 -mb-10 pointer-events-none"></div>
        
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="bg-[#FDFBF7] border border-[#E8E2D9] p-4 rounded-2xl text-[#C5A059] shadow-sm">
              <MessageSquare size={32} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#C5A059] uppercase tracking-[0.2em] mb-1.5">Communications</p>
              <h1 className="text-3xl md:text-4xl font-bold text-[#2A3B32] tracking-tight">رسائل التواصل</h1>
            </div>
          </div>
          <div className="bg-[#FDFBF7] border border-[#E8E2D9] px-6 py-3.5 rounded-xl shadow-sm text-center">
            <span className="block text-2xl font-bold text-[#2A3B32]">{messages.length}</span>
            <span className="block text-[10px] uppercase tracking-widest text-[#8C8374] font-bold mt-1">إجمالي الرسائل</span>
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
        ) : messages.length === 0 ? (
          <div className="py-32 text-center bg-white flex flex-col items-center">
            <Inbox size={48} className="text-[#E8E2D9] mb-4" strokeWidth={1} />
            <p className="text-[#8C8374] font-bold text-lg">لا توجد رسائل حالياً</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-[#2A3B32] border-collapse">
              <thead>
                <tr className="bg-[#FDFBF7] border-b border-[#E8E2D9]">
                  <th className="py-5 px-6 text-[11px] font-bold text-[#8C8374] uppercase tracking-wider w-[180px]">الاسم / التاريخ</th>
                  <th className="py-5 px-6 text-[11px] font-bold text-[#8C8374] uppercase tracking-wider w-[120px]">النوع</th>
                  <th className="py-5 px-6 text-[11px] font-bold text-[#8C8374] uppercase tracking-wider w-[250px]">التواصل</th>
                  <th className="py-5 px-6 text-[11px] font-bold text-[#8C8374] uppercase tracking-wider">الرسالة</th>
                  <th className="py-5 px-6 text-[11px] font-bold text-[#8C8374] uppercase tracking-wider text-left w-[120px]">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D9]">
                {messages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-[#FDFBF7]/60 transition-colors group align-top">
                    <td className="py-5 px-6">
                      <div className="font-bold text-sm text-[#2A3B32] mb-1.5">{msg.name}</div>
                      <div className="text-[10px] uppercase tracking-widest text-[#8C8374] font-bold border border-[#E8E2D9] px-2 py-0.5 rounded bg-white w-fit" dir="ltr">
                        {new Date(msg.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </td>
                    
                    <td className="py-5 px-6">
                      {msg.contact_type === 'wholesale' ? (
                        <div className="flex flex-col gap-2">
                          <span className="flex items-center gap-1 text-[#C5A059] bg-[#FDFBF7] border border-[#C5A059]/30 px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-bold w-fit">
                            <Package size={12} />
                            طلب جملة
                          </span>
                          {msg.product_name && (
                            <div className="text-xs font-bold text-[#5C6B61] max-w-[150px] truncate" title={msg.product_name}>
                              {msg.product_name}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="flex items-center gap-1 text-[#8C8374] bg-[#FDFBF7] border border-[#E8E2D9] px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-bold w-fit">
                          <MessageSquare size={12} />
                          استفسار
                        </span>
                      )}
                    </td>
                    
                    <td className="py-5 px-6 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#8C8374] uppercase tracking-widest w-8">TEL</span>
                        <a href={`tel:${msg.phone}`} className="text-xs font-bold text-[#5C6B61] hover:text-main transition-colors" dir="ltr">{msg.phone}</a>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#8C8374] uppercase tracking-widest w-8">MAIL</span>
                        <a href={`mailto:${msg.email}`} className="text-xs font-bold text-[#5C6B61] hover:text-main transition-colors truncate max-w-[150px] block" title={msg.email}>{msg.email}</a>
                      </div>
                    </td>
                    
                    <td className="py-5 px-6">
                      <div className="text-xs text-[#5C6B61] leading-relaxed line-clamp-2 bg-[#FDFBF7] p-3 rounded-xl border border-[#E8E2D9]">
                        {msg.message}
                      </div>
                    </td>
                    <td className="py-5 px-6 text-left">
                      <button 
                        onClick={() => setSelectedMessage(msg)}
                        className="text-[11px] font-bold text-main uppercase tracking-widest border border-main hover:bg-main hover:text-white px-4 py-2 rounded-lg transition-colors opacity-80 group-hover:opacity-100 shadow-sm"
                      >
                        عرض التفاصيل
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#2A3B32]/40 backdrop-blur-sm" dir="rtl">
          <div className="bg-white rounded-2xl w-full max-w-2xl border border-[#E8E2D9] shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-[#E8E2D9] flex items-center justify-between bg-[#FDFBF7]">
              <h2 className="text-xl font-bold text-[#2A3B32] flex items-center gap-3">
                {selectedMessage.contact_type === 'wholesale' ? (
                  <span className="text-[#C5A059]"><Package size={24} /></span>
                ) : (
                  <span className="text-main"><MessageSquare size={24} /></span>
                )}
                تفاصيل الرسالة
              </h2>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleDelete(selectedMessage.id)}
                  disabled={isDeleting}
                  title="حذف الرسالة"
                  className="text-[#8C8374] hover:text-white hover:bg-[#B44C4C] transition-colors bg-white w-8 h-8 rounded-full border border-[#E8E2D9] flex items-center justify-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={16} strokeWidth={2} />
                </button>
                <button 
                  onClick={() => setSelectedMessage(null)}
                  className="text-[#8C8374] hover:text-[#B44C4C] transition-colors bg-white w-8 h-8 rounded-full border border-[#E8E2D9] flex items-center justify-center shadow-sm"
                >
                  <X size={18} strokeWidth={2} />
                </button>
              </div>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-[10px] font-bold text-[#8C8374] uppercase tracking-widest mb-1.5">المرسل</div>
                  <div className="text-sm font-bold text-[#2A3B32]">{selectedMessage.name}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#8C8374] uppercase tracking-widest mb-1.5">التاريخ</div>
                  <div className="text-sm font-bold text-[#2A3B32]" dir="ltr">
                    {new Date(selectedMessage.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {selectedMessage.contact_type === 'wholesale' && selectedMessage.product_name && (
                  <div className="col-span-2 bg-[#FDFBF7] border border-[#E8E2D9] p-4 rounded-xl">
                    <div className="text-[10px] font-bold text-[#8C8374] uppercase tracking-widest mb-1.5">المنتج المطلوب (جملة)</div>
                    <div className="text-sm font-bold text-[#2A3B32]">{selectedMessage.product_name}</div>
                  </div>
                )}
              </div>

              <div>
                <div className="text-[10px] font-bold text-[#8C8374] uppercase tracking-widest mb-3">محتوى الرسالة</div>
                <div className="text-sm text-[#5C6B61] leading-relaxed bg-[#FDFBF7] p-5 rounded-xl border border-[#E8E2D9] whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="border-t border-[#E8E2D9] pt-6">
                <div className="text-[10px] font-bold text-[#8C8374] uppercase tracking-widest mb-4">الرد على العميل</div>
                <div className="flex gap-4">
                  <a 
                    href={`https://wa.me/${selectedMessage.phone.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl font-bold hover:bg-[#20bd5a] transition-colors shadow-sm"
                  >
                    <Phone size={18} />
                    واتساب
                  </a>
                  <a 
                    href={`mailto:${selectedMessage.email}`} 
                    className="flex-1 flex items-center justify-center gap-2 bg-[#2A3B32] text-white py-3 rounded-xl font-bold hover:bg-main transition-colors shadow-sm"
                  >
                    <Mail size={18} />
                    بريد إلكتروني
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
