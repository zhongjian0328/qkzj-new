## 安卓APP部署和封装计划

### 1. 安装EAS CLI
- 全局安装EAS CLI工具，用于管理Expo应用的构建和部署
- 命令：`npm install -g eas-cli`

### 2. 创建EAS配置文件
- 创建`eas.json`配置文件，定义Android构建选项
- 配置包含：
  - 构建配置（production、preview等）
  - Android签名配置
  - 构建平台设置

### 3. 配置Android构建选项
- 确保`app.json`中包含正确的Android配置
- 配置Android包名、版本号等信息
- 设置Android权限和配置

### 4. 执行EAS Build构建
- 使用EAS CLI执行Android构建
- 命令：`eas build -p android --profile production`
- 构建过程将在Expo服务器上执行，生成APK或AAB文件

### 5. 测试构建结果
- 下载构建生成的APK文件
- 在Android设备或模拟器上测试应用
- 验证应用功能是否正常

### 6. 准备发布
- 如果使用AAB格式，准备上传到Google Play Console
- 如果使用APK格式，可以直接分发给用户测试或发布

### 技术要点
- 使用EAS Build替代旧的expo build命令
- 确保所有依赖都已正确安装和配置
- 配置正确的Android签名信息
- 测试构建结果确保应用正常运行

### 预期输出
- 成功生成Android APK或AAB文件
- 应用可以在Android设备上正常安装和运行
- 所有功能正常工作，包括AI诊断、用户认证等

### 注意事项
- 构建过程需要Expo账号登录
- 首次构建可能需要较长时间
- 需要确保项目代码没有语法错误或依赖问题
- 建议先在本地测试应用，确保功能正常后再进行构建