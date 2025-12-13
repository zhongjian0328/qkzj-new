# 删除不需要的AI诊断页面

## 问题分析
- PRD文档中只包含三个AI诊断相关页面：P-AI_DIAGNOSIS_MODE_SELECT、P-AI_DIAGNOSIS_CHAT、P-AI_DIAGNOSIS_VET
- P-AI_DIAGNOSIS.html页面在PRD文档中没有记录，是不需要的交互页面
- 有多个其他页面引用了P-AI_DIAGNOSIS.html，需要更新这些引用

## 解决方案
1. **删除P-AI_DIAGNOSIS.html页面**
2. **更新所有引用该页面的其他页面**，将其替换为正确的AI诊断入口页面（P-AI_DIAGNOSIS_MODE_SELECT.html）

## 更新范围
需要更新以下7个页面中的引用：
- P-AI_REPORT_AUDIT.html
- P-VETERINARY_MALL.html
- P-USER_PROFILE.html
- P-TREATMENT_PLAN.html
- P-HOME_FARMER_SMALL.html（两处引用）
- P-EMERGENCY_PLAN.html

## 预期效果
- 删除不需要的P-AI_DIAGNOSIS.html页面
- 所有页面都使用正确的AI诊断入口页面
- 符合PRD文档的页面设计要求

## 实施步骤
1. 删除P-AI_DIAGNOSIS.html文件
2. 逐一更新上述7个页面中的引用链接，将P-AI_DIAGNOSIS.html替换为P-AI_DIAGNOSIS_MODE_SELECT.html
3. 验证所有更新后的页面链接是否正确