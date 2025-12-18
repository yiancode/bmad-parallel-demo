# API 契约文档

本文档定义了所有模块的API接口规范，确保并行开发时接口一致性。

## 统一响应格式

### 成功响应
```json
{
  "success": true,
  "message": "Success message",
  "data": {},
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

### 错误响应
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "statusCode": 400
  },
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

## 用户模块 API (开发者A负责)

### 1. 用户注册
**POST** `/api/users/register`

**请求体:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "username": "username" // 可选
}
```

**响应:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "user_1234567890-abc",
    "email": "user@example.com",
    "username": "username",
    "role": "user",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**错误码:**
- `VALIDATION_ERROR` (400): 邮箱格式错误或密码不符合要求
- `VALIDATION_ERROR` (400): 邮箱已注册

---

### 2. 用户登录
**POST** `/api/users/login`

**请求体:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**响应:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_1234567890-abc",
      "email": "user@example.com",
      "username": "username",
      "role": "user"
    },
    "token": "token_user_1234567890-abc_1234567890"
  }
}
```

**错误码:**
- `UNAUTHORIZED` (401): 邮箱或密码错误

---

### 3. 获取用户信息
**GET** `/api/users/:id`

**响应:**
```json
{
  "success": true,
  "data": {
    "id": "user_1234567890-abc",
    "email": "user@example.com",
    "username": "username",
    "role": "user",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**错误码:**
- `NOT_FOUND` (404): 用户不存在

---

## 支付模块 API (开发者B负责)

### 1. 创建支付订单
**POST** `/api/payments`

**请求体:**
```json
{
  "orderId": "order_12345",
  "userId": "user_1234567890-abc",
  "amount": "99.99",
  "currency": "CNY", // 可选，默认CNY
  "paymentMethod": "alipay" // credit_card, debit_card, alipay, wechat
}
```

**响应:**
```json
{
  "success": true,
  "message": "Payment created successfully",
  "data": {
    "id": "pay_1234567890-xyz",
    "orderId": "order_12345",
    "userId": "user_1234567890-abc",
    "amount": 9999,
    "amountDisplay": "99.99",
    "currency": "CNY",
    "status": "pending",
    "paymentMethod": "alipay",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**错误码:**
- `VALIDATION_ERROR` (400): 必填字段缺失或金额无效
- `VALIDATION_ERROR` (400): 无效的支付方式

---

### 2. 处理支付
**POST** `/api/payments/:id/process`

**响应:**
```json
{
  "success": true,
  "message": "Payment processed",
  "data": {
    "success": true,
    "transactionId": "txn_1234567890-def",
    "message": "Payment processed successfully"
  }
}
```

**错误码:**
- `INVALID_STATUS` (400): 支付状态不是pending
- `PAYMENT_FAILED` (402): 支付处理失败
- `NOT_FOUND` (404): 支付记录不存在

---

### 3. 退款处理
**POST** `/api/payments/:id/refund`

**请求体:**
```json
{
  "amount": "50.00" // 可选，默认全额退款
}
```

**响应:**
```json
{
  "success": true,
  "message": "Refund processed",
  "data": {
    "success": true,
    "refundAmount": "99.99",
    "message": "Refund processed successfully"
  }
}
```

**错误码:**
- `INVALID_STATUS` (400): 只能退款已完成的支付
- `VALIDATION_ERROR` (400): 退款金额超过支付金额

---

### 4. 获取支付信息
**GET** `/api/payments/:id`

**响应:**
```json
{
  "success": true,
  "data": {
    "id": "pay_1234567890-xyz",
    "orderId": "order_12345",
    "userId": "user_1234567890-abc",
    "amount": 9999,
    "amountDisplay": "99.99",
    "status": "completed",
    "transactionId": "txn_1234567890-def"
  }
}
```

---

## 通知模块 API (开发者C负责)

### 1. 发送邮件
**POST** `/api/notifications/email`

**请求体:**
```json
{
  "userId": "user_1234567890-abc", // 可选
  "to": "user@example.com",
  "subject": "邮件主题",
  "content": "邮件内容"
}
```

**响应:**
```json
{
  "success": true,
  "message": "Email sent",
  "data": {
    "success": true,
    "notificationId": "notif_1234567890-ghi",
    "message": "Email sent successfully"
  }
}
```

**错误码:**
- `VALIDATION_ERROR` (400): 邮箱格式错误或主题/内容缺失
- `EMAIL_SEND_FAILED` (500): 邮件发送失败

---

### 2. 发送短信
**POST** `/api/notifications/sms`

**请求体:**
```json
{
  "userId": "user_1234567890-abc", // 可选
  "to": "13800138000",
  "message": "短信内容(最多70字符)"
}
```

**响应:**
```json
{
  "success": true,
  "message": "SMS sent",
  "data": {
    "success": true,
    "notificationId": "notif_1234567890-jkl",
    "message": "SMS sent successfully"
  }
}
```

**错误码:**
- `VALIDATION_ERROR` (400): 手机号格式错误或内容缺失/超长
- `SMS_SEND_FAILED` (500): 短信发送失败

---

### 3. 批量发送通知
**POST** `/api/notifications/bulk`

**请求体:**
```json
{
  "type": "email", // 或 "sms"
  "recipients": ["user1@example.com", "user2@example.com"],
  "subject": "主题", // email需要
  "content": "内容"
}
```

**响应:**
```json
{
  "success": true,
  "message": "Bulk notification processed",
  "data": {
    "total": 2,
    "success": 2,
    "failed": 0,
    "results": [
      { "recipient": "user1@example.com", "success": true, "notificationId": "notif_xxx" },
      { "recipient": "user2@example.com", "success": true, "notificationId": "notif_yyy" }
    ]
  }
}
```

---

### 4. 获取通知历史
**GET** `/api/notifications/user/:userId`

**查询参数:**
- `type`: 通知类型 (email, sms)
- `status`: 状态 (sending, sent, failed)
- `limit`: 返回数量 (默认50)

**响应:**
```json
{
  "success": true,
  "data": [
    {
      "id": "notif_1234567890-ghi",
      "userId": "user_1234567890-abc",
      "type": "email",
      "recipient": "user@example.com",
      "subject": "邮件主题",
      "status": "sent",
      "sentAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## 模块间依赖关系

```
用户模块 (User)
    ↓
    提供 userId
    ↓
支付模块 (Payment) ←→ 通知模块 (Notification)
    ↓                      ↓
    支付成功              发送通知
```

**协作流程:**
1. 用户注册/登录 (User模块)
2. 创建支付订单 (Payment模块，需要userId)
3. 处理支付 (Payment模块)
4. 发送通知 (Notification模块，通知支付结果)

---

## 并行开发注意事项

1. **接口先行**: 所有人先确认此API契约，再开始开发
2. **Mock数据**: 在依赖模块未完成前，使用Mock数据测试
3. **版本管理**: API变更需通知所有相关开发者
4. **错误处理**: 统一使用shared/middleware/response.js中的错误类
5. **数据验证**: 在Service层进行数据验证，API层只负责调用
