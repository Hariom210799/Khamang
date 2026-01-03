import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {StyleSheet, TouchableOpacity, View, Image, Alert, StatusBar, Platform} from 'react-native';
import {
  Button,
  Divider,
  Layout,
  List,
  ListItem,
  MenuItem,
  OverflowMenu,
  Text,
  TopNavigation,
} from '@ui-kitten/components';
import {SLIDER_WIDTH} from '../../../../utils/dimensions';
import {MoreVerticalIcon, AddIcon} from '../extras/icons';
import axios from 'react-native-axios';
import DishModal from './dishModal';

// ✅ Dynamic status bar padding - adapts to actual device
const getTopPadding = () => {
  if (Platform.OS === 'android') {
    return (StatusBar.currentHeight || 25) + 10;
  }
  return 15; // iOS default
};

function CategoryDetails(props) {
  const [dishModal, setDishModal] = useState(false);
  const [dishId, setDishId] = useState(null);
  const [dishes, setDishes] = useState([]);

  // ✅ Added to avoid ReferenceError
  const [catMenu, setCatMenu] = useState(false);
  const [menuIndex, setMenuIndex] = useState(null);

  const route = props.route || {};
  const params = route.params || {};

  // ✅ FIX: category can be object (ex: {title:"Breads"}) OR string
  const categoryParam = params.category;
  let rawCategoryName =
    typeof params.categoryName === 'string'
      ? params.categoryName
      : typeof categoryParam === 'string'
        ? categoryParam
        : typeof categoryParam?.title === 'string'
          ? categoryParam.title
          : '';
  // ✅ TRIM spaces from category name
  const categoryName = rawCategoryName.trim();

  const menu_id = params.menu_id;
  const maker_id = params.maker_id;

  const LoadCategories = useCallback(async () => {
    try {
      if (!menu_id) {
        setDishes([]);
        return;
      }
      
      const url = `http://10.0.2.2:3000/api/v1/menus/${menu_id}`;
      const res = await axios.get(url, {timeout: 5000}); // Reduced to 5 seconds

      let menuArr = [];
      if (res?.data?.data?.menu && Array.isArray(res.data.data.menu)) {
        menuArr = res.data.data.menu;
      }

      // ✅ TRIM category titles for proper comparison
      const found = menuArr.find(o => o && o.title && o.title.trim() === categoryName);
      
      if (found?.dishes && Array.isArray(found.dishes)) {
        setDishes(found.dishes);
      } else {
        setDishes([]);
      }
    } catch (error) {
      setDishes([]);
    }
  }, [menu_id, categoryName]);

  // ✅ Delete individual dish
  const DeleteDish = useCallback(async (dish_id) => {
    try {
      console.log('🗑️ Deleting dish:', dish_id);
      console.log('📤 Delete request data:', {
        url: `http://10.0.2.2:3000/api/v1/dishes/${dish_id}`,
        body: {
          menu_id: menu_id,
          category_name: categoryName,
        }
      });
      
      // ✅ INSTANT VISUAL FEEDBACK: Remove from UI immediately
      console.log('🎨 Removing dish from UI immediately');
      setDishes(prevDishes => {
        const updated = prevDishes.filter(dish => dish._id !== dish_id);
        console.log('📊 Dishes updated in state, remaining:', updated.length);
        return updated;
      });
      
      // ✅ Then call server to delete
      const response = await axios.delete(
        `http://10.0.2.2:3000/api/v1/dishes/${dish_id}`,
        {
          data: {
            menu_id: menu_id,
            category_name: categoryName,
          },
          timeout: 15000,
        }
      );
      
      console.log('✅ Dish deleted successfully, status:', response.status);
      console.log('📥 Delete response:', response.data);
      
      // ✅ Then reload from server to ensure sync
      console.log('🔄 Awaiting LoadCategories...');
      await LoadCategories();
      console.log('✅ Dishes reloaded successfully after delete');
      
    } catch (error) {
      // ✅ ROLLBACK: Reload dishes if delete failed
      await LoadCategories();
      
      Alert.alert('Error', 'Error deleting dish: ' + (error?.message || 'Unknown error'));
    }
  }, [menu_id, categoryName, LoadCategories]);

  // ✅ Placeholder delete (prevents crash)
  const DeleteCategory = useCallback(() => {
    setCatMenu(false);
  }, []);

  // Move EditMenuButton outside of render
  const EditMenuButton = useMemo(() => {
    return () => (
      <TouchableOpacity onPress={() => setCatMenu(true)}>
        <OverflowMenu
          anchor={MoreVerticalIcon}
          visible={catMenu}
          selectedIndex={menuIndex}
          onSelect={setMenuIndex}
          onBackdropPress={() => setCatMenu(false)}>
          <MenuItem title="Edit Category" />
          <MenuItem title="Delete Category" onPress={DeleteCategory} />
        </OverflowMenu>
      </TouchableOpacity>
    );
  }, [catMenu, menuIndex, DeleteCategory]);

  useEffect(() => {
    LoadCategories();
  }, [menu_id, categoryName, LoadCategories]);

  // ✅ Define BackButton component outside render
  const BackButton = useMemo(() => (
    <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.backButton}>
      <View>
        <Text style={styles.backIcon}>←</Text>
      </View>
    </TouchableOpacity>
  ), [props.navigation]);

  // ✅ Define EditDeleteIcon as a proper component factory
  const EditDeleteIcon = useCallback(({dish_id}) => (
    <TouchableOpacity 
      onPress={() => {
        Alert.alert(
          'Delete Dish',
          'Are you sure you want to delete this dish?',
          [
            {text: 'Cancel', onPress: () => {}},
            {
              text: 'Delete',
              onPress: () => DeleteDish(dish_id),
              style: 'destructive',
            },
          ]
        );
      }}
      style={styles.deleteIconContainer}
    >
      <Text style={styles.deleteIcon}>🗑️</Text>
    </TouchableOpacity>
  ), [DeleteDish]);

  // ✅ Define page title outside render
  const PageTitle = useMemo(() => (
    <Text category="h5" status="primary">
      {categoryName || 'Category'}
    </Text>
  ), [categoryName]);

  // ✅ Thumbnail component defined outside renderListItem
  const ThumbnailComponent = useCallback(({dish}) => {
    let imageSource = null;
    let hasImage = false;
    
    // If dish has an image (Cloudinary URL), use it directly
    if (dish?.image && typeof dish.image === 'string' && dish.image !== 'null' && dish.image !== '') {
      const imageUrl = dish.image;
      imageSource = { uri: imageUrl };
      hasImage = true;
    }
    
    // If no image, show placeholder
    if (!hasImage) {
      return (
        <View style={[styles.avatar, styles.placeholderThumbnail]}>
          <Text style={styles.placeholderIcon}>🍽️</Text>
        </View>
      );
    }
    
    // Use Image directly for network images
    return (
      <Image
        source={imageSource}
        style={styles.avatar}
        onError={() => {
          console.log('⚠️ Failed to load image for', dish?.name);
        }}
      />
    );
  }, []);

  // ✅ Create a render item wrapper that accepts item data
  const renderListItem = useCallback(({item}) => {
    let title = '';
    let description = '';

    if (item && typeof item === 'object') {
      if (typeof item.name === 'string') title = item.name;
      else if (item.name) title = JSON.stringify(item.name);

      if (typeof item.cuisine_type === 'string') description = item.cuisine_type;
      else if (item.cuisine_type) description = JSON.stringify(item.cuisine_type);
    }

    return (
      <ListItem
        accessoryLeft={() => <ThumbnailComponent dish={item} />}
        accessoryRight={() => <EditDeleteIcon dish_id={item?._id ?? ''} />}
        title={title}
        description={description}
      />
    );
  }, []);

  // ✅ make dishes safe always
  const safeDishes = Array.isArray(dishes)
    ? dishes.map(d => {
        let name = '';
        let cuisine_type = '';
        if (d && typeof d === 'object') {
          if (typeof d.name === 'string') name = d.name;
          else if (d.name) name = JSON.stringify(d.name);

          if (typeof d.cuisine_type === 'string') cuisine_type = d.cuisine_type;
          else if (d.cuisine_type) cuisine_type = JSON.stringify(d.cuisine_type);
        }
        return {...d, name, cuisine_type};
      })
    : [];

  return (
    <Layout style={styles.container}>
      <TopNavigation
        style={[styles.topNav, {paddingTop: getTopPadding()}]}
        title={PageTitle}
        accessoryRight={EditMenuButton}
        accessoryLeft={BackButton}
        alignment="start"
      />

      <Divider />

      <Layout>
        {safeDishes.length > 0 ? (
          <List
            style={styles.listcontainer}
            data={safeDishes}
            ItemSeparatorComponent={Divider}
            renderItem={renderListItem}
            keyExtractor={(item, index) => item?._id ? String(item._id) : String(index)}
          />
        ) : (
          <View>
            <Text
              category="s1"
              style={styles.noDishesText}>
              No Dishes Added
            </Text>
          </View>
        )}
      </Layout>

      <View style={styles.addDishButton}>
        <Button
          size="large"
          appearance="filled"
          status="success"
          accessoryLeft={AddIcon}
          onPress={() => {
            console.log('Add button pressed, setting dishModal to true');
            setDishModal(true);
          }}
        />
      </View>

      <DishModal
        dishId={dishId ?? null}
        menuId={menu_id}
        categoryName={categoryName}
        dishModal={!!dishModal}
        setDishModal={setDishModal}
        setDishId={setDishId}
        onDishSaved={LoadCategories}
        makerId={maker_id}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  topNav: {
    maxHeight: '10%',
    maxWidth: SLIDER_WIDTH,
  },
  listcontainer: {},
  avatar: {
    margin: 4,
    width: 56,
    height: 56,
    borderRadius: 4,
    resizeMode: 'cover',
  },
  placeholderThumbnail: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 24,
  },
  addDishButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 10,
  },
  noDishesText: {
    alignSelf: 'center',
    margin: 10,
    fontSize: 20,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
  },
  deleteIconContainer: {
    paddingRight: 10,
  },
  deleteIcon: {
    fontSize: 20,
    color: '#FF6B6B',
  },
});

export default CategoryDetails;