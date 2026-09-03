/**
 * 体验种子数据注入脚本
 * 为12个体验账号注入业务数据，改善首次体验
 */
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/qinkangzhijian';

// 体验用户ID映射（从后端获取或硬编码）
const EXPERIENCE_USERS = {
  '19900000001': { roleType: 'FARMER', subRole: 'SMALL', nickname: '体验养殖户' },
  '19900000002': { roleType: 'FARMER', subRole: 'ENTERPRISE', nickname: '体验企业' },
  '19900000003': { roleType: 'FARMER', subRole: 'COOPERATIVE', nickname: '体验合作社' },
  '19900000004': { roleType: 'INSTITUTION', subRole: 'CDC', nickname: '体验疫控' },
  '19900000005': { roleType: 'INSTITUTION', subRole: 'RESEARCH_INSTITUTE', nickname: '体验科研' },
  '19900000006': { roleType: 'INSTITUTION', subRole: 'SERVICE_PROVIDER', nickname: '体验服务商' },
  '19900000007': { roleType: 'STUDENT', subRole: 'LEARNING_STUDENT', nickname: '体验学习生' },
  '19900000008': { roleType: 'STUDENT', subRole: 'COGNITIVE_INTERN', nickname: '体验实习生' },
  '19900000009': { roleType: 'STUDENT', subRole: 'ADVANCED_INTERN', nickname: '体验顶岗生' },
  '19900000010': { roleType: 'TEACHER', subRole: 'MENTOR', nickname: '体验导师' },
  '19900000011': { roleType: 'TEACHER', subRole: 'CLINICAL_TEACHER', nickname: '体验临床教师' },
  '19900000012': { roleType: 'TEACHER', subRole: 'RESEARCH_TEACHER', nickname: '体验科研教师' },
};

