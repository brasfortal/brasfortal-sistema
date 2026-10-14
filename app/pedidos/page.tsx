'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  Printer, 
  Trash2, 
  Phone, 
  Mail, 
  MessageCircle,
  RotateCw, 
  Building2, 
  Calendar, 
  Coins, 
  Scale, 
  CheckCircle2, 
  Clock, 
  Truck, 
  FileText,
  TrendingUp,
  Download,
  Eye,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { Pedido } from '@/lib/types';
import { StorageService } from '@/lib/storage';
import { useAuth } from '@/lib/auth';

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');
  const [dateFilter, setDateFilter] = useState('TODOS');
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);

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

  // Filtragem completa e busca por:
  // - Nome da empresa / Razão Social
  // - Nome Fantasia
  // - Número do pedido (#1042)
  // - Pedido Cliente / Ordem de Compra (OC)
  // - Nome do comprador
  // - Telefone / WhatsApp do comprador
  // - CNPJ
  // - Vendedor
  const filteredPedidos = useMemo(() => {
    return pedidos.filter(p => {
      const term = searchTerm.toLowerCase().trim();

      const matchesSearch = !term || (
        p.cliente_nome.toLowerCase().includes(term) ||
        p.cliente_cnpj.toLowerCase().includes(term) ||
        String(p.numero_pedido).includes(term) ||
        (p.pedido_cliente_n && p.pedido_cliente_n.toLowerCase().includes(term)) ||
        (p.comprador && p.comprador.toLowerCase().includes(term)) ||
        (p.telefone && p.telefone.replace(/\D/g, '').includes(term.replace(/\D/g, ''))) ||
        (p.telefone && p.telefone.toLowerCase().includes(term)) ||
        (p.vendedor_nome && p.vendedor_nome.toLowerCase().includes(term)) ||
        (p.endereco && p.endereco.toLowerCase().includes(term)) ||
        p.itens.some(item => 
          item.descricao.toLowerCase().includes(term) || 
          item.codigo.toLowerCase().includes(term)
        )
      );

      const matchesStatus = statusFilter === 'TODOS' || p.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [pedidos, searchTerm, statusFilter]);

  // Estatísticas e KPIs rápidos da listagem
  const totalFaturado = useMemo(() => filteredPedidos.reduce((acc, p) => acc + p.valor_total, 0), [filteredPedidos]);
  const totalPeso = useMemo(() => filteredPedidos.reduce((acc, p) => acc + (p.peso_total || 0), 0), [filteredPedidos]);
  const emRotaCount = useMemo(() => filteredPedidos.filter(p => p.status === 'EM_ROTA').length, [filteredPedidos]);
  const entreguesCount = useMemo(() => filteredPedidos.filter(p => p.status === 'ENTREGUE').length, [filteredPedidos]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ENTREGUE':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1 w-fit">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Entregue
          </span>
        );
      case 'EM_ROTA':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1 w-fit">
            <Truck className="w-3 h-3 text-blue-600" /> Em Rota
          </span>
        );
      case 'EXPEDICAO':
      case 'SEPARACAO':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100 flex items-center gap-1 w-fit">
            <Clock className="w-3 h-3 text-purple-600" /> Expedição
          </span>
        );
      case 'ORCAMENTO':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 flex items-center gap-1 w-fit">
            <FileText className="w-3 h-3 text-amber-600" /> Orçamento
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1 w-fit">
            Aprovado
          </span>
        );
    }
  };

  const getWhatsAppLink = (tel?: string, pedNum?: number) => {
    if (!tel) return '#';
    const cleanNum = tel.replace(/\D/g, '');
    const numWithCountry = cleanNum.startsWith('55') ? cleanNum : `55${cleanNum}`;
    const msg = encodeURIComponent(`Olá, referente ao Pedido #${pedNum || ''} na Brasfortal Metais.`);
    return `https://wa.me/${numWithCountry}?text=${msg}`;
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      
      {/* BARRA SUPERIOR: Cabeçalho com Botão Adicionar Novo Pedido */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Gestão Comercial de Pedidos
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Consulte espelhos de pedidos oficiais, notas fiscais, compradores e status de entregas
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPedidos(StorageService.getPedidos())}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200/90 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs"
            title="Atualizar lista"
          >
            <RotateCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Atualizar</span>
          </button>

          <Link
            href="/pedidos/novo"
            className="flex items-center gap-2 px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-white rounded-2xl text-xs font-semibold shadow-xs transition-all hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Novo Pedido</span>
          </Link>
        </div>
      </div>

      {/* CARDS DE RESUMO (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total em Pedidos */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-2xl bg-[#e6f7f2] flex items-center justify-center text-[#10b981]">
              <Coins className="w-4 h-4" />
            </div>
            <span className="text-[11px] text-slate-400 font-medium">{filteredPedidos.length} pedidos</span>
          </div>
          <div className="mt-3">
            <p className="text-xs text-slate-400 font-medium">Faturamento Filtrado</p>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              {totalFaturado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </h3>
          </div>
        </div>

        {/* Peso Total */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Scale className="w-4 h-4" />
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Carga</span>
          </div>
          <div className="mt-3">
            <p className="text-xs text-slate-400 font-medium">Peso Total (Metais)</p>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              {totalPeso.toFixed(2)} <span className="text-xs font-normal text-slate-500">KG</span>
            </h3>
          </div>
        </div>

        {/* Em Transporte */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600">
              <Truck className="w-4 h-4" />
            </div>
            <Link href="/logistica" className="text-[11px] text-[#0d9488] font-semibold hover:underline">
              Ver Rota →
            </Link>
          </div>
          <div className="mt-3">
            <p className="text-xs text-slate-400 font-medium">Em Transporte</p>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              {emRotaCount} <span className="text-xs font-normal text-slate-500">cargas ativas</span>
            </h3>
          </div>
        </div>

        {/* Entregues */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold">Confirmados</span>
          </div>
          <div className="mt-3">
            <p className="text-xs text-slate-400 font-medium">Entregues com Canhoto</p>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              {entreguesCount}
            </h3>
          </div>
        </div>

      </div>

      {/* BARRA DE FILTROS E BUSCA AVANÇADA */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        
        {/* Campo de Busca Inteligente */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por Empresa, Nº Pedido, Comprador, WhatsApp, OC (ex: 700118149), Material..."
            className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200/90 rounded-2xl placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:bg-white text-slate-800 transition-all font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ×
            </button>
          )}
        </div>

        {/* Filtro por Status */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-2xl border border-slate-200/90 bg-slate-50 text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="TODOS">Todos os Status</option>
            <option value="NOVO">Novos / Aprovados</option>
            <option value="EM_ROTA">Em Transporte</option>
            <option value="ENTREGUE">Entregues</option>
            <option value="EXPEDICAO">Na Expedição</option>
            <option value="ORCAMENTO">Orçamentos</option>
          </select>
        </div>

      </div>

      {/* TABELA DE PEDIDOS COM FORMATO MODERNO E COMPLETO */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50/70 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-5">Pedido</th>
                <th className="py-3.5 px-4">Data</th>
                <th className="py-3.5 px-5">Empresa / Razão Social</th>
                <th className="py-3.5 px-4">Comprador & Contato</th>
                <th className="py-3.5 px-4">OC Cliente</th>
                <th className="py-3.5 px-4">Condição</th>
                <th className="py-3.5 px-4 text-center">Peso</th>
                <th className="py-3.5 px-5 text-right">Valor Total</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-5 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPedidos.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold text-slate-600">Nenhum pedido encontrado</p>
                    <p className="text-xs text-slate-400 mt-1">Tente ajustar os filtros ou a palavra-chave pesquisada.</p>
                  </td>
                </tr>
              ) : (
                filteredPedidos.map((ped) => (
                  <tr key={ped.id} className="hover:bg-slate-50/60 transition-colors group">
                    
                    {/* Número do Pedido */}
                    <td className="py-4 px-5">
                      <Link
                        href={`/pedidos/${ped.id}`}
                        className="font-mono font-bold text-sm text-slate-900 group-hover:text-[#10b981] transition-colors flex items-center gap-1.5"
                      >
                        #{ped.numero_pedido}
                      </Link>
                    </td>

                    {/* Data */}
                    <td className="py-4 px-4 text-slate-500 font-medium whitespace-nowrap">
                      {new Date(ped.data_emissao).toLocaleDateString('pt-BR')}
                    </td>

                    {/* Empresa / Razão Social */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600 shrink-0">
                          {ped.cliente_nome.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 uppercase">
                            {ped.cliente_nome}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {ped.cliente_cnpj}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Comprador & Contato Rápido (WhatsApp / Email) */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="font-medium text-slate-800">
                          {ped.comprador || 'Comprador não especificado'}
                        </div>
                        
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          {ped.telefone ? (
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-slate-600">{ped.telefone}</span>
                              <a
                                href={getWhatsAppLink(ped.telefone, ped.numero_pedido)}
                                target="_blank"
                                rel="noreferrer"
                                className="w-5 h-5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-colors"
                                title="Chamar no WhatsApp"
                              >
                                <MessageCircle className="w-3 h-3" />
                              </a>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Sem telefone</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* OC / Pedido Cliente */}
                    <td className="py-4 px-4">
                      {ped.pedido_cliente_n ? (
                        <span className="font-mono font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/80 text-[11px]">
                          {ped.pedido_cliente_n}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    {/* Condição de Pagamento */}
                    <td className="py-4 px-4 font-semibold text-slate-700">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px]">
                        {ped.condicoes_pagamento || '30 DDL'}
                      </span>
                    </td>

                    {/* Peso */}
                    <td className="py-4 px-4 text-center font-semibold text-slate-700">
                      {ped.peso_total ? `${ped.peso_total.toFixed(2)} kg` : '-'}
                    </td>

                    {/* Valor Total */}
                    <td className="py-4 px-5 text-right font-bold text-slate-900 text-sm whitespace-nowrap">
                      {ped.valor_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center">
                        {getStatusBadge(ped.status)}
                      </div>
                    </td>

                    {/* Ações */}
                    <td className="py-4 px-5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Link
                          href={`/pedidos/${ped.id}`}
                          className="p-2 rounded-xl border border-slate-200/80 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                          title="Ver e Imprimir Espelho Oficial"
                        >
                          <Printer className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handleDelete(ped.id, ped.numero_pedido)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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

        {/* Rodapé da tabela com contagem */}
        <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Mostrando {filteredPedidos.length} de {pedidos.length} pedidos</span>
          <span>Brasfortal Metais & Conexões Ltda.</span>
        </div>
      </div>

    </div>
  );
}
