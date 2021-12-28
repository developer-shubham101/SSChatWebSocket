import * as t from './types';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {STORAGE_USER_INFO} from "../components/const";


/* LOGIN OR REGISTER */
export const checkLogin = () => async (dispatch) => {
  AsyncStorage.getItem(STORAGE_USER_INFO).then((response: string | null) => {
    if (response) {
      const data = JSON.parse(response);
      dispatch({type: t.USER_LOGIN_OR_SIGNUP, payload: data});
    } else {
      dispatch({type: t.USER_LOGIN_OR_SIGNUP, payload: undefined});
    }

  }).catch((e) => {
    console.trace('Found Error', e);
  });

};



export const logout = () => async (dispatch) => {
  AsyncStorage.removeItem(STORAGE_USER_INFO).then(() => {
    dispatch({type: t.USER_LOGIN_OR_SIGNUP, payload: undefined});
  }).catch((e) => {
    console.trace('Found Error', e);
  });

};
