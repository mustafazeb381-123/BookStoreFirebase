import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    console.log('splashscreen getTokem', AsyncStorage.getItem('token'));
    setTimeout(async () => {
      await AsyncStorage.getItem('token').then(val => {
        if (!val) {
          navigation.replace('Login');
        } else {
          navigation.replace('Home');
        }
      });
    }, 1000);
  }, []);
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{color: '#0373fc', fontSize: 20, fontWeight: '700'}}>
        BookStore
      </Text>
    </View>
  );
};

export default SplashScreen;
