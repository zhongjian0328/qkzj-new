# 后端服务部署指南

## 1. 环境要求

- Node.js 18.x 或更高版本
- npm 9.x 或更高版本
- MongoDB 4.4 或更高版本（建议使用阿里云MongoDB RDS）

## 2. 部署步骤

### 2.1 环境准备

1. **安装 Node.js 和 npm**
   ```bash
   # 安装 Node.js 18.x
   curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
   apt-get install -y nodejs
   
   # 验证安装
   node -v
   npm -v
   ```

2. **配置环境变量**
   ```bash
   # 复制示例配置文件
   cp .env.example .env
   
   # 编辑配置文件
   vim .env
   ```

   在 `.env` 文件中配置以下内容：
   ```
   # 服务器配置
   PORT=3000
   
   # MongoDB数据库配置
   MONGODB_URI=mongodb://<数据库用户名>:<数据库密码>@<主机1>:3717,<主机2>:3717/<数据库名>?replicaSet=<副本集名>&authSource=admin
   
   # JWT配置
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=7d
   ```

### 2.2 安装依赖

```bash
npm install
```

### 2.3 启动服务

#### 开发环境
```bash
npm start
```

#### 生产环境

**使用 PM2 管理服务**
```bash
# 安装 PM2
npm install -g pm2

# 启动服务
pm run pm2:start

# 查看服务状态
pm run pm2:status

# 查看日志
pm run pm2:logs

# 停止服务
pm run pm2:stop
```

**使用 Docker 部署**
```bash
# 构建镜像
docker build -t qinkangzhijian-backend .

# 运行容器
docker run -d -p 3000:3000 --name qinkangzhijian-backend qinkangzhijian-backend
```

## 3. 健康检查

服务启动后，可以通过以下端点进行健康检查：

```bash
curl http://localhost:3000/api/health
```

成功响应示例：
```json
{"status":"ok","message":"禽康智检API服务运行正常"}
```

## 4. 目录结构

```
backend/
├── controllers/          # 控制器
│   ├── aiDiagnosisController.js
│   ├── authController.js
│   └── ...
├── middleware/           # 中间件
│   └── authMiddleware.js
├── models/               # 数据模型
│   ├── User.js
│   ├── DiagnosisRecord.js
│   └── ...
├── routes/               # 路由
│   ├── aiDiagnosisRoutes.js
│   ├── authRoutes.js
│   └── ...
├── utils/                # 工具函数
│   └── aiService.js
├── .env                  # 环境变量
├── .env.example          # 环境变量示例
├── index.js              # 入口文件
├── package.json          # 依赖配置
└── README.md             # 项目说明
```

## 5. 监控与维护

### 5.1 日志管理

- **应用日志**：使用 `morgan` 中间件记录 HTTP 请求日志
- **错误日志**：通过全局错误处理中间件记录
- **PM2 日志**：使用 PM2 自带的日志管理功能

### 5.2 性能监控

- 建议使用 Node.js 性能监控工具（如 New Relic、PM2 Plus）
- 监控 MongoDB 连接池状态
- 定期检查内存和 CPU 使用情况

### 5.3 安全建议

- 定期更新依赖包
- 配置 HTTPS
- 启用防火墙规则
- 限制数据库访问IP
- 定期更换 JWT 密钥

## 6. 常见问题

### 6.1 MongoDB 连接失败

- 检查连接字符串格式是否正确
- 确认数据库用户名和密码正确
- 检查网络连接是否通畅
- 确认数据库实例状态正常

### 6.2 服务无法启动

- 检查端口是否被占用
- 检查环境变量配置是否正确
- 查看日志文件获取详细错误信息

### 6.3 权限问题

- 确保服务具有足够的权限访问文件和目录
- 检查数据库用户权限设置

## 7. 联系方式

如有问题或建议，请联系技术团队。