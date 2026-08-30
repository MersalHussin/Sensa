'use client';

import { useEffect, useState } from 'react';
import { getContactMessages } from '@/app/actions/contactActions';
import { MessageSquare, Package, Inbox, X, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4" dir="rtl">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-100 border-t-main"></div>
        <p className="text-gray-500 font-medium">جاري تحميل الرسائل...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8 min-h-[80vh]" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-main to-[#D0DAD6] rounded-r-3xl"></div>
        
        <div className="flex items-center gap-4">
          <div className="bg-main/10 p-4 rounded-2xl text-main hidden sm:flex items-center justify-center">
            <MessageSquare size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">رسائل التواصل</h1>
            <p className="text-gray-500 mt-1 font-medium">إدارة ومراجعة رسائل العملاء وطلبات الجملة</p>
          </div>
        </div>
        
        <div className="bg-gray-50 px-5 py-3 rounded-xl border border-gray-100 flex flex-col items-center">
          <span className="text-3xl font-black text-main">{messages.length}</span>
          <span className="text-xs font-bold text-gray-500">إجمالي الرسائل</span>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-500 p-6 rounded-2xl border border-red-100 font-medium text-center">
          {error}
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 text-center flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <Inbox className="text-gray-300" size={48} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">لا توجد رسائل بعد</h3>
          <p className="text-gray-500">لم يقم أي عميل بالتواصل معك حتى الآن.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-sm">
                  <th className="py-4 px-6 font-bold w-[180px]">الاسم / التاريخ</th>
                  <th className="py-4 px-6 font-bold w-[120px]">النوع</th>
                  <th className="py-4 px-6 font-bold w-[250px]">التواصل</th>
                  <th className="py-4 px-6 font-bold">الرسالة</th>
                  <th className="py-4 px-6 font-bold w-[100px]">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {messages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-gray-50/50 transition-colors group align-top">
                    <td className="py-5 px-6">
                      <div className="font-bold text-gray-900 mb-1">{msg.name}</div>
                      <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded w-fit">
                        {new Date(msg.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </td>
                    
                    <td className="py-5 px-6">
                      {msg.contact_type === 'wholesale' ? (
                        <div className="flex flex-col gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-main/10 text-main w-fit">
                            <Package size={14} />
                            طلب جملة
                          </span>
                          {msg.product_name && (
                            <div className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1.5 rounded-lg border border-gray-200 line-clamp-2" title={msg.product_name}>
                              {msg.product_name}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 w-fit">
                          <MessageSquare size={14} />
                          استفسار
                        </span>
                      )}
                    </td>
                    
                    <td className="py-5 px-6 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 w-12">الهاتف:</span>
                        <a href={`tel:${msg.phone}`} className="text-sm font-bold text-gray-700 hover:text-main transition-colors" dir="ltr">{msg.phone}</a>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 w-12">الإيميل:</span>
                        <a href={`mailto:${msg.email}`} className="text-sm font-bold text-gray-700 hover:text-main transition-colors truncate max-w-[150px] block" title={msg.email}>{msg.email}</a>
                      </div>
                    </td>
                    
                    <td className="py-5 px-6">
                      <div className="text-sm text-gray-700 leading-relaxed font-medium bg-gray-50 p-4 rounded-2xl border border-gray-100 line-clamp-2">
                        {msg.message}
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <button 
                        onClick={() => setSelectedMessage(msg)}
                        className="bg-white border border-gray-200 text-gray-700 hover:text-main hover:border-main/30 px-4 py-2 rounded-xl text-sm font-bold transition-all w-full shadow-sm hover:shadow-md"
                      >
                        عرض
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" dir="rtl">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                {selectedMessage.contact_type === 'wholesale' ? (
                  <span className="bg-main/10 text-main p-2 rounded-xl"><Package size={24} /></span>
                ) : (
                  <span className="bg-blue-100 text-blue-700 p-2 rounded-xl"><MessageSquare size={24} /></span>
                )}
                تفاصيل الرسالة
              </h2>
              <button 
                onClick={() => setSelectedMessage(null)}
                className="w-10 h-10 bg-white border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 rounded-full flex items-center justify-center transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm font-bold text-gray-400 mb-1">اسم المرسل</div>
                  <div className="text-lg font-bold text-gray-900">{selectedMessage.name}</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-400 mb-1">تاريخ الإرسال</div>
                  <div className="text-lg font-bold text-gray-900">
                    {new Date(selectedMessage.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {selectedMessage.contact_type === 'wholesale' && selectedMessage.product_name && (
                  <div className="col-span-2 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="text-sm font-bold text-gray-400 mb-1">المنتج المطلوب (جملة)</div>
                    <div className="text-lg font-bold text-gray-900">{selectedMessage.product_name}</div>
                  </div>
                )}
              </div>

              <div>
                <div className="text-sm font-bold text-gray-400 mb-2">محتوى الرسالة</div>
                <div className="text-gray-700 leading-relaxed font-medium bg-gray-50 p-5 rounded-2xl border border-gray-100 whitespace-pre-wrap min-h-[120px]">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <div className="text-sm font-bold text-gray-900 mb-4">الرد على العميل:</div>
                <div className="flex gap-4">
                  <a 
                    href={`https://wa.me/${selectedMessage.phone.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 rounded-xl font-bold hover:bg-[#20bd5a] transition-colors shadow-lg shadow-[#25D366]/30"
                  >
                    <Phone size={20} />
                    واتساب
                  </a>
                  <a 
                    href={`mailto:${selectedMessage.email}`} 
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-3.5 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30"
                  >
                    <Mail size={20} />
                    البريد الإلكتروني
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
