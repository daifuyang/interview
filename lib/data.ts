export type Difficulty = "easy" | "medium" | "hard";
export type Category =
  | "javascript"
  | "typescript"
  | "react"
  | "vue"
  | "css"
  | "html"
  | "browser"
  | "performance"
  | "engineering"
  | "algorithm"
  | "network"
  | "data-structure";

export interface Question {
  id: string;
  title: string;
  content: string;
  answer: string;
  category: Category;
  difficulty: Difficulty;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export const categoryLabels: Record<Category, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  react: "React",
  vue: "Vue",
  css: "CSS",
  html: "HTML",
  browser: "浏览器",
  performance: "性能优化",
  engineering: "工程化",
  algorithm: "算法",
  network: "网络",
  "data-structure": "数据结构",
};

export const difficultyLabels: Record<Difficulty, string> = {
  easy: "简单",
  medium: "中等",
  hard: "困难",
};

export const difficultyColors: Record<Difficulty, string> = {
  easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  hard: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

export const sampleQuestions: Question[] = [
  {
    id: "1",
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
- **const**: 声明时必须初始化，且不能重新赋值（但对象/数组的内容可以修改）

### 代码示例
\`\`\`javascript
// var 示例
console.log(a); // undefined
var a = 1;

// let 示例
console.log(b); // ReferenceError
let b = 2;

// const 示例
const c = 3;
c = 4; // TypeError
\`\`\``,
    category: "javascript",
    difficulty: "easy",
    tags: ["ES6", "作用域", "变量声明"],
    isFavorite: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "2",
    title: "什么是闭包？闭包有什么实际应用场景？",
    content: "解释闭包的概念，并举例说明其在实际开发中的应用。",
    answer: `## 闭包（Closure）

### 定义
闭包是指有权访问另一个函数作用域中的变量的函数。简单来说，当一个函数返回另一个函数，并且返回的函数引用了外部函数的变量时，就形成了闭包。

### 特点
1. 函数嵌套函数
2. 内部函数可以访问外部函数的变量
3. 外部函数的变量不会被垃圾回收机制回收

### 实际应用场景

#### 1. 数据私有化
\`\`\`javascript
function createCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
}
\`\`\`

#### 2. 函数柯里化
\`\`\`javascript
function add(a) {
  return function(b) {
    return a + b;
  };
}
const add5 = add(5);
console.log(add5(3)); // 8
\`\`\`

#### 3. 事件处理中的数据保持
\`\`\`javascript
for (var i = 0; i < buttons.length; i++) {
  (function(index) {
    buttons[index].onclick = function() {
      console.log('Button ' + index + ' clicked');
    };
  })(i);
}
\`\`\`

#### 4. 防抖和节流
\`\`\`javascript
function debounce(fn, delay) {
  let timer = null;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
\`\`\``,
    category: "javascript",
    difficulty: "medium",
    tags: ["闭包", "作用域", "高级概念"],
    isFavorite: true,
    createdAt: "2024-01-16",
    updatedAt: "2024-01-16",
  },
  {
    id: "3",
    title: "React 中 useEffect 的依赖项数组有什么作用？",
    content: "解释 useEffect 依赖项数组的工作原理，以及常见的使用误区。",
    answer: `## useEffect 依赖项数组

### 基本作用
依赖项数组决定了 effect 何时重新执行：
- **空数组 []**: 只在组件挂载时执行一次
- **有依赖项**: 依赖项变化时执行
- **无数组**: 每次渲染后都执行

### 执行时机
\`\`\`javascript
useEffect(() => {
  // 副作用逻辑
  return () => {
    // 清理函数（可选）
  };
}, [dep1, dep2]); // 依赖项数组
\`\`\`

### 常见误区

#### 1. 忘记添加依赖项
\`\`\`javascript
// ❌ 错误
useEffect(() => {
  console.log(count);
}, []); // count 变化时不会重新执行

// ✅ 正确
useEffect(() => {
  console.log(count);
}, [count]);
\`\`\`

#### 2. 依赖项过多导致频繁执行
\`\`\`javascript
// ❌ 可能导致无限循环
useEffect(() => {
  setState(someObject);
}, [someObject]);
\`\`\`

#### 3. 使用对象/数组作为依赖项
\`\`\`javascript
// ❌ 每次渲染都是新对象
useEffect(() => {
  // ...
}, [{ id: 1 }]);

// ✅ 使用原始值或 useMemo
const config = useMemo(() => ({ id: 1 }), []);
useEffect(() => {
  // ...
}, [config]);
\`\`\`

### 最佳实践
1. 始终包含所有在 effect 中使用的响应式值
2. 使用 ESLint 插件检查依赖项
3. 必要时使用 useMemo/useCallback 缓存依赖
4. 将复杂逻辑拆分成多个 useEffect`,
    category: "react",
    difficulty: "medium",
    tags: ["React Hooks", "useEffect", "副作用"],
    isFavorite: false,
    createdAt: "2024-01-17",
    updatedAt: "2024-01-17",
  },
  {
    id: "4",
    title: "CSS 中 Flexbox 和 Grid 布局的区别是什么？",
    content: "比较 Flexbox 和 Grid 布局的特点，以及各自适用的场景。",
    answer: `## Flexbox vs Grid

### Flexbox（弹性布局）

**特点：**
- 一维布局系统（行或列）
- 适合组件级布局
- 内容驱动

**适用场景：**
- 导航栏
- 卡片列表
- 居中布局
- 自适应按钮组

**示例：**
\`\`\`css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
\`\`\`

### Grid（网格布局）

**特点：**
- 二维布局系统（行和列同时控制）
- 适合页面级布局
- 容器驱动

**适用场景：**
- 整体页面布局
- 复杂网格系统
- 响应式布局
- 重叠内容

**示例：**
\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
}
\`\`\`

### 对比总结

| 特性 | Flexbox | Grid |
|------|---------|------|
| 维度 | 一维 | 二维 |
| 控制方向 | 内容驱动 | 容器驱动 |
| 适用层级 | 组件级 | 页面级 |
| 重叠内容 | 困难 | 容易 |
| 浏览器支持 | 良好 | 现代浏览器 |

### 实际应用建议

1. **先考虑 Grid**：对于整体布局，Grid 通常更合适
2. **Flexbox 补充**：在 Grid 单元格内部使用 Flexbox
3. **两者结合**：
\`\`\`css
.page {
  display: grid;
  grid-template-columns: 200px 1fr;
}
.sidebar {
  display: flex;
  flex-direction: column;
}
\`\`\``,
    category: "css",
    difficulty: "easy",
    tags: ["CSS", "布局", "Flexbox", "Grid"],
    isFavorite: true,
    createdAt: "2024-01-18",
    updatedAt: "2024-01-18",
  },
  {
    id: "5",
    title: "浏览器渲染页面的完整流程是什么？",
    content: "从输入 URL 到页面显示，浏览器经历了哪些步骤？",
    answer: `## 浏览器渲染流程

### 1. 导航阶段

**DNS 解析**
- 输入 URL
- 查询 DNS 获取 IP 地址
- 建立 TCP 连接（HTTPS 还需要 TLS 握手）

**发送 HTTP 请求**
- 构建 HTTP 请求报文
- 服务器返回响应

### 2. 解析阶段

**构建 DOM 树**
- 解析 HTML 标签
- 处理 script 标签（可能阻塞解析）
- 构建 DOM 树

**构建 CSSOM 树**
- 解析 CSS 文件和 style 标签
- 构建 CSSOM 树

### 3. 渲染阶段

**构建渲染树（Render Tree）**
- 合并 DOM 和 CSSOM
- 计算样式
- 排除不可见元素（display: none）

**布局（Layout/Reflow）**
- 计算每个元素的位置和大小
- 生成盒模型

**绘制（Paint）**
- 将渲染树转换为屏幕像素
- 分层绘制

**合成（Composite）**
- 将各层合并
- 显示到屏幕

### 4. 优化策略

**减少重排（Reflow）**
\`\`\`javascript
// ❌ 多次触发重排
const width = element.offsetWidth;
element.style.width = (width + 10) + 'px';
const height = element.offsetHeight;
element.style.height = (height + 10) + 'px';

// ✅ 批量修改
const width = element.offsetWidth;
const height = element.offsetHeight;
element.style.cssText = \`
  width: \${width + 10}px;
  height: \${height + 10}px;
\`;
\`\`\`

**使用 transform 和 opacity**
- 这两个属性不会触发重排
- 可以利用 GPU 加速

**图片优化**
- 使用合适的图片格式
- 懒加载非首屏图片
- 使用 CDN`,
    category: "browser",
    difficulty: "hard",
    tags: ["浏览器", "渲染原理", "性能优化"],
    isFavorite: true,
    createdAt: "2024-01-19",
    updatedAt: "2024-01-19",
  },
  {
    id: "6",
    title: "TypeScript 中的 interface 和 type 有什么区别？",
    content: "比较 interface 和 type 的异同，以及在什么情况下应该使用哪一个。",
    answer: `## interface vs type

### 基本区别

**interface（接口）**
\`\`\`typescript
interface Person {
  name: string;
  age: number;
}

// 声明合并
interface Person {
  email: string;
}
// Person 现在包含 name, age, email
\`\`\`

**type（类型别名）**
\`\`\`typescript
type Person = {
  name: string;
  age: number;
}

// 错误：不能重复声明
type Person = {
  email: string;
}
\`\`\`

### 功能对比

| 特性 | interface | type |
|------|-----------|------|
| 对象类型 | ✅ | ✅ |
| 联合类型 | ❌ | ✅ |
| 交叉类型 | ✅ (extends) | ✅ (&) |
| 声明合并 | ✅ | ❌ |
| 实现类 | ✅ | ❌ |
| 映射类型 | ❌ | ✅ |
| 原始类型别名 | ❌ | ✅ |

### 使用建议

**使用 interface 当：**
1. 定义对象形状
2. 需要声明合并
3. 类要实现接口
4. 面向对象编程风格

\`\`\`typescript
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

class GoldenRetriever implements Dog {
  name = "Buddy";
  breed = "Golden Retriever";
}
\`\`\`

**使用 type 当：**
1. 需要联合类型
2. 需要映射类型
3. 函数类型
4. 元组类型

\`\`\`typescript
type Status = "pending" | "success" | "error";
type Callback = (data: string) => void;
type Point = [number, number];

type ReadonlyPerson = {
  readonly [K in keyof Person]: Person[K];
};
\`\`\`

### 现代 TypeScript 建议

在大多数情况下，两者可以互换使用。现代 TypeScript 项目中的常见做法：

1. **优先使用 interface**：因为它支持声明合并，更适合扩展
2. **特定场景使用 type**：联合类型、映射类型等 interface 无法实现的场景
3. **保持一致性**：团队内统一规范`,
    category: "typescript",
    difficulty: "medium",
    tags: ["TypeScript", "类型系统"],
    isFavorite: false,
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
  },
  {
    id: "7",
    title: "什么是虚拟 DOM？它的工作原理是什么？",
    content: "解释虚拟 DOM 的概念，以及它如何提高性能。",
    answer: `## 虚拟 DOM（Virtual DOM）

### 什么是虚拟 DOM

虚拟 DOM 是一个轻量级的 JavaScript 对象，是真实 DOM 的内存表示。它描述了真实 DOM 的结构和属性。

\`\`\`javascript
// 真实 DOM
<div class="container">
  <p>Hello</p>
</div>

// 虚拟 DOM（简化表示）
{
  type: 'div',
  props: { className: 'container' },
  children: [
    {
      type: 'p',
      props: {},
      children: ['Hello']
    }
  ]
}
\`\`\`

### 工作原理

**1. 创建虚拟 DOM**
- 组件渲染时创建虚拟 DOM 树
- 使用 JavaScript 对象表示

**2. Diff 算法**
- 比较新旧虚拟 DOM 树
- 找出差异（最小更新集）

**3. 批量更新**
- 将差异应用到真实 DOM
- 减少直接操作 DOM 的次数

### Diff 算法策略

**O(n) 复杂度的假设：**
1. 不同类型的元素产生不同的树
2. 可以通过 key 属性暗示哪些子元素可能保持稳定

**比较过程：**
\`\`\`javascript
// 1. 元素类型不同 - 替换整个子树
// 旧
<div><Counter /></div>
// 新
<span><Counter /></span>

// 2. 元素类型相同 - 比较属性
<div className="old" />
<div className="new" />

// 3. 子元素比较 - 使用 key
<ul>
  <li key="a">A</li>
  <li key="b">B</li>
</ul>
\`\`\`

### 为什么虚拟 DOM 更快

**直接操作 DOM 的问题：**
- DOM 操作是昂贵的
- 每次修改都可能触发重排和重绘
- 浏览器需要处理大量计算

**虚拟 DOM 的优势：**
1. **批量更新**：收集所有变更后一次性更新
2. **跨平台**：可以渲染到不同平台（React Native）
3. **声明式**：开发者只需关注状态，不用手动操作 DOM

### 局限性

1. **不适合所有场景**：简单页面直接操作 DOM 可能更快
2. **内存开销**：需要维护额外的虚拟 DOM 树
3. **首次渲染**：需要额外创建虚拟 DOM 的步骤

### 现代框架的优化

**Vue 3：**
- 静态提升：静态节点只创建一次
- 补丁标志：精确标记动态节点

**React：**
- Fiber 架构：可中断的渲染
- 并发模式：优先级调度`,
    category: "react",
    difficulty: "hard",
    tags: ["React", "虚拟 DOM", "性能优化", "原理"],
    isFavorite: true,
    createdAt: "2024-01-21",
    updatedAt: "2024-01-21",
  },
  {
    id: "8",
    title: "HTTP 缓存机制详解",
    content: "解释 HTTP 缓存的工作原理，包括强缓存和协商缓存。",
    answer: `## HTTP 缓存机制

### 为什么需要缓存

- 减少网络请求，提高加载速度
- 降低服务器压力
- 提升用户体验

### 强缓存（不会发请求到服务器）

**Expires（HTTP/1.0）**
\`\`\`
Expires: Wed, 21 Oct 2026 07:28:00 GMT
\`\`\`
- 绝对时间
- 受本地时间影响

**Cache-Control（HTTP/1.1）**
\`\`\`
Cache-Control: max-age=31536000
Cache-Control: no-cache
Cache-Control: no-store
Cache-Control: private
Cache-Control: public
\`\`\`

| 指令 | 说明 |
|------|------|
| max-age | 缓存有效期（秒） |
| no-cache | 使用协商缓存 |
| no-store | 不缓存 |
| private | 仅客户端缓存 |
| public | 客户端和代理都可缓存 |

### 协商缓存（会发请求到服务器确认）

**Last-Modified / If-Modified-Since**
\`\`\`
// 响应
Last-Modified: Wed, 21 Oct 2025 07:28:00 GMT

// 下次请求
If-Modified-Since: Wed, 21 Oct 2025 07:28:00 GMT
// 返回 304 Not Modified 或新资源
\`\`\`

**ETag / If-None-Match（更精确）**
\`\`\`
// 响应
ETag: "33a64df5"

// 下次请求
If-None-Match: "33a64df5"
// 返回 304 Not Modified 或新资源
\`\`\`

### 缓存流程

\`\`\`
浏览器请求资源
    ↓
检查强缓存（Cache-Control/Expires）
    ↓
有效？→ 直接使用缓存（200 from cache）
    ↓ 无效
发送请求到服务器
    ↓
协商缓存（ETag/Last-Modified）
    ↓
未修改？→ 返回 304，使用缓存
    ↓ 已修改
返回新资源（200 + 新缓存规则）
\`\`\`

### 实际应用建议

**HTML 文件**
\`\`\`
Cache-Control: no-cache
\`\`\`
- 总是获取最新版本

**静态资源（JS/CSS/图片）**
\`\`\`
Cache-Control: max-age=31536000
\`\`\`
- 配合文件名哈希（main.a1b2c3.js）
- 内容变化时 URL 变化

**CDN 配置**
\`\`\`
Cache-Control: public, max-age=3600
\`\`\``,
    category: "network",
    difficulty: "medium",
    tags: ["HTTP", "缓存", "性能优化", "网络"],
    isFavorite: false,
    createdAt: "2024-01-22",
    updatedAt: "2024-01-22",
  },
];

export function getQuestions(): Question[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("interview-questions");
    if (stored) {
      return JSON.parse(stored);
    }
  }
  return sampleQuestions;
}

export function saveQuestions(questions: Question[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("interview-questions", JSON.stringify(questions));
  }
}

export function toggleFavorite(
  questions: Question[],
  id: string
): Question[] {
  return questions.map((q) =>
    q.id === id ? { ...q, isFavorite: !q.isFavorite } : q
  );
}

export function filterQuestions(
  questions: Question[],
  filters: {
    category?: Category | "all";
    difficulty?: Difficulty | "all";
    search?: string;
    favoritesOnly?: boolean;
  }
): Question[] {
  return questions.filter((q) => {
    if (filters.category && filters.category !== "all" && q.category !== filters.category) {
      return false;
    }
    if (filters.difficulty && filters.difficulty !== "all" && q.difficulty !== filters.difficulty) {
      return false;
    }
    if (filters.favoritesOnly && !q.isFavorite) {
      return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        q.title.toLowerCase().includes(searchLower) ||
        q.content.toLowerCase().includes(searchLower) ||
        q.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }
    return true;
  });
}

export function getCategories(): Category[] {
  return Object.keys(categoryLabels) as Category[];
}

export function getDifficulties(): Difficulty[] {
  return ["easy", "medium", "hard"];
}
