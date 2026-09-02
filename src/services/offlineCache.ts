import * as SQLite from 'expo-sqlite';

// ---------------------------------------------------------------------------
// 类型定义
// ---------------------------------------------------------------------------

/** 缓存数据类型标识 */
export type CacheType = 'diagnosis' | 'environment' | 'survey' | 'knowledge';

/** 同步队列类型标识 */
export type SyncType = 'diagnosis' | 'environment' | 'survey' | 'knowledge';

/** 同步队列状态 */
export type SyncStatus = 'pending' | 'synced' | 'failed';

/** 缓存行数据 */
export interface CacheRow<T = unknown> {
  id: string;
  userId: string;
  data: T;
  timestamp: number;
}

/** 知识库缓存行数据 */
export interface KnowledgeCacheRow<T = unknown> {
  id: string;
  articleId: string;
  data: T;
  timestamp: number;
}

/** 同步队列表行 */
export interface SyncQueueItem {
  id: string;
  type: SyncType;
  payload: unknown;
  status: SyncStatus;
  retryCount: number;
  createdAt: number;
}

// ---------------------------------------------------------------------------
// 数据库实例（单例）
// ---------------------------------------------------------------------------

const DB_NAME = 'offlineCache.db';
let db: SQLite.SQLiteDatabase | null = null;

/** 获取数据库实例（延迟初始化） */
const getDB = (): SQLite.SQLiteDatabase => {
  if (!db) {
    throw new Error('Database not initialized. Call initDB() first.');
  }
  return db;
};

// ---------------------------------------------------------------------------
// 初始化
// ---------------------------------------------------------------------------

/**
 * 初始化 SQLite 数据库并创建所需表
 *
 * 表结构：
 * - diagnosis_cache    — AI 诊断结果缓存
 * - environment_cache  — 环境检测数据缓存
 * - survey_cache       — 流调表单缓存
 * - knowledge_cache    — 科普文章缓存
 * - sync_queue         — 待同步写操作队列
 */
export async function initDB(): Promise<void> {
  if (db) {
    return; // 已初始化，幂等跳过
  }

  try {
    db = await SQLite.openDatabaseAsync(DB_NAME);

    const createTables = [
      `CREATE TABLE IF NOT EXISTS diagnosis_cache (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        data TEXT NOT NULL,
        timestamp INTEGER NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS environment_cache (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        data TEXT NOT NULL,
        timestamp INTEGER NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS survey_cache (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        data TEXT NOT NULL,
        timestamp INTEGER NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS knowledge_cache (
        id TEXT PRIMARY KEY,
        articleId TEXT NOT NULL UNIQUE,
        data TEXT NOT NULL,
        timestamp INTEGER NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS sync_queue (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        payload TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        retryCount INTEGER NOT NULL DEFAULT 0,
        createdAt INTEGER NOT NULL
      )`,
    ];

    for (const sql of createTables) {
      await db.execAsync(sql);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to initialize offline cache database: ${message}`);
  }
}

// ---------------------------------------------------------------------------
// 缓存读写
// ---------------------------------------------------------------------------

/** 内部：根据 cacheType 映射到表名 */
function tableName(type: CacheType): string {
  switch (type) {
    case 'diagnosis':
      return 'diagnosis_cache';
    case 'environment':
      return 'environment_cache';
    case 'survey':
      return 'survey_cache';
    case 'knowledge':
      return 'knowledge_cache';
  }
}

/**
 * 读取缓存
 * @param type 缓存类型
 * @param key   主键 id（knowledge 类型下为 articleId）
 * @returns 缓存数据，不存在返回 null
 */
export async function cacheGet<T = unknown>(
  type: CacheType,
  key: string,
): Promise<T | null> {
  const database = getDB();
  const table = tableName(type);

  try {
    const column = type === 'knowledge' ? 'articleId' : 'id';
    const rows = await database.getAllAsync(
      `SELECT data FROM ${table} WHERE ${column} = ?`,
      [key],
    );

    if (!rows || rows.length === 0) {
      return null;
    }

    return JSON.parse((rows[0] as Record<string, unknown>).data as string) as T;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`cacheGet(${type}, ${key}) failed: ${message}`);
  }
}

/**
 * 写入缓存（幂等 upsert）
 * @param type 缓存类型
 * @param key   主键 id（knowledge 类型下为 articleId）
 * @param data  任意可序列化数据
 */
export async function cacheSet<T = unknown>(
  type: CacheType,
  key: string,
  data: T,
): Promise<void> {
  const database = getDB();
  const table = tableName(type);
  const serialized = JSON.stringify(data);
  const timestamp = Date.now();

  try {
    if (type === 'knowledge') {
      await database.runAsync(
        `INSERT INTO ${table} (id, articleId, data, timestamp)
         VALUES (random(), ?, ?, ?)
         ON CONFLICT(articleId) DO UPDATE SET data = ?, timestamp = ?`,
        [key, serialized, timestamp, serialized, timestamp],
      );
    } else {
      await database.runAsync(
        `INSERT INTO ${table} (id, userId, data, timestamp)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET data = ?, timestamp = ?`,
        [key, key, serialized, timestamp, serialized, timestamp],
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`cacheSet(${type}, ${key}) failed: ${message}`);
  }
}

/**
 * 清除指定类型的所有缓存
 */
export async function clearCache(type: CacheType): Promise<void> {
  const database = getDB();
  const table = tableName(type);

  try {
    await database.runAsync(`DELETE FROM ${table}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`clearCache(${type}) failed: ${message}`);
  }
}

