## 修订PRD文档字体规范

### 任务目标
将PRD文档中的字体规范从简单的三列表格修订为包含字体类型、字体族、大小、字体权重、用途和代码对应示例的详细规范表格。

### 修订内容
1. **修改文件**: `prd-v5.md`
2. **修改章节**: 6.2 字体规范
3. **修改方式**: 替换旧的简单表格为用户提供的详细字体规范表格

### 旧规范内容
```markdown
### 6.2 字体规范
| 字体 | 大小 | 用途 |
|------|------|------|
| 标题 | 18px | 页面标题 |
| 副标题 | 16px | 卡片标题、模块标题 |
| 正文 | 14px | 主要文本内容 |
| 辅助文本 | 12px | 说明文字、时间戳 |
| 按钮文本 | 16px | 按钮文字 |
```

### 新规范内容
```markdown
### 6.2 字体规范
| 字体类型 | 字体族 | 大小 | 字体权重 | 用途 | 代码对应示例 |
|---------|--------|------|----------|------|--------------|
| 页面标题 | -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif | 18px | 600 (semibold) | 页面主标题 | `<h1 id="page-title" class="text-lg font-semibold text-text-primary">广告投放</h1>` |
| 模块标题 | -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif | 18px | 600 (semibold) | 数据概览、广告列表等模块标题 | `<h2 id="overview-title" class="text-lg font-semibold text-text-primary mb-4">投放概览</h2>` |
| 卡片标题 | -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif | 16px | 600 (semibold) | 广告卡片标题 | `<h3 id="ad-title-1" class="font-semibold text-text-primary mb-1">高效禽流感疫苗推广</h3>` |
| 正文 | -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif | 14px | 400 (regular) | 广告描述、主要文本内容 | `<p id="ad-desc-1" class="text-sm text-text-secondary mb-2">针对冬季高发期，专业禽流感防控疫苗</p>` |
| 辅助文本 | -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif | 12px | 400 (regular) | 数据标签、说明文字 | `<span><i class="fas fa-eye mr-1"></i>曝光: 2,341</span>` |
| 按钮文本 | -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif | 14px | 500 (medium) | 按钮文字 | `<button id="new-ad-btn" class="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-medium shadow-button">` |
| 数据数值 | -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif | 24px | 700 (bold) | 关键数据展示 | `<p class="text-2xl font-bold text-text-primary">12</p>` |
| 表单标签 | -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif | 14px | 500 (medium) | 表单字段标签 | `<label for="ad-title-input" class="block text-sm font-medium text-text-primary mb-2">广告标题</label>` |
| 模态框标题 | -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif | 18px | 600 (semibold) | 弹窗标题 | `<h3 class="text-lg font-semibold text-text-primary">新建广告</h3>` |
```

### 修订步骤
1. 打开PRD文档 `prd-v5.md`
2. 定位到第6.2节字体规范
3. 删除旧的字体规范表格
4. 粘贴用户提供的新字体规范表格
5. 保存文档

### 预期效果
- PRD文档中的字体规范更加详细和具体
- 提供了明确的字体权重和代码示例
- 便于开发人员直接参考和使用
- 确保所有页面的字体样式一致性