"use client";

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

export interface Protocol {
  id: string;
  name: string;
  duration: number;
  active: boolean;
  tasks: string[];
  habits: string[];
}

interface OnboardingAnswers {
  name: string;
  focus: string;
  goal: string;
  wakeTime: string;
  sleepTime: string;
  discipline: string;
  tone: string;
  diagnostic?: string;
}

interface LifeOSContextType {
  tasks: Task[];
  habits: Habit[];
  expenses: Expense[];
  xp: number;
  level: number;
  activeProtocol: string | null;
  onboardingAnswers: OnboardingAnswers | null;
  completeOnboarding: (answers: OnboardingAnswers) => void;
  addTask: (title: string, priority: "Baixa" | "Média" | "Alta", status?: Task["status"]) => void;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
  moveTask: (id: number, status: Task["status"]) => void;
  addHabit: (name: string) => void;
  toggleHabit: (id: number) => void;
  deleteHabit: (id: number) => void;
  addExpense: (description: string, amount: number, category: string, type: "Receita" | "Despesa") => void;
  deleteExpense: (id: number) => void;
  activateProtocol: (id: string) => void;
  deactivateProtocol: () => void;
  gainXp: (amount: number) => void;
  connectOpenFinance: (bank: string) => void;
  completeDailyReview: (tomorrowTasks: string[]) => void;
}

const LifeOSContext = createContext<LifeOSContextType | undefined>(undefined);

const STORAGE_KEY = "lifeos:v1";

const XP_REWARDS = {
  onboarding: 100,
  addTask: 20,
  completeTask: 50,
  addHabit: 15,
  completeHabit: 30,
  addExpense: 10,
  activateProtocol: 50,
  connectOpenFinance: 50,
  dailyReview: 80,
};

