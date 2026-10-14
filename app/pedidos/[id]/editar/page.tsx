'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Pedido } from '@/lib/types';
import { StorageService } from '@/lib/storage';
import OrderForm from '@/components/OrderForm';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EditarPedidoPage() {
  const params = useParams();
  const router = useRouter();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      const p = StorageService.getPedidoById(params.id as string);
      if (p) {
        setPedido(p);
      }
      setLoading(false);
    }
  }, [params?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-slate-500 font-medium text-xs">
          <Loader2 className="w-4 h-4 animate-spin text-[#10b981]" />
          <span>Carregando dados do pedido...</span>
        </div>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="bg-white p-12 text-center rounded-3xl border border-slate-200/80 max-w-lg mx-auto mt-10 shadow-2xs">
        <h3 className="font-bold text-lg text-slate-800">Pedido não encontrado</h3>
        <p className="text-xs text-slate-400 mt-1">O pedido pode ter sido excluído ou o identificador está incorreto.</p>
        <Link
          href="/pedidos"
          className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-[#10b981] text-white rounded-2xl text-xs font-semibold hover:bg-[#059669] transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Lista de Pedidos</span>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <OrderForm initialPedido={pedido} />
    </div>
  );
}
