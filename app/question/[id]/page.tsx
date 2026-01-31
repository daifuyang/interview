"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Heart, Tag, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import {
  difficultyLabels,
  difficultyColors,
  fetchQuestion,
  toggleFavorite,
  Question,
} from "@/lib/api";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function QuestionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [question, setQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQuestion();
  }, [params.id]);

  async function loadQuestion() {
    try {
      setIsLoading(true);
      const data = await fetchQuestion(params.id as string);
      setQuestion(data);
    } catch (error) {
      console.error("Failed to load question:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleToggleFavorite = async () => {
    if (!question) return;
    try {
      await toggleFavorite(question.id, !question.isFavorite);
      setQuestion((prev) =>
        prev ? { ...prev, isFavorite: !prev.isFavorite } : null
      );
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/4"></div>
              <div className="h-12 bg-muted rounded"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto text-center py-16">
            <h1 className="text-2xl font-bold mb-4">题目未找到</h1>
            <p className="text-muted-foreground mb-6">
              该题目可能已被删除或不存在
            </p>
            <Button onClick={() => router.push("/")}>
              <ArrowLeft className="size-4 mr-2" />
              返回首页
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const formattedDate = new Date(question.createdAt).toLocaleDateString("zh-CN");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-3xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="size-4 mr-1.5" />
            返回列表
          </Button>

          <Card className="overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge variant="secondary">
                      {question.category.label}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn(difficultyColors[question.difficulty])}
                    >
                      {difficultyLabels[question.difficulty]}
                    </Badge>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold leading-tight">
                    {question.title}
                  </h1>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleToggleFavorite}
                  className={cn(
                    "shrink-0",
                    question.isFavorite
                      ? "text-rose-500 hover:text-rose-600"
                      : "text-muted-foreground hover:text-rose-500"
                  )}
                >
                  <Heart
                    className={cn(
                      "size-5 sm:size-6 transition-all",
                      question.isFavorite && "fill-current scale-110"
                    )}
                  />
                </Button>
              </div>

              <div className="prose prose-sm dark:prose-invert max-w-none mb-8">
                <h3 className="text-base font-semibold mb-3">题目描述</h3>
                <div
                  className="text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: question.content }}
                />
              </div>

              {question.tags && (
                <div className="flex flex-wrap items-center gap-2 mb-8 pb-6 border-b">
                  <Tag className="size-4 text-muted-foreground" />
                  {question.tags.split(",").filter(Boolean).map((tag) => (
                    <span
                      key={tag}
                      className="text-sm text-muted-foreground bg-muted px-2.5 py-1 rounded-full"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              <div className="prose prose-sm dark:prose-invert max-w-none">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary rounded-full"></span>
                  参考答案
                </h3>
                <div
                  className="text-sm leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: question.answer }}
                />
              </div>

              <div className="mt-8 pt-6 border-t flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="size-3.5" />
                  <span>创建于 {formattedDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
