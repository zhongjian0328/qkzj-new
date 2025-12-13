# 修复Button组件中LinearGradient的web兼容性问题

## 问题分析

根据终端错误信息 `Invariant Violation: View config not found for component 'BVLinearGradient'`，问题出在Button组件中使用的LinearGradient组件上。尽管代码中已经添加了平台判断，但可能存在某些情况下在web平台上仍然尝试渲染LinearGradient的问题。

## 修复方案

1. **完善平台判断逻辑**：确保在web平台上完全不使用LinearGradient组件
2. **优化组件渲染**：使用条件渲染确保LinearGradient只在非web平台上被导入和使用
3. **简化web平台样式**：在web平台上使用纯色背景替代渐变效果

## 修复步骤

1. 打开 `src/components/Button.tsx` 文件
2. 检查并完善LinearGradient的导入和使用逻辑
3. 确保在web平台上不渲染LinearGradient组件
4. 测试修复后的Button组件在web平台上的运行情况

## 预期结果

修复后，Button组件在web平台上能够正常运行，不再出现BVLinearGradient相关错误，同时在移动端平台上仍然能够显示渐变效果。