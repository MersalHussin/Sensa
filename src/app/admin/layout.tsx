'use client';

import { ReactNode } from 'react';
import { SensaAuthProvider, useSensaAuth } from './context/SensaAuthContext';
import { supabase } from '@/app/lib/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut, Package, LayoutDashboard, Settings, UserCircle } from 'lucide-react';
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
        <aside className="w-full md:w-[280px] bg-white border-l border-gray-100 shadow-[0_0_40px_rgba(0,0,0,0.03)] flex flex-col z-50 shrink-0">
          <div className="p-6 md:p-8 flex items-center justify-center border-b border-gray-100/80">
          <Link href={'/'}>
            <Image src="/images/Sensa.png" alt="Sensa" width={140} height={50} className="object-contain h-10 w-auto" priority />
          </Link>
          </div>
          
          <div className="px-6 py-6 flex-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">القائمة الرئيسية</p>
            <nav className="space-y-2">
              <Link 
                href="/admin" 
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${
                  pathname === '/admin' || pathname.startsWith('/admin/products')
                    ? 'bg-main text-white shadow-md shadow-main/20' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-main'
                }`}
              >
                <Package size={20} className={pathname === '/admin' || pathname.startsWith('/admin/products') ? 'text-white' : 'text-gray-400'} />
                إدارة المنتجات
              </Link>
              
              <Link 
                href="/admin/messages" 
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${
                  pathname.startsWith('/admin/messages')
                    ? 'bg-main text-white shadow-md shadow-main/20' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-main'
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={pathname.startsWith('/admin/messages') ? 'text-white' : 'text-gray-400'}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>
                رسائل التواصل
              </Link>
              
              <Link 
                href="/admin/reviews" 
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${
                  pathname.startsWith('/admin/reviews')
                    ? 'bg-main text-white shadow-md shadow-main/20' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-main'
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={pathname.startsWith('/admin/reviews') ? 'text-white' : 'text-gray-400'}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                تقييمات المنتجات
              </Link>
            </nav>
          </div>

          <div className="p-6 border-t border-gray-100/80 bg-gray-50/50 mt-auto">
            <div className="flex items-center gap-3 mb-5 px-2">
              <div className="w-12 h-12 rounded-full bg-main/10 flex items-center justify-center text-main font-bold border border-main/20 shadow-inner">
                <UserCircle size={28} />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-extrabold text-gray-900">المدير العام</p>
                <p className="text-xs text-gray-500 truncate" title={user.email}>{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => supabase.auth.signOut()}
              className="flex items-center justify-center gap-2 w-full px-4 py-3.5 text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 rounded-xl font-bold transition-colors border border-red-100/50 group"
            >
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
              تسجيل الخروج
            </button>
          </div>
        </aside>
      )}
      
      <main className="flex-1 h-screen overflow-y-auto bg-gray-50/50 relative">
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
