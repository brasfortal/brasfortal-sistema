'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Truck, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Smartphone, 
  Plus, 
  ArrowRight,
  Package,
  Calendar,
  User,
  Scale,
  ExternalLink
} from 'lucide-react';
import { Romaneio, ParadaRomaneio, Motorista, Veiculo, Pedido } from '@/lib/types';
import { StorageService } from '@/lib/storage';

export default function LogisticsBoard() {
  const [romaneios, setRomaneios] = useState<Romaneio[]>([]);
  const [pedidosPendentes, setPedidosPendentes] = useState<Pedido[]>([]);
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [selectedRomaneioId, setSelectedRomaneioId] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const roms = StorageService.getRomaneios();
    setRomaneios(roms);
    if (roms.length > 0 && !selectedRomaneioId) {
      setSelectedRomaneioId(roms[0].id);
    }

    const peds = StorageService.getPedidos().filter(
      p => p.status === 'APROVADO' || p.status === 'SEPARACAO' || p.status === 'EXPEDICAO' || p.status === 'NOVO'
    );
    setPedidosPendentes(peds);
    setMotoristas(StorageService.getMotoristas());
    setVeiculos(StorageService.getVeiculos());
  };

  const currentRomaneio = romaneios.find(r => r.id === selectedRomaneioId) || romaneios[0];

  const handleUpdateStatus = (paradaId: string, novoStatus: 'PENDENTE' | 'A_CAMINHO' | 'CONCLUIDO' | 'INSUCESSO') => {
    if (!currentRomaneio) return;
    StorageService.updateParadaStatus(currentRomaneio.id, paradaId, { status: novoStatus });
    loadData();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONCLUIDO':
        return <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> Entregue / Coletado</span>;
      case 'A_CAMINHO':
        return <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800 border border-blue-200"><Truck className="w-3 h-3" /> Em Rota</span>;
      case 'INSUCESSO':
        return <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-bold bg-red-100 text-red-800 border border-red-200"><AlertTriangle className="w-3 h-3" /> Ocorrência</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-200"><Clock className="w-3 h-3" /> Pendente</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho da Logística */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Truck className="w-7 h-7 text-blue-600" />
            <span>Central de Logística & Expedição</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestão de romaneios de entrega e coleta, controle de pesagem e acompanhamento em tempo real
          </p>
        </div>

        {/* Seletor de Romaneio Ativo & Terminal do Motorista */}
        <div className="flex items-center gap-3">
          <Link
            href="/motorista"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-bold text-xs shadow-md shadow-emerald-600/20 hover:scale-[1.02] transition-transform"
          >
            <Smartphone className="w-4 h-4" />
            <span>Abrir Terminal do Motorista (Mobile)</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
          </Link>
        </div>
      </div>

      {/* DETALHES DO ROMANEIO SELECIONADO */}
      {currentRomaneio ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Coluna Esquerda: Informações do Veículo e Motorista (4 colunas) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-black text-base text-slate-900">
                  Romaneio Nº #{currentRomaneio.numero_romaneio}
                </h3>
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-100 text-blue-800">
                  {currentRomaneio.status}
                </span>
              </div>

              {/* Motorista */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Motorista Responsável</span>
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>{currentRomaneio.motorista_nome}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentRomaneio.motorista_telefone || '(11) 97766-5544'}</span>
                </div>
              </div>

              {/* Veículo & Placa */}
              <div className="space-y-1 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Veículo & Placa</span>
                <div className="flex items-center justify-between font-bold text-slate-800 text-sm">
                  <span>{currentRomaneio.veiculo_modelo}</span>
                  <span className="px-2 py-0.5 bg-slate-900 text-white rounded font-mono text-xs">
                    {currentRomaneio.veiculo_placa}
                  </span>
                </div>
              </div>

              {/* Capacidade e Peso Total da Carga */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5 text-slate-400" />
                    Carga do Romaneio:
                  </span>
                  <span className="text-blue-900 font-black">
                    {currentRomaneio.paradas.reduce((a, p) => a + (p.peso_kg || 0), 0).toFixed(2)} KG
                  </span>
                </div>
                {/* Barra de Progresso de Carga */}
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ 
                      width: `${Math.min(100, (currentRomaneio.paradas.reduce((a, p) => a + (p.peso_kg || 0), 0) / (currentRomaneio.capacidade_veiculo_kg || 6000)) * 100)}%` 
                    }}
                  ></div>
                </div>
                <div className="text-[10px] text-slate-500 text-right">
                  Capacidade máxima: {currentRomaneio.capacidade_veiculo_kg || 6000} KG
                </div>
              </div>

              {/* Link de Compartilhamento para o Motorista */}
              <div className="pt-3 border-t border-slate-100 bg-slate-50 p-3 rounded-lg">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Link de Acesso Direto do Motorista:
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/motorista`}
                    className="w-full text-[11px] p-1.5 bg-white border border-slate-300 rounded font-mono text-slate-700"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/motorista`);
                      alert('Link copiado! Envie pelo WhatsApp para o motorista.');
                    }}
                    className="px-2.5 py-1.5 bg-slate-800 text-white rounded text-xs font-bold whitespace-nowrap hover:bg-slate-700"
                  >
                    Copiar
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Coluna Direita: Roteiro com Sequência de Paradas (8 colunas) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div>
                  <h2 className="text-base font-black text-slate-900">
                    Roteiro de Paradas (Entregas & Coletas)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Sequência ordenada de entrega nos clientes e coletas em fornecedores
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                  {currentRomaneio.paradas.filter(p => p.status === 'CONCLUIDO').length} de {currentRomaneio.paradas.length} Concluídas
                </span>
              </div>

              {/* Lista de Paradas */}
              <div className="space-y-3">
                {currentRomaneio.paradas.map((parada, idx) => {
                  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(parada.endereco)}`;
                  const whatsappUrl = `https://wa.me/55${parada.telefone.replace(/\D/g, '')}?text=Olá%20${encodeURIComponent(parada.comprador_contato || '')},%20aqui%20é%20da%20expedição%20da%20Brasfortal.%20O%20motorista%20está%20a%20caminho%20da%20sua%20entrega!`;

                  return (
                    <div 
                      key={parada.id}
                      className={`p-4 rounded-xl border transition-all ${
                        parada.status === 'CONCLUIDO' 
                          ? 'bg-slate-50 border-emerald-200 opacity-90'
                          : 'bg-white border-slate-300 shadow-sm hover:border-blue-300'
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        
                        {/* Indicador de Ordem e Tipo */}
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm text-white ${
                            parada.tipo === 'COLETA' ? 'bg-amber-600' : 'bg-blue-600'
                          }`}>
                            {idx + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                                parada.tipo === 'COLETA' 
                                  ? 'bg-amber-100 text-amber-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {parada.tipo}
                              </span>
                              <h4 className="font-extrabold text-slate-900 text-sm">
                                {parada.destinatario_nome}
                              </h4>
                            </div>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                              {parada.comprador_contato ? `Contato: ${parada.comprador_contato} • ` : ''}
                              Tel: {parada.telefone}
                            </p>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div>
                          {getStatusBadge(parada.status)}
                        </div>

                      </div>

                      {/* Endereço Completo */}
                      <div className="mt-3 flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span className="font-medium">{parada.endereco}</span>
                      </div>

                      {/* Dados da Carga: NFs, Volumes, Peso */}
                      <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
                        {parada.nfs_vinculadas && (
                          <span className="bg-slate-100 px-2 py-1 rounded text-slate-800 border border-slate-200">
                            📄 {parada.nfs_vinculadas}
                          </span>
                        )}
                        <span>⚖️ Peso: <strong className="text-slate-900">{parada.peso_kg.toFixed(2)} KG</strong></span>
                        {parada.volumes && <span>📦 Volumes: <strong>{parada.volumes}</strong></span>}
                        {parada.numero_pedido && (
                          <Link 
                            href={`/pedidos/${parada.pedido_id}`}
                            className="text-blue-600 hover:underline flex items-center gap-0.5 ml-auto"
                          >
                            Ver Pedido #{parada.numero_pedido}
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        )}
                      </div>

                      {/* Ações Rápidas: Google Maps, WhatsApp, Baixa Manual */}
                      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
                          >
                            <MapPin className="w-3.5 h-3.5 text-blue-600" />
                            <span>Abrir no Google Maps</span>
                          </a>

                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5 text-emerald-600" />
                            <span>WhatsApp</span>
                          </a>
                        </div>

                        {/* Alterar Status Rápido */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleUpdateStatus(parada.id, 'CONCLUIDO')}
                            className="px-2.5 py-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors"
                          >
                            ✓ Concluir
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(parada.id, 'PENDENTE')}
                            className="px-2 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 rounded transition-colors"
                          >
                            Pendente
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
          <p className="text-slate-500">Nenhum romaneio em andamento.</p>
        </div>
      )}

    </div>
  );
}
