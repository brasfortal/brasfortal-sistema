'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  // Páginas públicas (Landing Page e Login) que não exibem a barra lateral do ERP
  const isPublicPage = pathname === '/' || pathname === '/login';

  if (isPublicPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Sidebar Lateral Retrátil com controle de permissões */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Conteúdo Principal (Ajusta margem esquerda de acordo com a expansão da sidebar) */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        {/* Header Superior com Foto do Usuário Logado e Perfil */}
        <Header 
          onToggleMobileMenu={() => setIsMobileOpen(prev => !prev)}
          isCollapsed={isCollapsed}
        />

        {/* Corpo da Página - 100% Full Width */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          {children}
        </main>

        {/* Rodapé */}
        <footer className="bg-white border-t border-slate-200 py-3.5 px-6 text-center text-xs text-slate-500 no-print">
          <p>© {new Date().getFullYear()} Brasfortal Metais e Conexões Ltda. Sistema Integrado de Gestão Comercial e Logística.</p>
        </footer>
      </div>
    </div>
  );
}
