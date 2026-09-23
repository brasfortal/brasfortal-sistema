'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
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
  CheckCircle2,
  Calendar,
  Globe,
  Users
} from 'lucide-react';
import { useAuth } from '@/lib/auth';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  isCollapsed: boolean;
}

export default function Header({ onToggleMobileMenu, isCollapsed }: HeaderProps) {
  const { user, logout, updateCurrentUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const dataAtual = new Date().toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const getPerfilBadgeText = (perfil?: string) => {
    switch (perfil) {
      case 'MASTER':
        return '👑 Master / Diretoria';
      case 'COMERCIAL':
        return '💼 Comercial';
      case 'LOGISTICA':
        return '🚚 Logística';
      case 'MOTORISTA':
        return '📱 Motorista';
      default:
        return 'Colaborador';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between no-print shadow-xs">
      
      {/* Lado Esquerdo: Botão Mobile + Informações Rápidas */}
      <div className="flex items-center gap-3">
        
        {/* Botão Hambúrguer Mobile */}
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Abrir Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Data e Local */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <span className="capitalize">{dataAtual}</span>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Unidade São Paulo (Matriz)</span>
        </div>

        {/* Link para Landing Page pública */}
        <Link
          href="/"
          className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors"
          title="Ver Site Institucional"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Site Institucional</span>
        </Link>
      </div>

      {/* Lado Direito: Notificações & Perfil do Usuário com Foto */}
      <div className="flex items-center gap-3" ref={dropdownRef}>
        
        {/* Botão de Notificações */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setDropdownOpen(false);
            }}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
            title="Notificações da Expedição"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-blue-600 rounded-full ring-2 ring-white"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 space-y-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between border-b pb-2">
                <h4 className="font-extrabold text-xs uppercase text-slate-800">Notificações</h4>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">2 Novas</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-blue-50/60 rounded-xl border border-blue-100 space-y-0.5">
                  <p className="font-bold text-slate-800">🚚 Motorista José Carlos em rota</p>
                  <p className="text-[11px] text-slate-500">Romaneio #201 saiu para entrega na GE e Alvorada.</p>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                  <p className="font-bold text-slate-800">📄 Pedido #1042 Aprovado</p>
                  <p className="text-[11px] text-slate-500">Cliente GE - 60 DDL (R$ 505,70).</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200"></div>

        {/* PERFIL DO USUÁRIO LOGADO COM FOTO */}
        <div className="relative">
          <button
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-3 p-1.5 sm:px-3 rounded-2xl hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200 text-left group"
          >
            {/* Foto de Perfil */}
            <div className="relative">
              <img
                src={user?.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user?.nome || 'Usuário'}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-600/30 group-hover:ring-blue-600 transition-all shadow-sm"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white"></span>
            </div>

            {/* Nome e Cargo */}
            <div className="hidden sm:block">
              <div className="text-xs font-black text-slate-900 leading-tight">
                {user?.nome || 'Márcio Santos'}
              </div>
              <div className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">
                {user?.cargo || 'Diretoria Master'}
              </div>
            </div>

            <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Menu Dropdown do Usuário */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2">
              
              {/* Header do Menu */}
              <div className="p-3 border-b border-slate-100 flex items-center gap-3">
                <img
                  src={user?.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={user?.nome || 'Usuário'}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-600"
                />
                <div className="overflow-hidden">
                  <h4 className="font-extrabold text-xs text-slate-900 truncate">{user?.nome || 'Usuário'}</h4>
                  <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                  <span className="inline-block mt-0.5 text-[9px] font-black uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                    {getPerfilBadgeText(user?.perfil)}
                  </span>
                </div>
              </div>

              {/* Ações */}
              <div className="py-1.5 text-xs font-semibold text-slate-700 space-y-0.5">
                
                {/* Alterar Foto */}
                <label className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors">
                  <Camera className="w-4 h-4 text-blue-600" />
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
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-700 cursor-pointer"
                  >
                    <Users className="w-4 h-4 text-purple-600" />
                    <span>Gestão de Usuários & Perfis</span>
                  </Link>
                )}

                <Link
                  href="/"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-700 cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-cyan-600" />
                  <span>Ver Site Institucional</span>
                </Link>
              </div>

              {/* Sair / Logout */}
              <div className="pt-1.5 border-t border-slate-100">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Encerrar Sessão / Sair</span>
                </button>
              </div>

            </div>
          )}
        </div>

      </div>

    </header>
  );
}
