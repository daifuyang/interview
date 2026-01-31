import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("开始初始化数据...");

  // 创建管理员账号
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.admin.create({
    data: {
      username: "admin",
      password: hashedPassword,
    },
  });
  console.log("管理员账号已创建:", admin.username);

  // 创建分类
  const categories = [
    { name: "javascript", label: "JavaScript", sortOrder: 1 },
    { name: "typescript", label: "TypeScript", sortOrder: 2 },
    { name: "react", label: "React", sortOrder: 3 },
    { name: "vue", label: "Vue", sortOrder: 4 },
    { name: "css", label: "CSS", sortOrder: 5 },
    { name: "html", label: "HTML", sortOrder: 6 },
    { name: "browser", label: "浏览器", sortOrder: 7 },
    { name: "performance", label: "性能优化", sortOrder: 8 },
    { name: "engineering", label: "工程化", sortOrder: 9 },
    { name: "algorithm", label: "算法", sortOrder: 10 },
    { name: "network", label: "网络", sortOrder: 11 },
    { name: "data_structure", label: "数据结构", sortOrder: 12 },
  ];

  for (const cat of categories) {
    await prisma.category.create({ data: cat });
  }
  console.log("分类已创建:", categories.length, "个");

  // 获取 JavaScript 分类 ID
  const jsCategory = await prisma.category.findUnique({
    where: { name: "javascript" },
  });
  const reactCategory = await prisma.category.findUnique({
    where: { name: "react" },
  });
  const cssCategory = await prisma.category.findUnique({
    where: { name: "css" },
  });

  // 创建示例题目
  const sampleQuestions = [
    {
      title: "JavaScript 中 var、let 和 const 的区别是什么？",
      content: "请详细说明 var、let 和 const 在变量提升、作用域、重复声明等方面的区别。",
      answer: `<h3>主要区别</h3>
<p><strong>1. 作用域</strong></p>
<ul>
  <li><strong>var</strong>: 函数作用域（function scope）</li>
  <li><strong>let/const</strong>: 块级作用域（block scope）</li>
</ul>
<p><strong>2. 变量提升</strong></p>
<ul>
  <li><strong>var</strong>: 存在变量提升，声明会被提升到作用域顶部，初始化为 undefined</li>
  <li><strong>let/const</strong>: 存在暂时性死区（TDZ），声明前访问会报错</li>
</ul>
<p><strong>3. 重复声明</strong></p>
<ul>
  <li><strong>var</strong>: 允许重复声明</li>
  <li><strong>let/const</strong>: 不允许在同一作用域重复声明</li>
</ul>
<p><strong>4. 赋值</strong></p>
<ul>
  <li><strong>var/let</strong>: 可以重新赋值</li>
  <li><strong>const</strong>: 声明时必须初始化，且不能重新赋值（但对象/数组的内容可以修改）</li>
</ul>`,
      categoryId: jsCategory!.id,
      difficulty: "easy" as const,
      tags: "ES6,作用域,变量声明",
      isFavorite: true,
    },
    {
      title: "什么是闭包？闭包有什么实际应用场景？",
      content: "解释闭包的概念，并举例说明其在实际开发中的应用。",
      answer: `<h3>闭包（Closure）</h3>
<p><strong>定义</strong></p>
<p>闭包是指有权访问另一个函数作用域中的变量的函数。</p>
<p><strong>实际应用场景</strong></p>
<ol>
  <li>数据私有化</li>
  <li>函数柯里化</li>
  <li>事件处理中的数据保持</li>
  <li>防抖和节流</li>
</ol>`,
      categoryId: jsCategory!.id,
      difficulty: "medium" as const,
      tags: "闭包,作用域,高级概念",
      isFavorite: true,
    },
    {
      title: "React 中 useEffect 的依赖项数组有什么作用？",
      content: "解释 useEffect 依赖项数组的工作原理，以及常见的使用误区。",
      answer: `<h3>useEffect 依赖项数组</h3>
<p><strong>基本作用</strong></p>
<p>依赖项数组决定了 effect 何时重新执行：</p>
<ul>
  <li><strong>空数组 []</strong>: 只在组件挂载时执行一次</li>
  <li><strong>有依赖项</strong>: 依赖项变化时执行</li>
  <li><strong>无数组</strong>: 每次渲染后都执行</li>
</ul>
<p><strong>常见误区</strong></p>
<ol>
  <li>忘记添加依赖项</li>
  <li>依赖项过多导致频繁执行</li>
  <li>使用对象/数组作为依赖项</li>
</ol>`,
      categoryId: reactCategory!.id,
      difficulty: "medium" as const,
      tags: "React Hooks,useEffect,副作用",
      isFavorite: false,
    },
    {
      title: "CSS 中 Flexbox 和 Grid 布局的区别是什么？",
      content: "比较 Flexbox 和 Grid 布局的特点，以及各自适用的场景。",
      answer: `<h3>Flexbox vs Grid</h3>
<p><strong>Flexbox（弹性布局）</strong></p>
<ul>
  <li>一维布局系统（行或列）</li>
  <li>适合组件级布局</li>
  <li>内容驱动</li>
</ul>
<p><strong>Grid（网格布局）</strong></p>
<ul>
  <li>二维布局系统（行和列同时控制）</li>
  <li>适合页面级布局</li>
  <li>容器驱动</li>
</ul>`,
      categoryId: cssCategory!.id,
      difficulty: "easy" as const,
      tags: "CSS,布局,Flexbox,Grid",
      isFavorite: true,
    },
  ];

  for (const question of sampleQuestions) {
    await prisma.question.create({ data: question });
  }
  console.log("示例题目已创建:", sampleQuestions.length, "个");

  console.log("数据初始化完成！");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
