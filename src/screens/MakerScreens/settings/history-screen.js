import React, {Component} from 'react';
import {Dimensions, View, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {
  Divider,
  Icon,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  Card,
} from '@ui-kitten/components';
import axios from 'react-native-axios';
import {useSelector} from 'react-redux';

const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);
const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 3) / 4);
const {width: screenWidth} = Dimensions.get('window');

const HistoryScreenContent = () => {
  const logged_user = useSelector((state) => state.main_app.logged_user);
  const [acceptedOrders, setAcceptedOrders] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [isInitialized, setIsInitialized] = React.useState(false);

  const fetchAcceptedOrders = React.useCallback(async () => {
    try {
      const response = await axios({
        method: 'get',
        url: 'http://10.0.2.2:3000/api/v1/orders/',
        headers: {},
      });

      const orders = response.data.data.orders || [];
      const makerId = logged_user?.id || logged_user?._id;

      // Filter for ONLY accepted orders from this maker
      const accepted = orders.filter(order => {
        let orderMakerId = order.makerid;
        if (typeof orderMakerId === 'object' && orderMakerId !== null) {
          orderMakerId = orderMakerId._id || orderMakerId.id;
        }
        return orderMakerId === makerId && order.status === 'accepted';
      });

      setAcceptedOrders(accepted);
    } catch (error) {
      // Silently fail
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [logged_user?.id, logged_user?._id]);

  // Load orders ONLY ONCE on initial mount
  React.useEffect(() => {
    if (!isInitialized && logged_user?.id) {
      setLoading(true);
      fetchAcceptedOrders();
      setIsInitialized(true);
    }
  }, [isInitialized, logged_user?.id, fetchAcceptedOrders]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchAcceptedOrders();
  }, [fetchAcceptedOrders]);

  return (
    <Layout style={styles.container}>
      <TopNavigation
        title={(TextProps) => {
          return (
            <Text category="h2" status="primary">
              Order History
            </Text>
          );
        }}
        alignment="start"
      />
      <Divider />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{flex: 1}}>
        {acceptedOrders.length > 0 ? (
          <View style={styles.gridContainer}>
            {acceptedOrders.map((order) => (
              <Card key={order._id} style={styles.orderCard}>
                <View style={styles.cardContent}>
                  <Text category="h6" style={{marginBottom: 8}}>
                    {order.dishes?.map(dish => `${dish.name} (${dish.qty || 1})`).join(', ') || 'Order'}
                  </Text>
                  <Text category="s2" style={{color: 'gray', marginBottom: 8}}>
                    Status: <Text style={{color: 'green', fontWeight: 'bold'}}>
                      ACCEPTED
                    </Text>
                  </Text>
                  <Text category="s2" style={{color: 'gray', marginBottom: 8}}>
                    Amount: Rs. {order.amount}
                  </Text>
                  <Text category="s2" style={{color: 'gray'}}>
                    Address: {order.del_address || 'N/A'}
                  </Text>
                </View>
              </Card>
            ))}
          </View>
        ) : (
          <Layout
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '50%',
            }}>
            <Text category="h5">No accepted orders yet</Text>
          </Layout>
        )}
      </ScrollView>
    </Layout>
  );
};

class HistoryScreen extends Component {
  render() {
    return <HistoryScreenContent />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 10,
  },
  orderCard: {
    width: '48%',
    marginBottom: 10,
  },
  cardContent: {
    padding: 10,
  },
});

export default HistoryScreen;
