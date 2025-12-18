# BMAD-METHOD 并行开发演示项目

这是一个完整的演示项目，展示如何使用 **BMAD-METHOD** 框架进行多人并行开发。

## 项目场景

我们正在开发一个 **电商平台后端服务**，包含以下功能模块：

1. **用户模块** (user) - 注册、登录、权限管理
2. **支付模块** (payment) - 订单支付、退款处理
3. **通知模块** (notification) - 邮件、短信通知

## 并行开发策略

### 团队分工

| 成员 | 负责模块 | Git分支 | 开发周期 |
|------|---------|---------|----------|
| 开发者A | 用户模块 | `feature/user-auth` | Week 1-2 |
| 开发者B | 支付模块 | `feature/payment-processing` | Week 1-2 |
| 开发者C | 通知模块 | `feature/notification-service` | Week 2-3 |

### 分支策略

```
main (生产分支)
├── develop (开发分支)
│   ├── feature/user-auth (开发者A)
│   ├── feature/payment-processing (开发者B)
│   └── feature/notification-service (开发者C)
└── hotfix/* (紧急修复)
```

## 项目结构

```
bmad-parallel-demo/
├── src/
│   ├── modules/              # 功能模块(并行开发区)
│   │   ├── user/            # 开发者A的工作区
│   │   ├── payment/         # 开发者B的工作区
│   │   └── notification/    # 开发者C的工作区
│   ├── shared/              # 共享代码(协同维护)
│   │   ├── database/        # 数据库配置
│   │   ├── utils/           # 工具函数
│   │   └── middleware/      # 中间件
│   └── index.js             # 应用入口
├── test/                    # 测试文件
│   ├── modules/             # 模块测试
│   └── integration/         # 集成测试
├── docs/                    # 项目文档
│   ├── prd/                 # 产品需求文档
│   ├── architecture/        # 架构设计
│   └── api/                 # API契约
└── .bmad/                   # BMAD工作流配置
    ├── stories/             # 用户故事
    └── workflows/           # 自定义工作流
```

## BMAD-METHOD 工作流

### 1. 分析阶段 (Analysis)
```bash
# 分析现有代码库
bmad analyze

# 研究技术方案
bmad research
```

### 2. 规划阶段 (Planning)
```bash
# 创建PRD
bmad create-prd

# 拆解用户故事
bmad create-stories

# 输出: docs/stories/user-*.md
```

### 3. 解决方案阶段 (Solutioning)
```bash
# 设计系统架构
bmad design-system

# 定义API契约
bmad create-api-spec

# 输出: docs/api/api-contracts.md
```

### 4. 实现阶段 (Implementation)
```bash
# 每个开发者独立实现Story
bmad implement-story --story=user-registration
bmad implement-story --story=payment-processing
bmad implement-story --story=notification-service
```

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 查看当前分支
```bash
git branch -a
```

### 3. 切换到功能分支(模拟开发者)
```bash
# 模拟开发者A
git checkout feature/user-auth

# 模拟开发者B
git checkout feature/payment-processing

# 模拟开发者C
git checkout feature/notification-service
```

### 4. 运行测试
```bash
# 运行所有测试
npm test

# 运行单个模块测试
npm run test:user
npm run test:payment
npm run test:notification
```

## 并行开发最佳实践

### ✅ 做什么

1. **模块隔离**: 每个开发者只修改自己负责的模块目录
2. **API先行**: 先定义接口契约，再并行实现
3. **频繁同步**: 每天rebase主分支一次
4. **小步提交**: 每个PR保持在200-400行代码
5. **测试驱动**: 先写测试，再写实现

### ❌ 不做什么

1. **避免修改共享文件**: 如package.json、database schema
2. **避免大改动**: 不在功能开发中重构共享代码
3. **避免跨模块修改**: 不要修改其他人负责的模块
4. **避免长期分支**: 功能分支不超过2周

## 冲突解决示例

### 场景1: package.json冲突
```bash
# 解决方案: 时间错开提交
开发者A: 周一上午提交依赖变更
开发者B: 周一下午rebase后再提交
开发者C: 周二上午rebase后再提交
```

### 场景2: 数据库Schema冲突
```bash
# 解决方案: 使用迁移文件编号
migrations/001_create_users_table.sql     (开发者A)
migrations/002_create_payments_table.sql  (开发者B)
migrations/003_create_notifications_table.sql (开发者C)
```

## 学习资源

- [BMAD-METHOD 官方文档](https://github.com/anthropics/BMAD-METHOD)
- [Git分支策略](./docs/git-strategy.md)
- [API契约文档](./docs/api/api-contracts.md)
- [架构设计文档](./docs/architecture/system-design.md)

## 下一步

1. 查看 `docs/stories/` 目录了解每个功能Story
2. 阅读 `docs/api/api-contracts.md` 了解API设计
3. 切换到功能分支开始开发
4. 提交PR前运行 `npm test` 确保测试通过

---

**注意**: 这是一个教学演示项目，展示BMAD-METHOD在实际项目中的应用。
