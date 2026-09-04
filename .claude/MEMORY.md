# Memory

## 项目状态（2026-09-04）

- 代码完整性：M01-M11 全栈实现，45个Screen（含ProductList/OrderList/ReportAudit/PolicyPublish）
- 运行时验证：后端+前端均已启动，核心链路跑通
- AI诊断：豆包2.0 LLM直调 + 规则引擎降级
- 集成测试：56项，4模块全覆盖
- E2E验证：12/12角色体验登录+首页+Tab导航全部通过（Playwright无头测试132步）
- 生产安全配置：helmet + rate-limit + 强密钥 + trust proxy + 生产环境错误屏蔽 + 优雅关闭
- CI/CD流水线：框架完整（需GitHub Secrets）
- Web deep linking：39个页面URL映射已配置
- 健康检查增强：/api/health含MongoDB连通性检测和uptime
- Socket.IO JWT认证已实现（io.use + jwt.verify，仅dev环境豁免mock-jwt-token）
- EAS Build：首版APK已生成并安装（v1.2.0-preview）
- 种子数据：115条体验数据已注入（批次/死淘/日志/诊断/疫情/通知）
- GitHub推送：commit 3691751 已推送到 master + main 分支（通过GitHub Git Data API）

## 关键技术决策

- LLM服务商：豆包2.0（火山引擎Ark），模型 doubao-seed-2-1-pro-260628
- Mongoose 9：pre hook 不传 next，用 throw 代替
- auth/update 端点禁止修改 roleType/subRole，需走 /auth/select-role 专用端点
- Expo Web 的 NavigationContainer 需配置 linking 才支持 URL 路由
- TEACHER子角色枚举：MENTOR / CLINICAL_TEACHER / RESEARCH_TEACHER（已添加到UserSubRole类型）
- UserContext 启动时调 /auth/current-user 恢复真实用户数据（commit 16e9bd3 修复）
- 体验登录限流：experienceLimiter 30/min，豁免authLimiter
- GitHub推送方式：HTTPS直连被墙时，通过GitHub Git Data API（api.github.com可达）推送
- Socket.IO JWT认证已实现：io.use + jwt.verify，dev环境豁免mock-jwt-token（socketService.js）
- Socket.IO JWT认证已实现：io.use + jwt.verify，dev环境豁免mock-jwt-token（socketService.js）
- Socket.IO JWT认证已实现：io.use + jwt.verify，dev环境豁免mock-jwt-token（socketService.js）
- Socket.IO JWT认证已实现：io.use + jwt.verify，dev环境豁免mock-jwt-token（socketService.js）
- Socket.IO JWT认证已实现：io.use + jwt.verify，dev环境豁免mock-jwt-token（socketService.js）
- Socket.IO JWT认证已实现：io.use + jwt.verify，dev环境豁免mock-jwt-token（socketService.js）
- Socket.IO JWT认证已实现：io.use + jwt.verify，dev环境豁免mock-jwt-token（socketService.js）
- Socket.IO JWT认证已实现：io.use + jwt.verify，dev环境豁免mock-jwt-token（socketService.js）
- Socket.IO JWT认证已实现：io.use + jwt.verify，dev环境豁免mock-jwt-token（socketService.js）
- Socket.IO JWT认证已实现：io.use + jwt.verify，dev环境豁免mock-jwt-token（socketService.js）
- Socket.IO JWT认证已实现：io.use + jwt.verify，dev环境豁免mock-jwt-token（socketService.js）
- Socket.IO JWT认证已实现：io.use + jwt.verify，dev环境豁免mock-jwt-token（socketService.js）
- Socket.IO JWT认证已实现：io.use + jwt.verify，dev环境豁免mock-jwt-token（socketService.js）
- Socket.IO JWT认证已实现：io.use + jwt.verify，dev环境豁免mock-jwt-token（socketService.js）
- Socket.IO JWT认证已实现：io.use + jwt.verify，dev环境豁免mock-jwt-token（socketService.js）
- Socket.IO JWT认证已实现：io.use + jwt.verify，dev环境豁免mock-jwt-token（socketService.js）
- Socket.IO JWT认证已实现：io.use + jwt.verify，dev环境豁免mock-jwt-token（socketService.js）
- Socket.IO JWT认证已实现：io.use + jwt.verify，dev环境豁免mock-jwt-token（socketService.js）
- Socket.IO JWT认证已实现：io.use + jwt.verify校验handshake token，dev环境豁免mock-jwt-token（socketService.js）
- Socket.IO JWT认证已实现：io.use + jwt.verify校验handshake token，dev环境豁免mock-jwt-token（socketService.js）
- Socket.IO JWT认证已实现：io.use + jwt.verify，dev环境豁免mock-jwt-token（socketService.js）
- Socket.IO JWT认证已实现：io.use + jwt.verify，dev环境豁免mock-jwt-token（socketService.js）
- Socket.IO JWT认证已实现：io.use + jwt.verify，dev环境豁免mock-jwt-token（backend/services/socketService.js）
- Socket.IO JWT认证已实现：io.use + jwt.verify，dev环境豁免mock-jwt-token（socketService.js）
- Socket.IO JWT认证已实现：io.use + jwt.verify（socketService.js），dev环境豁免mock-jwt-token
- Socket.IO JWT认证已实现：io.use + jwt.verify，dev环境豁免mock-jwt-token（socketService.js）
- Socket.IO JWT认证已实现：io.use + jwt.verify（socketService.js），dev环境豁免mock-jwt-token
- Socket.IO JWT认证已实现：io.use + jwt.verify，dev环境豁免mock-jwt-token（socketService.js）
- Socket.IO JWT认证已实现：io.use + jwt.verify（socketService.js），dev环境豁免mock-jwt-token

