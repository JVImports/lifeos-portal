import React, { createContext, useContext, useState, useEffect } from "react";

export interface Task {
  id: number;
  title: string;
  status: "A Fazer" | "Em Andamento" | "Concluído";
  priority: "Baixa" | "Média" | "Alta";
}

export interface Habit {
  id: number;
  name: string;
  completed: boolean;
  streak: number;
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  type: "Receita" | "Despesa";
  date: string;
}

interface LifeOSContextType {
  tasks: Task[];
  habits: Habit[];
  expenses: Expense[];
  xp: number;
  level: number;
  addTask: (title: string, priority: "Baixa" | "Média" | "Alta") => void;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
  toggleHabit: (id: number) => void;
  addHabit: (name: string) => void;
  addExpense: (description: string, amount: number, type: "Receita" | "Despesa") => void;
  gainXp: (amount: number) => void;
  connectOpenFinance: (bank: string) => void;
}

const LifeOSContext = createContext<LifeOSContextType | undefined>(undefined);

export function LifeOSProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [xp, setXp] = useState(120);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    setTasks([
      { id: 1, title: "Finalizar Apresentação Q4", status: "Em Andamento", priority: "Alta" },
      { id: 2, title: "Revisão de Metas LifeOS", status: "A Fazer", priority: "Média" },
    ]);
    setHabits([
      { id: 1, name: "Meditação 20min", completed: true, streak: 14 },
      { id: 2, name: "Leitura 15 páginas", completed: false, streak: 5 },
    ]);
    setExpenses([
      { id: 1, description: "Salário LifeOS", amount: 5000.00, category: "Salário", type: "Receita", date: "2026-06-18" },
      { id: 2, description: "Gasolina Carro", amount: 120.00, category: "Transporte", type: "Despesa", date: "2026-06-19" },
    ]);
  }, []);

  const gainXp = (amount: number) => {
    setXp((prevXp) => {
      const newXp = prevXp + amount;
      const neededForNextLevel = level * 200;
      if (newXp >= neededForNextLevel) {
        setLevel((prev) => prev + 1);
        return newXp - neededForNextLevel;
      }
      return newXp;
    });
  };

  const addTask = (title: string, priority: "Baixa" | "Média" | "Alta") => {
    setTasks((prev) => [...prev, { id: Date.now(), title, status: "A Fazer", priority }]);
    gainXp(20);
  };

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const newStatus = t.status === "Concluído" ? "A Fazer" : "Concluído";
          if (newStatus === "Concluído") gainXp(50);
          return { ...t, status: newStatus };
        }
        return t;
      })
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleHabit = (id: number) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const completed = !h.completed;
          const streak = completed ? h.streak + 1 : Math.max(0, h.streak - 1);
          if (completed) gainXp(30);
          return { ...h, completed, streak };
        }
        return h;
      })
    );
  };

  const addHabit = (name: string) => {
    setHabits((prev) => [...prev, { id: Date.now(), name, completed: false, streak: 0 }]);
    gainXp(15);
  };

  const addExpense = (description: string, amount: number, type: "Receita" | "Despesa") => {
    setExpenses((prev) => [
      { id: Date.now(), description, amount, category: "Outros", type, date: new Date().toISOString().split("T")[0] },
      ...prev,
    ]);
    gainXp(10);
  };

  const connectOpenFinance = (bank: string) => {
    setExpenses((prev) => [
      { id: Date.now() + 1, description: `${bank}: Saldo Recebido`, amount: 1500.00, category: "Outros", type: "Receita", date: new Date().toISOString().split("T")[0] },
      { id: Date.now() + 2, description: `${bank}: Restaurante`, amount: 45.90, category: "Alimentação", type: "Despesa", date: new Date().toISOString().split("T")[0] },
      ...prev,
    ]);
    gainXp(50);
  };

  return (
    <LifeOSContext.Provider
      value={{
        tasks,
        habits,
        expenses,
        xp,
        level,
        addTask,
        toggleTask,
        deleteTask,
        toggleHabit,
        addHabit,
        addExpense,
        gainXp,
        connectOpenFinance,
      }}
    >
      {children}
    </LifeOSContext.Provider>
  );
}

export function useLifeOS() {
  const context = useContext(LifeOSContext);
  if (!context) throw new Error("useLifeOS must be used within a LifeOSProvider");
  return context;
}
