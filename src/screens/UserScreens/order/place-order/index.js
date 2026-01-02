import React, {Component} from 'react';
import RazorpayCheckout from 'react-native-razorpay';
import {TouchableHighlight, Text, StyleSheet, Alert} from 'react-native';
import {Button} from '@ui-kitten/components';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'react-native-axios';

function Pay({route, navigation}) {
  const {order, id, order_details, makerid} = route.params || {};
  const logged_user = useSelector((state) => state.main_app.logged_user);
  
  // Safety check for missing params
  if (!order_details || !order || !id || !makerid) {
    return (
      <TouchableHighlight style={styles.container}>
        <Text style={{color: 'red', fontSize: 18, textAlign: 'center'}}>
          Error: Missing order details. Please go back and try again.
        </Text>
      </TouchableHighlight>
    );
  }
  
  console.log('ORDER:', order);
  // const styles = useStyleSheet(themedStyles);

  const StoreOrder = async (orderId) => {
    console.log('Storing Order:', orderId);
    await axios({
      method: 'patch',
      url: `http://10.0.2.2:3000/api/v1/users/${logged_user.id || logged_user._id}`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({orderId: orderId, makerId: makerid}),
    })
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const RecordOrder = async (order_obj) => {
    const rec_data = JSON.stringify(order_obj);
    await axios({
      method: 'post',
      url: 'http://10.0.2.2:3000/api/v1/orders',
      headers: {
        'Content-Type': 'application/json',
      },
      data: rec_data,
    })
      .then(function (response) {
        console.log('Recorded Then');
        console.log(JSON.stringify(response.data));
        StoreOrder(response.data.data._id);
        // Navigate to Order History after successful order
        setTimeout(() => {
          navigation.navigate('HistoryNavigator', {
            screen: 'HistoryScreen',
          });
        }, 1000);
      })
      .catch(function (error) {
        console.log('Order creation error:', error);
        if (error.response?.data?.message) {
          Alert.alert('Cannot Place Order', error.response.data.message);
        } else if (error.response?.status === 400) {
          Alert.alert('Unavailable', 'Maker is not accepting orders at this time');
        } else {
          Alert.alert('Error', 'Failed to place order. Please try again.');
        }
      });
  };

  const PayAmount = () => {
    var options = {
      description: 'Towards a Hygienic Food',
      image:
        'https://cdn3.iconfinder.com/data/icons/food-delivery-aesthetics-vol-2/256/Pay_on_Delivery-512.png',
      currency: 'INR',
      key: 'rzp_test_oyCN745HPQkWRI',
      amount: order_details.amount,
      name: 'Khamang Customer',
      order_id: id,
      prefill: {
        email: logged_user.email || 'customer@khamang.com',
        contact: String(logged_user.phoneNumber || logged_user.phone || '9000000000'),
        name: `${logged_user.firstName || ''} ${logged_user.lastName || ''}`.trim() || 'Customer',
      },
      external: {
        wallets: ['paytm', 'phonepe', 'amazonpay'],
      },
      theme: {color: '#30B6FF'},
    };

    RazorpayCheckout.open(options)
      .then((data) => {
        // handle success
        console.warn(`Success: ${data.razorpay_payment_id}`);
        RecordOrder({
          dishes: order,
          amount: order_details.amount / 100,
          payid: data.razorpay_payment_id,
          userid: logged_user.id || logged_user._id,
          makerid: makerid,
          prepared: false,
          del_address: logged_user.address,
        });
      })
      .catch((error) => {
        // handle failure
        console.warn(`Error: ${error.code} | ${error.description}`);
      });
  };

  return (
    <Button
      onPress={() => {
        PayAmount();
      }}
      style={styles.button}
      status="info"
      size="giant">
      Pay Rs. {order_details.amount / 100}
    </Button>
  );
}

export default Pay;

const styles = StyleSheet.create({
  button: {
    margin: 2,
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: '90%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
