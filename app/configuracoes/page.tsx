'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Settings, 
  Layers, 
  Box, 
  Scale, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  RotateCcw, 
  Check, 
  X, 
  Sliders, 
  Sparkles, 
  Info, 
  ArrowRight,
  ArrowLeft,
  Flame,
  CircleDot,
  Square,
  Maximize2,
  CheckCircle2,
  Atom,
  ChevronRight,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { MaterialConfig, FormatoGeometricoConfig, TipoFamiliaMaterial } from '@/lib/types';
import { StorageService } from '@/lib/storage';

type ModuloConfig = 'materiais' | 'formatos' | null;

function ConfiguracoesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const moduloParam = searchParams.get('modulo') as ModuloConfig;

  const [moduloAtivo, setModuloAtivo] = useState<ModuloConfig>(moduloParam || null);
  const [materiais, setMateriais] = useState<MaterialConfig[]>([]);
  const [formatos, setFormatos] = useState<FormatoGeometricoConfig[]>([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('TODOS');
  const [toastMessage, setToastMessage] = useState<string>('');

  // Sincronizar com parâmetro da URL
  useEffect(() => {
    if (moduloParam === 'materiais' || moduloParam === 'formatos') {
      setModuloAtivo(moduloParam);
    } else {
      setModuloAtivo(null);
    }
  }, [moduloParam]);

  const navegarParaModulo = (modulo: ModuloConfig) => {
    setModuloAtivo(modulo);
    if (modulo) {
      router.push(`/configuracoes?modulo=${modulo}`);
    } else {
      router.push('/configuracoes');
    }
  };

  // Estados dos Drawers Laterais
  const [drawerMaterialAberto, setDrawerMaterialAberto] = useState(false);
  const [editingMaterialId, setEditingMaterialId] = useState<string | null>(null);

  const [drawerFormatoAberto, setDrawerFormatoAberto] = useState(false);
  const [editingFormatoId, setEditingFormatoId] = useState<string | null>(null);

  // Form Material
  const [formMatId, setFormMatId] = useState('');
  const [formMatNome, setFormMatNome] = useState('');
  const [formMatTipo, setFormMatTipo] = useState<TipoFamiliaMaterial>('INOX');
  const [formMatDensidade, setFormMatDensidade] = useState<number>(7.93);
  const [formMatDescricao, setFormMatDescricao] = useState('');
  const [formMatAtivo, setFormMatAtivo] = useState(true);

  // Form Formato
  const [formFmtId, setFormFmtId] = useState('');
  const [formFmtLabel, setFormFmtLabel] = useState('');
  const [formFmtDescricao, setFormFmtDescricao] = useState('');
  const [formFmtUnidade, setFormFmtUnidade] = useState('PÇ');
  const [formFmtFormula, setFormFmtFormula] = useState('');
  const [formFmtDimensoes, setFormFmtDimensoes] = useState<string[]>(['espessura_mm', 'largura_mm', 'comprimento_mm']);
  const [formFmtAtivo, setFormFmtAtivo] = useState(true);

  // Carregar dados
  const recarregarDados = () => {
    setMateriais(StorageService.getMateriaisConfig());
    setFormatos(StorageService.getFormatosConfig());
  };

  useEffect(() => {
    recarregarDados();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Tecla ESC fecha os drawers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawerMaterialAberto(false);
        setDrawerFormatoAberto(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtragem de materiais
  const materiaisFiltrados = useMemo(() => {
    return materiais.filter(m => {
      const matchBusca = m.nome.toLowerCase().includes(termoBusca.toLowerCase()) || 
                          m.id.toLowerCase().includes(termoBusca.toLowerCase()) ||
                          (m.descricao && m.descricao.toLowerCase().includes(termoBusca.toLowerCase()));
      const matchTipo = filtroTipo === 'TODOS' || m.tipo === filtroTipo;
      return matchBusca && matchTipo;
    });
  }, [materiais, termoBusca, filtroTipo]);

  // Contadores estatísticos
  const stats = useMemo(() => {
    const totalMateriais = materiais.length;
    const materiaisAtivos = materiais.filter(m => m.ativo).length;
    const countInox = materiais.filter(m => m.tipo === 'INOX').length;
    const countCarbono = materiais.filter(m => m.tipo === 'ACO_CARBONO').length;
    const countNaoFerrosos = materiais.filter(m => ['ALUMINIO', 'LATAO', 'COBRE', 'TITANIO'].includes(m.tipo)).length;
    const totalFormatos = formatos.length;
    const formatosAtivos = formatos.filter(f => f.ativo).length;
    return { totalMateriais, materiaisAtivos, countInox, countCarbono, countNaoFerrosos, totalFormatos, formatosAtivos };
  }, [materiais, formatos]);

  // Handlers Material
  const handleNovoMaterial = () => {
    setEditingMaterialId(null);
    setFormMatId('');
    setFormMatNome('');
    setFormMatTipo('INOX');
    setFormMatDensidade(7.93);
    setFormMatDescricao('');
    setFormMatAtivo(true);
    setDrawerMaterialAberto(true);
  };

  const handleEditarMaterial = (mat: MaterialConfig) => {
    setEditingMaterialId(mat.id);
    setFormMatId(mat.id);
    setFormMatNome(mat.nome);
    setFormMatTipo(mat.tipo);
    setFormMatDensidade(mat.densidade_g_cm3);
    setFormMatDescricao(mat.descricao || '');
    setFormMatAtivo(mat.ativo);
    setDrawerMaterialAberto(true);
  };

  const handleSalvarMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMatNome.trim()) {
      alert('Preencha o nome do material / liga.');
      return;
    }
    if (formMatDensidade <= 0) {
      alert('A densidade metalúrgica deve ser maior que zero.');
      return;
    }

    const idFinal = editingMaterialId 
      ? editingMaterialId 
      : (formMatId.trim() ? formMatId.trim().toUpperCase().replace(/\s+/g, '_') : formMatNome.trim().toUpperCase().replace(/[^A-Z0-9]/g, '_'));

    const fatorCalculado = Number(((formMatDensidade * Math.PI) / 1000).toFixed(5));

    const matObj: MaterialConfig = {
      id: idFinal,
      nome: formMatNome.trim(),
      tipo: formMatTipo,
      densidade_g_cm3: formMatDensidade,
      fator_tubo_redondo: fatorCalculado,
      descricao: formMatDescricao.trim() || undefined,
      ativo: formMatAtivo,
      padrao_sistema: editingMaterialId ? materiais.find(m => m.id === editingMaterialId)?.padrao_sistema : false
    };

    StorageService.saveMaterialConfig(matObj);
    recarregarDados();
    setDrawerMaterialAberto(false);
    showToast(`Material "${matObj.nome}" salvo com sucesso!`);
  };

  const handleToggleMaterialAtivo = (mat: MaterialConfig) => {
    const atualizado = { ...mat, ativo: !mat.ativo };
    StorageService.saveMaterialConfig(atualizado);
    recarregarDados();
    showToast(`Material "${mat.nome}" ${atualizado.ativo ? 'ativado' : 'desativado'}.`);
  };

  const handleExcluirMaterial = (id: string, nome: string) => {
    if (confirm(`Deseja realmente remover o material "${nome}"?`)) {
      StorageService.deleteMaterialConfig(id);
      recarregarDados();
      showToast(`Material "${nome}" removido.`);
    }
  };

  const handleRestaurarPadroesMateriais = () => {
    if (confirm('Restaurar a lista de materiais para os padrões metalúrgicos de fábrica da Brasfortal?')) {
      StorageService.resetMateriaisConfig();
      recarregarDados();
      showToast('Padrões de materiais restaurados com sucesso!');
    }
  };

  // Handlers Formato
  const handleNovoFormato = () => {
    setEditingFormatoId(null);
    setFormFmtId('');
    setFormFmtLabel('');
    setFormFmtDescricao('');
    setFormFmtUnidade('PÇ');
    setFormFmtFormula('(Espessura × Largura × Comprimento × Densidade) ÷ 1.000.000');
    setFormFmtDimensoes(['espessura_mm', 'largura_mm', 'comprimento_mm']);
    setFormFmtAtivo(true);
    setDrawerFormatoAberto(true);
  };

  const handleEditarFormato = (fmt: FormatoGeometricoConfig) => {
    setEditingFormatoId(fmt.id);
    setFormFmtId(fmt.id);
    setFormFmtLabel(fmt.label);
    setFormFmtDescricao(fmt.descricao || '');
    setFormFmtUnidade(fmt.unidadeMedidaPadrao);
    setFormFmtFormula(fmt.formulaExplicativaResumida || '');
    setFormFmtDimensoes(fmt.dimensoesExigidas || []);
    setFormFmtAtivo(fmt.ativo);
    setDrawerFormatoAberto(true);
  };

  const handleSalvarFormato = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFmtLabel.trim()) {
      alert('Preencha o nome do formato geométrico.');
      return;
    }

    const idFinal = editingFormatoId
      ? editingFormatoId
      : (formFmtId.trim() ? formFmtId.trim().toUpperCase().replace(/\s+/g, '_') : formFmtLabel.trim().toUpperCase().replace(/[^A-Z0-9]/g, '_'));

    const original = editingFormatoId ? formatos.find(f => f.id === editingFormatoId) : null;

    const formatoObj: FormatoGeometricoConfig = {
      id: idFinal,
      label: formFmtLabel.trim(),
      descricao: formFmtDescricao.trim() || undefined,
      formulaExplicativaResumida: formFmtFormula.trim() || 'Cálculo por dimensões × Densidade',
      unidadeMedidaPadrao: formFmtUnidade.trim().toUpperCase() || 'PÇ',
      dimensoesExigidas: formFmtDimensoes.length > 0 ? formFmtDimensoes : ['peso_unitario_manual'],
      ativo: formFmtAtivo,
      ordem: original ? original.ordem : formatos.length + 1,
      padrao_sistema: original ? original.padrao_sistema : false
    };

    StorageService.saveFormatoConfig(formatoObj);
    recarregarDados();
    setDrawerFormatoAberto(false);
    showToast(`Formato "${formatoObj.label}" salvo com sucesso!`);
  };

  const handleToggleDimensao = (dim: string) => {
    setFormFmtDimensoes(prev => 
      prev.includes(dim) ? prev.filter(d => d !== dim) : [...prev, dim]
    );
  };

  const handleExcluirFormato = (id: string, label: string) => {
    if (confirm(`Deseja realmente remover o formato geométrico "${label}"?`)) {
      StorageService.deleteFormatoConfig(id);
      recarregarDados();
      showToast(`Formato "${label}" removido.`);
    }
  };

  const handleToggleFormatoAtivo = (fmt: FormatoGeometricoConfig) => {
    const updated = { ...fmt, ativo: !fmt.ativo };
    StorageService.saveFormatoConfig(updated);
    recarregarDados();
    showToast(`Formato "${fmt.label}" ${updated.ativo ? 'ativado' : 'desativado'}.`);
  };

  const handleRestaurarPadroesFormatos = () => {
    if (confirm('Restaurar as fórmulas e formatos geométricos para os padrões de fábrica?')) {
      StorageService.resetFormatosConfig();
      recarregarDados();
      showToast('Formatos geométricos restaurados com sucesso!');
    }
  };

  const renderFamiliaBadge = (tipo: TipoFamiliaMaterial) => {
    switch (tipo) {
      case 'INOX':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">Aço Inoxidável</span>;
      case 'ACO_CARBONO':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-100 text-slate-800 border border-slate-300">Aço Carbono</span>;
      case 'ALUMINIO':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-cyan-50 text-cyan-700 border border-cyan-200">Alumínio</span>;
      case 'LATAO':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">Latão / Bronze</span>;
      case 'COBRE':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-orange-50 text-orange-700 border border-orange-200">Cobre Nobre</span>;
      case 'TITANIO':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200">Titânio</span>;
      case 'POLICARBONATO':
      case 'PLASTICO':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">Polímero / Termoplástico</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-gray-100 text-gray-700 border border-gray-200">Especial</span>;
    }
  };

  const renderFormatoIcon = (id: string) => {
    switch (id) {
      case 'TUBO_REDONDO':
        return <CircleDot className="w-5 h-5 text-blue-600" />;
      case 'TUBO_QUADRADO':
        return <Square className="w-5 h-5 text-indigo-600" />;
      case 'BARRA_REDONDA':
        return <CircleDot className="w-5 h-5 text-amber-600" />;
      case 'CHAPA':
        return <Layers className="w-5 h-5 text-emerald-600" />;
      case 'PERFIL_VIGA':
        return <Maximize2 className="w-5 h-5 text-rose-600" />;
      case 'CONEXAO_ACESSORIO':
        return <Box className="w-5 h-5 text-purple-600" />;
      default:
        return <Scale className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6 w-full pb-16">
      
      {/* TOAST FLUTUANTE */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 text-xs font-semibold animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* VISÃO 1: HUB PRINCIPAL COM CARDS EXPLICATIVOS             */}
      {/* (Fica apenas eles quando o usuário clica em Configurações) */}
      {/* ======================================================== */}
      {moduloAtivo === null && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* CABEÇALHO DO HUB */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                <Settings className="w-3.5 h-3.5 text-emerald-600" />
                <span>Central de Parametrização & Engenharia</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Configurações do Sistema
              </h1>
              <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
                Selecione abaixo o módulo que deseja parametrizar. As regras definidas aqui refletem automaticamente no estoque e nos pedidos.
              </p>
            </div>

            <Link
              href="/estoque"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition self-start sm:self-auto"
            >
              <Scale className="w-4 h-4 text-emerald-600" />
              <span>Ver Estoque</span>
            </Link>
          </div>

          {/* GRID DE CARDS EXPLICATIVOS DAS SOLUÇÕES - SINGELOS E AMPLOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
            
            {/* CARD 1: FORMATOS GEOMÉTRICOS */}
            <div 
              onClick={() => navegarParaModulo('formatos')}
              className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 p-6 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Sliders className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                        <span>Formatos Geométricos</span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-blue-600 transition-all" />
                      </h2>
                      <span className="text-[11px] text-slate-400 font-medium">Engenharia Dimensional & Fórmulas</span>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                    {stats.formatosAtivos} de {stats.totalFormatos} Ativos
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Configure os formatos físicos aceitos no estoque (tubos redondos, tubos quadrados/metalon, barras maciças, chapas, vigas e conexões), suas unidades de medida padrão e as fórmulas matemáticas aplicadas para cálculo do peso teórico.
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="px-2.5 py-1 bg-slate-50 border border-slate-200/70 text-slate-600 rounded-lg text-[11px] font-medium">Tubos & Barras</span>
                  <span className="px-2.5 py-1 bg-slate-50 border border-slate-200/70 text-slate-600 rounded-lg text-[11px] font-medium">Chapas & Retalhos</span>
                  <span className="px-2.5 py-1 bg-slate-50 border border-slate-200/70 text-slate-600 rounded-lg text-[11px] font-medium">Conexões Prontas</span>
                </div>
              </div>

              <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Parametrização de dimensões e fórmulas</span>
                <span className="font-bold text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
                  <span>Abrir Configuração</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>

            {/* CARD 2: MATERIAIS & LIGAS METALÚRGICAS */}
            <div 
              onClick={() => navegarParaModulo('materiais')}
              className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 p-6 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors flex items-center gap-1.5">
                        <span>Materiais, Ligas & Densidades</span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition-all" />
                      </h2>
                      <span className="text-[11px] text-slate-400 font-medium">Metalurgia & Físico-Química</span>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    {stats.materiaisAtivos} de {stats.totalMateriais} Ligas Ativas
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Cadastre e gerencie a base de materiais: aços inoxidáveis (304, 316, 430), aços carbono (A36, 1020), metais não-ferrosos (alumínio, latão, cobre, titânio) e termoplásticos industriais com suas densidades específicas em g/cm³.
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="px-2.5 py-1 bg-slate-50 border border-slate-200/70 text-slate-600 rounded-lg text-[11px] font-medium">Inox & Carbono</span>
                  <span className="px-2.5 py-1 bg-slate-50 border border-slate-200/70 text-slate-600 rounded-lg text-[11px] font-medium">Não-Ferrosos & Especiais</span>
                  <span className="px-2.5 py-1 bg-slate-50 border border-slate-200/70 text-slate-600 rounded-lg text-[11px] font-medium">Densidade em g/cm³</span>
                </div>
              </div>

              <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Densidades e simulador de peso por metro</span>
                <span className="font-bold text-emerald-600 group-hover:text-emerald-700 flex items-center gap-1">
                  <span>Abrir Configuração</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* VISÃO 2: SOLUÇÃO DO CARD "MATERIAIS & LIGAS"             */}
      {/* ======================================================== */}
      {moduloAtivo === 'materiais' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* BOTÃO DE VOLTAR AO HUB DE CONFIGURAÇÕES */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <button
              onClick={() => navegarParaModulo(null)}
              className="flex items-center gap-2 text-xs font-extrabold text-slate-600 hover:text-emerald-700 bg-white hover:bg-slate-50 border border-slate-200/90 px-3.5 py-2 rounded-xl transition shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4 text-slate-400" />
              <span>← Voltar para Configurações</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRestaurarPadroesMateriais}
                title="Restaurar ligas padrão de fábrica"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Restaurar Padrões</span>
              </button>

              <button
                onClick={handleNovoMaterial}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Liga / Material</span>
              </button>
            </div>
          </div>

          {/* CABEÇALHO DO MÓDULO */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                <Flame className="w-3.5 h-3.5" />
                <span>Módulo Metalúrgico</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Materiais, Ligas & Densidades
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Defina a densidade metalúrgica para cálculo automático do peso no estoque e pedidos
              </p>
            </div>
          </div>

          {/* CARDS DE RESUMO DO MÓDULO */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ligas Ativas</span>
              <span className="text-xl font-black text-slate-900">{stats.materiaisAtivos}</span>
              <span className="text-[10px] text-slate-400 block font-medium">de {stats.totalMateriais} cadastradas</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Aços Inox</span>
              <span className="text-xl font-black text-emerald-700">{stats.countInox}</span>
              <span className="text-[10px] text-slate-400 block font-medium">304, 316, 430</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Aço Carbono</span>
              <span className="text-xl font-black text-slate-800">{stats.countCarbono}</span>
              <span className="text-[10px] text-slate-400 block font-medium">ASTM A36, SAE 1020</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Metais Nobres & Especiais</span>
              <span className="text-xl font-black text-amber-700">{stats.countNaoFerrosos}</span>
              <span className="text-[10px] text-slate-400 block font-medium">Alumínio, Cobre, Latão, Titânio</span>
            </div>
          </div>

          {/* BARRA DE PESQUISA E FILTROS */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                placeholder="Buscar por liga, código ou aplicação (ex: Inox 304, A36, Titânio)..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="p-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700"
              >
                <option value="TODOS">Todas as Famílias</option>
                <option value="INOX">Aço Inoxidável</option>
                <option value="ACO_CARBONO">Aço Carbono</option>
                <option value="ALUMINIO">Alumínio</option>
                <option value="LATAO">Latão / Bronze</option>
                <option value="COBRE">Cobre</option>
                <option value="TITANIO">Titânio</option>
                <option value="POLICARBONATO">Termoplásticos</option>
              </select>
            </div>
          </div>

          {/* LISTA / TABELA DE MATERIAIS */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    <th className="py-3.5 px-4 sm:px-6">Material / Liga Industrial</th>
                    <th className="py-3.5 px-4">Família</th>
                    <th className="py-3.5 px-4 text-center">Densidade (g/cm³)</th>
                    <th className="py-3.5 px-4 text-center">Fator Tubo Redondo</th>
                    <th className="py-3.5 px-4">Aplicação Típica / Notas</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {materiaisFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <Flame className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="font-semibold text-xs">Nenhum material encontrado</p>
                        <p className="text-[11px] mt-0.5">Tente alterar os termos da busca ou clique em &ldquo;Nova Liga / Material&rdquo;</p>
                      </td>
                    </tr>
                  ) : (
                    materiaisFiltrados.map((mat) => (
                      <tr key={mat.id} className="hover:bg-slate-50/70 transition-colors group">
                        
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
                            <span>{mat.nome}</span>
                            {mat.padrao_sistema && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 uppercase">
                                Padrão
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 block mt-0.5">{mat.id}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          {renderFamiliaBadge(mat.tipo)}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className="font-black text-slate-900 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80 font-mono text-xs">
                            {mat.densidade_g_cm3.toFixed(2)}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className="font-mono text-slate-600 text-[11px]">
                            {mat.fator_tubo_redondo ? mat.fator_tubo_redondo.toFixed(5) : '-'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 max-w-xs">
                          <span className="text-slate-500 text-[11px] line-clamp-1">
                            {mat.descricao || 'Sem observações adicionais cadastradas.'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleToggleMaterialAtivo(mat)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold transition ${
                              mat.ativo 
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                            }`}
                          >
                            {mat.ativo ? '● Ativo' : '○ Inativo'}
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleEditarMaterial(mat)}
                              className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                              title="Editar Material"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            {!mat.padrao_sistema && (
                              <button
                                onClick={() => handleExcluirMaterial(mat.id, mat.nome)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                title="Excluir Material"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
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
      )}

      {/* ======================================================== */}
      {/* VISÃO 3: SOLUÇÃO DO CARD "FORMATOS GEOMÉTRICOS"          */}
      {/* ======================================================== */}
      {moduloAtivo === 'formatos' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* BOTÃO DE VOLTAR AO HUB DE CONFIGURAÇÕES E AÇÕES */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <button
              onClick={() => navegarParaModulo(null)}
              className="flex items-center gap-2 text-xs font-extrabold text-slate-600 hover:text-blue-700 bg-white hover:bg-slate-50 border border-slate-200/90 px-3.5 py-2 rounded-xl transition shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4 text-slate-400" />
              <span>← Voltar para Configurações</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRestaurarPadroesFormatos}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Restaurar Padrões</span>
              </button>

              <button
                onClick={handleNovoFormato}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Formato Geométrico</span>
              </button>
            </div>
          </div>

          {/* CABEÇALHO DO MÓDULO */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <Sliders className="w-3.5 h-3.5" />
              <span>Módulo Dimensional</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Formatos Geométricos & Engenharia
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Parametrize as geometrias físicas do estoque, unidades padrão de medida e fórmulas de cálculo
            </p>
          </div>

          {/* CAIXA DE INFORMAÇÕES EXPLICATIVAS */}
          <div className="bg-blue-50/70 border border-blue-200/80 p-4 rounded-2xl flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900">
              <span className="font-bold block mb-0.5">Regras de Engenharia do Catálogo Brasfortal:</span>
              <p className="text-blue-800/90 leading-relaxed">
                Ao selecionar o formato de uma peça no cadastro, os campos exigidos adaptam-se automaticamente (ex: diâmetro externo e espessura para tubos redondos; espessura, largura e comprimento para chapas). O sistema aplica a fórmula correspondente multiplicada pela densidade da liga escolhida.
              </p>
            </div>
          </div>

          {/* GRID DE FORMATOS GEOMÉTRICOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formatos.map((fmt) => (
              <div 
                key={fmt.id} 
                className={`bg-white rounded-2xl border p-5 transition-all shadow-2xs space-y-3.5 ${
                  fmt.ativo ? 'border-slate-200/90' : 'border-slate-200 opacity-60 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                      {renderFormatoIcon(fmt.id)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-sm text-slate-900">{fmt.label}</h3>
                        {fmt.padrao_sistema && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 uppercase">
                            Padrão
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 block">{fmt.id}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleFormatoAtivo(fmt)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold transition ${
                        fmt.ativo 
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {fmt.ativo ? 'Ativo' : 'Desativado'}
                    </button>
                    <button
                      onClick={() => handleEditarFormato(fmt)}
                      className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                      title="Editar Formato"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    {!fmt.padrao_sistema && (
                      <button
                        onClick={() => handleExcluirFormato(fmt.id, fmt.label)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Excluir Formato"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {fmt.descricao || 'Sem descrição cadastrada.'}
                </p>

                {/* FÓRMULA METALÚRGICA */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Fórmula de Cálculo Teórico
                  </span>
                  <div className="font-mono text-xs font-bold text-slate-800 break-all">
                    {fmt.formulaExplicativaResumida}
                  </div>
                </div>

                {/* DETALHES DE ENGENHARIA */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400 font-medium">Unidade Padrão: </span>
                    <span className="font-extrabold text-slate-800 font-mono">{fmt.unidadeMedidaPadrao}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Dimensões: </span>
                    <span className="font-bold text-slate-700 text-[11px]">
                      {fmt.dimensoesExigidas.length > 0 ? fmt.dimensoesExigidas.join(', ') : 'Peso Balança'}
                    </span>
                  </div>
                </div>

              </div>
            ))}

            {/* CARD PONTILHADO: ADICIONAR NOVO FORMATO */}
            <div
              onClick={handleNovoFormato}
              className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-white/40 hover:bg-blue-50/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group min-h-[180px]"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-2.5 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs">
                <Plus className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-sm text-slate-800 group-hover:text-blue-600 transition-colors">
                + Novo Formato Geométrico
              </span>
              <span className="text-[11px] text-slate-400 mt-1 max-w-xs">
                Cadastre novas geometrias físicas, tarugos ou componentes sob medida
              </span>
            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* DRAWER LATERAL: CADASTRAR / EDITAR MATERIAL & LIGA       */}
      {/* ======================================================== */}
      <div 
        onClick={() => setDrawerMaterialAberto(false)}
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 transition-opacity duration-300 ${
          drawerMaterialAberto ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside
        className={`fixed top-0 bottom-0 right-0 z-50 w-full sm:max-w-xl md:w-1/2 lg:w-1/2 bg-white shadow-2xl border-l border-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out ${
          drawerMaterialAberto ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-20 px-6 sm:px-8 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              {editingMaterialId ? <Edit className="w-5 h-5" /> : <Flame className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 tracking-tight">
                {editingMaterialId ? 'Editar Material / Liga' : 'Nova Liga / Material Industrial'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Defina a densidade metalúrgica para cálculo automático de peso no estoque
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDrawerMaterialAberto(false)}
            className="w-9 h-9 rounded-2xl border border-slate-200/80 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSalvarMaterial} className="flex-1 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5 bg-white">
            
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Nome Comercial da Liga / Material *
              </label>
              <input
                type="text"
                required
                value={formMatNome}
                onChange={(e) => setFormMatNome(e.target.value)}
                placeholder="Ex: Aço Inox AISI 310S, Cobre Fosforoso, Polipropileno PP"
                className="w-full p-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white focus:outline-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Chave Técnica / ID
                </label>
                <input
                  type="text"
                  disabled={!!editingMaterialId}
                  value={formMatId}
                  onChange={(e) => setFormMatId(e.target.value.toUpperCase())}
                  placeholder={formMatNome ? formMatNome.toUpperCase().replace(/[^A-Z0-9]/g, '_') : 'Ex: INOX_310S'}
                  className="w-full p-2 text-xs font-mono font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-800 disabled:opacity-60"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Identificador imutável no banco</span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Família Metalúrgica *
                </label>
                <select
                  value={formMatTipo}
                  onChange={(e) => setFormMatTipo(e.target.value as TipoFamiliaMaterial)}
                  className="w-full p-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-800"
                >
                  <option value="INOX">Aço Inoxidável (Inox)</option>
                  <option value="ACO_CARBONO">Aço Carbono / Liga</option>
                  <option value="ALUMINIO">Alumínio Industrial</option>
                  <option value="LATAO">Latão / Bronze</option>
                  <option value="COBRE">Cobre Eletrolítico</option>
                  <option value="TITANIO">Titânio</option>
                  <option value="POLICARBONATO">Termoplástico / Polímero</option>
                  <option value="OUTRO">Outros Metais Especiais</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Densidade Específica (g/cm³) *
                </label>
                <span className="text-[11px] text-emerald-600 font-bold">Parâmetro Físico</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="number"
                    step="0.001"
                    min="0.1"
                    required
                    value={formMatDensidade}
                    onChange={(e) => setFormMatDensidade(parseFloat(e.target.value) || 0)}
                    placeholder="Ex: 7.93"
                    className="w-full p-2.5 text-base font-black text-slate-900 rounded-xl border border-slate-300 bg-white text-center font-mono focus:outline-emerald-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block text-center">Grama por centímetro cúbico</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Fator Tubo Redondo (Calculado)</span>
                  <span className="font-mono text-sm font-black text-emerald-700 mt-0.5">
                    {((formMatDensidade * Math.PI) / 1000).toFixed(5)}
                  </span>
                  <span className="text-[9px] text-slate-400 mt-0.5">(OD - Parede) × Parede × Fator</span>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-200/80 text-[11px] text-slate-600 flex items-center justify-between">
                <span>Simulação 1 metro Tubo 1&quot; (25.4mm) Parede 1.5mm:</span>
                <span className="font-extrabold text-slate-900 font-mono">
                  {((25.4 - 1.5) * 1.5 * ((formMatDensidade * Math.PI) / 1000)).toFixed(3)} kg/m
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Descrição Técnica / Aplicação na Indústria
              </label>
              <textarea
                rows={3}
                value={formMatDescricao}
                onChange={(e) => setFormMatDescricao(e.target.value)}
                placeholder="Ex: Resistente a altas temperaturas até 1150°C em fornos industriais..."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-emerald-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="matAtivo"
                checked={formMatAtivo}
                onChange={(e) => setFormMatAtivo(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <label htmlFor="matAtivo" className="text-xs font-bold text-slate-800 cursor-pointer">
                Material ativo para seleção no estoque e pedidos
              </label>
            </div>

          </div>

          <div className="p-4 px-6 sm:px-8 border-t border-slate-100 bg-white flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setDrawerMaterialAberto(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02]"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Material</span>
            </button>
          </div>
        </form>
      </aside>

      {/* ======================================================== */}
      {/* DRAWER LATERAL: EDITAR FORMATO GEOMÉTRICO                */}
      {/* ======================================================== */}
      <div 
        onClick={() => setDrawerFormatoAberto(false)}
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 transition-opacity duration-300 ${
          drawerFormatoAberto ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside
        className={`fixed top-0 bottom-0 right-0 z-50 w-full sm:max-w-xl md:w-1/2 lg:w-1/2 bg-white shadow-2xl border-l border-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out ${
          drawerFormatoAberto ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-20 px-6 sm:px-8 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              {editingFormatoId ? <Sliders className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 tracking-tight">
                {editingFormatoId ? 'Configurar Formato Geométrico' : 'Novo Formato Geométrico'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {editingFormatoId 
                  ? 'Altere o rótulo de exibição, unidade de medida e descrição do formato' 
                  : 'Cadastre uma nova geometria física para seleção no cadastro de estoque'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDrawerFormatoAberto(false)}
            className="w-9 h-9 rounded-2xl border border-slate-200/80 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSalvarFormato} className="flex-1 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5 bg-white">
            
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Identificador do Formato (Código Técnico) *
              </label>
              <input
                type="text"
                disabled={!!editingFormatoId}
                value={formFmtId}
                onChange={(e) => setFormFmtId(e.target.value.toUpperCase())}
                placeholder={formFmtLabel ? formFmtLabel.toUpperCase().replace(/[^A-Z0-9]/g, '_') : 'Ex: BARRA_CHATA, DISCO_CIRCULAR'}
                className="w-full p-2.5 text-xs font-mono font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-800 disabled:opacity-60 uppercase"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Identificador único do formato</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Rótulo de Exibição Comercial *
              </label>
              <input
                type="text"
                required
                value={formFmtLabel}
                onChange={(e) => setFormFmtLabel(e.target.value)}
                placeholder="Ex: Barra Chata / Retangular, Tubo Oval, Disco Circular"
                className="w-full p-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white focus:outline-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Unidade de Medida Padrão *
              </label>
              <input
                type="text"
                required
                value={formFmtUnidade}
                onChange={(e) => setFormFmtUnidade(e.target.value.toUpperCase())}
                placeholder="Ex: M, PÇ, BR, KG"
                className="w-full p-2.5 text-xs font-mono font-bold rounded-xl border border-slate-200 bg-white uppercase focus:outline-blue-500"
              />
            </div>

            {/* FÓRMULA DE CÁLCULO */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Fórmula Teórica / Instrução de Cálculo
              </label>
              <input
                type="text"
                value={formFmtFormula}
                onChange={(e) => setFormFmtFormula(e.target.value)}
                placeholder="Ex: (Espessura × Largura × Comprimento × Densidade) ÷ 1.000.000"
                className="w-full p-2.5 text-xs font-mono rounded-xl border border-slate-200 bg-white focus:outline-blue-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Expressão explicativa exibida ao usuário</span>
            </div>

            {/* DIMENSÕES EXIGIDAS NO CADASTRO */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 space-y-2.5">
              <label className="text-xs font-bold text-slate-700 block">
                Campos Dimensionais Exigidos no Estoque:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'comprimento_metros', label: 'Comprimento em Metros' },
                  { id: 'diametro_externo_mm', label: 'Diâmetro Externo (OD)' },
                  { id: 'parede_mm', label: 'Espessura de Parede' },
                  { id: 'diametro_barra_mm', label: 'Diâmetro Barra/Tarugo' },
                  { id: 'espessura_mm', label: 'Espessura de Chapa' },
                  { id: 'largura_mm', label: 'Largura da Peça' },
                  { id: 'comprimento_mm', label: 'Comprimento em mm' },
                  { id: 'lado_a_mm', label: 'Lado A (Perfil/Tubo)' },
                  { id: 'lado_b_mm', label: 'Lado B (Perfil/Tubo)' },
                  { id: 'peso_unitario_manual', label: 'Peso Balança / Catálogo' }
                ].map((dim) => {
                  const selecionado = formFmtDimensoes.includes(dim.id);
                  return (
                    <button
                      key={dim.id}
                      type="button"
                      onClick={() => handleToggleDimensao(dim.id)}
                      className={`p-2 rounded-xl border text-left text-[11px] font-semibold transition flex items-center gap-2 ${
                        selecionado 
                          ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-2xs' 
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                        selecionado ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                      }`}>
                        {selecionado && <Check className="w-2.5 h-2.5" />}
                      </div>
                      <span className="truncate">{dim.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Descrição e Instruções de Uso
              </label>
              <textarea
                rows={3}
                value={formFmtDescricao}
                onChange={(e) => setFormFmtDescricao(e.target.value)}
                placeholder="Explique os tipos de tubos, perfis ou barras cobertos por este formato..."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-blue-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="fmtAtivo"
                checked={formFmtAtivo}
                onChange={(e) => setFormFmtAtivo(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <label htmlFor="fmtAtivo" className="text-xs font-bold text-slate-800 cursor-pointer">
                Formato ativo no catálogo e no cadastro de estoque
              </label>
            </div>

          </div>

          <div className="p-4 px-6 sm:px-8 border-t border-slate-100 bg-white flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setDrawerFormatoAberto(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
            >
              <Check className="w-4 h-4" />
              <span>{editingFormatoId ? 'Salvar Alterações' : 'Cadastrar Formato'}</span>
            </button>
          </div>
        </form>
      </aside>

    </div>
  );
}

export default function CentralConfiguracoesPage() {
  return (
    <Suspense fallback={
      <div className="p-8 max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    }>
      <ConfiguracoesContent />
    </Suspense>
  );
}
