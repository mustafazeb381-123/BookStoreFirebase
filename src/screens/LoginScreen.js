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
import messaging from '@react-native-firebase/messaging';

const LoginScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loader, setLoader] = useState(false);
  // const [token, setToken] = useState('')
  // const [userName, setUserName] = useState('')

  const handleLogin = async () => {
    setLoader(true);
    try {
      const userRef = firestore().collection('Users');
      console.log('userRef', userRef);
      const querySnapshot = await userRef
        .where('email', '==', email)
        .where('password', '==', password)
        .get();
      console.log('querySnapshot', querySnapshot);

      if (querySnapshot.empty) {
        // No user found with the provided email and password
        Alert.alert('Login Error', 'Invalid email or password.');
      } else {
        // User found, login successful
        const userData = querySnapshot.docs[0].data();
        console.log('User found', userData);
        console.log('user Token', userData.token);
        // setToken(userData.token);
        const tokendata = userData.token;
        console.log('tokendata', tokendata);
        await AsyncStorage.setItem('token', tokendata);
        const getToken = await AsyncStorage.getItem('token');
        console.log('Token found', getToken);
        Alert.alert('success', 'Login Successful');
        console.log('User logged in successfully!');
        navigation.navigate('Home');
        // Navigate to the main app screen or perform other actions
      }
    } catch (error) {
      console.error('Login failed: ', error);
      Alert.alert('Login Error', 'An error occurred during login.');
    } finally {
      setLoader(false);
    }
  };

  // const login = async () => {
  //     setLoader(true);
  //     try {
  //         const userCredential = await auth().signInWithEmailAndPassword(email, password);
  //         const user = userCredential;
  //         console.log("user", user)
  //         console.log("user token1", user.user._user.uid)
  //         setToken(user.user._user.uid)

  //         if (user) {
  //           console.log("token 2",user.user._user.uid)
  //             console.log("id Token", token)
  //             // Save the token in AsyncStorage
  //             await AsyncStorage.setItem('userToken', token);
  //             console.log('User token saved in AsyncStorage:', token);

  //             const getToken = await AsyncStorage.getItem("userToken")
  //             console.log("getToken", getToken)

  //             Alert.alert('Login successful');
  //             navigation.navigate('Home');
  //         }
  //     } catch (error) {
  //         if (error.code === 'auth/invalid-email') {
  //             console.log('That email address is invalid!');
  //         } else if (error.code === 'auth/wrong-password') {
  //             console.log('Wrong password!');
  //         } else {
  //             console.error(error);
  //         }
  //     } finally {
  //         setLoader(false);
  //     }
  // }

  useEffect(() => {
    // console.log("useEffect token", token)
  }, []);

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.textInputView}>
        {/* <View style={styles.inputView}>
                    <TextInput onChangeText={(val) => { setUserName(val)}} placeholder='UserName' placeholderTextColor={"black"} style={styles.input} />
                </View> */}

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
            handleLogin();
          }}
          style={styles.buttonView}>
          {loader ? (
            <ActivityIndicator color={'white'} />
          ) : (
            <Text style={styles.text}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.orview}>
        <Text style={styles.or}>Or</Text>

        <Text
          onPress={() => {
            navigation.navigate('Signup');
          }}
          style={styles.alreadytext}>
          Don't have account? <Text style={{color: 'blue'}}>Signup</Text>
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

export default LoginScreen;
