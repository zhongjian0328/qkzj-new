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

// Web 端 deep linking 配置：将 URL 路径映射到 Stack Screen
const linking = {
  prefixes: ['http://localhost:8081', 'https://qinkangzhijian.app'],
  config: {
    screens: {
      Login: 'login',
      Register: 'register',
      RoleSelect: 'role-select',
      ExperienceRole: 'experience-role',
      AuthCertification: 'auth-certification',
      Main: 'main',
      Home: 'home',
      DiagnosisHome: 'diagnosis',
      ChatDiagnosis: 'chat-diagnosis',
      VeterinaryDiagnosis: 'veterinary-diagnosis',
      DiagnosisReport: 'diagnosis-report',
      DiagnosisHistory: 'diagnosis-history',
      ProductionManagement: 'production',
      BatchManagement: 'batch',
      DeathFeedRecord: 'death-feed',
      EmployeeManagement: 'employee',
      EpidemicHeatmap: 'epidemic-heatmap',
      KnowledgeGraph: 'knowledge-graph',
      QuestionBank: 'question-bank',
      InternLog: 'intern-log',
      MentorManagement: 'mentor',
      Statistics: 'statistics',
      ControlPlanList: 'control-plans',
      ControlPlanDetail: 'control-plans/:planId',
      GeneratePlan: 'generate-plan',
      FollowUpList: 'follow-ups',
      FollowUpDetail: 'follow-ups/:followUpId',
      KnowledgeList: 'knowledge',
      KnowledgeDetail: 'knowledge/:articleId',
      MyFavorites: 'favorites',
      TicketList: 'tickets',
      TicketDetail: 'tickets/:ticketId',
      CreateTicket: 'tickets/create',
      TeachingCaseList: 'teaching-cases',
      TeachingCaseDetail: 'teaching-cases/:caseId',
      Notifications: 'notifications',
      ForgotPassword: 'forgot-password',
      EnvironmentRecord: 'environment',
      EnvironmentAlert: 'environment-alert',
      SurveyForm: 'survey-form',
      SurveyList: 'surveys',
      EditProfile: 'edit-profile',
      ReportAudit: 'report-audit',
      PolicyPublish: 'policy-publish',
      ProductList: 'products',
      OrderList: 'orders',
      ServiceCycle: 'service-cycle',
    },
  },
};

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
const EditProfileScreen = lazy(() => import('./screens/EditProfileScreen'));
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
const ReportAuditScreen = lazy(() => import('./screens/ReportAuditScreen'));
const PolicyPublishScreen = lazy(() => import('./screens/PolicyPublishScreen'));
const ProductListScreen = lazy(() => import('./screens/ProductListScreen'));
const OrderListScreen = lazy(() => import('./screens/OrderListScreen'));
const ServiceCycleScreen = lazy(() => import('./screens/ServiceCycleScreen'));

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
  EditProfile: undefined;
  ReportAudit: undefined;
  PolicyPublish: undefined;
  ProductList: undefined;
  OrderList: undefined;
  ServiceCycle: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// 主标签导航（对齐开发文档8.4.4 Tab规范）
// 养殖户：首页 → AI诊断 → 预警中心 → 科普 → 我的
// 机构：首页 → 疫情地图 → AI诊断 → 科普 → 我的
// 学生：首页 → 实习日志 → AI诊断 → 科普 → 我的
// 教师：首页 → 导师管理 → AI诊断 → 工单 → 我的
const MainTabs: React.FC = () => {
  const { state: { user } } = useAuth();

  // 获取当前角色第2个Tab配置（角色专属功能）
  const getSecondTabConfig = () => {
    if (!user) return null;
    switch (user.roleType) {
      case 'FARMER':
        // 养殖户第2位无额外Tab，预警中心是独立Tab
        return null;
      case 'INSTITUTION':
        return { name: 'EpidemicHeatmap', component: EpidemicHeatmapScreen, label: '疫情地图', icon: 'map-outline' };
      case 'STUDENT':
        return { name: 'InternLog', component: InternLogScreen, label: '实习日志', icon: 'book-outline' };
      case 'TEACHER':
        return { name: 'MentorManagement', component: MentorManagementScreen, label: '导师管理', icon: 'people-outline' };
      default:
        return null;
    }
  };

  // 是否显示预警中心Tab（养殖户专属）
  const showAlertTab = user?.roleType === 'FARMER';
  // 是否显示工单Tab（教师专属）
  const showTicketTab = user?.roleType === 'TEACHER';

  const secondTab = getSecondTabConfig();

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
          marginTop: -4,
        },
        tabBarIconStyle: {
          fontSize: 24,
          marginTop: 4,
        },
      }}
    >
      {/* Tab1: 首页 */}
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

      {/* Tab2: 角色专属功能（机构/学生/教师），养殖户跳过此位 */}
      {secondTab && (
        <Tab.Screen
          name={secondTab.name as any}
          component={secondTab.component}
          options={{
            tabBarLabel: secondTab.label,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={secondTab.icon as any} size={size} color={color} />
            ),
          }}
        />
      )}

      {/* Tab3: AI诊断 */}
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

      {/* Tab4: 预警中心（养殖户专属）/ 工单（教师专属） */}
      {showAlertTab && (
        <Tab.Screen
          name="Notifications"
          component={NotificationListScreen}
          options={{
            tabBarLabel: '预警中心',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="alert-circle-outline" size={size} color={color} />
            ),
          }}
        />
      )}
      {showTicketTab && (
        <Tab.Screen
          name="TicketList"
          component={TicketListScreen}
          options={{
            tabBarLabel: '工单',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="document-text-outline" size={size} color={color} />
            ),
          }}
        />
      )}

      {/* Tab5: 科普（非教师角色显示） */}
      {!showTicketTab && (
        <Tab.Screen
          name="KnowledgeList"
          component={KnowledgeListScreen}
          options={{
            tabBarLabel: '科普',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="book-outline" size={size} color={color} />
            ),
          }}
        />
      )}

      {/* 最后Tab: 我的 */}
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
        <Ionicons name="medical" size={64} color="#2DBBA1" />
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
      <NavigationContainer linking={linking}>
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
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="ReportAudit" component={ReportAuditScreen} />
            <Stack.Screen name="PolicyPublish" component={PolicyPublishScreen} />
            <Stack.Screen name="ProductList" component={ProductListScreen} />
            <Stack.Screen name="OrderList" component={OrderListScreen} />
            <Stack.Screen name="ServiceCycle" component={ServiceCycleScreen} />
          </Stack.Navigator>
        </Suspense>
      </NavigationContainer>
    </AppProvider>
  );
};

export default App;
