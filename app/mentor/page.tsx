"use client";

import { useState } from "react";
import { useLifeOS } from "@/context/lifeos-context";
import { BrainCircuit, Send, Sparkles, Terminal, ShieldAlert } from "lucide-react";

interface Message {
  id: number;
  sender: "user" | "mentor";
  text: string;
  time: string;
}

export default function MentorChat() {
  const { onboardingAnswers, activeProtocol, tasks, expenses, habits, gainXp } = useLifeOS();

  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      sender: "mentor", 
      text: `Olá! Eu sou o Aether, seu mentor de inteligência pessoal. ${
        onboardingAnswers 
          ? `Identifiquei que sua prioridade é ${onboardingAnswers.focus} e seu objetivo principal é: "${onboardingAnswers.goal}".` 
          : "Faça o Onboarding para alinhar seu plano diário e calibrar minhas diretrizes."
      }`, 
      time: "12:00" 
    }
  ]);

  const [input, setInput] = useState("");

  const quickCommands = [
    { label: "Me dê uma missão", cmd: "me de uma missao" },
    { label: "Analisar despesas", cmd: "analisar despesas" },
    { label: "Consistência de Hábitos", cmd: "analisar habitos" },
  ];

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      sender: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // Simulate AI Mentor thinking
    setTimeout(() => {
      let responseText = "";
      const cmd = textToSend.toLowerCase().trim();

      if (cmd.includes("missao") || cmd.includes("missão")) {
        responseText = "Entendido. Vasculhando sua rotina de hoje... Gerando Missão Extraordinária: 'Finalizar Apresentação Q4' é sua tarefa prioritária pendente. Concentre-se nela pelas próximas 2 horas. Concluir isso garantirá +50 XP!";
        gainXp(10);
      } else if (cmd.includes("despesa") || cmd.includes("gasto") || cmd.includes("financas") || cmd.includes("finanças")) {
        const spent = expenses.filter(e => e.type === "Despesa").reduce((sum, e) => sum + e.amount, 0);
        responseText = `Analisando seu balanço... Você possui R$ ${spent.toFixed(2)} acumulados em despesas contra um saldo líquido positivo. Seu maior limitador é a categoria Alimentação. Recomendo segurar gastos supérfluos hoje.`;
      } else if (cmd.includes("habito") || cmd.includes("hábito")) {
        const completed = habits.filter(h => h.completed).length;
        responseText = `Verificando sua consistência de hábitos... Você concluiu ${completed} de ${habits.length} hábitos hoje. Seu maior streak atual é de ${Math.max(...habits.map(h => h.streak), 0)} dias. Continue firme no check-in!`;
      } else if (cmd.includes("rotina") || cmd.includes("acordar")) {
        responseText = "Para estruturar uma rotina de alto impacto matinal (como acordar às 6h), recomendo ativar o 'Protocolo Rotina Matinal' na aba de Protocolos. Ele injetará os hábitos iniciais de hidratação e alongamento no seu dia.";
      } else if (cmd.includes("semana") || cmd.includes("organizar")) {
        responseText = "Analisando seus compromissos... Para organizar sua semana, comece cadastrando suas metas em 'Metas e OKRs' e divida-as em subtarefas no painel de Atividades. Quer que eu sugira metas prioritárias para o seu foco?";
      } else if (cmd.includes("revisar") || cmd.includes("revisão") || cmd.includes("revisao")) {
        responseText = "Excelente iniciativa. Você pode fechar o seu dia e auditar sua consistência agora mesmo acessando nossa página de 'Revisão Diária'. Ela ajudará a recalibrar suas tarefas pendentes para amanhã.";
      } else {
        responseText = `Compreendo. Como seu mentor Aether, recomendo focar na execução prática do seu dia. Você possui ${tasks.filter(t => t.status !== "Concluído").length} atividades pendentes na aba Atividades. Quer que eu ajude a organizar os horários delas?`;
      }

      const mentorMsg: Message = {
        id: Date.now() + 1,
        sender: "mentor",
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, mentorMsg]);
    }, 1000);
  };

  return (
    <main className="p-6 md:p-10 min-h-screen flex flex-col">
      <header className="mb-6 flex justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-on-surface flex items-center gap-3">
            <BrainCircuit className="text-primary w-8 h-8" />
            Mentor Aether
          </h1>
          <p className="text-sm opacity-60 mt-1">Converse com seu mentor para planejar seu dia, analisar métricas e ajustar rotinas</p>
        </div>
        <div className="flex flex-col md:flex-row items-end md:items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[10px] text-amber-400 font-bold uppercase tracking-wider">
            <ShieldAlert className="w-3 h-3" />
            <span>Simulação</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#4d8eff]/10 border border-[#4d8eff]/20 rounded-xl text-xs text-primary font-bold">
            <Terminal className="w-3.5 h-3.5" />
            <span>Aether v1.2 Active</span>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 glass-card rounded-2xl p-4 md:p-6 border border-white/5 bg-[#191b23]/30 flex flex-col gap-4 max-h-[500px] overflow-y-auto custom-scrollbar mb-4">
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex flex-col max-w-[80%] ${
              msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
            }`}
          >
            <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
              msg.sender === "user" 
                ? "bg-primary text-[#002e6a] rounded-tr-none font-medium" 
                : "bg-[#1d2027]/70 text-on-surface rounded-tl-none border border-[#424754]/25"
            }`}>
              {msg.text}
            </div>
            <span className="text-[10px] opacity-40 mt-1 px-1">{msg.time}</span>
          </div>
        ))}
      </div>

      {/* Quick Actions Suggestions */}
      <div className="flex flex-wrap gap-2 mb-4">
        {quickCommands.map((qc) => (
          <button 
            key={qc.label}
            onClick={() => handleSend(qc.cmd)}
            className="px-4 py-2 rounded-xl bg-surface-container-highest/60 hover:bg-surface-variant/40 text-xs font-semibold border border-[#424754]/20 transition-all text-on-surface"
          >
            {qc.label}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
          placeholder="Fale com o Aether... (Ex: 'Me dê uma missão')"
          className="flex-1 bg-[#191b23] border border-[#424754]/30 rounded-xl px-5 py-4 text-sm text-on-surface focus:outline-none focus:border-primary"
        />
        <button 
          onClick={() => handleSend(input)}
          className="p-4 bg-primary text-[#002e6a] rounded-xl hover:scale-105 active:scale-95 transition-all"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </main>
  );
}
