import React, {useEffect, useState} from "react";
import {FlatList, ListRenderItem, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import * as t from "../redux/types";
import {useRoom} from "../hooks/useRoom";
import {ReducerRoot, RoomList, UserList} from "../type";
import {logout} from "../redux/action";

const Home = ({navigation}) => {

  const dispatch = useDispatch();

  const [randomKey, setRandomKey] = useState<number>();

  const {roomsList, usersList} = useRoom();
  const loggedInUser = useSelector<ReducerRoot, UserList | null | undefined>(state => state.reducer.loggedInUser);


  useEffect(() => {
    console.log('Max::: useRoom', usersList);
    setRandomKey(new Date().getMilliseconds());
  }, [roomsList, usersList]);

  /*const loggedInUser = useSelector(state => state.reducer.loggedInUser);
  const allRoomsData = useSelector(state =>
    state.reducer.allRoomsData ? state.reducer.allRoomsData.roomList : [],
  );
  const allUserList = useSelector(state =>
    state.reducer.userList ? state.reducer.userList : [],
  );
  useEffect(() => {
    dispatch(
      wsGetAllRooms({
        request: REQUEST_ROOM,
        type: REQUEST_ALL_ROOMS,
        userList: [loggedInUser],
      }),
    );
    console.log("loggedInUser-------------", loggedInUser);
  }, [loggedInUser]);*/

  // if(!userList){
  //     return null;
  // }

  const renderRestaurantRows: ListRenderItem<RoomList> = ({item}) => {

    let otherUserID = item.userList.find((e) => e != loggedInUser?.userId);

    const otherUser = usersList?.find((e) => {
      return e.userId.toString() == otherUserID;
    });

    return <TouchableOpacity
      onPress={() => {
        console.log('Shubham::::', item);
        dispatch({type: t.CREATE_ROOM_SUCCESS, payload: item});
        navigation.navigate("ChatScreen");
      }}
      style={{
        borderBottomWidth: 1,
        borderColor: "grey",
        paddingVertical: 20
      }}>
      <Text style={{color: "black"}}>{otherUser?.firstName ?? item._id}</Text>
      <Text style={{color: "black"}}>{`Last Message: ${item.last_message ?? ''}`}</Text>
      <Text style={{color: "black"}}>{`At: ${item.last_message_time.toString()}`}</Text>
      <Text style={{color: "black"}}>{otherUser?.is_online ? 'Online' : 'Offline'}</Text>
    </TouchableOpacity>;

  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            // navigation.goBack();
            //TODO:- Logout

            dispatch(logout());
          }}>
          <Text
            style={{color: "black", fontWeight: "bold", marginVertical: 10}}>
            BACK
          </Text>
        </TouchableOpacity>
        <Text style={{color: "black", fontWeight: "bold", marginVertical: 10}}>
          Chat With :
        </Text>
        <FlatList
          extraData={randomKey}
          keyExtractor={(item, index) => item._id}
          // data={userList.length ? userList.filter((item) => {return item.userId != loggedInUser}): [] }
          data={roomsList ?? []}
          renderItem={renderRestaurantRows}
        />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("UsersList");
          }}
          style={styles.newUserChat}>
          <Text style={styles.plusIcon}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, flexDirection: "column", padding: 15},
  subContainer: {marginTop: 100, marginEnd: 15, marginStart: 15},
  textInput: {
    height: 60,
    width: 300,
    borderWidth: 1,
    borderColor: "white",
    marginVertical: 10,
    paddingHorizontal: 10
  },
  touchableStyle: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: "black"
  },
  label: {marginTop: 10},
  newUserChat: {
    width: 50,
    height: 50,
    borderColor: "black",
    backgroundColor: "black",
    borderRadius: 25,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end"
  },
  plusIcon: {
    fontSize: 40,
    textAlign: "center",
    fontWeight: "bold",
    color: "white"
  },
  inputBox: {
    height: 50,
    borderWidth: 1,
    marginTop: 10,
    borderRadius: 25,
    paddingStart: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonTitle: {color: "#ffffff", fontSize: 20}
});

export default Home;
