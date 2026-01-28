import { useState, useMemo, useEffect } from "react";
import { Expense, ExpenseFilters as FilterType, ExpenseCreate } from "@/types/expense";
import {
  useExpenses,
  useCreateExpense,
  useUpdateExpense,
  useDeleteExpense,
  useCategorySummary,
  useMonthlySummary,
} from "@/hooks/useExpenses";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { ExpenseFilters } from "@/components/expenses/ExpenseFilters";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { StatsCards } from "@/components/expenses/StatsCards";
import { CategoryChart } from "@/components/expenses/CategoryChart";
import { MonthlySummary } from "@/components/expenses/MonthlySummary";
import { DeleteConfirmDialog } from "@/components/expenses/DeleteConfirmDialog";
import { Plus, Wallet } from "lucide-react";

const Index = () => {
  const [filters, setFilters] = useState<FilterType>({
    search: "",
    category: "all",
    dateFrom: "",
    dateTo: "",
    sortBy: "date_desc",
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);

  const { data: expenses, isLoading, error } = useExpenses();
  const { data: categorySummary, isLoading: categoryLoading, error: categoryError } = useCategorySummary();
  const { data: monthlySummary, isLoading: monthlyLoading, error: monthlyError } = useMonthlySummary();

  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();
  const deleteExpense = useDeleteExpense();

  // Reset form when closing
  useEffect(() => {
    if (!formOpen) {
      setEditingExpense(null);
    }
  }, [formOpen]);

  // Filter and sort expenses
  const filteredExpenses = useMemo(() => {
    if (!expenses) return [];

    let result = [...expenses];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(searchLower) ||
          e.description?.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (filters.category !== "all") {
      result = result.filter((e) => e.category === filters.category);
    }

    // Date range filter
    if (filters.dateFrom) {
      result = result.filter((e) => e.date >= filters.dateFrom);
    }
    if (filters.dateTo) {
      result = result.filter((e) => e.date <= filters.dateTo);
    }

    // Sort
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case "date_desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "date_asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "amount_desc":
          return b.amount - a.amount;
        case "amount_asc":
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    return result;
  }, [expenses, filters]);

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setFormOpen(true);
  };

  const handleDelete = (expense: Expense) => {
    setDeletingExpense(expense);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = (data: ExpenseCreate) => {
    if (editingExpense) {
      updateExpense.mutate(
        { id: editingExpense.id, expense: data },
        {
          onSuccess: () => setFormOpen(false),
        }
      );
    } else {
      createExpense.mutate(data, {
        onSuccess: () => setFormOpen(false),
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingExpense) {
      deleteExpense.mutate(deletingExpense.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setDeletingExpense(null);
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Wallet className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">SpendWise</h1>
                <p className="text-sm text-muted-foreground">
                  Track your expenses with ease
                </p>
              </div>
            </div>
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="expenses" className="space-y-6">
          <TabsList>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="expenses" className="space-y-6">
            {/* Stats */}
            <StatsCards expenses={expenses} isLoading={isLoading} />

            {/* Filters */}
            <ExpenseFilters filters={filters} onFiltersChange={setFilters} />

            {/* Results count */}
            {expenses && !error && (
              <p className="text-sm text-muted-foreground">
                Showing {filteredExpenses.length} of {expenses.length} expenses
              </p>
            )}

            {/* Expense List */}
            <ExpenseList
              expenses={filteredExpenses}
              isLoading={isLoading}
              error={error}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <CategoryChart
                data={categorySummary}
                isLoading={categoryLoading}
                error={categoryError}
              />
              <MonthlySummary
                data={monthlySummary}
                isLoading={monthlyLoading}
                error={monthlyError}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Expense Form Dialog */}
      <ExpenseForm
        open={formOpen}
        onOpenChange={setFormOpen}
        expense={editingExpense}
        onSubmit={handleFormSubmit}
        isLoading={createExpense.isPending || updateExpense.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        expense={deletingExpense}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteExpense.isPending}
      />
    </div>
  );
};

export default Index;
