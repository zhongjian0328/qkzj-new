import { useCallback, useEffect, useState } from 'react';
import {
  cacheGet,
  cacheSet,
  enqueueSync,
  CacheType,
} from '../services/offlineCache';
import { useNetworkStatus } from './useNetworkStatus';

// ---------------------------------------------------------------------------
// 类型定义
// ---------------------------------------------------------------------------

/** Hook 返回值 */
export interface OfflineAwareResult<T = unknown> {
  /** 当前网络是否可用 */
  isOnline: boolean;
  /** 从本地缓存读取的数据（无缓存时为 null） */
  cachedData: T | null;
  /** 是否正在加载 */
  loading: boolean;
  /** 最近一次请求的错误信息 */
  error: Error | null;
  /** 手动重新触发 fetchWithFallback */
  refetch: () => void;
  /** 优先 API 调用，失败则退回缓存 */
  fetchWithFallback: (apiCall: () => Promise<unknown>) => Promise<unknown>;
  /** 在线直接提交，离线入队待同步 */
  submitWithQueue: (apiCall: () => Promise<unknown>, payload?: unknown) => Promise<unknown>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * 离线感知数据获取 Hook
 *
 * 封装网络状态监听与离线缓存读写，提供两层能力：
 * 1. **读取**：优先调 API，失败则退回本地缓存
 * 2. **写入**：网络可用时直接提交，不可用时入队待同步
 *
 * @param cacheType   缓存类型（diagnosis / environment / survey / knowledge）
 * @param cacheKey    缓存主键（通常为 userId 或 articleId）
 * @param onReconnect 网络恢复时的可选回调
 * @returns OfflineAwareResult 状态对象
 *
 * @example
 * ```tsx
 * const { isOnline, cachedData, loading, error, refetch } = useOfflineAware<DiagnosisReport>(
 *   'diagnosis',
 *   user.id,
 *   () => syncManager.startSync(),
 * );
 *
 * if (loading) return <ActivityIndicator />;
 * return <DiagnosisCard data={cachedData} />;
 * ```
 */
export function useOfflineAware<T = unknown>(
  cacheType: CacheType,
  cacheKey: string,
  onReconnect?: () => void,
): OfflineAwareResult<T> {
  const { isConnected, isInternetReachable } = useNetworkStatus(onReconnect);
  const [cachedData, setCachedData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const isOnline = isConnected && isInternetReachable !== false;

  // 组件挂载时尝试读取缓存
  useEffect(() => {
    let cancelled = false;

    async function loadCache() {
      try {
        const data = await cacheGet<T>(cacheType, cacheKey);
        if (!cancelled) {
          setCachedData(data);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`[useOfflineAware] cacheGet(${cacheType}, ${cacheKey}) failed:`, message);
        if (!cancelled) {
          setError(new Error(message));
        }
      }
    }

    loadCache();

    return () => {
      cancelled = true;
    };
  }, [cacheType, cacheKey]);

  /**
   * 先尝试 API 调用，失败则读缓存
   *
   * @param apiCall  返回 Promise 的 API 调用函数
   * @returns 请求结果数据（API 或缓存）
   */
  const fetchWithFallback = useCallback(
    async (apiCall: () => Promise<unknown>): Promise<unknown> => {
      setLoading(true);
      setError(null);

      // 1. 尝试 API 调用
      if (isOnline) {
        try {
          const result = await apiCall();
          // 成功后写入缓存
          await cacheSet(cacheType, cacheKey, result);
          setCachedData(result as T);
          setLoading(false);
          return result;
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          console.warn(
            `[useOfflineAware] API call failed, falling back to cache: ${message}`,
          );
          setError(new Error(message));
          // 不 return，继续走缓存 fallback
        }
      }

      // 2. 读取缓存
      try {
        const data = await cacheGet<T>(cacheType, cacheKey);
        setCachedData(data);
        setLoading(false);
        return data;
      } catch (cacheErr) {
        const message =
          cacheErr instanceof Error ? cacheErr.message : String(cacheErr);
        const finalError = new Error(`API and cache both failed: ${message}`);
        setError(finalError);
        setLoading(false);
        throw finalError;
      }
    },
    [isOnline, cacheType, cacheKey],
  );

  /**
   * 网络可用时直接提交，不可用时入队
   *
   * @param apiCall 返回 Promise 的 API 提交函数
   * @param payload 要提交的载荷
   * @returns API 返回结果，或入队成功标志
   */
  const submitWithQueue = useCallback(
    async (apiCall: () => Promise<unknown>, payload: unknown): Promise<unknown> => {
      // 网络可用：直接提交
      if (isOnline) {
        const result = await apiCall();
        return result;
      }

      // 网络不可用：写入缓存并加入同步队列
      const queueId = await enqueueSync(cacheType as Parameters<typeof enqueueSync>[0], payload);
      await cacheSet(cacheType, cacheKey, payload);
      return { queued: true, queueId };
    },
    [isOnline, cacheType, cacheKey],
  );

  /** 手动重新触发 fetchWithFallback 的 refetch */
  const refetch = useCallback(() => {
    // refetch 需要由调用者自行调用 fetchWithFallback，这里重置状态并重新触发缓存加载
    setLoading(true);
    setError(null);
    cacheGet<T>(cacheType, cacheKey)
      .then((data) => {
        setCachedData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      });
  }, [cacheType, cacheKey]);

  return { isOnline, cachedData, loading, error, refetch, fetchWithFallback, submitWithQueue };
}

export default useOfflineAware;
