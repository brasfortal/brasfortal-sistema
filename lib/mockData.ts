import { Cliente, Fornecedor, Produto, Vendedor, Motorista, Veiculo, Pedido, Romaneio, Usuario } from './types';

export const INITIAL_CLIENTES: Cliente[] = [
  {
    id: 'cli-1',
    razao_social: 'GE ENERGIA E INDUSTRIA DO BRASIL LTDA',
    nome_fantasia: 'GE',
    cnpj: '33.435.231/0001-87',
    inscricao_estadual: '086.123.456-0',
    comprador_padrao: 'VITORIA',
    telefone: '(11) 98765-4321',
    email: 'vitoria.compras@ge.com',
    endereco_completo: 'Av. das Nações Unidas, 8500 - Pinheiros, São Paulo - SP, 05425-070',
    local_entrega_padrao: 'Av. Industrial, 1500 - Galpão 3 (Doca 2) - Campinas/SP, 13082-000',
    local_cobranca_padrao: 'Av. das Nações Unidas, 8500 - São Paulo - SP',
    condicao_pagamento_padrao: '60 DDL',
    transportadora_preferencial: 'BRASFORTAL EXPRESS',
    compradores: [
      {
        id: 'comp-1',
        nome: 'VITORIA SILVA',
        cargo_depto: 'Compradora Sênior - Linha Tubos & Policarbonato',
        telefone: '(11) 98765-4321',
        ramal: 'Ramal 4022',
        celular_whatsapp: '(11) 98765-4321',
        email: 'vitoria.compras@ge.com',
        centro_custo_local: 'Fábrica Campinas - Doca 2 (Engenharia)',
        observacoes: 'Atende de segunda a quinta das 08h às 17h. Exige cotação em PDF por e-mail.',
        is_principal: true
      },
      {
        id: 'comp-2',
        nome: 'CARLOS HENRIQUE',
        cargo_depto: 'Engenheiro de Manutenção / Suprimentos Industriais',
        telefone: '(11) 98765-9988',
        ramal: 'Ramal 4105',
        celular_whatsapp: '(11) 98765-9988',
        email: 'carlos.manutencao@ge.com',
        centro_custo_local: 'Unidade Betim / MG - Setor Turbinas',
        observacoes: 'Responsável por compras emergenciais de flanges e tubos inox.',
        is_principal: false
      },
      {
        id: 'comp-3',
        nome: 'MARIANA SOUZA',
        cargo_depto: 'Almoxarifado Central & Recebimento',
        telefone: '(11) 3000-8800',
        ramal: 'Ramal 201',
        celular_whatsapp: '(11) 97711-2233',
        email: 'almoxarifado.sp@ge.com',
        centro_custo_local: 'Galpão 3 - Doca 2',
        observacoes: 'Responsável pelo agendamento de descargas com empilhadeira.',
        is_principal: false
      }
    ]
  },
  {
    id: 'cli-2',
    razao_social: 'METALURGICA ALVORADA LTDA',
    nome_fantasia: 'ALVORADA METAIS',
    cnpj: '12.345.678/0001-90',
    inscricao_estadual: '112.445.890.110',
    comprador_padrao: 'RODRIGO MENDES',
    telefone: '(11) 99123-4567',
    email: 'compras@alvoradametais.com.br',
    endereco_completo: 'Rua do Aço, 420 - Distrito Industrial - Guarulhos/SP, 07220-000',
    local_entrega_padrao: 'Rua do Aço, 420 - Galpão B - Guarulhos/SP',
    local_cobranca_padrao: 'Rua do Aço, 420 - Guarulhos/SP',
    condicao_pagamento_padrao: '30 DDL',
    transportadora_preferencial: 'FROTA PRÓPRIA',
    compradores: [
      {
        id: 'comp-4',
        nome: 'RODRIGO MENDES',
        cargo_depto: 'Gerente de Compras & Matéria-Prima',
        telefone: '(11) 99123-4567',
        ramal: 'Ramal 12',
        celular_whatsapp: '(11) 99123-4567',
        email: 'rodrigo.mendes@alvoradametais.com.br',
        centro_custo_local: 'Galpão B - Produção Guarulhos',
        observacoes: 'Negocia compras em grande volume (feixes de tubos e vigas).',
        is_principal: true
      },
      {
        id: 'comp-5',
        nome: 'JULIANA PRADO',
        cargo_depto: 'Assistente de Compras & Cotações',
        telefone: '(11) 99123-8899',
        ramal: 'Ramal 15',
        celular_whatsapp: '(11) 99123-8899',
        email: 'cotacoes@alvoradametais.com.br',
        centro_custo_local: 'Escritório Comercial',
        observacoes: 'Emite ordens de compra e envia comprovantes de pagamento.',
        is_principal: false
      }
    ]
  },
  {
    id: 'cli-3',
    razao_social: 'CALDEIRARIA E TUBULACOES VALE DO PARAIBA S/A',
    nome_fantasia: 'CALDEIRARIA VALE',
    cnpj: '45.678.901/0001-23',
    inscricao_estadual: '645.789.012.345',
    comprador_padrao: 'FERNANDA LIMA',
    telefone: '(12) 98877-6655',
    email: 'suprimentos@caldeirariavale.com.br',
    endereco_completo: 'Rodovia Presidente Dutra, KM 145 - São José dos Campos/SP, 12240-000',
    local_entrega_padrao: 'Rodovia Presidente Dutra, KM 145 - Portaria 3 - SJC/SP',
    local_cobranca_padrao: 'Rodovia Presidente Dutra, KM 145 - SJC/SP',
    condicao_pagamento_padrao: '45 DDL',
    transportadora_preferencial: 'TRANSPORTADORA VALE',
    compradores: [
      {
        id: 'comp-6',
        nome: 'FERNANDA LIMA',
        cargo_depto: 'Supervisora de Suprimentos & Caldeiraria Pesada',
        telefone: '(12) 98877-6655',
        ramal: 'Ramal 305',
        celular_whatsapp: '(12) 98877-6655',
        email: 'fernanda.lima@caldeirariavale.com.br',
        centro_custo_local: 'Portaria 3 - Recebimento de Metais',
        observacoes: 'Exige certificado de qualidade das ligas de inox e rastreabilidade de lote.',
        is_principal: true
      }
    ]
  }
];

