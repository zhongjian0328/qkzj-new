

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import styles from './styles';

interface CaseData {
  id: string;
  title: string;
  diagnosis: string;
  status: 'annotated' | 'pending' | 'in-progress';
  date: string;
  image: string;
}

interface AnnotationToolProps {
  selectedCase: CaseData | null;
  onDownloadOriginal: () => void;
  onSaveAnnotation: () => void;
}

type AnnotationToolType = 'select' | 'rectangle' | 'circle' | 'line' | 'text' | 'erase';

interface AnnotationItem {
  id: string;
  label: string;
  type: AnnotationToolType;
}

const AnnotationTool: React.FC<AnnotationToolProps> = ({
  selectedCase,
  onDownloadOriginal,
  onSaveAnnotation,
}) => {
  const [activeTool, setActiveTool] = useState<AnnotationToolType>('select');
  const [annotationLabel, setAnnotationLabel] = useState('');
  const [annotationColor, setAnnotationColor] = useState('#3BCCA5');
  const [annotationThickness, setAnnotationThickness] = useState(3);

  const annotationsList: AnnotationItem[] = [
    { id: '1', label: '病灶区域', type: 'rectangle' },
    { id: '2', label: '症状描述', type: 'text' },
  ];

  const toolButtons = [
    { key: 'select' as AnnotationToolType, icon: 'mouse-pointer', label: '选择' },
    { key: 'rectangle' as AnnotationToolType, icon: 'square', label: '矩形' },
    { key: 'circle' as AnnotationToolType, icon: 'circle', label: '圆形' },
    { key: 'line' as AnnotationToolType, icon: 'minus', label: '直线' },
    { key: 'text' as AnnotationToolType, icon: 'font', label: '文字' },
    { key: 'erase' as AnnotationToolType, icon: 'eraser', label: '删除' },
  ];

  const handleToolPress = (tool: AnnotationToolType) => {
    setActiveTool(tool);
  };

  const handleDeleteAnnotation = (annotationId: string) => {
    // 实现删除标注的逻辑
    console.log('删除标注:', annotationId);
  };

  if (!selectedCase) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>请选择一个病例进行标注</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 病例信息 */}
      <View style={styles.caseInfo}>
        <View style={styles.caseInfoHeader}>
          <Image source={{ uri: selectedCase.image }} style={styles.caseImage} />
          <View style={styles.caseDetails}>
            <Text style={styles.caseTitle}>{selectedCase.title}</Text>
            <Text style={styles.caseDiagnosis}>{selectedCase.diagnosis}</Text>
          </View>
        </View>
        <View style={styles.caseActions}>
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={onDownloadOriginal}
          >
            <FontAwesome6 name="download" size={14} color="#FFFFFF" />
            <Text style={styles.downloadButtonText}>下载高清原图</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={onSaveAnnotation}
          >
            <FontAwesome6 name="floppy-disk" size={14} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>保存标注</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 标注工具栏 */}
      <View style={styles.toolbar}>
        <Text style={styles.toolbarTitle}>标注工具</Text>
        <View style={styles.toolButtons}>
          {toolButtons.map((tool) => (
            <TouchableOpacity
              key={tool.key}
              style={[
                styles.toolButton,
                activeTool === tool.key && styles.activeToolButton,
              ]}
              onPress={() => handleToolPress(tool.key)}
            >
              <FontAwesome6
                name={tool.icon}
                size={12}
                color={activeTool === tool.key ? '#FFFFFF' : '#6B7280'}
              />
              <Text
                style={[
                  styles.toolButtonText,
                  activeTool === tool.key && styles.activeToolButtonText,
                ]}
              >
                {tool.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 标注画布 */}
      <View style={styles.canvasContainer}>
        <View style={styles.canvasWrapper}>
          <Image
            source={{ uri: selectedCase.image }}
            style={styles.canvasImage}
            resizeMode="contain"
          />
          {/* 这里可以集成绘图库或自定义绘图逻辑 */}
        </View>
      </View>

      {/* 标注属性面板 */}
      <View style={styles.propertiesPanel}>
        <Text style={styles.propertiesTitle}>标注属性</Text>
        <View style={styles.propertiesContent}>
          <View style={styles.propertyItem}>
            <Text style={styles.propertyLabel}>标签</Text>
            <TextInput
              style={styles.propertyInput}
              placeholder="输入标注标签..."
              value={annotationLabel}
              onChangeText={setAnnotationLabel}
            />
          </View>
          <View style={styles.propertyRow}>
            <View style={styles.propertyItemHalf}>
              <Text style={styles.propertyLabel}>颜色</Text>
              <View
                style={[styles.colorPicker, { backgroundColor: annotationColor }]}
              />
            </View>
            <View style={styles.propertyItemHalf}>
              <Text style={styles.propertyLabel}>线条粗细</Text>
              <Slider
                style={styles.thicknessSlider}
                minimumValue={1}
                maximumValue={10}
                step={1}
                value={annotationThickness}
                onValueChange={setAnnotationThickness}
                minimumTrackTintColor="#3BCCA5"
                maximumTrackTintColor="#E5E7EB"
              />
            </View>
          </View>
        </View>
      </View>

      {/* 已标注列表 */}
      <View style={styles.annotationsList}>
        <Text style={styles.annotationsTitle}>已标注内容</Text>
        <View style={styles.annotationsContent}>
          {annotationsList.map((annotation) => (
            <View key={annotation.id} style={styles.annotationItem}>
              <View style={styles.annotationInfo}>
                <Text style={styles.annotationLabel}>{annotation.label}</Text>
                <Text style={styles.annotationType}>
                  {annotation.type === 'rectangle'
                    ? '矩形'
                    : annotation.type === 'circle'
                    ? '圆形'
                    : annotation.type === 'line'
                    ? '直线'
                    : annotation.type === 'text'
                    ? '文字'
                    : annotation.type}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteAnnotation(annotation.id)}
              >
                <FontAwesome6 name="trash" size={14} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default AnnotationTool;

