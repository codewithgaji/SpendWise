import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { expenseApi } from "@/lib/api";
import { ExpenseCreate, ExpenseUpdate } from "@/types/expense";
import { useToast } from "@/hooks/use-toast";

export function useExpenses() {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: expenseApi.getAll,
    retry: 1,
    staleTime: 30000,
  });
}

export function useExpense(id: number) {
  return useQuery({
    queryKey: ["expenses", id],
    queryFn: () => expenseApi.getById(id),
    enabled: !!id,
    retry: 1,
  });
}

export function useCategorySummary() {
  return useQuery({
    queryKey: ["expenses", "summary", "category"],
    queryFn: expenseApi.getCategorySummary,
    retry: 1,
  });
}

export function useMonthlySummary() {
  return useQuery({
    queryKey: ["expenses", "summary", "monthly"],
    queryFn: expenseApi.getMonthlySummary,
    retry: 1,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (expense: ExpenseCreate) => expenseApi.create(expense),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast({
        title: "Expense created",
        description: "Your expense has been added successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create expense",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, expense }: { id: number; expense: ExpenseUpdate }) =>
      expenseApi.update(id, expense),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast({
        title: "Expense updated",
        description: "Your expense has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update expense",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => expenseApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast({
        title: "Expense deleted",
        description: "Your expense has been removed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete expense",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
