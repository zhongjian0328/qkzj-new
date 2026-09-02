import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { Text, View, Animated, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AppProvider from './context/AppProvider';
import { useAuth } from './context/UserContext';
import { styles } from './styles';
import * as SplashScreen from 'expo-splash-screen';
import OfflineBanner from './components/OfflineBanner';

// 懒加载屏幕组件
const LoginScreen = lazy(() => import('./screens/LoginScreen'));
const RegisterScreen = lazy(() => import('./screens/RegisterScreen'));
const RoleSelectScreen = lazy(() => import('./screens/RoleSelectScreen'));
const ExperienceRoleScreen = lazy(() => import('./screens/ExperienceRoleScreen'));
const AuthCertificationScreen = lazy(() => import('./screens/AuthCertificationScreen'));
const HomeScreen = lazy(() => import('./screens/HomeScreen'));
const DiagnosisHomeScreen = lazy(() => import('./screens/DiagnosisHomeScreen'));
const ChatDiagnosisScreen = lazy(() => import('./screens/ChatDiagnosisScreen'));
const VeterinaryDiagnosisScreen = lazy(() => import('./screens/VeterinaryDiagnosisScreen'));
const DiagnosisReportScreen = lazy(() => import('./screens/DiagnosisReportScreen'));
const ProductionManagementScreen = lazy(() => import('./screens/ProductionManagementScreen'));
const BatchManagementScreen = lazy(() => import('./screens/BatchManagementScreen'));
const DeathFeedRecordScreen = lazy(() => import('./screens/DeathFeedRecordScreen'));
const EmployeeManagementScreen = lazy(() => import('./screens/EmployeeManagementScreen'));
const DiagnosisHistoryScreen = lazy(() => import('./screens/DiagnosisHistoryScreen'));
const EpidemicHeatmapScreen = lazy(() => import('./screens/EpidemicHeatmapScreen'));
const KnowledgeGraphScreen = lazy(() => import('./screens/KnowledgeGraphScreen'));
const QuestionBankScreen = lazy(() => import('./screens/QuestionBankScreen'));
const InternLogScreen = lazy(() => import('./screens/InternLogScreen'));
const MentorManagementScreen = lazy(() => import('./screens/MentorManagementScreen'));
const ProfileScreen = lazy(() => import('./screens/ProfileScreen'));
const StatisticsScreen = lazy(() => import('./screens/StatisticsScreen'));
const ControlPlanListScreen = lazy(() => import('./screens/ControlPlanListScreen'));
const ControlPlanDetailScreen = lazy(() => import('./screens/ControlPlanDetailScreen'));
const GeneratePlanScreen = lazy(() => import('./screens/GeneratePlanScreen'));
const FollowUpListScreen = lazy(() => import('./screens/FollowUpListScreen'));
const FollowUpDetailScreen = lazy(() => import('./screens/FollowUpDetailScreen'));
const KnowledgeListScreen = lazy(() => import('./screens/KnowledgeListScreen'));
const KnowledgeDetailScreen = lazy(() => import('./screens/KnowledgeDetailScreen'));
const MyFavoritesScreen = lazy(() => import('./screens/MyFavoritesScreen'));
const TicketListScreen = lazy(() => import('./screens/TicketListScreen'));
const TicketDetailScreen = lazy(() => import('./screens/TicketDetailScreen'));
const CreateTicketScreen = lazy(() => import('./screens/CreateTicketScreen'));
const TeachingCaseListScreen = lazy(() => import('./screens/TeachingCaseListScreen'));
const TeachingCaseDetailScreen = lazy(() => import('./screens/TeachingCaseDetailScreen'));
const NotificationListScreen = lazy(() => import('./screens/NotificationListScreen'));
const ForgotPasswordScreen = lazy(() => import('./screens/ForgotPasswordScreen'));
const EnvironmentRecordScreen = lazy(() => import('./screens/EnvironmentRecordScreen'));
const EnvironmentAlertScreen = lazy(() => import('./screens/EnvironmentAlertScreen'));
const SurveyFormScreen = lazy(() => import('./screens/SurveyFormScreen'));
const SurveyListScreen = lazy(() => import('./screens/SurveyListScreen'));
const ElectronicMonitoringScreen = lazy(() => import('./screens/ElectronicMonitoringScreen'));

// 加载指示器组件
const LoadingIndicator = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#2DBBA1" />
    <Text style={styles.loadingText}>加载中...</Text>
  </View>
);

