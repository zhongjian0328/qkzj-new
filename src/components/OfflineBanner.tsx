import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { getIsSyncing, onSyncingChange } from '../services/syncManager';
import { colors, spacing, typography } from '../theme';

/**
 * 离线状态横幅指示器
 *
 * - 网络断开时：红色横幅「网络连接中断，当前显示离线缓存数据」
 * - 网络恢复时：绿色横幅「网络已恢复，正在同步数据...」
 * - 同步完成后自动消失
 * - 使用 Animated 平滑进出动画
 */
const OfflineBanner: React.FC = () => {
  const { isConnected, isInternetReachable } = useNetworkStatus();
  const [isSyncing, setIsSyncing] = useState(false);
  const [bannerState, setBannerState] = useState<'offline' | 'syncing' | 'hidden'>('hidden');

  // 动画值
  const translateY = useRef(new Animated.Value(-50)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // 订阅同步状态
  useEffect(() => {
    const unsubscribe = onSyncingChange((syncing: boolean) => {
      setIsSyncing(syncing);
    });
    // 初始化时也读取一次当前状态
    setIsSyncing(getIsSyncing());
    return unsubscribe;
  }, []);

  // 判断网络是否真正可用（已连接且互联网可达）
  const isOnline = isConnected && isInternetReachable !== false;

  // 根据网络和同步状态更新 banner 状态
  useEffect(() => {
    if (!isOnline) {
      setBannerState('offline');
    } else if (isSyncing) {
      setBannerState('syncing');
    } else {
      setBannerState('hidden');
    }
  }, [isOnline, isSyncing]);

  // 动画：显示
  const animateIn = useCallback(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateY, opacity]);

  // 动画：隐藏
  const animateOut = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -50,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateY, opacity]);

  // 状态变化时触发动画
  const prevState = useRef(bannerState);
  useEffect(() => {
    const prev = prevState.current;
    const current = bannerState;

    if (prev === 'hidden' && current !== 'hidden') {
      animateIn();
    } else if (prev !== 'hidden' && current === 'hidden') {
      animateOut();
    } else if (current !== 'hidden') {
      // 同一可见状态间切换（offline <-> syncing），也重新触发进入动画
      translateY.setValue(-50);
      opacity.setValue(0);
      animateIn();
    }

    prevState.current = current;
  }, [bannerState, animateIn, animateOut, translateY, opacity]);

  if (bannerState === 'hidden') {
    return null;
  }

  const isOffline = bannerState === 'offline';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
          backgroundColor: isOffline ? colors.error : colors.success,
        },
      ]}
    >
      <Ionicons
        name={isOffline ? 'alert-circle' : 'sync'}
        size={16}
        color={colors.textOnPrimary}
        style={{ marginRight: spacing.sm }}
      />
      <Text style={styles.text}>
        {isOffline ? '网络连接中断，当前显示离线缓存数据' : '网络已恢复，正在同步数据...'}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  text: {
    fontSize: typography.size.small,
    fontWeight: typography.weight.semibold,
    color: colors.textOnPrimary,
    textAlign: 'center',
  },
});

export default OfflineBanner;
