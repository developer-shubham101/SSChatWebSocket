import React, {useEffect} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {wsCreateRoom, wsGetAllUsers} from '../modules/websocket';
import {ALL_USER, REQUEST_ROOM, REQUEST_USERS, TYPE_CREATE_ROOM} from './const';
import {ReducerRoot, UserList} from "../type";

const UsersList = ({navigation}) => {
  const userList = useSelector<ReducerRoot, [UserList] | null | undefined>(state => state.reducer.userList);
  const loggedInUser = useSelector<ReducerRoot, UserList | null | undefined>(state => state.reducer.loggedInUser);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      wsGetAllUsers({
        type: ALL_USER,
        request: REQUEST_USERS,
      }),
    );
    console.log('loggedInUser-------------', loggedInUser);
  }, [loggedInUser]);

  // if(!userList){
  //     return null;
  // }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Text
            style={{color: 'black', fontWeight: 'bold', marginVertical: 10}}>
            BACK
          </Text>
        </TouchableOpacity>
        <Text style={{color: 'black', fontWeight: 'bold', marginVertical: 10}}>
          Chat With :
        </Text>
        <FlatList
          keyExtractor={(item, index) => item.userId}
          // data={userList.length ? userList.filter((item) => {return item.userId != loggedInUser}): [] }
          data={
            userList?.length
              ? userList.filter(item => {
                return item.userId != loggedInUser?.userId;
              })
              : []
          }
          renderItem={({item}) => {
            console.log('item--------------', item);
            return (
              <TouchableOpacity
                onPress={() => {
                  if (loggedInUser != null) {
                    dispatch(
                      wsCreateRoom({
                        userList: [item.userId.toString(), loggedInUser.userId],
                        createBy: loggedInUser.userId,
                        type: TYPE_CREATE_ROOM,
                        request: REQUEST_ROOM,
                      }),
                    );
                    navigation.navigate('ChatScreen');
                  }

                }}
                style={{
                  borderBottomWidth: 1,
                  borderColor: 'grey',
                  paddingVertical: 20,
                }}>
                <Text style={{color: 'black'}}>{item.firstName}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, flexDirection: 'column', padding: 15},
  subContainer: {marginTop: 100, marginEnd: 15, marginStart: 15},
  textInput: {
    height: 60,
    width: 300,
    borderWidth: 1,
    borderColor: 'white',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  touchableStyle: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: 'black',
  },
  label: {marginTop: 10},
  newUserChat: {
    width: 50,
    height: 50,
    borderColor: 'black',
    backgroundColor: 'black',
    borderRadius: 25,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  plusIcon: {
    fontSize: 40,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
  },
  inputBox: {
    height: 50,
    borderWidth: 1,
    marginTop: 10,
    borderRadius: 25,
    paddingStart: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTitle: {color: '#ffffff', fontSize: 20},
});

export default UsersList;
