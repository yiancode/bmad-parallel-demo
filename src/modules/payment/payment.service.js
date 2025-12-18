/**
 * 支付服务 - 支付模块
 * 负责人: 开发者B
 * 分支: feature/payment-processing
 *
 * 功能:
 * - 创建支付订单
 * - 处理支付
 * - 退款处理
 * - 查询支付状态
 */

import { getDatabase } from '../../shared/database/db.js';
import { generateId, formatAmount, parseAmount } from '../../shared/utils/helpers.js';
import { ValidationError, NotFoundError, APIError } from '../../shared/middleware/response.js';

export class PaymentService {
  constructor() {
    this.db = getDatabase();
    this.tableName = 'payments';
  }

  /**
   * 初始化支付表
   */
  async initialize() {
    await this.db.connect();
    this.db.createTable(this.tableName, {
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
  }

  /**
   * 创建支付订单
   */
  async createPayment(paymentData) {
    const { orderId, userId, amount, currency = 'CNY', paymentMethod } = paymentData;

    // 验证必填字段
    if (!orderId || !userId || !amount) {
      throw new ValidationError('Missing required fields', {
        orderId: !orderId,
        userId: !userId,
        amount: !amount
      });
    }

    // 验证金额
    if (amount <= 0) {
      throw new ValidationError('Amount must be greater than 0', { amount });
    }

    // 验证支付方式
    const validMethods = ['credit_card', 'debit_card', 'alipay', 'wechat'];
    if (!validMethods.includes(paymentMethod)) {
      throw new ValidationError('Invalid payment method', { paymentMethod });
    }

    // 创建支付记录
    const payment = await this.db.insert(this.tableName, {
      id: generateId('pay_'),
      orderId,
      userId,
      amount: parseAmount(amount), // 转换为分
      currency,
      status: 'pending',
      paymentMethod,
      transactionId: null
    });

    return payment;
  }

  /**
   * 处理支付
   */
  async processPayment(paymentId) {
    const payment = await this.getPaymentById(paymentId);

    // 检查支付状态
    if (payment.status !== 'pending') {
      throw new APIError(
        `Payment already ${payment.status}`,
        'INVALID_STATUS',
        400
      );
    }

    // 模拟支付处理
    const success = Math.random() > 0.1; // 90%成功率

    if (success) {
      // 支付成功
      const transactionId = generateId('txn_');
      await this.db.update(
        this.tableName,
        { id: paymentId },
        {
          status: 'completed',
          transactionId,
          completedAt: new Date()
        }
      );

      return {
        success: true,
        transactionId,
        message: 'Payment processed successfully'
      };
    } else {
      // 支付失败
      await this.db.update(
        this.tableName,
        { id: paymentId },
        {
          status: 'failed',
          failedAt: new Date(),
          failureReason: 'Insufficient funds or payment declined'
        }
      );

      throw new APIError('Payment processing failed', 'PAYMENT_FAILED', 402);
    }
  }

  /**
   * 退款处理
   */
  async refund(paymentId, refundAmount) {
    const payment = await this.getPaymentById(paymentId);

    // 检查支付状态
    if (payment.status !== 'completed') {
      throw new APIError('Can only refund completed payments', 'INVALID_STATUS', 400);
    }

    // 验证退款金额
    const refundCents = refundAmount ? parseAmount(refundAmount) : payment.amount;

    if (refundCents > payment.amount) {
      throw new ValidationError('Refund amount exceeds payment amount', {
        refundAmount: formatAmount(refundCents),
        paymentAmount: formatAmount(payment.amount)
      });
    }

    // 处理退款
    await this.db.update(
      this.tableName,
      { id: paymentId },
      {
        status: 'refunded',
        refundAmount: refundCents,
        refundedAt: new Date()
      }
    );

    return {
      success: true,
      refundAmount: formatAmount(refundCents),
      message: 'Refund processed successfully'
    };
  }

  /**
   * 获取支付信息
   */
  async getPaymentById(paymentId) {
    const payment = await this.db.findOne(this.tableName, { id: paymentId });

    if (!payment) {
      throw new NotFoundError('Payment');
    }

    // 格式化金额显示
    return {
      ...payment,
      amountDisplay: formatAmount(payment.amount)
    };
  }

  /**
   * 获取用户的所有支付记录
   */
  async getPaymentsByUserId(userId) {
    const payments = await this.db.find(this.tableName, { userId });

    return payments.map(payment => ({
      ...payment,
      amountDisplay: formatAmount(payment.amount)
    }));
  }

  /**
   * 获取订单的支付记录
   */
  async getPaymentByOrderId(orderId) {
    const payment = await this.db.findOne(this.tableName, { orderId });

    if (!payment) {
      throw new NotFoundError('Payment for order');
    }

    return {
      ...payment,
      amountDisplay: formatAmount(payment.amount)
    };
  }
}

// 导出单例
let paymentServiceInstance = null;

export function getPaymentService() {
  if (!paymentServiceInstance) {
    paymentServiceInstance = new PaymentService();
  }
  return paymentServiceInstance;
}
