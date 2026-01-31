"use client";

import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/header";
import { CategoryNav } from "@/components/category-nav";
import { SearchFilter } from "@/components/search-filter";
import { QuestionCard } from "@/components/question-card";
import { EmptyState } from "@/components/empty-state";
import { QuestionDetailDrawer } from "@/components/question-detail-drawer";
import {
  Question,
  Category,
  Difficulty,
  fetchQuestions,
  toggleFavorite,
  getCategories,
} from "@/lib/api";

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">(
    "all",
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    Difficulty | "all"
  >("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, [selectedCategory, selectedDifficulty, searchQuery, favoritesOnly]);

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

  const categories = useMemo(() => getCategories(), []);

  const getCategoryCount = (category: Category | "all"): number => {
    if (category === "all") {
      return questions.length;
    }
    return questions.filter((q) => q.category === category).length;
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
      <Header />

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
                  onToggleFavorite={handleToggleFavorite}
                  onPreview={handlePreview}
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
    </div>
  );
}
