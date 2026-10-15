/**
 * Utilitário de Engenharia para Cálculo de Peso Teórico de Metais e Plásticos Industriais
 * Brasfortal Metais e Conexões Ltda.
 */

export interface MaterialDensity {
  id: string;
  nome: string;
  tipo: 'INOX' | 'ACO_CARBONO' | 'POLICARBONATO' | 'ALUMINIO' | 'LATAO' | 'OUTRO';
  densidade_g_cm3: number; // g/cm³
  fator_tubo_redondo: number; // Constante para tubos: (OD - W) * W * fator
}

export const MATERIAIS_DENSIDADE: Record<string, MaterialDensity> = {
  INOX_304: {
    id: 'INOX_304',
    nome: 'Aço Inox AISI 304 / 304L',
    tipo: 'INOX',
    densidade_g_cm3: 7.93,
    fator_tubo_redondo: 0.02491
  },
  INOX_316: {
    id: 'INOX_316',
    nome: 'Aço Inox AISI 316 / 316L',
    tipo: 'INOX',
    densidade_g_cm3: 8.00,
    fator_tubo_redondo: 0.02513
  },
  INOX_430: {
    id: 'INOX_430',
    nome: 'Aço Inox AISI 430',
    tipo: 'INOX',
    densidade_g_cm3: 7.75,
    fator_tubo_redondo: 0.02434
  },
  ACO_CARBONO: {
    id: 'ACO_CARBONO',
    nome: 'Aço Carbono (A36 / SAE 1020)',
    tipo: 'ACO_CARBONO',
    densidade_g_cm3: 7.85,
    fator_tubo_redondo: 0.02466
  },
  POLICARBONATO: {
    id: 'POLICARBONATO',
    nome: 'Policarbonato Compacto',
    tipo: 'POLICARBONATO',
    densidade_g_cm3: 1.20,
    fator_tubo_redondo: 0
  },
  ALUMINIO: {
    id: 'ALUMINIO',
    nome: 'Alumínio (5052 / 6063)',
    tipo: 'ALUMINIO',
    densidade_g_cm3: 2.70,
    fator_tubo_redondo: 0.00848
  },
  LATAO: {
    id: 'LATAO',
    nome: 'Latão / Bronze Comercial',
    tipo: 'LATAO',
    densidade_g_cm3: 8.50,
    fator_tubo_redondo: 0.02670
  }
};

export type GeometriaTipo = 'CHAPA' | 'TUBO_REDONDO' | 'TUBO_QUADRADO' | 'BARRA_REDONDA' | 'PERFIL_VIGA' | 'CONEXAO_ACESSORIO';

export interface ParametrosCalculoPeso {
  geometria: GeometriaTipo;
  materialKey: string;
  // Chapas / Placas
  espessura_mm?: number;
  largura_mm?: number;
  comprimento_mm?: number;
  // Tubos Redondos
  diametro_externo_mm?: number;
  parede_mm?: number;
  comprimento_metros?: number;
  // Tubos Quadrados / Retangulares
  lado_a_mm?: number;
  lado_b_mm?: number;
  // Barras Redondas
  diametro_barra_mm?: number;
  // Peças prontas / conexões
  peso_unitario_manual?: number;
  // Quantidade de peças
  quantidade: number;
}

/**
 * Converte frações de polegada comuns em mm
 * Ex: 1" -> 25.4, 1/2" -> 12.7, 3/4" -> 19.05, 2" -> 50.8
 */
