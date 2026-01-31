"use client";

import { cn } from "@/lib/utils";
import { Category } from "@/lib/api";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface CategoryNavProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  getCategoryCount: (category: string) => number;
}

export function CategoryNav({
  categories,
  selectedCategory,
  onCategoryChange,
  getCategoryCount,
}: CategoryNavProps) {
  return (
    <div className="w-full">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-2">
          <button
            onClick={() => onCategoryChange("all")}
            className={cn(
              "inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shrink-0",
              selectedCategory === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            )}
          >
            全部
            <span
              className={cn(
                "ml-2 text-xs px-2 py-0.5 rounded-full",
                selectedCategory === "all"
                  ? "bg-primary-foreground/20"
                  : "bg-background"
              )}
            >
              {getCategoryCount("all")}
            </span>
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.name)}
              className={cn(
                "inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shrink-0",
                selectedCategory === category.name
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              {category.label}
              <span
                className={cn(
                  "ml-2 text-xs px-2 py-0.5 rounded-full",
                  selectedCategory === category.name
                    ? "bg-primary-foreground/20"
                    : "bg-background"
                )}
              >
                {getCategoryCount(category.name)}
              </span>
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
}
