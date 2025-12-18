/**
 * 通知服务 - 通知模块
 * 负责人: 开发者C
 * 分支: feature/notification-service
 *
 * 功能:
 * - 发送邮件通知
 * - 发送短信通知
 * - 通知历史记录
 * - 批量通知
 */

import { getDatabase } from '../../shared/database/db.js';
import { generateId, isValidEmail, isValidPhone, delay } from '../../shared/utils/helpers.js';
import { ValidationError, NotFoundError, APIError } from '../../shared/middleware/response.js';

export class NotificationService {
  constructor() {
    this.db = getDatabase();
    this.tableName = 'notifications';
  }

  /**
   * 初始化通知表
   */
  async initialize() {
    await this.db.connect();
    this.db.createTable(this.tableName, {
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
  }

  /**
   * 发送邮件通知
   */
  async sendEmail(emailData) {
    const { userId, to, subject, content } = emailData;

    // 验证邮箱
    if (!isValidEmail(to)) {
      throw new ValidationError('Invalid email address', { to });
    }

    // 验证必填字段
    if (!subject || !content) {
      throw new ValidationError('Subject and content are required', {
        subject: !subject,
        content: !content
      });
    }

    // 创建通知记录
    const notification = await this.db.insert(this.tableName, {
      id: generateId('notif_'),
      userId: userId || null,
      type: 'email',
      recipient: to,
      subject,
      content,
      status: 'sending'
    });

    try {
      // 模拟发送邮件
      await this._sendEmailProvider(to, subject, content);

      // 更新状态为已发送
      await this.db.update(
        this.tableName,
        { id: notification.id },
        {
          status: 'sent',
          sentAt: new Date()
        }
      );

      return {
        success: true,
        notificationId: notification.id,
        message: 'Email sent successfully'
      };
    } catch (error) {
      // 更新状态为失败
      await this.db.update(
        this.tableName,
        { id: notification.id },
        {
          status: 'failed',
          error: error.message
        }
      );

      throw new APIError('Failed to send email', 'EMAIL_SEND_FAILED', 500);
    }
  }

  /**
   * 发送短信通知
   */
  async sendSMS(smsData) {
    const { userId, to, message } = smsData;

    // 验证手机号
    if (!isValidPhone(to)) {
      throw new ValidationError('Invalid phone number', { to });
    }

    // 验证消息内容
    if (!message || message.length === 0) {
      throw new ValidationError('Message content is required');
    }

    // 验证短信长度(限制70字符)
    if (message.length > 70) {
      throw new ValidationError('SMS message too long (max 70 characters)', {
        length: message.length
      });
    }

    // 创建通知记录
    const notification = await this.db.insert(this.tableName, {
      id: generateId('notif_'),
      userId: userId || null,
      type: 'sms',
      recipient: to,
      subject: 'SMS',
      content: message,
      status: 'sending'
    });

    try {
      // 模拟发送短信
      await this._sendSMSProvider(to, message);

      // 更新状态为已发送
      await this.db.update(
        this.tableName,
        { id: notification.id },
        {
          status: 'sent',
          sentAt: new Date()
        }
      );

      return {
        success: true,
        notificationId: notification.id,
        message: 'SMS sent successfully'
      };
    } catch (error) {
      // 更新状态为失败
      await this.db.update(
        this.tableName,
        { id: notification.id },
        {
          status: 'failed',
          error: error.message
        }
      );

      throw new APIError('Failed to send SMS', 'SMS_SEND_FAILED', 500);
    }
  }

  /**
   * 批量发送通知
   */
  async sendBulk(bulkData) {
    const { type, recipients, subject, content } = bulkData;

    if (!['email', 'sms'].includes(type)) {
      throw new ValidationError('Invalid notification type', { type });
    }

    if (!Array.isArray(recipients) || recipients.length === 0) {
      throw new ValidationError('Recipients array is required');
    }

    const results = [];

    for (const recipient of recipients) {
      try {
        let result;
        if (type === 'email') {
          result = await this.sendEmail({
            to: recipient,
            subject,
            content
          });
        } else {
          result = await this.sendSMS({
            to: recipient,
            message: content
          });
        }
        results.push({ recipient, ...result });
      } catch (error) {
        results.push({
          recipient,
          success: false,
          error: error.message
        });
      }
    }

    const successCount = results.filter(r => r.success).length;

    return {
      total: recipients.length,
      success: successCount,
      failed: recipients.length - successCount,
      results
    };
  }

  /**
   * 获取通知历史
   */
  async getNotificationHistory(userId, options = {}) {
    const { type, status, limit = 50 } = options;

    let query = { userId };

    if (type) query.type = type;
    if (status) query.status = status;

    const notifications = await this.db.find(this.tableName, query);

    // 按创建时间倒序排列
    notifications.sort((a, b) => b.createdAt - a.createdAt);

    return notifications.slice(0, limit);
  }

  /**
   * 获取通知详情
   */
  async getNotificationById(notificationId) {
    const notification = await this.db.findOne(this.tableName, { id: notificationId });

    if (!notification) {
      throw new NotFoundError('Notification');
    }

    return notification;
  }

  /**
   * 模拟邮件发送服务
   */
  async _sendEmailProvider(to, subject, content) {
    // 模拟网络延迟
    await delay(100);

    // 90%成功率
    if (Math.random() > 0.9) {
      throw new Error('Email provider error');
    }

    console.log(`✓ Email sent to ${to}: ${subject}`);
    return true;
  }

  /**
   * 模拟短信发送服务
   */
  async _sendSMSProvider(to, message) {
    // 模拟网络延迟
    await delay(150);

    // 95%成功率
    if (Math.random() > 0.95) {
      throw new Error('SMS provider error');
    }

    console.log(`✓ SMS sent to ${to}: ${message.substring(0, 20)}...`);
    return true;
  }
}

// 导出单例
let notificationServiceInstance = null;

export function getNotificationService() {
  if (!notificationServiceInstance) {
    notificationServiceInstance = new NotificationService();
  }
  return notificationServiceInstance;
}
