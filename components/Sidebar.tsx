'use client';

import React, { Suspense, useState } from 'react';
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
  Search,
  LayoutDashboard,
  Bell,
  CheckSquare,
  StickyNote,
  Mail,
  Calendar,
  BarChart3,
  UserCheck,
  Share2,
  LifeBuoy,
  ChevronDown,
  Scale
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
    title: 'Main Menu',
    requiredRole: ['MASTER', 'COMERCIAL'],
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
      { href: '/pedidos', label: 'Pedidos', icon: FileText },
      { href: '/estoque', label: 'Estoque & Retalhos', icon: Scale, tag: 'KG/M' },
      { href: '/logistica', label: 'Logística & Frota', icon: Truck, requiredRole: ['MASTER', 'LOGISTICA'] },
    ]
  },
  {
    title: 'Record',
    requiredRole: ['MASTER', 'COMERCIAL', 'LOGISTICA'],
    items: [
      { href: '/cadastros?tab=clientes', label: 'Clientes & Compradores', icon: Building2, tabKey: 'clientes' },
      { href: '/cadastros?tab=produtos', label: 'Produtos / Metais', icon: Package, tabKey: 'produtos' },
      { href: '/cadastros?tab=fornecedores', label: 'Fornecedores / Usinas', icon: Factory, tabKey: 'fornecedores' },
      { href: '/motorista', label: 'Terminal Motorista', icon: Smartphone, tag: 'Mobile', requiredRole: ['MASTER', 'LOGISTICA', 'MOTORISTA'] },
    ]
  },
  {
    title: 'Administração',
    requiredRole: ['MASTER'],
    items: [
      { href: '/usuarios', label: 'Equipe & Permissões', icon: ShieldCheck, tag: 'Master' },
    ]
  }
];

function SidebarNavList({ 
  isCollapsed, 
  setIsMobileOpen,
  searchFilter
}: { 
  isCollapsed: boolean; 
  setIsMobileOpen: (v: boolean) => void; 
  searchFilter: string;
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

  const visibleSections = menuSections
    .filter(section => !section.requiredRole || section.requiredRole.includes(userRole))
    .map(section => ({
      ...section,
      items: section.items
        .filter(item => !item.requiredRole || item.requiredRole.includes(userRole))
        .filter(item => !searchFilter || item.label.toLowerCase().includes(searchFilter.toLowerCase()))
    }))
    .filter(section => section.items.length > 0);

  return (
    <div className="flex-1 py-2 px-3 space-y-5 overflow-y-auto">
      {visibleSections.map((section, sIdx) => (
        <div key={sIdx} className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 pb-1 text-[11px] font-medium text-slate-400">
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
                className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[13px] font-medium transition-all relative ${
                  active
                    ? 'bg-[#e6f7f2] text-[#0d9488] font-semibold'
                    : item.highlight
                    ? 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-dashed border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                } ${isCollapsed ? 'justify-center px-2' : ''}`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                  active ? 'text-[#0d9488]' : 'text-slate-400 group-hover:text-slate-600'
                }`} />

                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between overflow-hidden">
                    <span className="truncate">{item.label}</span>
                    {item.tag && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        item.tag === 'Master' 
                          ? 'bg-purple-50 text-purple-600 border border-purple-200' 
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      }`}>
                        {item.tag}
                      </span>
                    )}
                  </div>
                )}

                {/* Tooltip quando recolhido */}
                {isCollapsed && (
                  <div className="hidden group-hover:block fixed left-20 ml-2 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl border border-slate-800 whitespace-nowrap z-50 pointer-events-none">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      ))}

      {/* Seção Extra estilo CRM Moderno: Suporte & Atalhos */}
      {!isCollapsed && (
        <div className="pt-2 border-t border-slate-100 space-y-1">
          <Link
            href="/usuarios"
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2 rounded-2xl text-[13px] text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
          >
            <UserCheck className="w-4 h-4 text-slate-400" />
            <span>Invite Team</span>
          </Link>
          <button
            onClick={() => {
              if (confirm('Deseja restaurar os dados de demonstração da Brasfortal?')) {
                StorageService.resetToDefault();
              }
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl text-[13px] text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors text-left"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ 
  isCollapsed, 
  setIsCollapsed, 
  isMobileOpen, 
  setIsMobileOpen 
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  return (
    <>
      {/* Overlay escuro no mobile quando menu aberto */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* Barra Lateral (Sidebar) com Estilo Minimalista e Limpo */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-white text-slate-700 border-r border-slate-200/80 transition-all duration-300 ease-in-out flex flex-col no-print
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Topo / Logo Clean */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
          <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden group">
            {/* Ícone Redondo com gradiente verde/menta similar ao da imagem */}
            <div className="w-9 h-9 rounded-full bg-[#10b981] flex items-center justify-center text-white shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10" />
                <path d="m16 8 4 4-4 4" />
                <path d="M8 12h12" />
              </svg>
            </div>
            
            {!isCollapsed && (
              <div className="transition-opacity duration-200 whitespace-nowrap">
                <div className="font-extrabold text-sm tracking-tight text-slate-900 flex items-center gap-1.5">
                  BRASFORTAL
                </div>
                <p className="text-[10px] text-slate-400 font-medium">
                  Metais & Gestão
                </p>
              </div>
            )}
          </Link>

          {/* Botão fechar no mobile */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Busca rápida no Menu (como na imagem de referência) */}
        {!isCollapsed && (
          <div className="px-3 pt-3 pb-1">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-12 py-1.5 text-xs bg-slate-50 border border-slate-200/80 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:bg-white transition-all text-slate-800"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[9px] font-semibold text-slate-400 bg-white border border-slate-200 px-1 py-0.5 rounded">
                <span>⌘</span>
                <span>K</span>
              </div>
            </div>
          </div>
        )}

        {/* Navegação Principal embrulhada em Suspense para SSR seguro */}
        <Suspense fallback={<div className="flex-1 p-4 text-xs text-slate-400">Carregando menu...</div>}>
          <SidebarNavList 
            isCollapsed={isCollapsed} 
            setIsMobileOpen={setIsMobileOpen} 
            searchFilter={searchTerm}
          />
        </Suspense>

        {/* Perfil no Rodapé da Sidebar (estilo card na imagem) */}
        <div className="p-3 border-t border-slate-100">
          {!isCollapsed ? (
            <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 transition-colors group cursor-pointer">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <img
                  src={user?.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={user?.nome || 'Usuário'}
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                />
                <div className="truncate">
                  <p className="font-semibold text-xs text-slate-900 truncate">
                    {user?.nome || 'Márcio Santos'}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {user?.email || 'marciorsantos05@gmail.com'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform group-hover:translate-x-0.5" />
            </div>
          ) : (
            <div className="flex justify-center py-1">
              <img
                src={user?.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user?.nome || 'Usuário'}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
              />
            </div>
          )}

          {/* Botão Recolher/Expandir (Desktop) */}
          <button
            onClick={() => setIsCollapsed(prev => !prev)}
            className="hidden md:flex mt-2 w-full items-center justify-center py-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
            title={isCollapsed ? 'Expandir Menu' : 'Recolher Menu'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-slate-500" />
            ) : (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Recolher</span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
