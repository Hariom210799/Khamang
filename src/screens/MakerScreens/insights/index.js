import React, {useState, useEffect, useMemo, useCallback, useRef} from 'react';
import {View, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity} from 'react-native';
import {Divider, Layout, Text, TopNavigation, Icon} from '@ui-kitten/components';
import axios from 'react-native-axios';

const InsightsScreen = ({navigation}) => {
  // ✅ Use ref for synchronous deduplication of fetchInsights
  const isLoadingInsightsRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState({
    totalOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    averageRating: 4.5,
    dailyRevenue: [],
  });

  const calculateDailyRevenue = (orders) => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayRevenue = orders
        .filter(o => o.createdAt?.split('T')[0] === dateStr && o.status === 'accepted')
        .reduce((sum, o) => sum + (o.amount || 0), 0);
      
      last7Days.push({
        date: dateStr.split('-')[2],
        revenue: dayRevenue,
      });
    }
    return last7Days;
  };

  const fetchInsights = useCallback(async () => {
    try {
      // ✅ PREVENT DUPLICATE REQUESTS: Check ref synchronously
      if (isLoadingInsightsRef.current) {
        console.log('⏳ Already loading insights, skipping duplicate request');
        return;
      }

      isLoadingInsightsRef.current = true;
      setLoading(true);
      console.log('📊 Fetching insights...');
      
      const response = await axios.get('http://10.0.2.2:3000/api/v1/orders', {
        timeout: 10000, // 10 second timeout to prevent hanging
      });
      const allOrders = response.data.data.orders || [];
      
      console.log('📊 Fetched all orders:', allOrders.length);
      
      // Calculate stats for ALL orders (for demo purposes)
      const totalOrders = allOrders.length;
      const completedOrders = allOrders.filter(o => o.status === 'accepted').length;
      const totalRevenue = allOrders
        .filter(o => o.status === 'accepted')
        .reduce((sum, o) => sum + (o.amount || 0), 0);
      const dailyRevenue = calculateDailyRevenue(allOrders);
      
      console.log('📊 Total Orders:', totalOrders);
      console.log('📊 Completed Orders:', completedOrders);
      console.log('📊 Total Revenue:', totalRevenue);
      
      setInsights({
        totalOrders,
        completedOrders,
        totalRevenue,
        averageRating: 4.5,
        dailyRevenue,
      });
      setLoading(false);
      isLoadingInsightsRef.current = false;
    } catch (error) {
      console.log('❌ Error fetching insights:', error?.message);
      setLoading(false);
      isLoadingInsightsRef.current = false;
    }
  }, []);

  useEffect(() => {
    // Don't auto-load - user must click reload button
    console.log('📊 Insights screen mounted - waiting for user to click reload');
  }, [navigation]);

  // ✅ Memoized title component
  const InsightsTitle = useMemo(() => (
    <Text category="h2" status="primary">
      Insights
    </Text>
  ), []);

  // ✅ Memoized refresh button
  const RefreshButton = useCallback(() => {
    const iconColor = loading ? '#CCC' : '#FFD700';
    return (
      <TouchableOpacity 
        onPress={fetchInsights}
        disabled={loading}
        style={styles.refreshButton}
      >
        <Icon
          name={loading ? 'loader-outline' : 'refresh-outline'}
          pack="eva"
          style={[styles.refreshIcon, {tintColor: iconColor}]}
        />
      </TouchableOpacity>
    );
  }, [loading, fetchInsights]);

  return (
    <Layout style={styles.container}>
      <TopNavigation
        title={InsightsTitle}
        accessoryRight={RefreshButton}
        alignment="start"
      />
      <Divider />
      
      {loading ? (
        <Layout style={styles.centerContent}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Loading insights...</Text>
        </Layout>
      ) : insights.totalOrders === 0 && insights.totalRevenue === 0 ? (
        <Layout style={styles.centerContent}>
          <Text style={styles.emptyText}>📊 No data loaded yet</Text>
          <Text style={styles.subText}>Tap the refresh icon above to load insights</Text>
        </Layout>
      ) : (
        <ScrollView style={styles.scrollView}>
          {/* Order Statistics */}
          <View style={styles.section}>
            <Text category="h6" style={styles.sectionTitle}>📊 Order Statistics</Text>
            
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{insights.totalOrders}</Text>
                <Text style={styles.statLabel}>Total Orders</Text>
              </View>
              
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{insights.completedOrders}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
            </View>
          </View>

          {/* Revenue Section */}
          <View style={styles.section}>
            <Text category="h6" style={styles.sectionTitle}>💰 Revenue</Text>
            
            <View style={styles.revenueCard}>
              <Text style={styles.totalRevenueLabel}>Total Revenue</Text>
              <Text style={styles.totalRevenueAmount}>₹{insights.totalRevenue.toLocaleString()}</Text>
            </View>

            {/* Daily Revenue Chart */}
            <View style={styles.chartContainer}>
              <Text style={styles.chartLabel}>Last 7 Days</Text>
              <View style={styles.dailyRevenueRow}>
                {insights.dailyRevenue.map((day, index) => {
                  const maxRevenue = Math.max(...insights.dailyRevenue.map(d => d.revenue), 1);
                  const barHeight = Math.max(20, (day.revenue / maxRevenue) * 80);
                  
                  return (
                    <View key={index} style={styles.dayBar}>
                      <View style={[styles.bar, {height: barHeight}]} />
                      <Text style={styles.dayLabel}>{day.date}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Rating Section */}
          <View style={styles.section}>
            <Text category="h6" style={styles.sectionTitle}>⭐ Rating</Text>
            
            <View style={styles.ratingCard}>
              <Text style={styles.ratingNumber}>{insights.averageRating}</Text>
              <Text style={styles.ratingLabel}>Average Rating</Text>
              <Text style={styles.ratingStars}>★★★★☆</Text>
            </View>
          </View>

          {/* Completion Rate */}
          <View style={styles.section}>
            <Text category="h6" style={styles.sectionTitle}>📈 Performance</Text>
            
            <View style={styles.performanceCard}>
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Completion Rate</Text>
                <Text style={styles.progressPercent}>
                  {insights.totalOrders > 0 ? Math.round((insights.completedOrders / insights.totalOrders) * 100) : 0}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {width: `${insights.totalOrders > 0 ? (insights.completedOrders / insights.totalOrders) * 100 : 0}%`},
                  ]}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: -6,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
    marginHorizontal: 6,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  revenueCard: {
    backgroundColor: '#FFF8DC',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalRevenueLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  totalRevenueAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  chartContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  chartLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  dailyRevenueRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
  },
  dayBar: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 24,
    backgroundColor: '#FFD700',
    borderRadius: 4,
    marginBottom: 8,
  },
  dayLabel: {
    fontSize: 10,
    color: '#999',
  },
  ratingCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#FFA500',
  },
  ratingNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFA500',
  },
  ratingLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  ratingStars: {
    fontSize: 20,
    marginTop: 8,
  },
  performanceCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 14,
    color: '#333',
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  loadingText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  refreshButton: {
    paddingRight: 15,
  },
  refreshIcon: {
    width: 24,
    height: 24,
  },
});

export default InsightsScreen;
