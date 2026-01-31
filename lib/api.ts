import { Category, Difficulty } from "./generated/prisma/client";

export type { Category, Difficulty };

export interface Question {
  id: string;
  title: string;
  content: string;
  answer: string;
  category: Category;
  difficulty: Difficulty;
  tags: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function fetchQuestions(params?: {
  category?: Category | "all";
  difficulty?: Difficulty | "all";
  search?: string;
  favoritesOnly?: boolean;
}): Promise<Question[]> {
  const searchParams = new URLSearchParams();
  
  if (params?.category && params.category !== "all") {
    searchParams.set("category", params.category);
  }
  if (params?.difficulty && params.difficulty !== "all") {
    searchParams.set("difficulty", params.difficulty);
  }
  if (params?.search) {
    searchParams.set("search", params.search);
  }
  if (params?.favoritesOnly) {
    searchParams.set("favoritesOnly", "true");
  }

  const response = await fetch(`/api/questions?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch questions");
  }
  return response.json();
}

export async function fetchQuestion(id: string): Promise<Question> {
  const response = await fetch(`/api/questions/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch question");
  }
  return response.json();
}

export async function toggleFavorite(id: string, isFavorite: boolean): Promise<Question> {
  const response = await fetch(`/api/questions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isFavorite }),
  });
  if (!response.ok) {
    throw new Error("Failed to toggle favorite");
  }
  return response.json();
}

export async function createQuestion(data: {
  title: string;
  content: string;
  answer: string;
  category: Category;
  difficulty: Difficulty;
  tags: string[];
}): Promise<Question> {
  const response = await fetch("/api/questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create question");
  }
  return response.json();
}

export async function deleteQuestion(id: string): Promise<void> {
  const response = await fetch(`/api/questions/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete question");
  }
}

export const categoryLabels: Record<Category | "all", string> = {
  all: "全部",
  javascript: "JavaScript",
  typescript: "TypeScript",
  react: "React",
  vue: "Vue",
  css: "CSS",
  html: "HTML",
  browser: "浏览器",
  performance: "性能优化",
  engineering: "工程化",
  algorithm: "算法",
  network: "网络",
  data_structure: "数据结构",
};

export const difficultyLabels: Record<Difficulty, string> = {
  easy: "简单",
  medium: "中等",
  hard: "困难",
};

export const difficultyColors: Record<Difficulty, string> = {
  easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  hard: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

export function getCategories(): Category[] {
  return [
    "javascript",
    "typescript",
    "react",
    "vue",
    "css",
    "html",
    "browser",
    "performance",
    "engineering",
    "algorithm",
    "network",
    "data_structure",
  ];
}

export function getDifficulties(): Difficulty[] {
  return ["easy", "medium", "hard"];
}
