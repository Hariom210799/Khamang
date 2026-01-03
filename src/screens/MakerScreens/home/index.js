import React, {Component, useState, useEffect, useCallback, useRef} from 'react';
import API_CONFIG from '../../../../config/api';
import {
  Dimensions,
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {
  Divider,
  Icon,
  Layout,
  Text,
  TopNavigation,
  Toggle,
  ListItem,
  Button,
} from '@ui-kitten/components';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'react-native-axios';

const OrderIcon = (props) => {
  return <Icon {...props} name="home" pack="eva" />;
};
function SearchIcon(props) {
  return <Icon {...props} name="search-outline" pack="eva" />;
}

// ✅ Dynamic status bar padding - adapts to actual device
const getTopPadding = () => {
  if (Platform.OS === 'android') {
    return (StatusBar.currentHeight || 25) + 10;
  }
  return 15; // iOS default
};

const Home = () => {
  const SLIDER_WIDTH = Dimensions.get('window').width;
  const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);
  const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 3) / 4);
  const {width: screenWidth} = Dimensions.get('window');
  const logged_user = useSelector((state) => state.main_app.logged_user);

  // ✅ Use ref for SYNCHRONOUS deduplication (state is async!)
  const isLoadingMakerDataRef = useRef(false);
  const [shopEnabled, setShopEnabled] = useState(false); // Will be set from loadMakerData
  const [orderData, setOrderData] = useState({
    orders: [],
  });

  const [orderTimers, setOrderTimers] = useState({}); // Track countdown for each order
  const [refreshing, setRefreshing] = React.useState(false);
  
  // Load maker data to sync shop status
  const loadMakerData = useCallback(async (userId) => {
    try {
      // ✅ PREVENT DUPLICATE REQUESTS: Check ref synchronously (not state!)
      if (isLoadingMakerDataRef.current) {
        console.log('⏳ Already loading maker data, skipping duplicate request');
        return;
      }
      
      isLoadingMakerDataRef.current = true;
      console.log('🔄 loadMakerData called for user:', userId);
      if (!userId) {
        console.log('⚠️ No userId provided to loadMakerData');
        isLoadingMakerDataRef.current = false;
        return;
      }
      
      const response = await axios({
        method: 'get',
        url: API_CONFIG.GET_MAKER(userId),
        headers: {},
        timeout: 5000,
      });
      const makerData = response.data.data.maker;
      console.log('📥 Maker data received:', {
        shopOpen: makerData.shopOpen,
        onlineTimeEnabled: makerData.onlineTimeEnabled,
        onlineTimeStart: makerData.onlineTimeStart,
        onlineTimeEnd: makerData.onlineTimeEnd
      });
      
      // ✅ Check if online time is enabled and current time is within range
      let shouldBeOpen = makerData.shopOpen ?? false;
      
      if (makerData.onlineTimeEnabled && makerData.onlineTimeStart && makerData.onlineTimeEnd) {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        const startTime = String(makerData.onlineTimeStart).trim();
        const endTime = String(makerData.onlineTimeEnd).trim();
        
        console.log(`⏰ Time Check: Current=${currentTime}, Start=${startTime}, End=${endTime}`);
        
        // Convert to minutes for proper numeric comparison
        const currentMinutes = parseInt(now.getHours()) * 60 + parseInt(now.getMinutes());
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);
        const startMinutes = (startHour * 60) + startMin;
        const endMinutes = (endHour * 60) + endMin;
        
        console.log(`📊 Minutes: Current=${currentMinutes}, Start=${startMinutes}, End=${endMinutes}`);
        
        // Compare times as numeric minutes
        if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
          shouldBeOpen = true; // Within online hours
          console.log(`✅ Shop is OPEN (within scheduled hours)`);
        } else {
          shouldBeOpen = false; // Outside online hours
          console.log(`❌ Shop is CLOSED (outside scheduled hours)`);
        }
      } else {
        console.log('⚠️ Online time not enabled or missing times');
      }
      
      console.log('🎯 Setting shopEnabled to:', shouldBeOpen);
      setShopEnabled(shouldBeOpen);
      isLoadingMakerDataRef.current = false;
    } catch (error) {
      console.log('❌ Error in loadMakerData:', error?.message);
      setShopEnabled(false); // Default to false on error
      isLoadingMakerDataRef.current = false;
    }
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    if (logged_user?.id && logged_user?.role === 'maker') {
      GetOrders();
      loadMakerData(logged_user.id);
    }
    setTimeout(() => setRefreshing(false), 2000);
  }, [logged_user?.id, logged_user?.role]);

  var config = {
    method: 'get',
    url: API_CONFIG.GET_ORDERS,
    headers: {},
  };

  const GetOrders = async () => {
    try {
      const response = await axios(config);
      const orders = response.data.data.orders;
      const makerId = logged_user?.id || logged_user?._id;
      
      setOrderData({orders});
      
      // Initialize timers for pending orders (60 seconds = 1 minute)
      const newTimers = {};
      orders.forEach((order) => {
        if (order.status === 'pending' && !orderTimers[order._id]) {
          newTimers[order._id] = 60; // 60 seconds (1 minute)
        }
      });
      if (Object.keys(newTimers).length > 0) {
        setOrderTimers(prev => ({...prev, ...newTimers}));
      }
    } catch (error) {
      // Silently fail on API error
    }
  };

  const toggleShop = async () => {
    const newStatus = !shopEnabled;
    setShopEnabled(newStatus);
    
    try {
      console.log(`🏪 Toggling shop status to: ${newStatus ? 'OPEN' : 'CLOSED'}`);
      const response = await axios({
        method: 'patch',
        url: API_CONFIG.UPDATE_MAKER_STATUS(logged_user?.id),
        data: {shopOpen: newStatus},
        headers: {'Content-Type': 'application/json'},
      });
      console.log(`✅ Shop status updated:`, response.data);
      alert(`🏪 Shop is now ${newStatus ? '🟢 OPEN' : '🔴 CLOSED'}`);
    } catch (error) {
      console.log('❌ Error updating shop status:', error?.message);
      alert('Error updating shop status: ' + (error?.message || 'Unknown error'));
      // Revert state on error
      setShopEnabled(!newStatus);
    }
  };

  const renderRightActions = () => (
    <View style={{flexDirection: 'row', alignItems: 'center', paddingRight: 15, gap: 8}}>
      <Text style={{fontSize: 12, fontWeight: 'bold', color: shopEnabled ? '#4CAF50' : '#F44336'}}>
        {shopEnabled ? '🟢 Open' : '🔴 Closed'}
      </Text>
      <Toggle
        status="success"
        style={{paddingTop: 5}}
        checked={shopEnabled}
        onPress={toggleShop}
        onChange={toggleShop}
      />
    </View>
  );

  const handleAutoReject = async (orderId) => {
    try {
      console.log('⏱️ Auto-rejecting order (60 sec timeout):', orderId);
      
      // Update order status in database
      try {
        const response = await axios({
          method: 'patch',
          url: API_CONFIG.GET_ORDER(orderId),
          data: {status: 'rejected'},
          headers: {'Content-Type': 'application/json'},
        });
        console.log('✅ API updated order status to rejected');
      } catch (apiError) {
        console.log('⚠️ API error but removing from home screen anyway:', apiError?.message);
      }
      
      // Remove timer
      setOrderTimers(prev => {
        const updated = {...prev};
        delete updated[orderId];
        console.log('🗑️ Timer removed for order:', orderId);
        return updated;
      });
      
      // Remove rejected order from home screen immediately
      setOrderData(prev => {
        const filtered = prev.orders.filter(o => o._id !== orderId);
        console.log('🗑️ Removed order from home screen. Remaining:', filtered.length);
        return {
          ...prev,
          orders: filtered,
        };
      });
      
      console.log('✅ Order auto-rejected and removed from home screen');
    } catch (error) {
      console.log('❌ Error in handleAutoReject:', error?.message);
    }
  };

  // ✅ Memoized handler to prevent recreating on every render
  const handleAccept = useCallback(async (orderId) => {
    try {
      // First remove from UI immediately
      setOrderData(prev => {
        const filtered = prev.orders.filter(o => o._id !== orderId);
        return {
          ...prev,
          orders: filtered,
        };
      });
      
      // Remove timer
      setOrderTimers(prev => {
        const updated = {...prev};
        delete updated[orderId];
        return updated;
      });
      
      // Then update API in background
      axios({
        method: 'patch',
        url: `http://10.0.2.2:3000/api/v1/orders/${orderId}`,
        data: {status: 'accepted'},
        headers: {'Content-Type': 'application/json'},
      }).then(response => {
        alert('✅ Order accepted!');
      }).catch(error => {
        alert('Order accepted (saving...)');
      });
      
    } catch (error) {
      // Error handled silently
    }
  }, []);

  // ✅ Memoized handler to prevent recreating on every render
  const handleReject = useCallback(async (orderId) => {
    try {
      // First remove from UI immediately
      setOrderData(prev => {
        const filtered = prev.orders.filter(o => o._id !== orderId);
        return {
          ...prev,
          orders: filtered,
        };
      });
      
      // Remove timer
      setOrderTimers(prev => {
        const updated = {...prev};
        delete updated[orderId];
        return updated;
      });
      
      // Then update API in background
      axios({
        method: 'patch',
        url: `http://10.0.2.2:3000/api/v1/orders/${orderId}`,
        data: {status: 'rejected'},
        headers: {'Content-Type': 'application/json'},
      }).then(response => {
        alert('❌ Order rejected!');
      }).catch(error => {
        alert('Order rejected (saving...)');
      });
      
    } catch (error) {
      // Error handled silently
    }
  }, []);

  const AcceptReject = (props) => {
    const {item} = props;
    const timeRemaining = orderTimers[item._id] || 0;
    
    // Don't show buttons if order is already accepted or rejected
    if (item.status === 'accepted' || item.status === 'rejected') {
      return (
        <Layout>
          <Text category="h6" style={{color: item.status === 'accepted' ? 'green' : 'red'}}>
            {item.status === 'accepted' ? '⏳ Processing...' : ''}
          </Text>
        </Layout>
      );
    }
    
    // Show timer and buttons for pending orders
    return (
      <Layout>
        <Text style={{fontSize: 12, fontWeight: 'bold', color: timeRemaining > 20 ? 'green' : timeRemaining > 10 ? 'orange' : 'red', marginBottom: 6}}>
          ⏱️ {timeRemaining}s
        </Text>
        <Button status="success" style={{margin: 4}} size="small" onPress={() => handleAccept(item._id)}>
          Accept
        </Button>
        <Button status="danger" style={{margin: 4}} size="small" onPress={() => handleReject(item._id)}>
          Reject
        </Button>
      </Layout>
    );
  };

  // ✅ Only load orders ONCE on initial mount - don't reload when coming back
  React.useEffect(() => {
    if (logged_user?.id && logged_user?.role === 'maker') {
      console.log('📱 Initial mount - loading orders and maker data for user:', logged_user.id);
      GetOrders();
      loadMakerData(logged_user.id);
    } else {
      console.log('⚠️ Not a maker or no logged_user.id available');
    }
  }, [logged_user?.id, logged_user?.role]); // Run when logged_user changes
  
  // ✅ When returning to this screen, only reload shop status (NOT orders)
  useFocusEffect(
    useCallback(() => {
      if (logged_user?.id && logged_user?.role === 'maker') {
        console.log('🔄 Screen focused - reloading shop status for user:', logged_user.id);
        loadMakerData(logged_user.id); // Only update shop status, don't reset timers
      }
      
      return () => {
        // Cleanup
      };
    }, [logged_user?.id, logged_user?.role, loadMakerData])
  );

  // ✅ Timer countdown effect - auto-reject orders after 60 seconds
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setOrderTimers(prevTimers => {
        const updatedTimers = {...prevTimers};
        
        Object.keys(updatedTimers).forEach(orderId => {
          if (updatedTimers[orderId] > 0) {
            updatedTimers[orderId] -= 1;
            
            // Auto-reject when timer reaches 0
            if (updatedTimers[orderId] === 0) {
              console.log('🔴 Timer reached 0 - auto-rejecting order:', orderId);
              // Call handleAutoReject after state update
              setTimeout(() => handleAutoReject(orderId), 100);
            }
          }
        });
        
        return updatedTimers;
      });
    }, 1000); // Update every second

    return () => clearInterval(timerInterval);
  }, [handleAutoReject]);

  const renderItem = ({item, index}) => (
    <ListItem
      title={`${item.amount}`}
      // accessoryLeft={renderItemIcon}
      // accessoryRight={renderItemAccessory}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <TopNavigation
        style={{paddingLeft: 20, paddingTop: getTopPadding()}}
        title={(TextProps) => {
          return (
            <Text category="h2" status="primary">
              Khamang's &nbsp; Cook
            </Text>
          );
        }}
        accessoryRight={renderRightActions}
        alignment="start"
      />
      <Divider />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Layout style={{flex: 1, marginTop: 10}}>
          {orderData.orders.length > 0 ? (
            orderData.orders
              .filter(order => {
                // Get maker ID from logged-in user
                const makerId = logged_user?.id || logged_user?._id;
                
                // Extract maker ID from order (handle both object and string)
                let orderMakerId = order.makerid;
                if (typeof orderMakerId === 'object' && orderMakerId !== null) {
                  // If it's a populated object, extract the _id
                  orderMakerId = orderMakerId._id || orderMakerId.id;
                }
                
                const isMyOrder = orderMakerId === makerId;
                const isPending = order.status === 'pending';
                
                return isMyOrder && isPending;
              })
              .map((item, index) => {
                return (
                  <Layout key={index}>
                    <ListItem
                      style={{margin: 10}}
                      title={(TextProps) => (
                        <Text category="h5" style={{color: 'grey'}}>
                          {item.dishes.map(dish => `${dish.name} (qty: ${dish.qty || 1})`).join(', ')}
                        </Text>
                      )}
                      description={(TextProps) => (
                        <>
                          <Text category="h6" style={{color: 'grey'}}>
                            Rs. {item.amount}
                          </Text>
                          <Text category="h6" style={{color: 'grey'}}>
                            Address:{' '}
                            {item.del_address ? item.del_address : 'No Address'}
                          </Text>
                          <Text category="h6" style={{color: item.status === 'pending' ? 'orange' : item.status === 'accepted' ? 'green' : 'red'}}>
                            Status: {item.status || 'pending'}
                          </Text>
                        </>
                      )}
                      accessoryRight={() => <AcceptReject item={item} />}
                    />
                    <Divider />
                  </Layout>
                );
              })
          ) : (
            <Layout
              style={{
                alignSelf: 'center',
                marginTop: '50%',
              }}>
              <Text category="h5" style={{color: 'grey'}}>Waiting for Orders to Recieve...</Text>
            </Layout>
          )}
        </Layout>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
});
