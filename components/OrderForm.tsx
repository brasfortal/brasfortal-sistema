'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft, 
  Search, 
  Calculator, 
  Building2, 
  Truck, 
  FileCheck,
  Package,
  History,
  Sparkles,
  TrendingUp,
  X,
  Factory,
  FileText,
  Filter,
  Check,
  ArrowUpRight,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Scale
} from 'lucide-react';
import { Pedido, ItemPedido, ExpedicaoNF, Cliente, Produto, Vendedor, Fornecedor } from '@/lib/types';
import { StorageService } from '@/lib/storage';
import { useAuth } from '@/lib/auth';
import { 
  MATERIAIS_DENSIDADE, 
  calcularPesoTeorico, 
  analisarDescricaoProduto, 
  ParametrosCalculoPeso, 
  GeometriaTipo 
} from '@/lib/weightCalculator';

interface Props {
  initialPedido?: Pedido;
}

export default function OrderForm({ initialPedido }: Props) {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [allPedidosHistory, setAllPedidosHistory] = useState<Pedido[]>([]);

  // Modal de Acesso Rápido a Cotações & Compras de Usinas
  const [showCotacoesModal, setShowCotacoesModal] = useState(false);
  const [activeItemIndexForModal, setActiveItemIndexForModal] = useState<number>(0);
  const [modalSearchQuery, setModalSearchQuery] = useState('');
  const [selectedTabCotacoes, setSelectedTabCotacoes] = useState<'HISTORICO' | 'FORNECEDORES'>('HISTORICO');
  const [appliedToast, setAppliedToast] = useState('');
  const { user } = useAuth();

  // Modal da Calculadora de Peso Teórico
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [calcRowIndex, setCalcRowIndex] = useState<number>(0);
  const [calcParams, setCalcParams] = useState<ParametrosCalculoPeso>({
    geometria: 'CHAPA',
    materialKey: 'INOX_304',
    espessura_mm: 4,
    largura_mm: 1000,
    comprimento_mm: 2000,
    diametro_externo_mm: 25.4,
    parede_mm: 1.5,
    comprimento_metros: 6,
    diametro_barra_mm: 25.4,
    quantidade: 1
  });

  // Estado de Acordeão / Seções Retráteis (quando um abre, o outro fecha)
  const [activeAccordionSection, setActiveAccordionSection] = useState<'CLIENTE' | 'ITENS'>(
    initialPedido ? 'ITENS' : 'CLIENTE'
  );

  // Estado para autocomplete / sugestão rápida de produtos ao digitar a descrição
  const [focusedProductRowIndex, setFocusedProductRowIndex] = useState<number | null>(null);

  // Form State
  const [tipo, setTipo] = useState<'ORCAMENTO' | 'PEDIDO'>(initialPedido?.tipo || 'PEDIDO');
  const [dataEmissao, setDataEmissao] = useState(
    initialPedido?.data_emissao || new Date().toISOString().split('T')[0]
  );
  
  // Cliente (inicia 100% limpo quando for Novo Pedido)
  const [clienteNome, setClienteNome] = useState(initialPedido?.cliente_nome || '');
  const [clienteCnpj, setClienteCnpj] = useState(initialPedido?.cliente_cnpj || '');
  const [clienteIe, setClienteIe] = useState(initialPedido?.cliente_ie || '');
  const [comprador, setComprador] = useState(initialPedido?.comprador || '');
  const [telefone, setTelefone] = useState(initialPedido?.telefone || '');
  const [endereco, setEndereco] = useState(initialPedido?.endereco || '');

  // Logística e Condições
  const [condicoesPagamento, setCondicoesPagamento] = useState(initialPedido?.condicoes_pagamento || '30 DDL');
  const [pedidoClienteN, setPedidoClienteN] = useState(initialPedido?.pedido_cliente_n || '');
  const [localEntrega, setLocalEntrega] = useState(initialPedido?.local_entrega || '');
  const [transportadora, setTransportadora] = useState(initialPedido?.transportadora || '');
  const [localCobranca, setLocalCobranca] = useState(initialPedido?.local_cobranca || '');

  // Vendedor (Assume o usuário logado automaticamente)
  const [vendedorNome, setVendedorNome] = useState(
    initialPedido?.vendedor_nome || user?.nome || 'Márcio Santos'
  );
  const [valorComissao, setValorComissao] = useState<number>(initialPedido?.valor_comissao || 0);

  // Itens (inicia com 1 linha vazia sem produto pré-selecionado)
  const [itens, setItens] = useState<ItemPedido[]>(
    initialPedido?.itens || [
      {
        id: 'it-temp-1',
        item_numero: 1,
        unid_1: 'PÇ',
        quant_1: 1,
        unid_2: 'PÇ',
        quant_2: 1,
        peso: 0,
        codigo: '',
        descricao: '',
        valor_unitario: 0,
        valor_total: 0
      }
    ]
  );

  // NFs
  const [nfs, setNfs] = useState<ExpedicaoNF[]>(
    initialPedido?.nfs || [
      { id: 'nf-temp-1', numero_nf: '', icms_percent: 18, peso_total: 0, especie: 'VOLUMES' }
    ]
  );

  const [observacoes, setObservacoes] = useState(initialPedido?.observacoes || '');

  // Cliente selecionado
  const [selectedClienteObj, setSelectedClienteObj] = useState<Cliente | null>(null);

  useEffect(() => {
    const listCli = StorageService.getClientes();
    setClientes(listCli);
    setProdutos(StorageService.getProdutos());
    setVendedores(StorageService.getVendedores());
    setFornecedores(StorageService.getFornecedores());
    setAllPedidosHistory(StorageService.getPedidos());

    if (initialPedido?.cliente_cnpj) {
      const match = listCli.find(c => c.cnpj === initialPedido.cliente_cnpj);
      if (match) setSelectedClienteObj(match);
    } else if (user?.nome && !initialPedido) {
      // Garantir que o vendedor é o usuário logado para novo pedido
      setVendedorNome(user.nome);
    }
  }, [initialPedido, user]);

  // Selecionar Cliente e autopreencher
  const handleSelectCliente = (cnpjOuId: string) => {
    const cli = clientes.find(c => c.cnpj === cnpjOuId || c.id === cnpjOuId || c.razao_social.toLowerCase().includes(cnpjOuId.toLowerCase()));
    if (cli) {
      setSelectedClienteObj(cli);
      setClienteNome(cli.nome_fantasia || cli.razao_social);
      setClienteCnpj(cli.cnpj);
      setClienteIe(cli.inscricao_estadual || '');
      
      const defaultComprador = (cli.compradores && cli.compradores.length > 0)
        ? (cli.compradores.find(cb => cb.is_principal)?.nome || cli.compradores[0].nome)
        : (cli.comprador_padrao || '');
      
      const compObj = cli.compradores?.find(cb => cb.nome === defaultComprador);

      setComprador(defaultComprador);
      setTelefone(compObj?.celular_whatsapp || compObj?.telefone || cli.telefone || '');
      setEndereco(cli.endereco_completo || '');
      setLocalEntrega(cli.local_entrega_padrao || cli.endereco_completo || '');
      setLocalCobranca(cli.local_cobranca_padrao || cli.endereco_completo || '');
      if (cli.condicao_pagamento_padrao) setCondicoesPagamento(cli.condicao_pagamento_padrao);
      if (cli.transportadora_preferencial) setTransportadora(cli.transportadora_preferencial);
    }
  };

  const handleSelectComprador = (nomeComp: string) => {
    setComprador(nomeComp);
    if (selectedClienteObj?.compradores) {
      const found = selectedClienteObj.compradores.find(c => c.nome === nomeComp);
      if (found && (found.telefone || found.celular_whatsapp)) {
        setTelefone(found.celular_whatsapp || found.telefone);
      }
    }
  };

  // Atualizar Item
  const handleItemChange = (index: number, field: keyof ItemPedido, value: any) => {
    const novosItens = [...itens];
    const item = { ...novosItens[index], [field]: value };

    // Recalcular totais se mudar quantidade ou valor unitário
    if (field === 'quant_1' || field === 'valor_unitario') {
      const q = field === 'quant_1' ? Number(value) : item.quant_1;
      const v = field === 'valor_unitario' ? Number(value) : item.valor_unitario;
      item.valor_total = q * v;
    }

    // Auto-cálculo de peso ao alterar a descrição ou a quantidade (se ainda não preenchido ou for chapa/tubo detectado)
    if (field === 'descricao' || field === 'quant_1') {
      const descParaCalculo = field === 'descricao' ? String(value) : item.descricao;
      const qParaCalculo = field === 'quant_1' ? Number(value) : (item.quant_1 || 1);
      
      const parsed = analisarDescricaoProduto(descParaCalculo, qParaCalculo);
      if (parsed) {
        const resultado = calcularPesoTeorico(parsed);
        if (resultado.pesoTotalKg > 0) {
          item.peso = resultado.pesoTotalKg;
        }
      }
    }

    novosItens[index] = item;
    setItens(novosItens);
  };

  // Abrir Modal da Calculadora de Peso para uma linha
  const handleOpenWeightModal = (index: number) => {
    setCalcRowIndex(index);
    const targetItem = itens[index];
    const q = targetItem?.quant_1 || 1;
    
    // Tenta pré-carregar parâmetros a partir da descrição
    const parsed = analisarDescricaoProduto(targetItem?.descricao || '', q);
    if (parsed) {
      setCalcParams(parsed);
    } else {
      setCalcParams({
        geometria: 'CHAPA',
        materialKey: 'INOX_304',
        espessura_mm: 4,
        largura_mm: 1000,
        comprimento_mm: 2000,
        diametro_externo_mm: 25.4,
        parede_mm: 1.5,
        comprimento_metros: 6,
        diametro_barra_mm: 25.4,
        quantidade: q
      });
    }
    setShowWeightModal(true);
  };

  // Aplicar Peso Teórico calculado na linha do pedido
  const handleApplyWeightFromModal = () => {
    const resultado = calcularPesoTeorico(calcParams);
    const novosItens = [...itens];
    if (novosItens[calcRowIndex]) {
      novosItens[calcRowIndex] = {
        ...novosItens[calcRowIndex],
        peso: resultado.pesoTotalKg
      };
      setItens(novosItens);
      setAppliedToast(`Peso de ${resultado.pesoTotalKg} kg aplicado no Item #${calcRowIndex + 1}!`);
      setTimeout(() => setAppliedToast(''), 3000);
      setShowWeightModal(false);
    }
  };

  // Selecionar Produto do catálogo para uma linha
  const handleSelectProduto = (index: number, produtoOrCodigo: string | Produto) => {
    const prod = typeof produtoOrCodigo === 'string' 
      ? produtos.find(p => p.codigo === produtoOrCodigo)
      : produtoOrCodigo;

    if (prod) {
      const novosItens = [...itens];
      const quant = Number(novosItens[index].quant_1) || 1;
      novosItens[index] = {
        ...novosItens[index],
        codigo: prod.codigo,
        descricao: prod.descricao,
        unid_1: prod.unidade_primaria || 'PÇ',
        unid_2: prod.unidade_secundaria || prod.unidade_primaria || 'PÇ',
        quant_2: prod.fator_conversao ? quant * prod.fator_conversao : novosItens[index].quant_2,
        peso: Number(((prod.peso_unitario || 0) * quant).toFixed(2)),
        valor_unitario: prod.preco_venda_padrao || 0,
        valor_total: quant * (prod.preco_venda_padrao || 0)
      };
      setItens(novosItens);
      setFocusedProductRowIndex(null);
    }
  };

  // Abrir Modal de Cotações & Compras para uma linha do pedido
  const handleOpenCotacoesModal = (index: number) => {
    setActiveItemIndexForModal(index);
    const targetItem = itens[index];
    const initialQuery = targetItem ? (targetItem.codigo || targetItem.descricao) : '';
    setModalSearchQuery(initialQuery);
    setSelectedTabCotacoes('HISTORICO');
    setShowCotacoesModal(true);
  };

  // Aplicar preço da cotação consultada para a linha do pedido
  const handleApplyPriceFromModal = (novoPreco: number) => {
    const novosItens = [...itens];
    if (novosItens[activeItemIndexForModal]) {
      const q = novosItens[activeItemIndexForModal].quant_1 || 1;
      novosItens[activeItemIndexForModal] = {
        ...novosItens[activeItemIndexForModal],
        valor_unitario: novoPreco,
        valor_total: q * novoPreco
      };
      setItens(novosItens);
      setAppliedToast(`Preço de ${novoPreco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} aplicado no Item #${activeItemIndexForModal + 1}!`);
      setTimeout(() => setAppliedToast(''), 3000);
      setShowCotacoesModal(false);
    }
  };

  // Item ativo no modal
  const itemNoForm = itens[activeItemIndexForModal] || itens[0];

  // Extrair histórico de cotações dos pedidos cadastrados
  const historicalQuotes = React.useMemo(() => {
    const term = (modalSearchQuery || itemNoForm?.codigo || itemNoForm?.descricao || '').toLowerCase().trim();
    const results: Array<{
      pedidoId: string;
      numeroPedido: number;
      dataEmissao: string;
      clienteNome: string;
      comprador?: string;
      vendedorNome?: string;
      quant: number;
      unid: string;
      valorUnitario: number;
      valorTotal: number;
      codigo: string;
      descricao: string;
    }> = [];

    allPedidosHistory.forEach(ped => {
      ped.itens?.forEach(it => {
        const matchesCode = it.codigo && it.codigo.toLowerCase().includes(term);
        const matchesDesc = it.descricao && it.descricao.toLowerCase().includes(term);
        const matchesClient = ped.cliente_nome.toLowerCase().includes(term);
        if (!term || matchesCode || matchesDesc || matchesClient) {
          results.push({
            pedidoId: ped.id,
            numeroPedido: ped.numero_pedido,
            dataEmissao: ped.data_emissao,
            clienteNome: ped.cliente_nome,
            comprador: ped.comprador,
            vendedorNome: ped.vendedor_nome,
            quant: it.quant_1,
            unid: it.unid_1,
            valorUnitario: it.valor_unitario,
            valorTotal: it.valor_total,
            codigo: it.codigo,
            descricao: it.descricao
          });
        }
      });
    });

    return results;
  }, [allPedidosHistory, modalSearchQuery, itemNoForm]);

  // Estatísticas de cotações para o item
  const statsCotacao = React.useMemo(() => {
    if (historicalQuotes.length === 0) {
      return { min: 0, max: 0, avg: 0, totalCotacoes: 0 };
    }
    const valores = historicalQuotes.map(q => q.valorUnitario).filter(v => v > 0);
    if (valores.length === 0) return { min: 0, max: 0, avg: 0, totalCotacoes: 0 };
    const min = Math.min(...valores);
    const max = Math.max(...valores);
    const sum = valores.reduce((a, b) => a + b, 0);
    const avg = sum / valores.length;
    return { min, max, avg, totalCotacoes: valores.length };
  }, [historicalQuotes]);

  // Fornecedores filtrados no modal
  const filteredFornecedoresModal = React.useMemo(() => {
    const term = (modalSearchQuery || '').toLowerCase().trim();
    if (!term) return fornecedores;
    return fornecedores.filter(f => 
      f.razao_social.toLowerCase().includes(term) ||
      (f.nome_fantasia && f.nome_fantasia.toLowerCase().includes(term)) ||
      f.categoria_material.toLowerCase().includes(term) ||
      (f.contato_vendedor && f.contato_vendedor.toLowerCase().includes(term))
    );
  }, [fornecedores, modalSearchQuery]);

  const addItem = () => {
    if (itens.length >= 11) {
      alert('A ficha padrão da Brasfortal comporta até 11 itens por folha.');
      return;
    }
    setItens([
      ...itens,
      {
        id: `it-new-${Date.now()}`,
        item_numero: itens.length + 1,
        unid_1: 'PÇ',
        quant_1: 1,
        unid_2: 'PÇ',
        quant_2: 1,
        peso: 0,
        codigo: '',
        descricao: '',
        valor_unitario: 0,
        valor_total: 0
      }
    ]);
  };

  const removeItem = (index: number) => {
    if (itens.length === 1) return;
    const filtrados = itens.filter((_, i) => i !== index).map((item, idx) => ({
      ...item,
      item_numero: idx + 1
    }));
    setItens(filtrados);
  };

  // Calcular totais
  const valorTotalPedido = itens.reduce((acc, it) => acc + (it.valor_total || 0), 0);
  const pesoTotalPedido = itens.reduce((acc, it) => acc + (it.peso || 0), 0);

  // Recalcular comissão sugerida (ex: 3.5%)
  useEffect(() => {
    if (!initialPedido && valorTotalPedido > 0) {
      setValorComissao(Number((valorTotalPedido * 0.035).toFixed(2)));
    }
  }, [valorTotalPedido, initialPedido]);

  // Salvar Pedido
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteNome) {
      alert('Por favor, informe o nome do cliente.');
      return;
    }

    const proximoNumero = initialPedido 
      ? initialPedido.numero_pedido 
      : (StorageService.getPedidos().reduce((max, p) => Math.max(max, p.numero_pedido), 1040) + 1);

    const novoPedido: Pedido = {
      id: initialPedido?.id || `ped-${Date.now()}`,
      numero_pedido: proximoNumero,
      tipo,
      data_emissao: dataEmissao,
      cliente_nome: clienteNome,
      cliente_cnpj: clienteCnpj,
      cliente_ie: clienteIe,
      comprador,
      telefone,
      endereco,
      condicoes_pagamento: condicoesPagamento,
      pedido_cliente_n: pedidoClienteN,
      local_entrega: localEntrega,
      transportadora,
      local_cobranca: localCobranca,
      vendedor_nome: vendedorNome,
      valor_comissao: valorComissao,
      itens,
      nfs,
      valor_total: valorTotalPedido,
      peso_total: pesoTotalPedido,
      status: initialPedido?.status || (tipo === 'ORCAMENTO' ? 'ORCAMENTO' : 'NOVO'),
      observacoes,
      created_at: initialPedido?.created_at || new Date().toISOString()
    };

    StorageService.savePedido(novoPedido);
    router.push(`/pedidos/${novoPedido.id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full pb-12">
      
      {/* Barra de Ações Superior */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 flex flex-wrap items-center gap-2">
              <span>
                {initialPedido 
                  ? `Editar Pedido #${initialPedido.numero_pedido}${clienteNome ? ` - ${clienteNome}` : ''}` 
                  : (clienteNome ? `Novo Pedido - ${clienteNome}` : 'Novo Espelho de Pedido')
                }
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                Ficha Oficial Brasfortal
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Preencha os campos para emitir a ficha digital e gerar a impressão oficial em PDF
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as any)}
            className="text-xs font-bold px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-700"
          >
            <option value="PEDIDO">Documento: PEDIDO DE VENDA</option>
            <option value="ORCAMENTO">Documento: ORÇAMENTO / PROPOSTA</option>
          </select>

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
          >
            <Save className="w-4 h-4" />
            <span>Salvar & Visualizar Espelho</span>
          </button>
        </div>
      </div>

      {/* BLOCO 1: CABEÇALHO DO CLIENTE & COMERCIAL (EXPANSÍVEL / RETRÁTIL) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all">
        <div className="p-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-white">
          <div 
            onClick={() => setActiveAccordionSection(activeAccordionSection === 'CLIENTE' ? 'ITENS' : 'CLIENTE')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#e6f7f2] flex items-center justify-center text-[#10b981] font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 group-hover:text-[#10b981] transition-colors">
                <span>1. Dados do Cliente e Condições Comerciais</span>
                {clienteNome && activeAccordionSection !== 'CLIENTE' && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-normal">
                    {clienteNome} {condicoesPagamento ? `(${condicoesPagamento})` : ''}
                  </span>
                )}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Autopreenchimento rápido com clientes cadastrados */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Buscar Cliente:</span>
              <select
                onChange={(e) => {
                  handleSelectCliente(e.target.value);
                  if (activeAccordionSection !== 'CLIENTE') setActiveAccordionSection('CLIENTE');
                }}
                className="text-xs px-3 py-1.5 rounded-xl border border-slate-200/90 bg-slate-50 font-medium text-slate-700 focus:outline-none cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>Selecione para preencher rápido...</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.cnpj}>
                    {c.nome_fantasia || c.razao_social} ({c.cnpj})
                  </option>
                ))}
              </select>
            </div>

            {/* Botão Retrair / Expandir Estilo Imagem */}
            <button
              type="button"
              onClick={() => setActiveAccordionSection(activeAccordionSection === 'CLIENTE' ? 'ITENS' : 'CLIENTE')}
              className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors"
              title={activeAccordionSection === 'CLIENTE' ? 'Retrair seção' : 'Expandir seção'}
            >
              {activeAccordionSection === 'CLIENTE' ? (
                <ChevronUp className="w-5 h-5 text-rose-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {activeAccordionSection === 'CLIENTE' && (
          <div className="p-6 space-y-4 animate-in fade-in duration-200">

        {/* Linha 1 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6">
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Nome (Razão Social / Fantasia) *
            </label>
            <input
              type="text"
              required
              value={clienteNome}
              onChange={(e) => setClienteNome(e.target.value)}
              placeholder="Ex: GE ou METALURGICA ALVORADA"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase font-medium"
            />
          </div>

          <div className="md:col-span-3">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold text-slate-700 uppercase">
                Comprador
              </label>
              {selectedClienteObj?.compradores && selectedClienteObj.compradores.length > 0 && (
                <span className="text-[10px] font-semibold text-blue-600">
                  {selectedClienteObj.compradores.length} cadastrado(s)
                </span>
              )}
            </div>
            {selectedClienteObj?.compradores && selectedClienteObj.compradores.length > 0 ? (
              <div className="flex gap-1.5">
                <select
                  value={comprador}
                  onChange={(e) => handleSelectComprador(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-blue-50/50 font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 uppercase"
                >
                  <option value="">Selecione o comprador...</option>
                  {selectedClienteObj.compradores.map(c => (
                    <option key={c.id} value={c.nome}>
                      {c.nome} {c.cargo_depto ? `(${c.cargo_depto})` : ''} {c.is_principal ? '★' : ''}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={comprador}
                  onChange={(e) => setComprador(e.target.value)}
                  placeholder="Ou digite..."
                  title="Digite outro nome se necessário"
                  className="w-1/2 px-2 py-2 text-xs rounded-lg border border-slate-300 uppercase font-medium"
                />
              </div>
            ) : (
              <input
                type="text"
                value={comprador}
                onChange={(e) => setComprador(e.target.value)}
                placeholder="Ex: VITORIA"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 uppercase font-medium"
              />
            )}
          </div>

          <div className="md:col-span-3">
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Telefone
            </label>
            <input
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(11) 98765-4321"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-medium"
            />
          </div>
        </div>

        {/* Linha 2 */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
            Endereço Principal
          </label>
          <input
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            placeholder="Av. das Nações Unidas, 8500 - São Paulo/SP"
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-medium"
          />
        </div>

        {/* Linha 3 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-4">
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              CNPJ
            </label>
            <input
              type="text"
              value={clienteCnpj}
              onChange={(e) => setClienteCnpj(e.target.value)}
              placeholder="33.435.231/0001-87"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-medium"
            />
          </div>

          <div className="md:col-span-4">
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Inscrição Estadual
            </label>
            <input
              type="text"
              value={clienteIe}
              onChange={(e) => setClienteIe(e.target.value)}
              placeholder="086.123.456-0"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-medium"
            />
          </div>

          <div className="md:col-span-4">
            <label className="block text-[11px] font-bold text-blue-900 uppercase mb-1">
              Condições de Pagamento
            </label>
            <input
              type="text"
              value={condicoesPagamento}
              onChange={(e) => setCondicoesPagamento(e.target.value)}
              placeholder="Ex: 60 DDL, 30 DDL, À Vista"
              className="w-full px-3 py-2 text-sm rounded-lg border-2 border-blue-300 bg-blue-50/50 font-bold text-blue-900"
            />
          </div>
        </div>

        {/* Linha 4 & 5 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-7">
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Local para Entrega (Doca / Galpão / Cidade)
            </label>
            <input
              type="text"
              value={localEntrega}
              onChange={(e) => setLocalEntrega(e.target.value)}
              placeholder="Av. Industrial, 1500 - Galpão 3 - Campinas/SP"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-medium"
            />
          </div>

          <div className="md:col-span-5">
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Transportadora
            </label>
            <input
              type="text"
              value={transportadora}
              onChange={(e) => setTransportadora(e.target.value)}
              placeholder="Ex: FROTA PRÓPRIA (CARLOS) ou BRASPRESS"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-medium uppercase"
            />
          </div>

          <div className="md:col-span-7">
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Local para Cobrança
            </label>
            <input
              type="text"
              value={localCobranca}
              onChange={(e) => setLocalCobranca(e.target.value)}
              placeholder="Av. das Nações Unidas, 8500 - São Paulo/SP"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-medium"
            />
          </div>

          <div className="md:col-span-5">
            <label className="block text-[11px] font-bold text-slate-900 uppercase mb-1">
              Pedido Cliente n. (OC / PO do Cliente)
            </label>
            <input
              type="text"
              value={pedidoClienteN}
              onChange={(e) => setPedidoClienteN(e.target.value)}
              placeholder="Ex: 700118149"
              className="w-full px-3 py-2 text-sm rounded-lg border-2 border-slate-800 font-black text-slate-900"
            />
          </div>
        </div>

          </div>
        )}

      </div>

      {/* BLOCO 2: GRADE DE ITENS (EXPANSÍVEL / RETRÁTIL) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all">
        <div className="p-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-white">
          <div 
            onClick={() => setActiveAccordionSection(activeAccordionSection === 'ITENS' ? 'CLIENTE' : 'ITENS')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#e6f7f2] flex items-center justify-center text-[#10b981] font-bold">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 group-hover:text-[#10b981] transition-colors">
                <span>2. Grade de Itens do Pedido ({itens.length} de 11)</span>
                {activeAccordionSection !== 'ITENS' && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-normal">
                    {valorTotalPedido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} • {pesoTotalPedido.toFixed(2)} KG
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                Selecione produtos cadastrados ou digite códigos e descrições personalizadas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleOpenCotacoesModal(0)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200/90 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold transition-all"
              title="Acesso rápido ao histórico de cotações, compras anteriores e fornecedores"
            >
              <History className="w-3.5 h-3.5 text-slate-500" />
              <span>Consultar Cotações & Usinas</span>
            </button>

            <button
              type="button"
              onClick={() => {
                addItem();
                if (activeAccordionSection !== 'ITENS') setActiveAccordionSection('ITENS');
              }}
              disabled={itens.length >= 11}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#e6f7f2] text-[#0d9488] hover:bg-[#ccf0e5] rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Linha</span>
            </button>

            {/* Botão Retrair / Expandir Estilo Imagem */}
            <button
              type="button"
              onClick={() => setActiveAccordionSection(activeAccordionSection === 'ITENS' ? 'CLIENTE' : 'ITENS')}
              className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors ml-1"
              title={activeAccordionSection === 'ITENS' ? 'Retrair seção' : 'Expandir seção'}
            >
              {activeAccordionSection === 'ITENS' ? (
                <ChevronUp className="w-5 h-5 text-rose-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {activeAccordionSection === 'ITENS' && (
          <div className="p-6 space-y-4 animate-in fade-in duration-200">

        {/* Tabela de Itens Editável com suporte a dropdown flutuante */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl pb-16">
          <table className="w-full min-w-[900px] text-xs text-left border-collapse">
            <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300 uppercase text-[10px]">
              <tr>
                <th className="p-2 w-8 text-center border-r border-slate-300">#</th>
                <th className="p-2 w-16 border-r border-slate-300">UNID 1</th>
                <th className="p-2 w-20 border-r border-slate-300">QUANT 1</th>
                <th className="p-2 w-16 border-r border-slate-300">UNID 2</th>
                <th className="p-2 w-20 border-r border-slate-300">QUANT 2</th>
                <th className="p-2 w-20 border-r border-slate-300">PESO (KG)</th>
                <th className="p-2 w-24 border-r border-slate-300">CÓD</th>
                <th className="p-2 border-r border-slate-300">DESCRIÇÃO DOS PRODUTOS (COM MEDIDAS / NCM)</th>
                <th className="p-2 w-28 border-r border-slate-300 text-right">VALOR UNIT.</th>
                <th className="p-2 w-28 border-r border-slate-300 text-right">VALOR TOTAL</th>
                <th className="p-2 w-8 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {itens.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50/80">
                  <td className="p-2 text-center font-bold text-slate-600 bg-slate-50 border-r border-slate-200">
                    {idx + 1}
                  </td>
                  
                  {/* UNID 1 */}
                  <td className="p-1 border-r border-slate-200">
                    <input
                      type="text"
                      value={item.unid_1}
                      onChange={(e) => handleItemChange(idx, 'unid_1', e.target.value.toUpperCase())}
                      className="w-full p-1 text-center font-semibold border rounded uppercase"
                    />
                  </td>

                  {/* QUANT 1 */}
                  <td className="p-1 border-r border-slate-200">
                    <input
                      type="number"
                      step="any"
                      value={item.quant_1}
                      onChange={(e) => handleItemChange(idx, 'quant_1', parseFloat(e.target.value) || 0)}
                      className="w-full p-1 text-center font-bold border rounded"
                    />
                  </td>

                  {/* UNID 2 */}
                  <td className="p-1 border-r border-slate-200">
                    <input
                      type="text"
                      value={item.unid_2 || ''}
                      onChange={(e) => handleItemChange(idx, 'unid_2', e.target.value.toUpperCase())}
                      className="w-full p-1 text-center font-semibold border rounded uppercase"
                    />
                  </td>

                  {/* QUANT 2 */}
                  <td className="p-1 border-r border-slate-200">
                    <input
                      type="number"
                      step="any"
                      value={item.quant_2 || ''}
                      onChange={(e) => handleItemChange(idx, 'quant_2', parseFloat(e.target.value) || 0)}
                      className="w-full p-1 text-center border rounded"
                    />
                  </td>

                  {/* PESO COM CALCULADORA ASSISTIDA */}
                  <td className="p-1 border-r border-slate-200">
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        step="any"
                        value={item.peso || ''}
                        onChange={(e) => handleItemChange(idx, 'peso', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className="w-full p-1 pr-6 text-center font-semibold border rounded text-blue-950 text-xs focus:ring-1 focus:ring-[#10b981]"
                      />
                      <button
                        type="button"
                        onClick={() => handleOpenWeightModal(idx)}
                        title="Calcular Peso Teórico (Dimensões & Material)"
                        className="absolute right-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 p-0.5 rounded transition"
                      >
                        <Scale className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* CÓDIGO */}
                  <td className="p-1 border-r border-slate-200">
                    <input
                      type="text"
                      value={item.codigo}
                      onChange={(e) => handleItemChange(idx, 'codigo', e.target.value)}
                      placeholder="Cód."
                      className="w-full p-1 font-bold border rounded uppercase"
                    />
                  </td>

                  {/* DESCRIÇÃO COM AUTOCOMPLETE / SUGESTÃO INTELIGENTE */}
                  <td className="p-1 border-r border-slate-200 relative">
                    <div className="space-y-1 relative">
                      <input
                        type="text"
                        value={item.descricao}
                        onFocus={() => setFocusedProductRowIndex(idx)}
                        onChange={(e) => {
                          handleItemChange(idx, 'descricao', e.target.value);
                          setFocusedProductRowIndex(idx);
                        }}
                        placeholder="Ex: PLACA POLICARBONATO CRISTAL 2050 X 1000 X 4MM 39206100"
                        className="w-full p-1.5 text-xs font-semibold uppercase border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#10b981] bg-white text-slate-800"
                      />

                      {/* Dropdown Flutuante de Autocomplete com Produtos Cadastrados */}
                      {focusedProductRowIndex === idx && item.descricao && item.descricao.trim().length >= 1 && (
                        (() => {
                          const query = item.descricao.toLowerCase().trim();
                          const matchedProducts = produtos.filter(p => 
                            p.descricao.toLowerCase().includes(query) || 
                            p.codigo.toLowerCase().includes(query) ||
                            (p.categoria && p.categoria.toLowerCase().includes(query))
                          );

                          if (matchedProducts.length === 0) return null;

                          return (
                            <div 
                              className="absolute left-0 top-full mt-1 w-[380px] sm:w-[480px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 p-2 space-y-1 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1"
                              onMouseDown={(e) => e.preventDefault()} // Impede perda de foco do input ao clicar no item
                            >
                              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between border-b border-slate-100">
                                <span>Produtos Sugeridos ({matchedProducts.length})</span>
                                <span className="text-[#10b981] font-semibold text-[9px]">Clique para preencher</span>
                              </div>

                              {matchedProducts.map((p) => (
                                <button
                                  key={p.id}
                                  type="button"
                                  onClick={() => handleSelectProduto(idx, p)}
                                  className="w-full text-left p-2 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between gap-2 group border border-transparent hover:border-slate-100"
                                >
                                  <div className="overflow-hidden">
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono font-bold text-[11px] text-slate-900 px-1.5 py-0.5 rounded bg-slate-100 group-hover:bg-[#e6f7f2] group-hover:text-[#0d9488] transition-colors">
                                        {p.codigo}
                                      </span>
                                      <span className="text-[10px] font-bold text-slate-500 uppercase truncate">
                                        {p.categoria || 'Geral'}
                                      </span>
                                    </div>
                                    <p className="font-semibold text-xs text-slate-800 uppercase mt-0.5 group-hover:text-[#0d9488] transition-colors line-clamp-1">
                                      {p.descricao}
                                    </p>
                                  </div>

                                  <div className="text-right shrink-0">
                                    <span className="font-bold text-xs text-emerald-600 block">
                                      {p.preco_venda_padrao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                      por {p.unidade_primaria} {p.peso_unitario ? `• ${p.peso_unitario}kg` : ''}
                                    </span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          );
                        })()
                      )}

                      {/* Sugestão de produtos rápidos + Botão de Cotações */}
                      <div className="flex items-center justify-between gap-1 overflow-x-auto text-[9px] text-slate-400 pt-0.5">
                        <div className="flex gap-1 items-center">
                          <span className="text-slate-400 text-[9px]">Atalhos:</span>
                          {produtos.slice(0, 3).map(p => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => handleSelectProduto(idx, p)}
                              className="bg-slate-100 hover:bg-[#e6f7f2] hover:text-[#0d9488] text-slate-700 px-1.5 py-0.5 rounded-md whitespace-nowrap transition-colors font-medium"
                            >
                              + {p.codigo}
                            </button>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenCotacoesModal(idx)}
                          className="flex items-center gap-1 font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200 whitespace-nowrap transition-colors"
                          title="Consultar cotações e compras para este produto"
                        >
                          <History className="w-3 h-3 text-slate-400" />
                          <span>Cotações & Compras</span>
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* VALOR UNITÁRIO */}
                  <td className="p-1 border-r border-slate-200">
                    <input
                      type="number"
                      step="0.01"
                      value={item.valor_unitario}
                      onChange={(e) => handleItemChange(idx, 'valor_unitario', parseFloat(e.target.value) || 0)}
                      className="w-full p-1 text-right font-semibold border rounded"
                    />
                  </td>

                  {/* VALOR TOTAL */}
                  <td className="p-1 border-r border-slate-200 text-right pr-2 font-black text-blue-900">
                    {item.valor_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>

                  {/* EXCLUIR */}
                  <td className="p-1 text-center">
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      disabled={itens.length === 1}
                      className="text-slate-400 hover:text-red-600 disabled:opacity-20 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold border-t border-slate-300">
                <td colSpan={5} className="p-2 text-right uppercase text-[11px] border-r border-slate-300">
                  Peso Total Estimado da Carga:
                </td>
                <td className="p-2 text-center text-blue-950 font-black border-r border-slate-300">
                  {pesoTotalPedido.toFixed(2)} KG
                </td>
                <td colSpan={2} className="p-2 text-right uppercase text-[11px] border-r border-slate-300">
                  Valor Total do Pedido:
                </td>
                <td className="p-2 text-right pr-2 text-sm font-black text-blue-900">
                  {valorTotalPedido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

          </div>
        )}
      </div>

      {/* BLOCO 3: VENDEDOR, COMISSÕES & NOTAS FISCAIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Vendedor & Comissões */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Calculator className="w-4 h-4 text-blue-600" />
            <span>3. Vendedor & Rateio / Comissão</span>
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Vendedor / Representante
              </label>
              <select
                value={vendedorNome}
                onChange={(e) => setVendedorNome(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-bold uppercase"
              >
                {user?.nome && !vendedores.some(v => v.nome === user.nome) && (
                  <option value={user.nome}>
                    {user.nome} (Você)
                  </option>
                )}
                {vendedores.map(v => (
                  <option key={v.id} value={v.nome}>
                    {v.nome}
                  </option>
                ))}
                <option value="LUCC BISPO">LUCC BISPO</option>
                <option value="OUTRO">OUTRO VENDEDOR</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Valor da Comissão (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={valorComissao}
                onChange={(e) => setValorComissao(parseFloat(e.target.value) || 0)}
                placeholder="307,18"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-bold text-emerald-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Observações Internas
            </label>
            <textarea
              rows={2}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Instruções para a expedição, horários de entrega ou notas sobre corte..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
            />
          </div>
        </div>

        {/* Lançamento Inicial de Nota Fiscal (NF) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <FileCheck className="w-4 h-4 text-blue-600" />
            <span>4. Expedição / Nota Fiscal Vinculada</span>
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Número da NF
              </label>
              <input
                type="text"
                value={nfs[0]?.numero_nf || ''}
                onChange={(e) => {
                  const novas = [...nfs];
                  novas[0] = { ...novas[0], numero_nf: e.target.value };
                  setNfs(novas);
                }}
                placeholder="Ex: 004821"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                ICMS %
              </label>
              <input
                type="number"
                step="any"
                value={nfs[0]?.icms_percent || 18}
                onChange={(e) => {
                  const novas = [...nfs];
                  novas[0] = { ...novas[0], icms_percent: parseFloat(e.target.value) || 0 };
                  setNfs(novas);
                }}
                placeholder="18"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Peso Total NF (KG)
              </label>
              <input
                type="number"
                step="any"
                value={nfs[0]?.peso_total || (pesoTotalPedido || '')}
                onChange={(e) => {
                  const novas = [...nfs];
                  novas[0] = { ...novas[0], peso_total: parseFloat(e.target.value) || 0 };
                  setNfs(novas);
                }}
                placeholder="Ex: 9.84"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Espécie / Embalagem
              </label>
              <input
                type="text"
                value={nfs[0]?.especie || 'VOLUMES'}
                onChange={(e) => {
                  const novas = [...nfs];
                  novas[0] = { ...novas[0], especie: e.target.value.toUpperCase() };
                  setNfs(novas);
                }}
                placeholder="Ex: 1 VOLUME / FEIXES"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-semibold uppercase"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Botão Final */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
        >
          <Save className="w-4 h-4" />
          <span>Salvar & Emitir Espelho do Pedido</span>
        </button>
      </div>

      {/* TOAST DE FEEDBACK DE PREÇO APLICADO */}
      {appliedToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl font-bold text-xs flex items-center gap-2.5 animate-bounce">
          <Check className="w-4 h-4 text-white" />
          <span>{appliedToast}</span>
        </div>
      )}

      {/* MODAL / SLIDE-OVER DE CONSULTA RÁPIDA DE COTAÇÕES E USINAS */}
      {showCotacoesModal && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end animate-fadeIn no-print">
          <div className="w-full sm:max-w-xl md:w-1/2 lg:w-1/2 bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 overflow-y-auto">
            
            {/* CABEÇALHO DO MODAL CLEAN MODERNO */}
            <div className="h-20 px-6 sm:px-8 border-b border-slate-100 bg-white flex items-center justify-between sticky top-0 z-20">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#e6f7f2] text-[#10b981] flex items-center justify-center font-bold">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
                    <span>Consulta de Cotações & Usinas</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      Item #{activeItemIndexForModal + 1}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Histórico praticado e tabela de usinas parceiras
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCotacoesModal(false)}
                className="w-9 h-9 rounded-2xl border border-slate-200/80 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* CORPO DO MODAL */}
            <div className="p-6 space-y-5 flex-1 bg-slate-50">
              
              {/* CAMPO DE BUSCA RÁPIDA NO MODAL */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Pesquisar por Código, Descrição ou Nome do Cliente / Usina
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={modalSearchQuery}
                    onChange={(e) => setModalSearchQuery(e.target.value)}
                    placeholder="Ex: 450, Policarbonato, Tubo Inox, GE..."
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-semibold uppercase"
                  />
                </div>
              </div>

              {/* STATS RÁPIDAS DO ITEM */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Preço Médio Cotado</p>
                  <p className="text-base font-black text-blue-900 mt-0.5">
                    {statsCotacao.avg ? statsCotacao.avg.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}
                  </p>
                  <span className="text-[9px] text-slate-500 font-medium">({statsCotacao.totalCotacoes} ocorrências)</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-[9px] font-bold text-emerald-600 uppercase">Menor Preço Praticado</p>
                  <p className="text-base font-black text-emerald-700 mt-0.5">
                    {statsCotacao.min ? statsCotacao.min.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}
                  </p>
                  <span className="text-[9px] text-emerald-600 font-medium">Melhor histórico</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-[9px] font-bold text-purple-600 uppercase">Maior Preço Cotado</p>
                  <p className="text-base font-black text-purple-700 mt-0.5">
                    {statsCotacao.max ? statsCotacao.max.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}
                  </p>
                  <span className="text-[9px] text-slate-500 font-medium">Limite superior</span>
                </div>
              </div>

              {/* TABS DO MODAL */}
              <div className="flex border-b border-slate-200 gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedTabCotacoes('HISTORICO')}
                  className={`pb-2.5 px-1 text-xs font-semibold transition-all border-b-2 ${
                    selectedTabCotacoes === 'HISTORICO'
                      ? 'border-[#10b981] text-[#0d9488] font-bold'
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Cotações & Pedidos Anteriores ({historicalQuotes.length})
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTabCotacoes('FORNECEDORES')}
                  className={`pb-2.5 px-1 text-xs font-semibold transition-all border-b-2 ${
                    selectedTabCotacoes === 'FORNECEDORES'
                      ? 'border-[#10b981] text-[#0d9488] font-bold'
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Usinas & Fornecedores ({filteredFornecedoresModal.length})
                </button>
              </div>

              {/* CONTEÚDO DA ABA 1: HISTÓRICO DE PEDIDOS */}
              {selectedTabCotacoes === 'HISTORICO' && (
                <div className="space-y-3">
                  {historicalQuotes.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-xs text-slate-400">
                      Nenhum histórico de cotação ou compra encontrado para o termo pesquisado.
                    </div>
                  ) : (
                    historicalQuotes.map((q, idx) => (
                      <div 
                        key={idx} 
                        className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all space-y-2"
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-blue-900 text-xs">#{q.numeroPedido}</span>
                            <span className="text-[10px] font-semibold text-slate-400">
                              {new Date(q.dataEmissao).toLocaleDateString('pt-BR')}
                            </span>
                          </div>

                          <span className="text-sm font-black text-emerald-600">
                            {q.valorUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} / {q.unid}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Cliente</span>
                            <span className="font-bold text-slate-800 uppercase">{q.clienteNome}</span>
                            {q.comprador && (
                              <div className="text-[10px] text-slate-500">Comprador: {q.comprador}</div>
                            )}
                          </div>

                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Item / Vendedor</span>
                            <span className="font-semibold text-slate-700 truncate block">{q.descricao}</span>
                            <div className="text-[10px] text-slate-500">Vendedor: {q.vendedorNome || 'Lucc Bispo'}</div>
                          </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleApplyPriceFromModal(q.valorUnitario)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs transition-all"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Aplicar Preço de {q.valorUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* CONTEÚDO DA ABA 2: USINAS E FORNECEDORES */}
              {selectedTabCotacoes === 'FORNECEDORES' && (
                <div className="space-y-3">
                  {filteredFornecedoresModal.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-xs text-slate-400">
                      Nenhuma usina ou fornecedor cadastrado para esta categoria.
                    </div>
                  ) : (
                    filteredFornecedoresModal.map((f) => (
                      <div 
                        key={f.id} 
                        className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all space-y-2"
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <div>
                            <h4 className="font-black text-slate-900 text-xs uppercase">{f.nome_fantasia || f.razao_social}</h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                              {f.categoria_material}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Prazo Médio</span>
                            <span className="font-extrabold text-indigo-950 text-xs">{f.prazo_medio_dias || 3} dias</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Contato Comercial Usina</span>
                            <span className="font-semibold text-slate-800">{f.contato_vendedor || 'Vendas Internas'}</span>
                            <div className="text-[10px] text-blue-600 font-bold">{f.telefone}</div>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Condição Padrão</span>
                            <span className="font-bold text-slate-800">{f.condicoes_pagamento_padrao || '28 DDL'}</span>
                            <div className="text-[10px] text-slate-500">{f.cidade}/{f.uf}</div>
                          </div>
                        </div>

                        {f.observacoes && (
                          <div className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                            <strong>Obs Usina:</strong> {f.observacoes}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

            </div>

            {/* RODAPÉ DO MODAL */}
            <div className="p-5 border-t border-slate-100 bg-white flex justify-end">
              <button
                type="button"
                onClick={() => setShowCotacoesModal(false)}
                className="px-5 py-2.5 rounded-2xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors"
              >
                Fechar Consulta
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL CALCULADORA DE PESO TEÓRICO (ENGENHARIA & MATERIAIS) */}
      {showWeightModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
            
            {/* CABEÇALHO DO MODAL */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#10b981] flex items-center justify-center font-black">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <span>Calculadora de Peso Teórico</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Item #{calcRowIndex + 1}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cálculo exato por geometria (chapas, tubos, barras) e densidade metalúrgica / polímeros
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowWeightModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* CORPO DO MODAL */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-white">
              
              {/* TABS DE GEOMETRIA */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Formato Geométrico:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'CHAPA', label: 'Chapa / Placa' },
                    { id: 'TUBO_REDONDO', label: 'Tubo Redondo' },
                    { id: 'TUBO_QUADRADO', label: 'Tubo Quadrado' },
                    { id: 'BARRA_REDONDA', label: 'Barra Redonda' }
                  ].map((geo) => (
                    <button
                      key={geo.id}
                      type="button"
                      onClick={() => setCalcParams({ ...calcParams, geometria: geo.id as GeometriaTipo })}
                      className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all ${
                        calcParams.geometria === geo.id
                          ? 'border-[#10b981] bg-emerald-50/70 text-emerald-800 shadow-2xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {geo.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* SELEÇÃO DO MATERIAL & DENSIDADE */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Material & Liga (Densidade):</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select
                    value={calcParams.materialKey}
                    onChange={(e) => setCalcParams({ ...calcParams, materialKey: e.target.value })}
                    className="p-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
                  >
                    {Object.values(MATERIAIS_DENSIDADE).map((mat) => (
                      <option key={mat.id} value={mat.id}>
                        {mat.nome} ({mat.densidade_g_cm3} g/cm³)
                      </option>
                    ))}
                  </select>

                  <div className="bg-slate-50 rounded-xl border border-slate-200/80 p-2.5 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Densidade Base:</span>
                    <span className="font-extrabold text-slate-900">
                      {MATERIAIS_DENSIDADE[calcParams.materialKey]?.densidade_g_cm3 || 7.93} g/cm³
                    </span>
                  </div>
                </div>
              </div>

              {/* DIMENSÕES ESPECÍFICAS DA GEOMETRIA */}
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-4">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span>Dimensões do Perfil</span>
                  <span className="text-[10px] text-slate-400 font-normal lowercase">(em milímetros e metros)</span>
                </h4>

                {/* SE CHAPA / PLACA */}
                {calcParams.geometria === 'CHAPA' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Espessura (mm):</label>
                      <input
                        type="number"
                        step="any"
                        value={calcParams.espessura_mm || ''}
                        onChange={(e) => setCalcParams({ ...calcParams, espessura_mm: parseFloat(e.target.value) || 0 })}
                        placeholder="Ex: 4"
                        className="w-full p-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Largura (mm):</label>
                      <input
                        type="number"
                        step="any"
                        value={calcParams.largura_mm || ''}
                        onChange={(e) => setCalcParams({ ...calcParams, largura_mm: parseFloat(e.target.value) || 0 })}
                        placeholder="Ex: 1000"
                        className="w-full p-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Comprimento (mm):</label>
                      <input
                        type="number"
                        step="any"
                        value={calcParams.comprimento_mm || ''}
                        onChange={(e) => setCalcParams({ ...calcParams, comprimento_mm: parseFloat(e.target.value) || 0 })}
                        placeholder="Ex: 2000"
                        className="w-full p-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                )}

                {/* SE TUBO REDONDO */}
                {calcParams.geometria === 'TUBO_REDONDO' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Diâmetro Ext. OD (mm):</label>
                        <input
                          type="number"
                          step="any"
                          value={calcParams.diametro_externo_mm || ''}
                          onChange={(e) => setCalcParams({ ...calcParams, diametro_externo_mm: parseFloat(e.target.value) || 0 })}
                          placeholder="Ex: 25.4"
                          className="w-full p-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Espessura Parede (mm):</label>
                        <input
                          type="number"
                          step="any"
                          value={calcParams.parede_mm || ''}
                          onChange={(e) => setCalcParams({ ...calcParams, parede_mm: parseFloat(e.target.value) || 0 })}
                          placeholder="Ex: 1.5"
                          className="w-full p-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Comprimento (metros):</label>
                        <input
                          type="number"
                          step="any"
                          value={calcParams.comprimento_metros || ''}
                          onChange={(e) => setCalcParams({ ...calcParams, comprimento_metros: parseFloat(e.target.value) || 0 })}
                          placeholder="Ex: 6"
                          className="w-full p-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                    {/* Atalhos rápidos para polegadas comerciais */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Diâmetros Rápidos:</span>
                      {[
                        { label: '1/2" (12.7mm)', val: 12.7 },
                        { label: '3/4" (19.05mm)', val: 19.05 },
                        { label: '1" (25.4mm)', val: 25.4 },
                        { label: '1.1/2" (38.1mm)', val: 38.1 },
                        { label: '2" (50.8mm)', val: 50.8 },
                        { label: '3" (76.2mm)', val: 76.2 }
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => setCalcParams({ ...calcParams, diametro_externo_mm: item.val })}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 transition"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* SE TUBO QUADRADO / RETANGULAR */}
                {calcParams.geometria === 'TUBO_QUADRADO' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Lado A (mm):</label>
                      <input
                        type="number"
                        step="any"
                        value={calcParams.lado_a_mm || ''}
                        onChange={(e) => setCalcParams({ ...calcParams, lado_a_mm: parseFloat(e.target.value) || 0 })}
                        placeholder="Ex: 50"
                        className="w-full p-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Lado B (mm):</label>
                      <input
                        type="number"
                        step="any"
                        value={calcParams.lado_b_mm || ''}
                        onChange={(e) => setCalcParams({ ...calcParams, lado_b_mm: parseFloat(e.target.value) || 0 })}
                        placeholder="Ex: 50"
                        className="w-full p-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Parede (mm):</label>
                      <input
                        type="number"
                        step="any"
                        value={calcParams.parede_mm || ''}
                        onChange={(e) => setCalcParams({ ...calcParams, parede_mm: parseFloat(e.target.value) || 0 })}
                        placeholder="Ex: 2.0"
                        className="w-full p-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Comprimento (m):</label>
                      <input
                        type="number"
                        step="any"
                        value={calcParams.comprimento_metros || ''}
                        onChange={(e) => setCalcParams({ ...calcParams, comprimento_metros: parseFloat(e.target.value) || 0 })}
                        placeholder="Ex: 6"
                        className="w-full p-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                )}

                {/* SE BARRA REDONDA */}
                {calcParams.geometria === 'BARRA_REDONDA' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Diâmetro da Barra (mm):</label>
                      <input
                        type="number"
                        step="any"
                        value={calcParams.diametro_barra_mm || ''}
                        onChange={(e) => setCalcParams({ ...calcParams, diametro_barra_mm: parseFloat(e.target.value) || 0 })}
                        placeholder="Ex: 25.4"
                        className="w-full p-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Comprimento (metros):</label>
                      <input
                        type="number"
                        step="any"
                        value={calcParams.comprimento_metros || ''}
                        onChange={(e) => setCalcParams({ ...calcParams, comprimento_metros: parseFloat(e.target.value) || 0 })}
                        placeholder="Ex: 3 ou 6"
                        className="w-full p-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                )}

                {/* QUANTIDADE */}
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Quantidade de Peças / Peças na Linha:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="any"
                      min="1"
                      value={calcParams.quantidade || 1}
                      onChange={(e) => setCalcParams({ ...calcParams, quantidade: parseFloat(e.target.value) || 1 })}
                      className="w-24 p-1.5 text-xs text-center font-bold rounded-lg border border-slate-300 bg-white focus:ring-1 focus:ring-emerald-500"
                    />
                    <span className="text-xs text-slate-500 font-semibold">unid</span>
                  </div>
                </div>

              </div>

              {/* CARD DE RESULTADOS LIVE */}
              {(() => {
                const res = calcularPesoTeorico(calcParams);
                return (
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-4 text-white shadow-md">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="text-emerald-100 text-[10px] font-bold uppercase tracking-wider block">
                          Peso Unitário Calculado
                        </span>
                        <div className="text-2xl font-black">
                          {res.pesoUnitarioKg} <span className="text-sm font-semibold">kg / pç</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-emerald-100 text-[10px] font-bold uppercase tracking-wider block">
                          Peso Total ({calcParams.quantidade || 1} pçs)
                        </span>
                        <div className="text-3xl font-black text-amber-200">
                          {res.pesoTotalKg} <span className="text-base font-semibold text-white">kg</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/20 text-[11px] text-emerald-50 flex items-center justify-between">
                      <span className="font-mono truncate">{res.formulaExplicativa}</span>
                      <span className="font-semibold text-white/90 shrink-0 ml-2">Fórmula ABNT / Usina</span>
                    </div>
                  </div>
                );
              })()}

            </div>

            {/* RODAPÉ DO MODAL */}
            <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowWeightModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleApplyWeightFromModal}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02]"
              >
                <Check className="w-4 h-4" />
                <span>Aplicar Peso no Item #{calcRowIndex + 1}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* TOAST FLUTUANTE DE FEEDBACK */}
      {appliedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4" />
          <span>{appliedToast}</span>
        </div>
      )}

    </form>
  );
}
