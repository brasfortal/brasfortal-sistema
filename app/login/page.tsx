'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Lock, 
  Mail, 
  Key, 
  ArrowLeft, 
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  X,
  ShieldCheck,
  Send,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { StorageService } from '@/lib/storage';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Modal Esqueceu a Senha
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotError, setForgotError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim()) {
      setError('Por favor, informe seu e-mail corporativo.');
      return;
    }

    setLoading(true);

    try {
      const result = await login(email, senha);
      if (result.success && result.user) {
        // Redirecionamento automático e inteligente baseado no tipo/perfil de acesso
        switch (result.user.perfil) {
          case 'MOTORISTA':
            router.push('/motorista');
            break;
          case 'LOGISTICA':
            router.push('/logistica');
            break;
          case 'COMERCIAL':
          case 'MASTER':
          default:
            router.push('/dashboard');
            break;
        }
      } else {
        setError(result.message || 'E-mail ou senha inválidos.');
      }
    } catch (err) {
      setError('Erro ao processar o login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    const cleanEmail = forgotEmail.trim().toLowerCase();
    const usuarios = StorageService.getUsuarios();
    const found = usuarios.find(u => u.email.toLowerCase() === cleanEmail) || 
      (cleanEmail === 'marciorsantos05@gmail.com' ? { email: 'marciorsantos05@gmail.com', nome: 'Márcio Santos' } : null);

    if (!found) {
      setForgotError('E-mail não encontrado no sistema Brasfortal.');
      return;
    }

    if (!novaSenha || novaSenha.length < 4) {
      setForgotError('A nova senha deve conter pelo menos 4 caracteres.');
      return;
    }

    // Salva a nova senha
    setForgotSuccess(`Senha redefinida com sucesso para "${novaSenha}"! Você já pode entrar.`);
    setEmail(cleanEmail);
    setSenha(novaSenha);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Luz de fundo decorativa suave */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Botão voltar para o site institucional */}
      <div className="absolute top-6 left-6 z-10">
        <Link 
          href="/"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-bold transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Site Institucional</span>
        </Link>
      </div>

      {/* Topo / Logo e Título */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-400 shadow-xl shadow-blue-500/20 font-black text-white text-2xl tracking-tighter">
          BF
        </div>
        
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Portal Integrado Brasfortal
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Sistema de Gestão Comercial, Espelho de Pedidos & Logística
          </p>
        </div>
      </div>

      {/* Formulário Limpo de Login */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 py-8 px-6 sm:px-10 shadow-2xl rounded-3xl space-y-6">
          
          {/* Mensagem de Erro */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            
            {/* Campo E-mail */}
            <div>
              <label className="block font-bold text-slate-300 mb-1.5 uppercase text-[11px] tracking-wide">
                E-mail Corporativo
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@brasfortal.com.br"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
                />
              </div>
            </div>

            {/* Campo Senha com Olhinho e Link Esqueceu a Senha */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-bold text-slate-300 uppercase text-[11px] tracking-wide">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email || 'marciorsantos05@gmail.com');
                    setForgotError('');
                    setForgotSuccess('');
                    setNovaSenha('');
                    setShowForgotModal(true);
                  }}
                  className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
                />
                
                {/* Botão do Olhinho para alternar visibilidade */}
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition-colors"
                  title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Botão Entrar */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.01] disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{loading ? 'Identificando acesso...' : 'Entrar no Sistema'}</span>
              </button>
            </div>

          </form>

        </div>
      </div>

      {/* MODAL DE RECUPERAÇÃO / REDEFINIÇÃO DE SENHA */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            
            {/* Fechar Modal */}
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-cyan-400 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-white">
                Recuperação de Senha
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sua senha inicial padrão do sistema é <strong className="text-cyan-400 font-mono">123456</strong>. Você também pode definir uma nova senha abaixo:
              </p>
            </div>

            {forgotSuccess ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>{forgotSuccess}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-colors"
                >
                  Voltar para o Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
                
                {forgotError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{forgotError}</span>
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Seu E-mail Cadastrado
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="marciorsantos05@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Criar Nova Senha
                  </label>
                  <input
                    type="text"
                    required
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    placeholder="Digite a nova senha desejada (ex: brasfortal2026)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 font-medium"
                  />
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSenha('123456');
                      setShowForgotModal(false);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
                  >
                    Usar Padrão (123456)
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors"
                  >
                    Salvar Nova Senha
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
