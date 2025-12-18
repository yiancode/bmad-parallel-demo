/**
 * 数据库配置 - 共享模块
 * 所有模块共同依赖，优先级1完成
 *
 * ⚠️ 注意: 这是共享代码，修改需要团队协商
 */

// 模拟数据库连接池
class Database {
  constructor(config) {
    this.config = config;
    this.connected = false;
    this.tables = new Map();
  }

  async connect() {
    console.log('连接数据库...');
    // 模拟连接延迟
    await new Promise(resolve => setTimeout(resolve, 100));
    this.connected = true;
    console.log('✓ 数据库连接成功');
    return this;
  }

  async disconnect() {
    this.connected = false;
    console.log('✓ 数据库断开连接');
  }

  // 创建表
  createTable(tableName, schema) {
    if (!this.tables.has(tableName)) {
      this.tables.set(tableName, {
        schema,
        rows: []
      });
      console.log(`✓ 表 ${tableName} 创建成功`);
    }
    return this;
  }

  // 插入数据
  async insert(tableName, data) {
    if (!this.connected) {
      throw new Error('数据库未连接');
    }

    const table = this.tables.get(tableName);
    if (!table) {
      throw new Error(`表 ${tableName} 不存在`);
    }

    const id = table.rows.length + 1;
    const row = { id, ...data, createdAt: new Date() };
    table.rows.push(row);

    return row;
  }

  // 查询数据
  async find(tableName, query = {}) {
    if (!this.connected) {
      throw new Error('数据库未连接');
    }

    const table = this.tables.get(tableName);
    if (!table) {
      throw new Error(`表 ${tableName} 不存在`);
    }

    if (Object.keys(query).length === 0) {
      return table.rows;
    }

    return table.rows.filter(row => {
      return Object.entries(query).every(([key, value]) => row[key] === value);
    });
  }

  // 查询单条
  async findOne(tableName, query) {
    const results = await this.find(tableName, query);
    return results[0] || null;
  }

  // 更新数据
  async update(tableName, query, updates) {
    if (!this.connected) {
      throw new Error('数据库未连接');
    }

    const table = this.tables.get(tableName);
    if (!table) {
      throw new Error(`表 ${tableName} 不存在`);
    }

    const rows = await this.find(tableName, query);
    rows.forEach(row => {
      Object.assign(row, updates, { updatedAt: new Date() });
    });

    return rows.length;
  }

  // 删除数据
  async delete(tableName, query) {
    if (!this.connected) {
      throw new Error('数据库未连接');
    }

    const table = this.tables.get(tableName);
    if (!table) {
      throw new Error(`表 ${tableName} 不存在`);
    }

    const initialLength = table.rows.length;
    table.rows = table.rows.filter(row => {
      return !Object.entries(query).every(([key, value]) => row[key] === value);
    });

    return initialLength - table.rows.length;
  }
}

// 单例模式
let dbInstance = null;

export function getDatabase(config = {}) {
  if (!dbInstance) {
    dbInstance = new Database({
      host: config.host || 'localhost',
      port: config.port || 5432,
      database: config.database || 'bmad_demo',
      ...config
    });
  }
  return dbInstance;
}

export { Database };
