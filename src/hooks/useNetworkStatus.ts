import { useEffect, useRef, useState, useCallback } from 'react';
import NetInfo, {
  NetInfoState,
  NetInfoStateType,
} from '@react-native-community/netinfo';

// ---------------------------------------------------------------------------
// 类型定义
// ---------------------------------------------------------------------------

/** 网络状态返回值 */
export interface NetworkStatus {
  /** 设备是否已连接网络（含 WiFi/蜂窝） */
  isConnected: boolean;
  /** 互联网是否可达（能访问外部服务器） */
  isInternetReachable: boolean | null;
  /** 网络类型 */
  networkType: string;
}

/** 网络恢复回调签名 */
export type OnReconnectCallback = () => void;

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * 监听设备网络状态变化
 *
 * 使用 @react-native-community/netinfo 实时监听网络连接和互联网可达性。
 * 当网络从断开恢复到可用时，自动触发 onReconnect 回调。
 *
 * @param onReconnect 网络恢复时执行的回调函数
 * @returns NetworkStatus 对象，可解构为 { isConnected, isInternetReachable, networkType }
 *
 * @example
 * ```ts
 * const { isConnected, isInternetReachable, networkType } = useNetworkStatus(() => {
 *   console.log('网络已恢复，开始同步离线数据');
 *   syncManager.startSync();
 * });
 * ```
 */
export function useNetworkStatus(onReconnect?: OnReconnectCallback): NetworkStatus {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isInternetReachable, setIsInternetReachable] = useState<boolean | null>(null);
  const [networkType, setNetworkType] = useState<string>('unknown');

  // 用 ref 持有上一次的网络状态，用于检测 "断开 -> 连接" 的转换
  const wasConnectedRef = useRef<boolean>(false);
  const onReconnectRef = useRef(onReconnect);
  onReconnectRef.current = onReconnect;

  const handleStateChange = useCallback(
    (state: NetInfoState) => {
      const connected = state.isConnected ?? false;
      const reachable = state.isInternetReachable;
      const type = state.type;

      setIsConnected(connected);
      setIsInternetReachable(reachable ?? null);
      setNetworkType(type);

      // 检测网络恢复：上次未连接 && 本次已连接
      if (!wasConnectedRef.current && connected) {
        onReconnectRef.current?.();
      }
      wasConnectedRef.current = connected;
    },
    [],
  );

  useEffect(() => {
    // 订阅网络状态变化事件
    const unsubscribe = NetInfo.addEventListener(handleStateChange);

    // 立即获取一次当前状态
    NetInfo.fetch().then(handleStateChange);

    return () => {
      unsubscribe();
    };
  }, [handleStateChange]);

  return { isConnected, isInternetReachable, networkType };
}
