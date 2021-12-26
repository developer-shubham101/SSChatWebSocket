import React, { useEffect } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import { connect, useSelector } from "react-redux";

import { wsLoginUser } from "../modules/websocket";
import { FCM_TOKEN, REQUEST, TYPE_LOGIN_OR_CREATE } from "./const";
import store from "../modules/store";
import { SafeAreaView } from "react-native-safe-area-context";

const STATIC_USER_LIST = [{
  userId: "1",
  "userEmail": "anil@yopmail.com",
  "userName": "Anil",
  "password": "123456"
}, {
  userId: "2",
  "userEmail": "amit@yopmail.com",
  "userName": "amit",
  "password": "123456"
}, {
  userId: "3",
  "userEmail": "shubham@yopmail.com",
  "userName": "shubham",
  "password": "123456"
}, {
  userId: "4",
  "userEmail": "nikunj@yopmail.com",
  "userName": "nikunj",
  "password": "123456"
}, {
  userId: "5",
  "userEmail": "samreen@yopmail.com",
  "userName": "samreen",
  "password": "123456"
}];


const Login = ({
  navigation

}) => {
  const loggedInUser = useSelector(state => state.reducer.loggedInUser);
  console.log('SHUBHAM:: loggedInUser', JSON.stringify(loggedInUser));
  useEffect(() => {
    if (loggedInUser) {
      navigation.navigate("Home");
    }
  }, [loggedInUser]);

  const onLoginUser = ({ userId, userEmail, userName, password }) => {
    store.dispatch(wsLoginUser({
      "userId": userId,
      "userName": userEmail,
      "firstName": userName,
      "password": password,
      "fcm_token": FCM_TOKEN,
      "type": TYPE_LOGIN_OR_CREATE,
      "request": REQUEST
    }));

    // navigation.navigate("Home");
    // store.dispatch({ type: LOGGED_IN_USER, payload: userId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>
        Login With
      </Text>
      <FlatList
        data={STATIC_USER_LIST}
        keyExtractor={(item, index) => item.userEmail}
        renderItem={({ item }) => {
          return <TouchableOpacity style={{ borderBottomWidth: 1, borderColor: "grey", paddingVertical: 20 }}
            onPress={() => {
              onLoginUser(item);
            }}><Text>{item.userName}</Text></TouchableOpacity>;
        }} />


    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "column", padding: 15 },
  subContainer: { marginTop: 100, marginEnd: 15, marginStart: 15 },
  label: { marginVertical: 10, fontWeight: "bold" },
  inputBox: {
    height: 50,
    borderWidth: 1,
    marginTop: 10,
    borderRadius: 25,
    paddingStart: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonTitle: { color: "#ffffff", fontSize: 20 }
});


const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, {})(Login);
