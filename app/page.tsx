"use client";

import { useState } from "react";
import { 
  Plus, 
  Bolt, 
  Wallet, 
  Sparkles, 
  CheckCircle, 
  Circle, 
  Check, 
  TrendingUp, 
  Trophy, 
  ArrowUpRight, 
  BrainCircuit,
  MessageSquareCode
} from "lucide-react";
import { useLifeOS } from "@/context/lifeos-context";
import Link from "next/link";
import Modal from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";

export default function Dashboard() {
  const { 
    tasks, 
    habits, 
    expenses, 
    level, 
    activeProtocol, 
    onboardingAnswers,
    toggleTask, 
    toggleHabit, 
    addTask, 
    addHabit, 
    addExpense 
  } = useLifeOS();

  const { showToast } = useToast();

  // Modals Visibility States
  const [activeModal, setActiveModal] = useState<"task" | "habit" | "expense" | null>(null);

  // Form Inputs States
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"Baixa" | "Média" | "Alta">("Média");
  const [newHabitName, setNewHabitName] = useState("");
  const [newExpenseName, setNewExpenseName] = useState("");
  const [newExpenseValue, setNewExpenseValue] = useState("");
  const [newExpenseType, setNewExpenseType] = useState<"Receita" | "Despesa">("Despesa");

  // Sum of expenses today
  const dailyLimit = 100.00;
  const todayStr = new Date().toISOString().split("T")[0];
  const dailySpent = expenses
    .filter(e => e.date === todayStr && e.type === "Despesa")
    .reduce((acc, e) => acc + e.amount, 0);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask(newTaskTitle, newTaskPriority);
    setNewTaskTitle("");
    setActiveModal(null);
    showToast("Missão criada com sucesso!", "success");
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    addHabit(newHabitName);
    setNewHabitName("");
    setActiveModal(null);
    showToast("Hábito registrado com sucesso!", "success");
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newExpenseValue);
    if (!newExpenseName.trim() || isNaN(val)) return;
    addExpense(newExpenseName, val, "Outros", newExpenseType);
    setNewExpenseName("");
    setNewExpenseValue("");
    setActiveModal(null);
    showToast(`${newExpenseType === "Receita" ? "Receita" : "Despesa"} lançada!`, "success");
  };

  const handleToggleTask = (id: number, currentStatus: string) => {
    toggleTask(id);
    if (currentStatus !== "Concluído") {
      showToast("Missão concluída! +50 XP", "success");
    } else {
      showToast("Missão reaberta.", "info");
    }
  };

  const handleToggleHabit = (id: number, currentCompleted: boolean) => {
    toggleHabit(id);
    if (!currentCompleted) {
      showToast("Hábito realizado! +30 XP", "success");
    } else {
      showToast("Hábito redefinido.", "info");
    }
  };

  // Day progress calculation
  const totalItems = tasks.length + habits.length;
  const completedItems = tasks.filter(t => t.status === "Concluído").length + habits.filter(h => h.completed).length;
  const dayProgressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <main className="p-6 md:p-10 min-h-screen relative">
      {/* Welcome Area (Header) */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-on-surface">
            Olá, {onboardingAnswers?.name || "Alex"}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-64 h-2.5 bg-surface-container-highest rounded-full overflow-hidden relative shadow-inner">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-container to-primary transition-all duration-1000" 
                style={{ width: `${dayProgressPercentage}%` }}
              ></div>
            </div>
            <span className="text-sm font-semibold text-primary">{dayProgressPercentage}% do dia concluído</span>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="flex flex-wrap items-center gap-3">
          <Link 
            href="/revisao-diaria"
            className="flex items-center gap-2 px-5 py-3 bg-[#8b5cf6] text-white rounded-xl text-sm font-semibold shadow-lg shadow-[#8b5cf6]/10 hover:scale-[1.03] active:scale-[0.97] transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Finalizar Dia
          </Link>
          <button 
            onClick={() => setActiveModal("task")}
            className="flex items-center gap-2 px-5 py-3 bg-[#adc6ff] text-[#002e6a] rounded-xl text-sm font-semibold shadow-lg shadow-[#adc6ff]/10 hover:scale-[1.03] active:scale-[0.97] transition-all"
          >
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </button>
          <button 
            onClick={() => setActiveModal("habit")}
            className="flex items-center gap-2 px-5 py-3 bg-[#4edea3] text-[#003824] rounded-xl text-sm font-semibold shadow-lg shadow-[#4edea3]/10 hover:scale-[1.03] active:scale-[0.97] transition-all"
          >
            <Bolt className="w-4 h-4" />
            Registrar Hábito
          </button>
          <button 
            onClick={() => setActiveModal("expense")}
            className="flex items-center gap-2 px-5 py-3 bg-[#32353c] text-on-surface border border-[#424754]/30 rounded-xl text-sm font-semibold hover:bg-[#32353c]/75 transition-all"
          >
            <Wallet className="w-4 h-4" />
            Lançar Despesa
          </button>
        </div>
      </header>

      {/* Benchmark-inspired Top Info banner (Insight from Aether AI Mentor) */}
      <div className="glass-card rounded-3xl p-5 mb-8 border border-white/5 flex flex-col md:flex-row gap-4 items-center bg-[#4d8eff]/5">
        <div className="w-12 h-12 rounded-2xl bg-[#4d8eff]/20 flex items-center justify-center border border-[#4d8eff]/30 shrink-0">
          <BrainCircuit className="text-primary w-6 h-6" />
        </div>
        <div className="space-y-1 text-center md:text-left flex-1">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Insight do Mentor Aether</span>
            <span className="px-1.5 py-0.5 bg-[#424754]/40 border border-[#424754]/60 text-[#c2c6d6]/60 rounded text-[8px] uppercase tracking-wider font-bold">Demo</span>
          </div>
          <p className="text-sm opacity-90 leading-relaxed text-on-surface-variant">
            {activeProtocol 
              ? `Você está rodando o protocolo "${activeProtocol === "foco" ? "Foco Profundo" : activeProtocol === "manha" ? "Rotina Matinal" : "Organização Financeira"}". Mantenha a sequência!`
              : onboardingAnswers?.diagnostic || "Seu perfil de execução está estável. Faça onboarding para calibrar seu mentor de IA e obter missões sob medida."
            }
          </p>
        </div>
        <Link 
          href="/mentor" 
          className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-highest/60 hover:bg-surface-variant/40 rounded-xl text-xs font-semibold border border-[#424754]/20 transition-all text-on-surface"
        >
          <MessageSquareCode className="w-4 h-4 text-primary" />
          Falar com Aether
        </Link>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* TODAY PANEL */}
        <section className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="glass-card rounded-3xl p-6 h-full flex flex-col gap-6 border-t border-white/5 bg-[#191b23]/35">
            <div className="flex items-center justify-between border-b border-[#424754]/20 pb-4">
              <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
                Hoje 
                {activeProtocol && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary uppercase font-extrabold tracking-wider">Protocolo Ativo</span>}
              </h2>
              <span className="px-3 py-1 bg-[#32353c]/40 rounded-lg text-xs font-mono opacity-60">
                {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).toUpperCase()}
              </span>
            </div>

            {/* Priority Tasks List */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-primary w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/80">Minhas Missões</h3>
              </div>
              <ul className="space-y-2">
                {tasks.map((task) => (
                  <li 
                    key={task.id}
                    onClick={() => handleToggleTask(task.id, task.status)}
                    className={`group flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                      task.status === "Concluído" 
                        ? "bg-[#32353c]/10 border-[#424754]/10 opacity-60 line-through" 
                        : "bg-[#10131a] border-[#424754]/20 hover:bg-[#adc6ff]/5 hover:border-primary/30"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      task.status === "Concluído" 
                        ? "border-primary bg-primary/20" 
                        : "border-[#8c909f] group-hover:border-primary"
                    }`}>
                      {task.status === "Concluído" && <Check className="text-primary w-3.5 h-3.5 stroke-[3px]" />}
                    </div>
                    <span className="text-sm font-medium text-on-surface">{task.title}</span>
                    <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      task.priority === "Alta" ? "bg-error/10 text-error" : 
                      task.priority === "Média" ? "bg-tertiary/10 text-tertiary" : "bg-[#c2c6d6]/10 text-[#c2c6d6]"
                    }`}>
                      {task.priority}
                    </span>
                  </li>
                ))}
                {tasks.length === 0 && (
                  <div className="text-center py-6 text-xs opacity-40 border border-dashed border-[#424754]/20 rounded-xl">
                    Sem tarefas para hoje.
                  </div>
                )}
              </ul>
            </div>

            {/* Weekly Habit Tracker Row */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="text-secondary w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/80">Check-in de Hábitos</h3>
              </div>

              {/* Habits Checklist */}
              <ul className="p-4 rounded-2xl bg-[#0b0e15]/50 border border-[#424754]/10 space-y-3">
                {habits.map((habit) => (
                  <li 
                    key={habit.id}
                    onClick={() => handleToggleHabit(habit.id, habit.completed)}
                    className="flex justify-between items-center cursor-pointer group"
                  >
                    <div className="flex flex-col">
                      <span className={`text-sm ${habit.completed ? "text-secondary font-medium line-through opacity-70" : "text-on-surface"}`}>
                        {habit.name}
                      </span>
                      {habit.streak > 0 && (
                        <span className="text-[9px] text-secondary font-mono">🔥 {habit.streak} dias de streak</span>
                      )}
                    </div>
                    {habit.completed ? (
                      <CheckCircle className="text-secondary w-5 h-5 fill-secondary/10" />
                    ) : (
                      <Circle className="text-[#8c909f] w-5 h-5 group-hover:text-secondary" />
                    )}
                  </li>
                ))}
                {habits.length === 0 && (
                  <div className="text-center py-4 text-xs opacity-40">
                    Nenhum hábito cadastrado.
                  </div>
                )}
              </ul>
            </div>

            {/* Finance Limits */}
            <div className="mt-auto pt-6 border-t border-[#424754]/20 space-y-2">
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60">Gasto Diário</span>
                  <span className="text-xl font-bold text-tertiary">R$ {dailySpent.toFixed(2)}</span>
                </div>
                <span className="text-xs opacity-50">Limite: R$ {dailyLimit.toFixed(2)}</span>
              </div>
              <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
                <div 
                  className="h-full bg-tertiary shadow-[0_0_10px_rgba(255,185,95,0.4)] transition-all duration-700" 
                  style={{ width: `${Math.min((dailySpent / dailyLimit) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </section>

        {/* GENERAL MODULES */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Habits Module (Analytics) */}
          <article className="glass-card rounded-3xl p-6 flex flex-col gap-4 border-t border-white/5 bg-[#191b23]/35">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-secondary w-5 h-5" />
                <h2 className="text-sm font-bold text-on-surface">Habit Analytics</h2>
              </div>
              <Link href="/habitos">
                <ArrowUpRight className="text-[#c2c6d6] hover:text-primary cursor-pointer w-5 h-5 transition-colors" />
              </Link>
            </div>
            <div className="flex flex-1 items-center justify-around py-4">
              <div className="flex flex-col items-center">
                <span className="text-4xl font-extrabold text-secondary tracking-tight">
                  {Math.max(...habits.map(h => h.streak), 0)}
                </span>
                <span className="text-xs text-on-surface-variant font-semibold tracking-wider uppercase opacity-60 font-mono">Max Streak</span>
              </div>
              <div className="w-[1px] h-12 bg-[#424754]/20"></div>
              <div className="flex flex-col items-center">
                <span className="text-4xl font-extrabold text-on-surface tracking-tight">
                  {habits.length > 0 ? Math.round((habits.filter(h => h.streak > 0).length / habits.length) * 100) : 0}%
                </span>
                <span className="text-xs text-on-surface-variant font-semibold tracking-wider uppercase opacity-60 font-mono">Consistência</span>
              </div>
            </div>
            <div className="h-24 w-full flex items-end gap-1.5 px-2">
              <div className="flex-1 bg-secondary/20 h-[30%] rounded-t hover:bg-secondary transition-all"></div>
              <div className="flex-1 bg-secondary/20 h-[45%] rounded-t hover:bg-secondary transition-all"></div>
              <div className="flex-1 bg-secondary/20 h-[60%] rounded-t hover:bg-secondary transition-all"></div>
              <div className="flex-1 bg-secondary h-[85%] rounded-t shadow-[0_0_15px_rgba(78,222,163,0.3)]"></div>
              <div className="flex-1 bg-secondary/20 h-[40%] rounded-t hover:bg-secondary transition-all"></div>
              <div className="flex-1 bg-secondary/20 h-[55%] rounded-t hover:bg-secondary transition-all"></div>
              <div className="flex-1 bg-secondary h-[70%] rounded-t shadow-[0_0_10px_rgba(78,222,163,0.2)]"></div>
            </div>
          </article>

          {/* Tasks Kanban Preview */}
          <article className="glass-card rounded-3xl p-6 flex flex-col gap-4 border-t border-white/5 bg-[#191b23]/35">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-primary w-5 h-5" />
                <h2 className="text-sm font-bold text-on-surface">Atividades Pendentes</h2>
              </div>
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full font-bold uppercase tracking-wider">
                {tasks.filter(t => t.status !== "Concluído").length} Ativas
              </span>
            </div>
            
            <div className="flex gap-4 h-full overflow-hidden mt-2">
              <div className="flex-1 flex flex-col gap-2">
                <span className="text-[10px] opacity-40 font-bold uppercase tracking-wider">A Fazer</span>
                {tasks.filter(t => t.status === "A Fazer").slice(0, 2).map(t => (
                  <div key={t.id} className="p-3 bg-[#1d2027]/50 rounded-xl border border-[#424754]/10 text-xs font-medium text-on-surface-variant hover:border-primary/20 transition-all truncate">
                    {t.title}
                  </div>
                ))}
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <span className="text-[10px] opacity-40 font-bold uppercase tracking-wider">Urgentes</span>
                {tasks.filter(t => t.status === "Em Andamento").slice(0, 2).map(t => (
                  <div key={t.id} className="p-3 bg-primary/10 rounded-xl border border-primary/20 text-xs font-semibold text-primary truncate">
                    {t.title}
                  </div>
                ))}
              </div>
            </div>

            <Link href="/atividades" className="mt-auto text-center text-xs font-bold text-primary/60 hover:text-primary transition-colors py-3 border-t border-[#424754]/15">
              Ver Kanban Completo
            </Link>
          </article>

          {/* Finance Category Spending */}
          <article className="glass-card rounded-3xl p-6 flex flex-col gap-4 border-t border-white/5 bg-[#191b23]/35">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Wallet className="text-tertiary w-5 h-5" />
                <h2 className="text-sm font-bold text-on-surface">Gastos Recentes</h2>
              </div>
              <span className="text-xs text-tertiary font-bold font-mono">Total</span>
            </div>

            <div className="flex items-center gap-6 flex-1 py-2">
              <div className="relative w-24 h-24 rounded-full border-[8px] border-tertiary/20 flex items-center justify-center shrink-0">
                <div className="absolute inset-0 rounded-full border-[8px] border-tertiary border-r-transparent border-b-transparent -rotate-45"></div>
                <span className="font-extrabold text-xs text-on-surface">73%</span>
              </div>
              <div className="space-y-2 flex-1 overflow-hidden">
                {expenses.filter(e => e.type === "Despesa").slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-2 h-2 rounded-full bg-tertiary shrink-0"></div>
                      <span className="opacity-70 font-medium truncate">{item.description}</span>
                    </div>
                    <span className="font-bold text-on-surface shrink-0">R$ {item.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* Goals / OKRs Module */}
          <article className="glass-card rounded-3xl p-6 flex flex-col gap-4 border-t border-white/5 bg-[#191b23]/35">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Trophy className="text-[#8b5cf6] w-5 h-5" />
                <h2 className="text-sm font-bold text-on-surface">Metas Ativas</h2>
              </div>
              <Link href="/metas">
                <ArrowUpRight className="text-[#c2c6d6] hover:text-[#8b5cf6] cursor-pointer w-5 h-5 transition-colors" />
              </Link>
            </div>

            <div className="space-y-4 flex-1 justify-center flex flex-col">
              {[
                { name: "Aprender Next.js & Server Actions", progress: 80, color: "from-[#8b5cf6] to-[#adc6ff]" },
                { name: "Consistência de Finanças Pessoais", progress: 65, color: "from-[#ffb95f] to-[#ca8100]" }
              ].map((goal, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="opacity-80 max-w-[80%] truncate">{goal.name}</span>
                    <span className="text-primary">{goal.progress}%</span>
                  </div>
                  <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${goal.color} rounded-full`}
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </article>

        </div>
      </div>

      {/* QUICK ACTIONS MODALS OVERLAY */}
      <Modal isOpen={activeModal === "task"} onClose={() => setActiveModal(null)} title="Nova Tarefa">
        <form onSubmit={handleAddTask} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-on-surface-variant/80">Título</label>
            <input 
              type="text" 
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Digite a atividade..." 
              className="w-full bg-[#191b23] border border-[#424754]/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-on-surface"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-on-surface-variant/80">Prioridade</label>
            <select 
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value as any)}
              className="w-full bg-[#191b23] border border-[#424754]/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-on-surface"
            >
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Baixa">Baixa</option>
            </select>
          </div>
          <button type="submit" className="w-full py-3 bg-[#adc6ff] text-[#002e6a] rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
            Criar Tarefa
          </button>
        </form>
      </Modal>

      <Modal isOpen={activeModal === "habit"} onClose={() => setActiveModal(null)} title="Novo Hábito">
        <form onSubmit={handleAddHabit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-on-surface-variant/80">Nome do Hábito</label>
            <input 
              type="text" 
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder="Ex: Beber 3L de água, Meditação..." 
              className="w-full bg-[#191b23] border border-[#424754]/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-on-surface"
              required
            />
          </div>
          <button type="submit" className="w-full py-3 bg-[#4edea3] text-[#003824] rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
            Criar Hábito
          </button>
        </form>
      </Modal>

      <Modal isOpen={activeModal === "expense"} onClose={() => setActiveModal(null)} title="Lançar Finança">
        <form onSubmit={handleAddExpense} className="space-y-4">
          <div className="flex gap-2 p-1 bg-[#191b23] rounded-xl border border-[#424754]/20 mb-2">
            <button 
              type="button" 
              onClick={() => setNewExpenseType("Despesa")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${newExpenseType === "Despesa" ? "bg-error/20 text-error border border-error/30" : "text-on-surface/60"}`}
            >
              Despesa
            </button>
            <button 
              type="button" 
              onClick={() => setNewExpenseType("Receita")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${newExpenseType === "Receita" ? "bg-secondary/20 text-secondary border border-secondary/30" : "text-on-surface/60"}`}
            >
              Receita
            </button>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-on-surface-variant/80">Descrição</label>
            <input 
              type="text" 
              value={newExpenseName}
              onChange={(e) => setNewExpenseName(e.target.value)}
              placeholder="Ex: Supermercado, Aluguel..." 
              className="w-full bg-[#191b23] border border-[#424754]/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-on-surface"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-on-surface-variant/80">Valor (R$)</label>
            <input 
              type="number" 
              step="0.01"
              value={newExpenseValue}
              onChange={(e) => setNewExpenseValue(e.target.value)}
              placeholder="0.00" 
              className="w-full bg-[#191b23] border border-[#424754]/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-on-surface"
              required
            />
          </div>
          <button type="submit" className={`w-full py-3 text-sm font-semibold rounded-xl text-white ${newExpenseType === "Receita" ? "bg-secondary text-[#003824]" : "bg-error"}`}>
            Confirmar Lançamento
          </button>
        </form>
      </Modal>
    </main>
  );
}
