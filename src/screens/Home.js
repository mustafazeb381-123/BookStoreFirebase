import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);

  const [books, setBooks] = useState([]);

  const bookapicall = () =>
    axios
      .get('https://openlibrary.org/works/OL45804W/editions.json')
      .then(res => {
        console.log('res', res);
        setBooks(res.data.entries);
      })
      .catch(err => {
        console.log(err);
      });

  const handleLogout = async () => {
    setLoader(true);
    try {
      const removeToken = await AsyncStorage.removeItem('token');
      console.log('removeItem: ', removeToken);
      navigation.replace('Login');
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };
  useEffect(() => {
    bookapicall();
    console.log('home token', AsyncStorage.getItem('token'));
  }, []);

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.header}>
        <Text style={styles.headerText}>BookStore</Text>
        <TouchableOpacity>
          {loader ? (
            <ActivityIndicator size={15} color={'green'} />
          ) : (
            <Text
              onPress={() => {
                handleLogout();
              }}
              style={styles.headerText}>
              Logout
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.flatlistView}>
        <FlatList
          data={books}
          style={{marginTop: 20}}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <Text
              style={{
                color: 'black',
                alignSelf: 'center',
                fontSize: 20,
                paddingTop: '50%',
              }}>
              No Data Found
            </Text>
          )}
          renderItem={({item, index}) => {
            //   console.log("item", item)
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('BookDetailScreen', {bookData: item});
                }}
                style={styles.ProductView}>
                <View style={styles.bookNameView}>
                  <Text style={styles.bookText}>{`Title : ${item.title}`}</Text>
                </View>

                <Text style={styles.bookText}>
                  {`Publishers : ${item.publishers}`}
                </Text>
                <Text style={{color: 'black', fontSize: 13, fontWeight: '400'}}>
                  {`Pages : ${item?.number_of_pages}`}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bookText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'black',
  },
  bookNameView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flatlistView: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  ProductView: {
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: 'white',
    elevation: 5,
    borderRadius: 10,
    // flexDirection: 'row',
    // alignItems: 'center',
    marginTop: 10,
  },
  headerText: {
    fontSize: 17,
    fontWeight: '600',
    color: 'black',
  },
  header: {
    height: 60,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'white',
    elevation: 3,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 21,
  },
  main: {
    backgroundColor: '#F6F8FA',
    flex: 1,
  },
});

export default Home;
