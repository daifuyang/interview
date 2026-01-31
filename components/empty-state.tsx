"use client";

import { SearchX, Heart, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  type: "search" | "favorites" | "empty";
  onClearFilters?: () => void;
}

export function EmptyState({ type, onClearFilters }: EmptyStateProps) {
  const configs = {
    search: {
      icon: SearchX,
      title: "没有找到相关题目",
      description: "尝试使用其他关键词或调整筛选条件",
    },
    favorites: {
      icon: Heart,
      title: "还没有收藏题目",
      description: "点击题目卡片上的心形图标收藏感兴趣的题目",
    },
    empty: {
      icon: FileQuestion,
      title: "暂无题目",
      description: "题库为空，请添加一些面试题",
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted mb-4">
        <Icon className="size-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{config.title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">
        {config.description}
      </p>
      {onClearFilters && type === "search" && (
        <Button variant="outline" onClick={onClearFilters}>
          清除筛选条件
        </Button>
      )}
    </div>
  );
}
