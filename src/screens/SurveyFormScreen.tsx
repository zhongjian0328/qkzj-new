import { colors } from '../theme';
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { styles } from '../styles';
import { surveyApi } from '../services/api';

// ======================== 类型定义 ========================

interface SurveyFormData {
  // Step 1: 禽群基本情况
  farmName: string;
  species: string; // 鸡/鸭/鹅/其他
  breed: string;
  ageDays: string;
  stockCount: string;

  // Step 2: 发病情况
  onsetDate: string;
  sickCount: string;
  deadCount: string;
  culledCount: string;

  // Step 3: 临床症状
  symptoms: string[];
  symptomDescription: string;

  // Step 4: 病理变化
  lesions: string[];
  lesionDescription: string;

  // Step 5: 免疫情况
  vaccines: VaccineRecord[];

  // Step 6: 环境因素
  temperature: string;
  humidity: string;
  ventilation: string;
  environmentNote: string;

  // Step 7: 初步结论
  suspectedDiseases: string[];
  preliminaryDiagnosis: string;
  suggestions: string;
}

interface VaccineRecord {
  name: string;
  type: string;
  date: string;
  dosage: string;
}

interface RouteParams {
  surveyId?: string;
  mode?: 'create' | 'edit';
  initialData?: Partial<SurveyFormData>;
}

// ======================== 常量 ========================

const SPECIES_OPTIONS = ['鸡', '鸭', '鹅', '其他'];

const COMMON_SYMPTOMS = [
  '精神沉郁', '食欲减退', '呼吸困难', '腹泻',
  '神经症状', '产蛋下降', '羽毛蓬乱', '冠髯发绀',
];

const COMMON_LESIONS = [
  '腺胃出血', '肠道出血', '肺脏病变', '肝脏病变',
  '肾脏病变', '脾脏肿大', '法氏囊病变', '心包积液',
];

const VENTILATION_OPTIONS = ['自然通风', '机械通风', '密闭式', '半密闭式'];

const STEP_TITLES = [
  '禽群情况', '发病情况', '临床症状', '病理变化',
  '免疫情况', '环境因素', '初步结论',
];

// ======================== 主组件 ========================

const SurveyFormScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const routeParams = (route.params || {}) as RouteParams;

  const isEdit = routeParams.mode === 'edit';
  const surveyId = routeParams.surveyId;

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<SurveyFormData>({
    farmName: '',
    species: '',
    breed: '',
    ageDays: '',
    stockCount: '',
    onsetDate: '',
    sickCount: '',
    deadCount: '',
    culledCount: '',
    symptoms: [],
    symptomDescription: '',
    lesions: [],
    lesionDescription: '',
    vaccines: [],
    temperature: '',
    humidity: '',
    ventilation: '',
    environmentNote: '',
    suspectedDiseases: [],
    preliminaryDiagnosis: '',
    suggestions: '',
    ...routeParams.initialData,
  });

  const updateField = <K extends keyof SurveyFormData>(field: K, value: SurveyFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // ======================== 计算逻辑 ========================

  const stockNum = parseInt(formData.stockCount) || 0;
  const sickNum = parseInt(formData.sickCount) || 0;
  const deadNum = parseInt(formData.deadCount) || 0;
  const morbidityRate = stockNum > 0 ? ((sickNum / stockNum) * 100).toFixed(2) : '0.00';
  const mortalityRate = stockNum > 0 ? ((deadNum / stockNum) * 100).toFixed(2) : '0.00';

  // ======================== 步骤切换 ========================

  const goNext = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < 7) setCurrentStep(currentStep + 1);
  };

  const goPrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.farmName.trim()) {
          setError('请填写养殖场名称');
          return false;
        }
        if (!formData.stockCount || parseInt(formData.stockCount) <= 0) {
          setError('请填写有效的存栏数');
          return false;
        }
        break;
      default:
        break;
    }
    setError(null);
    return true;
  };

  // ======================== 症状/病变选择 ========================

  const toggleItem = (list: string[], item: string) => {
    const newList = list.includes(item)
      ? list.filter(i => i !== item)
      : [...list, item];
    return newList;
  };

  // ======================== 疫苗记录 ========================

  const addVaccine = () => {
    updateField('vaccines', [
      ...formData.vaccines,
      { name: '', type: '', date: '', dosage: '' },
    ]);
  };

  const updateVaccine = (index: number, field: keyof VaccineRecord, value: string) => {
    const vaccines = [...formData.vaccines];
    vaccines[index] = { ...vaccines[index], [field]: value };
    updateField('vaccines', vaccines);
  };

  const removeVaccine = (index: number) => {
    updateField('vaccines', formData.vaccines.filter((_, i) => i !== index));
  };

  // ======================== 提交逻辑 ========================

  const handleSubmit = async (asDraft: boolean) => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        stockCount: parseInt(formData.stockCount) || 0,
        sickCount: parseInt(formData.sickCount) || 0,
        deadCount: parseInt(formData.deadCount) || 0,
        culledCount: parseInt(formData.culledCount) || 0,
        ageDays: parseInt(formData.ageDays) || 0,
        isDraft: asDraft,
      };

      if (asDraft) {
        await surveyApi.saveDraft(payload);
        Alert.alert('成功', '草稿保存成功');
      } else {
        if (isEdit && surveyId) {
          await surveyApi.updateSurvey(surveyId, payload);
          Alert.alert('成功', '流调记录更新成功');
        } else {
          await surveyApi.createSurvey(payload);
          Alert.alert('成功', '流调记录提交成功');
        }
      }

      navigation.goBack();
    } catch (err: any) {
      setError(err?.message || (asDraft ? '保存草稿失败' : '提交失败'));
    } finally {
      setLoading(false);
    }
  };

  // ======================== 渲染步骤指示器 ========================

  const renderStepIndicator = () => (
    <View style={local.stepIndicatorContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={local.stepIndicatorScroll}>
        {STEP_TITLES.map((title, idx) => {
          const step = idx + 1;
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;

          return (
            <View key={step} style={local.stepItemWrapper}>
              <TouchableOpacity
                style={[
                  local.stepCircle,
                  isActive && local.stepCircleActive,
                  isCompleted && local.stepCircleCompleted,
                ]}
                onPress={() => {
                  if (step < currentStep || validateStep(step)) {
                    setCurrentStep(step);
                  }
                }}
                disabled={step > currentStep}
              >
                <Text style={[
                  local.stepCircleText,
                  (isActive || isCompleted) && local.stepCircleTextActive,
                ]}>
                  {isCompleted ? '✓' : step}
                </Text>
              </TouchableOpacity>
              <Text style={[
                local.stepLabel,
                isActive && local.stepLabelActive,
              ]} numberOfLines={1}>
                {title}
              </Text>
              {step < 7 && <View style={local.stepLine} />}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );

  // ======================== 渲染各步骤 ========================

  const renderStep1 = () => (
    <Card style={local.stepCard} shadow="small">
      <Text style={local.stepTitle}>禽群基本情况</Text>

      <Input
        label="养殖场名称"
        placeholder="请输入养殖场名称"
        value={formData.farmName}
        onChangeText={v => updateField('farmName', v)}
        variant="outline"
      />

      <View style={local.fieldGroup}>
        <Text style={local.fieldLabel}>禽种</Text>
        <View style={local.optionsRow}>
          {SPECIES_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt}
              style={[
                local.optionPill,
                formData.species === opt && local.optionPillActive,
              ]}
              onPress={() => updateField('species', opt)}
            >
              <Text style={[
                local.optionPillText,
                formData.species === opt && local.optionPillTextActive,
              ]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Input
        label="品种"
        placeholder="如：海兰褐、白羽肉鸡"
        value={formData.breed}
        onChangeText={v => updateField('breed', v)}
        variant="outline"
      />

      <View style={local.row}>
        <View style={local.half}>
          <Input
            label="日龄（天）"
            placeholder="如：35"
            value={formData.ageDays}
            onChangeText={v => updateField('ageDays', v)}
            variant="outline"
            keyboardType="numeric"
          />
        </View>
        <View style={local.half}>
          <Input
            label="存栏数"
            placeholder="必填"
            value={formData.stockCount}
            onChangeText={v => updateField('stockCount', v)}
            variant="outline"
            keyboardType="numeric"
          />
        </View>
      </View>
    </Card>
  );

  const renderStep2 = () => (
    <Card style={local.stepCard} shadow="small">
      <Text style={local.stepTitle}>发病情况</Text>

      <Input
        label="首发日期"
        placeholder="YYYY-MM-DD"
        value={formData.onsetDate}
        onChangeText={v => updateField('onsetDate', v)}
        variant="outline"
      />

      <View style={local.row}>
        <View style={local.third}>
          <Input
            label="发病数"
            placeholder="如：50"
            value={formData.sickCount}
            onChangeText={v => updateField('sickCount', v)}
            variant="outline"
            keyboardType="numeric"
          />
        </View>
        <View style={local.third}>
          <Input
            label="死亡数"
            placeholder="如：10"
            value={formData.deadCount}
            onChangeText={v => updateField('deadCount', v)}
            variant="outline"
            keyboardType="numeric"
          />
        </View>
        <View style={local.third}>
          <Input
            label="扑杀数"
            placeholder="如：0"
            value={formData.culledCount}
            onChangeText={v => updateField('culledCount', v)}
            variant="outline"
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* 自动计算 */}
      <View style={local.calcBox}>
        <Text style={local.calcTitle}>自动计算</Text>
        <View style={local.calcRow}>
          <View style={local.calcItem}>
            <Text style={local.calcLabel}>发病率</Text>
            <Text style={local.calcValue}>{morbidityRate}%</Text>
          </View>
          <View style={local.calcDivider} />
          <View style={local.calcItem}>
            <Text style={local.calcLabel}>死亡率</Text>
            <Text style={[local.calcValue, local.calcValueDanger]}>{mortalityRate}%</Text>
          </View>
        </View>
        <Text style={local.calcHint}>
          发病率 = 发病数 / 存栏数 × 100%；死亡率 = 死亡数 / 存栏数 × 100%
        </Text>
      </View>
    </Card>
  );

  const renderStep3 = () => (
    <Card style={local.stepCard} shadow="small">
      <Text style={local.stepTitle}>临床症状</Text>
      <Text style={local.subtleText}>选择观察到的症状（可多选）</Text>

      <View style={local.chipGrid}>
        {COMMON_SYMPTOMS.map(symptom => {
          const selected = formData.symptoms.includes(symptom);
          return (
            <TouchableOpacity
              key={symptom}
              style={[local.chip, selected && local.chipActive]}
              onPress={() => updateField('symptoms', toggleItem(formData.symptoms, symptom))}
            >
              <Text style={[local.chipText, selected && local.chipTextActive]}>
                {symptom}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={[local.fieldLabel, local.fieldLabelTop]}>补充描述</Text>
      <TextInput
        style={local.textArea}
        placeholder="描述其他观察到的症状..."
        value={formData.symptomDescription}
        onChangeText={v => updateField('symptomDescription', v)}
        multiline
        textAlignVertical="top"
      />
    </Card>
  );

  const renderStep4 = () => (
    <Card style={local.stepCard} shadow="small">
      <Text style={local.stepTitle}>病理变化</Text>
      <Text style={local.subtleText}>选择剖检观察到的病变（可多选）</Text>

      <View style={local.chipGrid}>
        {COMMON_LESIONS.map(lesion => {
          const selected = formData.lesions.includes(lesion);
          return (
            <TouchableOpacity
              key={lesion}
              style={[local.chip, selected && local.chipActive]}
              onPress={() => updateField('lesions', toggleItem(formData.lesions, lesion))}
            >
              <Text style={[local.chipText, selected && local.chipTextActive]}>
                {lesion}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={[local.fieldLabel, local.fieldLabelTop]}>病变描述</Text>
      <TextInput
        style={local.textArea}
        placeholder="详细描述剖检所见病变..."
        value={formData.lesionDescription}
        onChangeText={v => updateField('lesionDescription', v)}
        multiline
        textAlignVertical="top"
      />
    </Card>
  );

  const renderStep5 = () => (
    <Card style={local.stepCard} shadow="small">
      <Text style={local.stepTitle}>免疫情况</Text>
      <Text style={local.subtleText}>记录该禽群已接种的疫苗</Text>

      {formData.vaccines.length === 0 && (
        <View style={local.emptyNote}>
          <Text style={local.emptyNoteText}>暂无疫苗记录，点击下方按钮添加</Text>
        </View>
      )}

      {formData.vaccines.map((vaccine, idx) => (
        <View key={idx} style={local.vaccineItem}>
          <View style={local.vaccineHeader}>
            <Text style={local.vaccineItemTitle}>疫苗 {idx + 1}</Text>
            <TouchableOpacity onPress={() => removeVaccine(idx)}>
              <Text style={local.removeText}>删除</Text>
            </TouchableOpacity>
          </View>
          <View style={local.row}>
            <View style={local.half}>
              <Input
                label="疫苗名称"
                placeholder="如：新城疫灭活苗"
                value={vaccine.name}
                onChangeText={v => updateVaccine(idx, 'name', v)}
                variant="outline"
                containerStyle={local.compactInput}
              />
            </View>
            <View style={local.half}>
              <Input
                label="疫苗类型"
                placeholder="如：灭活苗/活苗"
                value={vaccine.type}
                onChangeText={v => updateVaccine(idx, 'type', v)}
                variant="outline"
                containerStyle={local.compactInput}
              />
            </View>
          </View>
          <View style={local.row}>
            <View style={local.half}>
              <Input
                label="接种日期"
                placeholder="YYYY-MM-DD"
                value={vaccine.date}
                onChangeText={v => updateVaccine(idx, 'date', v)}
                variant="outline"
                containerStyle={local.compactInput}
              />
            </View>
            <View style={local.half}>
              <Input
                label="剂量"
                placeholder="如：1ml/羽"
                value={vaccine.dosage}
                onChangeText={v => updateVaccine(idx, 'dosage', v)}
                variant="outline"
                containerStyle={local.compactInput}
              />
            </View>
          </View>
        </View>
      ))}

      <Button
        title="+ 添加疫苗"
        variant="outline"
        fullWidth
        onPress={addVaccine}
        style={local.addVaccineBtn}
      />
    </Card>
  );

  const renderStep6 = () => (
    <Card style={local.stepCard} shadow="small">
      <Text style={local.stepTitle}>环境因素</Text>

      <View style={local.row}>
        <View style={local.half}>
          <Input
            label="环境温度 (°C)"
            placeholder="如：25"
            value={formData.temperature}
            onChangeText={v => updateField('temperature', v)}
            variant="outline"
            keyboardType="numeric"
          />
        </View>
        <View style={local.half}>
          <Input
            label="环境湿度 (%)"
            placeholder="如：65"
            value={formData.humidity}
            onChangeText={v => updateField('humidity', v)}
            variant="outline"
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={local.fieldGroup}>
        <Text style={local.fieldLabel}>通风方式</Text>
        <View style={local.optionsRow}>
          {VENTILATION_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt}
              style={[
                local.optionPill,
                formData.ventilation === opt && local.optionPillActive,
              ]}
              onPress={() => updateField('ventilation', opt)}
            >
              <Text style={[
                local.optionPillText,
                formData.ventilation === opt && local.optionPillTextActive,
              ]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Text style={[local.fieldLabel, local.fieldLabelTop]}>环境备注</Text>
      <TextInput
        style={local.textArea}
        placeholder="其他环境因素说明..."
        value={formData.environmentNote}
        onChangeText={v => updateField('environmentNote', v)}
        multiline
        textAlignVertical="top"
      />
    </Card>
  );

  const renderStep7 = () => (
    <Card style={local.stepCard} shadow="small">
      <Text style={local.stepTitle}>初步结论</Text>

      <Text style={local.fieldLabel}>疑似疾病（可多选）</Text>
      <View style={local.chipGrid}>
        {['禽流感', '新城疫', '传染性支气管炎', '传染性法氏囊病', '马立克氏病', '鸭瘟', '小鹅瘟', '其他'].map(disease => {
          const selected = formData.suspectedDiseases.includes(disease);
          return (
            <TouchableOpacity
              key={disease}
              style={[local.chip, selected && local.chipActive]}
              onPress={() => updateField('suspectedDiseases', toggleItem(formData.suspectedDiseases, disease))}
            >
              <Text style={[local.chipText, selected && local.chipTextActive]}>
                {disease}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={[local.fieldLabel, local.fieldLabelTop]}>初步诊断</Text>
      <TextInput
        style={local.textArea}
        placeholder="根据以上信息给出初步诊断..."
        value={formData.preliminaryDiagnosis}
        onChangeText={v => updateField('preliminaryDiagnosis', v)}
        multiline
        textAlignVertical="top"
      />

      <Text style={[local.fieldLabel, local.fieldLabelTop]}>建议措施</Text>
      <TextInput
        style={local.textArea}
        placeholder="防控建议、用药建议等..."
        value={formData.suggestions}
        onChangeText={v => updateField('suggestions', v)}
        multiline
        textAlignVertical="top"
      />
    </Card>
  );

  // ======================== 渲染 ========================

  const renderStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      case 7: return renderStep7();
      default: return null;
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={isEdit ? '编辑流调记录' : '新建流调记录'}
        showBackButton
        onBack={() => navigation.goBack()}
      />

      {renderStepIndicator()}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={local.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {error && (
            <View style={local.errorBox}>
              <Text style={local.errorText}>{error}</Text>
            </View>
          )}

          {renderStep()}

          {/* 底部按钮 */}
          <View style={local.bottomButtons}>
            <Button
              title="保存草稿"
              variant="outline"
              onPress={() => handleSubmit(true)}
              loading={loading}
              style={local.draftButton}
            />
            <Button
              title={isEdit && surveyId ? '更新提交' : '提交正式'}
              variant="primary"
              onPress={() => handleSubmit(false)}
              loading={loading}
              style={local.submitButton}
            />
          </View>

          {/* 上/下一步按钮 */}
          <View style={local.navButtons}>
            {currentStep > 1 && (
              <Button
                title="上一步"
                variant="text"
                onPress={goPrev}
                style={local.navBtn}
              />
            )}
            {currentStep < 7 && (
              <Button
                title="下一步"
                variant="primary"
                onPress={goNext}
                style={local.navBtn}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

// ======================== 局部样式 ========================

const local = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },

  // 步骤指示器
  stepIndicatorContainer: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  stepIndicatorScroll: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  stepItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: colors.primary,
  },
  stepCircleCompleted: {
    backgroundColor: colors.primaryDark,
  },
  stepCircleText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textDisabled,
  },
  stepCircleTextActive: {
    color: colors.surface,
  },
  stepLabel: {
    fontSize: 11,
    color: colors.textDisabled,
    marginLeft: 4,
    marginRight: 8,
  },
  stepLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  stepLine: {
    width: 20,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },

  // 步骤卡片
  stepCard: {
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryDark,
    marginBottom: 12,
  },
  subtleText: {
    fontSize: 13,
    color: colors.textTertiary,
    marginBottom: 12,
  },

  // 字段
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  fieldLabelTop: {
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
  },
  third: {
    flex: 1,
  },

  // 选项胶囊
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  optionPill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceSoft,
  },
  optionPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionPillText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  optionPillTextActive: {
    color: colors.surface,
    fontWeight: '600',
  },

  // 多选标签
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.surface,
    fontWeight: '500',
  },

  // 文本区域
  textArea: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: colors.textPrimary,
    minHeight: 80,
    marginBottom: 16,
  },

  // 计算框
  calcBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  calcTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primaryDark,
    marginBottom: 12,
  },
  calcRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  calcItem: {
    alignItems: 'center',
  },
  calcLabel: {
    fontSize: 13,
    color: colors.textTertiary,
    marginBottom: 4,
  },
  calcValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  calcValueDanger: {
    color: colors.error,
  },
  calcDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.primaryLight,
  },
  calcHint: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 12,
    textAlign: 'center',
  },

  // 疫苗
  emptyNote: {
    padding: 16,
    backgroundColor: colors.surfaceSoft,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  emptyNoteText: {
    fontSize: 14,
    color: colors.textDisabled,
  },
  vaccineItem: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  vaccineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  vaccineItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  removeText: {
    fontSize: 14,
    color: colors.error,
    fontWeight: '500',
  },
  compactInput: {
    marginBottom: 8,
  },
  addVaccineBtn: {
    marginTop: 8,
    borderColor: colors.primary,
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },

  // 错误
  errorBox: {
    backgroundColor: colors.errorLight,
    borderWidth: 1,
    borderColor: colors.errorLight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    textAlign: 'center',
  },

  // 底部按钮
  bottomButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  draftButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1,
  },

  // 导航按钮
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 16,
  },
  navBtn: {
    flex: 1,
  },
});

export default SurveyFormScreen;
