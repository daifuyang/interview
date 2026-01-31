"use client";

import { X, Heart, Tag, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Question,
  categoryLabels,
  difficultyLabels,
  difficultyColors,
} from "@/lib/data";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface QuestionDetailDrawerProps {
  question: Question | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
}

export function QuestionDetailDrawer({
  question,
  isOpen,
  onClose,
  onToggleFavorite,
}: QuestionDetailDrawerProps) {
  if (!question) return null;

  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction="right">
      <DrawerContent className="data-[vaul-drawer-direction=right]:sm:max-w-3xl">
        <DrawerHeader className="border-b pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {categoryLabels[question.category]}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn("text-xs", difficultyColors[question.difficulty])}
                >
                  {difficultyLabels[question.difficulty]}
                </Badge>
              </div>
              <DrawerTitle className="text-left text-base sm:text-lg leading-snug">
                {question.title}
              </DrawerTitle>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onToggleFavorite(question.id)}
                className={cn(
                  "shrink-0",
                  question.isFavorite
                    ? "text-rose-500 hover:text-rose-600"
                    : "text-muted-foreground hover:text-rose-500"
                )}
              >
                <Heart
                  className={cn(
                    "size-4 transition-all",
                    question.isFavorite && "fill-current scale-110"
                  )}
                />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={onClose}>
                <X className="size-4" />
              </Button>
            </div>
          </div>
        </DrawerHeader>

        <div className="px-4 py-4 overflow-y-auto flex-1">
          <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
            <h4 className="text-sm font-semibold mb-2">题目描述</h4>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {question.content}
            </p>
          </div>

          {question.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b">
              <Tag className="size-3.5 text-muted-foreground" />
              {question.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <span className="w-0.5 h-4 bg-primary rounded-full"></span>
              参考答案
            </h4>
            <div
              className="text-sm leading-relaxed space-y-3"
              dangerouslySetInnerHTML={{
                __html: formatAnswer(question.answer),
              }}
            />
          </div>

          <div className="mt-6 pt-4 border-t flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="size-3" />
              <span>{question.createdAt}</span>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/question/${question.id}`} onClick={onClose}>
                <ExternalLink className="size-3.5 mr-1.5" />
                新页面打开
              </Link>
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function formatAnswer(answer: string): string {
  return answer
    .replace(/## (.*)/g, '<h3 class="text-sm font-semibold mt-4 mb-2">$1</h3>')
    .replace(/### (.*)/g, '<h4 class="text-xs font-medium mt-3 mb-1.5">$1</h4>')
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-xs font-mono">$1</code>')
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-muted p-3 rounded-lg overflow-x-auto my-3"><code class="text-xs font-mono block">$2</code></pre>')
    .replace(/\n/g, "<br />");
}