// 定义导航类型
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  RoleSelect: undefined;
  ExperienceRole: undefined;
  AuthCertification: { role?: string };
  Main: undefined;
  Home: undefined;
  DiagnosisHome: undefined;
  ChatDiagnosis: undefined;
  VeterinaryDiagnosis: undefined;
  DiagnosisReport: { diagnosisId: string };
  DiagnosisHistory: undefined;
  ProductionManagement: undefined;
  BatchManagement: undefined;
  DeathFeedRecord: undefined;
  EmployeeManagement: undefined;
  EpidemicHeatmap: undefined;
  KnowledgeGraph: undefined;
  QuestionBank: undefined;
  InternLog: undefined;
  MentorManagement: undefined;
  Statistics: undefined;
  ControlPlanList: undefined;
  ControlPlanDetail: { planId: string };
  GeneratePlan: undefined;
  FollowUpList: undefined;
  FollowUpDetail: { followUpId: string };
  KnowledgeList: undefined;
  KnowledgeDetail: { articleId: string };
  MyFavorites: undefined;
  TicketList: undefined;
  TicketDetail: { ticketId: string };
  CreateTicket: undefined;
  TeachingCaseList: undefined;
  TeachingCaseDetail: { caseId: string };
  Notifications: undefined;
  ForgotPassword: undefined;
  EnvironmentRecord: undefined;
  EnvironmentAlert: undefined;
  SurveyForm: { mode?: 'create' | 'edit'; surveyId?: string };
  SurveyList: undefined;
  ElectronicMonitoring: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// 主标签导航
const MainTabs: React.FC = () => {
  const { state: { user } } = useAuth();

  // 获取当前角色的中间功能
  const getMiddleTabConfig = () => {
    if (!user) return null;

    switch (user.roleType) {
      case 'FARMER':
        return {
          name: 'ProductionManagement',
          component: ProductionManagementScreen,
          label: '生产管理',
          icon: 'business-outline',
        };
      case 'INSTITUTION':
        return {
          name: 'EpidemicHeatmap',
          component: EpidemicHeatmapScreen,
          label: '疫情地图',
          icon: 'map-outline',
        };
      case 'STUDENT':
        return {
          name: 'InternLog',
          component: InternLogScreen,
          label: '实习日志',
          icon: 'book-outline',
        };
      case 'TEACHER':
        return {
          name: 'MentorManagement',
          component: MentorManagementScreen,
          label: '导师管理',
          icon: 'people-outline',
        };
      default:
        return null;
    }
  };

  const middleTab = getMiddleTabConfig();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2DBBA1',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 4,
        },
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarIconStyle: {
          fontSize: 24,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          tabBarLabel: '首页',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      
      {/* 中间角色特定功能 */}
      {middleTab && (
        <Tab.Screen 
          name={middleTab.name as any} 
          component={middleTab.component} 
          options={{ 
            tabBarLabel: middleTab.label,
            tabBarIcon: ({ color, size }) => (
              <View style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: '#2DBBA1',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 8,
                shadowColor: '#2DBBA1',
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.3,
                shadowRadius: 4.65,
                elevation: 8,
              }}>
                <Ionicons name={middleTab.icon as any} size={28} color="#FFFFFF" />
              </View>
            ),
          }}
        />
      )}
      
      <Tab.Screen 
        name="DiagnosisHome" 
        component={DiagnosisHomeScreen} 
        options={{ 
          tabBarLabel: 'AI诊断',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="medical-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          tabBarLabel: '我的',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// 启动动画组件
const SplashScreenComponent: React.FC<{ onAnimationComplete: () => void }> = ({ onAnimationComplete }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // 启动动画序列，缩短动画时间并移除额外延迟
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 动画完成后立即调用完成回调，移除1秒延迟
      onAnimationComplete();
    });
  }, [fadeAnim, scaleAnim, translateYAnim, onAnimationComplete]);

  return (
    <View style={styles.splashScreenContainer}>
      <Animated.View
        style={[
          styles.splashLogoContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: translateYAnim },
            ],
          },
        ]}
      >
        <Text style={styles.splashLogoIcon}>🏥</Text>
      </Animated.View>
      <Animated.Text
        style={[
          styles.splashAppTitle,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: translateYAnim },
            ],
          },
        ]}
      >
        禽康智检
      </Animated.Text>
      <Animated.Text
        style={[
          styles.splashAppSubtitle,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: translateYAnim },
            ],
          },
        ]}
      >
        AI赋能禽类健康诊断
      </Animated.Text>
    </View>
  );
};

