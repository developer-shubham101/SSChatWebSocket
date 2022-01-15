import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../components/Login';
import Home from '../components/Home';
import ChatScreen from '../screens/chat/ChatScreen';
import UsersList from '../components/UsersList';
import {ContactsScreen} from '../components/ContactsScreen';
import {checkLogin} from "../redux/action";
import {useDispatch, useSelector} from "react-redux";
import {ReducerRoot, UserList} from "../type";
import store from "../modules/store";
import {wsSendMessage} from "../modules/websocket";
import {REQUEST_CREATE_CONNECTION, TYPE_CREATE_CONNECTION} from "../components/const";
import _ from 'lodash';
import UserProfileView from "../screens/profileScreen/profile";
import GroupDetails from "../screens/groupDetails/groupDetails";
import {ROUTS_LIST} from "./routsList";

const Stack = createStackNavigator();

const Navigator = () => {
  const loggedInUser = useSelector<ReducerRoot, UserList | null | undefined>(state => state.reducer.loggedInUser);

  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(checkLogin());
  }, []);

  /* useEffect(() => {
    setTimeout(() => {
      if (loggedInUser != null) {
        store.dispatch(wsSendMessage(
          {
            "request": REQUEST_CREATE_CONNECTION,
            "type": TYPE_CREATE_CONNECTION,
            "user_id": loggedInUser.userId.toString(),
          },
        ));
      }
    }, 1000);

  }, [loggedInUser]); */


  function PreLogin() {
    return <Stack.Navigator headerMode="none">
      <Stack.Screen name="Login" component={Login}/>
    </Stack.Navigator>;
  }

  function PostLogin() {
    return <Stack.Navigator headerMode="none">
      <Stack.Screen name="Login" component={Login}/>
      <Stack.Screen name="Home" component={Home}/>
      <Stack.Screen name="ContactsScreen" component={ContactsScreen}/>
      <Stack.Screen name="UsersList" component={UsersList}/>
      <Stack.Screen name="ChatScreen" component={ChatScreen}/>
      <Stack.Screen name={ROUTS_LIST.UserProfileView} component={UserProfileView}/>
      <Stack.Screen name={ROUTS_LIST.GroupDetails} component={GroupDetails}/>


    </Stack.Navigator>;
  }

  return (
    <NavigationContainer>
      {/* {_.isEmpty(loggedInUser) && <PreLogin />}
      {!_.isEmpty(loggedInUser) && <PostLogin />} */}

      <PostLogin/>
    </NavigationContainer>
  );
};
export default Navigator;
