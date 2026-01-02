import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {
  Divider,
  Layout,
  Text,
  TopNavigation,
  Button,
  Toggle,
} from '@ui-kitten/components';
import {useSelector} from 'react-redux';
import axios from 'react-native-axios';

const TimeSetScreen = ({navigation}) => {
  const logged_user = useSelector((state) => state.main_app.logged_user);
  const [onlineEnabled, setOnlineEnabled] = useState(false);
  const [openHour, setOpenHour] = useState(9);
  const [openMin, setOpenMin] = useState(0);
  const [closeHour, setCloseHour] = useState(21);
  const [closeMin, setCloseMin] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch existing online time on load
  useEffect(() => {
    fetchOnlineTime();
  }, []);

  const fetchOnlineTime = async () => {
    try {
      const res = await axios.get(
        `http://10.0.2.2:3000/api/v1/makers/${logged_user.id || logged_user._id}`
      );
      const maker = res.data.data;
      if (maker.onlineTimeStart && maker.onlineTimeEnd) {
        setOnlineEnabled(true);
        const [oh, om] = maker.onlineTimeStart.split(':');
        const [ch, cm] = maker.onlineTimeEnd.split(':');
        setOpenHour(parseInt(oh));
        setOpenMin(parseInt(om));
        setCloseHour(parseInt(ch));
        setCloseMin(parseInt(cm));
      }
    } catch (error) {
      console.log('Error fetching online time:', error);
    }
  };

  const saveOnlineTime = async () => {
    if (onlineEnabled) {
      const openTotalMin = openHour * 60 + openMin;
      const closeTotalMin = closeHour * 60 + closeMin;
      if (openTotalMin >= closeTotalMin) {
        Alert.alert('Error', 'Close time must be after open time');
        return;
      }
    }

    setLoading(true);
    try {
      const openTimeStr = `${String(openHour).padStart(2, '0')}:${String(openMin).padStart(2, '0')}`;
      const closeTimeStr = `${String(closeHour).padStart(2, '0')}:${String(closeMin).padStart(2, '0')}`;

      await axios({
        method: 'patch',
        url: `http://10.0.2.2:3000/api/v1/makers/${logged_user.id || logged_user._id}`,
        headers: {'Content-Type': 'application/json'},
        data: JSON.stringify({
          onlineTimeEnabled: onlineEnabled,
          onlineTimeStart: onlineEnabled ? openTimeStr : null,
          onlineTimeEnd: onlineEnabled ? closeTimeStr : null,
          shopOpen: onlineEnabled ? true : logged_user.shopOpen, // Auto-open shop when online time is enabled
        }),
      });

      Alert.alert('Success', 'Online time updated successfully');
      console.log('✅ Online time saved:', {openTimeStr, closeTimeStr, onlineEnabled});
    } catch (error) {
      Alert.alert('Error', 'Failed to save online time');
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const TimeSelector = ({label, hour, min, onHourChange, onMinChange}) => {
    return (
      <View style={styles.timeSection}>
        <Text category="label" style={{marginBottom: 10}}>{label}</Text>
        <View style={styles.timeInputRow}>
          {/* Hour */}
          <View style={styles.timeInputGroup}>
            <Button
              size="small"
              onPress={() => onHourChange(Math.max(0, hour - 1))}
              style={styles.smallButton}
            >
              −
            </Button>
            <Text style={styles.timeValue}>{String(hour).padStart(2, '0')}</Text>
            <Button
              size="small"
              onPress={() => onHourChange(Math.min(23, hour + 1))}
              style={styles.smallButton}
            >
              +
            </Button>
          </View>

          <Text style={{fontSize: 20, marginHorizontal: 10}}>:</Text>

          {/* Minutes */}
          <View style={styles.timeInputGroup}>
            <Button
              size="small"
              onPress={() => onMinChange(Math.max(0, min - 15))}
              style={styles.smallButton}
            >
              −
            </Button>
            <Text style={styles.timeValue}>{String(min).padStart(2, '0')}</Text>
            <Button
              size="small"
              onPress={() => onMinChange(Math.min(45, min + 15))}
              style={styles.smallButton}
            >
              +
            </Button>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Layout style={styles.container}>
      <TopNavigation
        title={() => <Text category="h2" status="primary">Schedule Online Time</Text>}
        alignment="start"
      />
      <Divider />
      <ScrollView style={styles.content}>
        {/* Enable Online Time Toggle */}
        <View style={styles.section}>
          <View style={styles.toggleRow}>
            <View>
              <Text category="h6">Enable Online Time</Text>
              <Text appearance="hint" category="c1">
                {onlineEnabled ? 'Orders accepted during set hours' : 'Orders accepted anytime'}
              </Text>
            </View>
            <Toggle
              checked={onlineEnabled}
              onChange={setOnlineEnabled}
            />
          </View>
        </View>

        <Divider style={{marginVertical: 20}} />

        {onlineEnabled && (
          <>
            {/* Open Time */}
            <TimeSelector
              label="🕐 Open Time"
              hour={openHour}
              min={openMin}
              onHourChange={setOpenHour}
              onMinChange={setOpenMin}
            />

            <Divider style={{marginVertical: 15}} />

            {/* Close Time */}
            <TimeSelector
              label="🕑 Close Time"
              hour={closeHour}
              min={closeMin}
              onHourChange={setCloseHour}
              onMinChange={setCloseMin}
            />

            <Divider style={{marginVertical: 15}} />

            {/* Display Hours */}
            <View style={styles.infoBox}>
              <Text category="s2" style={{marginBottom: 8}}>📅 Your Online Hours</Text>
              <Text category="c1">
                Open: {String(openHour).padStart(2, '0')}:{String(openMin).padStart(2, '0')}
              </Text>
              <Text category="c1">
                Close: {String(closeHour).padStart(2, '0')}:{String(closeMin).padStart(2, '0')}
              </Text>
              <Text category="c2" style={{marginTop: 8, fontStyle: 'italic'}}>
                Orders will only be accepted during these hours
              </Text>
            </View>
          </>
        )}

        {!onlineEnabled && (
          <View style={styles.infoBox}>
            <Text category="c1">⏰ Online time is disabled. You accept orders 24/7</Text>
          </View>
        )}

        {/* Save Button */}
        <Button
          style={styles.saveButton}
          status="info"
          onPress={saveOnlineTime}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Online Schedule'}
        </Button>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeSection: {
    marginVertical: 10,
  },
  timeInputRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeInputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  smallButton: {
    minWidth: 40,
    paddingHorizontal: 8,
  },
  timeValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 12,
    minWidth: 50,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginVertical: 15,
  },
  saveButton: {
    marginTop: 30,
    marginBottom: 20,
    paddingVertical: 12,
  },
});

export default TimeSetScreen;
