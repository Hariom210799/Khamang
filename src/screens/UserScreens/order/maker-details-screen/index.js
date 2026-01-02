import React, {useState, useEffect} from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  ListRenderItemInfo,
  ScrollView,
  View,
  FlatList,
  SafeAreaView,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import {
  Button,
  Card,
  Icon,
  List,
  StyleService,
  Avatar,
  ListItem,
  Text,
  useStyleSheet,
  TopNavigation,
  TopNavigationAction,
  Divider,
  Layout,
} from '@ui-kitten/components';
import axios from 'react-native-axios';
import {ImageOverlay} from './extra/image-overlay.component';
import {Product, ProductOption} from './extra/data';
import VirtualizedView from './MenuList';

const product = Product.centralParkApartment();

export default ({route, navigation}) => {
  // console.log(route.params.maker_data);
  var maker_data = route.params.maker_data;
  var maker_id = maker_data._id;
  const styles = useStyleSheet(themedStyles);

  const [bottomModal, setBottomModal] = React.useState(false);
  const [cart, setCart] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    LoadMenu();
    setTimeout(() => setRefreshing(false), 2000);
  }, []);
  const deviceWidth = Dimensions.get('window').width;
  const deviceHeight =
    Platform.OS === 'ios'
      ? Dimensions.get('window').height
      : require('react-native-extra-dimensions-android').get(
          'REAL_WINDOW_HEIGHT',
        );

  const [isModalVisible, setModalVisible] = useState(false);
  const [menudata, setMenuData] = useState();

  const [selectedFilter, setSelectedFilter] = useState(null); // 'VEGITARIAN' or 'NON-VEGITARIAN'

  const filterOptions = ['VEGITARIAN', 'NON-VEGITARIAN'];


  // Filter click handler
  const handleFilterPress = (filter) => {
    setSelectedFilter(filter === selectedFilter ? null : filter);
  };

  const onBookButtonPress = () => {};
  const renderImageItem = (info) => (
    <Image style={styles.imageItem} source={info.item} />
  );
  const renderOptionItemIcon = (style, icon) => <Icon {...style} name={icon} />;
  const renderOptionItem = (option, index) => (
    <Button
      key={index}
      style={styles.optionItem}
      appearance="ghost"
      size="small"
      icon={(style) => renderOptionItemIcon(style, option.icon)}>
      {option.title}
    </Button>
  );
  const renderDetailItem = (detail, index) => (
    <Button
      key={index}
      style={styles.detailItem}
      appearance="outline"
      size="tiny">
      {detail}
    </Button>
  );
  const renderBookingFooter = () => (
    <View style={{marginLeft: '8%'}}>
      <Text category="s1"></Text>
      <View style={styles.detailsList}>
        {product.details.map(renderDetailItem)}
      </View>
      <View style={styles.optionList}>
        {product.options.map(renderOptionItem)}
      </View>
    </View>
  );

  const EatNowButton = (dishInfo) => {
    const {id, name, price} = dishInfo;
    if (!cart.some((dish) => dish.name == name))
      return (
        <Button
          size="small"
          style={{margin: 5}}
          onPress={() => {
            cart.push(dishInfo);
            // console.log('Update CART', cart);
            LoadMenu();
          }}>
          EAT NOW
        </Button>
      );
    else
      return (
        <Button
          accessoryLeft={(props) => (
            <Icon {...props} name="checkmark" pack="eva" />
          )}
          size="small"
          status="success"
          style={{margin: 5}}
          onPress={() => {
            setCart(cart.filter((d) => d.name !== name));
            LoadMenu();
          }}>
          ADDED
        </Button>
      );
  };

  const EatNowButtonDisabled = (props) => {
    return (
      <Button
        accessoryLeft={(props) => <Icon {...props} name="close" pack="eva" />}
        size="small"
        style={{margin: 5}}
        status="danger">
        NOT AVAILABLE
      </Button>
    );
  };
  const renderItemIcon = (props) => <Icon {...props} name="hash" pack="eva" />;

  var config = {
    method: 'get',
    url: `http://10.0.2.2:3000/api/v1/menus/${maker_id}`,
    headers: {},
  };

  const LoadMenu = async () => {
    let res = await axios(config)
      .then(function (response) {
        setMenuData(response.data.data.menu);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    LoadMenu();
  }, []);

  const HandleGoToCart = () => {
    cart.forEach((o) => (o.qty = 1));
    console.log('Order Sent to Cart', cart);
    if (navigation) {
      try {
        navigation.navigate('CartScreen', {order: cart, makerid: maker_id});
      } catch (e) {
        console.error('Navigation error:', e);
      }
    }
  };

  const GoToCartButton = (props) => (
    <Button
      onPress={HandleGoToCart}
      size="medium"
      status="info"
      style={{margin: 0}}>
      GO TO CART
    </Button>
  );

  return (
    <Layout>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{paddingBottom: 150}}>
        <ImageOverlay style={styles.image} source={product.primaryImage} />

        <Card
          style={styles.bookingCard}
          appearance="filled"
          disabled={true}
          footer={renderBookingFooter}>
          <Text style={styles.title} category="h4">
            {/* {product.title} */}
            {maker_data.firstName + ' ' + maker_data.lastName}
          </Text>
          <Text category="s2">{maker_data.address}</Text>
          <Text style={styles.rentLabel} appearance="hint" category="h6">
            Maharashtrian Food
          </Text>
          <Text style={styles.priceLabel} category="h6">
            {product.price.formattedValue}
            <Text>{product.price.formattedScale}</Text>
          </Text>
          {/* <Button style={styles.bookButton} onPress={onBookButtonPress}>
            Cart Modal
          </Button> */}
        </Card>

        <Text style={styles.sectionLabel} category="s1">
          About
        </Text>
        <Text style={styles.description} appearance="hint">
          {maker_data.aboutme}
        </Text>
        <Text style={styles.sectionLabel} category="s1">
          Photos
        </Text>
        <List
          contentContainerStyle={styles.imagesList}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={product.images}
          renderItem={renderImageItem}
        />
        <Text style={styles.sectionLabel} category="s1">
          Menu
        </Text>

        {menudata ? (
          menudata.map((item, index) => {
            if (item.dishes.length)
              return (
                <View key={index}>
                  <Text
                    category="h4"
                    style={{
                      marginLeft: 20,
                      color: '#FEA12E',
                      fontWeight: '100',
                    }}>
                    {item.title}
                  </Text>
                  {item.dishes.map((el, i) => {
                    // console.log('EL', el);
                    return el.available ? (
                      <View
                        key={i}
                        style={{
                          marginVertical: 5,
                        }}>
                        <ListItem
                          style={{marginHorizontal: 15}}
                          title={(TextProps) => (
                            <Text style={{fontSize: 16, color: 'black', fontWeight: '500'}}>
                              {el.name}
                            </Text>
                          )}
                          description={(TextProps) => (
                            <>
                              <Text category="h6" style={{color: 'grey', marginTop: 4}}>
                                Rs. {el.price}
                              </Text>
                              {el.cuisine_type && (
                                <Text category="c2" style={{color: 'grey', marginTop: 2}}>
                                  {el.cuisine_type}
                                </Text>
                              )}
                            </>
                          )}
                          accessoryLeft={() => {
                            // Show dish image if available, otherwise show icon
                            if (el.image) {
                              return (
                                <Image
                                  source={{uri: el.image}}
                                  style={{width: 60, height: 60, borderRadius: 8, marginRight: 10}}
                                />
                              );
                            }
                            // Show a placeholder icon if no image
                            return (
                              <View style={{width: 60, height: 60, borderRadius: 8, backgroundColor: '#f0f0f0', marginRight: 10, justifyContent: 'center', alignItems: 'center'}}>
                                <Icon name="image" style={{width: 30, height: 30, tintColor: '#999'}} />
                              </View>
                            );
                          }}
                          accessoryRight={() =>
                            EatNowButton({
                              id: el._id,
                              name: el.name,
                              price: el.price,
                            })
                          }
                        />
                      </View>
                    ) : (
                      <View
                        key={i}
                        style={{
                          marginLeft: 20,
                          marginVertical: 5,
                          marginRight: 10,
                        }}>
                        <ListItem
                          title={(TextProps) => (
                            <Text category="h5" style={{color: 'grey'}}>
                              {el.name}
                            </Text>
                          )}
                          description={(TextProps) => (
                            <Text category="h6" style={{color: 'grey'}}>
                              Rs. {el.price}
                            </Text>
                          )}
                          accessoryLeft={renderItemIcon}
                          accessoryRight={EatNowButtonDisabled}
                        />
                      </View>
                    );
                  })}
                </View>
              );
          })
        ) : (
          <Text
            category="s1"
            style={{alignSelf: 'center', margin: 10, fontSize: 20}}>
            No Dishes Available
          </Text>
        )}
      </ScrollView>
      <Modal
        style={{
          justifyContent: 'flex-end',
          margin: 0,
        }}
        isVisible={cart.length > 0 ? true : false}
        // deviceWidth={deviceWidth}
        // deviceHeight={deviceHeight}
        // onSwipeComplete={() => setModalVisible(false)}
        // swipeDirection={['up', 'left', 'right', 'down']}
        hasBackdrop={false}
        coverScreen={false}
        swipeDirection="down">
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 4,
            // borderColor: 'rgba(0, 0, 0, 0.1)',
          }}>
          <ListItem
            style={{
              paddingHorizontal: 15,
              paddingVertical: 20,
              backgroundColor: 'black',
              opacity: 0.8,
            }}
            title={(TextProps) => (
              <Text
                style={
                  (TextProps.style,
                  {color: 'white', fontSize: 22, marginLeft: 10})
                }>
                {cart.length} dishes added
              </Text>
            )}
            description={(TextProps) => (
              <Text style={(TextProps.style, {fontSize: 15, marginLeft: 15})}>
                (Total Amount: Rs.{' '}
                {cart.reduce((r, d) => r + parseInt(d.price), 0)})
              </Text>
            )}
            accessoryRight={GoToCartButton}
          />
        </View>
      </Modal>
    </Layout>
  );
};

