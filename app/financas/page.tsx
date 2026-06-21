"use client";

import { useState } from "react";
import { Plus, TrendingUp, TrendingDown, Trash, DollarSign } from "lucide-react";
import { useLifeOS } from "@/context/lifeos-context";

export default function Financas() {
  const { expenses, addExpense, deleteExpense } = useLifeOS();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Alimentação");
  const [type, setType] = useState<"Receita" | "Despesa">("Despesa");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!description.trim() || isNaN(val)) return;

    addExpense(description, val, category, type);
    setDescription("");
    setAmount("");
    setIsAdding(false);
  };

  // Calculations
  const income = expenses.filter(t => t.type === "Receita").reduce((acc, t) => acc + t.amount, 0);
  const expenseSum = expenses.filter(t => t.type === "Despesa").reduce((acc, t) => acc + t.amount, 0);
  const balance = income - expenseSum;

  return (
    <main className="p-6 md:p-10 min-h-screen">
      <header className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-on-surface">Finanças</h1>
          <p className="text-sm opacity-60 mt-1">Monitore seu saldo, receitas e despesas mensais</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#ffb95f] text-[#472a00] rounded-xl text-sm font-semibold shadow-lg shadow-[#ffb95f]/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" />
          Novo Lançamento
        </button>
      </header>

      {/* Cash Flow Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card rounded-2xl p-5 border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <DollarSign className="text-primary w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Saldo Líquido</span>
            <p className={`text-2xl font-extrabold mt-0.5 ${balance >= 0 ? "text-primary" : "text-error"}`}>
              R$ {balance.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
            <TrendingUp className="text-secondary w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Total Receitas</span>
            <p className="text-2xl font-extrabold mt-0.5 text-secondary">
              R$ {income.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center border border-error/20">
            <TrendingDown className="text-error w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Total Despesas</span>
            <p className="text-2xl font-extrabold mt-0.5 text-error">
              R$ {expenseSum.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddTransaction} className="glass-card max-w-md w-full rounded-3xl border border-white/10 p-6 flex flex-col gap-5 relative bg-[#1d2027]">
            <h3 className="text-lg font-bold">Novo Lançamento</h3>
            
            <div className="flex gap-2 p-1 bg-[#191b23] rounded-xl border border-[#424754]/20">
              <button 
                type="button" 
                onClick={() => setType("Despesa")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${type === "Despesa" ? "bg-error/20 text-error border border-error/30" : "text-on-surface/60"}`}
              >
                Despesa
              </button>
              <button 
                type="button" 
                onClick={() => setType("Receita")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${type === "Receita" ? "bg-secondary/20 text-secondary border border-secondary/30" : "text-on-surface/60"}`}
              >
                Receita
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold opacity-70">Descrição</label>
              <input 
                type="text" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="w-full bg-[#191b23] border border-[#424754]/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none" 
                placeholder="Ex: Compra Carrefour..."
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold opacity-70">Valor (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  className="w-full bg-[#191b23] border border-[#424754]/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none" 
                  placeholder="0.00"
                  required 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold opacity-70">Categoria</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  className="w-full bg-[#191b23] border border-[#424754]/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none"
                >
                  <option value="Salário">Salário</option>
                  <option value="Alimentação">Alimentação</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Assinaturas">Assinaturas</option>
                  <option value="Lazer">Lazer</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              <button type="submit" className={`flex-1 py-3 text-sm font-semibold rounded-xl text-white ${type === "Receita" ? "bg-secondary text-[#003824]" : "bg-error text-white"}`}>
                Adicionar Lançamento
              </button>
              <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-3 bg-[#32353c] text-on-surface rounded-xl text-sm font-semibold hover:opacity-90">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Transaction History Card */}
      <div className="glass-card rounded-2xl p-6 border border-white/5">
        <h2 className="text-lg font-bold mb-4">Histórico de Transações</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#424754]/20 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant opacity-60">
                <th className="pb-3">Descrição</th>
                <th className="pb-3">Categoria</th>
                <th className="pb-3">Data</th>
                <th className="pb-3 text-right">Valor</th>
                <th className="pb-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#424754]/10 text-sm">
              {expenses.map((t) => (
                <tr key={t.id} className="hover:bg-[#32353c]/5">
                  <td className="py-4 font-medium text-on-surface">{t.description}</td>
                  <td className="py-4 text-on-surface-variant">{t.category}</td>
                  <td className="py-4 text-on-surface-variant opacity-80">{t.date}</td>
                  <td className={`py-4 text-right font-bold ${t.type === "Receita" ? "text-secondary" : "text-error"}`}>
                    {t.type === "Receita" ? "+" : "-"} R$ {t.amount.toFixed(2)}
                  </td>
                  <td className="py-4 text-right">
                    <button onClick={() => deleteExpense(t.id)} className="text-on-surface-variant hover:text-error transition-colors">
                      <Trash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs opacity-40">
                    Nenhuma transação lançada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
