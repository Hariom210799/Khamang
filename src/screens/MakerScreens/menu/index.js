import React, {useState, useEffect, useCallback, useRef} from 'react';
import {View, StyleSheet, Dimensions, FlatList, Alert, SafeAreaView, StatusBar, Platform} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {
  Divider,
  Layout,
  CheckBox,
  Text,
  TopNavigation,
  Button,
  Input,
  List,
  Card,
  Modal,
} from '@ui-kitten/components';
import { CloseIcon, PlusIcon } from './extras/icons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'react-native-axios';
import {useSelector} from 'react-redux';

// ✅ Dynamic status bar padding - adapts to actual device
const getTopPadding = () => {
  if (Platform.OS === 'android') {
    return (StatusBar.currentHeight || 25) + 10;
  }
  return 15; // iOS default
};


// --- COMPONENTS OUTSIDE MenuScreen ---
function RenderDish({ item }) {
  return (
    <View style={styles.dishRow}>
      <CheckBox checked={item.checked} style={styles.checkbox} />
      <Text style={item.checked ? styles.dishChecked : styles.dishUnchecked}>{item.name}</Text>
    </View>
  );
}

function RenderCard({ item, navigation, makerId, menuId }) {
  let safeDishes = [];
  try {
    safeDishes = Array.isArray(item?.dishes) ? item.dishes : [];
  } catch (e) {
    safeDishes = [];
  }
  return (
    <Card
      style={styles.item}
      status="basic"
      onPress={() => {
        navigation.navigate('CategoryDetailsScreen', { 
          category: item,
          menu_id: menuId,
          maker_id: makerId,
        });
      }}
    >
      <View style={styles.cardHeader}>
        <Icon name="restaurant-menu" size={22} color="#888" style={styles.iconMarginRight} />
        <Text category="h6" style={styles.cardTitle}>{item.title}</Text>
        <View style={styles.flex1} />
        <Icon name="chevron-right" size={28} color="#888" />
      </View>
      <Divider style={styles.dividerMargin} />
      {safeDishes.length > 0 ? (
        <FlatList
          data={safeDishes}
          renderItem={({ item: dish }) => <RenderDish item={dish} />}
          keyExtractor={(dish, idx) => dish.name + idx}
        />
      ) : (
        <Text appearance="hint" style={styles.noDishesText}>No Dishes Added</Text>
      )}
    </Card>
  );
}

function NewCategoryButton({ setCategoryModal }) {
  return (
    <Button
      accessoryLeft={PlusIcon}
      onPress={() => setCategoryModal(true)}
      appearance="filled"
      status="control">
      New Category
    </Button>
  );
}