export function converterPolegadaParaMm(polStr: string): number | null {
  const limpo = polStr.replace(/"/g, '').trim();
  const polegadasFixo: Record<string, number> = {
    '1/4': 6.35,
    '3/8': 9.53,
    '1/2': 12.7,
    '5/8': 15.88,
    '3/4': 19.05,
    '7/8': 22.23,
    '1': 25.4,
    '1.1/4': 31.75,
    '1 1/4': 31.75,
    '1.1/2': 38.1,
    '1 1/2': 38.1,
    '2': 50.8,
    '2.1/2': 63.5,
    '2 1/2': 63.5,
    '3': 76.2,
    '3.1/2': 88.9,
    '4': 101.6,
    '5': 127.0,
    '6': 152.4,
    '8': 203.2,
    '10': 254.0
  };

  if (polegadasFixo[limpo]) return polegadasFixo[limpo];

  // Se for fração tipo A/B
  if (limpo.includes('/')) {
    const partes = limpo.split('/');
    const num = parseFloat(partes[0]);
    const den = parseFloat(partes[1]);
    if (!isNaN(num) && !isNaN(den) && den !== 0) {
      return Number(((num / den) * 25.4).toFixed(2));
    }
  }

  const numFloat = parseFloat(limpo);
  if (!isNaN(numFloat)) return Number((numFloat * 25.4).toFixed(2));

  return null;
}

/**
 * Executa o cálculo exato do peso teórico
 */
export function calcularPesoTeorico(
  params: ParametrosCalculoPeso,
  customMateriaisMap?: Record<string, MaterialDensity>
): {
  pesoUnitarioKg: number;
  pesoTotalKg: number;
  formulaExplicativa: string;
} {
  const map = customMateriaisMap || MATERIAIS_DENSIDADE;
  const mat = map[params.materialKey] || MATERIAIS_DENSIDADE[params.materialKey] || MATERIAIS_DENSIDADE.INOX_304;
  const quant = params.quantidade > 0 ? params.quantidade : 1;
  let unitKg = 0;
  let formula = '';

  switch (params.geometria) {
    case 'CHAPA': {
      const e = params.espessura_mm || 0;
      const l = params.largura_mm || 0;
      const c = params.comprimento_mm || 0;
      // Peso = (E * L * C * densidade) / 1.000.000
      unitKg = (e * l * c * mat.densidade_g_cm3) / 1000000;
      formula = `(${e}mm × ${l}mm × ${c}mm × ${mat.densidade_g_cm3} g/cm³) ÷ 1.000.000`;
      break;
    }

    case 'TUBO_REDONDO': {
      const od = params.diametro_externo_mm || 0;
      const w = params.parede_mm || 0;
      const metros = params.comprimento_metros || 1;
      // Peso por metro = (OD - W) * W * fator_tubo_redondo
      const pesoPorMetro = (od - w) * w * mat.fator_tubo_redondo;
      unitKg = pesoPorMetro * metros;
      formula = `(${od}mm - ${w}mm) × ${w}mm × ${mat.fator_tubo_redondo} × ${metros}m`;
      break;
    }

    case 'TUBO_QUADRADO': {
      const la = params.lado_a_mm || 0;
      const lb = params.lado_b_mm || la;
      const w = params.parede_mm || 0;
      const metros = params.comprimento_metros || 1;
      // Perímetro médio aproximado = 2*(La + Lb) - 4*w
      // Peso metro = (Perímetro em mm * W em mm * densidade) / 1000
      const perimetro = 2 * (la + lb) - 4 * w;
      const pesoPorMetro = (perimetro * w * mat.densidade_g_cm3) / 1000;
      unitKg = pesoPorMetro * metros;
      formula = `[2 × (${la} + ${lb}) - 4×${w}] × ${w}mm × ${mat.densidade_g_cm3} ÷ 1000 × ${metros}m`;
      break;
    }

    case 'BARRA_REDONDA': {
      const d = params.diametro_barra_mm || 0;
      const metros = params.comprimento_metros || 1;
      // Peso metro = (π * (d/2)^2 * densidade) / 1000
      const raio = d / 2;
      const pesoPorMetro = (Math.PI * Math.pow(raio, 2) * mat.densidade_g_cm3) / 1000;
      unitKg = pesoPorMetro * metros;
      formula = `π × (${d}/2)² × ${mat.densidade_g_cm3} ÷ 1000 × ${metros}m`;
      break;
    }

    case 'PERFIL_VIGA': {
      const metros = params.comprimento_metros || 1;
      const pesoM = params.peso_unitario_manual || 13.0;
      unitKg = pesoM * metros;
      formula = `${pesoM} kg/m × ${metros}m`;
      break;
    }

    case 'CONEXAO_ACESSORIO': {
      unitKg = params.peso_unitario_manual || 0;
      formula = `Peso tabelado de norma/catálogo: ${unitKg} kg/pç`;
      break;
    }
  }

  const pesoUnitarioFinal = Number(unitKg.toFixed(2));
  const pesoTotalFinal = Number((pesoUnitarioFinal * quant).toFixed(2));

  return {
    pesoUnitarioKg: pesoUnitarioFinal,
    pesoTotalKg: pesoTotalFinal,
    formulaExplicativa: formula
  };
}

/**
 * Analisa a descrição do produto e tenta extrair geometria, material e dimensões automaticamente
 */
export function analisarDescricaoProduto(descricao: string, quant: number = 1): ParametrosCalculoPeso | null {
  if (!descricao || descricao.trim().length < 3) return null;
  const desc = descricao.toUpperCase();

  // 1. Identificar Material
  let materialKey = 'INOX_304';
  if (desc.includes('POLICARBONATO') || desc.includes('CRISTAL') || desc.includes('ALVEOLAR')) {
    materialKey = 'POLICARBONATO';
  } else if (desc.includes('316') || desc.includes('316L')) {
    materialKey = 'INOX_316';
  } else if (desc.includes('430')) {
    materialKey = 'INOX_430';
  } else if (desc.includes('CARBONO') || desc.includes('A36') || desc.includes('1020') || desc.includes('GALVANIZADO')) {
    materialKey = 'ACO_CARBONO';
  } else if (desc.includes('ALUMINIO') || desc.includes('ALUMÍNIO')) {
    materialKey = 'ALUMINIO';
  } else if (desc.includes('LATAO') || desc.includes('LATÃO') || desc.includes('BRONZE')) {
    materialKey = 'LATAO';
  }

  // 2. Tentar detectar Chapa / Placa: Ex: 2050 X 1000 X 4MM ou 2000X1000X3MM
  // Padrão 3 dimensões com 'X'
  const chapaRegex = /(\d+(?:[.,]\d+)?)\s*(?:X|\*)\s*(\d+(?:[.,]\d+)?)\s*(?:X|\*)\s*(\d+(?:[.,]\d+)?)\s*(?:MM)?/i;
  const chapaMatch = desc.match(chapaRegex);
  if (chapaMatch) {
    const val1 = parseFloat(chapaMatch[1].replace(',', '.'));
    const val2 = parseFloat(chapaMatch[2].replace(',', '.'));
    const val3 = parseFloat(chapaMatch[3].replace(',', '.'));

    const sorted = [val1, val2, val3].sort((a, b) => a - b);
    const espessura = sorted[0];
    const largura = sorted[1];
    const comprimento = sorted[2];

    return {
      geometria: 'CHAPA',
      materialKey,
      espessura_mm: espessura,
      largura_mm: largura,
      comprimento_mm: comprimento,
      quantidade: quant
    };
  }

  // 3. Tentar detectar Tubo Redondo: Ex: TUBO ... OD 1" X 1.50MM ou 25.4 X 1.50MM ou 2" X 2MM
  if (desc.includes('TUBO') || desc.includes('TUB.') || desc.includes('OD')) {
    // Procura polegada tipo 1", 1.1/2", 2", 3/4"
    const polRegex = /(\d+(?:[.,]\d+)?(?:\/\d+)?|\d+\/\d+)"\s*(?:X|\*)\s*(\d+(?:[.,]\d+)?)\s*(?:MM)?/i;
    const polMatch = desc.match(polRegex);
    if (polMatch) {
      const diamMm = converterPolegadaParaMm(polMatch[1]) || 25.4;
      const paredeMm = parseFloat(polMatch[2].replace(',', '.'));
      return {
        geometria: 'TUBO_REDONDO',
        materialKey,
        diametro_externo_mm: diamMm,
        parede_mm: paredeMm,
        comprimento_metros: 1, // Padrão 1 metro ou ajustado por unidade
        quantidade: quant
      };
    }

    // Procura mm tipo 25.4 X 1.5MM ou 50.8 X 2.0MM
    const mmRegex = /(\d+(?:[.,]\d+)?)\s*(?:MM)?\s*(?:X|\*)\s*(\d+(?:[.,]\d+)?)\s*(?:MM)?/i;
    const mmMatch = desc.match(mmRegex);
    if (mmMatch) {
      const val1 = parseFloat(mmMatch[1].replace(',', '.'));
      const val2 = parseFloat(mmMatch[2].replace(',', '.'));
      const maior = Math.max(val1, val2);
      const menor = Math.min(val1, val2);
      return {
        geometria: 'TUBO_REDONDO',
        materialKey,
        diametro_externo_mm: maior,
        parede_mm: menor,
        comprimento_metros: 1,
        quantidade: quant
      };
    }
  }

  // 4. Barra Redonda: Ex: BARRA REDONDA 1/2" ou 25MM
  if (desc.includes('BARRA') || desc.includes('REDONDO')) {
    const barraPolMatch = desc.match(/(\d+(?:[.,]\d+)?(?:\/\d+)?|\d+\/\d+)"/i);
    if (barraPolMatch) {
      const diamMm = converterPolegadaParaMm(barraPolMatch[1]);
      if (diamMm) {
        return {
          geometria: 'BARRA_REDONDA',
          materialKey,
          diametro_barra_mm: diamMm,
          comprimento_metros: 1,
          quantidade: quant
        };
      }
    }
  }

  return null;
}
