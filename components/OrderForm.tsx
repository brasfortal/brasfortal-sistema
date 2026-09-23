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
  Package
} from 'lucide-react';
import { Pedido, ItemPedido, ExpedicaoNF, Cliente, Produto, Vendedor } from '@/lib/types';
import { StorageService } from '@/lib/storage';

interface Props {
  initialPedido?: Pedido;
}

export default function OrderForm({ initialPedido }: Props) {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);

  // Form State
  const [tipo, setTipo] = useState<'ORCAMENTO' | 'PEDIDO'>(initialPedido?.tipo || 'PEDIDO');
  const [dataEmissao, setDataEmissao] = useState(
    initialPedido?.data_emissao || new Date().toISOString().split('T')[0]
  );
  
  // Cliente
  const [clienteNome, setClienteNome] = useState(initialPedido?.cliente_nome || '');
  const [clienteCnpj, setClienteCnpj] = useState(initialPedido?.cliente_cnpj || '');
  const [clienteIe, setClienteIe] = useState(initialPedido?.cliente_ie || '');
  const [comprador, setComprador] = useState(initialPedido?.comprador || '');
  const [telefone, setTelefone] = useState(initialPedido?.telefone || '');
  const [endereco, setEndereco] = useState(initialPedido?.endereco || '');

  // Logística e Condições
  const [condicoesPagamento, setCondicoesPagamento] = useState(initialPedido?.condicoes_pagamento || '60 DDL');
  const [pedidoClienteN, setPedidoClienteN] = useState(initialPedido?.pedido_cliente_n || '');
  const [localEntrega, setLocalEntrega] = useState(initialPedido?.local_entrega || '');
  const [transportadora, setTransportadora] = useState(initialPedido?.transportadora || '');
  const [localCobranca, setLocalCobranca] = useState(initialPedido?.local_cobranca || '');

  // Vendedor
  const [vendedorNome, setVendedorNome] = useState(initialPedido?.vendedor_nome || 'LUCC BISPO');
  const [valorComissao, setValorComissao] = useState<number>(initialPedido?.valor_comissao || 0);

  // Itens
  const [itens, setItens] = useState<ItemPedido[]>(
    initialPedido?.itens || [
      {
        id: 'it-temp-1',
        item_numero: 1,
        unid_1: 'PÇ',
        quant_1: 1,
        unid_2: 'PÇ',
        quant_2: 1,
        peso: 9.84,
        codigo: '450',
        descricao: 'PLACA POLICARBONATO CRISTAL. 2050 X 1000 X 4MM 39206100',
        valor_unitario: 505.70,
        valor_total: 505.70
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

    if (initialPedido?.cliente_cnpj) {
      const match = listCli.find(c => c.cnpj === initialPedido.cliente_cnpj);
      if (match) setSelectedClienteObj(match);
    }
  }, [initialPedido]);

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

    novosItens[index] = item;
    setItens(novosItens);
  };

  // Selecionar Produto do catálogo para uma linha
  const handleSelectProduto = (index: number, produtoCodigo: string) => {
    const prod = produtos.find(p => p.codigo === produtoCodigo);
    if (prod) {
      const novosItens = [...itens];
      novosItens[index] = {
        ...novosItens[index],
        codigo: prod.codigo,
        descricao: prod.descricao,
        unid_1: prod.unidade_primaria,
        unid_2: prod.unidade_secundaria || prod.unidade_primaria,
        peso: (prod.peso_unitario || 0) * (novosItens[index].quant_1 || 1),
        valor_unitario: prod.preco_venda_padrao,
        valor_total: (novosItens[index].quant_1 || 1) * prod.preco_venda_padrao
      };
      setItens(novosItens);
    }
  };

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
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span>{initialPedido ? `Editar Pedido #${initialPedido.numero_pedido}` : 'Novo Espelho de Pedido'}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
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

      {/* BLOCO 1: CABEÇALHO DO CLIENTE & COMERCIAL */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>1. Dados do Cliente e Condições Comerciais</span>
          </h2>

          {/* Autopreenchimento rápido com clientes cadastrados */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Buscar Cliente:</span>
            <select
              onChange={(e) => handleSelectCliente(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-md border border-slate-300 bg-slate-50 font-medium text-slate-700"
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
        </div>

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

      {/* BLOCO 2: GRADE DE ITENS (Até 11 Itens conforme ficha) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-600" />
              <span>2. Grade de Itens do Pedido ({itens.length} de 11)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Selecione produtos cadastrados ou digite códigos e descrições personalizadas
            </p>
          </div>

          <button
            type="button"
            onClick={addItem}
            disabled={itens.length >= 11}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Linha</span>
          </button>
        </div>

        {/* Tabela de Itens Editável */}
        <div className="overflow-x-auto border border-slate-300 rounded-lg">
          <table className="w-full text-xs text-left border-collapse">
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

                  {/* PESO */}
                  <td className="p-1 border-r border-slate-200">
                    <input
                      type="number"
                      step="any"
                      value={item.peso || ''}
                      onChange={(e) => handleItemChange(idx, 'peso', parseFloat(e.target.value) || 0)}
                      className="w-full p-1 text-center font-semibold border rounded text-blue-950"
                    />
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

                  {/* DESCRIÇÃO */}
                  <td className="p-1 border-r border-slate-200">
                    <div className="space-y-1">
                      <input
                        type="text"
                        value={item.descricao}
                        onChange={(e) => handleItemChange(idx, 'descricao', e.target.value)}
                        placeholder="Ex: PLACA POLICARBONATO CRISTAL 2050 X 1000 X 4MM 39206100"
                        className="w-full p-1 text-xs font-semibold uppercase border rounded"
                      />
                      {/* Sugestão de produtos rápidos */}
                      <div className="flex gap-1 overflow-x-auto text-[9px] text-slate-400">
                        {produtos.slice(0, 3).map(p => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => handleSelectProduto(idx, p.codigo)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-1 py-0.5 rounded whitespace-nowrap"
                          >
                            + {p.codigo}
                          </button>
                        ))}
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

    </form>
  );
}
