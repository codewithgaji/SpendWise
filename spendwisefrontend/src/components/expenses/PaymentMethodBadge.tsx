import { PaymentMethod } from "@/types/expense";
import { CreditCard, Banknote, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentMethodBadgeProps {
  method: PaymentMethod;
  className?: string;
}

const methodConfig: Record<PaymentMethod, { icon: typeof CreditCard; label: string; className: string }> = {
  Cash: {
    icon: Banknote,
    label: "Cash",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  },
  Card: {
    icon: CreditCard,
    label: "Card",
    className: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  },
  Online: {
    icon: Globe,
    label: "Online",
    className: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  },
};

export function PaymentMethodBadge({ method, className }: PaymentMethodBadgeProps) {
  const config = methodConfig[method];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}
