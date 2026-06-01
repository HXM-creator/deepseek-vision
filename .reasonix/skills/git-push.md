---
name: git-push
description: 推送到 GitHub 仓库 — 自动 add、commit、push，无需记命令
---
# Git Push Skill

当你需要提交代码并推送到 GitHub 时使用此 skill。

## 仓库信息
- 远程: https://github.com/HXM-creator/deepseek-vision.git
- 分支: main

## 流程

1. **add** — 添加要提交的文件
   - 如果你指定了文件名，只 add 那些文件
   - 如果有多个文件需要 add，确认后逐个添加
   - 如果涉及新文件，先 git add 再确认

2. **commit** — 用有意义的中文或英文提交信息
   - 格式: `🎯 具体改动说明`
   - 如果是修复: `🐛 修复xxx`
   - 如果是新功能: `✨ 新增xxx`
   - 如果是文档: `📝 更新xxx`

3. **push** — 推送到 origin main
   - 直接执行 `git push`
   - 如果失败，检查远程 URL 是否正确

## 注意事项
- 不要 add 无关文件（dist/、*.exe、.reasonix/truncated-results/ 等已忽略）
- 提交前用 `git status --short` 确认只包含目标文件
- API Key 相关的文件（.env）永远不要提交