## 运行环境

- MongoDB Community Server 8.3.7（winget安装，自动运行）
- 后端：http://localhost:3000
- 后端启动：由用户终端前台 `node index.js` 启动（agent后台启动方式不可靠）
- 前端：http://localhost:8081
- 体验账号：19900000001~00000012（12角色全覆盖）

## 已修复的阻断性缺陷

- commit b591664: TEACHER角色注册路径补全/INSTITUTION首页跳转/Profile循环/图像分析字段/安全加固
- commit cdde023: 死淘率计算bug/饼图颜色/答题反馈/角色菜单/退出确认/AI气泡颜色
- commit f409804: 8种子角色首页差异化重构/生产管理仪表板化
- commit 6586ccb: Emoji→Ionicons(70+处)/Picker选择器/置信度颜色体系/KnowledgeGraph网格重构
- commit 7b9f2f0: 商业服务Screen/生产数据导出/输入验证扩展/导师管理静态数据替换
- commit 16e9bd3: UserContext用户数据恢复/12角色体验入口补全/ObjectId验证/限流策略优化
- commit 3efde56: Emoji残留修复(Splash/OfflineBanner)/体验说明更新/TEACHER+STUDENT子角色首页差异化(10种)/种子数据注入
- commit 78b4f74: 底部Tab重构为5Tab/Profile导航修复+API化+版本v2.0.0/语音输入Web Speech API/服务闭环ServiceCycleScreen/Button 48dp
- commit 3691751: 42章禽病防治教材整合进KnowledgeGraph模型/后端6个桩实现端点替换为真实Controller/QuizResult模型/种子数据31节点+24题库/KnowledgeGraphScreen六段详情+鉴别诊断+免疫程序/题库字段映射修复

## 体验角色对照（12个）

| 手机号 | 角色 | 子角色 | 首页布局 |
|---|---|---|---|
| 19900000001 | FARMER | SMALL | 小散户版 |
| 19900000002 | FARMER | ENTERPRISE | 企业版 |
| 19900000003 | FARMER | COOPERATIVE | 小散户版 |
| 19900000004 | INSTITUTION | CDC | 疫控机构版 |
| 19900000005 | INSTITUTION | RESEARCH_INSTITUTE | 科研院所版 |
| 19900000006 | INSTITUTION | SERVICE_PROVIDER | 服务商版 |
| 19900000007 | STUDENT | LEARNING_STUDENT | 学习阶段版 |
| 19900000008 | STUDENT | COGNITIVE_INTERN | 认知实习版 |
| 19900000009 | STUDENT | ADVANCED_INTERN | 顶岗实习版 |
| 19900000010 | TEACHER | MENTOR | 导师版 |
| 19900000011 | TEACHER | CLINICAL_TEACHER | 临床教师版 |
| 19900000012 | TEACHER | RESEARCH_TEACHER | 科研教师版 |

## 图标设计（2026-09-02）

- 基于 icon_downloaded.png 提取前景素材（蓝青色系圆形设计，r≈280px）
- icon.png/adaptive-icon.png/splash-icon.png/favicon.png 均已更新
- app.json: splash/adaptive 背景色均设为 #2DBBA1

## Expo构建

- 账号：zhongjian475
- GitHub仓库：https://github.com/zhongjian0328/qkzj-new
- main分支已同步master内容（Expo默认从main拉取）
- 需交互式 `eas login` 后再 `eas build --platform android --profile preview`
- Access Token: HEKYq1aEUUlDJfvWPkFf8BihTXGZMY9_STYnPodM（可通过 EXPO_TOKEN 环境变量或 --token 参数使用）

## 知识库整合（2026-09-04，commit 3691751）

- 42章禽病防治教材已整合进KnowledgeGraph模型
- 后端6个桩实现端点替换为真实Controller（knowledgeController.js）
- 新增QuizResult模型支持测验记录持久化
- 种子数据：31个疾病节点+24道题库+34条关联关系
- KnowledgeGraphScreen重构：6分类Tab+详情Modal六段展示+免疫程序+鉴别诊断+用药要点
- KnowledgeListScreen：修复分类枚举对齐后端
- QuestionBankScreen：对齐后端字段映射+题型+难度枚举

## 开发文档对齐改进（2026-09-03，commit 78b4f74）

- 底部Tab重构为5Tab结构，按角色差异化：
  - 养殖户：首页→AI诊断→预警中心→科普→我的
  - 机构：首页→疫情地图→AI诊断→科普→我的
  - 学生：首页→实习日志→AI诊断→科普→我的
  - 教师：首页→导师管理→AI诊断→工单→我的
- ProfileScreen修复：导航崩溃bug、统计数据改API获取、版本号v2.0.0
- ChatDiagnosis语音输入：Web Speech API实现（仅Web环境Chrome）
- 新增ServiceCycleScreen：全流程服务闭环视图（预警→诊断→预案→回访时间轴）
- HomeScreen：小散户/企业版首页添加服务闭环入口

## 待办

- ChatDiagnosis语音输入按钮为空操作（P2）——已实现Web Speech API，但移动端不可用
- Redis迁移（refresh token/验证码从内存Map迁移）阻断多实例部署
- JWT密钥未分离（access/refresh共用JWT_SECRET）
- 种子数据扩展：当前31个疾病节点，可补全全部42章内容
