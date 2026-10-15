'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Scale, 
  Plus, 
  Search, 
  Filter, 
  Scissors, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  Layers, 
  Box, 
  MapPin, 
  Calendar, 
  FileText, 
  TrendingUp, 
  Sparkles,
  Info,
  DollarSign,
  Package,
  ChevronDown,
  Settings
} from 'lucide-react';
import { ItemEstoqueDimensional, TipoOrigemEstoque, MaterialConfig, FormatoGeometricoConfig } from '@/lib/types';
import { StorageService } from '@/lib/storage';
import { 
  MATERIAIS_DENSIDADE, 
  calcularPesoTeorico, 
  ParametrosCalculoPeso, 
  GeometriaTipo 
} from '@/lib/weightCalculator';

export default function EstoqueProdutosPage() {
  const [estoque, setEstoque] = useState<ItemEstoqueDimensional[]>([]);
  const [filtroMaterial, setFiltroMaterial] = useState<string>('TODOS');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('TODAS');
  const [filtroOrigem, setFiltroOrigem] = useState<string>('TODOS');
  const [termoBusca, setTermoBusca] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string>('');

  // Estados dos Modais
  const [modalAberto, setModalAberto] = useState(false);
  const [itemEmEdicaoId, setItemEmEdicaoId] = useState<string | null>(null);
  
  // Modal de Corte / Divisão de Barra/Chapa
  const [modalCorteAberto, setModalCorteAberto] = useState(false);
  const [itemParaCorte, setItemParaCorte] = useState<ItemEstoqueDimensional | null>(null);
  const [medidaCortada, setMedidaCortada] = useState<number>(0);

  // Form State Unificado (Comercial + Físico/Dimensional)
  const [formCodigo, setFormCodigo] = useState('');
  const [formDescricao, setFormDescricao] = useState('');
  const [formNcm, setFormNcm] = useState('');
  const [formCategoria, setFormCategoria] = useState('Tubos Inox');
  const [formUnidade, setFormUnidade] = useState('PÇ');
  const [formPrecoVenda, setFormPrecoVenda] = useState<number>(0);
  const [formMaterialKey, setFormMaterialKey] = useState('INOX_304');
  const [formGeometria, setFormGeometria] = useState<GeometriaTipo>('TUBO_REDONDO');
  const [formOrigem, setFormOrigem] = useState<TipoOrigemEstoque>('BARRA_INTEIRA');
  const [formQtdPecas, setFormQtdPecas] = useState<number>(1);
  const [formLocalizacao, setFormLocalizacao] = useState('Rua A - Prateleira Tubos Inox');
  const [formObs, setFormObs] = useState('');

  // Dimensões Físicas
  const [dimEspessura, setDimEspessura] = useState<number>(1.5);
  const [dimLargura, setDimLargura] = useState<number>(1000);
  const [dimComprimentoMm, setDimComprimentoMm] = useState<number>(2000);
  const [dimComprimentoMetros, setDimComprimentoMetros] = useState<number>(6.0);
  const [dimDiametroExt, setDimDiametroExt] = useState<number>(25.4);
  const [dimParede, setDimParede] = useState<number>(1.5);
  const [dimDiametroBarra, setDimDiametroBarra] = useState<number>(25.4);
  const [pesoManual, setPesoManual] = useState<number | null>(null);

  // Configurações Dinâmicas de Engenharia
  const [materiaisConfig, setMateriaisConfig] = useState<MaterialConfig[]>([]);
  const [formatosConfig, setFormatosConfig] = useState<FormatoGeometricoConfig[]>([]);

  // Carregar dados unificados
  const loadData = () => {
    const list = StorageService.getEstoqueDimensional();
    setEstoque(list);
    setMateriaisConfig(StorageService.getMateriaisConfig());
    setFormatosConfig(StorageService.getFormatosConfig());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Mapa de densidades atualizado em tempo real com as configurações
  const materiaisDensidadeMap = useMemo(() => {
    return StorageService.getMateriaisDensidadeMap();
  }, [materiaisConfig]);

  // Fechar drawer ao pressionar tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalAberto(false);
        setModalCorteAberto(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const exibirToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Cálculo ao vivo do peso para o formulário
  const pesoCalculadoAoVivo = useMemo(() => {
    const params: ParametrosCalculoPeso = {
      geometria: formGeometria,
      materialKey: formMaterialKey,
      espessura_mm: dimEspessura,
      largura_mm: dimLargura,
      comprimento_mm: dimComprimentoMm,
      comprimento_metros: dimComprimentoMetros,
      diametro_externo_mm: dimDiametroExt,
      parede_mm: dimParede,
      diametro_barra_mm: dimDiametroBarra,
      peso_unitario_manual: pesoManual !== null && pesoManual > 0 ? pesoManual : undefined,
      quantidade: formQtdPecas
    };

    const res = calcularPesoTeorico(params, materiaisDensidadeMap);
    return res;
  }, [
    formGeometria, 
    formMaterialKey, 
    dimEspessura, 
    dimLargura, 
    dimComprimentoMm, 
    dimComprimentoMetros, 
    dimDiametroExt, 
    dimParede, 
    dimDiametroBarra, 
    pesoManual,
    formQtdPecas,
    materiaisDensidadeMap
  ]);

  // Abrir Modal para Criar Novo Produto / Item
  const handleNovoItem = () => {
    setItemEmEdicaoId(null);
    setFormCodigo(`TB-${Date.now().toString().slice(-4)}`);
    setFormDescricao('');
    setFormNcm('73064000');
    setFormCategoria('Tubos Inox');
    setFormUnidade('M');
    setFormPrecoVenda(50.0);
    setFormMaterialKey('INOX_304');
    setFormGeometria('TUBO_REDONDO');
    setFormOrigem('BARRA_INTEIRA');
    setFormQtdPecas(10);
    setDimDiametroExt(25.4);
    setDimParede(1.5);
    setDimComprimentoMetros(6.0);
    setFormLocalizacao('Rua A - Prateleira Tubos Inox');
    setFormObs('');
    setPesoManual(null);
    setModalAberto(true);
  };

  // Abrir Modal para Editar
  const handleEditarItem = (item: ItemEstoqueDimensional) => {
    setItemEmEdicaoId(item.id);
    setFormCodigo(item.codigo);
    setFormDescricao(item.descricao);
    setFormNcm(item.ncm || '');
    setFormCategoria(item.categoria || 'Tubos Inox');
    setFormUnidade(item.unidade_medida || 'PÇ');
    setFormPrecoVenda(item.preco_venda_padrao || 0);
    setFormMaterialKey(item.material_id);
    setFormGeometria(item.geometria);
    setFormOrigem(item.tipo_origem);
    setFormQtdPecas(item.quantidade_pecas);
    setFormLocalizacao(item.localizacao_galpao || '');
    setFormObs(item.observacoes || '');
    setDimEspessura(item.espessura_mm || 1.5);
    setDimLargura(item.largura_mm || 1000);
    setDimComprimentoMm(item.comprimento_mm || 2000);
    setDimComprimentoMetros(item.comprimento_metros || 2.0);
    setDimDiametroExt(item.diametro_externo_mm || 25.4);
    setDimParede(item.parede_mm || 1.5);
    setDimDiametroBarra(item.diametro_barra_mm || 25.4);
    setPesoManual(item.peso_unitario_kg);
    setModalAberto(true);
  };

  // Salvar Item (Unificado: Comercial + Estoque)
  const handleSalvarItem = (e: React.FormEvent) => {
    e.preventDefault();
    const matInfo = MATERIAIS_DENSIDADE[formMaterialKey] || MATERIAIS_DENSIDADE.INOX_304;
    const unitKg = pesoManual !== null && pesoManual > 0 ? pesoManual : pesoCalculadoAoVivo.pesoUnitarioKg;
    const totalKg = Number((unitKg * formQtdPecas).toFixed(2));
    const metrosTotal = (formGeometria === 'TUBO_REDONDO' || formGeometria === 'TUBO_QUADRADO' || formGeometria === 'BARRA_REDONDA' || formGeometria === 'PERFIL_VIGA')
      ? Number(((dimComprimentoMetros || 0) * formQtdPecas).toFixed(2))
      : undefined;

    const itemSalvar: ItemEstoqueDimensional = {
      id: itemEmEdicaoId || `est-${Date.now()}`,
      codigo: formCodigo.trim().toUpperCase(),
      descricao: formDescricao.trim().toUpperCase(),
      ncm: formNcm.trim(),
      categoria: formCategoria,
      unidade_medida: formUnidade.toUpperCase(),
      preco_venda_padrao: formPrecoVenda,
      material_id: formMaterialKey,
      material_nome: matInfo.nome,
      geometria: formGeometria,
      espessura_mm: dimEspessura,
      largura_mm: dimLargura,
      comprimento_mm: dimComprimentoMm,
      comprimento_metros: dimComprimentoMetros,
      diametro_externo_mm: dimDiametroExt,
      parede_mm: dimParede,
      diametro_barra_mm: dimDiametroBarra,
      quantidade_pecas: formQtdPecas,
      metros_totais: metrosTotal,
      peso_unitario_kg: unitKg,
      peso_total_kg: totalKg,
      tipo_origem: formOrigem,
      localizacao_galpao: formLocalizacao,
      data_entrada: new Date().toISOString().split('T')[0],
      observacoes: formObs
    };

    StorageService.saveItemEstoqueDimensional(itemSalvar);
    loadData();
    setModalAberto(false);
    exibirToast(itemEmEdicaoId ? 'Produto e estoque atualizados!' : 'Novo produto cadastrado no estoque!');
  };

  // Excluir Item
  const handleExcluirItem = (id: string) => {
    if (confirm('Deseja realmente remover este produto/item do estoque?')) {
      StorageService.deleteItemEstoqueDimensional(id);
      loadData();
      exibirToast('Item removido do estoque.');
    }
  };

  // Abrir Modal de Corte
  const handleAbrirCorte = (item: ItemEstoqueDimensional) => {
    setItemParaCorte(item);
    setMedidaCortada(item.comprimento_metros ? Math.min(item.comprimento_metros / 2, 2) : 1);
    setModalCorteAberto(true);
  };

  // Confirmar Corte
  const handleConfirmarCorte = () => {
    if (!itemParaCorte || medidaCortada <= 0) return;

    if (itemParaCorte.comprimento_metros && medidaCortada >= itemParaCorte.comprimento_metros) {
      alert('A medida cortada não pode ser maior ou igual ao comprimento atual da barra!');
      return;
    }

    const sobraMetros = Number(((itemParaCorte.comprimento_metros || 0) - medidaCortada).toFixed(2));
    const pesoPorMetro = (itemParaCorte.peso_unitario_kg || 1) / (itemParaCorte.comprimento_metros || 1);
    const pesoSobraKg = Number((sobraMetros * pesoPorMetro).toFixed(2));

    const itemAtualizado: ItemEstoqueDimensional = {
      ...itemParaCorte,
      descricao: `${itemParaCorte.descricao.replace(/ - Sobra.*/, '')} - Sobra ${sobraMetros}m`,
      comprimento_metros: sobraMetros,
      metros_totais: sobraMetros,
      peso_unitario_kg: pesoSobraKg,
      peso_total_kg: pesoSobraKg,
      tipo_origem: 'SOBRA_CORTE',
      observacoes: `Corte de ${medidaCortada}m realizado em ${new Date().toLocaleDateString('pt-BR')}. Sobrou ${sobraMetros}m (${pesoSobraKg} kg).`
    };

    StorageService.saveItemEstoqueDimensional(itemAtualizado);
    loadData();
    setModalCorteAberto(false);
    exibirToast(`Corte registrado! Estoque atualizado para sobra de ${sobraMetros}m (${pesoSobraKg} kg).`);
  };

  // Itens Filtrados
  const itensFiltrados = useMemo(() => {
    return estoque.filter(item => {
      const matchMaterial = filtroMaterial === 'TODOS' || item.material_id === filtroMaterial;
      const matchCategoria = filtroCategoria === 'TODAS' || item.categoria === filtroCategoria;
      const matchOrigem = filtroOrigem === 'TODOS' || item.tipo_origem === filtroOrigem;
      const term = termoBusca.toLowerCase().trim();
      const matchBusca = !term || 
        item.codigo.toLowerCase().includes(term) ||
        item.descricao.toLowerCase().includes(term) ||
        (item.ncm && item.ncm.includes(term)) ||
        (item.categoria && item.categoria.toLowerCase().includes(term)) ||
        item.material_nome.toLowerCase().includes(term) ||
        (item.localizacao_galpao && item.localizacao_galpao.toLowerCase().includes(term));

      return matchMaterial && matchCategoria && matchOrigem && matchBusca;
    });
  }, [estoque, filtroMaterial, filtroCategoria, filtroOrigem, termoBusca]);

  // Estatísticas Globais
  const estatisticas = useMemo(() => {
    let pesoTotal = 0;
    let metrosTotais = 0;
    let pecasTotais = 0;
    let valorTotalEstoque = 0;
    const porMaterial: Record<string, { nome: string; pecas: number; metros: number; pesoKg: number }> = {};
    const categoriasSet = new Set<string>();

    estoque.forEach(item => {
      pesoTotal += item.peso_total_kg || 0;
      pecasTotais += item.quantidade_pecas || 0;
      if (item.metros_totais) metrosTotais += item.metros_totais;
      if (item.preco_venda_padrao) valorTotalEstoque += item.preco_venda_padrao * item.quantidade_pecas;
      if (item.categoria) categoriasSet.add(item.categoria);

      if (!porMaterial[item.material_id]) {
        porMaterial[item.material_id] = {
          nome: item.material_nome,
          pecas: 0,
          metros: 0,
          pesoKg: 0
        };
      }
      porMaterial[item.material_id].pecas += item.quantidade_pecas || 0;
      porMaterial[item.material_id].metros += item.metros_totais || 0;
      porMaterial[item.material_id].pesoKg += item.peso_total_kg || 0;
    });

    return {
      pesoTotal: Number(pesoTotal.toFixed(2)),
      metrosTotais: Number(metrosTotais.toFixed(2)),
      valorTotalEstoque: Number(valorTotalEstoque.toFixed(2)),
      pecasTotais,
      materiaisCount: Object.keys(porMaterial).length,
      categoriasDisponiveis: Array.from(categoriasSet),
      porMaterial
    };
  }, [estoque]);

  return (
    <div className="space-y-6 w-full pb-16">
      
      {/* TOAST FLUTUANTE */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 font-bold text-xs animate-in fade-in slide-in-from-top-4">
          <Check className="w-5 h-5 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* CABEÇALHO UNIFICADO */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#e6f7f2] text-[#10b981] flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <span>Estoque Físico & Produtos</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestão integrada de catálogo, preços de venda, tubos, conexões, chapas e sobras de corte com cálculo de peso por liga
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/configuracoes"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition"
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Configurar Ligas & Formatos</span>
          </Link>

          <button
            onClick={handleNovoItem}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>+ Novo Produto / Sobra de Corte</span>
          </button>
        </div>
      </div>

      {/* CARDS DE INDICADORES (KPIS GERAIS) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* PESO TOTAL DO ESTOQUE */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Peso Total em Estoque</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {estatisticas.pesoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} <span className="text-sm font-semibold text-slate-500">KG</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
            Massa metálica & polímeros
          </span>
        </div>

        {/* METRAGEM LINEAR TOTAL */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Metragem Linear (Tubos/Barras)</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {estatisticas.metrosTotais.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} <span className="text-sm font-semibold text-slate-500">metros</span>
          </div>
          <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded-full inline-block">
            Soma de varas e retalhos
          </span>
        </div>

        {/* VALOR ESTIMADO DO ESTOQUE */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Valor em Estoque (Venda)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">
            {estatisticas.valorTotalEstoque.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-100/60 px-2 py-0.5 rounded-full inline-block">
            Tabela de preços Brasfortal
          </span>
        </div>

        {/* TOTAL DE PEÇAS & SOBRAS */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Peças & Conexões Físicas</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Box className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {estatisticas.pecasTotais} <span className="text-sm font-semibold text-slate-500">peças</span>
          </div>
          <span className="text-[10px] text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded-full inline-block">
            {estoque.filter(i => i.tipo_origem === 'SOBRA_CORTE' || i.tipo_origem === 'RETALHO').length} sobras de corte
          </span>
        </div>

      </div>

      {/* FILTROS RÁPIDOS POR MATERIAL COM PESO TOTAL ACUMULADO */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>Listar Estoque por Material:</span>
          </span>
          <span className="text-[11px] text-slate-400 font-medium">Clique para filtrar e ver os pesos por liga</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* BOTÃO TODOS */}
          <button
            onClick={() => setFiltroMaterial('TODOS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              filtroMaterial === 'TODOS'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>Todos os Materiais</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              filtroMaterial === 'TODOS' ? 'bg-slate-700 text-emerald-300' : 'bg-slate-200 text-slate-700'
            }`}>
              {estatisticas.pesoTotal} kg
            </span>
          </button>

          {/* BOTÕES DE CADA MATERIAL */}
          {Object.entries(MATERIAIS_DENSIDADE).map(([key, mat]) => {
            const dadosMat = estatisticas.porMaterial[key];
            const pesoMat = dadosMat ? dadosMat.pesoKg.toFixed(2) : '0';
            const pecasMat = dadosMat ? dadosMat.pecas : 0;
            const isSelected = filtroMaterial === key;

            return (
              <button
                key={key}
                onClick={() => setFiltroMaterial(key)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/80 text-emerald-900 shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{mat.nome.replace('Aço ', '').replace('AISI ', '')}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  isSelected 
                    ? 'bg-emerald-600 text-white' 
                    : (pecasMat > 0 ? 'bg-slate-100 text-slate-800' : 'bg-slate-50 text-slate-400')
                }`}>
                  {pesoMat} kg ({pecasMat} pçs)
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* BARRA DE PESQUISA E FILTROS DE CATEGORIA / ORIGEM */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[280px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            placeholder="Buscar por código, descrição, NCM ou localização..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* FILTRO DE CATEGORIA */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium">Categoria:</span>
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="p-2 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="TODAS">Todas as Categorias</option>
              {estatisticas.categoriasDisponiveis.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* FILTRO DE ORIGEM / FORMATO */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium">Origem:</span>
            <select
              value={filtroOrigem}
              onChange={(e) => setFiltroOrigem(e.target.value)}
              className="p-2 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="TODOS">Todas as Peças & Sobras</option>
              <option value="BARRA_INTEIRA">Barras Inteiras (Padrão 6m)</option>
              <option value="SOBRA_CORTE">Sobras de Corte / Retalhos</option>
              <option value="CHAPA_INTEIRA">Chapas Inteiras</option>
              <option value="RETALHO">Retalhos de Chapas</option>
              <option value="PECA_PRONTA">Peças Prontas / Conexões</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABELA DE ESTOQUE DIMENSIONAL E PRODUTOS */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <span>Catálogo & Dimensões em Estoque</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
              {itensFiltrados.length} itens encontrados
            </span>
          </h3>

          <div className="text-xs font-bold text-slate-600">
            Peso Filtrado: <strong className="text-emerald-700 font-black">{
              itensFiltrados.reduce((acc, curr) => acc + (curr.peso_total_kg || 0), 0).toFixed(2)
            } KG</strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[10px] font-black uppercase text-slate-400">
                <th className="p-3">Código & Descrição</th>
                <th className="p-3">Material / Liga</th>
                <th className="p-3">NCM & Categoria</th>
                <th className="p-3">Dimensões / Geometria</th>
                <th className="p-3 text-center">Estoque (Pçs)</th>
                <th className="p-3 text-center">Metros</th>
                <th className="p-3 text-right">Preço Venda</th>
                <th className="p-3 text-center">Peso Unit.</th>
                <th className="p-3 text-center">Peso Total</th>
                <th className="p-3">Classificação / Local</th>
                <th className="p-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {itensFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-slate-400">
                    Nenhum produto ou sobra encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                itensFiltrados.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* CÓDIGO E DESCRIÇÃO */}
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{item.descricao}</div>
                      <span className="font-mono text-[10px] font-bold text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                        {item.codigo}
                      </span>
                    </td>

                    {/* MATERIAL */}
                    <td className="p-3">
                      <span className="font-semibold text-slate-800 block">{item.material_nome}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {MATERIAIS_DENSIDADE[item.material_id]?.densidade_g_cm3 || 7.93} g/cm³
                      </span>
                    </td>

                    {/* NCM E CATEGORIA */}
                    <td className="p-3">
                      <span className="font-bold text-slate-700 block">{item.categoria || 'Geral'}</span>
                      <span className="font-mono text-[10px] text-slate-400">
                        NCM: {item.ncm || '-'}
                      </span>
                    </td>

                    {/* DIMENSÕES FÍSICAS */}
                    <td className="p-3">
                      <div className="font-bold text-slate-800">
                        {item.geometria === 'TUBO_REDONDO' && (
                          <span>OD {item.diametro_externo_mm}mm × {item.parede_mm}mm × <strong className="text-emerald-700">{item.comprimento_metros}m</strong></span>
                        )}
                        {item.geometria === 'TUBO_QUADRADO' && (
                          <span>Tubo {item.largura_mm}×{item.largura_mm} × {item.parede_mm}mm × <strong className="text-emerald-700">{item.comprimento_metros}m</strong></span>
                        )}
                        {item.geometria === 'BARRA_REDONDA' && (
                          <span>Barra Ø {item.diametro_barra_mm}mm × <strong className="text-emerald-700">{item.comprimento_metros}m</strong></span>
                        )}
                        {item.geometria === 'CHAPA' && (
                          <span>{item.espessura_mm}mm × {item.largura_mm}mm × {item.comprimento_mm}mm</span>
                        )}
                        {item.geometria === 'PERFIL_VIGA' && (
                          <span>Viga {item.comprimento_metros || 6}m</span>
                        )}
                        {item.geometria === 'CONEXAO_ACESSORIO' && (
                          <span className="text-slate-500 font-normal">Peça Pronta Padronizada</span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        {item.geometria.replace('_', ' ')}
                      </span>
                    </td>

                    {/* ESTOQUE EM PEÇAS */}
                    <td className="p-3 text-center">
                      <span className="font-black text-slate-900 text-sm">{item.quantidade_pecas}</span>
                      <span className="text-[10px] text-slate-400 block font-semibold">{item.unidade_medida || 'PÇ'}</span>
                    </td>

                    {/* METROS TOTAIS */}
                    <td className="p-3 text-center font-bold text-slate-700">
                      {item.metros_totais ? `${item.metros_totais} m` : '-'}
                    </td>

                    {/* PREÇO DE VENDA */}
                    <td className="p-3 text-right">
                      <span className="font-black text-slate-900 block">
                        {(item.preco_venda_padrao || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                      <span className="text-[10px] text-slate-400">/ {item.unidade_medida || 'PÇ'}</span>
                    </td>

                    {/* PESO UNITÁRIO */}
                    <td className="p-3 text-center font-bold text-slate-700">
                      {item.peso_unitario_kg} kg
                    </td>

                    {/* PESO TOTAL EM KG */}
                    <td className="p-3 text-center">
                      <span className="font-black text-sm text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200/80 inline-block">
                        {item.peso_total_kg} kg
                      </span>
                    </td>

                    {/* TIPO ORIGEM & LOCALIZAÇÃO */}
                    <td className="p-3">
                      <div>
                        {item.tipo_origem === 'SOBRA_CORTE' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                            Sobra de Corte
                          </span>
                        )}
                        {item.tipo_origem === 'RETALHO' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-800 border border-orange-200">
                            Retalho de Chapa
                          </span>
                        )}
                        {item.tipo_origem === 'BARRA_INTEIRA' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Barra Inteira
                          </span>
                        )}
                        {item.tipo_origem === 'CHAPA_INTEIRA' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                            Chapa Padrão
                          </span>
                        )}
                        {item.tipo_origem === 'PECA_PRONTA' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                            Peça Pronta
                          </span>
                        )}
                      </div>
                      {item.localizacao_galpao && (
                        <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-1 font-medium">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{item.localizacao_galpao}</span>
                        </span>
                      )}
                    </td>

                    {/* AÇÕES */}
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {item.comprimento_metros && item.comprimento_metros > 0 && (
                          <button
                            type="button"
                            onClick={() => handleAbrirCorte(item)}
                            title="Registrar Corte nesta Barra/Tubo"
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                          >
                            <Scissors className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleEditarItem(item)}
                          title="Editar"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleExcluirItem(item.id)}
                          title="Excluir"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* ========================================================== */}
      {/* DRAWER LATERAL DIREITO DE CADASTRO / EDIÇÃO DE ESTOQUE */}
      {/* ========================================================== */}
      
      {/* Fundo escurecido / Backdrop */}
      <div 
        onClick={() => setModalAberto(false)}
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 transition-opacity duration-300 ${
          modalAberto ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Painel Deslizante Lateral (Drawer - 50% de largura no Desktop) */}
      <aside
        className={`fixed top-0 bottom-0 right-0 z-50 w-full sm:max-w-xl md:w-1/2 lg:w-1/2 bg-white shadow-2xl border-l border-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out ${
          modalAberto ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Cabeçalho do Drawer Clean Moderno */}
        <div className="h-20 px-6 sm:px-8 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#e6f7f2] flex items-center justify-center text-[#10b981] font-bold">
              {itemEmEdicaoId ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 tracking-tight flex items-center gap-2">
                <span>{itemEmEdicaoId ? 'Editar Produto / Sobra' : 'Novo Produto & Estoque'}</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {formOrigem === 'PECA_PRONTA' ? 'Peça Pronta' : formGeometria.replace('_', ' ')}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Preencha os dados comerciais, dimensões e controle de estoque</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setModalAberto(false)}
            className="w-9 h-9 rounded-2xl border border-slate-200/80 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulário com Scroll Interno e Rodapé Fixo */}
        <form onSubmit={handleSalvarItem} className="flex-1 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5 bg-white">
              
              {/* TIPO DE ORIGEM / CLASSIFICAÇÃO */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Classificação do Item:</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'BARRA_INTEIRA', label: 'Barra Inteira (6m)' },
                    { id: 'SOBRA_CORTE', label: 'Sobra de Corte' },
                    { id: 'CHAPA_INTEIRA', label: 'Chapa Padrão' },
                    { id: 'RETALHO', label: 'Retalho de Chapa' },
                    { id: 'PECA_PRONTA', label: 'Peça Pronta / Conexão' }
                  ].map((origem) => (
                    <button
                      key={origem.id}
                      type="button"
                      onClick={() => setFormOrigem(origem.id as TipoOrigemEstoque)}
                      className={`py-2 px-2 text-[11px] font-bold rounded-xl border text-center transition-all ${
                        formOrigem === origem.id
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-2xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {origem.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* DADOS CADASTRAIS COMERCIAIS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Código do Produto *</label>
                  <input
                    type="text"
                    required
                    value={formCodigo}
                    onChange={(e) => setFormCodigo(e.target.value.toUpperCase())}
                    placeholder="Ex: TB-304-1 ou CX-90-2"
                    className="w-full p-2 text-xs font-bold rounded-lg border border-slate-200 bg-white uppercase"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Descrição Comercial Completa *</label>
                  <input
                    type="text"
                    required
                    value={formDescricao}
                    onChange={(e) => setFormDescricao(e.target.value)}
                    placeholder="Ex: COTOVELO 90º 2 150 LBS BSP INOX 304"
                    className="w-full p-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              </div>

              {/* NCM, CATEGORIA, UNIDADE E PREÇO DE VENDA */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">NCM Fiscal</label>
                  <input
                    type="text"
                    value={formNcm}
                    onChange={(e) => setFormNcm(e.target.value)}
                    placeholder="Ex: 73072900"
                    className="w-full p-1.5 text-xs font-mono rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">Categoria</label>
                  <select
                    value={formCategoria}
                    onChange={(e) => setFormCategoria(e.target.value)}
                    className="w-full p-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Tubos Inox">Tubos Inox</option>
                    <option value="Conexões Inox">Conexões Inox</option>
                    <option value="Placas & Chapas">Placas & Chapas</option>
                    <option value="Vigas Estruturais">Vigas Estruturais</option>
                    <option value="Flanges">Flanges</option>
                    <option value="Outros Metais">Outros Metais</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">Unidade</label>
                  <input
                    type="text"
                    value={formUnidade}
                    onChange={(e) => setFormUnidade(e.target.value.toUpperCase())}
                    placeholder="PÇ / M / BR / KG"
                    className="w-full p-1.5 text-xs font-bold text-center rounded-lg border border-slate-300 bg-white uppercase"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">Preço Venda (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formPrecoVenda || ''}
                    onChange={(e) => setFormPrecoVenda(parseFloat(e.target.value) || 0)}
                    placeholder="Ex: 64.80"
                    className="w-full p-1.5 text-xs font-black text-slate-900 rounded-lg border border-slate-300 bg-white text-right"
                  />
                </div>
              </div>

              {/* FORMATO GEOMÉTRICO */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Formato Geométrico / Engenharia:</label>
                  <Link 
                    href="/configuracoes" 
                    target="_blank" 
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
                  >
                    <Settings className="w-3 h-3" />
                    <span>Configurar Formatos</span>
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                  {(formatosConfig.length > 0 ? formatosConfig.filter(f => f.ativo) : [
                    { id: 'TUBO_REDONDO', label: 'Tubo Redondo' },
                    { id: 'TUBO_QUADRADO', label: 'Tubo Quadrado' },
                    { id: 'BARRA_REDONDA', label: 'Barra Redonda' },
                    { id: 'CHAPA', label: 'Chapa / Placa' },
                    { id: 'PERFIL_VIGA', label: 'Viga / Perfil' },
                    { id: 'CONEXAO_ACESSORIO', label: 'Peça Pronta' }
                  ]).map((geo) => (
                    <button
                      key={geo.id}
                      type="button"
                      onClick={() => setFormGeometria(geo.id as GeometriaTipo)}
                      className={`py-2 px-1 text-[11px] font-bold rounded-xl border text-center transition-all ${
                        formGeometria === geo.id
                          ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-2xs font-extrabold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {geo.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* MATERIAL & DENSIDADE */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Material & Liga (Densidade Metalúrgica):</label>
                  <Link 
                    href="/configuracoes" 
                    target="_blank" 
                    className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 hover:underline"
                  >
                    <Settings className="w-3 h-3" />
                    <span>Configurar Ligas</span>
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select
                    value={formMaterialKey}
                    onChange={(e) => setFormMaterialKey(e.target.value)}
                    className="p-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-emerald-500"
                  >
                    {(materiaisConfig.length > 0 ? materiaisConfig.filter(m => m.ativo) : Object.values(MATERIAIS_DENSIDADE)).map((mat) => (
                      <option key={mat.id} value={mat.id}>
                        {mat.nome} ({mat.densidade_g_cm3.toFixed(2)} g/cm³)
                      </option>
                    ))}
                  </select>

                  <div className="bg-slate-50 rounded-xl border border-slate-200/80 p-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Densidade Base:</span>
                    <span className="font-extrabold text-slate-900 font-mono">
                      {(materiaisDensidadeMap[formMaterialKey]?.densidade_g_cm3 || MATERIAIS_DENSIDADE[formMaterialKey]?.densidade_g_cm3 || 7.93).toFixed(2)} g/cm³
                    </span>
                  </div>
                </div>
              </div>

              {/* DIMENSÕES FÍSICAS QUANDO APLICÁVEL */}
              {formGeometria !== 'CONEXAO_ACESSORIO' && (
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Dimensões Físicas da Peça / Perfil
                  </h4>

                  {/* SE TUBO REDONDO */}
                  {formGeometria === 'TUBO_REDONDO' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Diâmetro Ext. OD (mm):</label>
                        <input
                          type="number"
                          step="any"
                          value={dimDiametroExt || ''}
                          onChange={(e) => setDimDiametroExt(parseFloat(e.target.value) || 0)}
                          placeholder="Ex: 25.4"
                          className="w-full p-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Parede (mm):</label>
                        <input
                          type="number"
                          step="any"
                          value={dimParede || ''}
                          onChange={(e) => setDimParede(parseFloat(e.target.value) || 0)}
                          placeholder="Ex: 1.5"
                          className="w-full p-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Comprimento (metros):</label>
                        <input
                          type="number"
                          step="any"
                          value={dimComprimentoMetros || ''}
                          onChange={(e) => setDimComprimentoMetros(parseFloat(e.target.value) || 0)}
                          placeholder="Ex: 6"
                          className="w-full p-2 text-xs font-bold text-emerald-800 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* SE TUBO QUADRADO */}
                  {formGeometria === 'TUBO_QUADRADO' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Lado A (mm):</label>
                        <input
                          type="number"
                          step="any"
                          value={dimLargura || ''}
                          onChange={(e) => setDimLargura(parseFloat(e.target.value) || 0)}
                          placeholder="Ex: 50"
                          className="w-full p-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Parede (mm):</label>
                        <input
                          type="number"
                          step="any"
                          value={dimParede || ''}
                          onChange={(e) => setDimParede(parseFloat(e.target.value) || 0)}
                          placeholder="Ex: 2.0"
                          className="w-full p-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Comprimento (m):</label>
                        <input
                          type="number"
                          step="any"
                          value={dimComprimentoMetros || ''}
                          onChange={(e) => setDimComprimentoMetros(parseFloat(e.target.value) || 0)}
                          placeholder="Ex: 6"
                          className="w-full p-2 text-xs font-bold text-emerald-800 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* SE BARRA REDONDA */}
                  {formGeometria === 'BARRA_REDONDA' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Diâmetro Ø (mm):</label>
                        <input
                          type="number"
                          step="any"
                          value={dimDiametroBarra || ''}
                          onChange={(e) => setDimDiametroBarra(parseFloat(e.target.value) || 0)}
                          placeholder="Ex: 25.4"
                          className="w-full p-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Comprimento (m):</label>
                        <input
                          type="number"
                          step="any"
                          value={dimComprimentoMetros || ''}
                          onChange={(e) => setDimComprimentoMetros(parseFloat(e.target.value) || 0)}
                          placeholder="Ex: 3 ou 6"
                          className="w-full p-2 text-xs font-bold text-emerald-800 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* SE CHAPA / PLACA */}
                  {formGeometria === 'CHAPA' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Espessura (mm):</label>
                        <input
                          type="number"
                          step="any"
                          value={dimEspessura || ''}
                          onChange={(e) => setDimEspessura(parseFloat(e.target.value) || 0)}
                          placeholder="Ex: 4"
                          className="w-full p-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Largura (mm):</label>
                        <input
                          type="number"
                          step="any"
                          value={dimLargura || ''}
                          onChange={(e) => setDimLargura(parseFloat(e.target.value) || 0)}
                          placeholder="Ex: 1000"
                          className="w-full p-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Comprimento (mm):</label>
                        <input
                          type="number"
                          step="any"
                          value={dimComprimentoMm || ''}
                          onChange={(e) => setDimComprimentoMm(parseFloat(e.target.value) || 0)}
                          placeholder="Ex: 2000"
                          className="w-full p-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* SE VIGA */}
                  {formGeometria === 'PERFIL_VIGA' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Comprimento da Viga (metros):</label>
                        <input
                          type="number"
                          step="any"
                          value={dimComprimentoMetros || ''}
                          onChange={(e) => setDimComprimentoMetros(parseFloat(e.target.value) || 0)}
                          placeholder="Ex: 6"
                          className="w-full p-2 text-xs font-bold text-emerald-800 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* QUANTIDADE E LOCALIZAÇÃO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Quantidade em Estoque (Físico):</label>
                  <input
                    type="number"
                    min="1"
                    value={formQtdPecas || 1}
                    onChange={(e) => setFormQtdPecas(parseInt(e.target.value) || 1)}
                    className="w-full p-2 text-xs font-bold text-center rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Localização no Galpão:</label>
                  <input
                    type="text"
                    value={formLocalizacao}
                    onChange={(e) => setFormLocalizacao(e.target.value)}
                    placeholder="Ex: Rua A, Cavalete 2, Gaveteiro 12..."
                    className="w-full p-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              </div>

              {/* CARD DE PESO CALCULADO / PESO MANUAL */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-4 text-white shadow-md space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-emerald-100 text-[10px] font-bold uppercase tracking-wider block">
                      Peso Unitário (kg / peça)
                    </span>
                    <div className="text-2xl font-black">
                      {pesoManual !== null && pesoManual > 0 ? pesoManual : pesoCalculadoAoVivo.pesoUnitarioKg} <span className="text-xs font-normal">kg</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-emerald-100 text-[10px] font-bold uppercase tracking-wider block">
                      Peso Total em Estoque ({formQtdPecas} pçs)
                    </span>
                    <div className="text-3xl font-black text-amber-200">
                      {Number(((pesoManual !== null && pesoManual > 0 ? pesoManual : pesoCalculadoAoVivo.pesoUnitarioKg) * formQtdPecas).toFixed(2))} <span className="text-base text-white">kg</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/20 text-[10px] text-emerald-100 flex items-center justify-between">
                  <span className="font-mono truncate">{pesoCalculadoAoVivo.formulaExplicativa}</span>
                  <div className="flex items-center gap-1.5 ml-2 shrink-0">
                    <span className="text-white/80">Peso de balança/norma?</span>
                    <input
                      type="number"
                      step="0.01"
                      value={pesoManual !== null ? pesoManual : ''}
                      onChange={(e) => setPesoManual(parseFloat(e.target.value) || null)}
                      placeholder="Kg real"
                      className="w-20 p-1 text-[11px] font-bold text-slate-900 rounded bg-white text-center"
                    />
                  </div>
                </div>
              </div>

          </div>

          {/* Rodapé Fixo */}
          <div className="p-4 px-6 sm:px-8 border-t border-slate-100 bg-white flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setModalAberto(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02]"
            >
              <Check className="w-4 h-4" />
              <span>{itemEmEdicaoId ? 'Salvar Alterações' : 'Cadastrar no Estoque'}</span>
            </button>
          </div>

        </form>
      </aside>

      {/* ========================================================== */}
      {/* MODAL DE CORTE SOB MEDIDA */}
      {/* ========================================================== */}
      {modalCorteAberto && itemParaCorte && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200/90 shadow-2xl overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Scissors className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Registrar Corte sob Medida</h3>
                  <span className="text-[10px] text-slate-400 font-medium">Atualiza o comprimento e peso da sobra restante</span>
                </div>
              </div>
              <button onClick={() => setModalCorteAberto(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl space-y-1 text-xs">
              <span className="font-bold text-slate-800 block">{itemParaCorte.descricao}</span>
              <div className="flex items-center justify-between text-slate-600">
                <span>Comprimento Atual: <strong>{itemParaCorte.comprimento_metros} metros</strong></span>
                <span>Peso Atual: <strong>{itemParaCorte.peso_unitario_kg} kg</strong></span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Metragem a Cortar / Vendida (metros):</label>
              <input
                type="number"
                step="0.01"
                min="0.1"
                max={(itemParaCorte.comprimento_metros || 1) - 0.01}
                value={medidaCortada || ''}
                onChange={(e) => setMedidaCortada(parseFloat(e.target.value) || 0)}
                className="w-full p-2.5 text-sm font-black text-center border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* PREVIEW DA SOBRA */}
            {medidaCortada > 0 && itemParaCorte.comprimento_metros && medidaCortada < itemParaCorte.comprimento_metros && (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs space-y-1">
                <span className="font-bold text-emerald-900 block">Resultado no Estoque:</span>
                <div className="flex items-center justify-between text-emerald-800">
                  <span>Sobra restante: <strong>{(itemParaCorte.comprimento_metros - medidaCortada).toFixed(2)} metros</strong></span>
                  <span>
                    Novo peso: <strong>{
                      (((itemParaCorte.comprimento_metros - medidaCortada) * (itemParaCorte.peso_unitario_kg / itemParaCorte.comprimento_metros))).toFixed(2)
                    } kg</strong>
                  </span>
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalCorteAberto(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmarCorte}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition"
              >
                Salvar Sobra de Corte
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
