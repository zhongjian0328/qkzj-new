const assert = require('assert');
const aiService = require('../utils/aiService');

// 运行测试
console.log('开始测试AI服务...');

// 简单的测试运行器
const tests = [
  {
    name: '测试加密文件解析',
    test: () => {
      assert.ok(aiService, 'AI服务实例应该存在');
      assert.ok(aiService.baiduApiKey, '百度API密钥应该已初始化');
      assert.ok(aiService.baiduSecretKey, '百度Secret密钥应该已初始化');
      console.log('✓ 加密文件解析测试通过');
    }
  },
  {
    name: '测试方法存在性',
    test: () => {
      // 验证所有必要方法存在
      const requiredMethods = [
        'getBaiduAccessToken',
        'callBaiduCombinationAPI',
        'recognizeAnimal',
        'analyzeImage',
        'intelligentDiagnosis',
        'mixedInfectionRiskAssessment',
        'emergencyControlPlan',
        'treatmentAdjustment',
        'farmingAdvice',
        'diseaseWarning'
      ];
      
      requiredMethods.forEach(method => {
        assert.ok(aiService[method], `${method}方法应该存在`);
        assert.strictEqual(typeof aiService[method], 'function', `${method}应该是一个函数`);
      });
      
      console.log('✓ 方法存在性测试通过');
    }
  },
  {
    name: '测试智能诊断功能',
    test: async () => {
      const testData = {
        symptoms: ['腹泻', '食欲不振'],
        imageAnalysis: {
          result: [{ keyword: '肠道异常', score: 0.8 }]
        },
        environment: '潮湿',
        breed: '鸡',
        age: '30天',
        previousDiagnosis: '无'
      };
      
      const result = await aiService.intelligentDiagnosis(testData);
      assert.ok(result, '诊断结果应该存在');
      assert.ok(result.diagnosis, '诊断信息应该存在');
      assert.ok(result.treatmentAdvice, '治疗建议应该存在');
      assert.ok(result.preventionMeasures, '预防措施应该存在');
      assert.ok(result.notes, '注意事项应该存在');
      
      console.log('✓ 智能诊断功能测试通过');
      console.log('  诊断结果:', result.diagnosis.diseaseName);
      console.log('  可信度:', result.diagnosis.confidence);
    }
  },
  {
    name: '测试风险评估功能',
    test: async () => {
      const testData = {
        symptoms: ['腹泻', '咳嗽', '呼吸困难'],
        environment: '潮湿拥挤',
        breed: '鸡',
        age: '45天',
        recentDiseases: '近期有发病'
      };
      
      const result = await aiService.mixedInfectionRiskAssessment(testData);
      assert.ok(result, '风险评估结果应该存在');
      assert.ok(result.riskAssessment, '风险评估信息应该存在');
      
      console.log('✓ 风险评估功能测试通过');
      console.log('  总体风险等级:', result.riskAssessment.overallRiskLevel);
    }
  },
  {
    name: '测试紧急方案功能',
    test: async () => {
      const testData = {
        disease: '新城疫',
        affectedCount: 50,
        totalCount: 500,
        environment: '养殖场',
        symptoms: ['呼吸困难', '腹泻', '神经症状']
      };
      
      const result = await aiService.emergencyControlPlan(testData);
      assert.ok(result, '紧急方案结果应该存在');
      assert.ok(result.emergencyPlan, '紧急方案信息应该存在');
      
      console.log('✓ 紧急方案功能测试通过');
      console.log('  方案等级:', result.emergencyPlan.planLevel);
    }
  }
];

// 运行测试
(async () => {
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      await test.test();
      passed++;
    } catch (error) {
      console.error(`✗ ${test.name} 测试失败:`, error.message);
      failed++;
    }
  }
  
  console.log(`\n测试完成: ${passed} 个通过, ${failed} 个失败`);
  
  if (failed === 0) {
    console.log('🎉 所有测试通过！AI服务功能正常。');
  } else {
    console.log('⚠️  部分测试失败，请检查AI服务实现。');
  }
})();
