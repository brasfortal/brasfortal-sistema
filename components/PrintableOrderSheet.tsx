'use client';

import React from 'react';
import { Pedido } from '@/lib/types';
import { Printer, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Props {
  pedido: Pedido;
  showActions?: boolean;
}

export default function PrintableOrderSheet({ pedido, showActions = true }: Props) {
  const handlePrint = () => {
    window.print();
  };

  // Formatar data no padrão DD.MM.YY
  const formatDateBR = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    return `${day}.${month}.${year}`;
  };

  // Criar 11 linhas fixas conforme o espelho físico da Brasfortal
  const tableRows = Array.from({ length: 11 }, (_, i) => {
    const item = pedido.itens.find(it => it.item_numero === i + 1) || pedido.itens[i];
    return {
      index: i + 1,
      item: item || null
    };
  });

  // Criar 7 colunas fixas de NF conforme a ficha
  const nfColumns = Array.from({ length: 7 }, (_, i) => {
    return pedido.nfs[i] || null;
  });

  return (
    <div className="space-y-4">
      {/* Botões de Ação na Tela (Não são impressos) */}
      {showActions && (
        <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar aos Pedidos</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold uppercase bg-blue-100 text-blue-800 border border-blue-200">
              Status: {pedido.status.replace('_', ' ')}
            </span>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Espelho Oficial (A4)</span>
            </button>
          </div>
        </div>
      )}

      {/* DOCUMENTO OFICIAL BRASFORTAL (Padrão Impressão / Ficha Física) */}
      <div className="print-sheet bg-white text-black p-6 sm:p-8 rounded-lg border-2 border-slate-800 shadow-md max-w-4xl mx-auto font-sans text-xs">
        
        {/* CABEÇALHO */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3 mb-2">
          <div>
            <h1 className="text-2xl font-black tracking-wider text-slate-900 leading-tight">
              BRAS<span className="text-blue-700">FORTAL</span>
            </h1>
            <p className="text-[11px] font-bold text-slate-800 tracking-wider uppercase">
              METAIS E CONEXÕES LTDA
            </p>
          </div>

          <div className="text-right">
            <div className="inline-flex items-center gap-1 border-b border-black pb-0.5 px-2 font-bold text-sm">
              <span className="text-slate-700 font-semibold text-xs">Data:</span>
              <span>{formatDateBR(pedido.data_emissao)}</span>
            </div>
            <div className="text-[10px] text-slate-600 mt-1">
              Ficha de Pedido Nº <strong>{pedido.numero_pedido}</strong>
            </div>
          </div>
        </div>

        {/* GRADE DE CAMPOS DO CLIENTE (Linhas com bordas) */}
        <div className="border-t border-b border-l border-r border-slate-800 divide-y divide-slate-800 text-[11px]">
          
          {/* Linha 1: Nome, Comprador, Telefone */}
          <div className="flex divide-x divide-slate-800">
            <div className="flex-1 p-1.5 flex items-center">
              <span className="font-bold text-slate-800 mr-2 uppercase text-[10px]">Nome:</span>
              <span className="font-semibold uppercase">{pedido.cliente_nome}</span>
            </div>
            <div className="w-1/4 p-1.5 flex items-center">
              <span className="font-bold text-slate-800 mr-2 uppercase text-[10px]">Comprador:</span>
              <span className="font-semibold uppercase">{pedido.comprador || '-'}</span>
            </div>
            <div className="w-1/4 p-1.5 flex items-center">
              <span className="font-bold text-slate-800 mr-2 uppercase text-[10px]">Telefone:</span>
              <span className="font-semibold">{pedido.telefone || '-'}</span>
            </div>
          </div>

          {/* Linha 2: Endereço */}
          <div className="p-1.5 flex items-center">
            <span className="font-bold text-slate-800 mr-2 uppercase text-[10px]">Endereço:</span>
            <span className="font-semibold">{pedido.endereco || '-'}</span>
          </div>

          {/* Linha 3: CNPJ, Inscr. Estadual, Condições */}
          <div className="flex divide-x divide-slate-800">
            <div className="w-1/3 p-1.5 flex items-center">
              <span className="font-bold text-slate-800 mr-2 uppercase text-[10px]">CNPJ:</span>
              <span className="font-semibold">{pedido.cliente_cnpj || '-'}</span>
            </div>
            <div className="w-1/3 p-1.5 flex items-center">
              <span className="font-bold text-slate-800 mr-2 uppercase text-[10px]">Inscr. Estadual:</span>
              <span className="font-semibold">{pedido.cliente_ie || '-'}</span>
            </div>
            <div className="w-1/3 p-1.5 flex items-center bg-slate-50">
              <span className="font-bold text-slate-800 mr-2 uppercase text-[10px]">Condições:</span>
              <span className="font-bold uppercase text-blue-900">{pedido.condicoes_pagamento || '30 DDL'}</span>
            </div>
          </div>

          {/* Linha 4: Local para Entrega, Transportadora */}
          <div className="flex divide-x divide-slate-800">
            <div className="w-2/3 p-1.5 flex items-center">
              <span className="font-bold text-slate-800 mr-2 uppercase text-[10px]">Local para Entrega:</span>
              <span className="font-semibold">{pedido.local_entrega || '-'}</span>
            </div>
            <div className="w-1/3 p-1.5 flex items-center">
              <span className="font-bold text-slate-800 mr-2 uppercase text-[10px]">Transportadora:</span>
              <span className="font-semibold uppercase">{pedido.transportadora || '-'}</span>
            </div>
          </div>

          {/* Linha 5: Local para Cobrança, Pedido Cliente n. */}
          <div className="flex divide-x divide-slate-800">
            <div className="w-2/3 p-1.5 flex items-center">
              <span className="font-bold text-slate-800 mr-2 uppercase text-[10px]">Local para Cobrança:</span>
              <span className="font-semibold">{pedido.local_cobranca || '-'}</span>
            </div>
            <div className="w-1/3 p-1.5 flex items-center bg-slate-50">
              <span className="font-bold text-slate-800 mr-2 uppercase text-[10px]">Pedido Cliente n.:</span>
              <span className="font-bold text-slate-900">{pedido.pedido_cliente_n || '-'}</span>
            </div>
          </div>

        </div>

        {/* TABELA DE 11 ITENS DO PEDIDO */}
        <div className="mt-2 border border-slate-900">
          <table className="w-full text-left border-collapse text-[10px]">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-900 font-bold uppercase text-center">
                <th className="border-r border-slate-900 p-1 w-7">#</th>
                <th className="border-r border-slate-900 p-1 w-10">UNID</th>
                <th className="border-r border-slate-900 p-1 w-12">QUANT</th>
                <th className="border-r border-slate-900 p-1 w-10">UNID</th>
                <th className="border-r border-slate-900 p-1 w-12">QUANT</th>
                <th className="border-r border-slate-900 p-1 w-14">PESO</th>
                <th className="border-r border-slate-900 p-1 w-14">CÓD</th>
                <th className="border-r border-slate-900 p-1 text-left px-2">DESCRIÇÃO DOS PRODUTOS</th>
                <th className="p-1 w-20 text-right pr-2">VALOR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-400">
              {tableRows.map(({ index, item }) => (
                <tr key={index} className="h-6 leading-tight">
                  <td className="border-r border-slate-900 text-center font-bold text-slate-700 bg-slate-50/50">
                    {index}
                  </td>
                  <td className="border-r border-slate-900 text-center uppercase font-medium">
                    {item ? item.unid_1 : ''}
                  </td>
                  <td className="border-r border-slate-900 text-center font-medium">
                    {item ? item.quant_1.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : ''}
                  </td>
                  <td className="border-r border-slate-900 text-center uppercase font-medium">
                    {item?.unid_2 || ''}
                  </td>
                  <td className="border-r border-slate-900 text-center font-medium">
                    {item?.quant_2 ? item.quant_2.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : ''}
                  </td>
                  <td className="border-r border-slate-900 text-center font-medium">
                    {item?.peso ? item.peso.toFixed(2) : ''}
                  </td>
                  <td className="border-r border-slate-900 text-center font-semibold">
                    {item?.codigo || ''}
                  </td>
                  <td className="border-r border-slate-900 px-2 font-medium uppercase text-[10px]">
                    {item?.descricao || ''}
                  </td>
                  <td className="text-right pr-2 font-semibold">
                    {item ? item.valor_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : ''}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-900 bg-slate-50 font-bold">
                <td colSpan={5} className="border-r border-slate-900 p-1.5 text-right uppercase text-[10px]">
                  Totais:
                </td>
                <td className="border-r border-slate-900 p-1 text-center text-blue-950 font-bold">
                  {pedido.peso_total ? `${pedido.peso_total.toFixed(2)} KG` : '-'}
                </td>
                <td colSpan={2} className="border-r border-slate-900 p-1.5 text-right uppercase text-[10px]">
                  Valor Total do Pedido:
                </td>
                <td className="p-1.5 text-right pr-2 text-blue-900 text-xs font-black">
                  {pedido.valor_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* BLOCO DE NOTAS FISCAIS (NF 1 a 7) */}
        <div className="mt-2 border border-slate-900 text-[9px]">
          <div className="grid grid-cols-7 divide-x divide-slate-900">
            {nfColumns.map((nf, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="bg-slate-100 font-bold p-0.5 border-b border-slate-900 flex justify-between px-1">
                  <span>NF</span>
                  <span className="font-semibold text-slate-800">{nf?.numero_nf || ''}</span>
                </div>
                <div className="p-0.5 border-b border-slate-900 flex justify-between px-1">
                  <span className="text-slate-600">ICMS %</span>
                  <span className="font-semibold">{nf?.icms_percent ? `${nf.icms_percent}%` : ''}</span>
                </div>
                <div className="grid grid-cols-2 divide-x divide-slate-900 p-0.5 min-h-[22px]">
                  <div className="px-0.5">
                    <span className="text-slate-500 block text-[7px] leading-tight">PESO TOT</span>
                    <span className="font-semibold">{nf?.peso_total ? `${nf.peso_total}kg` : ''}</span>
                  </div>
                  <div className="px-0.5">
                    <span className="text-slate-500 block text-[7px] leading-tight">ESPÉCIE</span>
                    <span className="font-medium text-[8px] truncate block">{nf?.especie || ''}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BLOCO INFERIOR: VENDEDOR, COMISSÃO E APURAÇÃO (Linhas 1 a 11) */}
        <div className="mt-2 border border-slate-900 text-[10px] grid grid-cols-3 divide-x divide-slate-900">
          
          {/* Coluna 1 (1 a 4 com Vendedor / Comissão) */}
          <div className="p-1.5 space-y-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span className="font-bold">1</span>
                <span className="font-bold uppercase text-blue-900">{pedido.vendedor_nome || 'LUCC BISPO'}</span>
              </div>
              <div className="font-bold text-slate-900">
                {pedido.valor_comissao ? pedido.valor_comissao.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '307,18'}
              </div>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <span className="font-bold text-black">2</span>
              <span className="border-b border-dotted border-slate-400 flex-1 h-3"></span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">EST</span>
              <span className="text-slate-500 text-[9px] uppercase">SP - ICMS 18%</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <span className="font-bold text-black">4</span>
              <span className="border-b border-dotted border-slate-400 flex-1 h-3"></span>
            </div>
          </div>

          {/* Coluna 2 (5 a 8) */}
          <div className="p-1.5 space-y-1">
            {[5, 6, 7, 8].map(num => (
              <div key={num} className="flex items-center gap-1 text-slate-400">
                <span className="font-bold text-black">{num}</span>
                <span className="border-b border-dotted border-slate-400 flex-1 h-3"></span>
              </div>
            ))}
          </div>

          {/* Coluna 3 (9 a 11 + Assinatura/Conferência) */}
          <div className="p-1.5 space-y-1 flex flex-col justify-between">
            <div>
              {[9, 10, 11].map(num => (
                <div key={num} className="flex items-center gap-1 text-slate-400">
                  <span className="font-bold text-black">{num}</span>
                  <span className="border-b border-dotted border-slate-400 flex-1 h-3"></span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-400 pt-1 text-[8px] text-center text-slate-600">
              Assinatura / Conferência Expedição
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
