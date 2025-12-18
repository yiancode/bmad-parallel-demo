# 演示指南

本指南将带你了解如何使用这个BMAD-METHOD并行开发演示项目。

## 快速开始

### 1. 运行演示程序

```bash
cd /Users/stinglong/code/github/bmad-parallel-demo
node src/index.js
```

你将看到一个完整的用户注册→登录→支付→通知的演示流程。

### 2. 查看项目结构

```bash
tree -L 3 -I 'node_modules'
```

**关键目录**:
- `src/modules/` - 三个并行开发的模块
- `src/shared/` - 共享代码层
- `docs/` - 项目文档
- `test/` - 测试文件

### 3. 查看Git分支

```bash
git branch -a
```

你会看到:
- `main` - 主分支
- `feature/user-auth` - 用户模块分支(开发者A)
- `feature/payment-processing` - 支付模块分支(开发者B)
- `feature/notification-service` - 通知模块分支(开发者C)

---

## 模拟并行开发场景

### 场景1: 开发者A修改用户模块

```bash
# 切换到用户模块分支
git checkout feature/user-auth

# 查看当前模块的代码
cat src/modules/user/user.service.js

# 进行修改...
# 例如: 添加用户头像功能

# 提交修改
git add src/modules/user/
git commit -m "feat(user): add avatar support"

# 同步main分支
git fetch origin
git rebase origin/main

# 推送到远程
git push origin feature/user-auth
```

### 场景2: 开发者B修改支付模块

```bash
# 切换到支付模块分支
git checkout feature/payment-processing

# 查看当前模块的代码
cat src/modules/payment/payment.service.js

# 进行修改...
# 例如: 添加微信支付支持

# 提交修改
git add src/modules/payment/
git commit -m "feat(payment): add WeChat Pay support"

# 推送到远程
git push origin feature/payment-processing
```

### 场景3: 开发者C修改通知模块

```bash
# 切换到通知模块分支
git checkout feature/notification-service

# 查看当前模块的代码
cat src/modules/notification/notification.service.js

# 进行修改...
# 例如: 添加推送通知功能

# 提交修改
git add src/modules/notification/
git commit -m "feat(notification): add push notification"

# 推送到远程
git push origin feature/notification-service
```

---

## 模拟修复Bug场景

### 场景: 支付失败没有正确处理

```bash
# 1. 从main创建hotfix分支
git checkout main
git checkout -b hotfix/payment-error-handling

# 2. 修复Bug
# 编辑 src/modules/payment/payment.service.js

# 3. 测试修复
node src/index.js

# 4. 提交修复
git add src/modules/payment/
git commit -m "fix(payment): improve error handling for failed payments"

# 5. 合并回main
git checkout main
git merge hotfix/payment-error-handling

# 6. 其他开发者同步
git checkout feature/user-auth
git rebase main

git checkout feature/payment-processing
git rebase main

git checkout feature/notification-service
git rebase main
```

---

## 使用BMAD-METHOD工作流

### 1. 分析阶段

查看现有代码结构:
```bash
# 查看项目架构
cat docs/architecture/system-design.md

# 查看API契约
cat docs/api/api-contracts.md
```

### 2. 规划阶段

查看用户故事:
```bash
# 查看用户模块Story
cat docs/stories/USER-001-user-auth.md

# 创建新的Story(示例)
cat > docs/stories/PAYMENT-001-payment-processing.md << 'EOF'
# 用户故事 - 支付处理模块
...
EOF
```

### 3. 实现阶段

按Story实现功能:
```bash
# 根据Story开发
# 参考 docs/stories/USER-001-user-auth.md

# 开发 → 测试 → 提交 → PR
```

---

## 查看文档

### API契约文档
```bash
cat docs/api/api-contracts.md
```
这个文档定义了所有模块的接口规范,确保并行开发时接口一致。

### Git分支策略
```bash
cat docs/git-strategy.md
```
这个文档说明了:
- 如何创建和管理分支
- 如何解决冲突
- 提交信息规范
- 最佳实践

### 用户故事
```bash
cat docs/stories/USER-001-user-auth.md
```
这个文档包含:
- 功能需求
- 验收标准
- 技术实现
- 测试用例

---

## 理解并行开发的关键

### 1. 模块隔离

