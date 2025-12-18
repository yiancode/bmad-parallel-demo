# Git 分支策略

本文档定义了并行开发的Git工作流程和分支管理规范。

## 分支结构

```
main (生产分支)
└── feature/* (功能开发分支)
    ├── feature/user-auth            (开发者A)
    ├── feature/payment-processing   (开发者B)
    └── feature/notification-service (开发者C)
```

## 分支命名规范

### 功能分支
格式: `feature/功能描述`
- `feature/user-auth` - 用户认证功能
- `feature/payment-processing` - 支付处理功能
- `feature/notification-service` - 通知服务功能

### 修复分支
格式: `hotfix/bug描述`
- `hotfix/payment-failure` - 修复支付失败问题
- `hotfix/email-validation` - 修复邮箱验证问题

### 重构分支
格式: `refactor/重构内容`
- `refactor/database-layer` - 重构数据库层

---

## 并行开发工作流程

### 1. 创建功能分支

```bash
# 从main创建新分支
git checkout main
git pull origin main
git checkout -b feature/your-feature-name

# 示例
git checkout -b feature/user-auth
```

### 2. 开发过程

```bash
# 频繁提交小改动
git add .
git commit -m "feat: add user registration logic"

# 每天同步main分支一次
git fetch origin
git rebase origin/main

# 如果有冲突,解决后继续
git rebase --continue
```

### 3. 提交代码

```bash
# 推送到远程
git push origin feature/your-feature-name

# 第一次推送
git push -u origin feature/your-feature-name
```

### 4. 创建PR

```bash
# 使用GitHub CLI(如果安装了gh)
gh pr create --title "feat: implement user authentication" \
             --body "实现用户注册和登录功能，包含完整测试"

# 或通过GitHub网页创建PR
```

### 5. 代码审查

- PR必须至少1人审查通过
- 所有测试必须通过
- 无合并冲突
- 代码符合规范

### 6. 合并代码

```bash
# 使用Squash Merge(推荐)
# 将多个commit合并为一个,保持main分支整洁

# 或使用Rebase Merge
# 保留所有commit历史
```

---

## 冲突解决策略

### 场景1: package.json冲突

**问题**: 多人同时添加依赖

**解决方案**: 时间错开提交

```bash
# 开发者A: 周一上午10:00提交
git add package.json
git commit -m "chore: add lodash dependency"
git push

# 开发者B: 周一下午14:00提交(先rebase)
git fetch origin
git rebase origin/main
# 解决冲突后
git add package.json
git rebase --continue
git push
```

### 场景2: 共享文件冲突

**问题**: 多人修改src/shared/下的文件

**解决方案**: 提前沟通,分配修改时间

```bash
# 在团队群组/Issue中声明
"我需要修改 src/shared/database/db.js，
 预计今天下午2点提交，请其他人避开"
```

### 场景3: 模块间冲突

**问题**: 模块之间的接口依赖导致冲突

**解决方案**: API契约先行

```bash
# 1. 先在docs/api/api-contracts.md定义接口
# 2. 所有人确认后再开始开发
# 3. 接口变更需通知所有人
```

---

## 提交信息规范

### 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type类型

- `feat`: 新功能
- `fix`: Bug修复
- `docs`: 文档更新
- `style`: 代码格式(不影响功能)
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建/工具相关

### 示例

```bash
feat(user): implement user registration

- Add email validation
- Add password strength check
- Create user service and API

Closes #123
```

```bash
fix(payment): handle payment failure correctly

Previously payment failure would throw unhandled exception.
Now properly catches error and returns appropriate response.

Fixes #456
```

---

## 最佳实践

### ✅ 推荐做法

1. **小步提交**
   ```bash
   git commit -m "feat(user): add email validation"
   git commit -m "feat(user): add password validation"
   git commit -m "feat(user): create user service"
   ```

2. **频繁同步**
   ```bash
   # 每天至少一次
   git fetch origin
   git rebase origin/main
   ```

3. **测试先行**
   ```bash
   # 提交前运行测试
   npm test
   git add .
   git commit -m "feat: add feature"
   ```

4. **PR小而聚焦**
   - 一个PR只做一件事
   - PR大小保持在200-400行
   - 最多不超过800行

5. **代码审查**
   - 及时审查他人PR(24小时内)
   - 审查时运行代码测试
   - 提出建设性意见

### ❌ 避免做法

1. **不要长期不合并**
   ```bash
   # ❌ 错误: 功能分支开发2周才合并
   # ✅ 正确: 每完成一个小功能就合并
   ```

2. **不要直接修改main**
   ```bash
   # ❌ 错误
   git checkout main
   # 直接修改文件
   git commit -m "fix bug"

   # ✅ 正确
   git checkout -b hotfix/bug-fix
   # 修改文件
   git commit -m "fix: bug description"
   # 提交PR审查
   ```

3. **不要跳过测试**
   ```bash
   # ❌ 错误
   git commit --no-verify -m "quick fix"

   # ✅ 正确
   npm test
   git commit -m "fix: description"
   ```

4. **不要强制推送**
   ```bash
   # ❌ 危险
   git push --force

   # ✅ 正确
   git push
   # 或者在确认无人使用该分支时
   git push --force-with-lease
   ```

---

## 紧急修复流程

### Hotfix工作流

```bash
# 1. 从main创建hotfix分支
git checkout main
git pull origin main
git checkout -b hotfix/payment-failure

# 2. 修复Bug
# 修改代码...

# 3. 测试修复
npm test

# 4. 提交
git add .
git commit -m "fix(payment): handle null payment method"

# 5. 推送并创建PR
git push -u origin hotfix/payment-failure
gh pr create --title "hotfix: fix payment failure" \
             --label "priority:high" \
             --label "type:bug"

# 6. 快速审查并合并
# 审查通过后立即合并到main

# 7. 同步到所有功能分支
git checkout feature/your-feature
git rebase origin/main
```

---

## 分支生命周期

### 功能分支

```
创建 → 开发 → 提交PR → 审查 → 合并 → 删除分支
1天    3-5天   1天     1天    ✓     立即
```

### Hotfix分支

```
创建 → 修复 → 提交PR → 审查 → 合并 → 删除分支
0.5h   1-2h   0.5h    0.5h   ✓     立即
```

---

## 分支保护规则

### main分支保护

- ✅ 要求PR审查
- ✅ 要求测试通过
- ✅ 要求分支最新(no behind)
- ❌ 禁止直接推送
- ❌ 禁止强制推送

### 功能分支

- ✅ 允许force push(自己的分支)
- ✅ 可以rebase重写历史
- ⚠️ 如果有他人基于此分支工作,需要协商

---

## 常用Git命令速查

```bash
# 查看所有分支
git branch -a

# 查看当前状态
git status

# 查看提交历史
git log --oneline --graph

# 查看某个文件的修改历史
git log -p src/modules/user/user.service.js

# 暂存当前修改
git stash
git stash pop

# 撤销上一次提交(保留修改)
git reset --soft HEAD~1

# 修改上一次提交信息
git commit --amend

# 查看远程分支
git remote -v

# 清理已合并的分支
git branch --merged | grep -v "\*" | xargs -n 1 git branch -d
```

---

## 团队协作建议

1. **每日站会**: 同步进度,识别冲突
2. **共享日历**: 标记计划的共享文件修改时间
3. **Issue跟踪**: 所有任务在Issue中跟踪
4. **代码审查轮换**: 交叉审查彼此的代码
5. **文档先行**: 修改API接口前先更新文档
