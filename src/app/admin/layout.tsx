'use client';

import { ReactNode } from 'react';
import { SensaAuthProvider, useSensaAuth } from './context/SensaAuthContext';
import { supabase } from '@/app/lib/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut, PackageSearch, MessageSquare, Star, UserCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';


function AdminShell({ children }: { children: ReactNode }) {
  const { user, loading } = useSensaAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-main"></div>
      </div>
    );
  }

  if (!user && pathname !== '/admin/login') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row" dir="rtl">
      {user && pathname !== '/admin/login' && (
        <aside className="w-full md:w-[280px] bg-[#FAF8F5] text-[#2A3B32] flex flex-col z-50 shrink-0 border-l border-[#E8E2D9] relative shadow-[4px_0_24px_rgba(197,160,89,0.05)]">
          {/* Subtle gold top border */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C5A059] to-[#E3C98D]"></div>
          
          <div className="p-8 flex items-center justify-center border-b border-[#E8E2D9] bg-white/50 backdrop-blur-sm">
            <Link href={'/'} className="transition-opacity hover:opacity-80">
              <Image src="/images/Sensa.png" alt="Sensa" width={130} height={45} className="object-contain h-9 w-auto" priority />
            </Link>
          </div>
          
          <div className="px-5 py-8 flex-1">
            <p className="text-[11px] font-bold text-[#8C8374] uppercase tracking-[0.25em] mb-6 px-4">لوحة التحكم</p>
            <nav className="space-y-1.5">
              <Link 
                href="/admin" 
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                  pathname === '/admin' || pathname.startsWith('/admin/products')
                    ? 'bg-main text-white shadow-[0_4px_15px_rgba(14,77,56,0.15)] border border-main' 
                    : 'text-[#5C6B61] hover:text-main hover:bg-[#F0EBE1]'
                }`}
              >
                <PackageSearch size={20} strokeWidth={1.5} className={pathname === '/admin' || pathname.startsWith('/admin/products') ? 'text-[#E3C98D]' : 'text-[#8C8374]'} />
                <span className="font-bold text-sm">المنتجات</span>
              </Link>
              
              <Link 
                href="/admin/messages" 
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                  pathname.startsWith('/admin/messages')
                    ? 'bg-main text-white shadow-[0_4px_15px_rgba(14,77,56,0.15)] border border-main' 
                    : 'text-[#5C6B61] hover:text-main hover:bg-[#F0EBE1]'
                }`}
              >
                <MessageSquare size={20} strokeWidth={1.5} className={pathname.startsWith('/admin/messages') ? 'text-[#E3C98D]' : 'text-[#8C8374]'} />
                <span className="font-bold text-sm">الرسائل</span>
              </Link>
              
              <Link 
                href="/admin/reviews" 
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                  pathname.startsWith('/admin/reviews')
                    ? 'bg-main text-white shadow-[0_4px_15px_rgba(14,77,56,0.15)] border border-main' 
                    : 'text-[#5C6B61] hover:text-main hover:bg-[#F0EBE1]'
                }`}
              >
                <Star size={20} strokeWidth={1.5} className={pathname.startsWith('/admin/reviews') ? 'text-[#E3C98D]' : 'text-[#8C8374]'} />
                <span className="font-bold text-sm">التقييمات</span>
              </Link>
            </nav>
          </div>

          <div className="p-6 border-t border-[#E8E2D9] bg-white/50 backdrop-blur-sm mt-auto">
            <div className="flex items-center gap-4 mb-6 px-2">
              <div className="w-11 h-11 rounded-full bg-[#FDFBF7] flex items-center justify-center text-main border border-[#E8E2D9] shadow-sm">
                <UserCircle size={22} strokeWidth={1.5} />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-[#2A3B32]">الإدارة العليا</p>
                <p className="text-xs text-[#8C8374] font-medium truncate mt-0.5">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => supabase.auth.signOut()}
              className="flex items-center justify-center gap-2.5 w-full px-4 py-3 text-[#B44C4C] bg-white hover:bg-[#FDFBF7] rounded-xl font-bold transition-all border border-[#E8E2D9] shadow-sm hover:border-[#B44C4C]/30 hover:shadow"
            >
              <LogOut size={18} strokeWidth={1.5} />
              <span className="text-sm">تسجيل الخروج</span>
            </button>
          </div>
        </aside>
      )}
      
      <main className="flex-1 h-screen overflow-y-auto bg-[#FDFBF7] relative">
        {children}
      </main>
    </div>
  );
}

export default function SensaAdminLayout({ children }: { children: ReactNode }) {
  return (
    <SensaAuthProvider>
      <AdminShell>{children}</AdminShell>
    </SensaAuthProvider>
  );
}
