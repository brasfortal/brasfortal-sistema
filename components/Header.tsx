'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  Bell, 
  Search, 
  User, 
  ChevronDown, 
  ShieldCheck, 
  LogOut, 
  Settings, 
  Camera, 
  Globe,
  Users,
  Plus,
  MoreVertical,
  Filter,
  Download
} from 'lucide-react';
import { useAuth } from '@/lib/auth';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  isCollapsed: boolean;
}

export default function Header({ onToggleMobileMenu, isCollapsed }: HeaderProps) {
  const pathname = usePathname();
  const { user, logout, updateCurrentUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname === '/pedidos') return 'Pedidos & Vendas';
    if (pathname === '/pedidos/novo') return 'Novo Pedido';
    if (pathname.startsWith('/pedidos/')) return 'Espelho de Pedido';
    if (pathname.startsWith('/cadastros')) return 'Cadastros & Registros';
    if (pathname === '/logistica') return 'Logística & Expedição';
    if (pathname === '/motorista') return 'Terminal do Motorista';
    if (pathname === '/usuarios') return 'Gestão de Usuários';
    return 'Brasfortal Metais';
  };

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTrocarFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCurrentUser({ foto_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const getPerfilBadgeText = (perfil?: string) => {
    switch (perfil) {
      case 'MASTER':
        return 'Master / Diretoria';
      case 'COMERCIAL':
        return 'Comercial';
      case 'LOGISTICA':
        return 'Logística';
      case 'MOTORISTA':
        return 'Motorista';
      default:
        return 'Colaborador';
    }
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 px-6 sm:px-8 flex items-center justify-between no-print">
      
      {/* Lado Esquerdo: Mobile Trigger & Título da Área */}
      <div className="flex items-center gap-4">
        {/* Botão Hambúrguer Mobile */}
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
          aria-label="Abrir Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          {getPageTitle()}
        </h1>
      </div>

      {/* Lado Direito: Avatar stack, adicionar membros, opções e perfil */}
      <div className="flex items-center gap-3" ref={dropdownRef}>
        
        {/* Grupo de Avatares estilo CRM colaborativo da imagem */}
        <div className="hidden sm:flex items-center -space-x-2">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="Membro"
            className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-2xs"
          />
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
            alt="Membro"
            className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-2xs"
          />
          <Link
            href="/usuarios"
            className="w-8 h-8 rounded-full border border-dashed border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
            title="Adicionar colaborador"
          >
            <Plus className="w-4 h-4" />
          </Link>
        </div>

        {/* Notificações minimalistas */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setDropdownOpen(false);
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors relative"
            title="Notificações"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#10b981] rounded-full"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 space-y-3 z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="font-bold text-xs text-slate-800">Notificações</h4>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">2 novas</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl space-y-1">
                  <p className="font-semibold text-slate-800">🚚 Romaneio #201 em rota</p>
                  <p className="text-[11px] text-slate-500">Motorista Carlos Eduardo iniciou as entregas.</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl space-y-1">
                  <p className="font-semibold text-slate-800">📄 Pedido #1042 Aprovado</p>
                  <p className="text-[11px] text-slate-500">Cliente GE - 60 DDL (R$ 505,70).</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Menu 3 pontinhos */}
        <div className="relative">
          <button
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
              setNotificationsOpen(false);
            }}
            className="w-8 h-8 rounded-xl border border-slate-200/80 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Menu Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50">
              
              {/* Header do Menu */}
              <div className="p-3 border-b border-slate-100 flex items-center gap-3">
                <img
                  src={user?.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={user?.nome || 'Usuário'}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                />
                <div className="overflow-hidden">
                  <h4 className="font-bold text-xs text-slate-900 truncate">{user?.nome || 'Usuário'}</h4>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                  <span className="inline-block mt-1 text-[9px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                    {getPerfilBadgeText(user?.perfil)}
                  </span>
                </div>
              </div>

              {/* Ações */}
              <div className="py-2 text-xs font-medium text-slate-600 space-y-0.5">
                <label className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                  <Camera className="w-4 h-4 text-slate-400" />
                  <span>Alterar Minha Foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleTrocarFoto}
                    className="hidden"
                  />
                </label>

                {user?.perfil === 'MASTER' && (
                  <Link
                    href="/usuarios"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors text-slate-600"
                  >
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>Gestão de Usuários</span>
                  </Link>
                )}

                <Link
                  href="/"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors text-slate-600"
                >
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span>Site Institucional</span>
                </Link>
              </div>

              {/* Logout */}
              <div className="pt-1.5 border-t border-slate-100">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Encerrar Sessão</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}
