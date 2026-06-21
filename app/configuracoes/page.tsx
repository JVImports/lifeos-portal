"use client";

import { useState, useEffect } from "react";
import { User, Calendar, Github, Shield, ToggleLeft, ToggleRight, Sparkles } from "lucide-react";
import { useLifeOS } from "@/context/lifeos-context";

export default function Configuracoes() {
  const { onboardingAnswers, completeOnboarding } = useLifeOS();

  const [userName, setUserName] = useState("Alex");
  const [userEmail, setUserEmail] = useState("alex@lifeos.com");
  const [theme, setTheme] = useState("Escuro (Aether)");
  const [focus, setFocus] = useState("Produtividade");
  const [goal, setGoal] = useState("");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [sleepTime, setSleepTime] = useState("23:00");
  const [discipline, setDiscipline] = useState("Média");
  const [tone, setTone] = useState("Equilibrado");

  // Sync inputs with global state on load
  useEffect(() => {
    if (onboardingAnswers) {
      setUserName(onboardingAnswers.name);
      setFocus(onboardingAnswers.focus);
      setGoal(onboardingAnswers.goal);
      setWakeTime(onboardingAnswers.wakeTime);
      setSleepTime(onboardingAnswers.sleepTime);
      setDiscipline(onboardingAnswers.discipline);
      setTone(onboardingAnswers.tone);
    }
  }, [onboardingAnswers]);

  // Integration States
  const [integrations, setIntegrations] = useState([
    { id: "gcal", name: "Google Calendar", active: true, desc: "Sincroniza seus eventos diários no painel 'Hoje'", icon: Calendar },
    { id: "github", name: "GitHub Integration", active: false, desc: "Sincroniza seus commits diários como hábitos de código", icon: Github },
  ]);

  const toggleIntegration = (id: string) => {
    setIntegrations(integrations.map(item => item.id === id ? { ...item, active: !item.active } : item));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    completeOnboarding({
      name: userName,
      focus,
      goal,
      wakeTime,
      sleepTime,
      discipline,
      tone
    });
    alert("Configurações salvas e perfil recalibrado com sucesso!");
  };

  return (
    <main className="p-6 md:p-10 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-on-surface">Configurações</h1>
        <p className="text-sm opacity-60 mt-1">Gerencie seu perfil, temas do sistema e integrações ativas</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <section className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="glass-card rounded-2xl p-6 border border-white/5 space-y-5">
            <div className="flex items-center gap-2 border-b border-[#424754]/20 pb-3">
              <User className="text-primary w-5 h-5" />
              <h2 className="text-md font-bold">Perfil do Usuário</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold opacity-70">Nome</label>
                <input 
                  type="text" 
                  value={userName} 
                  onChange={(e) => setUserName(e.target.value)} 
                  className="w-full bg-[#191b23] border border-[#424754]/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none" 
                  required 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold opacity-70">Email de Contato</label>
                <input 
                  type="email" 
                  value={userEmail} 
                  onChange={(e) => setUserEmail(e.target.value)} 
                  className="w-full bg-[#191b23] border border-[#424754]/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none" 
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold opacity-70">Área de Foco</label>
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
                  <option value="Alta">Alta</option>
                  <option value="Média">Média</option>
                  <option value="Baixa">Baixa</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label className="text-xs font-semibold opacity-70">Meta Principal</label>
              <input 
                type="text" 
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full bg-[#191b23] border border-[#424754]/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none"
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold opacity-70">Tema Visual</label>
                <select 
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full bg-[#191b23] border border-[#424754]/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none"
                >
                  <option value="Escuro (Aether)">Escuro (Aether)</option>
                  <option value="Claro (Aether Light)">Claro (Aether Light)</option>
                  <option value="Modo Foco Carbono">Modo Foco Carbono</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold opacity-70">Tom de Cobrança</label>
                <select 
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-[#191b23] border border-[#424754]/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none"
                >
                  <option value="Suave">Suave</option>
                  <option value="Equilibrado">Equilibrado</option>
                  <option value="Intenso">Intenso</option>
                </select>
              </div>
            </div>

            <button type="submit" className="px-6 py-3 bg-[#adc6ff] text-[#002e6a] rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
              Salvar Alterações
            </button>
          </form>

          {/* Security & Access */}
          <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4 bg-[#191b23]/35">
            <div className="flex items-center gap-2 border-b border-[#424754]/20 pb-3">
              <Shield className="text-error w-5 h-5" />
              <h2 className="text-md font-bold">Privacidade e RLS</h2>
            </div>
            <p className="text-xs text-on-surface-variant opacity-80 leading-relaxed">
              Os dados deste workspace (hábitos, tarefas e finanças) estão protegidos por regras de <strong>Row Level Security (RLS)</strong> ativas no banco de dados do Supabase. Apenas você tem permissão de leitura e gravação sobre seus registros de produtividade.
            </p>
          </div>
        </section>

        {/* Connections / Integrations Sidebar */}
        <section className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4 bg-[#191b23]/35">
            <div className="flex items-center gap-2 border-b border-[#424754]/20 pb-3">
              <Sparkles className="text-secondary w-5 h-5" />
              <h2 className="text-md font-bold">Conexões & APIs</h2>
            </div>

            <div className="space-y-4">
              {integrations.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="p-4 bg-[#191b23]/50 rounded-xl border border-[#424754]/20 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center border border-white/5">
                          <Icon className="w-4 h-4 text-on-surface" />
                        </div>
                        <span className="text-sm font-semibold text-on-surface">{item.name}</span>
                      </div>
                      
                      <button 
                        onClick={() => toggleIntegration(item.id)}
                        className="text-[#c2c6d6] hover:text-[#adc6ff] transition-colors"
                      >
                        {item.active ? (
                          <ToggleRight className="w-8 h-8 text-[#4edea3]" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-on-surface-variant/40" />
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] text-on-surface-variant opacity-70 leading-normal">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
