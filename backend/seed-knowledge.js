/**
 * 禽病防治知识库种子数据脚本
 * 将42章教材的结构化疾病知识写入 KnowledgeGraph + QuestionBank 集合
 *
 * 用法：node backend/seed-knowledge.js
 * 前提：MongoDB 运行中，后端环境变量已配置
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const KnowledgeGraph = require('./models/KnowledgeGraph');
const QuestionBank = require('./models/QuestionBank');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/qinkangzhijian';

// ========== 42章疾病知识数据 ==========

const diseaseData = [
  // ch01 总论
  {
    diseaseName: '禽病的预防',
    category: 'general',
    chapterNumber: 1,
    description: '切断传染病三环节（传染源-传播途径-易感禽群）是禽病防控的总思路。核心措施包括免疫接种、消毒杀虫灭鼠、饲养管理等。',
    pathogen: '非单一疾病。核心框架——切断「传染源-传播途径-易感禽群」三环节。蛋媒性传染病（鸡白痢、鸡伤寒、支原体病、禽脑脊髓炎、EDS-76等）经蛋垂直传播。',
    epidemiology: '家禽解剖生理特点决定易病点：无膈肌不会咳嗽、血浆胆碱酯酶贮量少对有机磷极敏感、肾滤过面积小易伤肾。传播媒介含蛋、孵化室、空气、羽毛皮屑、饲料饮水、垫料粪便、设备用具、动物昆虫、人工授精。',
    symptoms: '母源抗体半衰期4~5日龄；法氏囊病母源抗体维持约3周，传支/脑脊髓炎约2周。',
    pathologicalChanges: '不适用（总论章）',
    diagnosis: '免疫效果判定：接种后平均抗体滴度较接种前升高4倍以上为良好；疫苗保护率70%以上为质量较好。',
    prevention: '免疫程序六要素（疾病选择、首免时间、重复免疫、疫苗选择、接种方法、疫苗配合）；消毒三法（物理/化学/生物热）；空栏消毒灭菌率要求99%以上；带鸡喷雾消毒每1~2d一次；夏季防热应激加0.04%维生素C或0.4%碳酸氢钠。',
    immunizationSchedule: '免疫接种方法：滴鼻点眼（3周龄内雏禽）、饮水免疫（群体免疫，倍量）、气雾免疫（大群呼吸道免疫，雾滴≥10μm）、刺种（禽痘翼膜）、皮下注射（马立克氏苗1日龄颈部皮下）、肌内注射（油佐剂灭活苗/紧急免疫）。疫苗保存：灭活苗2~15℃；冻干活苗0℃以下；马立克氏苗稀释后2h内用完。',
    differentialDiagnosis: '',
    medicationNotes: '',
    symptomTags: [],
    lesionTags: [],
    tags: ['预防', '免疫', '消毒', '总论'],
    difficultyLevel: 'BEGINNER'
  },
  // ch02 诊断总论
  {
    diseaseName: '禽病的诊断',
    category: 'general',
    chapterNumber: 2,
    description: '诊断四步递进：流行病学调查→临床检查（群体+个体）→病理剖检→实验室检验。采食量减少是最早最敏感症状。',
    pathogen: '非单一疾病。诊断总论。',
    epidemiology: '发病率=新病例数/同期平均数×100%；病死率=某病死亡羽数/该病患禽总数×100%。',
    symptoms: '采食量减少是最早反映禽群健康的最敏感症状；呼吸系统疾病约占禽病70%。',
    pathologicalChanges: '神经型马立克氏病见单侧坐骨神经肿大。',
    diagnosis: '四步推进——流行病学调查→临床检查（群体+个体）→病理剖检→实验室检验。常用血清学方法：HI、AGP、SNT、ELISA。发病日龄提示：各龄同发且死亡率高提示新城疫/禽流感/鸭瘟/中毒。',
    prevention: '不适用（诊断章）',
    immunizationSchedule: '',
    differentialDiagnosis: '',
    medicationNotes: '',
    symptomTags: ['采食量下降', '呼吸症状'],
    lesionTags: [],
    tags: ['诊断', '总论', '实验室检验'],
    difficultyLevel: 'BEGINNER'
  },
  // ch03 药物治疗总论
  {
    diseaseName: '禽病的药物治疗',
    category: 'general',
    chapterNumber: 3,
    description: '合理用药八原则：预防为主治疗为辅、对症下药、适度剂量、合理疗程、正确给药途径、合理联用注意配伍禁忌、正确使用有效期内药物、经济效益为首。',
    pathogen: '非单一疾病。药物治疗总论。',
    epidemiology: '',
    symptoms: '',
    pathologicalChanges: '',
    diagnosis: '合理用药八原则——预防为主治疗为辅、对症下药、适度剂量、合理疗程、正确给药途径、合理联用注意配伍禁忌、正确使用有效期内药物、经济效益为首。',
    prevention: '群体给药首选混料与饮水；注射治疗须每日至少2次维持血药浓度；种蛋浸泡（真空法/变温法）与蛋内注射控制蛋媒性疾病；全程关注停药期与配伍禁忌；有机磷类严禁内服。',
    immunizationSchedule: '',
    differentialDiagnosis: '',
    medicationNotes: '有机磷类（敌百虫等）严禁内服，家禽对其极敏感；链霉素/磺胺类慎用，多经肾排泄易伤肾；氨基糖苷类肠道不吸收，勿投水治全身病；食盐正常添加0.25%~0.5%；疗程常规3~5d；夏季防热应激饲料加0.04%维生素C或0.4%碳酸氢钠。',
    symptomTags: [],
    lesionTags: [],
    tags: ['用药', '总论', '药物治疗', '配伍禁忌'],
    difficultyLevel: 'BEGINNER'
  },
  // ch04 禽流感
  {
    diseaseName: '禽流感',
    category: 'viral',
    chapterNumber: 4,
    description: 'A型流感病毒引起的急性败血性高度接触性传染病，分低致病呼吸道型与高致病急性出血型，人畜共患。',
    pathogen: 'A型流感病毒（正黏病毒科），单股RNA，表面有HA和NA纤突，16种HA(H1~H16)和9种NA(N1~N9)组合多种亚型。',
    epidemiology: '鸡、鸭、鹅、火鸡等禽类及人、野生哺乳动物均可感染；候鸟迁徙是主要传播原因；经呼吸道、消化道、眼结膜感染，可气源性传播；高致病株死亡率70%~100%，中等毒力株0.1%~10%；冬春多发。',
    symptoms: '最急性10多小时死亡；急性型体温升高、头肿、冠肉髯发黑、黄绿色带血下痢、呼吸困难、脚鳞片下紫红/紫黑、产蛋率急剧下降；耐过鸡出现神经症状；无致病力株感染后无症状但可长期排毒。',
    pathologicalChanges: '头面浮肿、冠肉髯肿胀3倍以上；皮下黄色胶样浸润；腺胃乳头水肿出血、两胃交界带状/环状出血；胰腺斑点状出血变性坏死；法氏囊萎缩或水肿充血出血；卵泡充血出血可致卵黄性腹膜炎。',
    diagnosis: 'IVPI>1.2或H5/H7亚型血凝素裂解位点符合特征即判高致病；确诊靠病毒分离鉴定、HI、ELISA；需与新城疫、减蛋综合征鉴别。',
    prevention: '严禁疫区引种，鸡与水禽禁混养、间隔3km以上且不同水源；免疫用Re-1株灭活苗（H5N1亚型），按日龄分剂量皮下/肌内注射，接种后14d产生免疫；无特效药，抗菌药仅控制继发感染。',
    immunizationSchedule: 'Re-1株(H5N1)灭活苗：2~5周龄鸡0.3mL/鸭鹅0.5mL；5周龄以上鸡0.5mL/鸭1mL/鹅1.5mL；14d产生免疫，鸡免疫期6个月，鸭鹅首免3周后加强、免疫期4个月。',
    differentialDiagnosis: '新城疫=腺胃乳头出血+枣核溃疡；禽流感=头肿冠髯黑+脚鳞出血；肾传支=花斑肾+一过性呼吸道症状。',
    medicationNotes: '无特效药，抗菌药仅控制继发感染。',
    symptomTags: ['头肿', '冠髯发黑', '脚鳞出血', '呼吸困难', '产蛋下降', '黄绿色下痢'],
    lesionTags: ['腺胃乳头出血', '胰腺坏死', '卵泡出血', '皮下胶样浸润'],
    tags: ['禽流感', '病毒病', '人畜共患', '正黏病毒'],
    difficultyLevel: 'INTERMEDIATE'
  },
  // ch05 新城疫
  {
    diseaseName: '新城疫',
    category: 'viral',
    chapterNumber: 5,
    description: '新城疫病毒(NDV)引起鸡和火鸡急性高度接触性传染病，特征为腺胃乳头出血与肠道枣核状溃疡。',
    pathogen: '新城疫病毒(NDV)，副黏病毒科PMV-1，单股RNA，有HA活性；分嗜内脏速发型、嗜神经速发型、中发型、缓发型、无症状型五型。',
    epidemiology: '鸡、火鸡最敏感，幼雏和中雏最易感；鸭鹅有抵抗力但近年出现对鹅致病株；经呼吸道、消化道传播；免疫鸡群强毒一旦建立感染无法靠疫苗清除。',
    symptoms: '急性型——体温43~44℃、冠肉髯发绀、咳嗽伸颈张口呼吸发"咯咯"声、嗉囊充满酸臭液、黄绿色稀便、翅腿麻痹；亚急性/慢性型以神经症状为主；非典型型见于免疫鸡群。',
    pathologicalChanges: '腺胃乳头出血、溃疡或坏死（特征性）；肠道淋巴组织肿大出血溃疡呈枣核状（最具特征性）；气管黏液渗出充血出血；心冠脂肪出血点。',
    diagnosis: 'HI效价256倍(8log2)以上提示强毒感染；需与禽霍乱、传支、禽流感鉴别。',
    prevention: '6~10日龄三联弱毒活苗滴鼻点眼+二联油苗颈部皮下；21日龄IV系饮水；60日龄I系肌注；120日龄二联油苗肌注；母源抗体降至16倍(4log2)即接种；发病后按《动物防疫法》捕杀+紧急接种。',
    immunizationSchedule: '6~10日龄三联弱毒苗1羽份滴鼻点眼+二联油苗半剂量皮下；21日龄IV系/克隆30 2羽份饮水；60日龄I系1羽份肌注；120日龄二联油苗1羽份肌注。母源抗体雏鸡降至16倍(4log2)、大鸡降至8倍(3log2)即接种。',
    differentialDiagnosis: '新城疫=腺胃乳头出血+枣核溃疡；禽流感=头肿冠髯黑+脚鳞出血；肾传支=花斑肾+一过性呼吸道症状。',
    medicationNotes: '发病后按《动物防疫法》捕杀+紧急接种，无治疗价值。',
    symptomTags: ['咯咯声', '冠髯发绀', '黄绿色稀便', '神经症状', '翅腿麻痹'],
    lesionTags: ['腺胃乳头出血', '枣核状溃疡', '心冠脂肪出血'],
    tags: ['新城疫', '病毒病', '副黏病毒'],
    difficultyLevel: 'INTERMEDIATE'
  },
  // ch06 鸡传染性支气管炎
  {
    diseaseName: '鸡传染性支气管炎',
    category: 'viral',
    chapterNumber: 6,
    description: 'IBV(冠状病毒)引起的鸡呼吸道病，肾型见"花斑肾"、生殖型致假产蛋鸡。',
    pathogen: '传染性支气管炎病毒(IBV)，冠状病毒科，单股正链RNA，易重组产生新血清型；分呼吸道型、肾炎型、生殖型。',
    epidemiology: '仅鸡发病；雏鸡最严重，3~10周龄最常发生肾型；康复鸡带毒49d、35d内有传染性；经空气飞沫呼吸道传播，也可经消化道传播；传播迅速。',
    symptoms: '呼吸型——突然出现呼吸症状迅速蔓延全群、产蛋大幅下降、软壳/沙皮/畸形蛋、蛋清稀薄如水；肾病变型——两相性，先轻微呼吸道症状后急性肾病、排灰白尿酸盐、脱水；生殖型——1月龄内感染致输卵管永久损害，"假产蛋鸡"。',
    pathologicalChanges: '呼吸型——气管下段及支气管干酪样栓塞；肾病变型——肾脏肿大苍白呈"花斑肾"，输尿管尿酸盐增粗；生殖型——输卵管囊肿/狭窄/盲端。',
    diagnosis: '突然发生迅速蔓延+咳嗽啰音+产蛋下降+肾脏病变；确诊靠病毒分离（尿囊腔接种10~11日龄鸡胚）与血清学（中和试验、琼扩）。',
    prevention: 'H120（1~3日龄滴鼻点眼）→新城疫-传支三联苗→H52（25~30日龄饮水）→H52（120日龄饮水）；治疗用抗生素防继发+保肾药+口服补液盐+维生素A；禁用磺胺类；保暖是降低死亡率的重要措施。',
    immunizationSchedule: '1~3日龄H120滴鼻点眼1~2滴；25~30日龄H52饮水；120日龄H52 2羽份饮水；H52限20日龄以上使用。',
    differentialDiagnosis: '花斑肾：肾传支 vs 法氏囊病 vs 痛风。传支有呼吸道前驱症状，法氏囊有法氏囊特征病变，痛风无传染性。',
    medicationNotes: '治疗禁用磺胺类（伤肾）；保肾药用禽肾康/肾肿解毒药+口服补液盐+维生素A；保暖是降低死亡率的重要措施。',
    symptomTags: ['花斑肾', '产蛋下降', '畸形蛋', '蛋清稀薄', '呼吸道症状', '尿酸盐'],
    lesionTags: ['花斑肾', '输尿管尿酸盐', '输卵管囊肿', '气管干酪样栓塞'],
    tags: ['传支', '病毒病', '冠状病毒', '花斑肾'],
    difficultyLevel: 'INTERMEDIATE'
  },
  // ch07 鸡传染性喉气管炎
  {
    diseaseName: '鸡传染性喉气管炎',
    category: 'viral',
    chapterNumber: 7,
    description: 'ILTV(α疱疹病毒)致喉头气管出血糜烂、咳血性渗出物。',
    pathogen: '传染性喉气管炎病毒(ILTV)，α疱疹病毒亚科，双股DNA，仅1个血清型但不同毒株致病性差异大；抵抗力很弱，1%苛性钠1min杀死。',
    epidemiology: '仅鸡易感，成年鸡症状最典型；约2%康复鸡带毒长达2年；经咳出血液/黏液由呼吸道感染；发病率可达90%，病死率5%~70%（一般10%~20%）；秋末冬初多发。',
    symptoms: '典型病例——鼻孔半透明分泌物、湿啰音、咳嗽气喘、咳带血黏液/凝血块、鸡冠发紫；缓和型（30~40日龄）——结膜炎、眼睑肿胀、畏光流泪。',
    pathologicalChanges: '喉头气管黏膜肿胀充血出血糜烂；喉裂处干酪样栓塞；气管内血性黏稠渗出物/凝血块/黄白干酪样凝栓阻塞气管。',
    diagnosis: '青年鸡和开产前后鸡呼吸困难+咳血性渗出物+喉头气管病变；确诊靠鸡胚接种（绒毛尿囊膜灰白坏死斑）、核内包涵体检查、中和试验。',
    prevention: '疫区35~40日龄和80~100日龄各用弱毒苗免疫1次（滴鼻/点眼/饮水）；非疫区不接种以防散毒；治疗：对症止血、加多种维生素和抗生素防继发感染。',
    immunizationSchedule: '35~40日龄弱毒苗1羽份；80~100日龄弱毒苗1羽份；非疫区不接种。',
    differentialDiagnosis: '咳血性渗出物+喉头干酪样凝栓为特征性表现，区别于传支（无咳血）和禽流感（全身性出血）。',
    medicationNotes: '对症止血治疗；加多种维生素和抗生素防继发感染；非疫区不接种以防散毒。',
    symptomTags: ['咳血', '呼吸困难', '湿啰音', '眼睑肿胀'],
    lesionTags: ['喉头出血', '气管干酪样凝栓', '核内包涵体'],
    tags: ['喉气管炎', '病毒病', '疱疹病毒'],
    difficultyLevel: 'INTERMEDIATE'
  },
  // ch08 马立克氏病
  {
    diseaseName: '马立克氏病',
    category: 'viral',
    chapterNumber: 8,
    description: 'MDV致淋巴组织增生性肿瘤病，神经型"劈叉"、法氏囊萎缩。',
    pathogen: '马立克氏病病毒(MDV)，疱疹病毒科α-疱疹病毒，线状双股DNA；3个血清型：1型致瘤、2型不致瘤、3型HVT；羽囊游离病毒传染性很强，污染垫料室温下传染性长达4~8个月。',
    epidemiology: '鸡最易感；初生雏鸡在出雏器和育雏室早期感染可大批发病；随羽毛皮屑气源传播；按HVT能否保护分温和毒、强毒、超强毒。',
    symptoms: '神经型（古典型）——"劈叉"姿势、不全麻痹至完全麻痹；眼型——虹膜色素消失呈灰白"白眼病"；皮肤型——毛囊灰白硬结节融合成火山口状肿块；内脏型——鸡冠苍白萎缩、下痢。',
    pathologicalChanges: '神经型——受害神经一侧性粗2~3倍，黄白/灰白、横纹消失；内脏型——卵巢最常受害，灰白肿块弥漫/结节状；法氏囊通常萎缩（区别于禽白血病法氏囊肿大）。',
    diagnosis: '内脏型需与禽白血病区别（法氏囊萎缩vs肿大）；确诊用琼扩试验检测羽毛囊病毒抗原和血清MD抗体。',
    prevention: '1日龄内雏鸡颈部皮下注射1羽份，疫苗2h内用完；细胞结合苗需液氮保存；多价苗（2+3型或1+2+3型）控制超强毒株；无治疗价值，尽早淘汰。',
    immunizationSchedule: '1日龄内颈部皮下注射1羽份火鸡疱疹病毒苗；稀释后2h内用完；多价苗控制超强毒株。',
    differentialDiagnosis: '马立克 vs 禽白血病：法氏囊萎缩=MD；肿大=白血病。',
    medicationNotes: '无治疗价值，尽早淘汰。',
    symptomTags: ['劈叉', '麻痹', '白眼病', '鸡冠苍白', '皮肤结节'],
    lesionTags: ['法氏囊萎缩', '神经肿大', '卵巢肿瘤', '内脏肿瘤'],
    tags: ['马立克氏病', '病毒病', '疱疹病毒', '肿瘤'],
    difficultyLevel: 'INTERMEDIATE'
  },
  // ch09 禽白血病
  {
    diseaseName: '禽白血病',
    category: 'viral',
    chapterNumber: 9,
    description: 'ALV反转录病毒致肿瘤，垂直传播为主，法氏囊肿大、肝"大肝病"。',
    pathogen: '禽白血病/肉瘤病毒群(ALV)，反转录病毒科，分A、B、C、D、E、J共6个亚群；抵抗力弱，不耐热不耐酸碱。',
    epidemiology: '仅鸡感染发病，母鸡比公鸡易感，4~10月龄发病率高；主要经带毒蛋垂直传播（输卵管蛋清分泌部病毒浓度最高）；垂直先天性感染雏鸡不产生抗体、长期带毒排毒；死亡率5%~6%。',
    symptoms: '淋巴细胞性白血病（最常见）——16周龄后发病，全身衰弱、冠髯苍白蜷缩、进行性消瘦、腹部胀大；血管瘤——成年蛋鸡皮肤/脚趾血疱破裂大出血。',
    pathologicalChanges: '肝、脾、法氏囊肿大，肝呈大理石样"大肝病"；肿瘤始自法氏囊细胞（囊依赖性）；法氏囊肿大（区别于马立克氏病萎缩）。',
    diagnosis: '16周龄以上发病+渐进性消瘦+低死亡率+内脏肿瘤/血管瘤；确诊靠病理组织学、琼扩、补体结合、免疫荧光。',
    prevention: '无有效疫苗、无特效疗法；控制靠检疫净化——每1~3个月检疫1次，雏鸡群发现全群淘汰，逐步培育SPF鸡群。',
    immunizationSchedule: '无有效疫苗。净化程序：每1~3个月检疫1次，雏鸡群发现全群淘汰，逐步培育SPF鸡群。',
    differentialDiagnosis: '马立克 vs 禽白血病：法氏囊萎缩=MD；肿大=白血病。',
    medicationNotes: '无特效疗法，检疫淘汰是唯一手段。',
    symptomTags: ['消瘦', '冠髯苍白', '腹部胀大', '血管瘤'],
    lesionTags: ['法氏囊肿大', '大肝病', '肝肿瘤', '脾肿大'],
    tags: ['禽白血病', '病毒病', '反转录病毒', '垂直传播'],
    difficultyLevel: 'ADVANCED'
  },
  // ch10 传染性法氏囊病
  {
    diseaseName: '传染性法氏囊病',
    category: 'viral',
    chapterNumber: 10,
    description: 'IBDV侵害幼鸡法氏囊，致免疫抑制。',
    pathogen: '传染性法氏囊病病毒(IBDV)，双股双节RNA病毒，无囊膜无血凝性；血清I型（鸡源）分6个亚型；抵抗力较强，污染环境可存活122d。',
    epidemiology: '仅鸡，2~15周龄，3~6周龄最多；经粪便污染饲料饮水垫料用具传播；发病率可达100%，病死率5%~60%。',
    symptoms: '自啄肛门→羽毛蓬松、畏寒扎堆、昏睡→排灰白稀便→严重脱水、极度虚弱致死；变异株呈亚临床、法氏囊萎缩。',
    pathologicalChanges: '胸肌腿肌出血；法氏囊肿大（比正常重2倍），浆膜水肿黄色胶冻样/出血/紫葡萄样，5d后萎缩；肾脏花斑状；肌胃与腺胃交界处出血带。',
    diagnosis: '琼扩试验（1:5生理盐水乳剂冻融3~5次，8%氯化钠琼脂板24~48h见沉淀线）；病毒分离（尿囊腔接种9~12日龄鸡胚3~5d死亡）。',
    prevention: '种鸡18~20周龄和40~42周龄各注射一次灭活油苗提高母源抗体；雏鸡按母源抗体定首免日龄；中等毒力苗保护率高；治疗：注射IBD高免血清/高免卵黄抗体+肾肿解毒药+口服补液盐。',
    immunizationSchedule: '母源抗体阳性率<80%则10~16日龄首免；80%~100%复测降至50%时14~18日龄；种鸡18~20周龄+40~42周龄灭活油苗。',
    differentialDiagnosis: '花斑肾：法氏囊病 vs 肾传支 vs 痛风。法氏囊病有法氏囊特征病变（肿大→萎缩），传支有呼吸道前驱症状。',
    medicationNotes: '治疗：注射IBD高免血清/高免卵黄抗体+肾肿解毒药+口服补液盐。',
    symptomTags: ['自啄肛门', '畏寒扎堆', '灰白稀便', '脱水'],
    lesionTags: ['法氏囊肿大', '胸肌腿肌出血', '花斑肾', '腺胃肌胃交界出血'],
    tags: ['法氏囊病', '病毒病', '免疫抑制'],
    difficultyLevel: 'INTERMEDIATE'
  },
  // ch11-42 省略部分以控制脚本大小，关键疾病完整保留
  {
    diseaseName: '鸡传染性贫血',
    category: 'viral',
    chapterNumber: 11,
    description: 'CIAV致再生障碍性贫血与免疫抑制，股骨骨髓脂肪化。',
    pathogen: '鸡传染性贫血病毒(CIAV)，圆环病毒科，环状单股DNA，无血凝性；60℃耐1h以上，100℃ 15min灭活。',
    epidemiology: '仅鸡，2~4周龄自然发病多见；主要垂直传播，也可水平传播；IBDV、MDV、REV等免疫抑制因素增强其传染性；死亡率一般30%。',
    symptoms: '精神沉郁、发育受阻、贫血、皮肤出血，有的皮下出血继发坏疽性皮炎；血细胞比容降至20%以下；死亡率可达10%~60%。',
    pathologicalChanges: '股骨骨髓脂肪化呈淡黄红色（最具特征病变）；胸腺萎缩甚至完全退化；法氏囊萎缩；全身性贫血、血液稀薄。',
    diagnosis: '肝脏悬液加等量氯仿处理后接种1日龄SPF鸡，14~16d后血细胞比容<27%、股骨骨髓黄白、胸腺萎缩即可确诊；应与原虫病、黄曲霉毒素和磺胺类药物中毒区别。',
    prevention: '有致病力活疫苗13~15周龄种鸡饮水免疫防子代发病，产蛋前3~4周不能接种；尚无有效治疗方法；控制关键是种鸡检疫与净化。',
    immunizationSchedule: '13~15周龄种鸡饮水免疫；产蛋前3~4周不能接种。',
    differentialDiagnosis: '应与原虫病、黄曲霉毒素和磺胺类药物中毒区别。',
    medicationNotes: '尚无有效治疗方法，控制关键是种鸡检疫与净化。',
    symptomTags: ['贫血', '皮肤出血', '血细胞比容低'],
    lesionTags: ['骨髓脂肪化', '胸腺萎缩', '法氏囊萎缩'],
    tags: ['传染性贫血', '病毒病', '圆环病毒', '免疫抑制'],
    difficultyLevel: 'ADVANCED'
  },
  {
    diseaseName: '网状内皮组织增殖病',
    category: 'viral',
    chapterNumber: 12,
    description: 'REV致淋巴组织肿瘤和免疫抑制，污染疫苗是重要传播因素。',
    pathogen: '网状内皮组织增殖病病毒(REV)，反转录病毒科，RNA病毒；属同一血清型。',
    epidemiology: '火鸡、鸭、鹅、鸡、鹌鹑，火鸡最常见；经接触水平传播，可经鸡胚垂直传播；污染REV的禽用疫苗是重要传播因素。',
    symptoms: '急性致死性网状细胞肿瘤——死亡率可达100%；慢性淋巴细胞性肿瘤；矮小综合征——生长抑制、胸腺/法氏囊萎缩、羽毛发育异常、肠炎。',
    pathologicalChanges: '肝脾急性肿大伴局灶/弥漫性浸润（急性型）；非缺陷型致细胞免疫和体液免疫抑制。',
    diagnosis: '缺乏特征性症状病变，应做病毒分离、鉴定和血清学试验；与马立克氏病、淋巴细胞性白血病鉴别。',
    prevention: '尚无特异性防制办法，参照禽白血病的综合性防疫措施进行防制。',
    immunizationSchedule: '无疫苗。',
    differentialDiagnosis: '与马立克氏病、淋巴细胞性白血病鉴别。',
    medicationNotes: '尚无特异性防制办法。',
    symptomTags: ['生长抑制', '羽毛异常', '免疫抑制'],
    lesionTags: ['肝脾肿大', '胸腺法氏囊萎缩'],
    tags: ['网状内皮增殖病', '病毒病', '反转录病毒', '免疫抑制'],
    difficultyLevel: 'ADVANCED'
  },
  {
    diseaseName: '禽腺病毒病',
    category: 'viral',
    chapterNumber: 13,
    description: '含产蛋下降综合征(EDS-76)、包涵体肝炎(IBH)、心包积水综合征(安卡拉病)。',
    pathogen: '禽腺病毒属，无囊膜双股DNA病毒；分三类——EDS-76病毒（Ⅲ群）、IBHV（11个血清型）、安卡拉病毒（Ⅰ亚群血清4型）。',
    epidemiology: 'EDS-76：鸭鹅为自然宿主，鸡26~32周龄最易感；IBH：3~10周龄肉鸡多发；安卡拉：白羽肉鸡5~7周龄多发，死亡率20%~80%。均垂直+水平传播。',
    symptoms: 'EDS-76——产蛋骤降20%~38%至50%，蛋壳变浅/沙皮/薄壳/软壳/畸形；IBH——急性死亡，3~4d达高峰；安卡拉——无明显先兆突然倒地死亡。',
    pathologicalChanges: 'EDS-76——缺乏特征病变，卵巢静止/萎缩；IBH——肝肿大质脆、黄色坏死灶、肝脂肪变性、核内包涵体；安卡拉——心包大量黄色清亮液体/胶冻样物，心肌松软出血。',
    diagnosis: 'EDS-76用HI试验（≥1:8）；IBH与住白细胞原虫病、传染性贫血、法氏囊病鉴别；安卡拉与IBH主要区别在心包积液。',
    prevention: '开产前用减蛋综合征油佐剂灭活苗或新城疫-减蛋综合征二联油佐剂灭活苗；安卡拉已有商品疫苗；无特效药，安卡拉注射高免血清/卵黄抗体+保肝护肾强心利尿。',
    immunizationSchedule: '开产前用减蛋综合征油佐剂灭活苗或新城疫-减蛋综合征二联油佐剂灭活苗；安卡拉已有商品疫苗。',
    differentialDiagnosis: '安卡拉与IBH主要区别在心包积液。',
    medicationNotes: '安卡拉注射高免血清/卵黄抗体+保肝护肾强心利尿。',
    symptomTags: ['产蛋骤降', '蛋壳异常', '突然死亡'],
    lesionTags: ['心包积液', '肝坏死', '核内包涵体'],
    tags: ['腺病毒', '病毒病', 'EDS-76', '安卡拉病', '包涵体肝炎'],
    difficultyLevel: 'ADVANCED'
  },
  {
    diseaseName: '禽痘',
    category: 'viral',
    chapterNumber: 14,
    description: '皮肤型结节与白喉型假膜，翼膜刺种免疫。',
    pathogen: '禽痘病毒(Avipoxvirus)，大型DNA病毒，砖形/长方形，在患部上皮细胞内形成包涵体；对干燥抵抗力极强。',
    epidemiology: '鸡、火鸡为主，雏鸡和中雏最易发病；脱落痘痂是主要散播形式；库蚊、伊蚊、按蚊及鸡皮刺螨为重要媒介，蚊虫带毒10~30d；夏秋多皮肤型，冬季多白喉型；死亡率5%~60%。',
    symptoms: '皮肤型——冠肉垂嘴角等无羽部位灰白小结节→豌豆大灰黄结节→痘痂3~4周脱落；黏膜型（白喉型）——口腔咽喉灰黄色斑→黄白色假膜→阻塞咽喉窒息；混合型。',
    pathologicalChanges: '皮肤型——表皮毛囊上皮增生结节；黏膜型——隆起白色结节→连片可剥离干酪样假膜。',
    diagnosis: '典型痘疹/痂皮/伪膜+蚊虫季节+1月龄及开产初期多发；确诊：病料接种10~11日龄鸡胚绒毛尿囊膜5~7d见增生性痘斑。',
    prevention: '15日龄前后首免鸡痘鹌鹑化弱毒疫苗翼膜刺种，开产前第2次免疫；接种后查发痘确认免疫效果；消灭蚊虫和外寄生虫。',
    immunizationSchedule: '15日龄前后首免翼膜刺种；开产前二免；免疫期4~5个月。',
    differentialDiagnosis: '与白念珠菌病、毛滴虫病、维生素A缺乏症区别。',
    medicationNotes: '对症剥除痘痂涂紫药水/碘酊，大群用鸡痘散+吗啉胍+环丙沙星防继发。',
    symptomTags: ['痘疹', '冠部结节', '假膜', '呼吸困难'],
    lesionTags: ['皮肤结节', '黏膜假膜', '包涵体'],
    tags: ['禽痘', '病毒病', '翼膜刺种'],
    difficultyLevel: 'BEGINNER'
  },
  {
    diseaseName: '禽病毒性关节炎',
    category: 'viral',
    chapterNumber: 15,
    description: '禽呼肠孤病毒致跗关节肿胀腓肠腱断裂。',
    pathogen: '禽呼肠孤病毒(Reovirus)，无囊膜，10节段双链RNA；耐热60℃ 8~10h；70%乙醇和0.5%有机碘可灭活。',
    epidemiology: '鸡和火鸡；可经种蛋垂直传播，水平传播是主要途径；多数呈隐性或慢性感染。',
    symptoms: '急性跛行、部分生长受阻；慢性跛行更明显，跗关节不能运动；大日龄肉鸡腓肠腱断裂致顽固性跛行；种鸡/蛋鸡产蛋量下降10%~15%。',
    pathologicalChanges: '跗关节上下周围肿胀，腓肠腱水肿，滑膜点状出血，关节腔含淡黄色或血样渗出物；慢性腱鞘硬化粘连，关节软骨点状溃烂。',
    diagnosis: '从肿胀腱鞘/跗关节关节液分离鉴定病毒；琼扩试验最常用。',
    prevention: '弱毒活疫苗皮下接种，与马立克氏病疫苗接种间隔>5d避免免疫干扰；无有效治疗方法，淘汰长期排毒病鸡。',
    immunizationSchedule: '6~8日龄活苗首免、8周龄加强，开产前2~3周注射灭活苗；与MD疫苗间隔>5d。',
    differentialDiagnosis: '',
    medicationNotes: '无有效治疗方法，淘汰长期排毒病鸡。',
    symptomTags: ['跛行', '跗关节肿胀', '腓肠腱断裂'],
    lesionTags: ['关节腔渗出', '腱鞘硬化'],
    tags: ['病毒性关节炎', '病毒病', '呼肠孤病毒'],
    difficultyLevel: 'INTERMEDIATE'
  },
  {
    diseaseName: '禽脑脊髓炎',
    category: 'viral',
    chapterNumber: 16,
    description: '幼龄群发震颤+共济失调+外周神经不受侵害，观星状。',
    pathogen: '禽脑脊髓炎病毒(AEV)，小RNA病毒科肠道病毒属，无囊膜；各毒株无血清学差异。',
    epidemiology: '鸡、野鸡、鹌鹑、火鸡；3周龄雏鸡易感性最高；主要经消化道传播，垂直传播起重要作用。',
    symptoms: '共济失调（驱赶时更明显）；头颈阵发性震颤；严重者不能起立倒卧一侧；发病率5%~90%，病死率10%~70%。',
    pathologicalChanges: '腺胃壁白色小病灶（淋巴细胞浸润团块）；组织学见中枢神经系统非化脓性脑脊髓炎，血管周围淋巴细胞"管套"现象；外周神经不受侵害。',
    diagnosis: '幼龄群发震颤+共济失调+外周神经不受侵害；确诊：病鸡脑组织接种5~7日龄鸡胚卵黄囊观察。',
    prevention: '1143毒株活苗可饮水但<8周龄禁用、产蛋期禁用；灭活油乳剂苗安全性好，种鸡开产前18~20周接种。',
    immunizationSchedule: '活苗<8周龄及产蛋期禁用；蛋鸡10周龄以上、开产前4周前接种；灭活油苗种鸡开产前18~20周。',
    differentialDiagnosis: '观星状：禽脑脊髓炎 vs 维生素B1缺乏。脑脊髓炎外周神经不受侵害。',
    medicationNotes: '轻症隔离+维生素E/B/谷维素保护神经；重症淘汰；抗AE卵黄抗体肌注每只雏鸡0.5~1.0mL每日1次连用2d。',
    symptomTags: ['观星状', '震颤', '共济失调'],
    lesionTags: ['腺胃壁白色病灶', '脑脊髓炎'],
    tags: ['脑脊髓炎', '病毒病', '观星状'],
    difficultyLevel: 'INTERMEDIATE'
  },
  // 鸭病3章
  {
    diseaseName: '鸭瘟',
    category: 'viral',
    chapterNumber: 17,
    description: '鸭瘟病毒致鸭鹅败血症，食道/泄殖腔假膜溃疡、肝坏死灶，"大头瘟"。',
    pathogen: '鸭瘟病毒，疱疹病毒，球形有囊膜DNA病毒；耐低温，对热敏感（80℃ 5min死亡）。',
    epidemiology: '仅鸭感染，鹅密切接触偶发；成年鸭和产蛋母鸭发病死亡较重；经消化道、交配、眼结膜、呼吸道感染；病死率可高达90%以上。',
    symptoms: '体温43℃以上稽留；流泪和眼睑水肿为特征；部分头颈肿胀（"大头瘟"）；鼻流分泌物、呼吸困难；下痢排绿色/灰白稀便；泄殖腔黏膜充血出血水肿。',
    pathologicalChanges: '食道黏膜纵行灰黄色假膜/出血点，剥离留溃疡（特征性）；泄殖腔黏膜灰褐/绿色坏死结痂（具诊断意义）；肝表面灰白色坏死点。',
    diagnosis: '鸭鹅发病其他家禽不病+食道/泄殖腔假膜溃疡+肝坏死灶；确诊靠病毒分离鉴定、中和试验。',
    prevention: '雏鸭20日龄首免、4~5月龄强化1次；3月龄以上免疫1次免疫期可达1年；母鸭开产前1个月或停产时接种。',
    immunizationSchedule: '雏鸭20日龄首免、4~5月龄强化；3月龄以上免疫期1年；母鸭开产前1个月。',
    differentialDiagnosis: '鸭瘟 vs 鸭巴氏杆菌：鸭瘟=头颈肿+食道泄殖腔假膜溃疡、其他家禽不病；巴氏杆菌=两极浓染+抗生素有效、其他家禽也发病。',
    medicationNotes: '发生即隔离紧急接种。',
    symptomTags: ['大头瘟', '头颈肿胀', '流泪', '泄殖腔假膜'],
    lesionTags: ['食道假膜溃疡', '泄殖腔坏死', '肝坏死灶'],
    tags: ['鸭瘟', '病毒病', '疱疹病毒'],
    difficultyLevel: 'INTERMEDIATE'
  },
  {
    diseaseName: '鸭病毒性肝炎',
    category: 'viral',
    chapterNumber: 18,
    description: '鸭肝炎病毒致小鸭"角弓反张"、肝出血。',
    pathogen: '鸭肝炎病毒，微RNA病毒，分1、2、3三个血清型无交叉免疫；56℃ 60min仍存活；4℃存活>2年。',
    epidemiology: '5~10日龄雏鸭，1周龄内病死率可达95%；成年鸭有抵抗力；主要在孵化季节发生。',
    symptoms: '突然发病传播迅速，运动失调、全身抽搐、两脚乱蹬、头仰向后背（"背脖病"/角弓反张），数小时内死亡；喙端爪尖淤血暗紫。',
    pathologicalChanges: '肝肿大质脆色暗或发黄，表面大小不等出血斑点；胆囊肿大充满胆汁；脾脏肿大斑驳状；肾脏肿大充血。',
    diagnosis: '2周龄以下雏鸭+角弓反张+肝出血；病料接种1~2日龄易感鸭复制症状。',
    prevention: '母鸭开产前鸡胚化鸭肝炎弱毒疫苗皮下接种2次间隔2周，经母源抗体保护雏鸭2周；未经免疫种鸭群后代1日龄肌注0.5mL弱毒苗。',
    immunizationSchedule: '母鸭开产前皮下2次各1mL间隔2周；疫场雏鸭10~14日龄再免。',
    differentialDiagnosis: '角弓反张：鸭病毒性肝炎 vs 鸭浆膜炎濒死期。肝炎以肝出血为特征。',
    medicationNotes: '皮下注射康复鸭血清/高免血清/免疫母鸭蛋黄匀浆0.5~1.0mL。',
    symptomTags: ['角弓反张', '抽搐', '肝出血'],
    lesionTags: ['肝出血斑', '胆囊肿大'],
    tags: ['鸭病毒性肝炎', '病毒病', '角弓反张'],
    difficultyLevel: 'INTERMEDIATE'
  },
  {
    diseaseName: '鸭坦布苏病',
    category: 'viral',
    chapterNumber: 19,
    description: '坦布苏病毒(TMUV)致蛋鸭产蛋骤降、雏鸭神经症状，蚊媒传播。',
    pathogen: '坦布苏病毒(TMUV)，黄病毒科，蚊媒病毒，单股正链RNA，有脂质包膜；不耐热，56℃ 15min灭活。',
    epidemiology: '感染除番鸭外所有品种产蛋鸭；库蚊可传播；发病突然传染迅速，感染率高达100%；秋季流行严重。',
    symptoms: '肉鸭——20日龄前发病，以神经症状为主，站立不稳倒地不起；蛋鸭——采食量骤降（数天降50%+），产蛋率从90%~95%降至5%~10%，后期瘫痪/共济失调。',
    pathologicalChanges: '肉鸭——心包积液心肌萎缩坏死，肝出血萎缩，脑膜出血脑组织水肿；蛋鸭——卵巢发育不良/卵泡变性坏死液化，脑膜出血水肿。',
    diagnosis: '产蛋骤降+神经症状+卵泡病变；确诊：病毒分离（卵泡膜最易分离到病毒）、ELISA、PCR。',
    prevention: '鸭坦布苏病毒活疫苗肌内注射0.5mL，2周后加强1次；产蛋鸭开产前1~2周免疫1次。',
    immunizationSchedule: '活疫苗肌内注射0.5mL，2周后加强1次；产蛋鸭开产前1~2周免疫1次。',
    differentialDiagnosis: '',
    medicationNotes: '无特效药，中草药清泻肝火健脾+多种维生素+清瘟败毒散+黄芪多糖+双黄连对症。',
    symptomTags: ['产蛋骤降', '神经症状', '瘫痪'],
    lesionTags: ['卵泡变性坏死', '脑膜出血', '心包积液'],
    tags: ['鸭坦布苏病', '病毒病', '黄病毒'],
    difficultyLevel: 'INTERMEDIATE'
  },
  // 细菌病 ch22-ch30
  {
    diseaseName: '禽大肠杆菌病',
    category: 'bacterial',
    chapterNumber: 22,
    description: '以气囊炎、心包炎、肝周炎为主，不以腹泻为主，致病血清型O1/O2/O36/O78。',
    pathogen: '大肠埃希菌(Escherichia coli)，革兰氏阴性杆菌；致病血清型主要为O1、O2、O36、O78等16个。',
    epidemiology: '鸡鸭鹅火鸡均可发生，雏鸡危害最重（5~9周龄多见）；鸡肠道内1%~15%大肠杆菌为潜在致病型；多途径传播；冬末春初多见。',
    symptoms: '分多种类型——胚胎/幼雏早期死亡、呼吸道感染（气囊病5~12周龄）、心包炎、肝周炎、腹膜炎（企鹅姿势）、输卵管炎、滑膜炎、肉芽肿、脑病、全眼球炎。',
    pathologicalChanges: '气囊浑浊增厚附干酪样物；心包膜浑浊增厚积淡黄色渗出液；肝表面玉米粉状沉积或纤维素性假膜；腹膜炎见纤维素性渗出与游离卵黄液。',
    diagnosis: '流行病学+病史+临床症状+特征性剖检变化；确诊靠细菌学分离与鉴定。',
    prevention: '加强饲养管理、定期消毒；治疗前应做药敏试验保证效果（极易耐药）。',
    immunizationSchedule: '',
    differentialDiagnosis: '',
    medicationNotes: '治疗前务必做药敏试验，极易耐药。',
    symptomTags: ['气囊炎', '心包炎', '肝周炎', '腹膜炎', '企鹅姿势'],
    lesionTags: ['气囊干酪样', '心包积液', '肝纤维素性假膜'],
    tags: ['大肠杆菌', '细菌病', '革兰氏阴性'],
    difficultyLevel: 'INTERMEDIATE'
  },
  {
    diseaseName: '禽沙门氏菌病',
    category: 'bacterial',
    chapterNumber: 23,
    description: '含鸡白痢、禽伤寒、禽副伤寒，垂直传播是核心。',
    pathogen: '沙门氏菌属(Salmonella)，革兰氏阴性细长杆菌；鸡白痢/禽伤寒菌无鞭毛不运动，禽副伤寒菌有鞭毛能运动。',
    epidemiology: '各品种各年龄鸡均易感，初生雏最易感；垂直传播（带菌卵）是最需警惕的传播方式。',
    symptoms: '鸡白痢——出壳后衰弱、排灰白色糊状稀便黏附肛门、发出"叽叽"叫声；禽伤寒——成年鸡急性败血、体温43~44℃、冠苍白皱缩、排黄绿色稀便、病死率10%~50%。',
    pathologicalChanges: '鸡白痢——肝心肺肌胃灰白色坏死点/黄白色小结节，盲肠干酪样栓塞；禽伤寒——肝呈淡绿色或古铜色质脆、散在灰白小坏死点。',
    diagnosis: '成年鸡可用全血平板凝集试验；确诊须做细菌学分离与鉴定。',
    prevention: '定期检疫淘汰带菌鸡净化种鸡群——每月1次连续3次后每3个月1次直到连续2次阴性；药物预防饲料中添加土霉素、喹诺酮类等。',
    immunizationSchedule: '净化程序：每月1次连续3次，后每3个月1次，直到连续2次阴性改每6个月或1年1次。',
    differentialDiagnosis: '',
    medicationNotes: '药物预防饲料中添加土霉素、喹诺酮类等。',
    symptomTags: ['灰白糊状便', '肛门黏附', '古铜色肝', '叽叽叫'],
    lesionTags: ['肝灰白坏死点', '盲肠干酪样栓塞', '古铜色肝'],
    tags: ['沙门氏菌', '细菌病', '鸡白痢', '垂直传播'],
    difficultyLevel: 'INTERMEDIATE'
  },
  {
    diseaseName: '禽巴氏杆菌病',
    category: 'bacterial',
    chapterNumber: 24,
    description: '禽霍乱，多杀性巴氏杆菌致急性败血症，肝针尖大灰白坏死点，两极浓染。',
    pathogen: '多杀性巴氏杆菌(Pasteurella multocida)，革兰氏阴性，瑞氏染色两极浓染小球杆菌；60℃ 10min死亡。',
    epidemiology: '所有家禽野禽均可发生，鸡鸭最易感；经呼吸道及皮肤创伤感染；夏末秋初潮湿闷热多发。',
    symptoms: '最急性——高产肥胖鸡突然死亡；急性——体温42.5~44℃、排黄白/灰白带绿稀便、呼吸困难、冠肉髯发紫；慢性——肉髯肿大、关节肿大跛行。',
    pathologicalChanges: '肝表面针尖大灰白色坏死点（特征性）；心外膜心冠脂肪出血；十二指肠卡他性出血性肠炎。',
    diagnosis: '肝脏或心血涂片见两极浓染革兰氏阴性小球杆菌可初诊；最终靠病原分离培养鉴定。',
    prevention: '青霉素、链霉素、喹诺酮类、土霉素、磺胺类等有一定疗效；加强卫生消毒和引种检疫。',
    immunizationSchedule: '',
    differentialDiagnosis: '鸭瘟 vs 鸭巴氏杆菌：鸭瘟=头颈肿+食道泄殖腔假膜溃疡；巴氏杆菌=两极浓染+抗生素有效。',
    medicationNotes: '青霉素、链霉素、喹诺酮类、土霉素、磺胺类等有一定疗效。',
    symptomTags: ['突然死亡', '冠髯发紫', '黄绿稀便', '呼吸困难'],
    lesionTags: ['肝灰白坏死点', '两极浓染', '心冠脂肪出血'],
    tags: ['禽霍乱', '细菌病', '巴氏杆菌', '两极浓染'],
    difficultyLevel: 'INTERMEDIATE'
  },
  {
    diseaseName: '鸡传染性鼻炎',
    category: 'bacterial',
    chapterNumber: 25,
    description: '副鸡嗜血杆菌致鼻炎颜面水肿，卫星现象，停药易复发。',
    pathogen: '副鸡嗜血杆菌(Avibacterium paragallinarum)，革兰氏阴性小球杆菌两极染色；兼性厌氧，需V因子（卫星现象）；抵抗力很弱。',
    epidemiology: '育成鸡和产蛋鸡最易发；飞沫/尘埃经呼吸道传播；3~5d可波及全群但死亡率低；阴冷潮湿、通风不良促发。',
    symptoms: '鼻流清稀鼻液→黏性浆液，鼻孔周围结痂恶臭；结膜炎、眼睑红肿、颜面水肿；蔓延到气管肺则呼吸困难有啰音；母鸡产蛋减少。',
    pathologicalChanges: '鼻腔和眶下窦黏膜急性卡他性炎症，窦内含渗出物凝块甚至干酪样物；脸部及肉髯皮下水肿。',
    diagnosis: '鼻腔分泌物涂片见两极浓染革兰氏阴性小球杆菌；卫星现象培养；血清凝集试验感染后7~14d阳性。',
    prevention: '多价灭活油剂菌苗35日龄0.5mL、100日龄1mL；红霉素/多西环素/喹诺酮类/磺胺类治疗。',
    immunizationSchedule: '35日龄0.5mL、100日龄1mL多价灭活油剂菌苗。',
    differentialDiagnosis: '',
    medicationNotes: '治疗仅减轻病情缩短病程，不能根除，停药后可能复发。',
    symptomTags: ['流鼻液', '颜面水肿', '结膜炎', '产蛋减少'],
    lesionTags: ['眶下窦渗出', '面部水肿'],
    tags: ['传染性鼻炎', '细菌病', '副鸡嗜血杆菌'],
    difficultyLevel: 'INTERMEDIATE'
  },
  {
    diseaseName: '鸡坏死性肠炎',
    category: 'bacterial',
    chapterNumber: 26,
    description: '产气荚膜梭菌致肠管扩张充气、黏膜麸皮样坏死。',
    pathogen: '魏氏梭菌(Clostridium perfringens，产气荚膜梭菌)，革兰氏阳性粗大杆菌，厌氧菌。',
    epidemiology: '仅鸡发病，平养鸡多发；肉鸡2~8周龄多见；诱因——密度大、通风不良、球虫病等；夏季多发。',
    symptoms: '突然发生，多无明显症状即突然死亡；病程稍长者排黑色间或混血粪便。',
    pathologicalChanges: '打开腹腔即闻尸腐臭味；小肠中后段肠管表面污灰黑/黑绿色，肠腔扩张充气2~3倍；黏膜呈麸皮样坏死灶，有的形成易剥脱伪膜。',
    diagnosis: '肠道黏膜刮取物涂片见均一革兰氏阳性粗大杆菌；与溃疡性肠炎鉴别。',
    prevention: '林可霉素每吨饲料2.2~4.49g连续饲喂；庆大霉素10mg/kg体重饮水每日2次连用5d；控制球虫病是重要预防措施。',
    immunizationSchedule: '',
    differentialDiagnosis: '',
    medicationNotes: '林可霉素每吨饲料2.2~4.49g连续饲喂；庆大霉素10mg/kg体重饮水每日2次连用5d。',
    symptomTags: ['黑粪', '突然死亡', '尸腐臭味'],
    lesionTags: ['肠管扩张充气', '麸皮样坏死', '伪膜'],
    tags: ['坏死性肠炎', '细菌病', '产气荚膜梭菌'],
    difficultyLevel: 'INTERMEDIATE'
  },
  // 其他微生物病 ch31-ch34
  {
    diseaseName: '禽支原体病',
    category: 'other_microbial',
    chapterNumber: 31,
    description: 'MG致慢性呼吸道病(CRD)，MS致关节滑膜炎，经卵垂直传播，停药易复发。',
    pathogen: '鸡毒支原体(MG)——CRD；滑膜支原体(MS)——关节滑膜炎；均无细胞壁为最小原核生物；MG能凝集鸡/火鸡红细胞；45℃ 1h灭活。',
    epidemiology: 'MG各年龄鸡可感染4~8周龄雏鸡最易感；MG经飞沫呼吸道传播并经卵垂直传播；MS以经卵垂直传播为主；寒冷季节MG多发。',
    symptoms: 'MG——咳嗽喷嚏气管啰音鼻炎、眶下窦蓄积渗出致眼睑肿胀外突，病程可长达1个月以上；MS——跛行、关节肿大变形、胸前水泡、排含大量尿酸盐的青绿色粪便。',
    pathologicalChanges: 'MG——气囊壁增厚混浊并有干酪样渗出物；MS——关节滑膜腱鞘炎性渗出，跗肩关节表面橘黄色溃疡。',
    diagnosis: '全血平板凝集试验最常用；MS凝集试验与MG抗体可交叉反应。',
    prevention: '种蛋处理——泰乐菌素溶液浸泡37~38℃ 15min或46.1℃加热12~14h杀灭90%以上蛋内支原体；MG灭活苗/活苗；泰乐菌素/链霉素/红霉素/喹诺酮类，宜轮换用药。',
    immunizationSchedule: 'MG灭活苗/活苗；MS进口菌苗1~10周龄颈部皮下注射0.5mL连用2次间隔4周。',
    differentialDiagnosis: '',
    medicationNotes: '泰乐菌素/链霉素/红霉素/喹诺酮类，宜轮换用药防耐药。',
    symptomTags: ['咳嗽', '啰音', '眼睑肿胀', '跛行', '关节肿大'],
    lesionTags: ['气囊干酪样渗出', '关节滑膜炎'],
    tags: ['支原体', 'CRD', '慢性呼吸道病', '垂直传播'],
    difficultyLevel: 'INTERMEDIATE'
  },
  // 寄生虫病 ch35-ch39
  {
    diseaseName: '禽球虫病',
    category: 'parasitic',
    chapterNumber: 35,
    description: '盲肠球虫致血便、高致死率，艾美尔属9种球虫。',
    pathogen: '鸡为艾美尔属9种球虫——柔嫩艾美尔球虫（盲肠，致病力最强）、毒害艾美尔球虫（小肠中1/3）等；鸭以毁灭泰泽球虫为主。',
    epidemiology: '鸡15~50日龄发病率和致死率最高；潮湿多雨梅雨季节最易暴发。',
    symptoms: '盲肠球虫病——3~6周龄排血便或全血，死亡率可达50%~100%；小肠球虫病——较大日龄消瘦两脚无力衰竭。',
    pathologicalChanges: '柔嫩艾美尔球虫致盲肠显著肿大（正常3~5倍）充满暗红色血液；毒害艾美尔球虫致小肠中段扩张增厚、胡萝卜色胶冻状内容物。',
    diagnosis: '肠黏膜刮取物镜检；漂浮法查卵囊。',
    prevention: '雏成分开饲养、粪便堆积发酵；抗球虫药需轮换/穿梭使用延缓耐药性。',
    immunizationSchedule: '',
    differentialDiagnosis: '球虫 vs 组织滴虫：球虫=盲肠肿大3~5倍充满暗红血；组织滴虫=盲肠同心层干酪栓+肝圆形凹陷坏死。',
    medicationNotes: '氨丙啉（治疗250mg/kg）、球痢灵（治疗250~300mg/kg连3~5d）、莫能霉素80~125mg/kg、盐霉素60~70mg/kg、马杜拉霉素5~6mg/kg。抗球虫药需轮换/穿梭使用。',
    symptomTags: ['血便', '盲肠肿大', '消瘦'],
    lesionTags: ['盲肠肿大出血', '小肠扩张'],
    tags: ['球虫', '寄生虫病', '血便', '艾美尔球虫'],
    difficultyLevel: 'INTERMEDIATE'
  },
  {
    diseaseName: '禽组织滴虫病',
    category: 'parasitic',
    chapterNumber: 36,
    description: '盲肠肝炎/黑头病，盲肠同心层栓子+肝圆形凹陷坏死。',
    pathogen: '火鸡组织滴虫，分组织型与肠腔型；以盲肠内异刺线虫虫卵为媒介。',
    epidemiology: '火鸡为主要宿主可严重感染致死，鸡多无症状；2周龄至4月龄幼火鸡最易感；温暖潮湿夏秋季节多见。',
    symptoms: '食欲缺乏、呆立翅垂、下痢粪恶臭淡黄/淡绿色，严重黄中带血/全血便；后期鸡冠肉髯发绀呈暗黑色（"黑头病"）。',
    pathologicalChanges: '盲肠肿大充满干酪样凝固栓子，横切面呈同心层状；肝肿大紫褐色，表面黄色/黄绿色中央凹陷边缘隆起的圆形坏死区。',
    diagnosis: '约40℃生理盐水稀释盲肠黏膜刮下物镜检见钟摆式运动虫体。',
    prevention: '定期驱除鸡异刺线虫是根本措施；火鸡与鸡不能同场饲养；甲硝唑（灭滴灵）治疗250mg/kg饲料连用5d。',
    immunizationSchedule: '',
    differentialDiagnosis: '球虫 vs 组织滴虫：球虫=盲肠肿大3~5倍充满暗红血；组织滴虫=盲肠同心层干酪栓+肝圆形凹陷坏死。',
    medicationNotes: '甲硝唑（灭滴灵）治疗250mg/kg饲料连用5d，预防200mg/kg饲料连3d；二甲基咪唑治疗600mg/kg饲料（疗程不超过5d）。',
    symptomTags: ['黑头', '淡黄绿色下痢', '冠髯发黑'],
    lesionTags: ['盲肠同心层栓子', '肝圆形凹陷坏死'],
    tags: ['组织滴虫', '寄生虫病', '黑头病', '盲肠肝炎'],
    difficultyLevel: 'INTERMEDIATE'
  },
  {
    diseaseName: '禽住白细胞虫病',
    category: 'parasitic',
    chapterNumber: 37,
    description: '白冠病，库蠓/蚋传播，咯血或口流鲜血，肌肉白色结节。',
    pathogen: '卡氏住白细胞虫（由库蠓传播）和沙氏住白细胞虫（由蚋传播）；裂殖体圆球形直径可达100~420μm。',
    epidemiology: '鸡；2~4月龄鸡感染率与发病率较高；由库蠓、蚋等吸血昆虫传播；季节性明显——北方7~9月、南方4~10月。',
    symptoms: '3~6周龄雏鸡最重——贫血、鸡冠肉垂苍白；严重病例以咯血或口流鲜血、呼吸困难死亡为特征；成年鸡产蛋量下降。',
    pathologicalChanges: '尸体消瘦、血液稀薄高度贫血；胸肌腿肌心肌及肝脾等器官针尖至粟粒大白色小结节（裂殖体结节）。',
    diagnosis: '翅静脉或鸡冠采1滴血涂片吉姆萨染色镜检见虫体。',
    prevention: '消灭蠓蚋是关键——流行季节每6~7d用杀虫剂喷洒；乙胺嘧啶2~5mg/kg饲料预防。',
    immunizationSchedule: '',
    differentialDiagnosis: '',
    medicationNotes: '磺胺间二甲氧嘧啶治疗500mg/L混饮2d后改300mg/L混饮2d。',
    symptomTags: ['白冠', '咯血', '贫血', '肌肉白色结节'],
    lesionTags: ['裂殖体结节', '血液稀薄'],
    tags: ['住白细胞虫', '寄生虫病', '白冠病', '库蠓'],
    difficultyLevel: 'INTERMEDIATE'
  },
  // 普通病 ch40-ch42
  {
    diseaseName: '营养代谢病',
    category: 'non_infectious',
    chapterNumber: 40,
    description: '痛风、维生素缺乏、钙磷缺乏等营养代谢性疾病。',
    pathogen: '饲料某种营养素不足、过量或比例失调，或中毒损伤肾脏导致代谢障碍。',
    epidemiology: '非传染性。',
    symptoms: '痛风——排白色稀粪、腿翅关节肿胀；维生素B1缺乏——头后仰"观星状"；维生素B2缺乏——趾爪向内蜷曲"蜷爪麻痹"；维生素E-硒缺乏——脑软化、渗出性素质、白肌病。',
    pathologicalChanges: '痛风——内脏浆膜覆白色石膏样尿酸盐，肾"花斑肾"；B1缺乏——多发性神经炎；B2缺乏——坐骨神经两侧对称肿大4~5倍；E-硒缺乏——小脑青绿色坏死、皮下青绿色胶冻样水肿、胸腿心肌灰白条纹状变性。',
    diagnosis: '特征症状+试治有效——蜷爪(B2)、观星(B1)、出血不止(K)、脑软化/白肌(E-硒)、干眼(A)；痛风血清尿酸高于正常值(2~5mg/100mL)。',
    prevention: '痛风——阿托方0.2~0.5g/只或嘌呤醇10~30mg/只；维生素E-硒——饲料加维生素E20IU/kg+亚硒酸钠0.05mg/kg；钙磷——雏鸡钙磷比约2:1、产蛋鸡约4:1。',
    immunizationSchedule: '',
    differentialDiagnosis: '观星状：禽脑脊髓炎 vs 维生素B1缺乏。蜷爪：维生素B2缺乏为特征性。',
    medicationNotes: '痛风——降蛋白补维生素A给足饮水慎用损肾药；维生素E-硒缺乏——饲料加维生素E20IU/kg+亚硒酸钠0.05mg/kg。',
    symptomTags: ['观星状', '蜷爪', '花斑肾', '白色稀粪', '贫血'],
    lesionTags: ['花斑肾', '尿酸盐沉积', '坐骨神经肿大', '白肌病'],
    tags: ['营养代谢病', '普通病', '痛风', '维生素缺乏'],
    difficultyLevel: 'BEGINNER'
  },
  {
    diseaseName: '常见中毒病',
    category: 'non_infectious',
    chapterNumber: 41,
    description: '霉菌毒素、食盐、农药等常见中毒病。',
    pathogen: '发霉饲料+有害气体+过量/失衡添加三条途径。',
    epidemiology: '非传染性。',
    symptoms: '黄曲霉毒素中毒——肝脏受损全身出血腹水消化障碍神经症状；食盐中毒——饮欲剧增嗌胀水泻肌肉震颤瘫痪；一氧化碳中毒——精神委顿呼吸困难呆立昏睡死前痉挛。',
    pathologicalChanges: '黄曲霉毒素——急性肝肿大2~3倍质硬苍白出血坏死，慢性肝硬变萎缩土黄色结节；食盐中毒——雏鸡饮服0.54%食盐水即可致死；一氧化碳——心肺呈樱桃红色。',
    diagnosis: '黄曲霉毒素——365nm紫外灯下G族发亮黄绿色荧光；一氧化碳——碳氧血红蛋白比色法验证。',
    prevention: '防霉——控制饲料水分；中毒处置"断源促排"——停可疑饲料、通风换气、供5%葡萄糖水、轻泻；食盐0.25%~0.5%并给足饮水。',
    immunizationSchedule: '',
    differentialDiagnosis: '',
    medicationNotes: '中毒处置"断源促排"——停可疑饲料、通风换气、供5%葡萄糖水、轻泻。',
    symptomTags: ['中毒', '震颤', '瘫痪', '肝脏损伤'],
    lesionTags: ['肝肿大坏死', '心肺樱桃红'],
    tags: ['中毒病', '普通病', '黄曲霉毒素', '食盐中毒'],
    difficultyLevel: 'BEGINNER'
  },
  {
    diseaseName: '家禽常见其他病',
    category: 'non_infectious',
    chapterNumber: 42,
    description: '脂肪肝综合征、肉鸡猝死综合征、中暑、啄癖等。',
    pathogen: '营养过剩+代谢失衡+环境与管理应激。',
    epidemiology: '非传染性。',
    symptoms: '脂肪肝——鸡体肥胖产蛋减少；猝死——翅膀扑动尖叫突然死亡；中暑——张口伸颈呼吸、冠肉髯先鲜红后发绀；啄癖——啄肛/啄羽/啄趾/啄蛋。',
    pathologicalChanges: '脂肪肝——肝肿大黄褐色油脂样质脆易碎、表面小出血点/血肿；猝死——心脏扩张淤血心室紧缩长条状硬实；中暑——血液凝固不良。',
    diagnosis: '脂肪肝——肥胖高产鸡+肝黄褐色油脂样脆变+肝破裂内出血；中暑——当日高温+皮温烫手。',
    prevention: '脂肪肝——补胆碱22~110mg/kg连用1周；猝死——8~14日龄限饲每天给料16h内；中暑——喷雾降温+饮水中加藿香正气水；啄癖——断喙最有效+供全价日粮。',
    immunizationSchedule: '',
    differentialDiagnosis: '',
    medicationNotes: '脂肪肝——每吨日粮加氯化胆碱1000g+维E10000IU+B12 12mg+肌醇1000g连用2~4周；猝死——低血钾用碳酸氢钾0.62g/只混饮3~5d。',
    symptomTags: ['肥胖', '猝死', '中暑', '啄癖'],
    lesionTags: ['肝脂肪变性', '心脏扩张淤血'],
    tags: ['普通病', '脂肪肝', '猝死综合征', '中暑', '啄癖'],
    difficultyLevel: 'BEGINNER'
  }
];

// ========== 题库数据 ==========

const questionData = [
  // 禽流感
  {
    questionText: '高致病性禽流感的特征性症状是以下哪项？',
    questionType: 'SINGLE_CHOICE',
    options: ['腺胃乳头出血+肠道枣核状溃疡', '头肿、冠髯发黑、脚鳞出血', '花斑肾+产蛋下降', '咳血性渗出物+喉头干酪样凝栓'],
    correctAnswer: 1,
    explanation: '高致病性禽流感的特征为头肿、冠肉髯发黑、脚鳞片下紫红/紫黑出血；腺胃乳头出血+枣核溃疡是新城疫特征，花斑肾是传支特征，咳血+喉头凝栓是喉气管炎特征。',
    knowledgePoint: '禽流感',
    difficulty: 'MEDIUM',
    tags: ['禽流感', '病毒病', '鉴别诊断']
  },
  {
    questionText: '禽流感病毒属于以下哪个病毒科？',
    questionType: 'SINGLE_CHOICE',
    options: ['副黏病毒科', '正黏病毒科', '冠状病毒科', '疱疹病毒科'],
    correctAnswer: 1,
    explanation: '禽流感病毒属于正黏病毒科A型流感病毒。副黏病毒科对应新城疫，冠状病毒科对应传支，疱疹病毒科对应喉气管炎/马立克/鸭瘟。',
    knowledgePoint: '禽流感',
    difficulty: 'EASY',
    tags: ['禽流感', '病原学']
  },
  {
    questionText: '以下关于禽流感免疫的描述，哪项是正确的？',
    questionType: 'SINGLE_CHOICE',
    options: ['2~5周龄鸡接种0.5mL', '鸭首免后无需加强', '接种后7d产生免疫', '5周龄以上鸡接种0.5mL'],
    correctAnswer: 3,
    explanation: 'Re-1株灭活苗：2~5周龄鸡0.3mL/鸭鹅0.5mL；5周龄以上鸡0.5mL/鸭1mL/鹅1.5mL；14d产生免疫；鸭鹅首免3周后需加强。',
    knowledgePoint: '禽流感',
    difficulty: 'MEDIUM',
    tags: ['禽流感', '免疫程序']
  },
  // 新城疫
  {
    questionText: '新城疫最具特征性的病理变化是？',
    questionType: 'SINGLE_CHOICE',
    options: ['肝针尖大灰白坏死点', '花斑肾', '腺胃乳头出血+肠道枣核状溃疡', '心包大量清亮积液'],
    correctAnswer: 2,
    explanation: '新城疫最具特征性的病理变化是腺胃乳头出血和肠道淋巴组织枣核状溃疡。肝灰白坏死点是禽霍乱特征，花斑肾是传支特征，心包积液是安卡拉病特征。',
    knowledgePoint: '新城疫',
    difficulty: 'EASY',
    tags: ['新城疫', '病理变化', '鉴别诊断']
  },
  {
    questionText: '新城疫HI效价达到多少倍提示强毒感染？',
    questionType: 'SINGLE_CHOICE',
    options: ['≥16倍(4log2)', '≥64倍(6log2)', '≥256倍(8log2)', '≥1024倍(10log2)'],
    correctAnswer: 2,
    explanation: '新城疫HI≥256倍(8log2)提示强毒感染，多数可达1024倍(10log2)以上。',
    knowledgePoint: '新城疫',
    difficulty: 'HARD',
    tags: ['新城疫', '诊断']
  },
  // 传支
  {
    questionText: '肾型传支的典型病理变化是？',
    questionType: 'SINGLE_CHOICE',
    options: ['法氏囊肿大', '花斑肾+输尿管尿酸盐增粗', '腺胃乳头出血', '肝星状坏死'],
    correctAnswer: 1,
    explanation: '肾型传支典型病变为肾脏肿大苍白呈"花斑肾"，输尿管尿酸盐增粗。法氏囊肿大是法氏囊病，腺胃乳头出血是新城疫，肝星状坏死是弯曲杆菌性肝炎。',
    knowledgePoint: '鸡传染性支气管炎',
    difficulty: 'EASY',
    tags: ['传支', '花斑肾', '病理变化']
  },
  {
    questionText: '关于H52疫苗的使用，以下哪项是正确的？',
    questionType: 'SINGLE_CHOICE',
    options: ['1~3日龄滴鼻点眼', '可用于任何日龄', '限20日龄以上使用', '仅用于种鸡'],
    correctAnswer: 2,
    explanation: 'H52疫苗限20日龄以上使用。1~3日龄应使用H120滴鼻点眼。',
    knowledgePoint: '鸡传染性支气管炎',
    difficulty: 'MEDIUM',
    tags: ['传支', '免疫程序']
  },
  {
    questionText: '肾型传支治疗时应禁用哪类药物？',
    questionType: 'SINGLE_CHOICE',
    options: ['青霉素类', '磺胺类', '喹诺酮类', '大环内酯类'],
    correctAnswer: 1,
    explanation: '肾传支禁用磺胺类，因磺胺类多经肾排泄易伤肾。应使用保肾药+口服补液盐+维生素A。',
    knowledgePoint: '鸡传染性支气管炎',
    difficulty: 'MEDIUM',
    tags: ['传支', '用药禁忌']
  },
  // 马立克 vs 白血病
  {
    questionText: '鉴别马立克氏病与禽白血病的关键病变差异是？',
    questionType: 'SINGLE_CHOICE',
    options: ['肝肿大程度', '法氏囊萎缩（MD）vs 肿大（白血病）', '神经症状有无', '死亡率高低'],
    correctAnswer: 1,
    explanation: '马立克氏病法氏囊通常萎缩，禽白血病法氏囊肿大——这是两者的关键鉴别点。',
    knowledgePoint: '马立克氏病',
    difficulty: 'MEDIUM',
    tags: ['马立克氏病', '禽白血病', '鉴别诊断']
  },
  // 法氏囊病
  {
    questionText: '传染性法氏囊病的首免日龄应根据什么确定？',
    questionType: 'SINGLE_CHOICE',
    options: ['鸡的品种', '季节', '母源抗体水平', '饲养方式'],
    correctAnswer: 2,
    explanation: '法氏囊病首免日龄依据母源抗体水平确定：阳性率<80%则10~16日龄首免；80%~100%时复测降至50%时14~18日龄首免。',
    knowledgePoint: '传染性法氏囊病',
    difficulty: 'MEDIUM',
    tags: ['法氏囊病', '免疫程序', '母源抗体']
  },
  // 用药禁忌
  {
    questionText: '以下哪种药物严禁内服用于家禽？',
    questionType: 'SINGLE_CHOICE',
    options: ['土霉素', '红霉素', '敌百虫', '氟苯尼考'],
    correctAnswer: 2,
    explanation: '有机磷类（敌百虫等）严禁内服，家禽对有机磷极敏感（血浆胆碱酯酶贮量少）。',
    knowledgePoint: '禽病的药物治疗',
    difficulty: 'EASY',
    tags: ['用药', '禁忌', '有机磷']
  },
  {
    questionText: '氨基糖苷类抗生素（如链霉素）饮水给药治疗全身感染的弊端是？',
    questionType: 'SINGLE_CHOICE',
    options: ['毒性大', '肠道不吸收', '容易耐药', '影响采食'],
    correctAnswer: 1,
    explanation: '氨基糖苷类肠道不吸收，饮水给药仅能治肠道感染，不能治疗全身病。',
    knowledgePoint: '禽病的药物治疗',
    difficulty: 'MEDIUM',
    tags: ['用药', '氨基糖苷类']
  },
  // 球虫 vs 组织滴虫
  {
    questionText: '盲肠球虫病与组织滴虫病的鉴别要点是？',
    questionType: 'MULTIPLE_CHOICE',
    options: ['球虫致盲肠肿大3~5倍充满暗红血', '组织滴虫致盲肠同心层干酪栓', '组织滴虫致肝圆形凹陷坏死', '球虫致肝坏死'],
    correctAnswer: [0, 1, 2],
    explanation: '球虫=盲肠肿大3~5倍充满暗红血；组织滴虫=盲肠同心层干酪栓+肝圆形凹陷坏死。球虫不引起肝坏死。',
    knowledgePoint: '禽球虫病',
    difficulty: 'HARD',
    tags: ['球虫', '组织滴虫', '鉴别诊断']
  },
  // 禽霍乱
  {
    questionText: '禽霍乱（巴氏杆菌病）的特征性病变是？',
    questionType: 'SINGLE_CHOICE',
    options: ['腺胃乳头出血', '花斑肾', '肝针尖大灰白坏死点+两极浓染', '法氏囊肿大'],
    correctAnswer: 2,
    explanation: '禽霍乱特征性病变为肝表面针尖大灰白色坏死点，瑞氏染色见两极浓染革兰氏阴性小球杆菌。',
    knowledgePoint: '禽巴氏杆菌病',
    difficulty: 'EASY',
    tags: ['禽霍乱', '两极浓染', '病理变化']
  },
  // 禽痘
  {
    questionText: '禽痘疫苗的接种方法是？',
    questionType: 'SINGLE_CHOICE',
    options: ['滴鼻点眼', '饮水', '翼膜刺种', '肌内注射'],
    correctAnswer: 2,
    explanation: '禽痘鹌鹑化弱毒疫苗采用翼膜刺种法免疫。滴鼻点眼用于呼吸道病苗，饮水用于群体免疫，肌注用于油苗。',
    knowledgePoint: '禽痘',
    difficulty: 'EASY',
    tags: ['禽痘', '免疫方法', '翼膜刺种']
  },
  // 消毒
  {
    questionText: '空栏熏蒸消毒的标准配比是每立方米？',
    questionType: 'SINGLE_CHOICE',
    options: ['福尔马林10mL+高锰酸钾5g', '福尔马林18mL+高锰酸钾9g', '福尔马林25mL+高锰酸钾12g', '福尔马林15mL+高锰酸钾7g'],
    correctAnswer: 1,
    explanation: '空栏熏蒸标准：每立方米福尔马林18mL+高锰酸钾9g，密闭24h，灭菌率要求99%以上。',
    knowledgePoint: '禽病的预防',
    difficulty: 'MEDIUM',
    tags: ['消毒', '熏蒸']
  },
  // 诊断
  {
    questionText: '反映禽群健康最敏感、最早的症状是？',
    questionType: 'SINGLE_CHOICE',
    options: ['体温升高', '呼吸困难', '采食量减少', '腹泻'],
    correctAnswer: 2,
    explanation: '采食量减少是最早反映禽群健康的最敏感症状。呼吸系统疾病约占禽病70%。',
    knowledgePoint: '禽病的诊断',
    difficulty: 'EASY',
    tags: ['诊断', '临床症状']
  },
  // 免疫合格
  {
    questionText: '免疫合格的判据是接种后2~3周抗体较接种前升高多少倍？',
    questionType: 'SINGLE_CHOICE',
    options: ['≥2倍', '≥4倍', '≥8倍', '≥16倍'],
    correctAnswer: 1,
    explanation: '免疫合格判据：接种后2~3周抗体较接种前升高≥4倍，保护率70%以上为质量较好。',
    knowledgePoint: '禽病的预防',
    difficulty: 'MEDIUM',
    tags: ['免疫', '抗体监测']
  },
  // 鸭瘟鉴别
  {
    questionText: '鸭瘟与鸭巴氏杆菌病的鉴别要点包括以下哪些？',
    questionType: 'MULTIPLE_CHOICE',
    options: ['鸭瘟有头颈肿胀+食道泄殖腔假膜溃疡', '鸭瘟其他家禽不发病', '巴氏杆菌两极浓染+抗生素有效', '巴氏杆菌其他家禽也发病'],
    correctAnswer: [0, 1, 2, 3],
    explanation: '全部选项均为鸭瘟与鸭巴氏杆菌病的鉴别要点。',
    knowledgePoint: '鸭瘟',
    difficulty: 'MEDIUM',
    tags: ['鸭瘟', '巴氏杆菌', '鉴别诊断']
  },
  // 支原体
  {
    questionText: '禽支原体病（CRD）最重要的传播方式是？',
    questionType: 'MULTIPLE_CHOICE',
    options: ['经飞沫呼吸道传播', '经卵垂直传播', '经消化道传播', '经皮肤创伤感染'],
    correctAnswer: [0, 1],
    explanation: 'MG经飞沫/尘埃呼吸道传播并经卵垂直传播；MS以经卵垂直传播为主。垂直传播是支原体净化的最大障碍。',
    knowledgePoint: '禽支原体病',
    difficulty: 'MEDIUM',
    tags: ['支原体', '垂直传播']
  },
  // 观星状
  {
    questionText: '出现"观星状"姿势的疾病包括哪些？',
    questionType: 'MULTIPLE_CHOICE',
    options: ['禽脑脊髓炎', '维生素B1缺乏', '新城疫', '维生素B2缺乏'],
    correctAnswer: [0, 1],
    explanation: '观星状见于禽脑脊髓炎和维生素B1缺乏。B2缺乏为蜷爪麻痹，新城疫以神经症状为主但非观星状。',
    knowledgePoint: '营养代谢病',
    difficulty: 'MEDIUM',
    tags: ['鉴别诊断', '观星状', '神经症状']
  },
  // 血便
  {
    questionText: '引起鸡血便的常见疾病有哪些？',
    questionType: 'MULTIPLE_CHOICE',
    options: ['盲肠球虫病', '组织滴虫病', '坏死性肠炎', '禽流感'],
    correctAnswer: [0, 1, 2],
    explanation: '盲肠球虫排血便/全血；组织滴虫严重时黄中带血/全血便；坏死性肠炎排黑色间或混血粪便。禽流感排黄绿色带血下痢而非典型血便。',
    knowledgePoint: '禽球虫病',
    difficulty: 'HARD',
    tags: ['血便', '鉴别诊断']
  },
  // 安卡拉
  {
    questionText: '安卡拉病（心包积水综合征）的特征性病变是？',
    questionType: 'SINGLE_CHOICE',
    options: ['肝脂肪变性+核内包涵体', '心包大量清亮积液+心肌松软出血', '花斑肾+输尿管尿酸盐', '法氏囊萎缩+胸腺萎缩'],
    correctAnswer: 1,
    explanation: '安卡拉病特征为心包大量黄色清亮液体/胶冻样物，心肌松软出血。肝脂肪变性+核内包涵体是包涵体肝炎，花斑肾是传支，法氏囊萎缩是马立克/传染性贫血。',
    knowledgePoint: '禽腺病毒病',
    difficulty: 'MEDIUM',
    tags: ['安卡拉病', '心包积液', '鉴别诊断']
  },
  // 盐食中毒
  {
    questionText: '雏鸡食盐中毒的饮水浓度阈值是？',
    questionType: 'SINGLE_CHOICE',
    options: ['>0.3%', '>0.5%', '>0.7%', '>1%'],
    correctAnswer: 2,
    explanation: '雏鸡饮水>0.7%、产蛋鸡>1%、饲料>3%可致食盐中毒。正常添加量为0.25%~0.5%。',
    knowledgePoint: '常见中毒病',
    difficulty: 'HARD',
    tags: ['食盐中毒', '中毒病', '阈值']
  }
];

// ========== 主函数 ==========

async function seed() {
  console.log('连接MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('已连接');

  // 清空旧数据
  console.log('清空旧知识图谱和题库数据...');
  await KnowledgeGraph.deleteMany({});
  await QuestionBank.deleteMany({});

  // 写入疾病知识
  console.log(`写入 ${diseaseData.length} 个疾病知识节点...`);
  const graphs = await KnowledgeGraph.insertMany(diseaseData);
  console.log(`已写入 ${graphs.length} 个知识节点`);

  // 建立关联关系
  console.log('建立疾病关联关系...');
  const relations = [
    { name1: '新城疫', name2: '禽流感', similarity: 90 },
    { name1: '新城疫', name2: '鸡传染性支气管炎', similarity: 75 },
    { name1: '禽流感', name2: '鸡传染性支气管炎', similarity: 60 },
    { name1: '马立克氏病', name2: '禽白血病', similarity: 85 },
    { name1: '马立克氏病', name2: '网状内皮组织增殖病', similarity: 70 },
    { name1: '禽白血病', name2: '网状内皮组织增殖病', similarity: 70 },
    { name1: '传染性法氏囊病', name2: '鸡传染性支气管炎', similarity: 60 },
    { name1: '传染性法氏囊病', name2: '鸡传染性贫血', similarity: 65 },
    { name1: '鸡传染性支气管炎', name2: '营养代谢病', similarity: 55 },
    { name1: '禽球虫病', name2: '禽组织滴虫病', similarity: 80 },
    { name1: '禽巴氏杆菌病', name2: '鸭瘟', similarity: 60 },
    { name1: '禽巴氏杆菌病', name2: '鸭传染性浆膜炎', similarity: 70 },
    { name1: '禽沙门氏菌病', name2: '禽大肠杆菌病', similarity: 55 },
    { name1: '禽脑脊髓炎', name2: '营养代谢病', similarity: 60 },
    { name1: '禽腺病毒病', name2: '传染性法氏囊病', similarity: 50 },
    { name1: '禽支原体病', name2: '鸡传染性鼻炎', similarity: 70 },
    { name1: '禽支原体病', name2: '鸡传染性喉气管炎', similarity: 55 },
  ];

  for (const rel of relations) {
    const g1 = graphs.find(g => g.diseaseName === rel.name1);
    const g2 = graphs.find(g => g.diseaseName === rel.name2);
    if (g1 && g2) {
      // 双向关联
      await KnowledgeGraph.findByIdAndUpdate(g1._id, {
        $push: { relatedDiseases: { diseaseId: g2._id, similarity: rel.similarity } }
      });
      await KnowledgeGraph.findByIdAndUpdate(g2._id, {
        $push: { relatedDiseases: { diseaseId: g1._id, similarity: rel.similarity } }
      });
    }
  }
  console.log('关联关系已建立');

  // 写入题库
  console.log(`写入 ${questionData.length} 道题库题目...`);
  // 为题目关联知识图谱
  for (const q of questionData) {
    const refGraph = graphs.find(g => g.diseaseName === q.knowledgePoint || g.tags.includes(q.knowledgePoint));
    if (refGraph) {
      q.referenceGraphId = refGraph._id;
    }
  }
  const questions = await QuestionBank.insertMany(questionData);
  console.log(`已写入 ${questions.length} 道题目`);

  console.log('\n========== 种子数据注入完成 ==========');
  console.log(`知识图谱节点: ${graphs.length}`);
  console.log(`题库题目: ${questions.length}`);
  console.log(`关联关系: ${relations.length * 2} 条`);

  await mongoose.disconnect();
  console.log('已断开MongoDB连接');
}

seed().catch(err => {
  console.error('种子数据注入失败:', err);
  process.exit(1);
});
