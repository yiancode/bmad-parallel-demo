/**
 * 工具函数 - 共享模块
 * 所有模块共同使用的辅助函数
 */

/**
 * 生成唯一ID
 */
export function generateId(prefix = '') {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}${timestamp}-${random}`;
}

/**
 * 验证邮箱格式
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 验证手机号格式(中国)
 */
export function isValidPhone(phone) {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * 密码强度检查
 * 至少8位，包含大小写字母和数字
 */
export function isStrongPassword(password) {
  if (password.length < 8) return false;

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  return hasUpperCase && hasLowerCase && hasNumber;
}

/**
 * 格式化金额(分转元)
 */
export function formatAmount(cents) {
  return (cents / 100).toFixed(2);
}

/**
 * 解析金额(元转分)
 */
export function parseAmount(yuan) {
  return Math.round(parseFloat(yuan) * 100);
}

/**
 * 延迟函数
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 格式化日期
 */
export function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 深拷贝对象
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 移除对象中的空值
 */
export function removeEmpty(obj) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {});
}
