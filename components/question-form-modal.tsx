"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TipTapEditor } from "./tiptap-editor";
import {
  Question,
  Category,
  Difficulty,
  difficultyLabels,
  getDifficulties,
  createQuestion,
  updateQuestion,
} from "@/lib/api";

interface QuestionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question | null;
  categories: Category[];
  token: string;
  onSuccess: () => void;
}

export function QuestionFormModal({
  isOpen,
  onClose,
  question,
  categories,
  token,
  onSuccess,
}: QuestionFormModalProps) {
  const isEditing = !!question;
  const difficulties = getDifficulties();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [answer, setAnswer] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [tags, setTags] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (question) {
      setTitle(question.title);
      setContent(question.content);
      setAnswer(question.answer);
      setCategoryId(question.categoryId);
      setDifficulty(question.difficulty);
      setTags(question.tags);
    } else {
      setTitle("");
      setContent("");
      setAnswer("");
      setCategoryId(categories[0]?.id || "");
      setDifficulty("easy");
      setTags("");
    }
    setError("");
  }, [question, categories, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = {
        title,
        content,
        answer,
        categoryId,
        difficulty,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      };

      if (isEditing) {
        await updateQuestion(question.id, data, token);
      } else {
        await createQuestion(data, token);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "编辑题目" : "新增题目"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4" onKeyDown={(e) => {
          // 阻止回车键自动提交表单（textarea 除外）
          if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
            e.preventDefault();
          }
        }}>
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label>题目标题</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入题目标题"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>分类</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>难度</Label>
              <Select
                value={difficulty}
                onValueChange={(v) => setDifficulty(v as Difficulty)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择难度" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((diff) => (
                    <SelectItem key={diff} value={diff}>
                      {difficultyLabels[diff]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>标签</Label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="多个标签用逗号分隔，如：JavaScript,ES6,闭包"
            />
          </div>

          <div className="space-y-2">
            <Label>题目描述</Label>
            <TipTapEditor
              content={content}
              onChange={setContent}
              placeholder="输入题目描述..."
              className="h-[200px]"
            />
          </div>

          <div className="space-y-2">
            <Label>参考答案</Label>
            <TipTapEditor
              content={answer}
              onChange={setAnswer}
              placeholder="输入参考答案..."
              className="h-[200px]"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "保存中..." : isEditing ? "保存修改" : "创建题目"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
