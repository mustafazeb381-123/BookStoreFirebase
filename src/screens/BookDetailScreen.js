import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const BookDetailScreen = props => {
  const navigation = useNavigation();
  console.log('props', props);
  console.log('bookDetailScreen', props?.route?.params?.bookData);
  const [bookDetail, setBookDetail] = useState(props?.route?.params?.bookData);
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  console.log('favoriteBooks', favoriteBooks);
  console.log('bookDetail', bookDetail);
  const [isFavorite, setIsFavorite] = useState(false); // Track whether the book is a favorite
  const [commentText, setCommentText] = useState('');
  const [loader, setLoader] = useState(false);
  const [comment, setComment] = useState([]);
  const [booksId, setBooksId] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log('comments', comment);
  console.log('booksId', booksId);

  // Function to add the book to favorites
  const addToFavorites = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        const userId = user.uid;
        console.log('userId', userId);
        const bookId = bookDetail.key; // Use a unique identifier for the book
        console.log('bookId', bookId);
        // Add the book to the user's favorites in Firestore
        await firestore().collection('Favorites').add({
          userId,
          bookId,
        });

        // Update the local state to indicate that the book is a favorite
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  const fetchFavoriteBooks = async () => {
    const user = auth().currentUser;
    if (user) {
      try {
        const querySnapshot = await firestore()
          .collection('Favorites')
          .where('userId', '==', user.uid)
          .get();
        const favorites = [];
        querySnapshot.forEach(doc => {
          favorites.push(doc.data().bookId);
        });
        setFavoriteBooks(favorites);
      } catch (error) {
        console.error('Error fetching favorite books:', error);
      }
    }
  };

  const fetchComments = async () => {
    const user = auth().currentUser;
    if (user) {
      setLoading(true);
      try {
        const querySnapshot = await firestore()
          .collection('Comments')
          .where('userId', '==', user.uid)
          .get();
        const bookId = [];
        const comments = [];
        querySnapshot.forEach(doc => {
          bookId.push(doc.data().bookId);
          comments.push(doc.data().commentText);
        });
        setComment(comments);
        setBooksId(bookId);
      } catch (error) {
        console.error('Error fetching favorite books:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const addComment = async () => {
    setLoader(true);
    try {
      const user = auth().currentUser;
      if (user) {
        const userId = user.uid;
        const bookId = bookDetail.key; // The book's unique identifier
        const timestamp = new Date().toISOString();

        // Add the comment to Firestore
        await firestore().collection('Comments').add({
          userId,
          bookId,
          commentText,
          timestamp,
        });
        Alert.alert('Successfully', 'Comment added');

        // Clear the comment input field
        setCommentText('');

        // Optionally, you can update the UI to display the newly added comment.
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchFavoriteBooks();
    fetchComments();
  }, []);

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <AntDesign name="arrowleft" size={20} color={'black'} />
        </TouchableOpacity>
        <Text onPress={() => {}} style={styles.headerText}>
          BookDetail
        </Text>
        <TouchableOpacity>
          <Text style={styles.headerText}></Text>
        </TouchableOpacity>
      </View>

      <View style={styles.top}>
        <View style={styles.bookDetails}>
          <View style={styles.heading}>
            <Text style={styles.bookText}>{`Title : ${bookDetail.title}`}</Text>
            <TouchableOpacity onPress={() => addToFavorites()}>
              {isFavorite || favoriteBooks.includes(bookDetail.key) ? (
                <AntDesign name="heart" size={20} color={'red'} /> // Display a filled heart for favorites
              ) : (
                <AntDesign name="hearto" size={20} /> // Display an outlined heart for non-favorites
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.bookText}>{`Cover:  ${bookDetail.covers}`}</Text>
          <Text style={styles.bookText}>{`Key:  ${bookDetail.key}`}</Text>
          <Text style={styles.bookText}>
            {`Pages:  ${bookDetail.number_of_pages}`}
          </Text>
          <Text style={styles.bookText}>
            {`Publish Date:  ${bookDetail.publish_date}`}
          </Text>
          <Text style={styles.bookText}>{`Weight:  ${bookDetail.weight}`}</Text>
          <Text style={styles.bookText}>
            {`Subjects:  ${bookDetail.subjects}`}
          </Text>
          <Text style={styles.bookText}>
            {`Revision:  ${bookDetail.revision}`}
          </Text>
          <Text style={styles.bookText}>
            {`Publishers:  ${bookDetail.publishers}`}
          </Text>

          {loading ? (
            <ActivityIndicator />
          ) : (
            <View>
              {booksId.includes(bookDetail.key) && (
                <View>
                  <Text style={styles.bookText}>Comments:</Text>

                  <Text style={styles.comments}>{comment}</Text>
                </View>
              )}
            </View>
          )}
        </View>

        <View style={styles.commentView}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            value={commentText}
            placeholderTextColor={'grey'}
            onChangeText={text => setCommentText(text)}
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            addComment();
          }}
          style={styles.commentButton}>
          {loader ? (
            <ActivityIndicator size={20} color={'white'} />
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  comments: {
    color: 'black',
    fontSize: 14,
    fontWeight: '400',
  },
  commentInput: {
    color: 'black',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  commentButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 51,
    marginTop: 20,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  commentView: {
    width: '100%',
    borderRadius: 5,
    borderWidth: 1,
    color: 'grey',
    height: 60,
    justifyContent: 'center',
  },
  bookText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'black',
  },
  top: {
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  bookDetails: {
    width: '100%',
    marginTop: 10,
    gap: 5,
    backgroundColor: 'white',
    paddingVertical: 20,
  },
  headerText: {
    fontSize: 17,
    fontWeight: '600',
    color: 'black',
  },

  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 60,
    backgroundColor: 'white',
    elevation: 3,
    flexDirection: 'row',
    paddingHorizontal: 21,
  },
  main: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default BookDetailScreen;
