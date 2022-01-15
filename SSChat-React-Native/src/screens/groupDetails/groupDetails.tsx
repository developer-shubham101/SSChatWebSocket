import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image, FlatList, ListRenderItem, TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from "react-redux";
import {ReducerRoot, RoomList, RoomType, UserList} from "../../type";
import {useRoom} from "../../hooks/useRoom";
import * as t from "../../redux/types";

const GroupDetails = ({navigation}) => {
  const roomData = useSelector<ReducerRoot, RoomList | null | undefined>(state => state.reducer.roomData);
  const {usersList} = useRoom();

  const groupMembers: (UserList | { userId: string })[] = Object.keys(roomData?.users ?? {}).map((item: string) => {
    return usersList?.find((user) => item == user.userId) ?? {userId: item};
  });


  const renderUserRows: ListRenderItem<UserList | { userId: string }> = ({item}) => {
    console.log({item});
    if (item?._id == undefined) {
      return <Text>{'User'}</Text>;
    }

    return <TouchableOpacity
      onPress={() => {
        // console.log('Shubham::::', item);
        // dispatch({type: t.CREATE_ROOM_SUCCESS, payload: item});
        // navigation.navigate("ChatScreen");
      }}
      style={{
        borderBottomWidth: 1,
        borderColor: "grey",
        paddingVertical: 20
      }}>
      <Text style={{color: "black"}}>{item?.firstName ?? item?._id}</Text>
      <Text style={{color: "black"}}>{item?.is_online ? 'Online' : 'Offline'}</Text>
    </TouchableOpacity>;

  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <FastImage style={styles.avatar}
                     source={{uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'}}/>

          <Text style={styles.name}>{roomData?.group_details?.group_name}</Text>
          <Text style={styles.userInfo}>{roomData?.group_details?.about_group}</Text>
          <Text style={styles.userInfo}>{`Total ${roomData?.userList.length} Members`} </Text>
        </View>
      </View>

      <View style={styles.body}>
        <FlatList
          // extraData={randomKey}
          keyExtractor={(item, index) => item._id}
          // data={userList.length ? userList.filter((item) => {return item.userId != loggedInUser}): [] }
          data={groupMembers}
          renderItem={renderUserRows}
        />

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    backgroundColor: "#DCDCDC",
  },
  headerContent: {
    padding: 30,
    alignItems: 'center',
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    color: "#000000",
    fontWeight: '600',
  },
  userInfo: {
    fontSize: 16,
    color: "#778899",
    fontWeight: '600',
  },
  body: {
    backgroundColor: "#778899",
  },
  item: {
    flexDirection: 'row',
  },
  infoContent: {
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: 5
  },
  iconContent: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 5,
  },
  icon: {
    width: 30,
    height: 30,
    marginTop: 20,
  },
  info: {
    fontSize: 18,
    marginTop: 20,
    color: "#FFFFFF",
  }
});


export default GroupDetails;
