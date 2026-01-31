"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical, X } from "lucide-react";
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
  Category,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/api";

interface CategoryManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  token: string;
  onSuccess: () => void;
}

export function CategoryManageModal({
  isOpen,
  onClose,
  categories,
  token,
  onSuccess,
}: CategoryManageModalProps) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newName, setNewName] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newLabel) return;

    setIsLoading(true);
    setError("");

    try {
      await createCategory(
        {
          name: newName.toLowerCase().replace(/\s+/g, "_"),
          label: newLabel,
          sortOrder: categories.length,
        },
        token
      );
      setNewName("");
      setNewLabel("");
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "添加失败");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (category: Category) => {
    setIsLoading(true);
    try {
      await updateCategory(
        category.id,
        {
          name: category.name,
          label: category.label,
        },
        token
      );
      setEditingCategory(null);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新失败");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这个分类吗？")) return;

    setIsLoading(true);
    try {
      await deleteCategory(id, token);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "删除失败");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>管理分类</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleAdd} className="flex gap-2">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="分类标识（如：javascript）"
              className="flex-1"
            />
            <Input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="显示名称（如：JavaScript）"
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={isLoading}>
              <Plus className="size-4" />
            </Button>
          </form>

          <div className="border rounded-lg divide-y">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center gap-2 p-3 hover:bg-muted/50"
              >
                <GripVertical className="size-4 text-muted-foreground" />

                {editingCategory?.id === category.id ? (
                  <>
                    <Input
                      value={editingCategory.label}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          label: e.target.value,
                        })
                      }
                      className="flex-1 h-8"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleUpdate(editingCategory)}
                    >
                      保存
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingCategory(null)}
                    >
                      <X className="size-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex-1">
                      <div className="font-medium">{category.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {category.name}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingCategory(category)}
                    >
                      编辑
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
