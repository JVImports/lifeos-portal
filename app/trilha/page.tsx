"use client";

import { useLifeOS } from "@/context/lifeos-context";
import { Trophy, Lock, Unlock, Compass, Star } from "lucide-react";

interface Milestone {
  id: number;
  levelRequired: number;
  title: string;
  desc: string;
  badge: string;
  xpReward: number;
}

export default function TrilhaEvolucao() {
  const { level } = useLifeOS();

  const milestones: Milestone[] = [
    { id: 1, levelRequired: 1, title: "Recruta da Rotina", desc: "Completou seu Onboarding inicial e se conectou ao Aether.", badge: "🌱", xpReward: 100 },
    { id: 2, levelRequired: 2, title: "Orçamentista Disciplinado", desc: "Manteve o saldo positivo e organizou as contas do mês.", badge: "💰", xpReward: 200 },
    { id: 3, levelRequired: 3, title: "Guerreiro do Hábito", desc: "Bateu streaks sólidas de consistência no painel diário.", badge: "🔥", xpReward: 300 },
    { id: 4, levelRequired: 4, title: "Mestre do Foco Profundo", desc: "Concluiu com sucesso um ciclo de Protocolo Foco Profundo.", badge: "⚡", xpReward: 400 },
    { id: 5, levelRequired: 5, title: "Comandante Supremo", desc: "Controle absoluto sobre hábitos, finanças, metas e tarefas.", badge: "👑", xpReward: 500 },
  ];

  return (
    <main className="p-6 md:p-10 min-h-screen">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-on-surface flex items-center gap-3">
          <Compass className="text-[#8b5cf6] w-8 h-8" />
          Mapa da Trilha
        </h1>
        <p className="text-sm opacity-60 mt-1">Veja sua jornada de evolução pessoal e desbloqueie marcos do seu nível atual</p>
      </header>

      {/* Current Level Status banner */}
      <div className="glass-card rounded-3xl p-6 mb-10 border border-white/5 bg-[#8b5cf6]/5 flex flex-col md:flex-row gap-6 items-center">
        <div className="w-14 h-14 rounded-2xl bg-[#8b5cf6]/20 flex items-center justify-center border border-[#8b5cf6]/30">
          <Trophy className="text-[#8b5cf6] w-7 h-7" />
        </div>
        <div className="space-y-1 text-center md:text-left flex-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b5cf6]">Sua Evolução</span>
          <h3 className="text-xl font-bold text-on-surface">Você está na posição: Explorador Nível {level}</h3>
          <p className="text-xs opacity-75 text-on-surface-variant leading-relaxed">
            Continue concluindo missões diárias para desbloquear novos nós da trilha de evolução do LifeOS.
          </p>
        </div>
      </div>

      {/* Visual Journey Roadmap (Timeline) */}
      <div className="relative max-w-4xl mx-auto pl-8 border-l border-[#424754]/20 space-y-10 py-4">
        {milestones.map((ms) => {
          const isUnlocked = level >= ms.levelRequired;
          
          return (
            <div key={ms.id} className="relative group">
              {/* Connector line node indicator */}
              <div className={`absolute -left-[45px] top-1.5 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-500 z-10 ${
                isUnlocked 
                  ? "bg-[#10131a] border-[#8b5cf6] shadow-[0_0_10px_rgba(139,92,246,0.3)] text-[#8b5cf6]" 
                  : "bg-surface-container border-[#424754]/40 text-[#c2c6d6]/40"
              }`}>
                {isUnlocked ? (
                  <Unlock className="w-3.5 h-3.5" />
                ) : (
                  <Lock className="w-3.5 h-3.5" />
                )}
              </div>

              {/* Card representation of milestone */}
              <div className={`glass-card rounded-2xl p-6 border transition-all duration-300 ${
                isUnlocked 
                  ? "border-[#8b5cf6]/25 bg-[#8b5cf6]/5 hover:border-[#8b5cf6]/40 hover:translate-x-1" 
                  : "border-white/5 opacity-50 bg-[#1d2027]/10"
              }`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex gap-4 items-center">
                    <span className="text-3xl shrink-0">{ms.badge}</span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-on-surface text-base">{ms.title}</h3>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          isUnlocked 
                            ? "bg-secondary/15 text-secondary" 
                            : "bg-[#32353c]/40 text-on-surface-variant"
                        }`}>
                          Requisito: Nível {ms.levelRequired}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant opacity-80 leading-relaxed max-w-xl">
                        {ms.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-auto md:ml-0">
                    <Star className={`w-4 h-4 ${isUnlocked ? "text-[#8b5cf6]" : "text-[#8b5cf6]/20"}`} />
                    <span className="text-xs font-mono font-bold opacity-80">+{ms.xpReward} XP</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