async function main() {
  console.log('连接MongoDB...');
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  console.log('已连接');

  // 获取体验用户ID
  const users = await db.collection('users').find({ phoneNumber: { $regex: /^1990000000/ } }).toArray();
  const userMap = {};
  users.forEach(u => { userMap[u.phoneNumber] = u._id; });
  console.log(`找到 ${users.length} 个体验用户`);

  if (users.length === 0) {
    console.log('未找到体验用户，请先运行体验登录');
    process.exit(1);
  }

  let created = 0;

  // 1. 为FARMER用户创建批次数据
  const farmerPhones = ['19900000001', '19900000002', '19900000003'];
  const speciesList = ['白羽肉鸡', '黄羽肉鸡', '蛋鸡'];
  const batches = [];
  for (const phone of farmerPhones) {
    if (!userMap[phone]) continue;
    const userId = userMap[phone];
    const isEnterprise = phone === '19900000002';
    const batchCount = isEnterprise ? 5 : 2;

    for (let b = 0; b < batchCount; b++) {
      batches.push({
        userId,
        batchName: `${speciesList[b % 3]}${b + 1}号批次`,
        species: speciesList[b % 3],
        initialQuantity: isEnterprise ? 5000 + b * 1000 : 500 + b * 200,
        currentQuantity: isEnterprise ? 4800 + b * 950 : 470 + b * 180,
        entryDate: new Date(Date.now() - (30 + b * 7) * 86400000),
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  if (batches.length > 0) {
    const existingBatches = await db.collection('productionbatches').countDocuments({});
    if (existingBatches === 0) {
      await db.collection('productionbatches').insertMany(batches);
      created += batches.length;
      console.log(`✅ 创建 ${batches.length} 个养殖批次`);
    } else {
      console.log(`⏭ 跳过批次数据（已存在 ${existingBatches} 条）`);
    }
  }

  // 2. 为FARMER用户创建死淘记录
  const deathRecords = [];
  for (const phone of farmerPhones) {
    if (!userMap[phone]) continue;
    const userBatches = batches.filter(b => b.userId.toString() === userMap[phone].toString());
    for (const batch of userBatches) {
      for (let d = 0; d < 7; d++) {
        const deathCount = Math.floor(Math.random() * 5) + 1;
        deathRecords.push({
          userId: batch.userId,
          batchId: batch._id || new mongoose.Types.ObjectId(),
          recordDate: new Date(Date.now() - (7 - d) * 86400000),
          deathCount,
          feedConsumption: Math.floor(Math.random() * 200) + 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
  }

  if (deathRecords.length > 0) {
    const existingDR = await db.collection('deathfeedrecords').countDocuments({});
    if (existingDR === 0) {
      await db.collection('deathfeedrecords').insertMany(deathRecords);
      created += deathRecords.length;
      console.log(`✅ 创建 ${deathRecords.length} 条死淘记录`);
    } else {
      console.log(`⏭ 跳过死淘记录（已存在）`);
    }
  }

  // 3. 为STUDENT用户创建实习日志
  const studentPhones = ['19900000008', '19900000009'];
  const logTitles = [
    '新城疫病例观察', '禽流感诊断实践', '鸡舍环境管理', '疫苗接种操作',
    '饲料配方调整', '产蛋率下降分析', '呼吸道疾病鉴别', '消毒操作规范',
  ];
  const internLogs = [];
  for (const phone of studentPhones) {
    if (!userMap[phone]) continue;
    const userId = userMap[phone];
    for (let l = 0; l < 5; l++) {
      internLogs.push({
        userId,
        title: logTitles[l],
        content: `今日在导师指导下完成了${logTitles[l]}相关实习内容，学习了关键操作要点和注意事项。通过实际操作加深了对理论知识的理解。`,
        date: new Date(Date.now() - (5 - l) * 86400000),
        status: l < 3 ? 'reviewed' : 'pending',
        mentorComment: l < 3 ? '完成良好，注意细节把控' : '',
        createdAt: new Date(Date.now() - (5 - l) * 86400000),
        updatedAt: new Date(),
      });
    }
  }

  if (internLogs.length > 0) {
    const existingLogs = await db.collection('internshiplogs').countDocuments({});
    if (existingLogs === 0) {
      await db.collection('internshiplogs').insertMany(internLogs);
      created += internLogs.length;
      console.log(`✅ 创建 ${internLogs.length} 条实习日志`);
    } else {
      console.log(`⏭ 跳过实习日志（已存在）`);
    }
  }

  // 4. 为所有用户创建诊断记录
  const diseases = [
    { name: '新城疫', confidence: 85 },
    { name: '禽流感(H5N1)', confidence: 72 },
    { name: '传染性支气管炎', confidence: 63 },
    { name: '大肠杆菌病', confidence: 45 },
  ];
  const diagnosisRecords = [];
  for (const user of users) {
    for (let d = 0; d < 3; d++) {
      const disease = diseases[d];
      diagnosisRecords.push({
        userId: user._id,
        diseaseName: disease.name,
        diagnosisResult: disease.name,
        confidence: disease.confidence,
        status: d < 2 ? 'completed' : 'treatment',
        symptoms: ['精神萎靡', '食欲下降', '呼吸困难'],
        imageUrl: '',
        createdAt: new Date(Date.now() - (3 - d) * 86400000),
        updatedAt: new Date(),
      });
    }
  }

  if (diagnosisRecords.length > 0) {
    const existingDiag = await db.collection('diagnosisrecords').countDocuments({});
    if (existingDiag === 0) {
      await db.collection('diagnosisrecords').insertMany(diagnosisRecords);
      created += diagnosisRecords.length;
      console.log(`✅ 创建 ${diagnosisRecords.length} 条诊断记录`);
    } else {
      console.log(`⏭ 跳过诊断记录（已存在）`);
    }
  }

  // 5. 为INSTITUTION用户创建疫情数据
  const instPhones = ['19900000004', '19900000005'];
  const alerts = [];
  for (const phone of instPhones) {
    if (!userMap[phone]) continue;
    const userId = userMap[phone];
    alerts.push(
      { userId, title: '新城疫聚集性爆发', content: 'XX县出现5例确诊病例，已启动应急响应', region: 'XX县', level: 'high', status: 'active', createdAt: new Date(Date.now() - 86400000), updatedAt: new Date() },
      { userId, title: '禽流感疑似病例', content: 'XX镇发现异常死亡，正在进行实验室确认', region: 'XX镇', level: 'medium', status: 'investigating', createdAt: new Date(Date.now() - 2 * 86400000), updatedAt: new Date() },
      { userId, title: '常规疫情监测', content: '本周监测数据汇总，整体风险可控', region: '全市', level: 'low', status: 'resolved', createdAt: new Date(Date.now() - 5 * 86400000), updatedAt: new Date() },
    );
  }

  if (alerts.length > 0) {
    const existingAlerts = await db.collection('epidemicalerts').countDocuments({});
    if (existingAlerts === 0) {
      await db.collection('epidemicalerts').insertMany(alerts);
      created += alerts.length;
      console.log(`✅ 创建 ${alerts.length} 条疫情报警`);
    } else {
      console.log(`⏭ 跳过疫情报警（已存在）`);
    }
  }

  // 6. 为所有用户创建通知
  const notifications = [];
  const notifTemplates = [
    { type: 'system', title: '欢迎使用禽康智检', content: '您已成功登录体验版，可以体验各功能模块' },
    { type: 'diagnosis', title: '诊断报告已生成', content: '您的AI诊断报告已完成，请查看' },
    { type: 'warning', title: '天气预警', content: '未来3天将大幅降温，请注意鸡舍保温' },
  ];
  for (const user of users) {
    for (const tmpl of notifTemplates) {
      notifications.push({
        userId: user._id,
        type: tmpl.type,
        title: tmpl.title,
        content: tmpl.content,
        isRead: false,
        createdAt: new Date(Date.now() - Math.random() * 3 * 86400000),
        updatedAt: new Date(),
      });
    }
  }

  if (notifications.length > 0) {
    const existingNotif = await db.collection('notifications').countDocuments({});
    if (existingNotif === 0) {
      await db.collection('notifications').insertMany(notifications);
      created += notifications.length;
      console.log(`✅ 创建 ${notifications.length} 条通知`);
    } else {
      console.log(`⏭ 跳过通知（已存在）`);
    }
  }

  console.log(`\n种子数据注入完成！共创建 ${created} 条记录`);
  await mongoose.disconnect();
}

main().catch(e => { console.error('错误:', e); process.exit(1); });
