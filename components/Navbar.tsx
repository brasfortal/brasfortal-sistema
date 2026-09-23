'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FileText, 
  Truck, 
  Smartphone, 
  PlusCircle, 
  Package, 
  Database,
  Building2,
  RotateCcw
} from 'lucide-react';
import { StorageService } from '@/lib/storage';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Painel & Pedidos', icon: FileText },
    { href: '/pedidos/novo', label: 'Novo Pedido (Espelho)', icon: PlusCircle },
    { href: '/logistica', label: 'Logística & Expedição', icon: Truck },
    { href: '/motorista', label: 'Terminal do Motorista', icon: Smartphone },
    { href: '/cadastros', label: 'Cadastros', icon: Building2 },
  ];

  const handleReset = () => {
    if (confirm('Deseja restaurar os dados de demonstração da Brasfortal?')) {
      StorageService.resetToDefault();
    }
  };

  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50 no-print border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brasfortal */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-black text-xl tracking-wider text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              BF
            </div>
            <div>
              <div className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                BRASFORTAL
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  ERP
                </span>
              </div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
                Metais e Conexões Ltda
              </p>
            </div>
          </Link>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Status & Actions */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300">
              <Database className={`w-3.5 h-3.5 ${isSupabaseConfigured ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span>{isSupabaseConfigured ? 'Supabase Conectado' : 'Modo Local / Demo'}</span>
            </div>

            <button
              onClick={handleReset}
              title="Restaurar dados de exemplo da Brasfortal"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restaurar Demo</span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden flex overflow-x-auto px-2 py-2 bg-slate-950 border-t border-slate-800 space-x-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
                isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