export const INITIAL_FORNECEDORES: Fornecedor[] = [
  {
    id: 'forn-1',
    razao_social: 'INOX TUBOS DO BRASIL S/A',
    nome_fantasia: 'INOX TUBOS BRASIL',
    cnpj: '55.123.456/0001-77',
    inscricao_estadual: '110.220.330.440',
    categoria_material: 'Tubos Inox (304 / 316L)',
    contato_vendedor: 'Eduardo Martins (Gerente Comercial)',
    telefone: '(11) 3344-5566',
    email: 'vendas@inoxtubosbrasil.com.br',
    endereco_galpao: 'Av. Marginal Direita do Tietê, 4000 - Vila Leopoldina, São Paulo - SP',
    cidade: 'São Paulo',
    uf: 'SP',
    condicoes_pagamento_padrao: '28 DDL',
    prazo_medio_dias: 3,
    observacoes: 'Galpão de coleta abre às 07:30h. Exige bota e colete para retirada.'
  },
  {
    id: 'forn-2',
    razao_social: 'GERDAU ACOS LONGOS S.A.',
    nome_fantasia: 'GERDAU',
    cnpj: '07.358.761/0001-69',
    inscricao_estadual: '108.987.654.321',
    categoria_material: 'Vigas I/W, Perfis e Chapas ASTM A36',
    contato_vendedor: 'Central de Atendimento Usinas',
    telefone: '(11) 3094-6600',
    email: 'comercial.sp@gerdau.com.br',
    endereco_galpao: 'Av. das Nações Unidas, 1000 - Galpão 5 - Usina Araçariguama/SP',
    cidade: 'Araçariguama',
    uf: 'SP',
    condicoes_pagamento_padrao: '30/60 DDL',
    prazo_medio_dias: 5,
    observacoes: 'Fornecedor homologado para aço estrutural certificado.'
  },
  {
    id: 'forn-3',
    razao_social: 'TUPY CONEXOES E FUNDICAO LTDA',
    nome_fantasia: 'TUPY CONEXÕES',
    cnpj: '84.683.504/0001-85',
    inscricao_estadual: '250.123.789.456',
    categoria_material: 'Conexões Galvanizadas e Ferro Maleável (BSP / NPT)',
    contato_vendedor: 'Juliana Castro',
    telefone: '(47) 4009-8111',
    email: 'atendimento@tupy.com.br',
    endereco_galpao: 'Rua Albano Schmidt, 3400 - Boa Vista - Joinville/SC (CD São Paulo: Guarulhos)',
    cidade: 'Guarulhos',
    uf: 'SP',
    condicoes_pagamento_padrao: '30 DDL',
    prazo_medio_dias: 2,
    observacoes: 'Centro de Distribuição em Guarulhos para pronta-entrega.'
  },
  {
    id: 'forn-4',
    razao_social: 'POLIPLAST DISTRIBUIDORA DE TERMOPLASTICOS LTDA',
    nome_fantasia: 'POLIPLAST',
    cnpj: '21.987.654/0001-33',
    inscricao_estadual: '115.432.876.100',
    categoria_material: 'Placas e Chapas de Policarbonato Compacto / Alveolar',
    contato_vendedor: 'Ricardo Almeida',
    telefone: '(11) 2233-4455',
    email: 'pedidos@poliplast.com.br',
    endereco_galpao: 'Rua das Indústrias, 800 - Ipiranga, São Paulo - SP',
    cidade: 'São Paulo',
    uf: 'SP',
    condicoes_pagamento_padrao: '28 DDL',
    prazo_medio_dias: 1,
    observacoes: 'Fornecedor da placa cristal 2050x1000x4mm.'
  }
];

