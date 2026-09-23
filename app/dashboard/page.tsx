'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  PlusCircle, 
  FileText, 
  Printer, 
  Truck, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Package, 
  Scale, 
  Building2, 
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  ShieldCheck
} from 'lucide-react';
import { Pedido } from '@/lib/types';
import { StorageService } from '@/lib/storage';
import { useAuth } from '@/lib/auth';

export default function DashboardPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');
  const { user } = useAuth();

  useEffect(() => {
    setPedidos(StorageService.getPedidos());
  }, []);

  const handleDelete = (id: string, num: number) => {
    if (confirm(`Deseja realmente excluir o pedido #${num}?`)) {
      const updated = StorageService.deletePedido(id);
      setPedidos(updated);
    }
  };

  const filteredPedidos = pedidos.filter(p => {
    const matchesSearch = 
      p.cliente_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cliente_cnpj.includes(searchTerm) ||
      (p.pedido_cliente_n && p.pedido_cliente_n.includes(searchTerm)) ||
      String(p.numero_pedido).includes(searchTerm) ||
      (p.vendedor_nome && p.vendedor_nome.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'TODOS' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // KPIs
  const totalFaturado = pedidos.reduce((acc, p) => acc + p.valor_total, 0);
  const totalPeso = pedidos.reduce((acc, p) => acc + (p.peso_total || 0), 0);
  const pedidosEmRota = pedidos.filter(p => p.status === 'EM_ROTA').length;
  const pedidosEntregues = pedidos.filter(p => p.status === 'ENTREGUE').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ENTREGUE':
        return <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">✓ Entregue</span>;
      case 'EM_ROTA':
        return <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">🚚 Em Rota</span>;
      case 'EXPEDICAO':
        return <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200">📦 Na Expedição</span>;
      case 'ORCAMENTO':
        return <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">📝 Orçamento</span>;
      default:
        return <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">Aprovado</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* CABEÇALHO DO PAINEL */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Gestão Comercial & Pedidos
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              Brasfortal Metais
            </span>
            {user?.perfil === 'MASTER' && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Acesso Master
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Espelhos de pedidos oficiais, controle de comissões, notas fiscais e faturamento
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/pedidos/novo"
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 hover:scale-[1.02] transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Emitir Novo Pedido (Espelho)</span>
          </Link>
        </div>
      </div>

      {/* CARDS DE INDICADORES (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total em Pedidos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total em Vendas</p>
            <h3 className="text-xl font-black text-slate-900 mt-1">
              {totalFaturado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </h3>
            <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">
              {pedidos.length} pedidos emitidos
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Peso Total Expedido */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Peso Total (Metais)</p>
            <h3 className="text-xl font-black text-slate-900 mt-1">
              {totalPeso.toFixed(2)} <span className="text-xs text-slate-500">KG</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-medium mt-1 inline-block">
              Chapas, tubos e conexões
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Scale className="w-6 h-6" />
          </div>
        </div>

        {/* Em Transporte */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Em Transporte</p>
            <h3 className="text-xl font-black text-blue-600 mt-1">
              {pedidosEmRota} <span className="text-xs text-slate-500">cargas</span>
            </h3>
            <Link href="/logistica" className="text-[10px] text-blue-600 font-bold hover:underline mt-1 inline-block">
              Ver Roteiro Logístico →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        {/* Entregues */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Entregues / Concluídos</p>
            <h3 className="text-xl font-black text-emerald-600 mt-1">
              {pedidosEntregues}
            </h3>
            <span className="text-[10px] text-emerald-600 font-medium mt-1 inline-block">
              Canhotos confirmados
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* FILTROS E BUSCA */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por Cliente, CNPJ, Pedido Cliente (ex: 700118149), Vendedor..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-700"
          >
            <option value="TODOS">Todos os Status</option>
            <option value="NOVO">Novos / Aprovados</option>
            <option value="EM_ROTA">Em Transporte</option>
            <option value="ENTREGUE">Entregues</option>
            <option value="ORCAMENTO">Orçamentos</option>
          </select>
        </div>
      </div>

      {/* TABELA DE PEDIDOS COM FORMATO BRASFORTAL */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Ficha Nº</th>
                <th className="p-3.5">Data</th>
                <th className="p-3.5">Cliente / Razão Social</th>
                <th className="p-3.5">Pedido Cliente (OC)</th>
                <th className="p-3.5">Condições</th>
                <th className="p-3.5">Vendedor</th>
                <th className="p-3.5 text-center">Peso Total</th>
                <th className="p-3.5 text-right">Valor Total</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPedidos.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-400">
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              ) : (
                filteredPedidos.map((ped) => (
                  <tr key={ped.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Número */}
                    <td className="p-3.5 font-mono font-black text-blue-900 text-sm">
                      #{ped.numero_pedido}
                    </td>

                    {/* Data */}
                    <td className="p-3.5 text-slate-600 font-medium">
                      {new Date(ped.data_emissao).toLocaleDateString('pt-BR')}
                    </td>

                    {/* Cliente */}
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 uppercase">{ped.cliente_nome}</div>
                      <div className="text-[10px] text-slate-400">{ped.cliente_cnpj}</div>
                      {ped.comprador && (
                        <div className="text-[10px] text-slate-500 font-medium">
                          Comprador: {ped.comprador}
                        </div>
                      )}
                    </td>

                    {/* OC do Cliente */}
                    <td className="p-3.5">
                      <span className="font-mono font-bold bg-slate-100 px-2 py-1 rounded text-slate-800 border border-slate-200">
                        {ped.pedido_cliente_n || '-'}
                      </span>
                    </td>

                    {/* Condições */}
                    <td className="p-3.5 font-bold text-blue-950">
                      {ped.condicoes_pagamento || '30 DDL'}
                    </td>

                    {/* Vendedor */}
                    <td className="p-3.5 font-semibold text-slate-700">
                      {ped.vendedor_nome || 'LUCC BISPO'}
                    </td>

                    {/* Peso */}
                    <td className="p-3.5 text-center font-bold text-slate-800">
                      {ped.peso_total ? `${ped.peso_total.toFixed(2)} kg` : '-'}
                    </td>

                    {/* Valor */}
                    <td className="p-3.5 text-right font-black text-slate-900 text-sm">
                      {ped.valor_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>

                    {/* Status */}
                    <td className="p-3.5 text-center">
                      {getStatusBadge(ped.status)}
                    </td>

                    {/* Ações */}
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Link
                          href={`/pedidos/${ped.id}`}
                          className="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Ver e Imprimir Espelho Oficial"
                        >
                          <Printer className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handleDelete(ped.id, ped.numero_pedido)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
