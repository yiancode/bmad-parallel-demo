/**
 * 应用程序主入口
 * 整合所有模块并提供演示
 */

import { getUserService } from './modules/user/user.service.js';
import { getPaymentService } from './modules/payment/payment.service.js';
import { getNotificationService } from './modules/notification/notification.service.js';

async function main() {
  console.log('==========================================');
  console.log('  BMAD-METHOD 并行开发演示项目');
  console.log('==========================================\n');

  try {
    // 初始化所有模块
    console.log('📦 初始化模块...\n');

    const userService = getUserService();
    const paymentService = getPaymentService();
    const notificationService = getNotificationService();

    // 只初始化一次数据库连接
    await userService.initialize();
    // 其他服务复用同一个数据库连接,只创建表
    userService.db.createTable('payments', {
      id: 'string',
      orderId: 'string',
      userId: 'string',
      amount: 'number',
      currency: 'string',
      status: 'string',
      paymentMethod: 'string',
      transactionId: 'string',
      createdAt: 'date'
    });
    userService.db.createTable('notifications', {
      id: 'string',
      userId: 'string',
      type: 'string',
      recipient: 'string',
      subject: 'string',
      content: 'string',
      status: 'string',
      sentAt: 'date',
      createdAt: 'date'
    });

    console.log('✓ 所有模块初始化完成\n');

    // ==========================================
    // 演示1: 用户注册流程 (开发者A负责)
    // ==========================================
    console.log('==========================================');
    console.log('演示1: 用户注册流程 (开发者A)');
    console.log('==========================================\n');

    const newUser = await userService.register({
      email: 'alice@example.com',
      password: 'SecurePass123',
      username: 'Alice'
    });

    console.log('✓ 用户注册成功:');
    console.log(`  - ID: ${newUser.id}`);
    console.log(`  - Email: ${newUser.email}`);
    console.log(`  - Username: ${newUser.username}\n`);

    // ==========================================
    // 演示2: 用户登录 (开发者A负责)
    // ==========================================
    console.log('==========================================');
    console.log('演示2: 用户登录 (开发者A)');
    console.log('==========================================\n');

    const loginResult = await userService.login({
      email: 'alice@example.com',
      password: 'SecurePass123'
    });

    console.log('✓ 用户登录成功:');
    console.log(`  - Token: ${loginResult.token.substring(0, 30)}...`);
    console.log(`  - User: ${loginResult.user.username}\n`);

    // ==========================================
    // 演示3: 创建支付订单 (开发者B负责)
    // ==========================================
    console.log('==========================================');
    console.log('演示3: 创建支付订单 (开发者B)');
    console.log('==========================================\n');

    const payment = await paymentService.createPayment({
      orderId: 'order_12345',
      userId: newUser.id,
      amount: '99.99',
      paymentMethod: 'alipay'
    });

    console.log('✓ 支付订单创建成功:');
    console.log(`  - Payment ID: ${payment.id}`);
    console.log(`  - Amount: ¥${payment.amountDisplay}`);
    console.log(`  - Method: ${payment.paymentMethod}`);
    console.log(`  - Status: ${payment.status}\n`);

    // ==========================================
    // 演示4: 处理支付 (开发者B负责)
    // ==========================================
    console.log('==========================================');
    console.log('演示4: 处理支付 (开发者B)');
    console.log('==========================================\n');

    try {
      const paymentResult = await paymentService.processPayment(payment.id);
      console.log('✓ 支付处理成功:');
      console.log(`  - Transaction ID: ${paymentResult.transactionId}`);
      console.log(`  - Message: ${paymentResult.message}\n`);
    } catch (error) {
      console.log('✗ 支付处理失败:');
      console.log(`  - Reason: ${error.message}\n`);
    }

    // ==========================================
    // 演示5: 发送通知 (开发者C负责)
    // ==========================================
    console.log('==========================================');
    console.log('演示5: 发送邮件通知 (开发者C)');
    console.log('==========================================\n');

    const emailResult = await notificationService.sendEmail({
      userId: newUser.id,
      to: 'alice@example.com',
      subject: '支付成功通知',
      content: '您的订单 order_12345 已支付成功，金额为 ¥99.99'
    });

    console.log('✓ 邮件发送成功:');
    console.log(`  - Notification ID: ${emailResult.notificationId}`);
    console.log(`  - Message: ${emailResult.message}\n`);

    // ==========================================
    // 演示6: 发送短信通知 (开发者C负责)
    // ==========================================
    console.log('==========================================');
    console.log('演示6: 发送短信通知 (开发者C)');
    console.log('==========================================\n');

    const smsResult = await notificationService.sendSMS({
      userId: newUser.id,
      to: '13800138000',
      message: '您的订单已支付成功，金额¥99.99'
    });

    console.log('✓ 短信发送成功:');
    console.log(`  - Notification ID: ${smsResult.notificationId}`);
    console.log(`  - Message: ${smsResult.message}\n`);

    // ==========================================
    // 总结
    // ==========================================
    console.log('==========================================');
    console.log('  演示完成！');
    console.log('==========================================\n');

    console.log('本演示展示了三个模块的并行开发:');
    console.log('  ✓ 用户模块 (开发者A) - 注册、登录');
    console.log('  ✓ 支付模块 (开发者B) - 创建订单、处理支付');
    console.log('  ✓ 通知模块 (开发者C) - 邮件、短信通知\n');

    console.log('每个模块独立开发，通过共享代码层协同工作。');
    console.log('这正是BMAD-METHOD并行开发的核心理念。\n');

  } catch (error) {
    console.error('\n❌ 错误:', error.message);
    console.error('详情:', error);
  }
}

// 运行演示
main().catch(console.error);
