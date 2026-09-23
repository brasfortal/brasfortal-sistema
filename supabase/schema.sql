-- ==========================================================
-- SCHEMA SUPABASE / POSTGRESQL - SISTEMA BRASFORTAL
-- Metais e Conexões Ltda
-- ==========================================================

-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELA DE CLIENTES
CREATE TABLE IF NOT EXISTS clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    razao_social VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255),
    cnpj VARCHAR(20) UNIQUE NOT NULL,
    inscricao_estadual VARCHAR(50),
    comprador_padrao VARCHAR(100),
    telefone VARCHAR(50),
    email VARCHAR(100),
    endereco_completo TEXT,
    local_entrega_padrao TEXT,
    local_cobranca_padrao TEXT,
    condicao_pagamento_padrao VARCHAR(50) DEFAULT '30 DDL',
    transportadora_preferencial VARCHAR(100),
    compradores JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 1.1 TABELA DE FORNECEDORES & USINAS
CREATE TABLE IF NOT EXISTS fornecedores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    razao_social VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255),
    cnpj VARCHAR(20) UNIQUE NOT NULL,
    inscricao_estadual VARCHAR(50),
    categoria_material VARCHAR(200) NOT NULL, -- Tubos Inox, Vigas, Conexões, Chapas, Policarbonato
    contato_vendedor VARCHAR(100),
    telefone VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    endereco_galpao TEXT,
    cidade VARCHAR(100) DEFAULT 'São Paulo',
    uf VARCHAR(10) DEFAULT 'SP',
    condicoes_pagamento_padrao VARCHAR(50) DEFAULT '28 DDL',
    prazo_medio_dias INT DEFAULT 3,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABELA DE PRODUTOS (Metais, Conexões, Chapas, Tubos, etc.)
CREATE TABLE IF NOT EXISTS produtos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(50) UNIQUE NOT NULL,
    descricao TEXT NOT NULL,
    ncm VARCHAR(20),
    categoria VARCHAR(100), -- Tubos, Vigas, Chapas, Conexões, Placas
    unidade_primaria VARCHAR(10) DEFAULT 'PÇ', -- PÇ, KG, M, BR
    unidade_secundaria VARCHAR(10) DEFAULT 'KG',
    fator_conversao NUMERIC(10, 4) DEFAULT 1.0000, -- Para calcular peso por peça/metro
    peso_unitario NUMERIC(10, 3) DEFAULT 0.000, -- em KG
    preco_venda_padrao NUMERIC(12, 2) DEFAULT 0.00,
    estoque_atual NUMERIC(10, 2) DEFAULT 0.00,
    estoque_minimo NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABELA DE VENDEDORES / REPRESENTANTES
CREATE TABLE IF NOT EXISTS vendedores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(100),
    telefone VARCHAR(50),
    percentual_comissao_padrao NUMERIC(5, 2) DEFAULT 3.00,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABELA DE MOTORISTAS E VEÍCULOS
CREATE TABLE IF NOT EXISTS motoristas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(150) NOT NULL,
    telefone VARCHAR(50) NOT NULL,
    cnh VARCHAR(30),
    codigo_acesso VARCHAR(20) UNIQUE, -- Para login rápido no terminal mobile
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS veiculos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    modelo VARCHAR(100) NOT NULL,
    placa VARCHAR(20) UNIQUE NOT NULL,
    capacidade_peso_kg NUMERIC(10, 2),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABELA DE PEDIDOS E ORÇAMENTOS (Ficha Oficial Brasfortal)
