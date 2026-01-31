"use client";

import { Heart, Tag, Eye, ExternalLink, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Question,
  categoryLabels,
  difficultyLabels,
  difficultyColors,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface QuestionCardProps {
  question: Question;
  onToggleFavorite: (id: string) => void;
  onPreview: (question: Question) => void;
}

export function QuestionCard({
  question,
  onToggleFavorite,
  onPreview,
}: QuestionCardProps) {
  const formattedDate = new Date(question.createdAt).toLocaleDateString("zh-CN");

  return (
    <Card className="group transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs font-medium">
                {categoryLabels[question.category]}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs font-medium",
                  difficultyColors[question.difficulty]
                )}
              >
                {difficultyLabels[question.difficulty]}
              </Badge>
            </div>
            <CardTitle className="text-base sm:text-lg font-semibold leading-snug">
              {question.title}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onToggleFavorite(question.id)}
            className={cn(
              "shrink-0 transition-colors",
              question.isFavorite
                ? "text-rose-500 hover:text-rose-600"
                : "text-muted-foreground hover:text-rose-500"
            )}
          >
            <Heart
              className={cn(
                "size-4 sm:size-5 transition-all",
                question.isFavorite && "fill-current scale-110"
              )}
            />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">
          {question.content}
        </p>

        {question.tags && (
          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            <Tag className="size-3.5 text-muted-foreground" />
            {question.tags.split(",").filter(Boolean).map((tag) => (
              <span
                key={tag}
                className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="size-3" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPreview(question)}
              className="h-8 px-2.5 text-xs"
            >
              <Eye className="size-3.5 mr-1" />
              预览
            </Button>
            <Button
              variant="default"
              size="sm"
              asChild
              className="h-8 px-2.5 text-xs"
            >
              <Link href={`/question/${question.id}`}>
                <ExternalLink className="size-3.5 mr-1" />
                详情
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
