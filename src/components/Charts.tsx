import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { colors, radii, spacing, typography, shadows } from '../theme';

const screenWidth = Dimensions.get('window').width;

// 折线图组件
interface LineChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
      color?: (opacity: number) => string;
      strokeWidth?: number;
    }[];
    legend?: string[];
  };
  title?: string;
  width?: number;
  height?: number;
  yAxisLabel?: string;
  yAxisSuffix?: string;
}

export const CustomLineChart: React.FC<LineChartProps> = ({
  data,
  title,
  width = screenWidth - 32,
  height = 220,
  yAxisLabel = '',
  yAxisSuffix = '',
}) => {
  return (
    <View style={styles.chartContainer}>
      {title && <Text style={styles.chartTitle}>{title}</Text>}
      <LineChart
        data={data}
        width={width}
        height={height}
        yAxisLabel={yAxisLabel}
        yAxisSuffix={yAxisSuffix}
        chartConfig={{
          backgroundColor: colors.surface,
          backgroundGradientFrom: colors.surface,
          backgroundGradientTo: colors.surface,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(45, 187, 161, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
          style: {
            borderRadius: radii.lg,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: colors.primary,
          },
        }}
        bezier
        style={{
          marginVertical: spacing.sm,
          borderRadius: radii.lg,
        }}
      />
    </View>
  );
};

// 柱状图组件
interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
      color?: (opacity: number) => string;
      strokeWidth?: number;
    }[];
    legend?: string[];
  };
  title?: string;
  width?: number;
  height?: number;
  yAxisLabel?: string;
  yAxisSuffix?: string;
}

export const CustomBarChart: React.FC<BarChartProps> = ({
  data,
  title,
  width = screenWidth - 32,
  height = 220,
  yAxisLabel = '',
  yAxisSuffix = '',
}) => {
  return (
    <View style={styles.chartContainer}>
      {title && <Text style={styles.chartTitle}>{title}</Text>}
      <BarChart
        data={data}
        width={width}
        height={height}
        yAxisLabel={yAxisLabel}
        yAxisSuffix={yAxisSuffix}
        chartConfig={{
          backgroundColor: colors.surface,
          backgroundGradientFrom: colors.surface,
          backgroundGradientTo: colors.surface,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(45, 187, 161, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
          style: {
            borderRadius: radii.lg,
          },
        }}
        style={{
          marginVertical: spacing.sm,
          borderRadius: radii.lg,
        }}
      />
    </View>
  );
};

// 饼图组件
interface PieChartProps {
  data: {
    name: string;
    population: number;
    color: string;
    legendFontColor: string;
    legendFontSize: number;
  }[];
  title?: string;
  width?: number;
  height?: number;
}

export const CustomPieChart: React.FC<PieChartProps> = ({
  data,
  title,
  width = screenWidth - 32,
  height = 220,
}) => {
  return (
    <View style={styles.chartContainer}>
      {title && <Text style={styles.chartTitle}>{title}</Text>}
      <PieChart
        data={data}
        width={width}
        height={height}
        chartConfig={{
          backgroundColor: colors.surface,
          backgroundGradientFrom: colors.surface,
          backgroundGradientTo: colors.surface,
          color: (opacity = 1) => `rgba(45, 187, 161, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
      <View style={styles.legendContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>
              {item.name}: {item.population}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// 数据卡片组件
interface DataCardProps {
  title: string;
  value: string | number;
  unit?: string;
  color?: string;
  icon?: string;
  iconName?: string;
}

export const DataCard: React.FC<DataCardProps> = ({
  title,
  value,
  unit = '',
  color = colors.primary,
  icon = '',
  iconName,
}) => {
  return (
    <View style={styles.dataCard}>
      <View style={styles.dataCardContent}>
        <Text style={styles.dataCardTitle}>{title}</Text>
        <View style={styles.dataCardValueContainer}>
          <Text style={styles.dataCardValue}>{value}</Text>
          {unit && <Text style={styles.dataCardUnit}>{unit}</Text>}
        </View>
      </View>
      {iconName ? (
        <View style={[styles.dataCardIconContainer, { backgroundColor: color + '20' }]}>
          <Ionicons name={iconName as any} size={24} color={color} />
        </View>
      ) : icon ? (
        <Text style={styles.dataCardIcon}>{icon}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  chartTitle: {
    fontSize: typography.size.bodyLarge,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  dataCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.md,
  },
  dataCardContent: {
    flex: 1,
  },
  dataCardTitle: {
    fontSize: typography.size.body,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
  },
  dataCardValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  dataCardValue: {
    fontSize: typography.size.heading,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  dataCardUnit: {
    fontSize: typography.size.body,
    color: colors.textTertiary,
    marginLeft: spacing.xs,
  },
  dataCardIcon: {
    fontSize: 32,
  },
  dataCardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legendContainer: {
    marginTop: spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: spacing.sm,
  },
  legendText: {
    fontSize: typography.size.body,
    color: colors.textTertiary,
  },
});
