import { Difficulty as PrismaDifficulty } from "./generated/prisma/client";

export type Difficulty = PrismaDifficulty;

export interface Category {
  id: string;
  name: string;
  label: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  answer: string;
  categoryId: string;
  category: Category;
  difficulty: Difficulty;
  tags: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  id: string;
  username: string;
}

// 分类 API
export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch("/api/categories");
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
}

export async function createCategory(
  data: { name: string; label: string; sortOrder?: number },
  token: string
): Promise<Category> {
  const response = await fetch("/api/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create category");
  }
  return response.json();
}

export async function updateCategory(
  id: string,
  data: { name?: string; label?: string; sortOrder?: number },
  token: string
): Promise<Category> {
  const response = await fetch(`/api/categories/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update category");
  }
  return response.json();
}

export async function deleteCategory(id: string, token: string): Promise<void> {
  const response = await fetch(`/api/categories/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete category");
  }
}

// 题目 API
export async function fetchQuestions(params?: {
  category?: string | "all";
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

export async function createQuestion(
  data: {
    title: string;
    content: string;
    answer: string;
    categoryId: string;
    difficulty: Difficulty;
    tags: string[];
  },
  token: string
): Promise<Question> {
  const response = await fetch("/api/questions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create question");
  }
  return response.json();
}

export async function updateQuestion(
  id: string,
  data: {
    title?: string;
    content?: string;
    answer?: string;
    categoryId?: string;
    difficulty?: Difficulty;
    tags?: string[];
    isFavorite?: boolean;
  },
  token?: string
): Promise<Question> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`/api/questions/${id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update question");
  }
  return response.json();
}

export async function deleteQuestion(id: string, token: string): Promise<void> {
  const response = await fetch(`/api/questions/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete question");
  }
}

export async function toggleFavorite(
  id: string,
  isFavorite: boolean
): Promise<Question> {
  return updateQuestion(id, { isFavorite });
}

// 管理员认证 API
export async function loginAdmin(
  username: string,
  password: string
): Promise<{ token: string; admin: Admin }> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "登录失败");
  }
  return response.json();
}

export async function verifyAdminToken(token: string): Promise<Admin> {
  const response = await fetch("/api/auth/verify", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Token invalid");
  }
  const data = await response.json();
  return data.admin;
}

// 本地存储
export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("adminToken");
}

export function setAdminToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("adminToken", token);
}

export function removeAdminToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("adminToken");
}

// 标签映射
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

// 分类标签映射（与数据库同步）
export const categoryLabels: Record<string, string> = {
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

export function getDifficulties(): Difficulty[] {
  return ["easy", "medium", "hard"];
}