const themedStyles = StyleService.create({
  container: {
    backgroundColor: 'background-basic-color-2',
  },
  image: {
    height: 360,
  },
  bookingCard: {
    marginTop: -80,
    margin: 16,
  },
  title: {
    width: '65%',
    color: 'black',
  },
  rentLabel: {
    marginTop: 15,
  },
  priceLabel: {
    marginTop: 8,
  },
  bookButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  detailsList: {
    flexDirection: 'row',
    marginHorizontal: -4,
    marginVertical: 8,
  },
  detailItem: {
    marginHorizontal: 4,
    borderRadius: 16,
  },
  optionList: {
    flexDirection: 'row',
    marginHorizontal: -4,
    marginVertical: 8,
  },
  optionItem: {
    marginHorizontal: 4,
    paddingHorizontal: 0,
  },
  description: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  sectionLabel: {
    marginHorizontal: 16,
    marginVertical: 8,
    textAlignVertical: 'center',
    paddingBottom: 8,
    fontSize: 30,
    color: '#A9A9A9',
    // alignSelf: 'center',
  },
  imagesList: {
    padding: 8,
    backgroundColor: 'background-basic-color-2',
  },
  imageItem: {
    width: 180,
    height: 120,
    borderRadius: 8,
    marginHorizontal: 8,
  },
});
