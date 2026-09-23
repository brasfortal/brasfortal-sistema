'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { 
  FileText, 
  Truck, 
  Smartphone, 
  PlusCircle, 
  Building2, 
  Package, 
  Users, 
  Factory,
  ChevronLeft, 
  ChevronRight,
  X,
  RotateCcw,
  Database,
  LucideIcon,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { StorageService } from '@/lib/storage';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { PerfilUsuario } from '@/lib/types';

interface MenuItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  highlight?: boolean;
  tag?: string;
  tabKey?: string;
  requiredRole?: PerfilUsuario[];
}

interface MenuSection {
  title: string;
  requiredRole?: PerfilUsuario[];
  items: MenuItem[];
}

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean | ((prev: boolean) => boolean)) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (value: boolean) => void;
}

const menuSections: MenuSection[] = [
  {
    title: 'Comercial',
    requiredRole: ['MASTER', 'COMERCIAL'],
    items: [
      { href: '/dashboard', label: 'Painel & Pedidos', icon: FileText, exact: true },
      { href: '/pedidos/novo', label: 'Novo Pedido (Espelho)', icon: PlusCircle, highlight: true },
    ]
  },
  {
    title: 'Logística',
    requiredRole: ['MASTER', 'LOGISTICA', 'MOTORISTA'],
    items: [
      { href: '/logistica', label: 'Logística & Expedição', icon: Truck, requiredRole: ['MASTER', 'LOGISTICA'] },
      { href: '/motorista', label: 'Terminal do Motorista', icon: Smartphone, tag: 'Mobile', requiredRole: ['MASTER', 'LOGISTICA', 'MOTORISTA'] },
    ]
  },
  {
    title: 'Cadastros',
    requiredRole: ['MASTER', 'COMERCIAL', 'LOGISTICA'],
    items: [
      { href: '/cadastros?tab=produtos', label: 'Produtos / Metais', icon: Package, tabKey: 'produtos' },
      { href: '/cadastros?tab=clientes', label: 'Clientes & Compradores', icon: Building2, tabKey: 'clientes' },
      { href: '/cadastros?tab=fornecedores', label: 'Fornecedores / Usinas', icon: Factory, tabKey: 'fornecedores' },
      { href: '/cadastros?tab=motoristas', label: 'Motoristas & Frota', icon: Users, tabKey: 'motoristas' },
    ]
  },
  {
    title: 'Administração',
    requiredRole: ['MASTER'],
    items: [
      { href: '/usuarios', label: 'Usuários & Permissões', icon: ShieldCheck, tag: 'Master' },
    ]
  }
];

function SidebarNavList({ 
  isCollapsed, 
  setIsMobileOpen 
}: { 
  isCollapsed: boolean; 
  setIsMobileOpen: (v: boolean) => void; 
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams ? searchParams.get('tab') : null;
  const { user } = useAuth();
  const userRole = user?.perfil || 'MASTER';

  const isItemActive = (item: MenuItem) => {
    if (item.tabKey) {
      return pathname === '/cadastros' && (currentTab === item.tabKey || (!currentTab && item.tabKey === 'produtos'));
    }
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
  };

  // Filtrar seções e itens conforme perfil do usuário
  const visibleSections = menuSections
    .filter(section => !section.requiredRole || section.requiredRole.includes(userRole))
    .map(section => ({
      ...section,
      items: section.items.filter(item => !item.requiredRole || item.requiredRole.includes(userRole))
    }))
    .filter(section => section.items.length > 0);

  return (
    <div className="flex-1 py-4 px-3 space-y-4 overflow-y-auto">
      {visibleSections.map((section, sIdx) => (
        <div key={sIdx} className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 pb-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
              {section.title}
            </div>
          )}

          {section.items.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                title={isCollapsed ? item.label : undefined}
                className={`group flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all relative ${
                  active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                    : item.highlight
                    ? 'text-blue-400 hover:bg-blue-950/50 hover:text-blue-300 border border-blue-900/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                  active ? 'text-white' : item.highlight ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'
                }`} />

                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between overflow-hidden">
                    <span className="truncate text-xs">{item.label}</span>
                    {item.tag && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                        item.tag === 'Master' 
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' 
                          : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {item.tag}
                      </span>
                    )}
                  </div>
                )}

                {/* Tooltip quando recolhido */}
                {isCollapsed && (
                  <div className="hidden group-hover:block fixed left-20 ml-2 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-xl border border-slate-700 whitespace-nowrap z-50 pointer-events-none">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default function Sidebar({ 
  isCollapsed, 
  setIsCollapsed, 
  isMobileOpen, 
  setIsMobileOpen 
}: SidebarProps) {
  const handleReset = () => {
    if (confirm('Deseja restaurar os dados de demonstração da Brasfortal?')) {
      StorageService.resetToDefault();
    }
  };

  return (
    <>
      {/* Overlay escuro no mobile quando menu aberto */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Barra Lateral (Sidebar) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-slate-950 text-white border-r border-slate-800 transition-all duration-300 ease-in-out flex flex-col no-print
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Topo / Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-lg text-white shadow-md shadow-blue-500/20 shrink-0 group-hover:scale-105 transition-transform">
              BF
            </div>
            
            {!isCollapsed && (
              <div className="transition-opacity duration-200 whitespace-nowrap">
                <div className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                  BRASFORTAL
                </div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  Metais & Conexões
                </p>
              </div>
            )}
          </Link>

          {/* Botão fechar no mobile */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navegação Principal embrulhada em Suspense para SSR seguro */}
        <Suspense fallback={<div className="flex-1 p-4 text-xs text-slate-500">Carregando menu...</div>}>
          <SidebarNavList 
            isCollapsed={isCollapsed} 
            setIsMobileOpen={setIsMobileOpen} 
          />
        </Suspense>

        {/* Rodapé da Sidebar */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          
          {/* Status do Banco */}
          {!isCollapsed ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
              <Database className={`w-4 h-4 shrink-0 ${isSupabaseConfigured ? 'text-emerald-400' : 'text-amber-400'}`} />
              <div className="flex-1 truncate">
                <p className="font-bold text-slate-200 text-[11px] truncate">
                  {isSupabaseConfigured ? 'Supabase Nuvem' : 'Armazenamento Local'}
                </p>
                <p className="text-[9px] text-slate-500">Sincronizado</p>
              </div>
            </div>
          ) : (
            <div 
              className="flex justify-center p-2 rounded-xl bg-slate-900 text-slate-400"
              title={isSupabaseConfigured ? 'Supabase Nuvem' : 'Armazenamento Local'}
            >
              <Database className={`w-4 h-4 ${isSupabaseConfigured ? 'text-emerald-400' : 'text-amber-400'}`} />
            </div>
          )}

          {/* Botão de Reset Demo */}
          <button
            onClick={handleReset}
            title="Restaurar dados padrão"
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <RotateCcw className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Restaurar Demo</span>}
          </button>

          {/* Botão Recolher/Expandir (Desktop) */}
          <button
            onClick={() => setIsCollapsed(prev => !prev)}
            className="hidden md:flex w-full items-center justify-center p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-800"
            title={isCollapsed ? 'Expandir Menu' : 'Recolher Menu'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-blue-400" />
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold">
                <ChevronLeft className="w-4 h-4 text-blue-400" />
                <span>Recolher Barra</span>
              </div>
            )}
          </button>

        </div>
      </aside>
    </>
  );
}