// ---------------------------------------------------------------------------
// 同步队列
// ---------------------------------------------------------------------------

/**
 * 将操作加入同步队列
 * @param type    同步类型
 * @param payload 任意可序列化载荷
 * @returns 新创建的队列记录 id
 */
export async function enqueueSync<T = unknown>(
  type: SyncType,
  payload: T,
): Promise<string> {
  const database = getDB();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const serialized = JSON.stringify(payload);
  const now = Date.now();

  try {
    await database.runAsync(
      `INSERT INTO sync_queue (id, type, payload, status, retryCount, createdAt)
       VALUES (?, ?, ?, 'pending', 0, ?)`,
      [id, type, serialized, now],
    );
    return id;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`enqueueSync(${type}) failed: ${message}`);
  }
}

/**
 * 获取所有 status = 'pending' 的同步项
 */
export async function getPendingSyncs(): Promise<SyncQueueItem[]> {
  const database = getDB();

  try {
    const rows = await database.getAllAsync(
      `SELECT id, type, payload, status, retryCount, createdAt
       FROM sync_queue
       WHERE status = 'pending'
       ORDER BY createdAt ASC`,
    );

    return (rows as Record<string, unknown>[]).map(
      (row): SyncQueueItem => ({
        id: row.id as string,
        type: row.type as SyncType,
        payload: JSON.parse(row.payload as string),
        status: row.status as SyncStatus,
        retryCount: row.retryCount as number,
        createdAt: row.createdAt as number,
      }),
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`getPendingSyncs failed: ${message}`);
  }
}

/**
 * 标记同步项为 'synced'
 */
export async function markSynced(id: string): Promise<void> {
  const database = getDB();

  try {
    await database.runAsync(
      `UPDATE sync_queue SET status = 'synced' WHERE id = ?`,
      [id],
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`markSynced(${id}) failed: ${message}`);
  }
}

/**
 * 标记同步项为 'failed'
 */
export async function markFailed(id: string): Promise<void> {
  const database = getDB();

  try {
    await database.runAsync(
      `UPDATE sync_queue SET status = 'failed' WHERE id = ?`,
      [id],
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`markFailed(${id}) failed: ${message}`);
  }
}

/**
 * 递增同步项的 retryCount
 */
export async function incrementRetry(id: string): Promise<number> {
  const database = getDB();

  try {
    await database.runAsync(
      `UPDATE sync_queue SET retryCount = retryCount + 1 WHERE id = ?`,
      [id],
    );
    const rows = await database.getAllAsync(
      `SELECT retryCount FROM sync_queue WHERE id = ?`,
      [id],
    );
    const row = rows?.[0] as Record<string, unknown> | undefined;
    return (row?.retryCount ?? 0) as number;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`incrementRetry(${id}) failed: ${message}`);
  }
}

/**
 * 更新同步项的 status（内部使用）
 */
export async function updateSyncStatus(
  id: string,
  status: SyncStatus,
): Promise<void> {
  const database = getDB();

  try {
    await database.runAsync(
      `UPDATE sync_queue SET status = ? WHERE id = ?`,
      [status, id],
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`updateSyncStatus(${id}, ${status}) failed: ${message}`);
  }
}
