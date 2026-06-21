"use client";

import { useState } from "react";
import { useLifeOS } from "@/context/lifeos-context";
import { BrainCircuit, Play, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function Onboarding() {
  const { onboardingAnswers, completeOnboarding } = useLifeOS();

  const [name, setName] = useState("");
  const [focus, setFocus] = useState("Produtividade");
  const [goal, setGoal] = useState("");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [sleepTime, setSleepTime] = useState("23:00");
  const [discipline, setDiscipline] = useState("Média");
  const [tone, setTone] = useState("Equilibrado");

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    completeOnboarding({
      name,
      focus,
      goal,
      wakeTime,
      sleepTime,
      discipline,
      tone,
    });
    setSubmitted(true);
  };

  return (
    <main className="p-6 md:p-10 min-h-screen flex items-center justify-center">
      {onboardingAnswers || submitted ? (
        <div className="glass-card max-w-2xl w-full rounded-3xl p-8 border border-white/5 bg-[#4d8eff]/5 flex flex-col gap-6 items-center text-center">
          <div className="w-16 h-16 rounded-3xl bg-[#4d8eff]/20 flex items-center justify-center border border-[#4d8eff]/30 mb-2">
            <BrainCircuit className="text-primary w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-on-surface">Diagnóstico de Execução Gerado!</h2>
          
          <div className="p-5 rounded-2xl bg-[#0b0e15]/60 border border-[#424754]/25 text-left w-full space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4edea3]">
              <CheckCircle2 className="w-4 h-4 text-[#4edea3]" />
              Perfil Técnico Calculado
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {onboardingAnswers?.diagnostic || "Parabéns! Sua rotina foi recalibrada."}
            </p>
            <div className="border-t border-[#424754]/20 pt-4 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="opacity-50">Área de Foco:</span>
                <p className="font-bold text-on-surface mt-0.5">{onboardingAnswers?.focus}</p>
              </div>
              <div>
                <span className="opacity-50">Tom do Mentor:</span>
                <p className="font-bold text-on-surface mt-0.5">{onboardingAnswers?.tone}</p>
              </div>
              <div>
                <span className="opacity-50">Horário Ativo:</span>
                <p className="font-bold text-on-surface mt-0.5">{onboardingAnswers?.wakeTime} às {onboardingAnswers?.sleepTime}</p>
              </div>
              <div>
                <span className="opacity-50">XP Inicial Recebido:</span>
                <p className="font-bold text-[#4edea3] mt-0.5">+100 XP</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 w-full">
            <Link 
              href="/"
              className="flex-1 py-3.5 bg-primary text-[#002e6a] font-bold rounded-xl text-center hover:opacity-90 transition-opacity"
            >
              Ir para o Dashboard
            </Link>
            <Link 
              href="/mentor"
              className="flex-1 py-3.5 bg-[#32353c] text-on-surface font-bold rounded-xl text-center hover:opacity-90 transition-opacity"
            >
              Falar com o Mentor
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-card max-w-xl w-full rounded-3xl p-6 md:p-8 border border-white/5 flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b border-[#424754]/20 pb-4">
            <div className="w-10 h-10 rounded-lg bg-[#4d8eff]/20 flex items-center justify-center border border-[#4d8eff]/30">
              <BrainCircuit className="text-primary w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Onboarding & Calibração de IA</h2>
              <p className="text-xs opacity-60">O mentor Aether precisa entender sua rotina</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold opacity-70">Qual o seu nome?</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: João"
                className="w-full bg-[#191b23] border border-[#424754]/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold opacity-70">Área de Foco Principal</label>
                <select 
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                  className="w-full bg-[#191b23] border border-[#424754]/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none"
                >
                  <option value="Produtividade">Produtividade</option>
                  <option value="Finanças Pessoais">Finanças Pessoais</option>
                  <option value="Saúde & Bem-Estar">Saúde & Bem-Estar</option>
                  <option value="Estudos & Carreira">Estudos & Carreira</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold opacity-70">Nível de Disciplina</label>
                <select 
                  value={discipline}
                  onChange={(e) => setDiscipline(e.target.value)}
                  className="w-full bg-[#191b23] border border-[#424754]/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none"
                >
                  <option value="Alta">Alta (Executo sem problemas)</option>
                  <option value="Média">Média (Executo a maioria das coisas)</option>
                  <option value="Baixa">Baixa (Preciso de cobrança constante)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold opacity-70">Horário de Acordar</label>
                <input 
                  type="time" 
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full bg-[#191b23] border border-[#424754]/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold opacity-70">Horário de Dormir</label>
                <input 
                  type="time" 
                  value={sleepTime}
                  onChange={(e) => setSleepTime(e.target.value)}
                  className="w-full bg-[#191b23] border border-[#424754]/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold opacity-70">Meta ou Objetivo Principal do Trimestre</label>
              <input 
                type="text" 
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Ex: Criar hábito de acordar cedo e economizar R$ 2 mil"
                className="w-full bg-[#191b23] border border-[#424754]/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold opacity-70">Tom de Cobrança do Mentor</label>
              <select 
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-[#191b23] border border-[#424754]/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none"
              >
                <option value="Suave">Suave (Lembretes sutis)</option>
                <option value="Equilibrado">Equilibrado (Cobrança diária)</option>
                <option value="Intenso">Intenso (Cobrança persistente e severa)</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-primary text-[#002e6a] font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Play className="w-4 h-4 fill-[#002e6a]" />
            Gerar Meu Diagnóstico & Trilha
          </button>
        </form>
      )}
    </main>
  );
}
