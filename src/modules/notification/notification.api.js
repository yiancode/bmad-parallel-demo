/**
 * 通知模块 API 接口
 * 负责人: 开发者C
 */

import { getNotificationService } from './notification.service.js';
import { successResponse, errorResponse } from '../../shared/middleware/response.js';

export class NotificationAPI {
  constructor() {
    this.notificationService = getNotificationService();
  }

  /**
   * POST /api/notifications/email
   * 发送邮件
   */
  async sendEmail(req) {
    try {
      const result = await this.notificationService.sendEmail(req.body);
      return successResponse(result, 'Email sent');
    } catch (error) {
      return errorResponse(error, error.statusCode);
    }
  }

  /**
   * POST /api/notifications/sms
   * 发送短信
   */
  async sendSMS(req) {
    try {
      const result = await this.notificationService.sendSMS(req.body);
      return successResponse(result, 'SMS sent');
    } catch (error) {
      return errorResponse(error, error.statusCode);
    }
  }

  /**
   * POST /api/notifications/bulk
   * 批量发送通知
   */
  async sendBulk(req) {
    try {
      const result = await this.notificationService.sendBulk(req.body);
      return successResponse(result, 'Bulk notification processed');
    } catch (error) {
      return errorResponse(error, error.statusCode);
    }
  }

  /**
   * GET /api/notifications/user/:userId
   * 获取用户通知历史
   */
  async getUserNotifications(req) {
    try {
      const notifications = await this.notificationService.getNotificationHistory(
        req.params.userId,
        req.query
      );
      return successResponse(notifications);
    } catch (error) {
      return errorResponse(error, error.statusCode);
    }
  }

  /**
   * GET /api/notifications/:id
   * 获取通知详情
   */
  async getNotification(req) {
    try {
      const notification = await this.notificationService.getNotificationById(
        req.params.id
      );
      return successResponse(notification);
    } catch (error) {
      return errorResponse(error, error.statusCode);
    }
  }
}

export function getNotificationAPI() {
  return new NotificationAPI();
}
