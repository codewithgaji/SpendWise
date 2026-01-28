import { Expense } from "@/types/expense";
import { ExpenseCard } from "./ExpenseCard";
import { AlertCircle, Inbox } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ExpenseListProps {
  expenses: Expense[];
  isLoading: boolean;
  error: Error | null;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export function ExpenseList({
  expenses,
  isLoading,
  error,
  onEdit,
  onDelete,
}: ExpenseListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-48 rounded-lg border bg-card animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Backend Connection Error</AlertTitle>
        <AlertDescription className="mt-2 space-y-2">
          <p>{error.message}</p>
          <div className="mt-4 p-4 bg-destructive/10 rounded-md text-sm">
            <p className="font-semibold mb-2">To fix this:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Make sure your FastAPI backend is running</li>
              <li>Run: <code className="bg-background px-1 py-0.5 rounded">uvicorn main:app --reload</code></li>
              <li>Verify it's running on <code className="bg-background px-1 py-0.5 rounded">http://localhost:8000</code></li>
              <li>Check CORS is configured for this frontend</li>
            </ol>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <Inbox className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold">No expenses found</h3>
        <p className="text-muted-foreground mt-1">
          Add your first expense to get started tracking your spending.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {expenses.map((expense) => (
        <ExpenseCard
          key={expense.id}
          expense={expense}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
