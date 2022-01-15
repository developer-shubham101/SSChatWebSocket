import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { wsCreateRoom, wsGetAllUsers } from '../modules/websocket';
import {
  ALL_USER,
  REQUEST_ROOM,
  REQUEST_USERS,
  TYPE_CREATE_ROOM,
} from './const';
import { ReducerRoot, UserList } from '../type';
import produce from 'immer';
import _ from 'lodash';
import { Alert } from 'react-native';
const UsersList = ({ navigation }) => {
  const userList = useSelector<ReducerRoot, [UserList] | null | undefined>(
    (state) => state.reducer.userList,
  );
  const loggedInUser = useSelector<ReducerRoot, UserList | null | undefined>(
    (state) => state.reducer.loggedInUser,
  );
  const [isCreateGroup, setIsCreateGroup] = useState(true);

  const [selectedUsers, setSelectedUsers] = useState<[UserList]>([]);
  const [groupName, setGroupName] = useState<string>('');

  const groupNameInput = useRef();

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
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text
            style={{ color: 'black', fontWeight: 'bold', marginVertical: 10 }}
          >
            BACK
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text
            style={{ color: 'black', fontWeight: 'bold', marginVertical: 10 }}
          >
            {isCreateGroup ? `Create Group` : `Chat With :`}
          </Text>
        </TouchableOpacity>
        {isCreateGroup ? (
          <View>
            <View
              style={{
                height: 40,
                marginBottom: 10,
                borderRadius: 4,
                backgroundColor: '#fff',
                paddingHorizontal: 10,
                flexDirection: 'row',
              }}
            >
              <TextInput
                ref={(input) => {
                  groupNameInput.current = input;
                }}
                value={groupName}
                placeholder={'Type group name'}
                onChangeText={(text) => {
                  setGroupName(text);
                }}
                style={{ flex: 1, backgroundColor: 'gray' }}
              />
              <Button
                title={'Create Group'}
                onPress={() => {
                  /* 
                 try {
            val usersList = JSONArray()
            for (fsUsersModel in selectedUsersLists) {
                usersList.put(fsUsersModel.id)
            }
            usersList.put(UserDetails.myDetail.id)
            jsonObject.put("userList", usersList)
            jsonObject.put("type", "createRoom")
            jsonObject.put("room_type", "group")
            jsonObject.put("createBy", UserDetails.myDetail.id)
            val groupDetails = JSONObject()
            groupDetails.put("group_name", roomListBinding.userListGroupName.text)
            groupDetails.put("about_group", "This is Just a Sample Group")
            jsonObject.put("group_details", groupDetails)
            jsonObject.put(KeyConstant.REQUEST_TYPE_KEY, KeyConstant.REQUEST_TYPE_ROOM)
        } catch (e: JSONException) {
            e.printStackTrace()
        }
         */

                  if (_.isEmpty(groupName)) {
                    Alert.alert('Please enter title of group');
                    groupNameInput.current.focus();
                    return;
                  }
                  if (loggedInUser == null) {
                    return;
                  }

                  let userListItem = selectedUsers.map((item) => item.userId);
                  userListItem.push(loggedInUser.userId);

                  dispatch(
                    wsCreateRoom({
                      userList: userListItem,
                      type: TYPE_CREATE_ROOM,
                      room_type: 'group',
                      createBy: loggedInUser.userId,
                      group_details: {
                        group_name: groupName,
                        about_group: 'This is Just a Sample Group',
                      },
                      request: REQUEST_ROOM,
                    }),
                  );
                  navigation.navigate('ChatScreen');
                }}
              />
            </View>

            <FlatList
              keyExtractor={(item, index) => item.userId}
              // data={userList.length ? userList.filter((item) => {return item.userId != loggedInUser}): [] }
              horizontal={true}
              data={selectedUsers}
              extraData={selectedUsers.length}
              renderItem={({ item, index }) => {
                console.log('item--------------', item);
                return (
                  <TouchableOpacity
                    onPress={() => {
                      const tmpSelectedUsers = produce(
                        selectedUsers,
                        (draft) => {
                          draft.splice(index, 1);
                        },
                      );
                      setSelectedUsers(tmpSelectedUsers);
                    }}
                    style={{
                      borderBottomWidth: 1,
                      borderColor: 'grey',
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      backgroundColor: 'red',
                      borderRadius: 4,
                      marginEnd: 10,
                    }}
                  >
                    <Text style={{ color: 'black' }}>{item.firstName}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        ) : null}
        <FlatList
          keyExtractor={(item, index) => item.userId}
          // data={userList.length ? userList.filter((item) => {return item.userId != loggedInUser}): [] }
          data={
            userList?.length
              ? userList.filter((item) => {
                  return item.userId != loggedInUser?.userId;
                })
              : []
          }
          renderItem={({ item }) => {
            console.log('item--------------', item);
            return (
              <TouchableOpacity
                onPress={() => {
                  if (isCreateGroup) {
                    const index = selectedUsers.findIndex((elment) => {
                      return elment.userId === item.userId;
                    });

                    if (index == -1) {
                      const tmpSelectedUsers = produce(
                        selectedUsers,
                        (draft) => {
                          draft.push(item);
                        },
                      );
                      setSelectedUsers(tmpSelectedUsers);
                    } else {
                      const tmpSelectedUsers = produce(
                        selectedUsers,
                        (draft) => {
                          draft.splice(index, 1);
                        },
                      );
                      setSelectedUsers(tmpSelectedUsers);
                    }
                  } else {
                    if (loggedInUser == null) {
                      return;
                    }
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
                }}
              >
                <Text style={{ color: 'black' }}>{item.firstName}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'column', padding: 15 },
  subContainer: { marginTop: 100, marginEnd: 15, marginStart: 15 },
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
  label: { marginTop: 10 },
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
  buttonTitle: { color: '#ffffff', fontSize: 20 },
});

export default UsersList;
