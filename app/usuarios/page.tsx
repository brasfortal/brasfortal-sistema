'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  UserPlus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Key, 
  Mail, 
  Phone, 
  Building, 
  Lock, 
  X, 
  Save,
  Clock,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { Usuario, PerfilUsuario } from '@/lib/types';
import { StorageService } from '@/lib/storage';
import { useAuth } from '@/lib/auth';

export default function UsuariosPage() {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [perfilFilter, setPerfilFilter] = useState('TODOS');
  
  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);

  // Form State
  const [formNome, setFormNome] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPerfil, setFormPerfil] = useState<PerfilUsuario>('COMERCIAL');
  const [formCargo, setFormCargo] = useState('');
  const [formTelefone, setFormTelefone] = useState('');
  const [formFotoUrl, setFormFotoUrl] = useState('');
  const [formAtivo, setFormAtivo] = useState(true);

  useEffect(() => {
    setUsuarios(StorageService.getUsuarios());
  }, []);

  const handleOpenNew = () => {
    setEditingUser(null);
    setFormNome('');
    setFormEmail('');
    setFormPerfil('COMERCIAL');
    setFormCargo('Vendedor / Representante Comercial');
    setFormTelefone('');
    setFormFotoUrl('');
    setFormAtivo(true);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (u: Usuario) => {
    setEditingUser(u);
    setFormNome(u.nome);
    setFormEmail(u.email);
    setFormPerfil(u.perfil);
    setFormCargo(u.cargo);
    setFormTelefone(u.telefone || '');
    setFormFotoUrl(u.foto_url || '');
    setFormAtivo(u.ativo);
    setIsDrawerOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: Usuario = {
      id: editingUser ? editingUser.id : `user-${Date.now()}`,
      nome: formNome,
      email: formEmail.trim().toLowerCase(),
      perfil: formPerfil,
      cargo: formCargo,
      telefone: formTelefone,
      foto_url: formFotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      ativo: formAtivo,
      created_at: editingUser ? editingUser.created_at : new Date().toISOString(),
      ultimo_login: editingUser?.ultimo_login
    };

    const updated = StorageService.saveUsuario(newUser);
    setUsuarios(updated);
    setIsDrawerOpen(false);
  };

  const handleDeleteUser = (id: string, email: string) => {
    if (email === 'marciorsantos05@gmail.com') {
      alert('O usuário Master principal (marciorsantos05@gmail.com) não pode ser excluído.');
      return;
    }
    if (confirm(`Deseja realmente remover o usuário ${email}?`)) {
      const updated = StorageService.deleteUsuario(id);
      setUsuarios(updated);
    }
  };

  const filteredUsuarios = usuarios.filter(u => {
    const matchesSearch = 
      u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.cargo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPerfil = perfilFilter === 'TODOS' || u.perfil === perfilFilter;
    return matchesSearch && matchesPerfil;
  });

  const getPerfilBadge = (perfil: PerfilUsuario) => {
    switch (perfil) {
      case 'MASTER':
        return (
          <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> MASTER
          </span>
        );
      case 'COMERCIAL':
        return (
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            💼 Comercial
          </span>
        );
      case 'LOGISTICA':
        return (
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
            🚚 Logística
          </span>
        );
      case 'MOTORISTA':
        return (
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            📱 Motorista
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* CABEÇALHO DA PÁGINA */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              <span>Gestão de Usuários & Perfis de Acesso</span>
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
              Controle RBAC
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gerencie permissões, crie contas para equipe comercial, logística e motoristas
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 hover:scale-[1.02] transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Cadastrar Novo Usuário</span>
        </button>
      </div>

      {/* AVISO DE PERMISSÃO MASTER */}
      {user?.perfil !== 'MASTER' && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <strong>Atenção:</strong> Você está visualizando esta página com perfil <strong>{user?.perfil}</strong>. Para alterar permissões globais ou adicionar novos administradores, faça login com a conta Master <strong>marciorsantos05@gmail.com</strong>.
          </div>
        </div>
      )}

      {/* CARDS RESUMO */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold uppercase text-slate-400">Total de Usuários</p>
          <h3 className="text-xl font-black text-slate-900 mt-0.5">{usuarios.length}</h3>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold uppercase text-purple-600">Diretoria / Master</p>
          <h3 className="text-xl font-black text-purple-700 mt-0.5">
            {usuarios.filter(u => u.perfil === 'MASTER').length}
          </h3>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold uppercase text-blue-600">Comercial & Vendas</p>
          <h3 className="text-xl font-black text-blue-700 mt-0.5">
            {usuarios.filter(u => u.perfil === 'COMERCIAL').length}
          </h3>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold uppercase text-indigo-600">Logística & Frota</p>
          <h3 className="text-xl font-black text-indigo-700 mt-0.5">
            {usuarios.filter(u => u.perfil === 'LOGISTICA' || u.perfil === 'MOTORISTA').length}
          </h3>
        </div>
      </div>

      {/* FILTRO E BUSCA */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por Nome, E-mail ou Cargo..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={perfilFilter}
            onChange={(e) => setPerfilFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-700"
          >
            <option value="TODOS">Todos os Perfis</option>
            <option value="MASTER">Master / Diretoria</option>
            <option value="COMERCIAL">Comercial</option>
            <option value="LOGISTICA">Logística</option>
            <option value="MOTORISTA">Motorista</option>
          </select>
        </div>
      </div>

      {/* TABELA DE USUÁRIOS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Colaborador</th>
                <th className="p-3.5">E-mail</th>
                <th className="p-3.5">Cargo / Departamento</th>
                <th className="p-3.5 text-center">Nível de Acesso</th>
                <th className="p-3.5">Telefone / WhatsApp</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-center">Último Acesso</th>
                <th className="p-3.5 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsuarios.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  
                  {/* Foto e Nome */}
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                        alt={u.nome}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-sm"
                      />
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          {u.nome}
                          {u.email === 'marciorsantos05@gmail.com' && (
                            <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-purple-100 text-purple-800">
                              PROPRIETÁRIO
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* E-mail */}
                  <td className="p-3.5 font-medium text-slate-700">
                    {u.email}
                  </td>

                  {/* Cargo */}
                  <td className="p-3.5 text-slate-600">
                    {u.cargo}
                  </td>

                  {/* Perfil */}
                  <td className="p-3.5 text-center">
                    {getPerfilBadge(u.perfil)}
                  </td>

                  {/* Telefone */}
                  <td className="p-3.5 text-slate-600 font-mono text-[11px]">
                    {u.telefone || '-'}
                  </td>

                  {/* Status */}
                  <td className="p-3.5 text-center">
                    {u.ativo ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        ● Ativo
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                        ● Inativo
                      </span>
                    )}
                  </td>

                  {/* Último Login */}
                  <td className="p-3.5 text-center text-slate-500 text-[11px]">
                    {u.ultimo_login ? new Date(u.ultimo_login).toLocaleString('pt-BR') : 'Nunca acessou'}
                  </td>

                  {/* Ações */}
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(u)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar Usuário e Permissões"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {u.email !== 'marciorsantos05@gmail.com' && (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.email)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir Usuário"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DRAWER LATERAL DE CADASTRO / EDIÇÃO DE USUÁRIO (50% DA TELA) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-sm flex justify-end animate-fadeIn">
          <div 
            className="w-full sm:max-w-xl md:w-1/2 lg:w-1/2 bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-slideLeft overflow-y-auto"
          >
            {/* Cabeçalho do Drawer */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-800">
                  {editingUser ? 'Editar Permissões do Usuário' : 'Novo Usuário do Sistema'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSaveUser} className="p-6 space-y-4 flex-1">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                  placeholder="Ex: Márcio Silva"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  E-mail de Acesso *
                </label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="usuario@brasfortal.com.br"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nível de Permissão (Perfil) *
                </label>
                <select
                  value={formPerfil}
                  onChange={(e) => setFormPerfil(e.target.value as PerfilUsuario)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-slate-50 font-bold text-slate-800 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MASTER">👑 MASTER / DIRETORIA (Acesso total a todos os módulos e usuários)</option>
                  <option value="COMERCIAL">💼 COMERCIAL (Emissão de pedidos, clientes e catálogo de metais)</option>
                  <option value="LOGISTICA">🚚 LOGÍSTICA & EXPEDIÇÃO (Romaneios, pesagem de carga e rotas)</option>
                  <option value="MOTORISTA">📱 MOTORISTA (Terminal Mobile, GPS e foto de canhotos)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Cargo / Descrição
                </label>
                <input
                  type="text"
                  value={formCargo}
                  onChange={(e) => setFormCargo(e.target.value)}
                  placeholder="Ex: Gerente Comercial Sênior"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Telefone / WhatsApp
                </label>
                <input
                  type="text"
                  value={formTelefone}
                  onChange={(e) => setFormTelefone(e.target.value)}
                  placeholder="(11) 98765-4321"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  URL da Foto de Perfil (Opcional)
                </label>
                <input
                  type="url"
                  value={formFotoUrl}
                  onChange={(e) => setFormFotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formAtivo}
                    onChange={(e) => setFormAtivo(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    Usuário Ativo (permitir login no sistema)
                  </span>
                </label>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-105"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Usuário</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
