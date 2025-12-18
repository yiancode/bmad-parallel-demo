/**
 * 用户模块 API 接口
 * 负责人: 开发者A
 */

import { getUserService } from './user.service.js';
import { successResponse, errorResponse } from '../../shared/middleware/response.js';

export class UserAPI {
  constructor() {
    this.userService = getUserService();
  }

  /**
   * POST /api/users/register
   * 用户注册
   */
  async register(req) {
    try {
      const user = await this.userService.register(req.body);
      return successResponse(user, 'User registered successfully');
    } catch (error) {
      return errorResponse(error, error.statusCode);
    }
  }

  /**
   * POST /api/users/login
   * 用户登录
   */
  async login(req) {
    try {
      const result = await this.userService.login(req.body);
      return successResponse(result, 'Login successful');
    } catch (error) {
      return errorResponse(error, error.statusCode);
    }
  }

  /**
   * GET /api/users/:id
   * 获取用户信息
   */
  async getUser(req) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      return successResponse(user);
    } catch (error) {
      return errorResponse(error, error.statusCode);
    }
  }

  /**
   * PUT /api/users/:id
   * 更新用户信息
   */
  async updateUser(req) {
    try {
      const user = await this.userService.updateUser(req.params.id, req.body);
      return successResponse(user, 'User updated successfully');
    } catch (error) {
      return errorResponse(error, error.statusCode);
    }
  }
}

export function getUserAPI() {
  return new UserAPI();
}
