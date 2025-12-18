/**
 * 用户服务 - 用户模块
 * 负责人: 开发者A
 * 分支: feature/user-auth
 *
 * 功能:
 * - 用户注册
 * - 用户登录
 * - 权限验证
 */

import { getDatabase } from '../../shared/database/db.js';
import { generateId, isValidEmail, isStrongPassword } from '../../shared/utils/helpers.js';
import { ValidationError, UnauthorizedError, NotFoundError } from '../../shared/middleware/response.js';

export class UserService {
  constructor() {
    this.db = getDatabase();
    this.tableName = 'users';
  }

  /**
   * 初始化用户表
   */
  async initialize() {
    await this.db.connect();
    this.db.createTable(this.tableName, {
      id: 'string',
      email: 'string',
      password: 'string',
      username: 'string',
      role: 'string',
      createdAt: 'date'
    });
  }

  /**
   * 用户注册
   */
  async register(userData) {
    const { email, password, username } = userData;

    // 验证邮箱格式
    if (!isValidEmail(email)) {
      throw new ValidationError('Invalid email format', { email });
    }

    // 验证密码强度
    if (!isStrongPassword(password)) {
      throw new ValidationError(
        'Password must be at least 8 characters with uppercase, lowercase and numbers',
        { password }
      );
    }

    // 检查邮箱是否已存在
    const existingUser = await this.db.findOne(this.tableName, { email });
    if (existingUser) {
      throw new ValidationError('Email already registered', { email });
    }

    // 创建用户
    const user = await this.db.insert(this.tableName, {
      id: generateId('user_'),
      email,
      password: this._hashPassword(password), // 实际应用中应使用bcrypt
      username: username || email.split('@')[0],
      role: 'user'
    });

    // 移除密码字段
    delete user.password;

    return user;
  }

  /**
   * 用户登录
   */
  async login(credentials) {
    const { email, password } = credentials;

    // 查找用户
    const user = await this.db.findOne(this.tableName, { email });
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // 验证密码
    const hashedPassword = this._hashPassword(password);
    if (user.password !== hashedPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // 生成token(简化版)
    const token = this._generateToken(user);

    // 移除密码字段
    delete user.password;

    return {
      user,
      token
    };
  }

  /**
   * 获取用户信息
   */
  async getUserById(userId) {
    const user = await this.db.findOne(this.tableName, { id: userId });

    if (!user) {
      throw new NotFoundError('User');
    }

    delete user.password;
    return user;
  }

  /**
   * 更新用户信息
   */
  async updateUser(userId, updates) {
    const user = await this.getUserById(userId);

    // 不允许更新的字段
    delete updates.id;
    delete updates.password;
    delete updates.createdAt;

    await this.db.update(this.tableName, { id: userId }, updates);

    return await this.getUserById(userId);
  }

  /**
   * 验证权限
   */
  async checkPermission(userId, requiredRole) {
    const user = await this.getUserById(userId);

    const roleHierarchy = {
      user: 1,
      moderator: 2,
      admin: 3
    };

    const userLevel = roleHierarchy[user.role] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;

    if (userLevel < requiredLevel) {
      throw new UnauthorizedError('Insufficient permissions');
    }

    return true;
  }

  /**
   * 简化的密码哈希(实际应用中使用bcrypt)
   */
  _hashPassword(password) {
    return `hashed_${password}`;
  }

  /**
   * 简化的token生成(实际应用中使用JWT)
   */
  _generateToken(user) {
    return `token_${user.id}_${Date.now()}`;
  }
}

// 导出单例
let userServiceInstance = null;

export function getUserService() {
  if (!userServiceInstance) {
    userServiceInstance = new UserService();
  }
  return userServiceInstance;
}
