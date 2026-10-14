'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  Info
} from 'lucide-react';
import { ItemEstoqueDimensional, TipoOrigemEstoque } from '@/lib/types';
import { StorageService } from '@/lib/storage';
import { 
  MATERIAIS_DENSIDADE, 
  calcularPesoTeorico, 
  ParametrosCalculoPeso, 
  GeometriaTipo 
} from '@/lib/weightCalculator';

export default function EstoqueDimensionalPage() {
  const [estoque, setEstoque] = useState<ItemEstoqueDimensional[]>([]);
  const [filtroMaterial, setFiltroMaterial] = useState<string>('TODOS');
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

  // Form State do Item de Estoque
  const [formCodigo, setFormCodigo] = useState('');
  const [formDescricao, setFormDescricao] = useState('');
  const [formMaterialKey, setFormMaterialKey] = useState('INOX_304');
  const [formGeometria, setFormGeometria] = useState<GeometriaTipo>('TUBO_REDONDO');
  const [formOrigem, setFormOrigem] = useState<TipoOrigemEstoque>('SOBRA_CORTE');
  const [formQtdPecas, setFormQtdPecas] = useState<number>(1);
  const [formLocalizacao, setFormLocalizacao] = useState('Cavalete 2 - Sobras & Retalhos');
  const [formObs, setFormObs] = useState('');

  // Dimensões
  const [dimEspessura, setDimEspessura] = useState<number>(1.5);
  const [dimLargura, setDimLargura] = useState<number>(1000);
  const [dimComprimentoMm, setDimComprimentoMm] = useState<number>(2000);
  const [dimComprimentoMetros, setDimComprimentoMetros] = useState<number>(2.0);
  const [dimDiametroExt, setDimDiametroExt] = useState<number>(25.4);
  const [dimParede, setDimParede] = useState<number>(1.5);
  const [dimDiametroBarra, setDimDiametroBarra] = useState<number>(25.4);
  const [pesoManual, setPesoManual] = useState<number | null>(null);

  // Carregar dados
  const loadData = () => {
    const list = StorageService.getEstoqueDimensional();
    setEstoque(list);
  };

  useEffect(() => {
    loadData();
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
      quantidade: formQtdPecas
    };

    const res = calcularPesoTeorico(params);
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
    formQtdPecas
  ]);

  // Abrir Modal de Novo Cadastro
  const handleNovoItem = () => {
    setItemEmEdicaoId(null);
    setFormCodigo(`RET-${Date.now().toString().slice(-4)}`);
    setFormDescricao('Sobra de Barra / Retalho de Corte');
    setFormMaterialKey('INOX_304');
    setFormGeometria('TUBO_REDONDO');
    setFormOrigem('SOBRA_CORTE');
    setFormQtdPecas(1);
    setDimDiametroExt(25.4);
    setDimParede(1.5);
    setDimComprimentoMetros(2.0);
    setFormLocalizacao('Cavalete 2 - Sobras & Retalhos');
    setFormObs('');
    setPesoManual(null);
    setModalAberto(true);
  };

  // Abrir Modal de Edição
  const handleEditarItem = (item: ItemEstoqueDimensional) => {
    setItemEmEdicaoId(item.id);
    setFormCodigo(item.codigo);
    setFormDescricao(item.descricao);
    setFormMaterialKey(item.material_id);
    setFormGeometria(item.geometria === 'PERFIL_VIGA' ? 'TUBO_QUADRADO' : item.geometria);
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

  // Salvar Item
  const handleSalvarItem = (e: React.FormEvent) => {
    e.preventDefault();
    const matInfo = MATERIAIS_DENSIDADE[formMaterialKey] || MATERIAIS_DENSIDADE.INOX_304;
    const unitKg = pesoManual !== null && pesoManual > 0 ? pesoManual : pesoCalculadoAoVivo.pesoUnitarioKg;
    const totalKg = Number((unitKg * formQtdPecas).toFixed(2));
    const metrosTotal = (formGeometria === 'TUBO_REDONDO' || formGeometria === 'TUBO_QUADRADO' || formGeometria === 'BARRA_REDONDA')
      ? Number(((dimComprimentoMetros || 0) * formQtdPecas).toFixed(2))
      : undefined;

    const itemSalvar: ItemEstoqueDimensional = {
      id: itemEmEdicaoId || `est-${Date.now()}`,
      codigo: formCodigo.trim().toUpperCase(),
      descricao: formDescricao.trim().toUpperCase(),
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
    exibirToast(itemEmEdicaoId ? 'Item de estoque atualizado!' : 'Nova peça/sobra cadastrada no estoque!');
  };

  // Excluir Item
  const handleExcluirItem = (id: string) => {
    if (confirm('Deseja realmente remover esta peça/retalho do estoque?')) {
      StorageService.deleteItemEstoqueDimensional(id);
      loadData();
      exibirToast('Peça removida do estoque.');
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

    // Atualiza a barra para a medida da sobra
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
      const matchOrigem = filtroOrigem === 'TODOS' || item.tipo_origem === filtroOrigem;
      const term = termoBusca.toLowerCase().trim();
      const matchBusca = !term || 
        item.codigo.toLowerCase().includes(term) ||
        item.descricao.toLowerCase().includes(term) ||
        item.material_nome.toLowerCase().includes(term) ||
        (item.localizacao_galpao && item.localizacao_galpao.toLowerCase().includes(term));

      return matchMaterial && matchOrigem && matchBusca;
    });
  }, [estoque, filtroMaterial, filtroOrigem, termoBusca]);

  // Estatísticas e Agrupamento por Material
  const estatisticas = useMemo(() => {
    let pesoTotal = 0;
    let metrosTotais = 0;
    let pecasTotais = 0;
    const porMaterial: Record<string, { nome: string; pecas: number; metros: number; pesoKg: number }> = {};

    estoque.forEach(item => {
      pesoTotal += item.peso_total_kg || 0;
      pecasTotais += item.quantidade_pecas || 0;
      if (item.metros_totais) metrosTotais += item.metros_totais;

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
      pecasTotais,
      materiaisCount: Object.keys(porMaterial).length,
      porMaterial
    };
  }, [estoque]);

  return (
    <div className="space-y-6 w-full pb-16">
      
      {/* TOAST DE FEEDBACK */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 font-bold text-xs animate-in fade-in slide-in-from-top-4">
          <Check className="w-5 h-5 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* CABEÇALHO DA PÁGINA */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#10b981] flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <span>Estoque Físico & Retalhos</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Controle dimensional de barras, tubos, metros lineares, chapas e sobras de corte com cálculo de peso por material
          </p>
        </div>

        <button
          onClick={handleNovoItem}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>+ Cadastrar Peça / Sobra de Corte</span>
        </button>
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
            Soma de varas e sobras
          </span>
        </div>

        {/* TOTAL DE PEÇAS & SOBRAS */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Peças / Barras Físicas</span>
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

        {/* MATERIAIS ATIVOS */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Ligas / Materiais</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {estatisticas.materiaisCount} <span className="text-sm font-semibold text-slate-500">tipos</span>
          </div>
          <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full inline-block">
            Inox, Carbono, Policarbonato
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

          {/* BOTÕES DE CADA MATERIAL COM PESO */}
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

      {/* BARRA DE PESQUISA E FILTROS DE TIPO */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[280px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            placeholder="Buscar por código, descrição, medidas (ex: 2m, 25.4mm) ou prateleira..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Origem:</span>
          <select
            value={filtroOrigem}
            onChange={(e) => setFiltroOrigem(e.target.value)}
            className="p-2 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="TODOS">Todas as Peças & Sobras</option>
            <option value="SOBRA_CORTE">Somente Sobras de Corte / Retalhos</option>
            <option value="BARRA_INTEIRA">Barras Padrão Inteiras</option>
            <option value="CHAPA_INTEIRA">Chapas Inteiras</option>
            <option value="RETALHO">Retalhos de Chapas</option>
          </select>
        </div>
      </div>

      {/* TABELA DE ESTOQUE DIMENSIONAL */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <span>Peças & Dimensões em Estoque</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
              {itensFiltrados.length} itens encontrados
            </span>
          </h3>

          <div className="text-xs font-bold text-slate-600">
            Peso do Filtro Atual: <strong className="text-emerald-700 font-black">{
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
                <th className="p-3">Dimensões Exatas</th>
                <th className="p-3 text-center">Qtd Peças</th>
                <th className="p-3 text-center">Metros Lineares</th>
                <th className="p-3 text-center">Peso Unit.</th>
                <th className="p-3 text-center">Peso Total</th>
                <th className="p-3">Tipo / Localização</th>
                <th className="p-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {itensFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    Nenhuma peça ou sobra de corte encontrada com os filtros selecionados.
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

                    {/* DIMENSÕES FÍSICAS EXATAS */}
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
                        {(item.geometria === 'CHAPA' || item.geometria === 'PERFIL_VIGA') && (
                          <span>{item.espessura_mm}mm × {item.largura_mm}mm × {item.comprimento_mm}mm</span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        {item.geometria.replace('_', ' ')}
                      </span>
                    </td>

                    {/* QTD PEÇAS */}
                    <td className="p-3 text-center">
                      <span className="font-black text-slate-900 text-sm">{item.quantidade_pecas}</span>
                      <span className="text-[10px] text-slate-400 block font-semibold">unid</span>
                    </td>

                    {/* METROS TOTAIS */}
                    <td className="p-3 text-center font-bold text-slate-700">
                      {item.metros_totais ? `${item.metros_totais} m` : '-'}
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
      {/* MODAL DE CADASTRO / EDIÇÃO DE PEÇA OU SOBRA DE CORTE */}
      {/* ========================================================== */}
      {modalAberto && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
            
            {/* CABEÇALHO DO MODAL */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#10b981] flex items-center justify-center font-black">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    {itemEmEdicaoId ? 'Editar Peça / Sobra de Estoque' : 'Cadastrar Peça / Sobra de Corte'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Defina as dimensões e o material para cálculo automático do peso no estoque
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* CORPO DO FORMULÁRIO */}
            <form onSubmit={handleSalvarItem} className="flex-1 overflow-y-auto p-6 space-y-4">
              
              {/* TIPO DE ORIGEM */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Classificação do Estoque:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'SOBRA_CORTE', label: 'Sobra de Corte' },
                    { id: 'BARRA_INTEIRA', label: 'Barra Padrão (6m)' },
                    { id: 'CHAPA_INTEIRA', label: 'Chapa Padrão' },
                    { id: 'RETALHO', label: 'Retalho de Chapa' }
                  ].map((origem) => (
                    <button
                      key={origem.id}
                      type="button"
                      onClick={() => setFormOrigem(origem.id as TipoOrigemEstoque)}
                      className={`py-2 px-2.5 text-xs font-bold rounded-xl border text-center transition-all ${
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

              {/* CÓDIGO E DESCRIÇÃO */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Código do Item:</label>
                  <input
                    type="text"
                    required
                    value={formCodigo}
                    onChange={(e) => setFormCodigo(e.target.value.toUpperCase())}
                    placeholder="Ex: TB-304-SOBRA"
                    className="w-full p-2 text-xs font-bold rounded-lg border border-slate-200 bg-white uppercase"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Descrição Comercial:</label>
                  <input
                    type="text"
                    required
                    value={formDescricao}
                    onChange={(e) => setFormDescricao(e.target.value)}
                    placeholder="Ex: TUBO INOX 304 OD 1 X 1.50MM - SOBRA 2 METROS"
                    className="w-full p-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              </div>

              {/* FORMATO GEOMÉTRICO */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Formato Geométrico:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'TUBO_REDONDO', label: 'Tubo Redondo' },
                    { id: 'TUBO_QUADRADO', label: 'Tubo Quadrado' },
                    { id: 'BARRA_REDONDA', label: 'Barra Redonda' },
                    { id: 'CHAPA', label: 'Chapa / Placa' }
                  ].map((geo) => (
                    <button
                      key={geo.id}
                      type="button"
                      onClick={() => setFormGeometria(geo.id as GeometriaTipo)}
                      className={`py-2 px-2.5 text-xs font-bold rounded-xl border text-center transition-all ${
                        formGeometria === geo.id
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
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
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Material & Liga (Densidade):</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select
                    value={formMaterialKey}
                    onChange={(e) => setFormMaterialKey(e.target.value)}
                    className="p-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-800"
                  >
                    {Object.values(MATERIAIS_DENSIDADE).map((mat) => (
                      <option key={mat.id} value={mat.id}>
                        {mat.nome} ({mat.densidade_g_cm3} g/cm³)
                      </option>
                    ))}
                  </select>

                  <div className="bg-slate-50 rounded-xl border border-slate-200/80 p-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Densidade Metalúrgica:</span>
                    <span className="font-extrabold text-slate-900">
                      {MATERIAIS_DENSIDADE[formMaterialKey]?.densidade_g_cm3 || 7.93} g/cm³
                    </span>
                  </div>
                </div>
              </div>

              {/* DIMENSÕES ESPECÍFICAS DA PEÇA */}
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Dimensões Físicas da Peça / Barra
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
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Comprimento Atual (m):</label>
                      <input
                        type="number"
                        step="any"
                        value={dimComprimentoMetros || ''}
                        onChange={(e) => setDimComprimentoMetros(parseFloat(e.target.value) || 0)}
                        placeholder="Ex: 2 (para sobra de 2m)"
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
                        placeholder="Ex: 2"
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
                        placeholder="Ex: 2"
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

                {/* QUANTIDADE E LOCALIZAÇÃO */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Quantidade de Peças Iguais:</label>
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
                      placeholder="Ex: Cavalete 2 - Sobras & Retalhos"
                      className="w-full p-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                </div>

              </div>

              {/* CARD DE PESO CALCULADO / AJUSTE MANUAL */}
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
                      Peso Total ({formQtdPecas} pçs)
                    </span>
                    <div className="text-3xl font-black text-amber-200">
                      {Number(((pesoManual !== null && pesoManual > 0 ? pesoManual : pesoCalculadoAoVivo.pesoUnitarioKg) * formQtdPecas).toFixed(2))} <span className="text-base text-white">kg</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/20 text-[10px] text-emerald-100 flex items-center justify-between">
                  <span className="font-mono truncate">{pesoCalculadoAoVivo.formulaExplicativa}</span>
                  <div className="flex items-center gap-1.5 ml-2 shrink-0">
                    <span className="text-white/80">Pesou na balança física?</span>
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

              {/* BOTÕES DE AÇÃO */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                >
                  <Check className="w-4 h-4" />
                  <span>{itemEmEdicaoId ? 'Salvar Alterações' : 'Adicionar ao Estoque'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL DE REGISTRO DE CORTE SOB MEDIDA */}
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
