import { prisma } from "../lib/prisma";

async function main() {
  const sampleQuestions = [
    {
      title: "JavaScript 中 var、let 和 const 的区别是什么？",
      content: "请详细说明 var、let 和 const 在变量提升、作用域、重复声明等方面的区别。",
      answer: `## 主要区别

### 1. 作用域
- **var**: 函数作用域（function scope）
- **let/const**: 块级作用域（block scope）

### 2. 变量提升
- **var**: 存在变量提升，声明会被提升到作用域顶部，初始化为 undefined
- **let/const**: 存在暂时性死区（TDZ），声明前访问会报错

### 3. 重复声明
- **var**: 允许重复声明
- **let/const**: 不允许在同一作用域重复声明

### 4. 赋值
- **var/let**: 可以重新赋值
- **const**: 声明时必须初始化，且不能重新赋值（但对象/数组的内容可以修改）`,
      category: "javascript" as const,
      difficulty: "easy" as const,
      tags: "ES6,作用域,变量声明",
      isFavorite: true,
    },
    {
      title: "什么是闭包？闭包有什么实际应用场景？",
      content: "解释闭包的概念，并举例说明其在实际开发中的应用。",
      answer: `## 闭包（Closure）

### 定义
闭包是指有权访问另一个函数作用域中的变量的函数。

### 实际应用场景
1. 数据私有化
2. 函数柯里化
3. 事件处理中的数据保持
4. 防抖和节流`,
      category: "javascript" as const,
      difficulty: "medium" as const,
      tags: "闭包,作用域,高级概念",
      isFavorite: true,
    },
    {
      title: "React 中 useEffect 的依赖项数组有什么作用？",
      content: "解释 useEffect 依赖项数组的工作原理，以及常见的使用误区。",
      answer: `## useEffect 依赖项数组

### 基本作用
依赖项数组决定了 effect 何时重新执行：
- **空数组 []**: 只在组件挂载时执行一次
- **有依赖项**: 依赖项变化时执行
- **无数组**: 每次渲染后都执行

### 常见误区
1. 忘记添加依赖项
2. 依赖项过多导致频繁执行
3. 使用对象/数组作为依赖项`,
      category: "react" as const,
      difficulty: "medium" as const,
      tags: "React Hooks,useEffect,副作用",
      isFavorite: false,
    },
    {
      title: "CSS 中 Flexbox 和 Grid 布局的区别是什么？",
      content: "比较 Flexbox 和 Grid 布局的特点，以及各自适用的场景。",
      answer: `## Flexbox vs Grid

### Flexbox（弹性布局）
- 一维布局系统（行或列）
- 适合组件级布局
- 内容驱动

### Grid（网格布局）
- 二维布局系统（行和列同时控制）
- 适合页面级布局
- 容器驱动`,
      category: "css" as const,
      difficulty: "easy" as const,
      tags: "CSS,布局,Flexbox,Grid",
      isFavorite: true,
    },
  ];

  console.log("开始导入示例数据...");

  for (const question of sampleQuestions) {
    await prisma.question.create({
      data: question,
    });
    console.log(`已创建: ${question.title}`);
  }

  console.log("示例数据导入完成！");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
