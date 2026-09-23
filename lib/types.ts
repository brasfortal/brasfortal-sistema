export interface Comprador {
  id: string;
  nome: string;
  cargo_depto?: string; // Ex: Comprador Sênior - Linha Tubulação / Suprimentos
  telefone: string;
  ramal?: string;
  celular_whatsapp?: string;
  email: string;
  centro_custo_local?: string; // Ex: Doca 2 - Fábrica Campinas
  observacoes?: string; // Ex: Horários de atendimento, requisitos para faturamento
  is_principal?: boolean;
}

export interface Cliente {
  id: string;
  razao_social: string;
  nome_fantasia?: string;
  cnpj: string;
  inscricao_estadual?: string;
  comprador_padrao?: string; // Nome do comprador padrão para compatibilidade
  telefone?: string;
  email?: string;
  endereco_completo?: string;
  local_entrega_padrao?: string;
  local_cobranca_padrao?: string;
  condicao_pagamento_padrao?: string;
  transportadora_preferencial?: string;
  compradores?: Comprador[]; // Lista completa de compradores do cliente
}

export interface Fornecedor {
  id: string;
  razao_social: string;
  nome_fantasia?: string;
  cnpj: string;
  inscricao_estadual?: string;
  categoria_material: string; // Tubos Inox, Vigas & Perfis, Conexões, Chapas, Policarbonato
  contato_vendedor?: string;
  telefone: string;
  email?: string;
  endereco_galpao: string; // Para coletas de logística
  cidade?: string;
  uf?: string;
  condicoes_pagamento_padrao?: string; // Ex: 28 DDL, 30/60 DDL
  prazo_medio_dias?: number;
  observacoes?: string;
}

export interface Produto {
  id: string;
  codigo: string;
  descricao: string;
  ncm?: string;
  categoria?: string;
  unidade_primaria: string; // PÇ, KG, M, BR
  unidade_secundaria?: string;
  fator_conversao?: number;
  peso_unitario?: number; // KG
  preco_venda_padrao: number;
  estoque_atual?: number;
}

export interface Vendedor {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  percentual_comissao_padrao?: number;
}

export interface Motorista {
  id: string;
  nome: string;
  telefone: string;
  cnh?: string;
  codigo_acesso: string;
}

export interface Veiculo {
  id: string;
  modelo: string;
  placa: string;
  capacidade_peso_kg: number;
}

export interface ItemPedido {
  id: string;
  item_numero: number;
  unid_1: string;
  quant_1: number;
  unid_2?: string;
  quant_2?: number;
  peso?: number; // em KG
  codigo: string;
  descricao: string;
  valor_unitario: number;
  valor_total: number;
}

export interface ExpedicaoNF {
  id: string;
  numero_nf: string;
  icms_percent: number;
  peso_total: number;
  especie: string;
}

export interface Pedido {
  id: string;
  numero_pedido: number;
  tipo: 'ORCAMENTO' | 'PEDIDO';
  data_emissao: string;
  
  // Cliente
  cliente_id?: string;
  cliente_nome: string;
  cliente_cnpj: string;
  cliente_ie?: string;
  comprador?: string;
  telefone?: string;
  endereco?: string;
  
  // Comercial e Logística
  condicoes_pagamento: string; // Ex: '60 DDL'
  pedido_cliente_n?: string; // Ex: '700118149'
  local_entrega?: string;
  transportadora?: string;
  local_cobranca?: string;
  
  // Vendedor e Comissões
  vendedor_id?: string;
  vendedor_nome?: string;
  valor_comissao?: number;
  
  // Itens
  itens: ItemPedido[];
  
  // Expedição
  nfs: ExpedicaoNF[];
  
  // Totais
  valor_total: number;
  peso_total: number;
  status: 'ORCAMENTO' | 'NOVO' | 'APROVADO' | 'SEPARACAO' | 'EXPEDICAO' | 'EM_ROTA' | 'ENTREGUE' | 'FATURADO' | 'CANCELADO';
  observacoes?: string;
  created_at: string;
}

export interface ParadaRomaneio {
  id: string;
  romaneio_id: string;
  tipo: 'ENTREGA' | 'COLETA';
  pedido_id?: string;
  numero_pedido?: number;
  ordem_parada: number;
  destinatario_nome: string;
  documento?: string; // CNPJ / CPF
  comprador_contato?: string;
  telefone: string;
  endereco: string;
  cidade?: string;
  bairro?: string;
  nfs_vinculadas?: string;
  peso_kg: number;
  volumes?: string;
  status: 'PENDENTE' | 'A_CAMINHO' | 'CONCLUIDO' | 'INSUCESSO';
  motivo_insucesso?: string;
  recebedor_nome?: string;
  recebedor_documento?: string;
  canhoto_foto_url?: string;
  observacao_motorista?: string;
  data_hora_conclusao?: string;
}

export interface Romaneio {
  id: string;
  numero_romaneio: number;
  data_saida: string;
  motorista_id?: string;
  motorista_nome: string;
  motorista_telefone?: string;
  veiculo_id?: string;
  veiculo_placa: string;
  veiculo_modelo?: string;
  status: 'PLANEJADO' | 'EM_ROTA' | 'FINALIZADO';
  peso_total_romaneio: number;
  capacidade_veiculo_kg?: number;
  observacoes?: string;
  paradas: ParadaRomaneio[];
  created_at: string;
}

export type PerfilUsuario = 'MASTER' | 'COMERCIAL' | 'LOGISTICA' | 'MOTORISTA';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  cargo: string;
  foto_url?: string;
  telefone?: string;
  ativo: boolean;
  senha_hash?: string;
  ultimo_login?: string;
  created_at: string;
}
