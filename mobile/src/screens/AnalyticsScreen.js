import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Dimensions,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VictoryPie, VictoryBar, VictoryChart, VictoryTheme, VictoryAxis } from 'victory-native';
import { colors, typography, layout } from '../constants/theme.js';
import { useAnalytics } from '../hooks/useAnalytics.js';
import EmptyState from '../components/EmptyState.js';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const { distribution, trends, loading, refresh } = useAnalytics();

  const pieData = distribution.map(item => ({
    x: item.name,
    y: Number(item.amount),
    fill: item.color
  }));

  const barData = trends.map(item => ({
    x: item.month,
    y: Number(item.amount)
  }));

  const getInsights = () => {
    const insights = [];

    // 1. Top Category Insight
    if (distribution.length > 0) {
      const top = [...distribution].sort((a, b) => b.amount - a.amount)[0];
      insights.push({
        text: `Your spending in <bold>${top.name}</bold> is currently your highest at <bold>₹${Number(top.amount).toLocaleString('en-IN')}</bold>.`,
        color: top.color || colors.accent.secondary
      });
    }

    // 2. Trend Insight
    if (trends.length >= 2) {
      const current = trends[trends.length - 1].amount;
      const previous = trends[trends.length - 2].amount;
      const diff = current - previous;
      const percent = previous > 0 ? (Math.abs(diff) / previous) * 100 : 0;

      if (diff > 0) {
        insights.push({
          text: `Your spending has increased by <bold>${percent.toFixed(1)}%</bold> compared to last month.`,
          color: colors.status.error
        });
      } else {
        insights.push({
          text: `Great job! You've spent <bold>₹${Math.abs(diff).toLocaleString('en-IN')}</bold> less than last month.`,
          color: colors.status.success
        });
      }
    }

    // 3. Data Volume Insight
    if (distribution.length > 5) {
      insights.push({
        text: "You have a diverse spending pattern across many categories. Consider consolidating small expenses.",
        color: colors.brand.primary
      });
    }

    return insights;
  };

  const dynamicInsights = getInsights();

  const renderInsightText = (text, highlightColor) => {
    const parts = text.split(/<bold>|<\/bold>/);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <Text key={index} style={{ color: highlightColor, fontWeight: 'bold' }}>{part}</Text>;
      }
      return part;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.accent.primary} />
        }
      >
        {/* Category Distribution Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Spending by Category</Text>
          <View style={styles.pieContainer}>
            {pieData.length > 0 ? (
              <>
                <VictoryPie
                  data={pieData}
                  width={width - 40}
                  height={250}
                  innerRadius={70}
                  padAngle={2}
                  colorScale={pieData.map(d => d.fill)}
                  style={{
                    labels: { display: 'none' }
                  }}
                />
                <View style={styles.legendContainer}>
                  {distribution.map((item, index) => (
                    <View key={index} style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                      <Text style={styles.legendText}>{item.name}</Text>
                      <Text style={styles.legendValue}>₹{Number(item.amount).toLocaleString('en-IN')}</Text>
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <EmptyState
                icon="bar-chart-outline"
                title="No Data"
                message="Start adding expenses to see your spending distribution."
              />
            )}
          </View>
        </View>

        {/* Monthly Trend Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Monthly Trends</Text>
          <View style={styles.barContainer}>
            {barData.length > 0 ? (
              <VictoryChart
                theme={VictoryTheme.grayscale}
                domainPadding={20}
                width={width - 40}
              >
                <VictoryAxis
                  style={{
                    axis: { stroke: 'rgba(255,255,255,0.1)' },
                    tickLabels: { fill: colors.text.muted, fontSize: 10 }
                  }}
                />
                <VictoryAxis
                  dependentAxis
                  style={{
                    axis: { stroke: 'transparent' },
                    grid: { stroke: 'rgba(255,255,255,0.05)' },
                    tickLabels: { fill: colors.text.muted, fontSize: 10 }
                  }}
                  tickFormat={(x) => `₹${x/1000}k`}
                />
                <VictoryBar
                  data={barData}
                  style={{
                    data: { 
                      fill: colors.accent.primary,
                      width: 20,
                      borderRadius: 4
                    }
                  }}
                  animate={{
                    duration: 1000,
                    onLoad: { duration: 500 }
                  }}
                />
              </VictoryChart>
            ) : (
              <EmptyState
                icon="trending-up-outline"
                title="Trend Data"
                message="Data will appear once you have expenses across multiple months."
              />
            )}
          </View>
        </View>

        {/* Insight Cards */}
        {dynamicInsights.length > 0 && (
          <View style={styles.insightSection}>
            <Text style={styles.chartTitle}>Key Insights</Text>
            {dynamicInsights.map((insight, index) => (
              <View key={index} style={styles.insightBox}>
                <Text style={styles.insightText}>
                  {renderInsightText(insight.text, insight.color)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  header: {
    padding: layout.spacing.lg,
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
  },
  scrollContent: {
    padding: layout.spacing.lg,
    paddingBottom: 40,
  },
  chartCard: {
    backgroundColor: colors.bg.secondary,
    borderRadius: layout.borderRadius.xl,
    padding: layout.spacing.lg,
    marginBottom: layout.spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  chartTitle: {
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pieContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  barContainer: {
    marginLeft: -10,
  },
  legendContainer: {
    width: '100%',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  legendText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  legendValue: {
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
    fontWeight: '600',
  },
  noData: {
    color: colors.text.muted,
    fontSize: typography.sizes.sm,
    paddingVertical: 40,
  },
  insightSection: {
    marginTop: 10,
  },
  insightBox: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  insightText: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
    lineHeight: 20,
  }
});