export const INITIAL_PRODUTOS: Produto[] = [
  {
    id: 'prod-1',
    codigo: '450',
    descricao: 'PLACA POLICARBONATO CRISTAL. 2050 X 1000 X 4MM 39206100',
    ncm: '39206100',
    categoria: 'Placas',
    unidade_primaria: 'PÇ',
    unidade_secundaria: 'PÇ',
    fator_conversao: 1,
    peso_unitario: 9.84,
    preco_venda_padrao: 505.70,
    estoque_atual: 45
  },
  {
    id: 'prod-2',
    codigo: 'TB-304-1',
    descricao: 'TUBO INOX 304 OD 1" X 1.50MM C/ COSTURA ASTM A269',
    ncm: '73064000',
    categoria: 'Tubos Inox',
    unidade_primaria: 'M',
    unidade_secundaria: 'KG',
    fator_conversao: 1.15,
    peso_unitario: 1.15,
    preco_venda_padrao: 52.00,
    estoque_atual: 320
  },
  {
    id: 'prod-3',
    codigo: 'CX-90-2',
    descricao: 'COTOVELO 90º 2" 150 LBS BSP INOX 304',
    ncm: '73072900',
    categoria: 'Conexões Inox',
    unidade_primaria: 'PÇ',
    unidade_secundaria: 'KG',
    fator_conversao: 0.65,
    peso_unitario: 0.65,
    preco_venda_padrao: 64.80,
    estoque_atual: 180
  },
  {
    id: 'prod-4',
    codigo: 'VF-W150',
    descricao: 'VIGA I/W 150 X 13.0 KG/M - AÇO CARBONO ASTM A36',
    ncm: '72163300',
    categoria: 'Vigas Estruturais',
    unidade_primaria: 'BR',
    unidade_secundaria: 'KG',
    fator_conversao: 78.0,
    peso_unitario: 78.0,
    preco_venda_padrao: 920.00,
    estoque_atual: 24
  },
  {
    id: 'prod-5',
    codigo: 'FL-SO-3',
    descricao: 'FLANGE SLIP-ON 3" 150 LBS ANSI B16.5 AÇO CARBONO',
    ncm: '73079100',
    categoria: 'Flanges',
    unidade_primaria: 'PÇ',
    unidade_secundaria: 'KG',
    fator_conversao: 3.4,
    peso_unitario: 3.40,
    preco_venda_padrao: 115.00,
    estoque_atual: 60
  }
];

export const INITIAL_VENDEDORES: Vendedor[] = [
  {
    id: 'vend-1',
    nome: 'LUCC BISPO',
    email: 'lucc.bispo@brasfortal.com.br',
    telefone: '(11) 99887-1122',
    percentual_comissao_padrao: 3.5
  },
  {
    id: 'vend-2',
    nome: 'MARCOS SILVA',
    email: 'marcos@brasfortal.com.br',
    telefone: '(11) 99887-3344',
    percentual_comissao_padrao: 3.0
  }
];

export const INITIAL_MOTORISTAS: Motorista[] = [
  {
    id: 'mot-1',
    nome: 'Carlos Eduardo (Carlinhos)',
    telefone: '(11) 97766-5544',
    cnh: '12345678900',
    codigo_acesso: 'CARLOS'
  },
  {
    id: 'mot-2',
    nome: 'Roberto Santos',
    telefone: '(11) 97766-9988',
    cnh: '98765432100',
    codigo_acesso: 'ROBERTO'
  }
];

export const INITIAL_VEICULOS: Veiculo[] = [
  {
    id: 'veic-1',
    modelo: 'Mercedes-Benz Accelo 1016 (Baú)',
    placa: 'BRA-4F26',
    capacidade_peso_kg: 6000
  },
  {
    id: 'veic-2',
    modelo: 'Iveco Daily 35S14 (Carroceria Aberta)',
    placa: 'BRS-8K19',
    capacidade_peso_kg: 3500
  }
];

