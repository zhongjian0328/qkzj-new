# 禽康智检APP

## 项目概述

禽康智检APP是一款面向禽类养殖产业链各环节用户的移动端综合服务平台，基于React Native + Expo技术栈开发，通过AI技术赋能，专注于实现多病原混合感染的智能化诊断、风险评估、防控方案生成及确诊指引。

## 技术栈

### 前端技术栈
- **Expo SDK**: 54.0.18
- **React Native**: Expo内置
- **TypeScript**: 最新稳定版
- **React Navigation**: 最新稳定版
- **React Context + useReducer**: 状态管理
- **Axios**: API请求
- **React Native Paper**: UI组件库
- **Tailwind CSS**: 样式设计与布局

### 后端技术栈
- **Node.js**: 24.11.1
- **Express.js**: 5.2.1
- **MongoDB**: 8.2.2
- **Mongoose**: 9.0.1
- **JWT**: 认证授权
- **bcrypt**: 密码加密

### AI服务集成
- **百度云图像识别API**: 病禽图片识别
- **阿里云NLP - 智能诊断引擎**: 风险评估、方案生成、诊断建议

## 开发流程

### 环境准备
1. 安装Node.js 24.11.1
2. 安装MongoDB 8.2.2
3. 安装Expo CLI: `npm install -g expo-cli`
4. 安装Git 2.52.0
5. 安装VS Code和Trae IDE

### 项目初始化

#### 后端初始化
```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 创建.env文件并配置环境变量
cp .env.example .env
# 编辑.env文件，配置数据库连接、JWT密钥等

# 启动后端服务
npm start
```

#### 前端初始化
```bash
# 进入项目根目录
cd ..

# 安装依赖
npm install

# 启动Expo开发服务器
expo start
```

### 开发流程
1. 创建分支: `git checkout -b feature/your-feature-name`
2. 开发功能
3. 提交代码: `git add . && git commit -m "feat: add your feature"`
4. 推送分支: `git push origin feature/your-feature-name`
5. 创建PR，进行代码审查
6. 合并PR到主分支

## 项目结构

```
├── UI_GENERATION/          # 交互原型HTML文件
├── backend/                # 后端代码
│   ├── config/             # 配置文件
│   ├── controllers/        # 控制器
│   ├── models/             # 数据模型
│   ├── routes/             # 路由配置
│   ├── utils/              # 工具函数
│   ├── .env.example        # 环境变量示例
│   ├── index.js            # 后端入口文件
│   └── package.json        # 后端依赖
├── src/                    # 前端代码
│   ├── components/         # UI组件
│   ├── context/            # 状态管理
│   ├── screens/            # 页面组件
│   ├── services/           # API服务
│   └── utils/              # 工具函数
├── prd-v5.md               # 产品需求文档
└── README.md               # 项目说明文档
```

## 功能模块

1. **用户与认证管理**: 注册、登录、角色选择、认证
2. **AI诊断模块**: 对话问诊、AI兽医模式诊断、诊断报告生成
3. **生产管理**: 批次管理、死淘/耗料记录、员工权限管理
4. **疫情监测与预警**: 疫情热力图、异常高发报警、政策下发
5. **知识学习与题库**: 图谱百科、题库与测验
6. **商业服务**: 广告投放、在线诊疗接单、客户管理
7. **数据标注与科研协作**: 病例标注、科研协作群组

## 应用构建与发布

### 构建命令
```bash
# 构建Android APK
expo build:android

# 构建iOS IPA
expo build:ios

# 构建Web版本
expo build:web
```

### 发布流程
1. 使用Expo Build Service构建应用
2. 上传到Google Play Store和Apple App Store
3. 使用Expo Over-the-Air Updates实现应用热更新

## 监控与维护

1. **应用监控**: 使用Firebase Performance Monitoring和Sentry
2. **后端监控**: 使用PM2和MongoDB Atlas
3. **定期维护**: 定期更新依赖、备份数据库、优化性能

## 安全策略

1. **数据安全**: 敏感数据加密存储，API请求使用HTTPS
2. **应用安全**: 防止SQL注入、XSS攻击，实现应用签名
3. **AI服务安全**: 保护API密钥，实现API调用频率限制

## 联系方式

如有问题或建议，请联系项目团队。
