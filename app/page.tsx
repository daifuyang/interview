"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { CategoryNav } from "@/components/category-nav";
import { SearchFilter } from "@/components/search-filter";
import { QuestionCard } from "@/components/question-card";
import { EmptyState } from "@/components/empty-state";
import { QuestionDetailDrawer } from "@/components/question-detail-drawer";
import { LoginModal } from "@/components/login-modal";
import { QuestionFormModal } from "@/components/question-form-modal";
import { CategoryManageModal } from "@/components/category-manage-modal";
import {
  Question,
  Category,
  Difficulty,
  Admin,
  fetchQuestions,
  fetchCategories,
  toggleFavorite,
  deleteQuestion,
  getAdminToken,
  verifyAdminToken,
} from "@/lib/api";

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [adminToken, setAdminToken] = useState<string>("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "all">("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isQuestionFormOpen, setIsQuestionFormOpen] = useState(false);
  const [isCategoryManageOpen, setIsCategoryManageOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // 检查登录状态
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAdminToken();
      if (token) {
        try {
          const adminData = await verifyAdminToken(token);
          setAdmin(adminData);
          setAdminToken(token);
        } catch {
          // token 无效，忽略
        }
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [selectedCategory, selectedDifficulty, searchQuery, favoritesOnly]);

  async function loadCategories() {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  }

  async function loadQuestions() {
    try {
      setIsLoading(true);
      const data = await fetchQuestions({
        category: selectedCategory,
        difficulty: selectedDifficulty,
        search: searchQuery,
        favoritesOnly,
      });
      setQuestions(data);
    } catch (error) {
      console.error("Failed to load questions:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleLogin = (adminData: Admin, token: string) => {
    setAdmin(adminData);
    setAdminToken(token);
  };

  const handleLogout = () => {
    setAdmin(null);
    setAdminToken("");
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setIsQuestionFormOpen(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setIsQuestionFormOpen(true);
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm("确定要删除这道题吗？")) return;
    try {
      await deleteQuestion(id, adminToken);
      loadQuestions();
    } catch (error) {
      console.error("Failed to delete question:", error);
      alert("删除失败");
    }
  };

  const getCategoryCount = (categoryName: string): number => {
    if (categoryName === "all") {
      return questions.length;
    }
    return questions.filter((q) => q.category.name === categoryName).length;
  };

  const handleToggleFavorite = async (id: string) => {
    const question = questions.find((q) => q.id === id);
    if (!question) return;

    try {
      await toggleFavorite(id, !question.isFavorite);
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === id ? { ...q, isFavorite: !q.isFavorite } : q
        )
      );
      if (previewQuestion && previewQuestion.id === id) {
        setPreviewQuestion((prev) =>
          prev ? { ...prev, isFavorite: !prev.isFavorite } : null
        );
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const handlePreview = (question: Question) => {
    setPreviewQuestion(question);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setPreviewQuestion(null), 300);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedDifficulty("all");
    setFavoritesOnly(false);
  };

  const getEmptyStateType = (): "search" | "favorites" | "empty" => {
    if (questions.length === 0) return "empty";
    if (favoritesOnly) return "favorites";
    return "search";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        admin={admin}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onAddQuestion={handleAddQuestion}
        onManageCategories={() => setIsCategoryManageOpen(true)}
      />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              前端面试题库
            </h2>
            <p className="text-muted-foreground">
              收集整理的重要面试题，帮助你更好地准备面试
            </p>
          </div>

          <div className="mb-6">
            <CategoryNav
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              getCategoryCount={getCategoryCount}
            />
          </div>

          <div className="mb-6">
            <SearchFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedDifficulty={selectedDifficulty}
              onDifficultyChange={setSelectedDifficulty}
              favoritesOnly={favoritesOnly}
              onFavoritesOnlyChange={setFavoritesOnly}
              resultCount={questions.length}
              categories={categories}
            />
          </div>

          {isLoading ? (
            <div className="grid gap-4 sm:gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-40 bg-muted rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : questions.length > 0 ? (
            <div className="grid gap-4 sm:gap-6">
              {questions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  isAdmin={!!admin}
                  onToggleFavorite={handleToggleFavorite}
                  onPreview={handlePreview}
                  onEdit={handleEditQuestion}
                  onDelete={handleDeleteQuestion}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              type={getEmptyStateType()}
              onClearFilters={clearFilters}
            />
          )}
        </div>
      </main>

      <footer className="border-t mt-12 py-6">
        <div className="container px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            前端面试题库 · 持续更新中
          </p>
        </div>
      </footer>

      <QuestionDetailDrawer
        question={previewQuestion}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onToggleFavorite={handleToggleFavorite}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={(adminData) => {
          const token = getAdminToken() || "";
          handleLogin(adminData, token);
        }}
      />

      {admin && (
        <>
          <QuestionFormModal
            isOpen={isQuestionFormOpen}
            onClose={() => setIsQuestionFormOpen(false)}
            question={editingQuestion}
            categories={categories}
            token={adminToken}
            onSuccess={loadQuestions}
          />

          <CategoryManageModal
            isOpen={isCategoryManageOpen}
            onClose={() => setIsCategoryManageOpen(false)}
            categories={categories}
            token={adminToken}
            onSuccess={loadCategories}
          />
        </>
      )}
    </div>
  );
}
