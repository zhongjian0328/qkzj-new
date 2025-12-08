import React, { useEffect } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack, usePathname, useGlobalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LogBox } from 'react-native';
import { AuthProvider } from '../src/contexts/AuthContext';

LogBox.ignoreLogs([
  "TurboModuleRegistry.getEnforcing(...): 'RNMapsAirModule' could not be found",
  // 添加其它想暂时忽略的错误或警告信息
]);

export default function RootLayout() {
  const pathname = usePathname();
  const searchParams = useGlobalSearchParams();

  useEffect(() => {
    if (!pathname) {
      return;
    }
    let searchString = '';
    if (Object.keys(searchParams).length > 0) {
      const queryString = Object.keys(searchParams)
        .map(key => {
          const value = searchParams[key];
          if (typeof value === 'string') {
            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
          }
          return '';
        }).filter(Boolean).join('&');

      searchString = '?' + queryString;
    }

    const pageId = pathname.replace('/', '').toUpperCase();
    console.log('当前pageId:', pageId, ', pathname:', pathname, ', search:', searchString);
    if (typeof window === 'object' && window.parent && window.parent.postMessage) {
      window.parent.postMessage({
        type: 'chux-path-change',
        pageId: pageId,
        pathname: pathname,
        search: searchString,
      }, '*');
    }
  }, [pathname, searchParams])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <StatusBar style="dark"></StatusBar>
        <Stack screenOptions={{
          // 设置所有页面的切换动画为从右侧滑入，适用于iOS 和 Android
          animation: 'slide_from_right',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          // 隐藏自带的头部
          headerShown: false 
        }}>
          <Stack.Screen name="(tabs)" options={{ title: "底部导航栏" }} />
          <Stack.Screen name="p-login_register" options={{ title: "登录/注册页" }} />
          <Stack.Screen name="p-role_select" options={{ title: "角色选择页" }} />
          <Stack.Screen name="p-auth_certification" options={{ title: "认证页" }} />
          <Stack.Screen name="p-home_farmer_enterprise" options={{ title: "养殖户（企业）首页" }} />
          <Stack.Screen name="p-home_institution_cdc" options={{ title: "机构（疫控）首页" }} />
          <Stack.Screen name="p-home_institution_service" options={{ title: "机构（服务商）首页" }} />
          <Stack.Screen name="p-home_student_learning" options={{ title: "学生（学习）首页" }} />
          <Stack.Screen name="p-home_student_internship" options={{ title: "学生（实习）首页" }} />
          <Stack.Screen name="p-treatment_plan" options={{ title: "治疗方案页" }} />
          <Stack.Screen name="p-production_dashboard" options={{ title: "生产管理看板页" }} />
          <Stack.Screen name="p-batch_management" options={{ title: "批次管理页" }} />
          <Stack.Screen name="p-death_feed_record" options={{ title: "死淘/耗料记录页" }} />
          <Stack.Screen name="p-employee_permission" options={{ title: "员工权限管理页" }} />
          <Stack.Screen name="p-epidemic_heatmap" options={{ title: "疫情热力图页" }} />
          <Stack.Screen name="p-policy_publish" options={{ title: "政策下发页" }} />
          <Stack.Screen name="p-knowledge_graph" options={{ title: "图谱百科页" }} />
          <Stack.Screen name="p-question_bank" options={{ title: "题库测验页" }} />
          <Stack.Screen name="p-intern_log_list" options={{ title: "实习日志列表页" }} />
          <Stack.Screen name="p-intern_log_detail" options={{ title: "实习日志详情页" }} />
          <Stack.Screen name="p-mentor_dashboard" options={{ title: "导师管理页" }} />
          <Stack.Screen name="p-customer_management" options={{ title: "客户管理页" }} />
          <Stack.Screen name="p-ad_precision" options={{ title: "广告投放页" }} />
          <Stack.Screen name="p-online_consult" options={{ title: "在线诊疗页" }} />
          <Stack.Screen name="p-veterinary_mall" options={{ title: "兽药商城页" }} />
          <Stack.Screen name="p-bulk_purchase" options={{ title: "大宗采购页" }} />
          <Stack.Screen name="p-data_annotation" options={{ title: "数据标注页" }} />
          <Stack.Screen name="p-research_collab" options={{ title: "科研协作页" }} />
          <Stack.Screen name="p-settings" options={{ title: "设置页" }} />
          <Stack.Screen name="p-data_export" options={{ title: "数据导出页" }} />
        </Stack>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
