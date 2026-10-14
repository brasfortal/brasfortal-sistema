'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Plus,
  PlusCircle, 
  Printer, 
  Truck, 
  TrendingUp, 
  Scale, 
  Search,
  Filter,
  Trash2,
  Calendar,
  RotateCw,
  ArrowUpRight,
  ArrowDownRight,
  Phone,
  Mail,
  ChevronDown,
  Coins,
  CheckCircle2,
  CheckSquare,
  Clock,
  Download,
  Building2,
  ShieldCheck,
  Eye,
  Edit3,
  FileSpreadsheet
} from 'lucide-react';
import { Pedido } from '@/lib/types';
import { StorageService } from '@/lib/storage';
import { useAuth } from '@/lib/auth';

export default function DashboardPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');
  const [productFilter, setProductFilter] = useState('TODOS');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(4);
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Emitir cotação de tubos 304 para Caldeiraria Vale', date: 'Hoje', tag: 'Comercial', tagColor: 'emerald', done: false },
    { id: '2', title: 'Conferir canhoto de entrega do romaneio #201', date: 'Hoje', tag: 'Logística', tagColor: 'blue', done: true },
    { id: '3', title: 'Agendar descarga de chapas de policarbonato na Doca 2', date: 'Amanhã', tag: 'Expedição', tagColor: 'purple', done: false }
  ]);
  const [newTaskInput, setNewTaskInput] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);

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

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    setTasks(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        title: newTaskInput.trim(),
        date: 'Hoje',
        tag: 'Geral',
        tagColor: 'emerald',
        done: false
      }
    ]);
    setNewTaskInput('');
    setShowAddTask(false);
  };

  // KPIs
  const totalFaturado = useMemo(() => pedidos.reduce((acc, p) => acc + p.valor_total, 0), [pedidos]);
  const totalPeso = useMemo(() => pedidos.reduce((acc, p) => acc + (p.peso_total || 0), 0), [pedidos]);
  const totalDeals = pedidos.length;
  const avgSaleValue = totalDeals > 0 ? totalFaturado / totalDeals : 0;

  // Filtragem de Pedidos
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

  // Mock de pontos para o gráfico de faturamento com SVG interativo
  const chartPoints = [
    { label: 'Jun 10', current: 15.2, prev: 12.0 },
    { label: 'Jun 14', current: 18.5, prev: 13.1 },
    { label: 'Jun 18', current: 17.8, prev: 12.8 },
    { label: 'Jun 22', current: 20.4, prev: 11.9 },
    { label: 'Jun 26', current: 22.1, prev: 12.5 },
    { label: 'Jun 30', current: 18.2, prev: 13.9 },
    { label: 'Jul 04', current: 19.5, prev: 13.2 },
    { label: 'Jul 08', current: 22.0, prev: 14.8 },
    { label: 'Jul 12', current: 25.4, prev: 15.6 }
  ];

  // SVG Coordinates
  const svgWidth = 800;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;
  const innerW = svgWidth - paddingX * 2;
  const innerH = svgHeight - paddingY * 2;
  const minVal = 10;
  const maxVal = 28;

  const getCoordinates = (index: number, val: number) => {
    const x = paddingX + (index / (chartPoints.length - 1)) * innerW;
    const y = svgHeight - paddingY - ((val - minVal) / (maxVal - minVal)) * innerH;
    return { x, y };
  };

  const currentPathData = chartPoints.reduce((acc, pt, i) => {
    const { x, y } = getCoordinates(i, pt.current);
    if (i === 0) return `M ${x} ${y}`;
    const prev = getCoordinates(i - 1, chartPoints[i - 1].current);
    const cpX = (prev.x + x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${y}, ${x} ${y}`;
  }, '');

  const prevPathData = chartPoints.reduce((acc, pt, i) => {
    const { x, y } = getCoordinates(i, pt.prev);
    if (i === 0) return `M ${x} ${y}`;
    const prev = getCoordinates(i - 1, chartPoints[i - 1].prev);
    const cpX = (prev.x + x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${y}, ${x} ${y}`;
  }, '');

  const currentAreaPath = `${currentPathData} L ${getCoordinates(chartPoints.length - 1, chartPoints[chartPoints.length - 1].current).x} ${svgHeight - paddingY} L ${paddingX} ${svgHeight - paddingY} Z`;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      
      {/* BARRA SUPERIOR: Last updated, Filtros e Ação de Import/Export */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Pílula: Last updated */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white border border-slate-200/90 rounded-2xl text-xs text-slate-600 shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Last updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
          <button 
            onClick={() => setPedidos(StorageService.getPedidos())} 
            className="hover:text-slate-900 transition-colors ml-1"
            title="Atualizar dados"
          >
            <RotateCw className="w-3 h-3 text-slate-400 hover:text-slate-700" />
          </button>
        </div>

        {/* Botões do Topo: Filter & Import/Export / Novo Pedido */}
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => setStatusFilter(statusFilter === 'TODOS' ? 'EM_ROTA' : 'TODOS')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-xs font-medium border transition-colors ${
              statusFilter !== 'TODOS' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-white text-slate-600 border-slate-200/90 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter</span>
          </button>

          <Link
            href="/pedidos/novo"
            className="flex items-center gap-2 px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-white rounded-2xl text-xs font-semibold shadow-xs transition-all hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Emitir Pedido</span>
          </Link>
        </div>
      </div>

      {/* CARDS DE INDICADORES (KPIs) - 3 Colunas iguais estilo imagem de referência */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Total Sales */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-2xl bg-[#e6f7f2] flex items-center justify-center text-[#10b981]">
              <Coins className="w-4 h-4" />
            </div>
            <button className="text-slate-300 hover:text-slate-600 transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4">
            <p className="text-xs text-slate-400 font-medium">Total Sales</p>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              {totalFaturado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </h3>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 font-semibold text-emerald-600">
              <span className="text-[11px]">↑</span> 10.5%
            </span>
            <span className="text-slate-400 text-[11px]">from last period</span>
          </div>
        </div>

        {/* Card 2: Avg. Sale Value */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600">
              <TrendingUp className="w-4 h-4" />
            </div>
            <button className="text-slate-300 hover:text-slate-600 transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4">
            <p className="text-xs text-slate-400 font-medium">Avg. Sale value</p>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              {avgSaleValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </h3>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 font-semibold text-emerald-600">
              <span className="text-[11px]">↑</span> 3.4%
            </span>
            <span className="text-slate-400 text-[11px]">from last period</span>
          </div>
        </div>

        {/* Card 3: Total Deals / Pedidos */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Building2 className="w-4 h-4" />
            </div>
            <button className="text-slate-300 hover:text-slate-600 transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4">
            <p className="text-xs text-slate-400 font-medium">Total Deals</p>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              {totalDeals}
            </h3>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 font-semibold text-rose-500">
              <span className="text-[11px]">↓</span> 0.5%
            </span>
            <span className="text-slate-400 text-[11px]">from last period</span>
          </div>
        </div>

      </div>

      {/* GRÁFICO DE REVENUE (Card Amplo com Curvas e Tooltip Interativo) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        
        {/* Cabeçalho do Card de Revenue */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-700">
            <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-sm text-slate-800">Revenue</span>
          </div>

          <div className="relative">
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer pr-8 appearance-none"
            >
              <option value="TODOS">All Products</option>
              <option value="TUBOS">Tubos Inox</option>
              <option value="PLACAS">Placas Policarbonato</option>
              <option value="CONEXOES">Conexões & Flanges</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Indicador de Faturamento e Legenda */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              {totalFaturado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              ↑ 10.5%
            </span>
            <span className="text-xs text-slate-400">from last period</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
              <span>This period</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]"></span>
              <span>Last period</span>
            </div>
          </div>
        </div>

        {/* Área do Gráfico SVG Estilizado com Curvas Suaves */}
        <div className="mt-6 relative h-[220px] w-full">
          <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Linhas de Grade Horizontais */}
            {[25, 20, 15, 10].map((val) => {
              const y = svgHeight - paddingY - ((val - minVal) / (maxVal - minVal)) * innerH;
              return (
                <g key={val}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={svgWidth - paddingX}
                    y2={y}
                    stroke="#f1f5f9"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingX - 10}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[10px] fill-slate-300 font-sans"
                  >
                    ${val}K
                  </text>
                </g>
              );
            })}

            {/* Área sombreada do período atual */}
            <path d={currentAreaPath} fill="url(#revenueGradient)" />

            {/* Linha do período anterior (Azul Celeste) */}
            <path d={prevPathData} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />

            {/* Linha do período atual (Verde Menta / Teal) */}
            <path d={currentPathData} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />

            {/* Linha tracejada vertical e ponto ativo para o hoveredPoint */}
            {hoveredPoint !== null && (
              <g>
                <line
                  x1={getCoordinates(hoveredPoint, chartPoints[hoveredPoint].current).x}
                  y1={paddingY - 10}
                  x2={getCoordinates(hoveredPoint, chartPoints[hoveredPoint].current).x}
                  y2={svgHeight - paddingY}
                  stroke="#94a3b8"
                  strokeDasharray="3 3"
                  strokeWidth="1.5"
                />
                <circle
                  cx={getCoordinates(hoveredPoint, chartPoints[hoveredPoint].current).x}
                  cy={getCoordinates(hoveredPoint, chartPoints[hoveredPoint].current).y}
                  r="5"
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                />
                <circle
                  cx={getCoordinates(hoveredPoint, chartPoints[hoveredPoint].prev).x}
                  cy={getCoordinates(hoveredPoint, chartPoints[hoveredPoint].prev).y}
                  r="5"
                  fill="#38bdf8"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                />
              </g>
            )}
          </svg>

          {/* Tooltip flutuante idêntico ao da imagem de referência */}
          {hoveredPoint !== null && (
            <div 
              className="absolute pointer-events-none bg-white rounded-xl shadow-lg border border-slate-100 p-2.5 text-xs z-10"
              style={{
                left: `${(getCoordinates(hoveredPoint, chartPoints[hoveredPoint].current).x / svgWidth) * 100}%`,
                top: '25px',
                transform: 'translateX(-50%)'
              }}
            >
              <div className="font-semibold text-slate-800 text-[11px] mb-1">Total Revenue</div>
              <div className="space-y-0.5 text-[10px]">
                <div className="flex items-center justify-between gap-3 text-slate-500">
                  <span>{chartPoints[hoveredPoint].label}, 2024</span>
                  <span className="font-bold text-[#10b981]">${chartPoints[hoveredPoint].current}K</span>
                </div>
                <div className="flex items-center justify-between gap-3 text-slate-500">
                  <span>{chartPoints[hoveredPoint].label}, 2024</span>
                  <span className="font-bold text-[#38bdf8]">${chartPoints[hoveredPoint].prev}K</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Datas no Rodapé do Gráfico */}
        <div className="flex items-center justify-between px-8 text-[11px] text-slate-400 mt-2 font-medium">
          <span>June 20, 2024</span>
          <span>Feb 28, 2024</span>
        </div>
      </div>

      {/* SEÇÃO INFERIOR: Tabela de Pedidos / Contatos (Esquerda) e My Tasks (Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* TABELA DE PEDIDOS & CLIENTES (2 Colunas no Grid) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
          
          {/* Topo da Tabela: Título + Busca Rápida */}
          <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-500" />
              <h4 className="font-bold text-sm text-slate-800">Clientes & Pedidos Recentes</h4>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search contact or order..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200/80 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:bg-white text-slate-800"
                />
              </div>
              <button 
                onClick={() => setSearchTerm('')} 
                className="w-7 h-7 rounded-xl border border-slate-200/80 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                title="Limpar busca"
              >
                <RotateCw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Tabela Clean com Design Minimalista */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/70 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Person / Cliente</th>
                  <th className="py-3 px-4">Pedido / OC</th>
                  <th className="py-3 px-4">Condição</th>
                  <th className="py-3 px-4 text-right">Valor Total</th>
                  <th className="py-3 px-4 text-center">Contact info</th>
                  <th className="py-3 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPedidos.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                      Nenhum pedido encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredPedidos.map((ped) => (
                    <tr key={ped.id} className="hover:bg-slate-50/60 transition-colors group">
                      
                      {/* Cliente com Avatar e Nome */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600 shrink-0">
                            {ped.cliente_nome.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 group-hover:text-[#10b981] transition-colors">
                              {ped.cliente_nome}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {ped.comprador ? `Comprador: ${ped.comprador}` : ped.cliente_cnpj}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* OC / Pedido Nº */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800">
                            #{ped.numero_pedido}
                          </span>
                          {ped.pedido_cliente_n && (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                              {ped.pedido_cliente_n}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Condições de Pagamento */}
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                          {ped.condicoes_pagamento || '30 DDL'}
                        </span>
                      </td>

                      {/* Valor Total */}
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                        {ped.valor_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>

                      {/* Contact Info: Ícones Telefone e Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button 
                            onClick={() => alert(`Telefone: ${ped.telefone || '(11) 98765-4321'}`)}
                            className="w-7 h-7 rounded-xl border border-slate-200/80 hover:border-slate-300 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
                            title="Ver Telefone"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => alert(`Enviar e-mail para: ${ped.cliente_nome}`)}
                            className="w-7 h-7 rounded-xl border border-slate-200/80 hover:border-slate-300 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
                            title="Enviar Email"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Ações: Editar / Imprimir Espelho / Excluir */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            href={`/pedidos/${ped.id}/editar`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#10b981] hover:bg-emerald-50 transition-colors"
                            title="Editar Pedido"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/pedidos/${ped.id}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                            title="Imprimir Espelho"
                          >
                            <Printer className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(ped.id, ped.numero_pedido)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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

        {/* CARD DA DIREITA: MY TASKS (Estilo To-do Minimalista da imagem) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-slate-500" />
                <h4 className="font-bold text-sm text-slate-800">My Tasks</h4>
              </div>
              <button 
                onClick={() => setShowAddTask(!showAddTask)}
                className="w-6 h-6 rounded-lg border border-slate-200/80 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                title="Adicionar tarefa"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Formulário rápido para adicionar tarefa */}
            {showAddTask && (
              <form onSubmit={handleAddTask} className="mt-3 flex gap-2">
                <input
                  type="text"
                  placeholder="Nova tarefa..."
                  value={newTaskInput}
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#10b981]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#10b981] text-white rounded-xl text-xs font-semibold"
                >
                  Salvar
                </button>
              </form>
            )}

            {/* Lista de Tarefas */}
            <div className="mt-4 space-y-3">
              {tasks.map((task) => (
                <div 
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    task.done 
                      ? 'bg-slate-50/60 border-slate-100 opacity-60' 
                      : 'bg-white border-slate-200/70 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button 
                      type="button"
                      className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                        task.done 
                          ? 'bg-[#10b981] border-[#10b981] text-white' 
                          : 'border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {task.done && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </button>
                    <div className="flex-1">
                      <p className={`text-xs font-medium leading-snug ${task.done ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {task.title}
                      </p>
                      
                      <div className="mt-2 flex items-center gap-2">
                        <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                          <Calendar className="w-3 h-3" />
                          {task.date}
                        </span>
                        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                          task.tagColor === 'emerald'
                            ? 'bg-emerald-50 text-emerald-600'
                            : task.tagColor === 'blue'
                            ? 'bg-blue-50 text-blue-600'
                            : 'bg-purple-50 text-purple-600'
                        }`}>
                          {task.tag}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rodapé do Card: Estatística de Conclusão */}
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>{tasks.filter(t => t.done).length} de {tasks.length} concluídas</span>
            <span className="font-semibold text-emerald-600">
              {Math.round((tasks.filter(t => t.done).length / tasks.length) * 100)}%
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
