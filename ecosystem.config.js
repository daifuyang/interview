module.exports = {
  apps: [
    {
      name: 'nextjs-interview',
      cwd: '/root/workspace/node/interview',
      // 使用 standalone 启动
      script: './.next/standalone/server.js',
      // 或者使用 node 直接运行
      // script: 'node',
      // args: '.next/standalone/server.js',
      
      env: {
        PORT: 5000,
        NODE_ENV: 'production',
        // 其他环境变量
      },
      
      instances: 1,        // 或 'max' 使用多核
      exec_mode: 'fork',   // standalone 用 fork，cluster 模式有问题
      
      // 日志
      error_log: '/root/workspace/node/interview/interview.zerocmf.com/logs/err.log',
      out_log: '/root/workspace/node/interview/interview.zerocmf.com/logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // 自动重启
      max_memory_restart: '1G',
      restart_delay: 3000,
    },
  ],
};