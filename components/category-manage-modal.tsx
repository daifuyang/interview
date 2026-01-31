"use client";

import { useState } from "react";
import { Plus, Trash2, X, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Category,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/api";
import { toast } from "sonner";

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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newLabel) {
      toast.error("请填写分类标识和显示名称");
      return;
    }

    setIsLoading(true);

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
      toast.success("分类添加成功");
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "添加失败");
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
      toast.success("分类更新成功");
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "更新失败");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteCategory(id, token);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      toast.success("分类删除成功");
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "删除失败");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) {
      toast.error("请先选择要删除的分类");
      return;
    }

    toast.promise(
      Promise.all(Array.from(selectedIds).map((id) => deleteCategory(id, token))),
      {
        loading: `正在删除 ${selectedIds.size} 个分类...`,
        success: () => {
          setSelectedIds(new Set());
          onSuccess();
          return `成功删除 ${selectedIds.size} 个分类`;
        },
        error: (err) => err instanceof Error ? err.message : "批量删除失败",
      }
    );
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === categories.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(categories.map((c) => c.id)));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>管理分类</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4 flex-1 overflow-hidden flex flex-col">
          {/* 添加新分类表单 */}
          <form onSubmit={handleAdd} className="space-y-3 shrink-0">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">分类标识</Label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="如：javascript"
                  className="h-9"
                />
              </div>
              <div>
                <Label className="text-xs">显示名称</Label>
                <Input
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="如：JavaScript"
                  className="h-9"
                />
              </div>
            </div>
            <Button
              type="submit"
              size="sm"
              className="w-full"
              disabled={isLoading}
            >
              <Plus className="size-4 mr-1.5" />
              添加分类
            </Button>
          </form>

          {/* 批量操作栏 */}
          {categories.length > 0 && (
            <div className="flex items-center justify-between py-2 border-y shrink-0">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={
                    selectedIds.size === categories.length && categories.length > 0
                  }
                  onCheckedChange={toggleSelectAll}
                />
                <span className="text-sm text-muted-foreground">
                  已选择 {selectedIds.size} 个
                </span>
              </div>
              {selectedIds.size > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBatchDelete}
                  disabled={isLoading}
                >
                  <Trash2 className="size-4 mr-1.5" />
                  批量删除
                </Button>
              )}
            </div>
          )}

          {/* 分类列表 - 可滚动 */}
          <ScrollArea className="flex-1 -mx-6 px-6">
            <div className="space-y-1">
              {categories.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="size-8 mx-auto mb-2 opacity-50" />
                  <p>暂无分类</p>
                </div>
              ) : (
                categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      checked={selectedIds.has(category.id)}
                      onCheckedChange={() => toggleSelect(category.id)}
                    />

                    {editingCategory?.id === category.id ? (
                      <div className="flex-1 flex items-center gap-2">
                        <Input
                          value={editingCategory.label}
                          onChange={(e) =>
                            setEditingCategory({
                              ...editingCategory,
                              label: e.target.value,
                            })
                          }
                          className="h-8 flex-1"
                          autoFocus
                        />
                        <Button
                          size="icon-xs"
                          onClick={() => handleUpdate(editingCategory)}
                          disabled={isLoading}
                        >
                          <Check className="size-4" />
                        </Button>
                        <Button
                          size="icon-xs"
                          variant="ghost"
                          onClick={() => setEditingCategory(null)}
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => setEditingCategory(category)}
                        >
                          <div className="font-medium">{category.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {category.name}
                          </div>
                        </div>
                        <Button
                          size="icon-xs"
                          variant="ghost"
                          className="text-destructive opacity-0 group-hover:opacity-100 hover:opacity-100"
                          onClick={() => handleDelete(category.id)}
                          disabled={isLoading}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
