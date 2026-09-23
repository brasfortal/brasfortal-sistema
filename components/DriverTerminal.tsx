'use client';

import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  Phone, 
  Camera, 
  CheckCircle, 
  MapPin, 
  Package, 
  Clock, 
  AlertCircle, 
  X, 
  Upload, 
  ShieldCheck,
  CheckCircle2,
  Share2,
  Truck
} from 'lucide-react';
import { Romaneio, ParadaRomaneio } from '@/lib/types';
import { StorageService } from '@/lib/storage';

export default function DriverTerminal() {
  const [romaneio, setRomaneio] = useState<Romaneio | null>(null);
  const [selectedParada, setSelectedParada] = useState<ParadaRomaneio | null>(null);
  const [modalBaixaAberto, setModalBaixaAberto] = useState(false);
  
  // Campos do formulário de baixa
  const [recebedorNome, setRecebedorNome] = useState('');
  const [recebedorDoc, setRecebedorDoc] = useState('');
  const [obsMotorista, setObsMotorista] = useState('');
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [mensagemSucesso, setMensagemSucesso] = useState(false);

  useEffect(() => {
    loadRomaneio();
  }, []);

  const loadRomaneio = () => {
    const roms = StorageService.getRomaneios();
    if (roms.length > 0) {
      setRomaneio(roms[0]);
    }
  };

  const handleAbrirBaixa = (parada: ParadaRomaneio) => {
    setSelectedParada(parada);
    setRecebedorNome('');
    setRecebedorDoc('');
    setObsMotorista('');
    setFotoPreview(null);
    setModalBaixaAberto(true);
  };

  const handleSimularFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmarBaixa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!romaneio || !selectedParada) return;

    if (!recebedorNome) {
      alert('Por favor, informe o nome de quem recebeu a mercadoria.');
      return;
    }

    StorageService.updateParadaStatus(romaneio.id, selectedParada.id, {
      status: 'CONCLUIDO',
      recebedor_nome: recebedorNome,
      recebedor_documento: recebedorDoc,
      observacao_motorista: obsMotorista,
      canhoto_foto_url: fotoPreview || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=80'
    });

    setModalBaixaAberto(false);
    setMensagemSucesso(true);
    setTimeout(() => setMensagemSucesso(false), 3500);
    loadRomaneio();
  };

  if (!romaneio) {
    return (
      <div className="max-w-md mx-auto p-6 text-center bg-white rounded-2xl shadow-lg border border-slate-200 mt-10">
        <Truck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="font-bold text-lg text-slate-800">Nenhum Roteiro Ativo</h3>
        <p className="text-xs text-slate-500 mt-1">Aguardando a expedição liberar novas entregas.</p>
      </div>
    );
  }

  const paradasConcluidas = romaneio.paradas.filter(p => p.status === 'CONCLUIDO').length;
  const totalParadas = romaneio.paradas.length;
  const progressoPercent = Math.round((paradasConcluidas / totalParadas) * 100);

  return (
    <div className="max-w-lg mx-auto pb-20 font-sans">
      
      {/* ALERTA DE SUCESSO */}
      {mensagemSucesso && (
        <div className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto bg-emerald-600 text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-6 h-6 shrink-0" />
          <div>
            <h4 className="font-black text-sm">Entrega Baixada com Sucesso!</h4>
            <p className="text-xs text-emerald-100">Expedição e comercial já foram notificados em tempo real.</p>
          </div>
        </div>
      )}

      {/* CABEÇALHO DO TERMINAL MOBILE */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-black text-sm shadow">
              BF
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-wide">TERMINAL DO MOTORISTA</h1>
              <p className="text-[10px] text-slate-400 uppercase">Brasfortal Logística</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800 text-emerald-400 font-bold border border-slate-700">
            ● GPS ONLINE
          </span>
        </div>

        {/* Card do Motorista & Veículo */}
        <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{romaneio.motorista_nome}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {romaneio.veiculo_modelo} • <strong className="text-slate-200">{romaneio.veiculo_placa}</strong>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Romaneio</span>
            <span className="text-base font-black text-blue-400">#{romaneio.numero_romaneio}</span>
          </div>
        </div>

        {/* Barra de Progresso do Roteiro */}
        <div>
          <div className="flex justify-between text-xs font-bold mb-1 text-slate-300">
            <span>Progresso do Dia:</span>
            <span>{paradasConcluidas} de {totalParadas} paradas ({progressoPercent}%)</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${progressoPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* LISTAGEM DE PARADAS DO ROTEIRO (TOUCH-FRIENDLY) */}
      <div className="mt-4 space-y-3">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 px-1">
          Roteiro de Paradas ({romaneio.paradas.length})
        </h2>

        {romaneio.paradas.map((parada, idx) => {
          const isConcluido = parada.status === 'CONCLUIDO';
          const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(parada.endereco)}`;
          const wazeUrl = `https://waze.com/ul?q=${encodeURIComponent(parada.endereco)}`;
          const telefoneClean = parada.telefone.replace(/\D/g, '');
          const whatsappUrl = `https://wa.me/55${telefoneClean}?text=Olá!%20Sou%20o%20motorista%20da%20Brasfortal.%20Estou%20a%20caminho%20com%20sua%20entrega.`;
          const telUrl = `tel:${telefoneClean}`;

          return (
            <div
              key={parada.id}
              className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${
                isConcluido
                  ? 'border-emerald-200 bg-emerald-50/20 opacity-80'
                  : 'border-slate-200 shadow-md'
              }`}
            >
              {/* Header da Parada */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm text-white shrink-0 ${
                    isConcluido 
                      ? 'bg-emerald-600' 
                      : (parada.tipo === 'COLETA' ? 'bg-amber-600' : 'bg-blue-600')
                  }`}>
                    {isConcluido ? '✓' : idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                        parada.tipo === 'COLETA' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {parada.tipo}
                      </span>
                      <h3 className="font-black text-slate-900 text-sm leading-tight">
                        {parada.destinatario_nome}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {parada.comprador_contato ? `Contato: ${parada.comprador_contato}` : ''}
                    </p>
                  </div>
                </div>

                {isConcluido ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Entregue
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    Pendente
                  </span>
                )}
              </div>

              {/* Endereço com Botão de GPS */}
              <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-start gap-2 text-xs text-slate-800 font-medium">
                  <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{parada.endereco}</span>
                </div>

                {/* Botões Grandes de GPS (Maps & Waze) */}
                {!isConcluido && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-sm transition-all text-center"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Google Maps</span>
                    </a>

                    <a
                      href={wazeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-black shadow-sm transition-all text-center"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Abrir Waze</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Detalhes da Carga & Comunicação */}
              <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900">
                    ⚖️ {parada.peso_kg.toFixed(2)} KG • {parada.volumes || '1 Vol'}
                  </div>
                  {parada.nfs_vinculadas && (
                    <div className="text-[11px] text-slate-500 font-medium">
                      {parada.nfs_vinculadas}
                    </div>
                  )}
                </div>

                {/* Botões de Contato */}
                <div className="flex items-center gap-1.5">
                  <a
                    href={telUrl}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1"
                    title="Ligar"
                  >
                    <Phone className="w-4 h-4 text-blue-600" />
                  </a>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-xs flex items-center gap-1"
                    title="WhatsApp"
                  >
                    <span className="text-xs">💬</span>
                  </a>
                </div>
              </div>

              {/* BOTÃO DE CONFIRMAR ENTREGA / BAIXA */}
              <div className="mt-3.5 pt-3 border-t border-slate-100">
                {isConcluido ? (
                  <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 p-2 rounded-lg font-semibold">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Recebido por: {parada.recebedor_nome || 'Portaria/Cliente'}
                    </span>
                    <span className="text-[10px] text-emerald-700">Concluído</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAbrirBaixa(parada)}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-extrabold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Confirmar {parada.tipo === 'COLETA' ? 'Coleta' : 'Entrega'} & Foto do Canhoto</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* MODAL DE BAIXA COM FOTO DO CANHOTO */}
      {modalBaixaAberto && selectedParada && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-3">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-5">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-base text-slate-900">
                  Baixar {selectedParada.tipo === 'COLETA' ? 'Coleta' : 'Entrega'}
                </h3>
                <p className="text-xs text-slate-500">{selectedParada.destinatario_nome}</p>
              </div>
              <button
                onClick={() => setModalBaixaAberto(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmarBaixa} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Nome do Recebedor / Responsável *
                </label>
                <input
                  type="text"
                  required
                  value={recebedorNome}
                  onChange={(e) => setRecebedorNome(e.target.value)}
                  placeholder="Ex: Carlos Almoxarifado ou Vitoria"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 uppercase font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Documento (RG / CPF)
                </label>
                <input
                  type="text"
                  value={recebedorDoc}
                  onChange={(e) => setRecebedorDoc(e.target.value)}
                  placeholder="Ex: 12.345.678-9"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 font-semibold"
                />
              </div>

              {/* Upload / Foto do Canhoto */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Foto do Canhoto Assinado da NF / Comprovante
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-blue-500 transition-colors bg-slate-50">
                  {fotoPreview ? (
                    <div className="space-y-2">
                      <img 
                        src={fotoPreview} 
                        alt="Prévia do canhoto" 
                        className="max-h-40 mx-auto rounded-lg shadow border"
                      />
                      <button
                        type="button"
                        onClick={() => setFotoPreview(null)}
                        className="text-xs font-bold text-rose-600 hover:underline"
                      >
                        Trocar Foto
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Camera className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
                      <p className="text-xs font-bold text-slate-700">Tirar foto do canhoto assinado</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Use a câmera do celular</p>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleSimularFoto}
                        className="mt-2 text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Observação do Motorista (Opcional)
                </label>
                <input
                  type="text"
                  value={obsMotorista}
                  onChange={(e) => setObsMotorista(e.target.value)}
                  placeholder="Ex: Entregue na doca 2 com empilhadeira"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setModalBaixaAberto(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20"
                >
                  Confirmar Baixa
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
