"use client";

import { useState } from "react";
import { Plus, ChevronLeft, ChevronRight, Check, Trash } from "lucide-react";
import { useLifeOS, Task } from "@/context/lifeos-context";

export default function Atividades() {
  const { tasks, addTask, deleteTask, moveTask } = useLifeOS();

  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<"Baixa" | "Média" | "Alta">("Média");
  const [newStatus, setNewStatus] = useState<Task["status"]>("A Fazer");
  const [isAdding, setIsAdding] = useState(false);

  const handleMoveTask = (id: number, currentStatus: Task["status"], direction: "prev" | "next") => {
    let nextStatus: Task["status"] = currentStatus;
    if (currentStatus === "A Fazer" && direction === "next") nextStatus = "Em Andamento";
    else if (currentStatus === "Em Andamento") {
      nextStatus = direction === "next" ? "Concluído" : "A Fazer";
    } else if (currentStatus === "Concluído" && direction === "prev") nextStatus = "Em Andamento";
    moveTask(id, nextStatus);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTask(newTitle, newPriority, newStatus);
    setNewTitle("");
    setIsAdding(false);
  };

  const columns = [
    { name: "A Fazer" as const, color: "text-[#adc6ff]" },
    { name: "Em Andamento" as const, color: "text-tertiary" },
    { name: "Concluído" as const, color: "text-secondary" },
  ];

  return (
    <main className="p-6 md:p-10 min-h-screen">
      <header className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-on-surface">Atividades</h1>
          <p className="text-sm opacity-60 mt-1">Gerencie suas tarefas através do painel Kanban</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#adc6ff] text-[#002e6a] rounded-xl text-sm font-semibold shadow-lg shadow-[#adc6ff]/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" />
          Adicionar Tarefa
        </button>
      </header>

      {isAdding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddTask} className="glass-card max-w-md w-full rounded-3xl border border-white/10 p-6 flex flex-col gap-5 relative bg-[#1d2027]">
            <h3 className="text-lg font-bold">Nova Tarefa Kanban</h3>
            <div className="space-y-1">
              <label className="text-xs font-semibold opacity-70">Título</label>
              <input 
                type="text" 
                value={newTitle} 
                onChange={(e) => setNewTitle(e.target.value)} 
                className="w-full bg-[#191b23] border border-[#424754]/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none" 
                required 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold opacity-70">Prioridade</label>
                <select 
                  value={newPriority} 
                  onChange={(e) => setNewPriority(e.target.value as any)} 
                  className="w-full bg-[#191b23] border border-[#424754]/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none"
                >
                  <option value="Alta">Alta</option>
                  <option value="Média">Média</option>
                  <option value="Baixa">Baixa</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold opacity-70">Coluna Inicial</label>
                <select 
                  value={newStatus} 
                  onChange={(e) => setNewStatus(e.target.value as any)} 
                  className="w-full bg-[#191b23] border border-[#424754]/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none"
                >
                  <option value="A Fazer">A Fazer</option>
                  <option value="Em Andamento">Em Andamento</option>
                  <option value="Concluído">Concluído</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <button type="submit" className="flex-1 py-3 bg-[#adc6ff] text-[#002e6a] rounded-xl text-sm font-semibold hover:opacity-90 font-medium">Adicionar</button>
              <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-3 bg-[#32353c] text-on-surface rounded-xl text-sm font-semibold hover:opacity-90">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => {
          const colTasks = tasks.filter(t => t.status === col.name);
          return (
            <div key={col.name} className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col gap-4 min-h-[450px]">
              <div className="flex items-center justify-between border-b border-[#424754]/10 pb-3">
                <span className={`font-bold text-sm uppercase tracking-wider ${col.color}`}>{col.name}</span>
                <span className="px-2 py-0.5 bg-[#32353c]/40 text-xs rounded-full font-mono font-bold opacity-60">
                  {colTasks.length}
                </span>
              </div>

              <div className="flex flex-col gap-3 overflow-y-auto max-h-[500px] pr-1 custom-scrollbar">
                {colTasks.map((t) => (
                  <div key={t.id} className="p-4 bg-[#191b23]/60 rounded-xl border border-[#424754]/20 flex flex-col gap-3 hover:border-primary/20 transition-colors">
                    <div className="flex justify-between items-start">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        t.priority === "Alta" ? "bg-error/10 text-error" : 
                        t.priority === "Média" ? "bg-tertiary/10 text-tertiary" : "bg-[#c2c6d6]/10 text-[#c2c6d6]"
                      }`}>
                        {t.priority}
                      </span>
                      <button onClick={() => deleteTask(t.id)} className="text-on-surface-variant hover:text-error transition-colors">
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-sm font-medium text-on-surface">{t.title}</p>
                    
                    <div className="flex justify-between border-t border-[#424754]/10 pt-2 mt-1">
                      <button 
                        disabled={col.name === "A Fazer"}
                        onClick={() => handleMoveTask(t.id, t.status, "prev")}
                        className="text-[#c2c6d6] hover:text-primary disabled:opacity-20 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button 
                        disabled={col.name === "Concluído"}
                        onClick={() => handleMoveTask(t.id, t.status, "next")}
                        className="text-[#c2c6d6] hover:text-primary disabled:opacity-20 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {colTasks.length === 0 && (
                  <div className="flex-1 flex items-center justify-center border border-dashed border-[#424754]/20 rounded-xl py-12 text-xs opacity-40">
                    Nenhuma tarefa aqui
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
