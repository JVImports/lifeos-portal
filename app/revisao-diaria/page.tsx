"use client";

import { useState } from "react";
import { useLifeOS } from "@/context/lifeos-context";
import { CheckCircle2, ChevronRight, AlertTriangle, ArrowRight, Sparkles, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/toast";

export default function RevisaoDiaria() {
  const { tasks, onboardingAnswers, completeDailyReview } = useLifeOS();
  const [step, setStep] = useState(1);

  // Filter tasks that are NOT completed
  const pendingTasks = tasks.filter((t) => t.status !== "Concluído");
  
  // Track failure reasons for each pending task
  const [reasons, setReasons] = useState<Record<number, string>>({});
  
  // Tomorrow's tasks inputs
  const [tomorrow1, setTomorrow1] = useState("");
  const [tomorrow2, setTomorrow2] = useState("");
  const [tomorrow3, setTomorrow3] = useState("");

  const [reviewCompleted, setReviewCompleted] = useState(false);

  const { showToast } = useToast();

  const handleSelectReason = (taskId: number, reason: string) => {
    setReasons((prev) => ({ ...prev, [taskId]: reason }));
  };

  const handleNextStep = () => {
    if (step === 1) {
      // Validate all pending tasks have reasons selected
      const allSelected = pendingTasks.every((t) => reasons[t.id]);
      if (!allSelected && pendingTasks.length > 0) {
        showToast("Por favor, selecione um motivo para cada tarefa pendente.", "error");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    const tomorrowTasks = [tomorrow1, tomorrow2, tomorrow3].filter((t) => t.trim() !== "");
    completeDailyReview(tomorrowTasks);
    setReviewCompleted(true);
  };

  // Generate IA Aether feedback based on reasons and tone
  const getMentorFeedback = () => {
    const tone = onboardingAnswers?.tone || "Equilibrado";
    const procrastinatedCount = Object.values(reasons).filter((r) => r === "Procrastinação").length;
    
    if (pendingTasks.length === 0) {
      return "Espetacular! Você completou todas as suas metas hoje. Seu perfil de execução está operando no topo. Continue com essa consistência para amanhã!";
    }

    if (procrastinatedCount > 0) {
      if (tone === "Intenso") {
        return `Atenção. Identifiquei Procrastinação em ${procrastinatedCount} tarefa(s). Como seu mentor de tom Intenso, exijo que amanhã você execute a tarefa principal nas primeiras horas do dia sem desculpas. A inconsistência mata a evolução.`;
      }
      return `Percebi que a Procrastinação afetou algumas de suas atividades. Vamos tentar quebrar as tarefas de amanhã em blocos menores de 25 minutos (Pomodoro) para vencer essa barreira inicial. Você consegue!`;
    }

    return "Bom trabalho ao auditar o dia. Seus atrasos de hoje foram por motivos externos ou falta de tempo. Amanhã ajustaremos a carga de tarefas para manter o plano viável.";
  };

  if (reviewCompleted) {
    return (
      <main className="p-6 md:p-10 min-h-screen flex items-center justify-center">
        <div className="glass-card max-w-xl w-full rounded-3xl p-8 border border-white/5 bg-[#4d8eff]/5 flex flex-col gap-6 items-center text-center">
          <div className="w-16 h-16 rounded-3xl bg-[#4edea3]/20 flex items-center justify-center border border-[#4edea3]/30 mb-2">
            <CheckCircle2 className="text-[#4edea3] w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-on-surface text-center">Revisão Diária Concluída!</h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Seu dia foi fechado e o plano para amanhã já está injetado na sua lista de atividades. Seus hábitos foram reiniciados para o novo ciclo.
          </p>
          <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20 text-xs font-bold text-secondary">
            🚀 +80 XP Recebidos pela Auditoria Diária!
          </div>
          <Link 
            href="/"
            className="w-full py-3.5 bg-primary text-[#002e6a] font-bold rounded-xl text-center hover:opacity-90 transition-opacity"
          >
            Voltar para o Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 md:p-10 min-h-screen flex items-center justify-center">
      <div className="glass-card max-w-2xl w-full rounded-3xl p-6 md:p-8 border border-white/5 flex flex-col gap-6 bg-[#1d2027]">
        {/* Header and Step Indicators */}
        <header className="flex items-center justify-between border-b border-[#424754]/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#adc6ff]/20 flex items-center justify-center border border-[#adc6ff]/30">
              <BrainCircuit className="text-primary w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Fechamento do Dia</h2>
              <p className="text-xs opacity-60">Audite sua performance e monte o plano de amanhã</p>
            </div>
          </div>
          <span className="text-xs font-bold text-primary font-mono">Passo {step} de 3</span>
        </header>

        {/* Step 1: Auditoria de Pendências */}
        {step === 1 && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant/80 flex items-center gap-2">
              <AlertTriangle className="text-tertiary w-4 h-4" /> 
              Por que estas tarefas não foram concluídas?
            </h3>
            
            {pendingTasks.length > 0 ? (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                {pendingTasks.map((task) => (
                  <div key={task.id} className="p-4 bg-[#191b23]/50 rounded-2xl border border-[#424754]/20 space-y-3">
                    <span className="text-sm font-semibold text-on-surface">{task.title}</span>
                    <div className="flex flex-wrap gap-2">
                      {["Procrastinação", "Falta de Tempo", "Urgência Externa"].map((reason) => {
                        const isSelected = reasons[task.id] === reason;
                        return (
                          <button
                            key={reason}
                            type="button"
                            onClick={() => handleSelectReason(task.id, reason)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                              isSelected
                                ? "bg-primary/20 text-primary border-primary"
                                : "bg-transparent text-on-surface-variant border-[#424754]/30 hover:border-on-surface-variant/35"
                            }`}
                          >
                            {reason}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border border-dashed border-[#424754]/20 rounded-2xl text-sm opacity-60">
                🎉 Incrível! Nenhuma tarefa ficou pendente hoje. Pule para o próximo passo!
              </div>
            )}

            <button
              onClick={handleNextStep}
              className="w-full py-4 bg-primary text-[#002e6a] font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              Avançar
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Feedback do Mentor Aether */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#4d8eff]/5 border border-white/5 flex gap-4 items-start">
              <div className="w-12 h-12 rounded-2xl bg-[#4d8eff]/20 flex items-center justify-center border border-[#4d8eff]/30 shrink-0">
                <BrainCircuit className="text-primary w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Análise do Mentor Aether</span>
                <p className="text-sm opacity-90 leading-relaxed text-on-surface-variant">
                  {getMentorFeedback()}
                </p>
              </div>
            </div>

            <button
              onClick={handleNextStep}
              className="w-full py-4 bg-primary text-[#002e6a] font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              Definir Plano de Amanhã
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 3: Planejamento de Amanhã */}
        {step === 3 && (
          <form onSubmit={handleFinish} className="space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant/80 flex items-center gap-2">
              <Sparkles className="text-secondary w-4 h-4" /> 
              Quais são as 3 missões de amanhã?
            </h3>

            <div className="space-y-3">
              <input
                type="text"
                value={tomorrow1}
                onChange={(e) => setTomorrow1(e.target.value)}
                placeholder="Missão Prioritária 1"
                className="w-full bg-[#191b23] border border-[#424754]/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary"
                required
              />
              <input
                type="text"
                value={tomorrow2}
                onChange={(e) => setTomorrow2(e.target.value)}
                placeholder="Missão 2"
                className="w-full bg-[#191b23] border border-[#424754]/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none"
              />
              <input
                type="text"
                value={tomorrow3}
                onChange={(e) => setTomorrow3(e.target.value)}
                placeholder="Missão 3"
                className="w-full bg-[#191b23] border border-[#424754]/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#4edea3] text-[#003824] font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              Concluir Fechamento do Dia
            </button>
          </form>
        )}
      </div>
    </main>
  );
}