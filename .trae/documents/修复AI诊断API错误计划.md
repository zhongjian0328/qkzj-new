# 修复AI诊断API错误计划

## 1. 问题分析

根据终端日志，AI诊断API调用失败，错误信息为：
```
ERROR  AI诊断API错误: [Error: Model Not Exist]
```

### 1.1 错误原因

错误发生在`callDeepSeekApi`函数中，具体是因为使用了不存在的模型名称：
- 当前使用的模型：`deepseek-r1`
- DeepSeek API可能不支持该模型名称，或者模型名称拼写错误

### 1.2 其他相关警告

- `ImagePicker.MediaTypeOptions`已废弃，建议使用`ImagePicker.MediaType`
- `textShadow*`样式属性已废弃，建议使用`textShadow`
- `props.pointerEvents`已废弃，建议使用`style.pointerEvents`

## 2. 解决方案

### 2.1 修复DeepSeek模型名称

1. 查阅DeepSeek API文档，确认可用的模型名称
2. 更新`callDeepSeekApi`函数中的模型名称
3. 测试修复后的API调用

### 2.2 修复其他警告

1. 更新ImagePicker使用方式
2. 修复废弃的样式属性
3. 修复废弃的props使用

## 3. 实施步骤

### 3.1 修复DeepSeek模型名称

1. 检查DeepSeek API文档，确认正确的模型名称
2. 修改`callDeepSeekApi`函数中的模型名称
3. 测试AI诊断功能

### 3.2 修复ImagePicker警告

1. 查找使用`ImagePicker.MediaTypeOptions`的文件
2. 将其替换为`ImagePicker.MediaType`
3. 测试图片选择功能

### 3.3 修复样式和props警告

1. 查找使用废弃属性的文件
2. 替换为推荐的属性
3. 测试UI显示

## 4. 预期结果

- AI诊断功能恢复正常
- 不再出现"Model Not Exist"错误
- 减少或消除控制台警告
- 应用运行更加稳定

## 5. 测试验证

1. 运行应用
2. 进入AI诊断页面
3. 上传图片并进行诊断
4. 验证诊断结果是否正确返回
5. 检查控制台是否还有相关错误

## 6. 后续优化

- 完善错误处理机制
- 添加API调用失败的重试逻辑
- 优化用户体验，显示友好的错误提示
- 定期检查API模型更新，确保模型名称始终有效