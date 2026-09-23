'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Building2, 
  Package, 
  Users, 
  Truck, 
  Factory,
  Plus, 
  Search, 
  Save, 
  Trash2,
  X,
  Scale,
  Edit,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  UserCheck,
  User,
  Star,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Cliente, Fornecedor, Produto, Vendedor, Motorista, Veiculo, Comprador } from '@/lib/types';
import { StorageService } from '@/lib/storage';

function CadastrosContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  const [tab, setTab] = useState<'PRODUTOS' | 'CLIENTES' | 'FORNECEDORES' | 'MOTORISTAS'>('PRODUTOS');
  const [drawerAberto, setDrawerAberto] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [drawerSubTipo, setDrawerSubTipo] = useState<'MOTORISTA' | 'VEICULO'>('MOTORISTA');
  const [searchTerm, setSearchTerm] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  
  // Estado para expandir lista de compradores nos cards de clientes
  const [expandedClienteId, setExpandedClienteId] = useState<string | null>(null);

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);

  // Sincronizar com parâmetro da URL da sidebar
  useEffect(() => {
    if (tabParam === 'clientes') setTab('CLIENTES');
    else if (tabParam === 'fornecedores') setTab('FORNECEDORES');
    else if (tabParam === 'motoristas') setTab('MOTORISTAS');
    else if (tabParam === 'produtos') setTab('PRODUTOS');
    setSearchTerm('');
  }, [tabParam]);

  // Fechar drawer ao pressionar tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerAberto(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const exibirSucesso = (msg: string) => {
    setMensagemSucesso(msg);
    setTimeout(() => setMensagemSucesso(null), 3000);
  };

  // Form State: PRODUTO
  const [prodForm, setProdForm] = useState<Partial<Produto>>({
    codigo: '',
    descricao: '',
    ncm: '',
    categoria: 'Tubos Inox',
    unidade_primaria: 'PÇ',
    unidade_secundaria: 'KG',
    peso_unitario: 0,
    preco_venda_padrao: 0,
    estoque_atual: 100
  });

  // Form State: CLIENTE
  const [cliForm, setCliForm] = useState<Partial<Cliente>>({
    razao_social: '',
    nome_fantasia: '',
    cnpj: '',
    inscricao_estadual: '',
    comprador_padrao: '',
    telefone: '',
    email: '',
    endereco_completo: '',
    condicao_pagamento_padrao: '30 DDL',
    transportadora_preferencial: 'FROTA PRÓPRIA',
    compradores: []
  });

  // Estado para lista de compradores dentro do Drawer do Cliente
  const [compradoresTemp, setCompradoresTemp] = useState<Comprador[]>([]);
  const [formNovoCompradorAberto, setFormNovoCompradorAberto] = useState(false);
  const [editingCompradorId, setEditingCompradorId] = useState<string | null>(null);

  const [compradorForm, setCompradorForm] = useState<Partial<Comprador>>({
    nome: '',
    cargo_depto: '',
    telefone: '',
    ramal: '',
    celular_whatsapp: '',
    email: '',
    centro_custo_local: '',
    observacoes: '',
    is_principal: false
  });

  // Form State: FORNECEDOR
  const [fornForm, setFornForm] = useState<Partial<Fornecedor>>({
    razao_social: '',
    nome_fantasia: '',
    cnpj: '',
    inscricao_estadual: '',
    categoria_material: 'Tubos Inox (304 / 316L)',
    contato_vendedor: '',
    telefone: '',
    email: '',
    endereco_galpao: '',
    cidade: 'São Paulo',
    uf: 'SP',
    condicoes_pagamento_padrao: '28 DDL',
    prazo_medio_dias: 3,
    observacoes: ''
  });

  // Form State: MOTORISTA
  const [motForm, setMotForm] = useState<Partial<Motorista>>({
    nome: '',
    telefone: '',
    cnh: '',
    codigo_acesso: ''
  });

  // Form State: VEÍCULO
  const [veicForm, setVeicForm] = useState<Partial<Veiculo>>({
    modelo: '',
    placa: '',
    capacidade_peso_kg: 5000
  });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = () => {
    setClientes(StorageService.getClientes());
    setFornecedores(StorageService.getFornecedores());
    setProdutos(StorageService.getProdutos());
    setMotoristas(StorageService.getMotoristas());
    setVeiculos(StorageService.getVeiculos());
  };

  // ABRIR FORMULÁRIO PARA CRIAR (NOVO)
  const handleNovoCadastro = () => {
    setEditingId(null);
    if (tab === 'PRODUTOS') {
      setProdForm({
        codigo: '',
        descricao: '',
        ncm: '',
        categoria: 'Tubos Inox',
        unidade_primaria: 'PÇ',
        unidade_secundaria: 'KG',
        peso_unitario: 0,
        preco_venda_padrao: 0,
        estoque_atual: 100
      });
    } else if (tab === 'CLIENTES') {
      setCliForm({
        razao_social: '',
        nome_fantasia: '',
        cnpj: '',
        inscricao_estadual: '',
        comprador_padrao: '',
        telefone: '',
        email: '',
        endereco_completo: '',
        condicao_pagamento_padrao: '30 DDL',
        transportadora_preferencial: 'FROTA PRÓPRIA',
        compradores: []
      });
      setCompradoresTemp([]);
      setFormNovoCompradorAberto(false);
    } else if (tab === 'FORNECEDORES') {
      setFornForm({
        razao_social: '',
        nome_fantasia: '',
        cnpj: '',
        inscricao_estadual: '',
        categoria_material: 'Tubos Inox (304 / 316L)',
        contato_vendedor: '',
        telefone: '',
        email: '',
        endereco_galpao: '',
        cidade: 'São Paulo',
        uf: 'SP',
        condicoes_pagamento_padrao: '28 DDL',
        prazo_medio_dias: 3,
        observacoes: ''
      });
    } else {
      setMotForm({ nome: '', telefone: '', cnh: '', codigo_acesso: '' });
      setVeicForm({ modelo: '', placa: '', capacidade_peso_kg: 5000 });
    }
    setDrawerAberto(true);
  };

  // ABRIR FORMULÁRIO PARA EDITAR (UPDATE)
  const handleEditarProduto = (prod: Produto) => {
    setEditingId(prod.id);
    setProdForm({ ...prod });
    setTab('PRODUTOS');
    setDrawerAberto(true);
  };

  const handleEditarCliente = (cli: Cliente) => {
    setEditingId(cli.id);
    setCliForm({ ...cli });
    setCompradoresTemp(cli.compradores || []);
    setFormNovoCompradorAberto(false);
    setTab('CLIENTES');
    setDrawerAberto(true);
  };

  const handleEditarFornecedor = (forn: Fornecedor) => {
    setEditingId(forn.id);
    setFornForm({ ...forn });
    setTab('FORNECEDORES');
    setDrawerAberto(true);
  };

  const handleEditarMotorista = (mot: Motorista) => {
    setEditingId(mot.id);
    setDrawerSubTipo('MOTORISTA');
    setMotForm({ ...mot });
    setTab('MOTORISTAS');
    setDrawerAberto(true);
  };

  const handleEditarVeiculo = (veic: Veiculo) => {
    setEditingId(veic.id);
    setDrawerSubTipo('VEICULO');
    setVeicForm({ ...veic });
    setTab('MOTORISTAS');
    setDrawerAberto(true);
  };

  // GERENCIAMENTO DA FICHA DO COMPRADOR NO DRAWER
  const handleAdicionarOuAtualizarComprador = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compradorForm.nome) return;

    let listaAtualizada = [...compradoresTemp];

    if (compradorForm.is_principal) {
      listaAtualizada = listaAtualizada.map(c => ({ ...c, is_principal: false }));
    }

    if (editingCompradorId) {
      listaAtualizada = listaAtualizada.map(c => {
        if (c.id === editingCompradorId) {
          return {
            ...c,
            nome: compradorForm.nome!.toUpperCase(),
            cargo_depto: compradorForm.cargo_depto,
            telefone: compradorForm.telefone || '',
            ramal: compradorForm.ramal,
            celular_whatsapp: compradorForm.celular_whatsapp,
            email: compradorForm.email || '',
            centro_custo_local: compradorForm.centro_custo_local,
            observacoes: compradorForm.observacoes,
            is_principal: compradorForm.is_principal || false
          };
        }
        return c;
      });
    } else {
      const isPrimeiro = listaAtualizada.length === 0;
      const novoComprador: Comprador = {
        id: `comp-${Date.now()}`,
        nome: compradorForm.nome!.toUpperCase(),
        cargo_depto: compradorForm.cargo_depto,
        telefone: compradorForm.telefone || '',
        ramal: compradorForm.ramal,
        celular_whatsapp: compradorForm.celular_whatsapp,
        email: compradorForm.email || '',
        centro_custo_local: compradorForm.centro_custo_local,
        observacoes: compradorForm.observacoes,
        is_principal: isPrimeiro || Boolean(compradorForm.is_principal)
      };
      listaAtualizada.push(novoComprador);
    }

    setCompradoresTemp(listaAtualizada);
    setCompradorForm({
      nome: '',
      cargo_depto: '',
      telefone: '',
      ramal: '',
      celular_whatsapp: '',
      email: '',
      centro_custo_local: '',
      observacoes: '',
      is_principal: false
    });
    setEditingCompradorId(null);
    setFormNovoCompradorAberto(false);
  };

  const handleEditarFichaComprador = (comp: Comprador) => {
    setEditingCompradorId(comp.id);
    setCompradorForm({ ...comp });
    setFormNovoCompradorAberto(true);
  };

  const handleRemoverComprador = (id: string) => {
    const filtrada = compradoresTemp.filter(c => c.id !== id);
    if (filtrada.length > 0 && !filtrada.some(c => c.is_principal)) {
      filtrada[0].is_principal = true;
    }
    setCompradoresTemp(filtrada);
  };

  const handleDefinirCompradorPrincipal = (id: string) => {
    const atualizada = compradoresTemp.map(c => ({
      ...c,
      is_principal: c.id === id
    }));
    setCompradoresTemp(atualizada);
  };

  // EXCLUIR (DELETE)
  const handleExcluirProduto = (prod: Produto) => {
    if (confirm(`Deseja realmente excluir o produto "${prod.codigo} - ${prod.descricao}"?`)) {
      const updated = StorageService.deleteProduto(prod.id);
      setProdutos(updated);
      exibirSucesso(`Produto ${prod.codigo} removido.`);
    }
  };

  const handleExcluirCliente = (cli: Cliente) => {
    if (confirm(`Deseja realmente excluir o cliente "${cli.nome_fantasia || cli.razao_social}"?`)) {
      const updated = StorageService.deleteCliente(cli.id);
      setClientes(updated);
      exibirSucesso(`Cliente removido.`);
    }
  };

  const handleExcluirFornecedor = (forn: Fornecedor) => {
    if (confirm(`Deseja realmente excluir o fornecedor "${forn.nome_fantasia || forn.razao_social}"?`)) {
      const updated = StorageService.deleteFornecedor(forn.id);
      setFornecedores(updated);
      exibirSucesso(`Fornecedor removido.`);
    }
  };

  const handleExcluirMotorista = (mot: Motorista) => {
    if (confirm(`Deseja excluir o motorista "${mot.nome}"?`)) {
      const updated = StorageService.deleteMotorista(mot.id);
      setMotoristas(updated);
      exibirSucesso(`Motorista removido.`);
    }
  };

  const handleExcluirVeiculo = (veic: Veiculo) => {
    if (confirm(`Deseja excluir o veículo placa "${veic.placa}"?`)) {
      const updated = StorageService.deleteVeiculo(veic.id);
      setVeiculos(updated);
      exibirSucesso(`Veículo removido.`);
    }
  };

  // SALVAR PRODUTO (CREATE / UPDATE)
  const handleSalvarProduto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.codigo || !prodForm.descricao) return;

    const prodCompleto: Produto = {
      id: editingId || `prod-${Date.now()}`,
      codigo: prodForm.codigo,
      descricao: prodForm.descricao,
      ncm: prodForm.ncm,
      categoria: prodForm.categoria,
      unidade_primaria: prodForm.unidade_primaria || 'PÇ',
      unidade_secundaria: prodForm.unidade_secundaria,
      peso_unitario: prodForm.peso_unitario || 0,
      preco_venda_padrao: prodForm.preco_venda_padrao || 0,
      estoque_atual: prodForm.estoque_atual || 100
    };

    StorageService.saveProduto(prodCompleto);
    loadAll();
    setDrawerAberto(false);
    exibirSucesso(editingId ? 'Produto atualizado com sucesso!' : 'Novo produto cadastrado com sucesso!');
  };

  // SALVAR CLIENTE (CREATE / UPDATE)
  const handleSalvarCliente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliForm.razao_social || !cliForm.cnpj) return;

    const compradorPrincipal = compradoresTemp.find(c => c.is_principal) || compradoresTemp[0];

    const cliCompleto: Cliente = {
      id: editingId || `cli-${Date.now()}`,
      razao_social: cliForm.razao_social,
      nome_fantasia: cliForm.nome_fantasia || cliForm.razao_social,
      cnpj: cliForm.cnpj,
      inscricao_estadual: cliForm.inscricao_estadual,
      comprador_padrao: compradorPrincipal ? compradorPrincipal.nome : (cliForm.comprador_padrao || ''),
      telefone: compradorPrincipal?.telefone || cliForm.telefone,
      email: compradorPrincipal?.email || cliForm.email,
      endereco_completo: cliForm.endereco_completo,
      local_entrega_padrao: cliForm.endereco_completo,
      local_cobranca_padrao: cliForm.endereco_completo,
      condicao_pagamento_padrao: cliForm.condicao_pagamento_padrao || '30 DDL',
      transportadora_preferencial: cliForm.transportadora_preferencial || 'FROTA PRÓPRIA',
      compradores: compradoresTemp
    };

    StorageService.saveCliente(cliCompleto);
    loadAll();
    setDrawerAberto(false);
    exibirSucesso(editingId ? 'Cliente atualizado com sucesso!' : 'Novo cliente cadastrado com sucesso!');
  };

  // SALVAR FORNECEDOR (CREATE / UPDATE)
  const handleSalvarFornecedor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fornForm.razao_social || !fornForm.cnpj) return;

    const fornCompleto: Fornecedor = {
      id: editingId || `forn-${Date.now()}`,
      razao_social: fornForm.razao_social,
      nome_fantasia: fornForm.nome_fantasia || fornForm.razao_social,
      cnpj: fornForm.cnpj,
      inscricao_estadual: fornForm.inscricao_estadual,
      categoria_material: fornForm.categoria_material || 'Tubos Inox (304 / 316L)',
      contato_vendedor: fornForm.contato_vendedor,
      telefone: fornForm.telefone || '(11) 3344-5566',
      email: fornForm.email,
      endereco_galpao: fornForm.endereco_galpao || '',
      cidade: fornForm.cidade || 'São Paulo',
      uf: fornForm.uf || 'SP',
      condicoes_pagamento_padrao: fornForm.condicoes_pagamento_padrao || '28 DDL',
      prazo_medio_dias: fornForm.prazo_medio_dias || 3,
      observacoes: fornForm.observacoes
    };

    StorageService.saveFornecedor(fornCompleto);
    loadAll();
    setDrawerAberto(false);
    exibirSucesso(editingId ? 'Fornecedor atualizado com sucesso!' : 'Novo fornecedor cadastrado com sucesso!');
  };

  // SALVAR MOTORISTA (CREATE / UPDATE)
  const handleSalvarMotorista = (e: React.FormEvent) => {
    e.preventDefault();
    if (!motForm.nome || !motForm.telefone) return;

    const motCompleto: Motorista = {
      id: editingId || `mot-${Date.now()}`,
      nome: motForm.nome,
      telefone: motForm.telefone,
      cnh: motForm.cnh,
      codigo_acesso: motForm.codigo_acesso || `MOT-${Date.now().toString().slice(-2)}`
    };

    StorageService.saveMotorista(motCompleto);
    loadAll();
    setDrawerAberto(false);
    exibirSucesso(editingId ? 'Motorista atualizado!' : 'Novo motorista cadastrado!');
  };

  // SALVAR VEÍCULO (CREATE / UPDATE)
  const handleSalvarVeiculo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!veicForm.modelo || !veicForm.placa) return;

    const veicCompleto: Veiculo = {
      id: editingId || `veic-${Date.now()}`,
      modelo: veicForm.modelo,
      placa: veicForm.placa.toUpperCase(),
      capacidade_peso_kg: veicForm.capacidade_peso_kg || 5000
    };

    StorageService.saveVeiculo(veicCompleto);
    loadAll();
    setDrawerAberto(false);
    exibirSucesso(editingId ? 'Veículo atualizado!' : 'Novo veículo cadastrado!');
  };

  // Filtros de busca
  const produtosFiltrados = produtos.filter(p => 
    p.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.ncm && p.ncm.includes(searchTerm)) ||
    (p.categoria && p.categoria.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const clientesFiltrados = clientes.filter(c => 
    c.razao_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.nome_fantasia && c.nome_fantasia.toLowerCase().includes(searchTerm.toLowerCase())) ||
    c.cnpj.includes(searchTerm) ||
    (c.comprador_padrao && c.comprador_padrao.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c.compradores && c.compradores.some(comp => comp.nome.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const fornecedoresFiltrados = fornecedores.filter(f =>
    f.razao_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.nome_fantasia && f.nome_fantasia.toLowerCase().includes(searchTerm.toLowerCase())) ||
    f.cnpj.includes(searchTerm) ||
    f.categoria_material.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.contato_vendedor && f.contato_vendedor.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (f.cidade && f.cidade.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const motoristasFiltrados = motoristas.filter(m =>
    m.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.telefone.includes(searchTerm) ||
    m.codigo_acesso.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const veiculosFiltrados = veiculos.filter(v =>
    v.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.placa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 w-full relative pb-12">
      
      {/* MENSAGEM FLUTUANTE DE SUCESSO (TOAST) */}
      {mensagemSucesso && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 font-bold text-xs animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>{mensagemSucesso}</span>
        </div>
      )}

      {/* CABEÇALHO DA PÁGINA */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            {tab === 'PRODUTOS' && <Package className="w-7 h-7 text-blue-600" />}
            {tab === 'CLIENTES' && <Building2 className="w-7 h-7 text-blue-600" />}
            {tab === 'FORNECEDORES' && <Factory className="w-7 h-7 text-blue-600" />}
            {tab === 'MOTORISTAS' && <Truck className="w-7 h-7 text-blue-600" />}
            <span>
              {tab === 'PRODUTOS' && 'Catálogo de Produtos & Metais'}
              {tab === 'CLIENTES' && 'Gestão de Clientes & Compradores'}
              {tab === 'FORNECEDORES' && 'Gestão de Fornecedores & Usinas'}
              {tab === 'MOTORISTAS' && 'Motoristas & Frota de Veículos'}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {tab === 'PRODUTOS' && 'Tubos, vigas, chapas e conexões com pesos teóricos, unidades e tabela de preços'}
            {tab === 'CLIENTES' && 'Base de clientes com CNPJ, Inscrição Estadual, fichas completas de compradores e prazos'}
            {tab === 'FORNECEDORES' && 'Usinas e distribuidores de metais, linhas de fornecimento e galpões de coleta'}
            {tab === 'MOTORISTAS' && 'Frota com placas, capacidade máxima em KG e motoristas do terminal mobile'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Alternador de Abas */}
          <div className="hidden sm:flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => setTab('PRODUTOS')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                tab === 'PRODUTOS' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-blue-600" />
              <span>Produtos ({produtos.length})</span>
            </button>

            <button
              onClick={() => setTab('CLIENTES')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                tab === 'CLIENTES' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Clientes ({clientes.length})</span>
            </button>

            <button
              onClick={() => setTab('FORNECEDORES')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                tab === 'FORNECEDORES' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Factory className="w-3.5 h-3.5 text-amber-600" />
              <span>Fornecedores ({fornecedores.length})</span>
            </button>

            <button
              onClick={() => setTab('MOTORISTAS')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                tab === 'MOTORISTAS' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Truck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Frota ({veiculos.length + motoristas.length})</span>
            </button>
          </div>

          {/* BOTÃO QUE ABRE O DRAWER PARA CRIAR NOVO */}
          <button
            onClick={handleNovoCadastro}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 hover:scale-[1.02] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>
              {tab === 'PRODUTOS' && 'Novo Produto / Metal'}
              {tab === 'CLIENTES' && 'Novo Cliente & Compradores'}
              {tab === 'FORNECEDORES' && 'Novo Fornecedor'}
              {tab === 'MOTORISTAS' && 'Novo Motorista / Veículo'}
            </span>
          </button>
        </div>
      </div>

      {/* BARRA DE BUSCA EM TELA CHEIA */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Buscar em ${tab === 'PRODUTOS' ? 'código, descrição, NCM...' : tab === 'CLIENTES' ? 'razão social, CNPJ, nome de qualquer comprador...' : tab === 'FORNECEDORES' ? 'fornecedor, material, CNPJ, cidade...' : 'motoristas ou placas...'}`}
          className="w-full text-xs bg-transparent focus:outline-none text-slate-800 placeholder-slate-400 font-medium"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ========================================================== */}
      {/* TABELA DE PRODUTOS / METAIS (CRUD READ / UPDATE / DELETE) */}
      {/* ========================================================== */}
      {tab === 'PRODUTOS' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                <tr>
                  <th className="p-3.5 w-28">Código</th>
                  <th className="p-3.5">Descrição Técnica do Material</th>
                  <th className="p-3.5 w-32">NCM</th>
                  <th className="p-3.5 w-36">Categoria</th>
                  <th className="p-3.5 w-24 text-center">Unidade</th>
                  <th className="p-3.5 w-32 text-center">Peso Unitário</th>
                  <th className="p-3.5 w-36 text-right">Preço Venda</th>
                  <th className="p-3.5 w-24 text-center">Estoque</th>
                  <th className="p-3.5 w-28 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {produtosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-400">
                      Nenhum produto encontrado.
                    </td>
                  </tr>
                ) : (
                  produtosFiltrados.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="p-3.5 font-mono font-bold text-blue-900">{p.codigo}</td>
                      <td className="p-3.5 font-bold uppercase text-slate-800">{p.descricao}</td>
                      <td className="p-3.5 font-mono text-slate-500">{p.ncm || '-'}</td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {p.categoria || 'Geral'}
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-bold">{p.unidade_primaria}</td>
                      <td className="p-3.5 text-center text-blue-950 font-black">
                        {p.peso_unitario ? `${p.peso_unitario} kg` : '-'}
                      </td>
                      <td className="p-3.5 text-right font-black text-slate-900 text-sm">
                        {p.preco_venda_padrao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="p-3.5 text-center font-bold text-emerald-700">
                        {p.estoque_atual || 100}
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleEditarProduto(p)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar Produto"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleExcluirProduto(p)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Excluir Produto"
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
      )}

      {/* ========================================================== */}
      {/* LISTAGEM DE CLIENTES COM LISTA COMPLETA DE COMPRADORES */}
      {/* ========================================================== */}
      {tab === 'CLIENTES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {clientesFiltrados.map((c) => {
            const listaCompradores = c.compradores && c.compradores.length > 0 ? c.compradores : (
              c.comprador_padrao ? [{
                id: 'comp-def',
                nome: c.comprador_padrao,
                cargo_depto: 'Comprador(a)',
                telefone: c.telefone || '',
                email: c.email || '',
                is_principal: true
              }] : []
            );

            const isExpanded = expandedClienteId === c.id;

            return (
              <div 
                key={c.id} 
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-extrabold text-slate-900 uppercase text-sm">
                        {c.nome_fantasia || c.razao_social}
                      </h3>
                      <p className="text-[11px] font-mono text-slate-500 font-semibold mt-0.5">
                        CNPJ: {c.cnpj}
                      </p>
                    </div>
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200 shrink-0">
                      {c.condicao_pagamento_padrao || '30 DDL'}
                    </span>
                  </div>

                  {/* Endereço */}
                  <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span className="font-medium text-[11px]">{c.endereco_completo}</span>
                  </div>

                  {/* SEÇÃO DE COMPRADORES CADASTRADOS */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-blue-600" />
                        Compradores Cadastrados ({listaCompradores.length})
                      </span>
                      {listaCompradores.length > 1 && (
                        <button
                          onClick={() => setExpandedClienteId(isExpanded ? null : c.id)}
                          className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-0.5"
                        >
                          {isExpanded ? 'Recolher' : 'Ver Todos'}
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      )}
                    </div>

                    {/* Exibição dos compradores (Primeiro ou Todos se expandido) */}
                    <div className="space-y-2">
                      {(isExpanded ? listaCompradores : listaCompradores.slice(0, 1)).map((comp) => (
                        <div 
                          key={comp.id}
                          className={`p-2.5 rounded-xl border text-xs space-y-1 transition-all ${
                            comp.is_principal 
                              ? 'bg-blue-50/70 border-blue-200' 
                              : 'bg-slate-50 border-slate-200/80'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 font-bold text-slate-900">
                              <span>👤 {comp.nome}</span>
                              {comp.is_principal && (
                                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-blue-600 text-white flex items-center gap-0.5">
                                  <Star className="w-2.5 h-2.5 fill-white" /> Principal
                                </span>
                              )}
                            </div>
                            {comp.ramal && (
                              <span className="text-[10px] font-semibold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                {comp.ramal}
                              </span>
                            )}
                          </div>

                          {comp.cargo_depto && (
                            <p className="text-[10px] text-slate-600 font-medium">{comp.cargo_depto}</p>
                          )}

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-700 pt-0.5 font-medium">
                            {comp.telefone && <span>📞 {comp.telefone}</span>}
                            {comp.email && <span className="text-slate-500">✉️ {comp.email}</span>}
                          </div>

                          {comp.centro_custo_local && (
                            <p className="text-[10px] text-blue-900 font-semibold pt-0.5 border-t border-slate-200/50">
                              📍 Local/Centro Custo: {comp.centro_custo_local}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Ações do Cliente */}
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">IE: {c.inscricao_estadual || 'Isento'}</span>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditarCliente(c)}
                      className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Editar & Compradores</span>
                    </button>
                    <button
                      onClick={() => handleExcluirCliente(c)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Excluir Cliente"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================== */}
      {/* LISTAGEM DE FORNECEDORES (CRUD READ / UPDATE / DELETE) */}
      {/* ========================================================== */}
      {tab === 'FORNECEDORES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {fornecedoresFiltrados.map((f) => (
            <div 
              key={f.id} 
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                        Usina / Distribuidor
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 uppercase text-sm mt-1">
                      {f.nome_fantasia || f.razao_social}
                    </h3>
                    <p className="text-[11px] font-mono text-slate-500 font-semibold">
                      CNPJ: {f.cnpj}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border shrink-0">
                    Prazo: {f.prazo_medio_dias || 3}d
                  </span>
                </div>

                {/* Categoria do Material Fornecido */}
                <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-100 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block mb-0.5">
                    Linha Fornecida:
                  </span>
                  <p className="font-bold text-amber-950 text-xs">{f.categoria_material}</p>
                </div>

                {/* Galpão de Coleta & Contatos */}
                <div className="text-xs text-slate-600 space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span className="font-medium text-[11px] leading-tight">
                      {f.endereco_galpao || 'Endereço da fábrica sob consulta'}
                    </span>
                  </div>
                  
                  {f.contato_vendedor && (
                    <div className="text-[11px] text-slate-700 pt-1 border-t border-slate-200/60 flex items-center justify-between">
                      <span>👤 {f.contato_vendedor}</span>
                      <span>📞 {f.telefone}</span>
                    </div>
                  )}
                  {f.email && (
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 truncate">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{f.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Ações do Fornecedor */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-600">
                  Condição: {f.condicoes_pagamento_padrao || '28 DDL'}
                </span>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEditarFornecedor(f)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => handleExcluirFornecedor(f)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Excluir Fornecedor"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================== */}
      {/* MOTORISTAS & VEÍCULOS (CRUD READ / UPDATE / DELETE) */}
      {/* ========================================================== */}
      {tab === 'MOTORISTAS' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Motoristas */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-black text-base text-slate-900">
                Motoristas Cadastrados ({motoristasFiltrados.length})
              </h3>
              <button
                onClick={() => {
                  setEditingId(null);
                  setDrawerSubTipo('MOTORISTA');
                  setMotForm({ nome: '', telefone: '', cnh: '', codigo_acesso: '' });
                  setDrawerAberto(true);
                }}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Adicionar Motorista</span>
              </button>
            </div>

            <div className="space-y-3">
              {motoristasFiltrados.map((m) => (
                <div key={m.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-sm text-slate-900">{m.nome}</h4>
                    <p className="text-xs text-slate-500">Tel: {m.telefone} • CNH: {m.cnh || '-'}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Código App</span>
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-900 text-emerald-400">
                        {m.codigo_acesso}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
                      <button
                        onClick={() => handleEditarMotorista(m)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleExcluirMotorista(m)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Veículos */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-black text-base text-slate-900">
                Frota de Veículos ({veiculosFiltrados.length})
              </h3>
              <button
                onClick={() => {
                  setEditingId(null);
                  setDrawerSubTipo('VEICULO');
                  setVeicForm({ modelo: '', placa: '', capacidade_peso_kg: 5000 });
                  setDrawerAberto(true);
                }}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Adicionar Veículo</span>
              </button>
            </div>

            <div className="space-y-3">
              {veiculosFiltrados.map((v) => (
                <div key={v.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{v.modelo}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Capacidade Máxima: <strong className="text-slate-800">{v.capacidade_peso_kg} KG</strong></p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-black px-3 py-1.5 rounded-lg bg-slate-900 text-white shadow-xs">
                      {v.placa}
                    </span>
                    <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
                      <button
                        onClick={() => handleEditarVeiculo(v)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleExcluirVeiculo(v)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================== */}
      {/* DRAWER LATERAL DIREITO COM 50% DA LARGURA NO DESKTOP */}
      {/* ========================================================== */}
      
      {/* Fundo escurecido / Backdrop */}
      <div 
        onClick={() => setDrawerAberto(false)}
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 transition-opacity duration-300 ${
          drawerAberto ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Painel Deslizante Lateral (Drawer - 50% da Tela no Desktop) */}
      <aside
        className={`fixed top-0 bottom-0 right-0 z-50 w-full sm:max-w-xl md:w-1/2 lg:w-1/2 bg-white shadow-2xl border-l border-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out ${
          drawerAberto ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Cabeçalho do Drawer */}
        <div className="h-16 px-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold">
              {editingId ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-extrabold text-sm uppercase tracking-wide">
                {editingId ? 'Editar Cadastro' : 'Novo Cadastro'}
                <span className="text-blue-400 ml-1 font-semibold">
                  {tab === 'PRODUTOS' && '• Produto / Metal'}
                  {tab === 'CLIENTES' && '• Cliente & Compradores'}
                  {tab === 'FORNECEDORES' && '• Fornecedor / Usina'}
                  {tab === 'MOTORISTAS' && `• ${drawerSubTipo}`}
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">Preencha os campos abaixo e clique em salvar</p>
            </div>
          </div>

          <button
            onClick={() => setDrawerAberto(false)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Se for na aba Motoristas, alternar entre cadastrar Motorista ou Veículo */}
        {tab === 'MOTORISTAS' && !editingId && (
          <div className="flex bg-slate-100 p-1 border-b border-slate-200">
            <button
              type="button"
              onClick={() => setDrawerSubTipo('MOTORISTA')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                drawerSubTipo === 'MOTORISTA' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Motorista
            </button>
            <button
              type="button"
              onClick={() => setDrawerSubTipo('VEICULO')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                drawerSubTipo === 'VEICULO' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Veículo / Caminhão
            </button>
          </div>
        )}

        {/* Corpo do Formulário com Scroll Interno */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* FORMULÁRIO DE PRODUTOS */}
          {tab === 'PRODUTOS' && (
            <form id="form-drawer-produto" onSubmit={handleSalvarProduto} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Código do Produto *
                </label>
                <input
                  type="text"
                  required
                  value={prodForm.codigo || ''}
                  onChange={(e) => setProdForm({ ...prodForm, codigo: e.target.value })}
                  placeholder="Ex: 450 ou TB-304-1"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 uppercase font-bold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Descrição Completa com Medidas *
                </label>
                <textarea
                  rows={2}
                  required
                  value={prodForm.descricao || ''}
                  onChange={(e) => setProdForm({ ...prodForm, descricao: e.target.value })}
                  placeholder="Ex: PLACA POLICARBONATO CRISTAL. 2050 X 1000 X 4MM 39206100"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 uppercase font-semibold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    NCM
                  </label>
                  <input
                    type="text"
                    value={prodForm.ncm || ''}
                    onChange={(e) => setProdForm({ ...prodForm, ncm: e.target.value })}
                    placeholder="39206100"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Categoria
                  </label>
                  <select
                    value={prodForm.categoria || 'Tubos Inox'}
                    onChange={(e) => setProdForm({ ...prodForm, categoria: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 font-semibold"
                  >
                    <option value="Tubos Inox">Tubos Inox</option>
                    <option value="Conexões Inox">Conexões Inox</option>
                    <option value="Vigas Estruturais">Vigas Estruturais</option>
                    <option value="Placas & Chapas">Placas & Chapas</option>
                    <option value="Flanges">Flanges</option>
                    <option value="Outros Metais">Outros Metais</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Unidade de Medida
                  </label>
                  <input
                    type="text"
                    value={prodForm.unidade_primaria || 'PÇ'}
                    onChange={(e) => setProdForm({ ...prodForm, unidade_primaria: e.target.value.toUpperCase() })}
                    placeholder="PÇ / M / BR / KG"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 uppercase font-bold text-center"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Peso Unitário (KG)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={prodForm.peso_unitario || ''}
                    onChange={(e) => setProdForm({ ...prodForm, peso_unitario: parseFloat(e.target.value) || 0 })}
                    placeholder="Ex: 9.84"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 font-bold text-blue-950 text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Preço de Venda Padrão (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={prodForm.preco_venda_padrao || ''}
                    onChange={(e) => setProdForm({ ...prodForm, preco_venda_padrao: parseFloat(e.target.value) || 0 })}
                    placeholder="505.70"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 font-black text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Estoque Atual
                  </label>
                  <input
                    type="number"
                    value={prodForm.estoque_atual || ''}
                    onChange={(e) => setProdForm({ ...prodForm, estoque_atual: parseFloat(e.target.value) || 0 })}
                    placeholder="100"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 font-bold text-emerald-800"
                  />
                </div>
              </div>
            </form>
          )}

          {/* FORMULÁRIO DE CLIENTES & LISTA DE COMPRADORES */}
          {tab === 'CLIENTES' && (
            <form id="form-drawer-cliente" onSubmit={handleSalvarCliente} className="space-y-6">
              
              {/* DADOS DA EMPRESA */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b pb-2 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  1. Dados Cadastrais da Empresa (CNPJ)
                </h4>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Razão Social *
                  </label>
                  <input
                    type="text"
                    required
                    value={cliForm.razao_social || ''}
                    onChange={(e) => setCliForm({ ...cliForm, razao_social: e.target.value })}
                    placeholder="Ex: GE ENERGIA E INDUSTRIA LTDA"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 uppercase font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Nome Fantasia
                    </label>
                    <input
                      type="text"
                      value={cliForm.nome_fantasia || ''}
                      onChange={(e) => setCliForm({ ...cliForm, nome_fantasia: e.target.value })}
                      placeholder="GE"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 uppercase font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      CNPJ *
                    </label>
                    <input
                      type="text"
                      required
                      value={cliForm.cnpj || ''}
                      onChange={(e) => setCliForm({ ...cliForm, cnpj: e.target.value })}
                      placeholder="33.435.231/0001-87"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Inscrição Estadual
                    </label>
                    <input
                      type="text"
                      value={cliForm.inscricao_estadual || ''}
                      onChange={(e) => setCliForm({ ...cliForm, inscricao_estadual: e.target.value })}
                      placeholder="086.123.456-0"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-blue-900 uppercase mb-1">
                      Condição de Pagamento Padrão
                    </label>
                    <input
                      type="text"
                      value={cliForm.condicao_pagamento_padrao || '30 DDL'}
                      onChange={(e) => setCliForm({ ...cliForm, condicao_pagamento_padrao: e.target.value })}
                      placeholder="60 DDL"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border-2 border-blue-300 bg-blue-50/50 font-bold text-blue-900 uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Endereço Completo de Entrega Principal
                  </label>
                  <textarea
                    rows={2}
                    value={cliForm.endereco_completo || ''}
                    onChange={(e) => setCliForm({ ...cliForm, endereco_completo: e.target.value })}
                    placeholder="Av. Industrial, 1500 - Galpão 3 - Campinas/SP"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>

              {/* SEÇÃO COMPLETA DE COMPRADORES */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-blue-600" />
                      2. Ficha de Compradores do Cliente ({compradoresTemp.length})
                    </h4>
                    <p className="text-[10px] text-slate-500">Cadastre a lista de pessoas que solicitam orçamentos e pedidos</p>
                  </div>

                  {!formNovoCompradorAberto && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCompradorId(null);
                        setCompradorForm({
                          nome: '',
                          cargo_depto: '',
                          telefone: '',
                          ramal: '',
                          celular_whatsapp: '',
                          email: '',
                          centro_custo_local: '',
                          observacoes: '',
                          is_principal: compradoresTemp.length === 0
                        });
                        setFormNovoCompradorAberto(true);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold border border-blue-200 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Adicionar Comprador</span>
                    </button>
                  )}
                </div>

                {/* MINI FORMULÁRIO DE COMPRADOR (ADICIONAR / EDITAR) */}
                {formNovoCompradorAberto && (
                  <div className="p-4 bg-blue-50/50 rounded-2xl border-2 border-blue-200 space-y-3 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between border-b border-blue-200/80 pb-2">
                      <span className="font-extrabold text-xs text-blue-900 uppercase">
                        {editingCompradorId ? 'Editar Ficha do Comprador' : 'Nova Ficha de Comprador'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setFormNovoCompradorAberto(false)}
                        className="text-slate-400 hover:text-slate-700 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                          Nome Completo do Comprador *
                        </label>
                        <input
                          type="text"
                          required
                          value={compradorForm.nome || ''}
                          onChange={(e) => setCompradorForm({ ...compradorForm, nome: e.target.value })}
                          placeholder="Ex: VITORIA SILVA"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-bold uppercase"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                          Cargo / Departamento
                        </label>
                        <input
                          type="text"
                          value={compradorForm.cargo_depto || ''}
                          onChange={(e) => setCompradorForm({ ...compradorForm, cargo_depto: e.target.value })}
                          placeholder="Ex: Compradora Sênior - Tubulação"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                          Telefone Fixo / Comercial
                        </label>
                        <input
                          type="text"
                          value={compradorForm.telefone || ''}
                          onChange={(e) => setCompradorForm({ ...compradorForm, telefone: e.target.value })}
                          placeholder="(11) 3000-4000"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                          Ramal
                        </label>
                        <input
                          type="text"
                          value={compradorForm.ramal || ''}
                          onChange={(e) => setCompradorForm({ ...compradorForm, ramal: e.target.value })}
                          placeholder="Ramal 4022"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                          Celular / WhatsApp
                        </label>
                        <input
                          type="text"
                          value={compradorForm.celular_whatsapp || ''}
                          onChange={(e) => setCompradorForm({ ...compradorForm, celular_whatsapp: e.target.value })}
                          placeholder="(11) 98765-4321"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                          E-mail Direto
                        </label>
                        <input
                          type="email"
                          value={compradorForm.email || ''}
                          onChange={(e) => setCompradorForm({ ...compradorForm, email: e.target.value })}
                          placeholder="vitoria.compras@ge.com"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                        Centro de Custo / Local de Entrega deste Comprador
                      </label>
                      <input
                        type="text"
                        value={compradorForm.centro_custo_local || ''}
                        onChange={(e) => setCompradorForm({ ...compradorForm, centro_custo_local: e.target.value })}
                        placeholder="Ex: Doca 2 - Fábrica Campinas (Setor Manutenção)"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                        Observações de Atendimento
                      </label>
                      <input
                        type="text"
                        value={compradorForm.observacoes || ''}
                        onChange={(e) => setCompradorForm({ ...compradorForm, observacoes: e.target.value })}
                        placeholder="Ex: Atende seg-qui das 08h às 17h. Enviar PDF com cópia p/ almoxarifado."
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-blue-900">
                        <input
                          type="checkbox"
                          checked={compradorForm.is_principal || false}
                          onChange={(e) => setCompradorForm({ ...compradorForm, is_principal: e.target.checked })}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>Definir como Comprador Principal / Padrão</span>
                      </label>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setFormNovoCompradorAberto(false)}
                          className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg font-semibold"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={handleAdicionarOuAtualizarComprador}
                          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs"
                        >
                          {editingCompradorId ? 'Salvar Comprador' : '+ Incluir Comprador'}
                        </button>
                      </div>
                    </div>

                  </div>
                )}

                {/* LISTAGEM DE COMPRADORES JÁ INCLUÍDOS NO FORMULÁRIO */}
                {compradoresTemp.length === 0 ? (
                  <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center">
                    <p className="text-xs text-slate-500">Nenhum comprador adicionado ainda.</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Clique no botão acima para adicionar a ficha do comprador.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {compradoresTemp.map((comp) => (
                      <div 
                        key={comp.id}
                        className={`p-3 rounded-xl border flex items-start justify-between gap-2 transition-all ${
                          comp.is_principal 
                            ? 'bg-blue-50/70 border-blue-300 shadow-xs' 
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="space-y-1 overflow-hidden">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs uppercase text-slate-900">
                              👤 {comp.nome}
                            </span>
                            {comp.is_principal ? (
                              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-blue-600 text-white flex items-center gap-0.5">
                                <Star className="w-2.5 h-2.5 fill-white" /> Principal
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleDefinirCompradorPrincipal(comp.id)}
                                className="text-[10px] text-blue-600 hover:underline font-semibold"
                              >
                                Tornar Principal
                              </button>
                            )}
                          </div>

                          {comp.cargo_depto && (
                            <p className="text-[11px] text-slate-600 font-medium">{comp.cargo_depto}</p>
                          )}

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-700 font-medium">
                            {comp.telefone && <span>📞 {comp.telefone} {comp.ramal ? `(${comp.ramal})` : ''}</span>}
                            {comp.celular_whatsapp && <span>💬 {comp.celular_whatsapp}</span>}
                            {comp.email && <span className="text-slate-500">✉️ {comp.email}</span>}
                          </div>

                          {comp.centro_custo_local && (
                            <p className="text-[10px] text-blue-900 font-semibold pt-0.5">
                              📍 Local: {comp.centro_custo_local}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleEditarFichaComprador(comp)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
                            title="Editar Comprador"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoverComprador(comp.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
                            title="Remover Comprador"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </form>
          )}

          {/* FORMULÁRIO DE FORNECEDORES */}
          {tab === 'FORNECEDORES' && (
            <form id="form-drawer-fornecedor" onSubmit={handleSalvarFornecedor} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Razão Social da Usina / Fornecedor *
                </label>
                <input
                  type="text"
                  required
                  value={fornForm.razao_social || ''}
                  onChange={(e) => setFornForm({ ...fornForm, razao_social: e.target.value })}
                  placeholder="Ex: INOX TUBOS DO BRASIL S/A"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 uppercase font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Nome Fantasia
                  </label>
                  <input
                    type="text"
                    value={fornForm.nome_fantasia || ''}
                    onChange={(e) => setFornForm({ ...fornForm, nome_fantasia: e.target.value })}
                    placeholder="Ex: INOX TUBOS BRASIL"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 uppercase font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    CNPJ *
                  </label>
                  <input
                    type="text"
                    required
                    value={fornForm.cnpj || ''}
                    onChange={(e) => setFornForm({ ...fornForm, cnpj: e.target.value })}
                    placeholder="55.123.456/0001-77"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-amber-900 uppercase mb-1">
                  Linha de Material / Produtos Fornecidos *
                </label>
                <input
                  type="text"
                  required
                  value={fornForm.categoria_material || ''}
                  onChange={(e) => setFornForm({ ...fornForm, categoria_material: e.target.value })}
                  placeholder="Ex: Tubos Inox (304 / 316L), Vigas I/W, Conexões BSP, Chapas..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border-2 border-amber-300 bg-amber-50/50 font-bold text-amber-950"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Contato / Vendedor Usina
                  </label>
                  <input
                    type="text"
                    value={fornForm.contato_vendedor || ''}
                    onChange={(e) => setFornForm({ ...fornForm, contato_vendedor: e.target.value })}
                    placeholder="Eduardo Martins"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={fornForm.telefone || ''}
                    onChange={(e) => setFornForm({ ...fornForm, telefone: e.target.value })}
                    placeholder="(11) 3344-5566"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Condições de Pagamento
                  </label>
                  <input
                    type="text"
                    value={fornForm.condicoes_pagamento_padrao || '28 DDL'}
                    onChange={(e) => setFornForm({ ...fornForm, condicoes_pagamento_padrao: e.target.value })}
                    placeholder="28 DDL / 30/60 DDL"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 font-bold uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Prazo Médio (Dias)
                  </label>
                  <input
                    type="number"
                    value={fornForm.prazo_medio_dias || ''}
                    onChange={(e) => setFornForm({ ...fornForm, prazo_medio_dias: parseInt(e.target.value) || 0 })}
                    placeholder="3"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 font-bold text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Endereço do Galpão (Para Coletas de Logística)
                </label>
                <textarea
                  rows={2}
                  value={fornForm.endereco_galpao || ''}
                  onChange={(e) => setFornForm({ ...fornForm, endereco_galpao: e.target.value })}
                  placeholder="Av. Marginal Direita do Tietê, 4000 - Vila Leopoldina, São Paulo - SP"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Observações de Retirada / Coleta
                </label>
                <input
                  type="text"
                  value={fornForm.observacoes || ''}
                  onChange={(e) => setFornForm({ ...fornForm, observacoes: e.target.value })}
                  placeholder="Ex: Exige bota com bico de aço e colete para carregamento..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300"
                />
              </div>
            </form>
          )}

          {/* FORMULÁRIO DE MOTORISTAS / VEÍCULOS */}
          {tab === 'MOTORISTAS' && drawerSubTipo === 'MOTORISTA' && (
            <form id="form-drawer-motorista" onSubmit={handleSalvarMotorista} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Nome Completo do Motorista *
                </label>
                <input
                  type="text"
                  required
                  value={motForm.nome || ''}
                  onChange={(e) => setMotForm({ ...motForm, nome: e.target.value })}
                  placeholder="Ex: Carlos Eduardo (Carlinhos)"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Telefone / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={motForm.telefone || ''}
                    onChange={(e) => setMotForm({ ...motForm, telefone: e.target.value })}
                    placeholder="(11) 97766-5544"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    CNH
                  </label>
                  <input
                    type="text"
                    value={motForm.cnh || ''}
                    onChange={(e) => setMotForm({ ...motForm, cnh: e.target.value })}
                    placeholder="12345678900"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Código de Acesso App Mobile
                </label>
                <input
                  type="text"
                  value={motForm.codigo_acesso || ''}
                  onChange={(e) => setMotForm({ ...motForm, codigo_acesso: e.target.value.toUpperCase() })}
                  placeholder="CARLOS"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 font-mono font-bold uppercase"
                />
              </div>
            </form>
          )}

          {tab === 'MOTORISTAS' && drawerSubTipo === 'VEICULO' && (
            <form id="form-drawer-veiculo" onSubmit={handleSalvarVeiculo} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Modelo do Veículo / Caminhão *
                </label>
                <input
                  type="text"
                  required
                  value={veicForm.modelo || ''}
                  onChange={(e) => setVeicForm({ ...veicForm, modelo: e.target.value })}
                  placeholder="Ex: Mercedes-Benz Accelo 1016 (Baú)"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Placa do Veículo *
                  </label>
                  <input
                    type="text"
                    required
                    value={veicForm.placa || ''}
                    onChange={(e) => setVeicForm({ ...veicForm, placa: e.target.value.toUpperCase() })}
                    placeholder="BRA-4F26"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 font-mono font-black uppercase text-center"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Capacidade Máxima (KG) *
                  </label>
                  <input
                    type="number"
                    required
                    value={veicForm.capacidade_peso_kg || ''}
                    onChange={(e) => setVeicForm({ ...veicForm, capacidade_peso_kg: parseFloat(e.target.value) || 0 })}
                    placeholder="6000"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 font-bold text-blue-950 text-center"
                  />
                </div>
              </div>
            </form>
          )}

        </div>

        {/* Rodapé Fixo do Drawer com Botões de Ação */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setDrawerAberto(false)}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
          >
            Cancelar
          </button>

          <button
            type="submit"
            form={
              tab === 'PRODUTOS' 
                ? 'form-drawer-produto' 
                : tab === 'CLIENTES' 
                ? 'form-drawer-cliente' 
                : tab === 'FORNECEDORES'
                ? 'form-drawer-fornecedor'
                : (drawerSubTipo === 'MOTORISTA' ? 'form-drawer-motorista' : 'form-drawer-veiculo')
            }
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
          >
            <Save className="w-4 h-4" />
            <span>{editingId ? 'Salvar Alterações' : 'Cadastrar'}</span>
          </button>
        </div>
      </aside>

    </div>
  );
}

export default function CadastrosPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Carregando cadastros...</div>}>
      <CadastrosContent />
    </Suspense>
  );
}
