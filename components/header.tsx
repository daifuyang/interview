"use client";

import { Code2, Github, Moon, Sun, User, LogOut, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Admin, removeAdminToken } from "@/lib/api";

interface HeaderProps {
  admin: Admin | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onAddQuestion: () => void;
  onManageCategories: () => void;
}

export function Header({ admin, onLoginClick, onLogout, onAddQuestion, onManageCategories }: HeaderProps) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLogout = () => {
    removeAdminToken();
    onLogout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Code2 className="size-5" />
          </div>
          <h1 className="text-lg font-semibold tracking-tight hidden sm:block">
            面试题库
          </h1>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {admin && (
            <Button
              variant="default"
              size="sm"
              onClick={onAddQuestion}
              className="hidden sm:flex"
            >
              <Plus className="size-4 mr-1.5" />
              新增题目
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleDarkMode}
            className="text-muted-foreground"
          >
            {isDark ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            asChild
            className="text-muted-foreground"
          >
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="size-4" />
            </a>
          </Button>

          {admin ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="size-3.5 text-primary" />
                  </div>
                  <span className="hidden sm:inline">{admin.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onAddQuestion} className="sm:hidden">
                  <Plus className="size-4 mr-2" />
                  新增题目
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onManageCategories}>
                  <Settings className="size-4 mr-2" />
                  管理分类
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="size-4 mr-2" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" onClick={onLoginClick}>
              <User className="size-4 mr-1.5" />
              登录
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
