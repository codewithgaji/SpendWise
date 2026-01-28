import { Expense, Category, CATEGORY_COLORS } from "@/types/expense";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Receipt, TrendingUp, Calendar } from "lucide-react";
import { useMemo } from "react";

interface StatsCardsProps {
  expenses: Expense[] | undefined;
  isLoading: boolean;
}

export function StatsCards({ expenses, isLoading }: StatsCardsProps) {
  const stats = useMemo(() => {
    if (!expenses || expenses.length === 0) {
      return {
        total: 0,
        count: 0,
        avgPerExpense: 0,
        thisMonth: 0,
        topCategory: null as Category | null,
      };
    }

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const count = expenses.length;
    const avgPerExpense = total / count;

    // This month's spending
    const now = new Date();
    const thisMonth = expenses
      .filter((e) => {
        const date = new Date(e.date);
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, e) => sum + e.amount, 0);

    // Top category
    const categoryTotals = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<Category, number>);

    const topCategory = Object.entries(categoryTotals).sort(
      ([, a], [, b]) => b - a
    )[0]?.[0] as Category | null;

    return { total, count, avgPerExpense, thisMonth, topCategory };
  }, [expenses]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-32 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.total)}</div>
          <p className="text-xs text-muted-foreground">
            Across all expenses
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <Receipt className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.count}</div>
          <p className="text-xs text-muted-foreground">
            {stats.avgPerExpense > 0
              ? `Avg ${formatCurrency(stats.avgPerExpense)} per expense`
              : "No expenses yet"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(stats.thisMonth)}
          </div>
          <p className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Category</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.topCategory || "—"}
          </div>
          {stats.topCategory && (
            <div
              className="h-1 w-full rounded-full mt-2"
              style={{ backgroundColor: CATEGORY_COLORS[stats.topCategory] }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
