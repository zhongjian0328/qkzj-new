## 修复localStorage错误并完善AI诊断功能

### 1. 问题分析
- **错误原因**：React Native环境不支持浏览器的localStorage API
- **影响范围**：
  - `src/services/api.ts`：请求/响应拦截器使用localStorage
  - `src/context/UserContext.tsx`：登录、注册、登出功能使用localStorage
  - 所有依赖认证的功能，包括AI诊断

### 2. 解决方案
- **安装AsyncStorage**：使用React Native官方推荐的@react-native-async-storage/async-storage
- **替换localStorage**：将所有localStorage调用替换为AsyncStorage
- **处理异步操作**：修改代码以支持AsyncStorage的异步特性

### 3. 修复步骤

#### 3.1 安装依赖
```bash
npm install @react-native-async-storage/async-storage
```

#### 3.2 修改UserContext.tsx
- 导入AsyncStorage
- 修改登录、注册、登出方法，使用AsyncStorage
- 调整useEffect钩子，从AsyncStorage加载初始token

#### 3.3 修改api.ts
- 导入AsyncStorage
- 修改请求拦截器，异步获取token
- 修改响应拦截器，异步移除token

#### 3.4 测试AI诊断功能
- 确保ChatDiagnosisScreen正常工作
- 确保VeterinaryDiagnosisScreen正常工作
- 测试学生专用AI诊断功能
- 验证不同角色的诊断功能

### 4. 构建测试
- 运行类型检查：`npx tsc --noEmit`
- 执行构建命令：`eas build --platform android --profile preview`

### 5. 预期结果
- 修复localStorage不存在的错误
- AI诊断功能正常工作
- 不同角色的诊断功能正确实现
- 应用能够成功构建preview版

### 6. 注意事项
- AsyncStorage是异步的，需要正确处理Promise
- 确保所有localStorage调用都被替换
- 测试不同登录场景下的token管理

这个计划将彻底解决localStorage错误，并确保AI诊断功能正常工作。