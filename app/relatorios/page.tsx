"use client";

import { useLifeOS } from "@/context/lifeos-context";
import { BarChart3, Sparkles, CheckCircle2, Wallet, Trophy } from "lucide-react";

export default function Relatorios() {
  const { tasks, habits, expenses } = useLifeOS();

  // Calculations for Tasks
  const completedTasksCount = tasks.filter(t => t.status === "Concluído").length;
  const activeTasksCount = tasks.filter(t => t.status !== "Concluído").length;
  const totalTasks = tasks.length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  // Calculations for Habits
  const completedHabitsToday = habits.filter(h => h.completed).length;
  const totalHabits = habits.length;
  const habitCompletionRate = totalHabits > 0 ? Math.round((completedHabitsToday / totalHabits) * 100) : 0;
  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak), 0) : 0;

  // Calculations for Finance
  const income = expenses.filter(e => e.type === "Receita").reduce((acc, e) => acc + e.amount, 0);
  const expenseSum = expenses.filter(e => e.type === "Despesa").reduce((acc, e) => acc + e.amount, 0);
  const balance = income - expenseSum;

  return (
    <main className="p-6 md:p-10 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-on-surface flex items-center gap-3">
          <BarChart3 className="text-primary w-8 h-8" />
          Relatórios & Insights
        </h1>
        <p className="text-sm opacity-60 mt-1">Análise consolidada de produtividade, consistência e saúde financeira</p>
      </header>

      {/* Analytics Summary Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Productivity Card */}
        <div className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col gap-3">
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-primary">
            <span>Produtividade</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-extrabold text-on-surface">{taskCompletionRate}%</span>
            <p className="text-xs text-on-surface-variant opacity-75">Taxa de conclusão de tarefas</p>
          </div>
          <div className="text-xs opacity-60 mt-2 flex justify-between">
            <span>Concluídas: {completedTasksCount}</span>
            <span>Pendentes: {activeTasksCount}</span>
          </div>
        </div>

        {/* Consistency Card */}
        <div className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col gap-3">
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-secondary">
            <span>Consistência</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-extrabold text-[#4edea3]">{habitCompletionRate}%</span>
            <p className="text-xs text-on-surface-variant opacity-75">Hábitos cumpridos hoje</p>
          </div>
          <div className="text-xs opacity-60 mt-2 flex justify-between">
            <span>Maior Streak: {maxStreak} dias</span>
            <span>Total Hábitos: {totalHabits}</span>
          </div>
        </div>

        {/* Finance Status Card */}
        <div className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col gap-3">
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-tertiary">
            <span>Balanço Financeiro</span>
            <Wallet className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <span className={`text-2xl font-extrabold ${balance >= 0 ? "text-primary" : "text-error"}`}>
              R$ {balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
            <p className="text-xs text-on-surface-variant opacity-75">Economia líquida do período</p>
          </div>
          <div className="text-xs opacity-60 mt-2 flex justify-between">
            <span className="text-secondary">Rec: R$ {income.toFixed(0)}</span>
            <span className="text-error">Desp: R$ {expenseSum.toFixed(0)}</span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Productivity Trends Chart Mockup */}
        <div className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#8b5cf6]" /> Histórico de Execução Semanal
          </h3>
          <div className="h-48 w-full flex items-end gap-3 px-2 pt-4 border-b border-[#424754]/20 pb-1">
            {[
              { label: "Seg", val: 30 },
              { label: "Ter", val: 50 },
              { label: "Qua", val: 75 },
              { label: "Qui", val: 40 },
              { label: "Sex", val: 90 },
              { label: "Sáb", val: 20 },
              { label: "Dom", val: 10 }
            ].map((day, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div 
                  className="w-full bg-gradient-to-t from-primary/30 to-primary rounded-t shadow-[0_0_10px_rgba(173,198,255,0.2)] transition-all duration-500 hover:opacity-80"
                  style={{ height: `${day.val}%` }}
                ></div>
                <span className="text-[10px] opacity-50 font-bold">{day.label}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs opacity-50 px-2 font-mono">
            <span>Eficiência Média: 45.7%</span>
            <span>Ápice: Sexta-feira</span>
          </div>
        </div>

        {/* Expense distribution list */}
        <div className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
            <Wallet className="w-4 h-4 text-tertiary" /> Distribuição de Despesas
          </h3>
          
          <div className="flex-1 justify-center flex flex-col gap-3">
            {[
              { category: "Alimentação", color: "bg-tertiary", percent: 45 },
              { category: "Transporte", color: "bg-primary", percent: 30 },
              { category: "Assinaturas", color: "bg-[#c2c6d6]/60", percent: 15 },
              { category: "Lazer e Outros", color: "bg-[#8b5cf6]", percent: 10 },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color}`}></div>
                    <span>{item.category}</span>
                  </div>
                  <span>{item.percent}%</span>
                </div>
                <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
