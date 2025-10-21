import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  participants: string[]; 
  date: string; 
  receiptImage?: string; 
  verified?: boolean;
}

interface ExpensesContextType {
  expenses: Expense[];
  addExpense: (e: Omit<Expense, 'id'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  computeBalances: () => Record<string, number>;
}

const KEY = '@shared_expenses_v1';

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined); 

export const ExpensesProvider = ({ children }: { children: React.ReactNode }) => { //Exporta ExpensesProvider al layout
  const [expenses, setExpenses] = useState<Expense[]>([]); //EStado global de gastos

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) setExpenses(JSON.parse(raw));
      } catch (e) {
        console.warn('Failed to load expenses', e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(KEY, JSON.stringify(expenses));
      } catch (e) {
        console.warn('Failed to save expenses', e);
      }
    })();
  }, [expenses]);

  const addExpense = async (e: Omit<Expense, 'id'>) => {
    const newExp: Expense = { ...e, id: Date.now().toString() };
    setExpenses((s) => [newExp, ...s]);
  };

  const deleteExpense = async (id: string) => { //elimina gasto por id
    setExpenses((s) => s.filter((x) => x.id !== id));
  };

  const clearAll = async () => {
    setExpenses([]);
  };

  const computeBalances = () => {
    const balances: Record<string, number> = {};
    expenses.forEach((exp) => {
      const share = exp.amount / exp.participants.length;
      exp.participants.forEach((p) => {
        if (!balances[p]) balances[p] = 0;
        if (p === exp.paidBy) {
          balances[p] += exp.amount - share;
        } else {
          balances[p] -= share;
        }
      });
    });
    return balances;
  };

  return (
    <ExpensesContext.Provider value={{ expenses, addExpense, deleteExpense, clearAll, computeBalances }}>
      {children}
    </ExpensesContext.Provider>
  );
};

export const useExpenses = () => {
  const ctx = useContext(ExpensesContext);
  if (!ctx) throw new Error('useExpenses must be used inside ExpensesProvider');
  return ctx;
};
