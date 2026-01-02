import React, {useEffect, useState, useCallback} from 'react';
import axios from 'react-native-axios';
import {useSelector} from 'react-redux';
import {
  Dimensions,
  View,
  Alert,
  ScrollView,
} from 'react-native';
import {
  Card,
  List,
  StyleService,
  Text,
  useStyleSheet,
  Button,
} from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/Feather';
import { Linking } from 'react-native';

interface Dish {
  name: string;
  cuisine_type?: string;
  price?: number;
}

interface ProductItem {
  _id: string;
  dishes?: Dish[];
  userid?: string;
  prepared?: boolean;
  status?: string; // ✅ Added status field
  amount?: number;
  // Add other order properties as needed
}

interface ProductListScreenProps {
  navigation?: any;
  route?: any;
}


interface ProductItemCardProps {
  item: ProductItem;
  getDishInfo: (dish: Dish) => Promise<any>;
  handleEdit: (item: ProductItem) => void;
  handleDelete: (item: ProductItem) => void;
  styles: any;
}

function ProductItemCard({item, getDishInfo, handleEdit, handleDelete, styles}: ProductItemCardProps) {
  
  // ✅ Status color coding
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'accepted':
        return '#4CAF50'; // Green
      case 'rejected':
        return '#F44336'; // Red
      case 'pending':
        return '#FF9800'; // Orange
      default:
        return '#999';
    }
  };

  return (
    <Card style={styles.productItem}>
      {/* Order Header with Status and Amount */}
      <View style={styles.orderHeader}>
        <View>
          <Text style={{fontSize: 12, color: getStatusColor(item.status), fontWeight: 'bold'}}>
            Status: {item.status ? item.status.toUpperCase() : 'PENDING'}
          </Text>
          {item.amount && (
            <Text style={{fontSize: 13, color: '#333', marginTop: 4, fontWeight: '600'}}>
              Amount: Rs. {item.amount}
            </Text>
          )}
        </View>
      </View>

      {/* All Dishes in Order */}
      <View style={styles.dishesContainer}>
        <Text style={styles.dishesLabel}>Order Details:</Text>
        {item.dishes && item.dishes.length > 0 ? (
          item.dishes.map((dish, index) => (
            <View key={index} style={styles.dishItem}>
              <Text style={styles.dishName}>
                • {dish.name || 'Dish'} (Qty: 1)
              </Text>
              {dish.cuisine_type && (
                <Text style={styles.dishCuisine}>{dish.cuisine_type}</Text>
              )}
              {dish.price && (
                <Text style={styles.dishPrice}>Rs. {dish.price}</Text>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.noDishes}>No dishes in order</Text>
        )}
      </View>
    </Card>
  );
}

const ProductListScreen = (props: ProductListScreenProps) => {
  const styles = useStyleSheet(themedStyles);
  const loggedUser = useSelector((state: any) => state.main_app.logged_user);
  const [orders, setOrders] = useState<ProductItem[]>([]);
  const isMountedRef = React.useRef(true);
  
  useEffect(() => {
    let isMounted = true;
    isMountedRef.current = true;
    
    async function fetchOrders() {
      try {
        const res = await axios.get('http://10.0.2.2:3000/api/v1/orders');
        
        if (!isMounted) return; // Don't set state if unmounted
        
        const userOrders = res.data.data.orders.filter((order: any) => {
          const userId = loggedUser?.id || loggedUser?._id;
          return order.userid === userId || order.userid === loggedUser?.id || order.userid === loggedUser?._id;
        });
        setOrders(userOrders);
        console.log('📋 Fetched orders for user:', userOrders.length);
      } catch (err) {
        if (isMounted) {
          console.error('Failed to fetch orders:', err?.message);
        }
      }
    }
    
    if (loggedUser?.id || loggedUser?._id) {
      fetchOrders();
    }
    
    return () => {
      isMounted = false;
      isMountedRef.current = false;
    };
  }, [loggedUser]);

  // ✅ Remove auto-refresh to prevent repeated logging - user can manually pull to refresh

  // Cache for images to avoid refetching
  const [imageCache, setImageCache] = useState<{[key: string]: any}>({});

  const fetchUnsplashImage = useCallback(async (query: string) => {
    try {
      const res = await axios.get('http://10.0.2.2:3000/api/v1/images/search', { params: { query } });
      return res.data;
    } catch (err) {
      return null;
    }
  }, []);

  const getDishInfo = useCallback(async (dish: Dish) => {
    const title = dish.name || 'Dish';
    const category = dish.cuisine_type || '';
    const price = dish.price || 0;
    
    if (imageCache[title]) {
      return { title, category, price, ...imageCache[title] };
    }
    
    // Don't fetch images for now - prevents excessive API calls
    // const unsplashData = await fetchUnsplashImage(title);
    // if (unsplashData) {
    //   setImageCache(prev => ({ ...prev, [title]: unsplashData }));
    //   return { title, category, price, ...unsplashData };
    // }
    return { title, category, price };
  }, [imageCache]);

  function handleEdit(item: ProductItem) {
    // TODO: Implement navigation to edit screen or modal
    console.log('Edit pressed for', item.dishes && item.dishes[0] && item.dishes[0].name);
  }

  return (
    <List
      contentContainerStyle={styles.productList}
      data={orders}
      numColumns={2}
      renderItem={({item}) => (
        <ProductItemCard
          item={item}
          getDishInfo={getDishInfo}
          handleEdit={handleEdit}
          styles={styles}
        />
      )}
    />
  );
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    backgroundColor: 'background-basic-color-2',
  },
  productList: {
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  productItem: {
    flex: 1,
    margin: 8,
    maxWidth: Dimensions.get('window').width / 2 - 24,
    backgroundColor: 'background-basic-color-1',
    padding: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dishesContainer: {
    marginTop: 8,
  },
  dishesLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  dishItem: {
    marginBottom: 10,
    paddingLeft: 8,
  },
  dishName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#222',
    lineHeight: 16,
  },
  dishCuisine: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
    fontStyle: 'italic',
  },
  dishPrice: {
    fontSize: 11,
    color: '#FF9800',
    fontWeight: '600',
    marginTop: 2,
  },
  noDishes: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  iconButton: {
    paddingHorizontal: 0,
  },
});

export default ProductListScreen;
