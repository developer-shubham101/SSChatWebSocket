import {useNavigation} from '@react-navigation/native';
import * as t from './types';


/* LOGIN OR REGISTER */

export const createRoom = (data) => {
  const navigation = useNavigation();
  return async (dispatch) => {

    try {
      dispatch({type: t.CREATE_ROOM_SUCCESS, payload: data});
      navigation.navigate('ChatScreen');
    } catch (e) {
      console.log(e);
    }

  };
};

