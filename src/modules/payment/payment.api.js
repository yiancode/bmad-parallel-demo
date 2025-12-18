/**
 * 支付模块 API 接口
 * 负责人: 开发者B
 */

import { getPaymentService } from './payment.service.js';
import { successResponse, errorResponse } from '../../shared/middleware/response.js';

export class PaymentAPI {
  constructor() {
    this.paymentService = getPaymentService();
  }

  /**
   * POST /api/payments
   * 创建支付订单
   */
  async createPayment(req) {
    try {
      const payment = await this.paymentService.createPayment(req.body);
      return successResponse(payment, 'Payment created successfully');
    } catch (error) {
      return errorResponse(error, error.statusCode);
    }
  }

  /**
   * POST /api/payments/:id/process
   * 处理支付
   */
  async processPayment(req) {
    try {
      const result = await this.paymentService.processPayment(req.params.id);
      return successResponse(result, 'Payment processed');
    } catch (error) {
      return errorResponse(error, error.statusCode);
    }
  }

  /**
   * POST /api/payments/:id/refund
   * 退款处理
   */
  async refund(req) {
    try {
      const result = await this.paymentService.refund(
        req.params.id,
        req.body.amount
      );
      return successResponse(result, 'Refund processed');
    } catch (error) {
      return errorResponse(error, error.statusCode);
    }
  }

  /**
   * GET /api/payments/:id
   * 获取支付信息
   */
  async getPayment(req) {
    try {
      const payment = await this.paymentService.getPaymentById(req.params.id);
      return successResponse(payment);
    } catch (error) {
      return errorResponse(error, error.statusCode);
    }
  }

  /**
   * GET /api/payments/user/:userId
   * 获取用户支付记录
   */
  async getUserPayments(req) {
    try {
      const payments = await this.paymentService.getPaymentsByUserId(req.params.userId);
      return successResponse(payments);
    } catch (error) {
      return errorResponse(error, error.statusCode);
    }
  }
}

export function getPaymentAPI() {
  return new PaymentAPI();
}
