'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export default function MainWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  
  return (
    <main className={`flex-grow ${isAdmin ? '' : ''}`}>
      {children}
    </main>
  );
}
