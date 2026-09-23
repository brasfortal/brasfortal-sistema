'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Pedido } from '@/lib/types';
import { StorageService } from '@/lib/storage';
import PrintableOrderSheet from '@/components/PrintableOrderSheet';
import { ArrowLeft, Edit3, Truck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function PedidoDetalhePage() {
  const params = useParams();
  const router = useRouter();
  const [pedido, setPedido] = useState<Pedido | null>(null);

  useEffect(() => {
    if (params.id) {
      const p = StorageService.getPedidoById(params.id as string);
      if (p) {
        setPedido(p);
      }
    }
  }, [params.id]);

  if (!pedido) {
    return (
      <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 max-w-lg mx-auto mt-10">
        <h3 className="font-bold text-lg text-slate-800">Pedido não encontrado</h3>
        <p className="text-xs text-slate-500 mt-1">O pedido pode ter sido removido ou o código está incorreto.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Painel</span>
        </Link>
      </div>
    );
  }

  const handleUpdateStatus = (novoStatus: any) => {
    const updated = { ...pedido, status: novoStatus };
    StorageService.savePedido(updated);
    setPedido(updated);
  };

  return (
    <div className="space-y-6">
      
      {/* Barra de Status e Envio para Expedição */}
      <div className="no-print bg-slate-900 text-white p-4 rounded-xl shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-bold uppercase">Status Atual:</span>
          <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-600 text-white uppercase">
            {pedido.status.replace('_', ' ')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Alterar Fluxo:</span>
          <button
            onClick={() => handleUpdateStatus('APROVADO')}
            className="px-2.5 py-1 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded"
          >
            Aprovar
          </button>
          <button
            onClick={() => handleUpdateStatus('EXPEDICAO')}
            className="px-2.5 py-1 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white rounded"
          >
            Mandar p/ Expedição
          </button>
          <button
            onClick={() => handleUpdateStatus('EM_ROTA')}
            className="px-2.5 py-1 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Em Rota
          </button>
          <button
            onClick={() => handleUpdateStatus('ENTREGUE')}
            className="px-2.5 py-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded"
          >
            Entregue
          </button>
        </div>
      </div>

      {/* Folha Oficial de Impressão */}
      <PrintableOrderSheet pedido={pedido} />

    </div>
  );
}