export const INITIAL_PEDIDOS: Pedido[] = [
  {
    id: 'ped-101',
    numero_pedido: 1042,
    tipo: 'PEDIDO',
    data_emissao: '2026-04-08',
    cliente_id: 'cli-1',
    cliente_nome: 'GE',
    cliente_cnpj: '33.435.231/0001-87',
    cliente_ie: '086.123.456-0',
    comprador: 'VITORIA',
    telefone: '(11) 98765-4321',
    endereco: 'Av. das Nações Unidas, 8500 - São Paulo/SP',
    condicoes_pagamento: '60 DDL',
    pedido_cliente_n: '700118149',
    local_entrega: 'Av. Industrial, 1500 - Galpão 3 (Doca 2) - Campinas/SP',
    transportadora: 'FROTA PRÓPRIA (CARLOS)',
    local_cobranca: 'Av. das Nações Unidas, 8500 - São Paulo/SP',
    vendedor_id: 'vend-1',
    vendedor_nome: 'LUCC BISPO',
    valor_comissao: 307.18,
    itens: [
      {
        id: 'it-1',
        item_numero: 1,
        unid_1: 'PÇ',
        quant_1: 1.0,
        unid_2: 'PÇ',
        quant_2: 1.0,
        peso: 9.84,
        codigo: '450',
        descricao: 'PLACA POLICARBONATO CRISTAL. 2050 X 1000 X 4MM 39206100',
        valor_unitario: 505.70,
        valor_total: 505.70
      }
    ],
    nfs: [
      {
        id: 'nf-1',
        numero_nf: '004821',
        icms_percent: 12.0,
        peso_total: 9.84,
        especie: '1 VOLUME'
      }
    ],
    valor_total: 505.70,
    peso_total: 9.84,
    status: 'EM_ROTA',
    observacoes: 'Entregar na portaria da Engenharia com NF em mãos.',
    created_at: new Date().toISOString()
  },
  {
    id: 'ped-102',
    numero_pedido: 1043,
    tipo: 'PEDIDO',
    data_emissao: '2026-04-09',
    cliente_id: 'cli-2',
    cliente_nome: 'METALURGICA ALVORADA LTDA',
    cliente_cnpj: '12.345.678/0001-90',
    cliente_ie: '112.445.890.110',
    comprador: 'RODRIGO MENDES',
    telefone: '(11) 99123-4567',
    endereco: 'Rua do Aço, 420 - Guarulhos/SP',
    condicoes_pagamento: '30 DDL',
    pedido_cliente_n: 'OC-98442',
    local_entrega: 'Rua do Aço, 420 - Galpão B - Guarulhos/SP',
    transportadora: 'FROTA PRÓPRIA (CARLOS)',
    local_cobranca: 'Rua do Aço, 420 - Guarulhos/SP',
    vendedor_id: 'vend-1',
    vendedor_nome: 'LUCC BISPO',
    valor_comissao: 215.00,
    itens: [
      {
        id: 'it-2',
        item_numero: 1,
        unid_1: 'M',
        quant_1: 60.0,
        unid_2: 'KG',
        quant_2: 69.0,
        peso: 69.0,
        codigo: 'TB-304-1',
        descricao: 'TUBO INOX 304 OD 1" X 1.50MM C/ COSTURA ASTM A269',
        valor_unitario: 52.00,
        valor_total: 3120.00
      },
      {
        id: 'it-3',
        item_numero: 2,
        unid_1: 'PÇ',
        quant_1: 20.0,
        unid_2: 'KG',
        quant_2: 13.0,
        peso: 13.0,
        codigo: 'CX-90-2',
        descricao: 'COTOVELO 90º 2" 150 LBS BSP INOX 304',
        valor_unitario: 64.80,
        valor_total: 1296.00
      }
    ],
    nfs: [
      {
        id: 'nf-2',
        numero_nf: '004822',
        icms_percent: 18.0,
        peso_total: 82.0,
        especie: 'FEIXES / CAIXA'
      }
    ],
    valor_total: 4416.00,
    peso_total: 82.0,
    status: 'EM_ROTA',
    observacoes: 'Descarregamento com empilhadeira das 08h às 16h.',
    created_at: new Date().toISOString()
  }
];

