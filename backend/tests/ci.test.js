const assert = require('assert');

// CI 基础单元测试 — 不依赖外部 API，验证核心模块加载与接口契约

console.log('开始 CI 基础测试...');

const tests = [
  {
    name: '后端入口可加载',
    test: () => {
      // index.js 启动服务器，CI 中不宜 require（会绑定端口），仅验证文件存在且语法正确
      const fs = require('fs');
      const path = require('path');
      const indexPath = path.join(__dirname, '..', 'index.js');
      assert.ok(fs.existsSync(indexPath), 'index.js 应存在');
      const content = fs.readFileSync(indexPath, 'utf8');
      assert.ok(content.includes('express'), '应使用 Express');
      assert.ok(content.includes('mongoose'), '应使用 Mongoose');
    }
  },
  {
    name: 'AI 服务实例与方法契约',
    test: () => {
      const aiService = require('../utils/aiService');
      assert.ok(aiService, 'AI 服务实例应存在');

      const requiredMethods = [
        'intelligentDiagnosis',
        'mixedInfectionRiskAssessment',
        'emergencyControlPlan',
        'treatmentAdjustment',
        'farmingAdvice',
        'diseaseWarning'
      ];

      requiredMethods.forEach(method => {
        assert.ok(aiService[method], `${method} 方法应存在`);
        assert.strictEqual(typeof aiService[method], 'function', `${method} 应为函数`);
      });
    }
  },
  {
    name: '规则引擎模块可加载',
    test: () => {
      const ruleEngine = require('../services/ruleEngine');
      assert.ok(ruleEngine, '规则引擎实例应存在');
      assert.strictEqual(typeof ruleEngine.ruleBasedDiagnosis, 'function', 'ruleBasedDiagnosis 应为函数');
    }
  },
  {
    name: '认证中间件可加载',
    test: () => {
      // authMiddleware 在加载时检查 JWT_SECRET，CI 中需要设置
      assert.ok(process.env.JWT_SECRET, 'JWT_SECRET 环境变量应已设置');
      const authMiddleware = require('../middleware/authMiddleware');
      assert.ok(authMiddleware, '认证中间件应存在');
      assert.strictEqual(typeof authMiddleware.authenticate, 'function', 'authenticate 应为函数');
      assert.strictEqual(typeof authMiddleware.authorize, 'function', 'authorize 应为函数');
    }
  },
  {
    name: '所有 Model 文件可加载',
    test: () => {
      const fs = require('fs');
      const path = require('path');
      const modelsDir = path.join(__dirname, '..', 'models');
      const modelFiles = fs.readdirSync(modelsDir).filter(f => f.endsWith('.js'));

      assert.ok(modelFiles.length >= 10, `应有至少 10 个 Model 文件，实际 ${modelFiles.length}`);

      modelFiles.forEach(file => {
        const model = require(path.join(modelsDir, file));
        assert.ok(model, `${file} 应可加载`);
        assert.ok(model.modelName, `${file} 应有 modelName`);
      });

      console.log(`  已验证 ${modelFiles.length} 个 Model`);
    }
  },
  {
    name: '所有 Route 文件可加载',
    test: () => {
      const fs = require('fs');
      const path = require('path');
      const routesDir = path.join(__dirname, '..', 'routes');
      const routeFiles = fs.readdirSync(routesDir).filter(f => f.endsWith('.js'));

      assert.ok(routeFiles.length >= 10, `应有至少 10 个 Route 文件，实际 ${routeFiles.length}`);

      routeFiles.forEach(file => {
        const router = require(path.join(routesDir, file));
        // Express Router 是函数，且具备 use/get/post 等方法
        assert.ok(router, `${file} 应可加载`);
        const isRouter = typeof router === 'function' || (typeof router === 'object' && typeof router.use === 'function');
        assert.ok(isRouter, `${file} 应为 Express Router`);
      });

      console.log(`  已验证 ${routeFiles.length} 个 Route`);
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
      console.log(`  ✓ ${test.name}`);
    } catch (error) {
      console.error(`  ✗ ${test.name}: ${error.message}`);
      failed++;
    }
  }

  console.log(`\n测试完成: ${passed} 个通过, ${failed} 个失败`);

  if (failed > 0) {
    process.exit(1);
  }
})();
