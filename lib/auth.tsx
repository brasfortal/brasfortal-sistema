'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Usuario, PerfilUsuario } from './types';
import { StorageService } from './storage';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: Usuario | null;
  loading: boolean;
  login: (email: string, senha?: string) => Promise<{ success: boolean; user?: Usuario; message?: string }>;
  loginAsProfile: (perfil: PerfilUsuario) => void;
  logout: () => void;
  updateCurrentUser: (dados: Partial<Usuario>) => void;
  hasAccess: (module: 'COMERCIAL' | 'LOGISTICA' | 'CADASTROS' | 'USUARIOS' | 'MOTORISTA') => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ success: false }),
  loginAsProfile: () => {},
  logout: () => {},
  updateCurrentUser: () => {},
  hasAccess: () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Carregar usuário da sessão ao iniciar
    const saved = StorageService.getSessionUser();
    setUser(saved);
    setLoading(false);
  }, []);

  const login = async (email: string, _senha?: string): Promise<{ success: boolean; user?: Usuario; message?: string }> => {
    const usuarios = StorageService.getUsuarios();
    const cleanEmail = email.trim().toLowerCase();
    const found = usuarios.find(u => u.email.toLowerCase() === cleanEmail);

    if (found) {
      if (!found.ativo) {
        return { success: false, message: 'Usuário inativo. Contate o administrador master.' };
      }
      const updated = { ...found, ultimo_login: new Date().toISOString() };
      StorageService.saveUsuario(updated);
      StorageService.setSessionUser(updated);
      setUser(updated);
      return { success: true, user: updated };
    }

    // Se for o e-mail master e não estiver cadastrado ainda
    if (cleanEmail === 'marciorsantos05@gmail.com') {
      const masterUser: Usuario = {
        id: 'user-master-1',
        nome: 'Márcio Santos',
        email: 'marciorsantos05@gmail.com',
        perfil: 'MASTER',
        cargo: 'Diretoria Geral / Administrador Master',
        telefone: '(11) 98765-0000',
        foto_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        ativo: true,
        created_at: new Date().toISOString(),
        ultimo_login: new Date().toISOString()
      };
      StorageService.saveUsuario(masterUser);
      StorageService.setSessionUser(masterUser);
      setUser(masterUser);
      return { success: true, user: masterUser };
    }

    return { success: false, message: 'E-mail ou credenciais não encontrados.' };
  };

  const loginAsProfile = (perfil: PerfilUsuario) => {
    const usuarios = StorageService.getUsuarios();
    let target = usuarios.find(u => u.perfil === perfil && u.ativo);
    if (!target) {
      target = usuarios[0];
    }
    if (target) {
      const updated = { ...target, ultimo_login: new Date().toISOString() };
      StorageService.saveUsuario(updated);
      StorageService.setSessionUser(updated);
      setUser(updated);
    }
  };

  const logout = () => {
    StorageService.setSessionUser(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    } else {
      router.push('/login');
    }
  };

  const updateCurrentUser = (dados: Partial<Usuario>) => {
    if (!user) return;
    const updated: Usuario = { ...user, ...dados };
    StorageService.saveUsuario(updated);
    StorageService.setSessionUser(updated);
    setUser(updated);
  };

  const hasAccess = (module: 'COMERCIAL' | 'LOGISTICA' | 'CADASTROS' | 'USUARIOS' | 'MOTORISTA'): boolean => {
    if (!user) return false;
    if (user.perfil === 'MASTER') return true;

    switch (module) {
      case 'COMERCIAL':
        return user.perfil === 'COMERCIAL';
      case 'LOGISTICA':
        return user.perfil === 'LOGISTICA';
      case 'CADASTROS':
        return user.perfil === 'COMERCIAL' || user.perfil === 'LOGISTICA';
      case 'MOTORISTA':
        return user.perfil === 'MOTORISTA' || user.perfil === 'LOGISTICA';
      case 'USUARIOS':
        return false;
      default:
        return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginAsProfile,
        logout,
        updateCurrentUser,
        hasAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
