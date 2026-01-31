"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Category,
  Difficulty,
  categoryLabels,
  difficultyLabels,
  getCategories,
  getDifficulties,
} from "@/lib/api";

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: Category | "all";
  onCategoryChange: (value: Category | "all") => void;
  selectedDifficulty: Difficulty | "all";
  onDifficultyChange: (value: Difficulty | "all") => void;
  favoritesOnly: boolean;
  onFavoritesOnlyChange: (value: boolean) => void;
  resultCount: number;
}

export function SearchFilter({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedDifficulty,
  onDifficultyChange,
  favoritesOnly,
  onFavoritesOnlyChange,
  resultCount,
}: SearchFilterProps) {
  const categories = getCategories();
  const difficulties = getDifficulties();

  const hasActiveFilters =
    searchQuery || selectedCategory !== "all" || selectedDifficulty !== "all" || favoritesOnly;

  const clearFilters = () => {
    onSearchChange("");
    onCategoryChange("all");
    onDifficultyChange("all");
    onFavoritesOnlyChange(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="搜索题目、内容或标签..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <X className="size-3" />
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Select
            value={selectedCategory}
            onValueChange={(value) => onCategoryChange(value as Category | "all")}
          >
            <SelectTrigger className="w-[130px] sm:w-[140px] h-10">
              <SelectValue placeholder="分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部分类</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {categoryLabels[cat]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedDifficulty}
            onValueChange={(value) =>
              onDifficultyChange(value as Difficulty | "all")
            }
          >
            <SelectTrigger className="w-[100px] sm:w-[110px] h-10">
              <SelectValue placeholder="难度" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部难度</SelectItem>
              {difficulties.map((diff) => (
                <SelectItem key={diff} value={diff}>
                  {difficultyLabels[diff]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant={favoritesOnly ? "default" : "outline"}
            size="sm"
            onClick={() => onFavoritesOnlyChange(!favoritesOnly)}
            className="h-8"
          >
            <SlidersHorizontal className="size-3.5 mr-1.5" />
            仅看收藏
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 text-muted-foreground"
            >
              <X className="size-3.5 mr-1.5" />
              清除筛选
            </Button>
          )}
        </div>

        <span className="text-sm text-muted-foreground">
          共 <strong className="text-foreground">{resultCount}</strong> 道题目
        </span>
      </div>
    </div>
  );
}
