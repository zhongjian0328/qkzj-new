import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

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
  yAxisSuffix = ''
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
          backgroundColor: '#FFFFFF',
          backgroundGradientFrom: '#FFFFFF',
          backgroundGradientTo: '#FFFFFF',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(45, 187, 161, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#2DBBA1',
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
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
  yAxisSuffix = ''
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
          backgroundColor: '#FFFFFF',
          backgroundGradientFrom: '#FFFFFF',
          backgroundGradientTo: '#FFFFFF',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(45, 187, 161, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
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
  height = 220
}) => {
  return (
    <View style={styles.chartContainer}>
      {title && <Text style={styles.chartTitle}>{title}</Text>}
      <PieChart
        data={data}
        width={width}
        height={height}
        chartConfig={{
          backgroundColor: '#FFFFFF',
          backgroundGradientFrom: '#FFFFFF',
          backgroundGradientTo: '#FFFFFF',
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
            <Text style={styles.legendText}>{item.name}: {item.population}</Text>
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
}

export const DataCard: React.FC<DataCardProps> = ({ 
  title, 
  value, 
  unit = '',
  color = '#2DBBA1',
  icon = ''
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
      {icon && <Text style={styles.dataCardIcon}>{icon}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3.84,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  dataCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3.84,
    elevation: 2,
  },
  dataCardContent: {
    flex: 1,
  },
  dataCardTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  dataCardValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  dataCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  dataCardUnit: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  dataCardIcon: {
    fontSize: 32,
  },
  legendContainer: {
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#6B7280',
  },
});