const App: React.FC = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        // 保持原生启动屏幕可见
        await SplashScreen.preventAutoHideAsync();
        
        // 移除不必要的模拟延迟，直接标记应用为就绪
        // 实际项目中，这里应该加载必要的资源或执行初始化操作
      } catch (e) {
        console.warn(e);
      } finally {
        // 标记应用已准备就绪
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      // 显示我们自己的启动动画组件，然后隐藏原生启动屏幕
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // 处理启动动画完成
  const handleAnimationComplete = () => {
    setShowSplash(false);
  };

  if (!appIsReady || showSplash) {
    return <SplashScreenComponent onAnimationComplete={handleAnimationComplete} />;
  }

  // 页面过渡动画配置
  const forFade = ({ current, closing }: any) => ({
    cardStyle: {
      opacity: current.progress,
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0],
          }),
        },
      ],
    },
  });

  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <OfflineBanner />
        <Suspense fallback={<LoadingIndicator />}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              cardStyle: styles.container,
              cardStyleInterpolator: forFade,
              transitionSpec: {
                open: { animation: 'timing', config: { duration: 300 } },
                close: { animation: 'timing', config: { duration: 300 } },
              },
            }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
            <Stack.Screen name="ExperienceRole" component={ExperienceRoleScreen} />
            <Stack.Screen name="AuthCertification" component={AuthCertificationScreen} />
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="DiagnosisHome" component={DiagnosisHomeScreen} />
            <Stack.Screen name="ChatDiagnosis" component={ChatDiagnosisScreen} />
            <Stack.Screen name="VeterinaryDiagnosis" component={VeterinaryDiagnosisScreen} />
            <Stack.Screen name="DiagnosisReport" component={DiagnosisReportScreen} />
            <Stack.Screen name="ProductionManagement" component={ProductionManagementScreen} />
            <Stack.Screen name="BatchManagement" component={BatchManagementScreen} />
            <Stack.Screen name="DeathFeedRecord" component={DeathFeedRecordScreen} />
            <Stack.Screen name="EmployeeManagement" component={EmployeeManagementScreen} />
            <Stack.Screen name="DiagnosisHistory" component={DiagnosisHistoryScreen} />
            <Stack.Screen name="EpidemicHeatmap" component={EpidemicHeatmapScreen} />
            <Stack.Screen name="KnowledgeGraph" component={KnowledgeGraphScreen} />
            <Stack.Screen name="QuestionBank" component={QuestionBankScreen} />
            <Stack.Screen name="InternLog" component={InternLogScreen} />
            <Stack.Screen name="MentorManagement" component={MentorManagementScreen} />
            <Stack.Screen name="Statistics" component={StatisticsScreen} />
            <Stack.Screen name="ControlPlanList" component={ControlPlanListScreen} />
            <Stack.Screen name="ControlPlanDetail" component={ControlPlanDetailScreen} />
            <Stack.Screen name="GeneratePlan" component={GeneratePlanScreen} />
            <Stack.Screen name="FollowUpList" component={FollowUpListScreen} />
            <Stack.Screen name="FollowUpDetail" component={FollowUpDetailScreen} />
            <Stack.Screen name="KnowledgeList" component={KnowledgeListScreen} />
            <Stack.Screen name="KnowledgeDetail" component={KnowledgeDetailScreen} />
            <Stack.Screen name="MyFavorites" component={MyFavoritesScreen} />
            <Stack.Screen name="TicketList" component={TicketListScreen} />
            <Stack.Screen name="TicketDetail" component={TicketDetailScreen} />
            <Stack.Screen name="CreateTicket" component={CreateTicketScreen} />
            <Stack.Screen name="TeachingCaseList" component={TeachingCaseListScreen} />
            <Stack.Screen name="TeachingCaseDetail" component={TeachingCaseDetailScreen} />
            <Stack.Screen name="Notifications" component={NotificationListScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="EnvironmentRecord" component={EnvironmentRecordScreen} />
            <Stack.Screen name="EnvironmentAlert" component={EnvironmentAlertScreen} />
            <Stack.Screen name="SurveyForm" component={SurveyFormScreen} />
            <Stack.Screen name="SurveyList" component={SurveyListScreen} />
            <Stack.Screen name="ElectronicMonitoring" component={ElectronicMonitoringScreen} />
          </Stack.Navigator>
        </Suspense>
      </NavigationContainer>
    </AppProvider>
  );
};

export default App;
