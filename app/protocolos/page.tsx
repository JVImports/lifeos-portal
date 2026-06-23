"use client";

import { useLifeOS } from "@/context/lifeos-context";
import { Compass, CheckCircle2, Play, AlertCircle, Info, Calendar } from "lucide-react";
import PageHeader from "@/components/ui/page-header";
import { useToast } from "@/components/ui/toast";

export default function Protocolos() {
  const { activeProtocol, activateProtocol, deactivateProtocol } = useLifeOS();
  const { showToast } = useToast();

  const protocolsList = [
    {
      id: "foco",
      name: "Protocolo Foco Profundo",
      duration: "7 dias",
      desc: "Desenvolva hiperfoco na conclusão de metas urgentes. Bloqueia distrações e injeta rotinas de sprint.",
      color: "border-[#8b5cf6]/20 bg-[#8b5cf6]/5 text-[#8b5cf6]",
      btnBg: "bg-[#8b5cf6] text-white",
      tasks: ["Definir objetivos da Sprint", "Reunião de alinhamento individual"],
      habits: ["Bloquear distrações (1h)"]
    },
    {
      id: "manha",
      name: "Protocolo Rotina Matinal",
      duration: "10 dias",
      desc: "Comece seu dia com energia máxima e clareza mental. Estabelece rotinas de autocuidado nas primeiras horas.",
      color: "border-[#4edea3]/20 bg-[#4edea3]/5 text-[#4edea3]",
      btnBg: "bg-[#4edea3] text-[#003824]",
      tasks: [],
      habits: ["Beber 500ml de água", "Alongamento matinal"]
    },
    {
      id: "financeiro",
      name: "Protocolo Organização Financeira",
      duration: "30 dias",
      desc: "Organize de vez suas finanças pessoais. Zera despesas supérfluas e cobra auditorias diárias de orçamento.",
      color: "border-[#ffb95f]/20 bg-[#ffb95f]/5 text-[#ffb95f]",
      btnBg: "bg-[#ffb95f] text-[#472a00]",
      tasks: ["Anotar gastos da semana no LifeOS"],
      habits: ["Zero gastos supérfluos"]
    }
  ];

  const handleActivate = (id: string) => {
    activateProtocol(id);
    showToast("Protocolo ativado com sucesso! 🎯", "success");
  };

  const handleDeactivate = () => {
    deactivateProtocol();
    showToast("Protocolo encerrado.", "info");
  };

  return (
    <main className="p-6 md:p-10 min-h-screen">
      <PageHeader
        title="Protocolos de Evolução"
        description="Ative trilhas e rotinas de múltiplos dias geradas e monitoradas pela IA"
      />

      {activeProtocol && (
        <div className="glass-card p-5 rounded-2xl mb-8 border border-[#4edea3]/20 bg-[#4edea3]/5 flex items-center gap-4 animate-fade-in">
          <div className="w-10 h-10 rounded-xl bg-[#4edea3]/20 flex items-center justify-center border border-[#4edea3]/30 shrink-0">
            <CheckCircle2 className="text-[#4edea3] w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-on-surface">Protocolo Ativo Atualmente</h3>
            <p className="text-xs text-on-surface-variant opacity-80 mt-0.5">
              Seu painel &quot;Hoje&quot; recebeu hábitos e tarefas específicas criadas para esta trilha.
            </p>
          </div>
          <button 
            onClick={handleDeactivate}
            className="px-4 py-2 bg-error/10 hover:bg-error/20 text-error text-xs font-bold rounded-xl border border-error/20 transition-all"
          >
            Finalizar Protocolo
          </button>
        </div>
      )}

      {/* Protocols Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {protocolsList.map((p) => {
          const isCurrent = activeProtocol === p.id;
          return (
            <div 
              key={p.id}
              className={`glass-card rounded-3xl p-6 border flex flex-col gap-5 transition-all duration-300 ${
                isCurrent ? "border-primary bg-primary/5 shadow-lg shadow-primary/5 scale-[1.01]" : "border-white/5"
              }`}
            >
              <div className="flex justify-between items-start">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${p.color}`}>
                  {p.duration}
                </span>
                {isCurrent && (
                  <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-primary/20 text-primary uppercase font-extrabold tracking-wider">
                    Em Progresso
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-on-surface">{p.name}</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed opacity-80">{p.desc}</p>
              </div>

              {/* Injected Content Details */}
              <div className="p-4 rounded-xl bg-[#0b0e15]/40 border border-[#424754]/15 space-y-3">
                <span className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant opacity-50 flex items-center gap-1">
                  <Info className="w-3 h-3" /> Conteúdo Injetado
                </span>
                <div className="text-xs space-y-1">
                  {p.habits.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-on-surface-variant">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                      <span>Hábito: {h}</span>
                    </div>
                  ))}
                  {p.tasks.map((t, i) => (
                    <div key={i} className="flex items-center gap-2 text-on-surface-variant">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      <span>Tarefa: {t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                disabled={!!activeProtocol && !isCurrent}
                onClick={() => isCurrent ? handleDeactivate() : handleActivate(p.id)}
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all mt-auto flex items-center justify-center gap-2 ${
                  isCurrent 
                    ? "bg-error/15 text-error border border-error/20 hover:bg-error/25"
                    : p.btnBg + " hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none"
                }`}
              >
                {isCurrent ? "Desativar" : "Iniciar Protocolo"}
              </button>
            </div>
          );
        })}
      </div>
    </main>
  );
}