export const INITIAL_ROMANEIOS: Romaneio[] = [
  {
    id: 'rom-201',
    numero_romaneio: 501,
    data_saida: '2026-04-09',
    motorista_id: 'mot-1',
    motorista_nome: 'Carlos Eduardo (Carlinhos)',
    motorista_telefone: '(11) 97766-5544',
    veiculo_id: 'veic-1',
    veiculo_placa: 'BRA-4F26',
    veiculo_modelo: 'Mercedes-Benz Accelo 1016 (Baú)',
    status: 'EM_ROTA',
    peso_total_romaneio: 91.84,
    capacidade_veiculo_kg: 6000,
    observacoes: 'Roteiro Zona Norte + Campinas.',
    created_at: new Date().toISOString(),
    paradas: [
      {
        id: 'parada-1',
        romaneio_id: 'rom-201',
        tipo: 'ENTREGA',
        pedido_id: 'ped-102',
        numero_pedido: 1043,
        ordem_parada: 1,
        destinatario_nome: 'METALURGICA ALVORADA LTDA',
        documento: '12.345.678/0001-90',
        comprador_contato: 'RODRIGO MENDES',
        telefone: '(11) 99123-4567',
        endereco: 'Rua do Aço, 420 - Distrito Industrial, Guarulhos - SP, 07220-000',
        cidade: 'Guarulhos',
        bairro: 'Distrito Industrial',
        nfs_vinculadas: 'NF-e 004822',
        peso_kg: 82.0,
        volumes: '2 Feixes + 1 Caixa',
        status: 'PENDENTE'
      },
      {
        id: 'parada-2',
        romaneio_id: 'rom-201',
        tipo: 'ENTREGA',
        pedido_id: 'ped-101',
        numero_pedido: 1042,
        ordem_parada: 2,
        destinatario_nome: 'GE ENERGIA E INDUSTRIA LTDA',
        documento: '33.435.231/0001-87',
        comprador_contato: 'VITORIA',
        telefone: '(11) 98765-4321',
        endereco: 'Av. Industrial, 1500 - Galpão 3 - Campinas - SP, 13082-000',
        cidade: 'Campinas',
        bairro: 'Polo Industrial',
        nfs_vinculadas: 'NF-e 004821',
        peso_kg: 9.84,
        volumes: '1 Volume (Placa Embalada)',
        status: 'PENDENTE'
      },
      {
        id: 'parada-3',
        romaneio_id: 'rom-201',
        tipo: 'COLETA',
        ordem_parada: 3,
        destinatario_nome: 'INOX TUBOS BRASIL',
        documento: '55.123.456/0001-77',
        comprador_contato: 'Eduardo Martins (Gerente Comercial)',
        telefone: '(11) 3344-5566',
        endereco: 'Av. Marginal Direita do Tietê, 4000 - Vila Leopoldina, São Paulo - SP',
        cidade: 'São Paulo',
        bairro: 'Vila Leopoldina',
        nfs_vinculadas: 'NF Coleta 88910',
        peso_kg: 250.0,
        volumes: '4 Barras Tubo Inox 316L',
        status: 'PENDENTE'
      }
    ]
  }
];

export const INITIAL_USUARIOS: Usuario[] = [
  {
    id: 'user-master-1',
    nome: 'Márcio Santos',
    email: 'marciorsantos05@gmail.com',
    perfil: 'MASTER',
    cargo: 'Diretoria Geral / Administrador Master',
    telefone: '(11) 98765-0000',
    foto_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    ativo: true,
    created_at: '2026-01-01T08:00:00.000Z',
    ultimo_login: new Date().toISOString()
  },
  {
    id: 'user-comercial-1',
    nome: 'Lucc Bispo',
    email: 'lucc.bispo@brasfortal.com.br',
    perfil: 'COMERCIAL',
    cargo: 'Gerente Comercial & Vendas',
    telefone: '(11) 98877-6655',
    foto_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    ativo: true,
    created_at: '2026-01-15T09:00:00.000Z',
    ultimo_login: '2026-09-22T14:30:00.000Z'
  },
  {
    id: 'user-logistica-1',
    nome: 'Carlos Eduardo Mendes',
    email: 'carlos.expedicao@brasfortal.com.br',
    perfil: 'LOGISTICA',
    cargo: 'Supervisor de Logística & Expedição',
    telefone: '(11) 97766-5544',
    foto_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    ativo: true,
    created_at: '2026-02-01T10:00:00.000Z',
    ultimo_login: '2026-09-23T08:15:00.000Z'
  },
  {
    id: 'user-motorista-1',
    nome: 'José Carlos Oliveira',
    email: 'jose.transporte@brasfortal.com.br',
    perfil: 'MOTORISTA',
    cargo: 'Motorista Frota Pesada (Caminhão VW)',
    telefone: '(11) 98765-4321',
    foto_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    ativo: true,
    created_at: '2026-02-10T11:00:00.000Z',
    ultimo_login: '2026-09-23T07:45:00.000Z'
  }
];

