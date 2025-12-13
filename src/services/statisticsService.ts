// 统计数据服务

// 生产数据统计接口
export interface ProductionStatistics {
  totalBatches: number;
  totalBirds: number;
  mortalityRate: number;
  feedConversionRate: number;
  dailyGrowthRate: number;
  monthlyProductionTrend: {
    month: string;
    birds: number;
    mortality: number;
    feedConsumption: number;
  }[];
}

// 诊断数据统计接口
export interface DiagnosisStatistics {
  totalDiagnoses: number;
  correctRate: number;
  diseaseDistribution: {
    disease: string;
    count: number;
    percentage: number;
  }[];
  monthlyDiagnosisTrend: {
    month: string;
    count: number;
  }[];
}

// 疫情数据统计接口
export interface EpidemicStatistics {
  totalCases: number;
  highRiskRegions: number;
  mediumRiskRegions: number;
  newCasesToday: number;
  monthlyEpidemicTrend: {
    month: string;
    cases: number;
  }[];
}

// 获取生产数据统计
export const getProductionStatistics = async (): Promise<ProductionStatistics> => {
  // 模拟API请求
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 模拟数据
  return {
    totalBatches: 12,
    totalBirds: 25000,
    mortalityRate: 2.3,
    feedConversionRate: 1.7,
    dailyGrowthRate: 1.2,
    monthlyProductionTrend: [
      { month: '1月', birds: 2000, mortality: 15, feedConsumption: 3000 },
      { month: '2月', birds: 2500, mortality: 20, feedConsumption: 3500 },
      { month: '3月', birds: 3000, mortality: 25, feedConsumption: 4000 },
      { month: '4月', birds: 3500, mortality: 30, feedConsumption: 4500 },
      { month: '5月', birds: 4000, mortality: 35, feedConsumption: 5000 },
      { month: '6月', birds: 5000, mortality: 40, feedConsumption: 6000 },
    ]
  };
};

// 获取诊断数据统计
export const getDiagnosisStatistics = async (): Promise<DiagnosisStatistics> => {
  // 模拟API请求
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 模拟数据
  return {
    totalDiagnoses: 450,
    correctRate: 92.5,
    diseaseDistribution: [
      { disease: '禽流感', count: 120, percentage: 26.7 },
      { disease: '新城疫', count: 90, percentage: 20 },
      { disease: '传染性支气管炎', count: 75, percentage: 16.7 },
      { disease: '大肠杆菌病', count: 60, percentage: 13.3 },
      { disease: '其他疾病', count: 105, percentage: 23.3 },
    ],
    monthlyDiagnosisTrend: [
      { month: '1月', count: 50 },
      { month: '2月', count: 60 },
      { month: '3月', count: 70 },
      { month: '4月', count: 80 },
      { month: '5月', count: 90 },
      { month: '6月', count: 100 },
    ]
  };
};

// 获取疫情数据统计
export const getEpidemicStatistics = async (): Promise<EpidemicStatistics> => {
  // 模拟API请求
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 模拟数据
  return {
    totalCases: 246,
    highRiskRegions: 8,
    mediumRiskRegions: 15,
    newCasesToday: 12,
    monthlyEpidemicTrend: [
      { month: '1月', cases: 30 },
      { month: '2月', cases: 45 },
      { month: '3月', cases: 55 },
      { month: '4月', cases: 38 },
      { month: '5月', cases: 42 },
      { month: '6月', cases: 36 },
    ]
  };
};
