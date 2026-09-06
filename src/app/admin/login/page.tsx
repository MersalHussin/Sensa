'use client';

import { useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn } from 'lucide-react';
import Image from 'next/image';

export default function SensaLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (email.toLowerCase() !== 'sensa@admin.com') {
      setError('هذا البريد غير مصرح له بالدخول كمسؤول');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4" dir="rtl">
      
      <div className="mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <Image src="/images/Sensa.png" alt="Sensa" width={140} height={50} className="object-contain h-10 w-auto" />
      </div>

      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-md w-full border border-gray-100 relative overflow-hidden">
        
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-main to-[#D0DAD6]"></div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">تسجيل الدخول للإدارة</h1>
          <p className="text-gray-500 text-sm">مرحباً بك مجدداً، يرجى إدخال بياناتك</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium text-center border border-red-100">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">البريد الإلكتروني</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-4 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-main focus:bg-white transition-all placeholder:text-gray-400 text-left"
                placeholder="sensa@admin.com"
                dir="ltr"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">كلمة المرور</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-main focus:bg-white transition-all placeholder:text-gray-400 text-left"
                placeholder="••••••••"
                dir="ltr"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-main text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:bg-main/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed group mt-4"
          >
            {loading ? (
              <>
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                <span>جاري التحقق...</span>
              </>
            ) : (
              <>
                <span>تسجيل الدخول</span>
                <LogIn size={18} className="group-hover:-translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
