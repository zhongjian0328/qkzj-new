import NetInfo from '@react-native-community/netinfo';
import {
  getPendingSyncs,
  markSynced,
  markFailed,
  incrementRetry,
  SyncQueueItem,
  SyncType,
} from './offlineCache';
import {
  aiDiagnosisApi,
  environmentApi,
  surveyApi,
  knowledgeApi,
} from './api';

// ---------------------------------------------------------------------------
// 常量与状态
// ---------------------------------------------------------------------------

const SYNC_INTERVAL_MS = 30_000; // 每 30 秒检查一次
const MAX_RETRIES = 3; // 单条最大重试次数

let syncTimer: ReturnType<typeof setInterval> | null = null;
let _isSyncing = false;

// 状态订阅器
const syncingListeners = new Set<(syncing: boolean) => void>();

/**
 * 获取当前同步状态
 */
export function getIsSyncing(): boolean {
  return _isSyncing;
}

/**
 * 订阅 isSyncing 状态变化
 * @returns 取消订阅函数
 */
export function onSyncingChange(listener: (syncing: boolean) => void): () => void {
  syncingListeners.add(listener);
  return () => syncingListeners.delete(listener);
}

/**
 * 内部：更新 isSyncing 并通知所有订阅者
 */
function setIsSyncing(value: boolean): void {
  _isSyncing = value;
  syncingListeners.forEach((cb) => cb(value));
}

// ---------------------------------------------------------------------------
// 类型分派：根据 syncType 调用对应 API
// ---------------------------------------------------------------------------

/**
 * 根据同步项类型分发到对应的 API 提交函数
 *
 * 各类型对应的 API：
 * - diagnosis → aiDiagnosisApi.saveDiagnosis
 * - environment → environmentApi.createRecord
 * - survey → surveyApi.createSurvey
 * - knowledge → knowledgeApi.submitQuiz (知识学习行为记录)
 */
async function dispatchApiCall(item: SyncQueueItem): Promise<unknown> {
  const { type, payload } = item;

  switch (type) {
    case 'diagnosis': {
      // payload 应包含 { diagnosisId: string }
      const p = payload as { diagnosisId?: string };
      if (!p?.diagnosisId) {
        throw new Error('diagnosis sync payload missing diagnosisId');
      }
      return aiDiagnosisApi.saveDiagnosis(p.diagnosisId);
    }

    case 'environment': {
      // payload 为 environmentApi.createRecord 的参数
      return environmentApi.createRecord(payload as Parameters<typeof environmentApi.createRecord>[0]);
    }

    case 'survey': {
      // payload 为 surveyApi.createSurvey 的参数
      return surveyApi.createSurvey(payload as Parameters<typeof surveyApi.createSurvey>[0]);
    }

    case 'knowledge': {
      // payload 为 knowledgeApi.submitQuiz 的参数
      return knowledgeApi.submitQuiz(payload as Parameters<typeof knowledgeApi.submitQuiz>[0]);
    }

    default:
      throw new Error(`Unknown sync type: "${(type as SyncType)}"`);
  }
}

// ---------------------------------------------------------------------------
// 核心函数
// ---------------------------------------------------------------------------

/**
 * 检查网络是否可用
 */
async function isNetworkAvailable(): Promise<boolean> {
  try {
    const state = await NetInfo.fetch();
    return state.isConnected === true && state.isInternetReachable !== false;
  } catch {
    return false;
  }
}

/**
 * 处理单条待同步项
 * - 成功：标记 synced
 * - 失败且 retryCount < MAX_RETRIES：递增重试计数
 * - 失败且 retryCount >= MAX_RETRIES：标记 failed
 */
async function processItem(item: SyncQueueItem): Promise<void> {
  try {
    await dispatchApiCall(item);
    await markSynced(item.id);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[syncManager] Failed to sync item ${item.id} (${item.type}):`, message);

    const retryCount = await incrementRetry(item.id);
    if (retryCount >= MAX_RETRIES) {
      await markFailed(item.id);
    }
  }
}

/**
 * 逐个处理所有 pending 状态的同步项
 *
 * 流程：
 * 1. 检查网络，不可用则跳过并警告
 * 2. 获取所有 pending 项
 * 3. 逐个调用 dispatchApiCall，处理成功/失败/重试逻辑
 */
export async function syncPendingItems(): Promise<void> {
  // 网络不可用时跳过
  const networkOk = await isNetworkAvailable();
  if (!networkOk) {
    return;
  }

  const pending = await getPendingSyncs();
  if (pending.length === 0) {
    return;
  }

  for (const item of pending) {
    if (_isSyncing === false) {
      break; // 被 stopSync() 中断
    }
    await processItem(item);
  }
}

/**
 * 启动定时同步循环
 *
 * 每 30 秒自动检查并处理 pending 队列。
 * 幂等：如果已经在运行则不重复启动。
 */
export function startSync(): void {
  if (syncTimer !== null) {
    return; // 已在运行中
  }

  setIsSyncing(true);

  // 立即执行一次
  syncPendingItems().catch((err) => {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[syncManager] Initial sync failed:', message);
  });

  syncTimer = setInterval(() => {
    syncPendingItems().catch((err) => {
      const message = err instanceof Error ? err.message : String(err);
      console.error('[syncManager] Periodic sync failed:', message);
    });
  }, SYNC_INTERVAL_MS);
}

/**
 * 停止同步循环
 */
export function stopSync(): void {
  if (syncTimer !== null) {
    clearInterval(syncTimer);
    syncTimer = null;
  }
  setIsSyncing(false);
}

// ---------------------------------------------------------------------------
// 默认导出：方便一次性引用
// ---------------------------------------------------------------------------

export default {
  startSync,
  stopSync,
  syncPendingItems,
  getIsSyncing,
  onSyncingChange,
};
