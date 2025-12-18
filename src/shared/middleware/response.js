/**
 * API 响应格式化 - 共享中间件
 * 统一的API响应格式
 */

/**
 * 成功响应
 */
export function successResponse(data, message = 'Success') {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };
}

/**
 * 错误响应
 */
export function errorResponse(error, statusCode = 500) {
  return {
    success: false,
    error: {
      code: error.code || 'INTERNAL_ERROR',
      message: error.message || 'An error occurred',
      statusCode
    },
    timestamp: new Date().toISOString()
  };
}

/**
 * 分页响应
 */
export function paginatedResponse(data, pagination) {
  return {
    success: true,
    data,
    pagination: {
      page: pagination.page || 1,
      pageSize: pagination.pageSize || 10,
      total: pagination.total || data.length,
      totalPages: Math.ceil((pagination.total || data.length) / (pagination.pageSize || 10))
    },
    timestamp: new Date().toISOString()
  };
}

/**
 * 自定义错误类
 */
export class APIError extends Error {
  constructor(message, code = 'API_ERROR', statusCode = 500) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

/**
 * 验证错误
 */
export class ValidationError extends APIError {
  constructor(message, fields = {}) {
    super(message, 'VALIDATION_ERROR', 400);
    this.fields = fields;
  }
}

/**
 * 未授权错误
 */
export class UnauthorizedError extends APIError {
  constructor(message = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

/**
 * 资源未找到错误
 */
export class NotFoundError extends APIError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 'NOT_FOUND', 404);
  }
}