// --- MAIN SCREEN ---
function MenuScreen(props) {
  const [categoryModal, setCategoryModal] = useState(false);
  const [categoryTitle, setCategoryTitle] = useState('');
  const [categories, setCategories] = useState([]);
  const [menuId, setMenuId] = useState(null);

  // Get maker ID from Redux store
  const logged_user = useSelector((state) => state.main_app.logged_user);
  const makerId = logged_user?.id;

  // ✅ Use ref for synchronous deduplication of LoadCategories
  const isLoadingCategoriesRef = useRef(false);

  // Debug log to check if makerId is available
  React.useEffect(() => {
    // Just log once on mount
    if (makerId) {
      console.log('MenuScreen mounted with makerId:', makerId);
    }
  }, [makerId]);

  // Modal sizing
  const SLIDER_WIDTH = Dimensions.get('window').width;
  const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);
  const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 3) / 4);

  // Load categories from backend
  const LoadCategories = useCallback(async () => {
    try {
      // ✅ PREVENT DUPLICATE REQUESTS: Check ref synchronously
      if (isLoadingCategoriesRef.current) {
        console.log('⏳ Already loading categories, skipping duplicate request');
        return;
      }

      if (!makerId) {
        setCategories([]);
        return;
      }

      isLoadingCategoriesRef.current = true;
      const response = await axios({
        method: 'get',
        url: `http://10.0.2.2:3000/api/v1/menus/${makerId}`,
        headers: {},
        timeout: 10000,
      });

      // The API returns data.menu as an array of categories
      let menuData = response?.data?.data?.menu || [];
      const fetchedMenuId = response?.data?.data?.id;
      
      setMenuId(fetchedMenuId);
      
      if (Array.isArray(menuData)) {
        setCategories(menuData);
      } else {
        setCategories([]);
      }
      isLoadingCategoriesRef.current = false;
    } catch (error) {
      setCategories([]);
      isLoadingCategoriesRef.current = false;
    }
  }, [makerId]);

  // Create new category in backend
  const CreateCategory = async () => {
    try {
      if (!makerId) {
        Alert.alert('Error', 'Maker ID not found. Please logout and login again.');
        return;
      }
      
      if (!categoryTitle.trim()) {
        Alert.alert('Error', 'Please enter category name');
        return;
      }

      const response = await axios.post(
        `http://10.0.2.2:3000/api/v1/menus/${makerId}/categories`,
        {title: categoryTitle.trim()},
        {timeout: 15000}
      );
      
      return response.data;
      
    } catch (error) {
      Alert.alert('Error', 'Failed to create category: ' + (error?.message || 'Unknown error'));
      throw error;
    }
  };

  // Handle adding category
  const HandleAddCategory = async () => {
    if (categoryTitle.trim() === '') {
      Alert.alert('Error', 'Please enter category name');
      return;
    }
    
    try {
      await CreateCategory();
      
      // Close modal immediately
      setCategoryModal(false);
      setCategoryTitle('');
      
      // Reload categories after 1 second
      setTimeout(() => {
        LoadCategories();
      }, 1000);
    } catch (error) {
      console.log('Error adding category:', error?.message);
    }
  };

  const changeModal = () => {
    setCategoryModal(false);
  };

  // Load categories when component mounts or makerId changes
  useEffect(() => {
    if (makerId) {
      LoadCategories();
    }
  }, [makerId, LoadCategories]);

  // Reload categories when screen is focused - but use initialization flag to prevent double loads
  useFocusEffect(
    React.useCallback(() => {
      if (makerId) {
        LoadCategories();
      }
    }, [makerId, LoadCategories])
  );

  return (
    <SafeAreaView style={styles.container}>
      <TopNavigation
        style={[styles.topNav, {paddingLeft: 20, paddingTop: getTopPadding()}]}
        title="Menu"
        accessoryRight={<NewCategoryButton setCategoryModal={setCategoryModal} />}
        alignment="start"
      />
      <Divider />
      <Modal
        visible={categoryModal}
        backdropStyle={styles.backdrop}
        onBackdropPress={changeModal}>
        <Card disabled={true} status="warning">
          <View style={styles.modalHeader}>
            <CloseIcon setModal={setCategoryModal} />
          </View>
          <View style={[styles.modalBody, { height: ITEM_HEIGHT, width: ITEM_WIDTH }] }>
            <Text style={styles.addCategoryTitle}>Add New Category</Text>
            <Input
              autoFocus
              textStyle={styles.inputText}
              status="basic"
              placeholder="Name (Eg: Breads, Starters,etc)"
              value={categoryTitle}
              onChangeText={setCategoryTitle}
            />
            <Button
              onPress={() => {
                HandleAddCategory();
              }}>
              ADD
            </Button>
          </View>
        </Card>
      </Modal>

      <Layout style={styles.listLayout} level="1">
        {categories.length ? (
          <List
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            data={categories}
            renderItem={({item}) => <RenderCard item={item} navigation={props.navigation} makerId={makerId} menuId={menuId} />}
          />
        ) : (
          <View>
            <Text category="s1" style={styles.noCategoriesText}>
              No Categories Added
            </Text>
          </View>
        )}
      </Layout>
      <Text appearance="hint" style={styles.noteText}>
        Note: Check dishes currently available with you.
      </Text>
    </SafeAreaView>
  );
}

export default MenuScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  item: {
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFD700', // yellow border
    backgroundColor: '#fff',
    padding: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#444',
  },
  dishRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  dishChecked: {
    color: '#00E096',
    marginLeft: 8,
    fontSize: 16,
  },
  dishUnchecked: {
    color: '#888',
    marginLeft: 8,
    fontSize: 16,
  },
  noDishesText: {
    color: '#bbb',
    fontStyle: 'italic',
    marginLeft: 8,
    marginVertical: 4,
  },
  // listcontainer: removed (not used)
  iconMarginRight: {
    marginRight: 8,
  },
  flex1: {
    flex: 1,
  },
  dividerMargin: {
    marginVertical: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '15%',
    alignSelf: 'flex-end',
    position: 'absolute',
    marginRight: 0,
  },
  modalBody: {
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  addCategoryTitle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'grey',
    fontWeight: 'bold',
  },
  inputText: {
    color: 'grey',
  },
  listLayout: {
    flex: 1,
    width: '100%',
  },
  noCategoriesText: {
    alignSelf: 'center',
    margin: 10,
    fontSize: 20,
  },
  noteText: {
    alignSelf: 'center',
    padding: 2,
  },
});
