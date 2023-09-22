import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Signup = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loader, setLoader] = useState(false);
  const [userName, setUserName] = useState('');

  const [randomToken, setRandomToken] = useState('');
  console.log('randomToken', randomToken);

  const handleGenerateToken = () => {
    const newToken = generateRandomToken(10); // Generate a 10-character random token
    setRandomToken(newToken);
  };

  function generateRandomToken(length) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters.charAt(randomIndex);
    }

    return token;
  }

  const login = async () => {
    setLoader(true);
    firestore()
      .collection('Users')
      .add({
        email: email,
        password: password,
        userName: userName,
        token: randomToken,
      })
      .then(async res => {
        console.log('res', res);
        Alert.alert('success', 'User added successfully');
        const tokendata = randomToken;
        console.log('tokendata', tokendata);
        const token = await AsyncStorage.setItem('token', tokendata);
        // console.log('token', token)
        console.log('User added!');
        const getToken = await AsyncStorage.getItem('token');
        console.log('getToken', getToken);
        navigation.navigate('Home');
      })
      .catch(err => {
        Alert.alert('error', 'Error adding user');
        console.log(err);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    handleGenerateToken();
    console.log('random token useEffect', randomToken);
  }, []);

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.textInputView}>
        <View style={styles.inputView}>
          <TextInput
            onChangeText={val => {
              setUserName(val);
            }}
            placeholder="UserName"
            placeholderTextColor={'black'}
            style={styles.input}
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            onChangeText={val => {
              setEmail(val);
            }}
            placeholder="Email"
            placeholderTextColor={'black'}
            style={styles.input}
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            onChangeText={val => {
              setPassword(val);
            }}
            placeholder="Password"
            placeholderTextColor={'black'}
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            login();
          }}
          style={styles.buttonView}>
          {loader ? (
            <ActivityIndicator color={'white'} />
          ) : (
            <Text style={styles.text}>Signup</Text>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.orview}>
        <Text style={styles.or}>Or</Text>

        <Text
          onPress={() => {
            navigation.navigate('Login');
          }}
          style={styles.alreadytext}>
          Already have an account? <Text style={{color: 'blue'}}>Login</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  alreadytext: {
    color: 'black',
    fontSize: 14,
    fontWeight: '400',
  },
  orview: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 20,
  },
  or: {
    color: 'grey',
    fontSize: 17,
    fontWeight: 'bold',
  },
  text: {
    color: 'white',
    fontSize: 15,
  },
  buttonView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
    height: 51,
    borderRadius: 5,
  },
  input: {
    width: '100%',
    height: 51,
    color: 'black',
  },
  inputView: {
    width: '100%',
    height: 51,
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 0.5,
  },
  textInputView: {
    width: '100%',
    paddingHorizontal: 21,
    gap: 20,
  },
  main: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Signup;
