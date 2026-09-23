'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Truck, 
  Award, 
  Clock, 
  ArrowRight, 
  CheckCircle, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Layers, 
  FileText, 
  Sparkles,
  ChevronRight,
  Send,
  Boxes,
  Compass,
  Zap,
  Lock
} from 'lucide-react';

export default function LandingPage() {
  const [cotacaoNome, setCotacaoNome] = useState('');
  const [cotacaoEmpresa, setCotacaoEmpresa] = useState('');
  const [cotacaoTelefone, setCotacaoTelefone] = useState('');
  const [cotacaoMaterial, setCotacaoMaterial] = useState('Tubos Inox (304L / 316L)');
  const [cotacaoMensagem, setCotacaoMensagem] = useState('');

  const handleEnviarCotacao = (e: React.FormEvent) => {
    e.preventDefault();
    const texto = `*NOVA COTAÇÃO - SITE BRASFORTAL*%0A%0A*Nome:* ${cotacaoNome}%0A*Empresa:* ${cotacaoEmpresa}%0A*Telefone/WhatsApp:* ${cotacaoTelefone}%0A*Material:* ${cotacaoMaterial}%0A*Detalhes:* ${cotacaoMensagem}`;
    window.open(`https://wa.me/5511987654321?text=${texto}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* 1. NAVBAR SUPERIOR INSTITUCIONAL */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brasfortal */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-400 flex items-center justify-center font-black text-white text-xl tracking-tighter shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              BF
            </div>
            <div>
              <div className="font-black text-lg tracking-wider text-white flex items-center gap-1.5">
                BRASFORTAL
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              </div>
              <p className="text-[10px] tracking-widest uppercase font-semibold text-slate-400">
                Metais & Conexões Ltda
              </p>
            </div>
          </Link>

          {/* Links de Navegação */}
          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-wider font-bold text-slate-300">
            <a href="#produtos" className="hover:text-cyan-400 transition-colors">Produtos</a>
            <a href="#diferenciais" className="hover:text-cyan-400 transition-colors">Diferenciais</a>
            <a href="#qualidade" className="hover:text-cyan-400 transition-colors">Qualidade & Usinas</a>
            <a href="#cotacao" className="hover:text-cyan-400 transition-colors">Cotação Rápida</a>
          </nav>

          {/* Botões de Ação */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.03]"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Acessar Portal ERP</span>
            </Link>
          </div>

        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-16 pb-24 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-900/0 to-transparent pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Texto Principal */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Distribuidora e Beneficiadora de Metais Industriais</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Excelência em <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">Metais Nobres</span>, Tubulações & Conexões
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
                Soluções completas para indústrias química, alimentícia, caldeiraria e construção civil. Estoque à pronta entrega de <strong>Tubos Inox, Flanges, Vigas, Chapas e Policarbonato</strong> com rastreabilidade total e corte sob medida.
              </p>

              {/* Botões de Ação Hero */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a
                  href="#cotacao"
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/20 transition-all hover:scale-105"
                >
                  <span>Solicitar Cotação B2B</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <Link
                  href="/login"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm transition-all"
                >
                  <Lock className="w-4 h-4 text-cyan-400" />
                  <span>Área Restrita / ERP</span>
                </Link>
              </div>

              {/* Garantias rápidas */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>Laudos de Usina 100%</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>Frota Própria com Rastreio</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>Corte sob Medida</span>
                </div>
              </div>
            </div>

            {/* Destaque Visual / Card Interativo */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/80 p-6 shadow-2xl shadow-blue-950/50 space-y-6">
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <Boxes className="w-5 h-5 text-cyan-400" />
                    <span className="font-bold text-sm text-white">Catálogo Express Brasfortal</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Estoque Disponível
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Tubos Inox 304L & 316L (Schedule & OD)</div>
                      <div className="text-[11px] text-slate-400">Com e Sem Costura - NBR / ASTM</div>
                    </div>
                    <span className="font-mono text-cyan-400 font-bold">Pronta Entrega</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Conexões & Flanges Industriais</div>
                      <div className="text-[11px] text-slate-400">Curvas 90°/45°, Tees, Reduções, Flanges ANSI</div>
                    </div>
                    <span className="font-mono text-cyan-400 font-bold">150# a 3000#</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Vigas & Perfis Estruturais (I, H, U, W)</div>
                      <div className="text-[11px] text-slate-400">Gerdau / Aperam com corte e furação</div>
                    </div>
                    <span className="font-mono text-cyan-400 font-bold">Sob Medida</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Placas de Policarbonato Compacto & Cristal</div>
                      <div className="text-[11px] text-slate-400">Proteção de máquinas e coberturas (4mm a 10mm)</div>
                    </div>
                    <span className="font-mono text-cyan-400 font-bold">Proteção UV</span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="#cotacao"
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-600/30"
                  >
                    <span>Solicitar Lista de Preços e Prazos</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. NOSSOS PRODUTOS */}
      <section id="produtos" className="py-20 bg-slate-900/60 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Linha Completa de Fornecimento</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Metais e Materiais de Alta Resistência
            </h2>
            <p className="text-slate-400 text-sm">
              Trabalhamos com os mais rigorosos padrões de qualidade industrial para atender caldeirarias, indústrias farmacêuticas, alimentícias e construção pesada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl space-y-4 hover:border-cyan-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Tubos Inox & Carbono</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Tubos Schedule (10, 40, 80) e Tubos OD nos aços AISI 304/304L e 316/316L, sanitários e industriais.
              </p>
              <ul className="text-xs text-slate-300 space-y-1 font-medium">
                <li>• Com e Sem Costura</li>
                <li>• Normas ASTM A312 / A269</li>
                <li>• Acabamento Decapado / Polido</li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl space-y-4 hover:border-cyan-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Boxes className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Conexões & Flanges</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Linha completa de conexões forjadas e tubulares para solda e rosca (NPT/BSP) e flanges normatizados.
              </p>
              <ul className="text-xs text-slate-300 space-y-1 font-medium">
                <li>• Curvas 45°, 90°, 180°</li>
                <li>• Tees Retos e de Redução</li>
                <li>• Flanges Cego, SO, WN, Lap Joint</li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl space-y-4 hover:border-cyan-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Vigas & Perfis Estruturais</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Aço estrutural laminado para obras civis e industriais, com serviços de corte sob medida no comprimento exato.
              </p>
              <ul className="text-xs text-slate-300 space-y-1 font-medium">
                <li>• Vigas I, H, U e W (Padrão Gerdau)</li>
                <li>• Cantoneiras e Barras Chatas</li>
                <li>• Barras Redondas e Quadradas</li>
              </ul>
            </div>

            {/* Card 4 */}
            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl space-y-4 hover:border-cyan-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Policarbonato & Chapas</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Chapas em aço inox, carbono e policarbonato compacto para proteção de máquinas industriais e coberturas.
              </p>
              <ul className="text-xs text-slate-300 space-y-1 font-medium">
                <li>• Policarbonato Cristal 4mm a 10mm</li>
                <li>• Chapas Inox Escovadas / 2B</li>
                <li>• Alta resistência ao impacto e UV</li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* 4. DIFERENCIAIS BRASFORTAL */}
      <section id="diferenciais" className="py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Por Que Escolher a Brasfortal</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Logística Própria, Agilidade de Entrega & Rastreabilidade de Ponta a Ponta
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Sabemos que paradas de linha industrial custam caro. Por isso, a Brasfortal combina estoque estratégico, centro de corte inteligente e frota própria equipada com confirmação digital de entrega e GPS.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                  <Truck className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Frota Própria e Rápida na Grande SP e Interior</h4>
                    <p className="text-slate-400 text-xs mt-1">Caminhões dedicados com pesagem controlada e rotas otimizadas.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                  <Award className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Certificados de Qualidade de Usina</h4>
                    <p className="text-slate-400 text-xs mt-1">Gerdau, Tupy, Aperam e Inox Tubos Brasil com rastreabilidade por lote e corrida.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                  <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Faturamento Corporativo Flexível</h4>
                    <p className="text-slate-400 text-xs mt-1">Condições especiais de pagamento a prazo (28/30/60 DDL) para indústrias cadastradas.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-gradient-to-br from-blue-950/40 via-slate-800 to-slate-900 border border-slate-700 p-8 rounded-3xl space-y-6">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <span>Nossos Números em Números</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="text-3xl font-black text-cyan-400">+15</div>
                  <div className="text-xs font-bold text-slate-300 mt-1">Anos de Mercado</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Distribuição industrial contínua</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="text-3xl font-black text-blue-400">+12.000</div>
                  <div className="text-xs font-bold text-slate-300 mt-1">Entregas Realizadas</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Comprovadas com canhoto digital</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="text-3xl font-black text-indigo-400">100%</div>
                  <div className="text-xs font-bold text-slate-300 mt-1">Rastreabilidade</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Certificado de usina por corrida</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="text-3xl font-black text-emerald-400">24/48h</div>
                  <div className="text-xs font-bold text-slate-300 mt-1">Despacho Ágil</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Itens em estoque pronto</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-500/20 text-xs text-blue-300 flex items-center gap-3">
                <PhoneCall className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span>Atendimento técnico especializado para auxiliar na escolha da melhor liga metálica e especificação de espessura.</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. FORMULÁRIO DE COTAÇÃO RÁPIDA (B2B) */}
      <section id="cotacao" className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 border border-slate-800 p-8 sm:p-10 rounded-3xl shadow-2xl space-y-8">
            
            <div className="text-center space-y-3">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                Atendimento Comercial B2B
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Solicite sua Cotação Direta com a Usina & Estoque
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Preencha os dados abaixo para receber nossa proposta oficial por e-mail ou WhatsApp em até 30 minutos.
              </p>
            </div>

            <form onSubmit={handleEnviarCotacao} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Seu Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={cotacaoNome}
                    onChange={(e) => setCotacaoNome(e.target.value)}
                    placeholder="Ex: João da Silva"
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Empresa / Razão Social *</label>
                  <input
                    type="text"
                    required
                    value={cotacaoEmpresa}
                    onChange={(e) => setCotacaoEmpresa(e.target.value)}
                    placeholder="Ex: Indústria Metalúrgica ABC"
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">WhatsApp / Telefone *</label>
                  <input
                    type="tel"
                    required
                    value={cotacaoTelefone}
                    onChange={(e) => setCotacaoTelefone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Material de Interesse</label>
                  <select
                    value={cotacaoMaterial}
                    onChange={(e) => setCotacaoMaterial(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 font-medium"
                  >
                    <option value="Tubos Inox (304L / 316L)">Tubos Inox (304L / 316L)</option>
                    <option value="Conexões Tubulares & Flanges">Conexões Tubulares & Flanges</option>
                    <option value="Vigas & Perfis Estruturais (I, H, U)">Vigas & Perfis Estruturais (I, H, U)</option>
                    <option value="Placas de Policarbonato Compacto">Placas de Policarbonato Compacto</option>
                    <option value="Chapas de Aço Inox / Carbono">Chapas de Aço Inox / Carbono</option>
                    <option value="Outros / Projeto Sob Medida">Outros / Projeto Sob Medida</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Quantidades, Bitolas ou Detalhes</label>
                <textarea
                  rows={3}
                  value={cotacaoMensagem}
                  onChange={(e) => setCotacaoMensagem(e.target.value)}
                  placeholder="Ex: Preciso de 10 barras de tubo 2 polegadas sch 10 304L e 5 curvas 90..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 transition-all hover:scale-[1.01]"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Cotação para Mesa de Vendas</span>
              </button>
            </form>

          </div>
        </div>
      </section>

      {/* 6. RODAPÉ INSTITUCIONAL */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            
            {/* Coluna 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-sm">
                  BF
                </div>
                <span className="font-black text-white text-base">BRASFORTAL</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Brasfortal Metais e Conexões Ltda. Soluções de alta performance em tubos, conexões industriais, vigas e policarbonato.
              </p>
            </div>

            {/* Coluna 2 */}
            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase text-xs">Produtos</h4>
              <ul className="space-y-1 text-xs text-slate-400">
                <li>• Tubos Inox Schedule 10/40/80</li>
                <li>• Flanges ANSI 150# / 300#</li>
                <li>• Curvas e Tees Tubulares</li>
                <li>• Vigas I, H e Perfis Estruturais</li>
                <li>• Placas Policarbonato Cristal</li>
              </ul>
            </div>

            {/* Coluna 3 */}
            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase text-xs">Atendimento</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <PhoneCall className="w-4 h-4 text-cyan-400" />
                  <span>(11) 3344-5500 / WhatsApp Comercial</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span>comercial@brasfortal.com.br</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>São Paulo - SP / Atendimento Nacional</span>
                </div>
              </div>
            </div>

            {/* Coluna 4: Acesso Restrito */}
            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase text-xs">Acesso Interno</h4>
              <p className="text-slate-400 text-xs">
                Portal de Vendas, Fichas de Pedidos, Expedição de Cargas e Terminal do Motorista.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 font-bold text-xs transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Portal da Equipe (ERP)</span>
              </Link>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-400">
            <p>© {new Date().getFullYear()} Brasfortal Metais e Conexões Ltda. Todos os direitos reservados.</p>
            <div className="flex items-center gap-4">
              <span>CNPJ: 12.345.678/0001-90</span>
              <span>•</span>
              <span>São Paulo - SP</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