每个开发者只修改自己的模块目录:
```
src/modules/
├── user/            # 开发者A的工作区 ✅
│   ├── user.service.js
│   └── user.api.js
├── payment/         # 开发者B的工作区 ✅
│   ├── payment.service.js
│   └── payment.api.js
└── notification/    # 开发者C的工作区 ✅
    ├── notification.service.js
    └── notification.api.js
```

**原则**: 不要跨模块修改!

### 2. 共享代码层

共享代码提前完成,所有人依赖:
```
src/shared/
├── database/        # 数据库层 (优先级1)
├── utils/           # 工具函数 (优先级1)
└── middleware/      # 中间件 (优先级1)
```

**原则**: 共享代码变更需团队协商!

### 3. API契约先行

在开始并行开发前,所有人确认API接口:
```bash
# 1. 先定义API
cat docs/api/api-contracts.md

# 2. 所有人确认
# 3. 开始并行开发
```

**原则**: 接口确定后才开始开发!

---

## 实际操作练习

### 练习1: 添加新功能

**任务**: 为用户模块添加"修改密码"功能

```bash
# 1. 切换到用户模块分支
git checkout feature/user-auth

# 2. 更新API契约
vim docs/api/api-contracts.md
# 添加: PUT /api/users/:id/password

# 3. 实现功能
vim src/modules/user/user.service.js
# 添加 changePassword() 方法

# 4. 更新API层
vim src/modules/user/user.api.js
# 添加 changePassword 端点

# 5. 提交
git add .
git commit -m "feat(user): add change password functionality"
```

### 练习2: 修复Bug

**任务**: 修复支付金额验证Bug

```bash
# 1. 创建hotfix分支
git checkout main
git checkout -b hotfix/payment-amount-validation

# 2. 修复Bug
vim src/modules/payment/payment.service.js
# 修改金额验证逻辑

# 3. 测试
node src/index.js

# 4. 提交
git add .
git commit -m "fix(payment): validate amount is positive number"

# 5. 合并
git checkout main
git merge hotfix/payment-amount-validation
```

### 练习3: 处理冲突

**任务**: 两个开发者同时修改package.json

```bash
# 开发者A
git checkout feature/user-auth
# 修改 package.json (添加bcrypt)
git add package.json
git commit -m "chore: add bcrypt for password hashing"
git push

# 开发者B (稍后)
git checkout feature/payment-processing
# 修改 package.json (添加stripe)
git fetch origin
git rebase origin/main
# 解决冲突
# 编辑 package.json,保留两个依赖
git add package.json
git rebase --continue
git push
```

---

## 监控进度

### 查看提交历史
```bash
git log --oneline --graph --all
```

### 查看文件修改
```bash
git log -p src/modules/user/user.service.js
```

### 查看分支状态
```bash
git branch -vv
```

### 查看未合并的分支
```bash
git branch --no-merged main
```

---

## 下一步学习

1. **深入BMAD-METHOD**
   - 阅读 BMAD-METHOD 官方文档
   - 了解21个AI代理的作用
   - 学习50+工作流

2. **实践项目**
   - 在自己的项目中应用这些模式
   - 调整工作流适应团队需求

3. **扩展演示项目**
   - 添加更多模块(订单、库存、评价)
   - 添加真实的数据库
   - 添加API服务器
   - 添加前端界面

---

## 常见问题

### Q: 如何处理共享代码的修改?

**A**: 提前沟通,时间错开提交
```bash
# 在团队群组中声明
"我需要修改 src/shared/database/db.js，
 预计今天下午2点提交，请避开"
```

### Q: 多个功能分支如何测试集成?

**A**: 创建集成测试分支
```bash
git checkout -b integration/test-all-features
git merge feature/user-auth
git merge feature/payment-processing
git merge feature/notification-service
# 运行集成测试
npm run test:integration
```

### Q: 如何回滚已合并的代码?

**A**: 使用git revert
```bash
git revert <commit-hash>
git push
```

### Q: 分支太久没同步,冲突很多怎么办?

**A**: 小步rebase,逐个解决
```bash
git rebase -i origin/main
# 按日期逐个commit rebase
# 每次解决一小部分冲突
```

---

## 总结

这个演示项目展示了:
- ✅ 模块化架构
- ✅ 并行开发策略
- ✅ Git分支管理
- ✅ API契约设计
- ✅ 冲突避免技巧
- ✅ BMAD-METHOD工作流

**核心理念**: 通过良好的架构设计和工作流程,实现真正的并行开发,提高团队效率。