CREATE TABLE IF NOT EXISTS pedidos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero_pedido SERIAL UNIQUE,
    tipo VARCHAR(20) DEFAULT 'PEDIDO', -- 'ORCAMENTO' ou 'PEDIDO'
    data_emissao DATE DEFAULT CURRENT_DATE,
    
    -- Dados do Cliente
    cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
    cliente_nome VARCHAR(255) NOT NULL,
    cliente_cnpj VARCHAR(20),
    cliente_ie VARCHAR(50),
    comprador VARCHAR(100),
    telefone VARCHAR(50),
    endereco TEXT,
    
    -- Condições Comerciais e Logística
    condicoes_pagamento VARCHAR(50) DEFAULT '30 DDL', -- Ex: 60 DDL, À Vista, etc.
    pedido_cliente_n VARCHAR(50), -- Número da OC do Cliente (Ex: 700118149)
    local_entrega TEXT,
    transportadora VARCHAR(150),
    local_cobranca TEXT,
    
    -- Vendedor e Comissões
    vendedor_id UUID REFERENCES vendedores(id) ON DELETE SET NULL,
    vendedor_nome VARCHAR(150),
    valor_comissao NUMERIC(12, 2) DEFAULT 0.00,
    
    -- Valores Totais
    valor_total_produtos NUMERIC(12, 2) DEFAULT 0.00,
    peso_total_estimado NUMERIC(10, 3) DEFAULT 0.00,
    
    -- Status
    status VARCHAR(50) DEFAULT 'NOVO', -- 'ORCAMENTO', 'APROVADO', 'SEPARACAO', 'EXPEDICAO', 'EM_ROTA', 'ENTREGUE', 'FATURADO', 'CANCELADO'
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. ITENS DO PEDIDO
CREATE TABLE IF NOT EXISTS itens_pedido (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
    item_numero INT NOT NULL,
    produto_id UUID REFERENCES produtos(id) ON DELETE SET NULL,
    codigo VARCHAR(50),
    descricao TEXT NOT NULL,
    unid_1 VARCHAR(10) DEFAULT 'PÇ',
    quant_1 NUMERIC(10, 2) NOT NULL DEFAULT 1,
    unid_2 VARCHAR(10) DEFAULT 'PÇ',
    quant_2 NUMERIC(10, 2) DEFAULT 1,
    peso NUMERIC(10, 3) DEFAULT 0.000,
    valor_unitario NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    valor_total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. EXPEDIÇÃO & NOTAS FISCAIS DO PEDIDO (Bloco NF 1..7 da ficha)
CREATE TABLE IF NOT EXISTS expedicao_nfs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
    numero_nf VARCHAR(50) NOT NULL,
    icms_percent NUMERIC(5, 2) DEFAULT 0.00,
    peso_total NUMERIC(10, 3) DEFAULT 0.00,
    especie VARCHAR(50) DEFAULT 'VOLUMES',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. ROMANEIO DE CARGA & ROTEIRIZAÇÃO
CREATE TABLE IF NOT EXISTS romaneios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero_romaneio SERIAL UNIQUE,
    data_saida DATE DEFAULT CURRENT_DATE,
    motorista_id UUID REFERENCES motoristas(id) ON DELETE SET NULL,
    motorista_nome VARCHAR(150),
    veiculo_id UUID REFERENCES veiculos(id) ON DELETE SET NULL,
    veiculo_placa VARCHAR(20),
    status VARCHAR(50) DEFAULT 'PLANEJADO', -- 'PLANEJADO', 'EM_ROTA', 'FINALIZADO'
    peso_total_romaneio NUMERIC(10, 2) DEFAULT 0.00,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. PARADAS DO ROMANEIO (Entregas e Coletas)
CREATE TABLE IF NOT EXISTS paradas_romaneio (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    romaneio_id UUID REFERENCES romaneios(id) ON DELETE CASCADE,
    tipo VARCHAR(20) DEFAULT 'ENTREGA', -- 'ENTREGA' ou 'COLETA'
    pedido_id UUID REFERENCES pedidos(id) ON DELETE SET NULL,
    ordem_parada INT NOT NULL DEFAULT 1,
    destinatario_nome VARCHAR(255) NOT NULL,
    documento VARCHAR(30),
    comprador_contato VARCHAR(100),
    telefone VARCHAR(50),
    endereco TEXT NOT NULL,
    cidade VARCHAR(100),
    bairro VARCHAR(100),
    cep VARCHAR(20),
    nfs_vinculadas TEXT,
    peso_kg NUMERIC(10, 2) DEFAULT 0.00,
    volumes VARCHAR(100),
    
    -- Status da Parada
    status VARCHAR(50) DEFAULT 'PENDENTE', -- 'PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDO', 'INSUCESSO'
    motivo_insucesso TEXT,
    
    -- Comprovação de Entrega
    recebedor_nome VARCHAR(150),
    recebedor_documento VARCHAR(50),
    canhoto_foto_url TEXT,
    observacao_motorista TEXT,
    data_hora_conclusao TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- INSERIR DADOS DE DEMONSTRAÇÃO INICIAIS (Baseados no exemplo real Brasfortal)
INSERT INTO clientes (razao_social, nome_fantasia, cnpj, inscricao_estadual, comprador_padrao, telefone, endereco_completo, local_entrega_padrao, local_cobranca_padrao, condicao_pagamento_padrao)
VALUES 
('GE ENERGIA E INDUSTRIA LTDA', 'GE', '33.435.231/0001-87', '086.123.456-0', 'VITORIA', '(11) 98765-4321', 'Av. Industrial, 1500 - Galpão 3 - São Paulo/SP', 'Av. Industrial, 1500 - Galpão 3 - Doca 2', 'Av. das Nações Unidas, 8500 - SP', '60 DDL')
ON CONFLICT (cnpj) DO NOTHING;

INSERT INTO produtos (codigo, descricao, ncm, categoria, unidade_primaria, unidade_secundaria, fator_conversao, peso_unitario, preco_venda_padrao)
VALUES 
('450', 'PLACA POLICARBONATO CRISTAL. 2050 X 1000 X 4MM', '39206100', 'Placas', 'PÇ', 'PÇ', 1.0, 9.840, 505.70),
('TB-304-1', 'TUBO INOX 304 COM COSTURA OD 1" X 1.50MM', '73064000', 'Tubos', 'M', 'KG', 1.15, 1.150, 48.90),
('CX-90-2', 'COTOVELO 90º 2" 150 LBS BSP INOX 304', '73072900', 'Conexões', 'PÇ', 'KG', 0.65, 0.650, 62.50),
('VF-W150', 'VIGA I / W 150 X 13.0 KG/M - AÇO CARBONO ASTM A36', '72163300', 'Vigas', 'BR', 'KG', 78.0, 13.000, 890.00)
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO vendedores (nome, email, telefone, percentual_comissao_padrao)
VALUES 
('LUCC BISPO', 'lucc.bispo@brasfortal.com.br', '(11) 99887-1122', 3.5),
('MARCOS SILVA', 'marcos@brasfortal.com.br', '(11) 99887-3344', 3.0)
ON CONFLICT DO NOTHING;

INSERT INTO motoristas (nome, telefone, cnh, codigo_acesso)
VALUES 
('Carlos Eduardo (Carlinhos)', '(11) 97766-5544', '12345678900', 'MOT-01'),
('Roberto Santos', '(11) 97766-9988', '98765432100', 'MOT-02')
ON CONFLICT DO NOTHING;

INSERT INTO veiculos (modelo, placa, capacidade_peso_kg)
VALUES 
('Mercedes-Benz Accelo 1016 (Baú)', 'BRA-4F26', 6000.00),
('Iveco Daily 35S14 (Carroceria Aberta)', 'BRS-8K19', 3500.00)
ON CONFLICT DO NOTHING;

-- 9. TABELA DE USUÁRIOS E PERFIS DE ACESSO (RBAC)
CREATE TABLE IF NOT EXISTS usuarios_sistema (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    perfil VARCHAR(50) NOT NULL DEFAULT 'COMERCIAL', -- 'MASTER', 'COMERCIAL', 'LOGISTICA', 'MOTORISTA'
    cargo VARCHAR(150),
    telefone VARCHAR(50),
    foto_url TEXT,
    ativo BOOLEAN DEFAULT true,
    ultimo_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Inserir usuário Master padrão
INSERT INTO usuarios_sistema (nome, email, perfil, cargo, telefone, foto_url, ativo)
VALUES 
('Márcio Santos', 'marciorsantos05@gmail.com', 'MASTER', 'Diretoria Geral / Administrador Master', '(11) 98765-0000', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', true),
('Lucc Bispo', 'lucc.bispo@brasfortal.com.br', 'COMERCIAL', 'Gerente Comercial & Vendas', '(11) 98877-6655', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', true),
('Carlos Eduardo Mendes', 'carlos.expedicao@brasfortal.com.br', 'LOGISTICA', 'Supervisor de Logística & Expedição', '(11) 97766-5544', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', true),
('José Carlos Oliveira', 'jose.transporte@brasfortal.com.br', 'MOTORISTA', 'Motorista Frota Pesada (Caminhão VW)', '(11) 98765-4321', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', true)
ON CONFLICT (email) DO NOTHING;

