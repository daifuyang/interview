const fs = require("fs");
const path = require("path");

// 复制静态文件到 standalone 目录
function main() {
  const sourceDir = path.join(__dirname, "../.next/static");
  const destDir = path.join(__dirname, "../.next/standalone/.next/static");

  // 确保目标目录存在
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // 复制目录内容
  fs.cpSync(sourceDir, destDir, { recursive: true });

  console.log("静态文件复制完成");
}

main();
