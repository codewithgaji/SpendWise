export type Category = 
  | "Food" 
  | "Transport" 
  | "Shopping" 
  | "Bills" 
  | "Entertainment" 
  | "Health" 
  | "Other";

export type PaymentMethod = "Cash" | "Card" | "Online";

export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: Category;
  date: string;
  description?: string;
  payment_method: PaymentMethod;
  created_at: string;
  updated_at: string;
}

export interface ExpenseCreate {
  title: string;
  amount: number;
  category: Category;
  date: string;
  description?: string;
  payment_method: PaymentMethod;
}

export interface ExpenseUpdate {
  title?: string;
  amount?: number;
  category?: Category;
  date?: string;
  description?: string;
  payment_method?: PaymentMethod;
}

export interface ExpenseFilters {
  search: string;
  category: Category | "all";
  dateFrom: string;
  dateTo: string;
  sortBy: "date_desc" | "date_asc" | "amount_desc" | "amount_asc";
}

export interface CategorySummary {
  category: Category;
  total: number;
  count: number;
}

export interface MonthlySummary {
  month: string;
  total: number;
  count: number;
}

export const CATEGORIES: Category[] = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Other"
];

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "Cash", label: "Cash" },
  { value: "Card", label: "Card" },
  { value: "Online", label: "Online" }
];

export const CATEGORY_COLORS: Record<Category, string> = {
  Food: "hsl(25, 95%, 53%)",
  Transport: "hsl(217, 91%, 60%)",
  Shopping: "hsl(280, 87%, 60%)",
  Bills: "hsl(142, 71%, 45%)",
  Entertainment: "hsl(330, 81%, 60%)",
  Health: "hsl(173, 80%, 40%)",
  Other: "hsl(220, 14%, 50%)"
};

export const CATEGORY_BG_CLASSES: Record<Category, string> = {
  Food: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  Transport: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Shopping: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Bills: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Entertainment: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  Health: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  Other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
};
