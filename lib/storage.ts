'use client';

import { Cliente, Fornecedor, Produto, Vendedor, Motorista, Veiculo, Pedido, Romaneio, ParadaRomaneio, Usuario } from './types';
import { 
  INITIAL_CLIENTES, 
  INITIAL_FORNECEDORES, 
  INITIAL_PRODUTOS, 
  INITIAL_VENDEDORES, 
  INITIAL_MOTORISTAS, 
  INITIAL_VEICULOS, 
  INITIAL_PEDIDOS, 
  INITIAL_ROMANEIOS,
  INITIAL_USUARIOS 
} from './mockData';

const STORAGE_KEYS = {
  CLIENTES: 'brasfortal_clientes',
  FORNECEDORES: 'brasfortal_fornecedores',
  PRODUTOS: 'brasfortal_produtos',
  VENDEDORES: 'brasfortal_vendedores',
  MOTORISTAS: 'brasfortal_motoristas',
  VEICULOS: 'brasfortal_veiculos',
  PEDIDOS: 'brasfortal_pedidos',
  ROMANEIOS: 'brasfortal_romaneios',
  USUARIOS: 'brasfortal_usuarios',
  SESSION: 'brasfortal_session'
};

function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.warn(`Erro ao ler localStorage (${key}):`, e);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Erro ao salvar no localStorage (${key}):`, e);
  }
}

export const StorageService = {
  // CLIENTES (CRUD)
  getClientes: (): Cliente[] => getFromStorage(STORAGE_KEYS.CLIENTES, INITIAL_CLIENTES),
  saveCliente: (cliente: Cliente): Cliente[] => {
    const current = StorageService.getClientes();
    const index = current.findIndex(c => c.id === cliente.id);
    let updated: Cliente[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = cliente;
    } else {
      updated = [cliente, ...current];
    }
    saveToStorage(STORAGE_KEYS.CLIENTES, updated);
    return updated;
  },
  deleteCliente: (id: string): Cliente[] => {
    const current = StorageService.getClientes();
    const updated = current.filter(c => c.id !== id);
    saveToStorage(STORAGE_KEYS.CLIENTES, updated);
    return updated;
  },

  // FORNECEDORES (CRUD)
  getFornecedores: (): Fornecedor[] => getFromStorage(STORAGE_KEYS.FORNECEDORES, INITIAL_FORNECEDORES),
  saveFornecedor: (fornecedor: Fornecedor): Fornecedor[] => {
    const current = StorageService.getFornecedores();
    const index = current.findIndex(f => f.id === fornecedor.id);
    let updated: Fornecedor[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = fornecedor;
    } else {
      updated = [fornecedor, ...current];
    }
    saveToStorage(STORAGE_KEYS.FORNECEDORES, updated);
    return updated;
  },
  deleteFornecedor: (id: string): Fornecedor[] => {
    const current = StorageService.getFornecedores();
    const updated = current.filter(f => f.id !== id);
    saveToStorage(STORAGE_KEYS.FORNECEDORES, updated);
    return updated;
  },

  // PRODUTOS (CRUD)
  getProdutos: (): Produto[] => getFromStorage(STORAGE_KEYS.PRODUTOS, INITIAL_PRODUTOS),
  saveProduto: (produto: Produto): Produto[] => {
    const current = StorageService.getProdutos();
    const index = current.findIndex(p => p.id === produto.id);
    let updated: Produto[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = produto;
    } else {
      updated = [produto, ...current];
    }
    saveToStorage(STORAGE_KEYS.PRODUTOS, updated);
    return updated;
  },
  deleteProduto: (id: string): Produto[] => {
    const current = StorageService.getProdutos();
    const updated = current.filter(p => p.id !== id);
    saveToStorage(STORAGE_KEYS.PRODUTOS, updated);
    return updated;
  },

  // VENDEDORES
  getVendedores: (): Vendedor[] => getFromStorage(STORAGE_KEYS.VENDEDORES, INITIAL_VENDEDORES),

  // MOTORISTAS (CRUD)
  getMotoristas: (): Motorista[] => getFromStorage(STORAGE_KEYS.MOTORISTAS, INITIAL_MOTORISTAS),
  saveMotorista: (motorista: Motorista): Motorista[] => {
    const current = StorageService.getMotoristas();
    const index = current.findIndex(m => m.id === motorista.id);
    let updated: Motorista[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = motorista;
    } else {
      updated = [motorista, ...current];
    }
    saveToStorage(STORAGE_KEYS.MOTORISTAS, updated);
    return updated;
  },
  deleteMotorista: (id: string): Motorista[] => {
    const current = StorageService.getMotoristas();
    const updated = current.filter(m => m.id !== id);
    saveToStorage(STORAGE_KEYS.MOTORISTAS, updated);
    return updated;
  },

  // VEÍCULOS (CRUD)
  getVeiculos: (): Veiculo[] => getFromStorage(STORAGE_KEYS.VEICULOS, INITIAL_VEICULOS),
  saveVeiculo: (veiculo: Veiculo): Veiculo[] => {
    const current = StorageService.getVeiculos();
    const index = current.findIndex(v => v.id === veiculo.id);
    let updated: Veiculo[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = veiculo;
    } else {
      updated = [veiculo, ...current];
    }
    saveToStorage(STORAGE_KEYS.VEICULOS, updated);
    return updated;
  },
  deleteVeiculo: (id: string): Veiculo[] => {
    const current = StorageService.getVeiculos();
    const updated = current.filter(v => v.id !== id);
    saveToStorage(STORAGE_KEYS.VEICULOS, updated);
    return updated;
  },

  // PEDIDOS (CRUD)
  getPedidos: (): Pedido[] => getFromStorage(STORAGE_KEYS.PEDIDOS, INITIAL_PEDIDOS),
  getPedidoById: (id: string): Pedido | undefined => {
    return StorageService.getPedidos().find(p => p.id === id);
  },
  savePedido: (pedido: Pedido): Pedido[] => {
    const current = StorageService.getPedidos();
    const index = current.findIndex(p => p.id === pedido.id);
    let updated: Pedido[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = pedido;
    } else {
      updated = [pedido, ...current];
    }
    saveToStorage(STORAGE_KEYS.PEDIDOS, updated);
    return updated;
  },
  deletePedido: (id: string): Pedido[] => {
    const current = StorageService.getPedidos();
    const updated = current.filter(p => p.id !== id);
    saveToStorage(STORAGE_KEYS.PEDIDOS, updated);
    return updated;
  },

  // ROMANEIOS (CRUD)
  getRomaneios: (): Romaneio[] => getFromStorage(STORAGE_KEYS.ROMANEIOS, INITIAL_ROMANEIOS),
  getRomaneioById: (id: string): Romaneio | undefined => {
    return StorageService.getRomaneios().find(r => r.id === id);
  },
  saveRomaneio: (romaneio: Romaneio): Romaneio[] => {
    const current = StorageService.getRomaneios();
    const index = current.findIndex(r => r.id === romaneio.id);
    let updated: Romaneio[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = romaneio;
    } else {
      updated = [romaneio, ...current];
    }
    saveToStorage(STORAGE_KEYS.ROMANEIOS, updated);
    return updated;
  },
  updateParadaStatus: (
    romaneioId: string, 
    paradaId: string, 
    dados: Partial<ParadaRomaneio>
  ): Romaneio | null => {
    const romaneios = StorageService.getRomaneios();
    const romaneio = romaneios.find(r => r.id === romaneioId);
    if (!romaneio) return null;

    const paradasAtualizadas = romaneio.paradas.map(p => {
      if (p.id === paradaId) {
        return {
          ...p,
          ...dados,
          data_hora_conclusao: dados.status === 'CONCLUIDO' ? new Date().toISOString() : p.data_hora_conclusao
        };
      }
      return p;
    });

    const todasConcluidas = paradasAtualizadas.every(p => p.status === 'CONCLUIDO');
    const statusRomaneio = todasConcluidas ? 'FINALIZADO' : 'EM_ROTA';

    const romaneioAtualizado: Romaneio = {
      ...romaneio,
      status: statusRomaneio,
      paradas: paradasAtualizadas
    };

    const paradaModificada = romaneio.paradas.find(p => p.id === paradaId);
    if (paradaModificada?.pedido_id && dados.status === 'CONCLUIDO') {
      const pedido = StorageService.getPedidoById(paradaModificada.pedido_id);
      if (pedido) {
        StorageService.savePedido({
          ...pedido,
          status: 'ENTREGUE'
        });
      }
    }

    StorageService.saveRomaneio(romaneioAtualizado);
    return romaneioAtualizado;
  },

  // USUARIOS (CRUD)
  getUsuarios: (): Usuario[] => getFromStorage(STORAGE_KEYS.USUARIOS, INITIAL_USUARIOS),
  saveUsuario: (usuario: Usuario): Usuario[] => {
    const current = StorageService.getUsuarios();
    const index = current.findIndex(u => u.id === usuario.id || u.email === usuario.email);
    let updated: Usuario[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = usuario;
    } else {
      updated = [usuario, ...current];
    }
    saveToStorage(STORAGE_KEYS.USUARIOS, updated);
    return updated;
  },
  deleteUsuario: (id: string): Usuario[] => {
    const current = StorageService.getUsuarios();
    const updated = current.filter(u => u.id !== id);
    saveToStorage(STORAGE_KEYS.USUARIOS, updated);
    return updated;
  },

  // SESSÃO DO USUÁRIO LOGADO
  getSessionUser: (): Usuario | null => {
    const user = getFromStorage<Usuario | null>(STORAGE_KEYS.SESSION, null);
    if (user) return user;
    // Padrão: Master marciorsantos05@gmail.com
    const master = INITIAL_USUARIOS.find(u => u.email === 'marciorsantos05@gmail.com') || INITIAL_USUARIOS[0];
    return master;
  },
  setSessionUser: (usuario: Usuario | null): void => {
    if (typeof window === 'undefined') return;
    if (usuario) {
      saveToStorage(STORAGE_KEYS.SESSION, usuario);
    } else {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  },

  // Resetar para os dados iniciais de demonstração
  resetToDefault: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.CLIENTES);
    localStorage.removeItem(STORAGE_KEYS.FORNECEDORES);
    localStorage.removeItem(STORAGE_KEYS.PRODUTOS);
    localStorage.removeItem(STORAGE_KEYS.VENDEDORES);
    localStorage.removeItem(STORAGE_KEYS.MOTORISTAS);
    localStorage.removeItem(STORAGE_KEYS.VEICULOS);
    localStorage.removeItem(STORAGE_KEYS.PEDIDOS);
    localStorage.removeItem(STORAGE_KEYS.ROMANEIOS);
    localStorage.removeItem(STORAGE_KEYS.USUARIOS);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    window.location.reload();
  }
};

