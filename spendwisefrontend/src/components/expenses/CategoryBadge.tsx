import { Category, CATEGORY_BG_CLASSES } from "@/types/expense";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: Category;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        CATEGORY_BG_CLASSES[category],
        className
      )}
    >
      {category}
    </span>
  );
}