export function LifeOSProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [xp, setXp] = useState(120);
  const [level, setLevel] = useState(1);
  const [activeProtocol, setActiveProtocol] = useState<string | null>(null);
  const [onboardingAnswers, setOnboardingAnswers] = useState<OnboardingAnswers | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);

  // Initialize and load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.tasks) setTasks(parsed.tasks);
        if (parsed.habits) setHabits(parsed.habits);
        if (parsed.expenses) setExpenses(parsed.expenses);
        if (parsed.xp !== undefined) setXp(parsed.xp);
        if (parsed.level !== undefined) setLevel(parsed.level);
        if (parsed.activeProtocol !== undefined) setActiveProtocol(parsed.activeProtocol);
        if (parsed.onboardingAnswers !== undefined) setOnboardingAnswers(parsed.onboardingAnswers);
      } else {
        // Load default mockup data only on first start
        setTasks([
          { id: 1, title: "Finalizar Apresentação Q4", status: "Em Andamento", priority: "Alta" },
          { id: 2, title: "Revisão de Metas LifeOS", status: "A Fazer", priority: "Média" },
          { id: 3, title: "Ligar para Contabilidade", status: "A Fazer", priority: "Baixa" },
        ]);
        setHabits([
          { id: 1, name: "Meditação 20min", completed: true, streak: 14 },
          { id: 2, name: "Leitura 15 páginas", completed: false, streak: 5 },
          { id: 3, name: "Exercício Físico", completed: false, streak: 0 },
        ]);
        setExpenses([
          { id: 1, description: "Salário LifeOS", amount: 5000.00, category: "Salário", type: "Receita", date: "2026-06-18" },
          { id: 2, description: "Supermercado Semanal", amount: 350.00, category: "Alimentação", type: "Despesa", date: "2026-06-19" },
          { id: 3, description: "Gasolina Carro", amount: 120.00, category: "Transporte", type: "Despesa", date: "2026-06-19" },
        ]);
      }
    } catch (e) {
      console.error("Failed to load LifeOS state from localStorage", e);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  // Save changes to localStorage after hydration
  useEffect(() => {
    if (!hasHydrated) return;
    try {
      const stateToStore = {
        tasks,
        habits,
        expenses,
        xp,
        level,
        activeProtocol,
        onboardingAnswers,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToStore));
    } catch (e) {
      console.error("Failed to save LifeOS state to localStorage", e);
    }
  }, [tasks, habits, expenses, xp, level, activeProtocol, onboardingAnswers, hasHydrated]);

  const gainXp = (amount: number) => {
    setLevel((currentLevel) => {
      let nextLevel = currentLevel;
      setXp((currentXp) => {
        let newXp = currentXp + amount;
        let req = nextLevel * 200;
        while (newXp >= req) {
          newXp -= req;
          nextLevel += 1;
          req = nextLevel * 200;
        }
        return newXp;
      });
      return nextLevel;
    });
  };

  const completeOnboarding = (answers: OnboardingAnswers) => {
    const diagnostic = `Você possui um perfil de execução ${
      answers.discipline === "Alta" ? "Altamente Focado" : "Inconsistente"
    }, com foco principal em ${answers.focus}. A IA definiu que sua melhor estratégia inicial é o ciclo matinal e controle rígido das tarefas de prioridade ${answers.discipline === "Baixa" ? "Alta" : "Média"}.`;
    setOnboardingAnswers({ ...answers, diagnostic });
    gainXp(XP_REWARDS.onboarding);
  };

  const addTask = (title: string, priority: "Baixa" | "Média" | "Alta", status: Task["status"] = "A Fazer") => {
    setTasks((prev) => [
      ...prev,
      { id: Date.now(), title, status, priority },
    ]);
    gainXp(XP_REWARDS.addTask);
  };

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const newStatus = t.status === "Concluído" ? "A Fazer" : "Concluído";
          if (newStatus === "Concluído") gainXp(XP_REWARDS.completeTask);
          return { ...t, status: newStatus };
        }
        return t;
      })
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const moveTask = (id: number, status: Task["status"]) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          if (status === "Concluído" && t.status !== "Concluído") gainXp(XP_REWARDS.completeTask);
          return { ...t, status };
        }
        return t;
      })
    );
  };

  const addHabit = (name: string) => {
    setHabits((prev) => [...prev, { id: Date.now(), name, completed: false, streak: 0 }]);
    gainXp(XP_REWARDS.addHabit);
  };

  const toggleHabit = (id: number) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const completed = !h.completed;
          const streak = completed ? h.streak + 1 : Math.max(0, h.streak - 1);
          if (completed) gainXp(XP_REWARDS.completeHabit);
          return { ...h, completed, streak };
        }
        return h;
      })
    );
  };

  const deleteHabit = (id: number) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const addExpense = (description: string, amount: number, category: string, type: "Receita" | "Despesa") => {
    setExpenses((prev) => [
      { id: Date.now(), description, amount, category, type, date: new Date().toISOString().split("T")[0] },
      ...prev,
    ]);
    gainXp(XP_REWARDS.addExpense);
  };

  const deleteExpense = (id: number) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const activateProtocol = (protocolId: string) => {
    setActiveProtocol(protocolId);
    gainXp(XP_REWARDS.activateProtocol);

    if (protocolId === "foco") {
      addTask("Definir objetivos da Sprint", "Alta", "A Fazer");
      addTask("Reunião de alinhamento individual", "Média", "A Fazer");
      addHabit("Bloquear distrações (1h)");
    } else if (protocolId === "manha") {
      addHabit("Beber 500ml de água");
      addHabit("Alongamento matinal");
    } else if (protocolId === "financeiro") {
      addTask("Anotar gastos da semana no LifeOS", "Alta", "A Fazer");
      addHabit("Zero gastos supérfluos");
    }
  };

  const deactivateProtocol = () => {
    setActiveProtocol(null);
  };

  const connectOpenFinance = (bank: string) => {
    setExpenses((prev) => [
      { id: Date.now() + 1, description: `${bank}: Transferência Recebida`, amount: 1200.00, category: "Outros", type: "Receita", date: new Date().toISOString().split("T")[0] },
      { id: Date.now() + 2, description: `${bank}: Uber Trip`, amount: 32.50, category: "Transporte", type: "Despesa", date: new Date().toISOString().split("T")[0] },
      { id: Date.now() + 3, description: `${bank}: Spotify Premium`, amount: 21.90, category: "Assinaturas", type: "Despesa", date: new Date().toISOString().split("T")[0] },
      ...prev,
    ]);
    gainXp(XP_REWARDS.connectOpenFinance);
  };

  const completeDailyReview = (tomorrowTasks: string[]) => {
    tomorrowTasks.forEach((title) => {
      if (title.trim()) {
        addTask(title, "Média", "A Fazer");
      }
    });

    setHabits((prev) => prev.map((h) => ({ ...h, completed: false })));
    gainXp(XP_REWARDS.dailyReview);
  };

  return (
    <LifeOSContext.Provider
      value={{
        tasks,
        habits,
        expenses,
        xp,
        level,
        activeProtocol,
        onboardingAnswers,
        completeOnboarding,
        addTask,
        toggleTask,
        deleteTask,
        moveTask,
        addHabit,
        toggleHabit,
        deleteHabit,
        addExpense,
        deleteExpense,
        activateProtocol,
        deactivateProtocol,
        gainXp,
        connectOpenFinance,
        completeDailyReview,
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
