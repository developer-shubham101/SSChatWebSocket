import {combineReducers} from "redux";
import * as t from "./types";
import {ReducerMain} from "../type";
import {ALL_MESSAGES_LOADING} from "./types";

const INITIAL_STATE = {
  login: undefined,
  loginError: undefined,
  loginLoading: false,
  allRoomsData: undefined,
  roomData: undefined,
  receiversMessages: [],
  messages: [],
  lastMessage: undefined,
  loggedInUser: undefined,
  chatWithUser: undefined,
  userList: [],
  userListError: undefined,
  userListLoading: false,
  allChatLoading: false,
};

export const mainReducer = (state: ReducerMain = INITIAL_STATE, action) => {
  console.log("mainReducer::::", action.type, JSON.stringify(action.payload));
  switch (action.type) {
    case t.USER_LOGIN_OR_SIGNUP:
      return {...state, loggedInUser: action.payload};
    case t.USER_LOGIN_OR_SIGNUP_ERROR:
      return {...state, loginError: action.payload};
    case t.USER_LOGIN_OR_SIGNUP_LOADING:
      return {...state, loginLoading: action.payload};
    case t.ALL_USER_LIST:
      return {...state, userList: action.payload};
    case t.USER_MODIFY: {
      let userList = state.userList;

      for (let i = 0; i < userList.length; i++) {
        if (userList[i].userId.toString() == action.payload.userId.toString()) {
          userList[i] = action.payload;
          break;
        }
      }
      console.log('Shubham::: USER_MODIFY', userList);
      return {...state, userList: [...userList]};
    }
    case t.CREATE_ROOM_SUCCESS:
      console.log("SHubham CREATE_ROOM_SUCCESS", action.payload);
      return {...state, roomData: action.payload};
    case t.ALL_ROOMS_DATA:
      return {...state, allRoomsData: action.payload.roomList, userList: action.payload.userList};
    case t.ROOM_MODIFIED_WITH_MESSAGE:
      return {
        ...state,
        receiversMessages: [...state.receiversMessages, action.payload]
      };
    case t.MESSAGE_IN_ROOM:
      console.log("MESSAGE_IN_ROOM============", action.payload);
      return {
        ...state,
        messages: [...(state?.messages ?? []), action.payload],
        lastMessage: action.payload
      };
    case t.ALL_MESSAGE_IN_ROOM:
      return {
        ...state,
        messages: [...(state?.messages ?? []), ...action.payload],
        allChatLoading: false
      };
    case t.CLEAR_ALL_MESSAGE_IN_ROOM:
      return {...state, messages: []};
    // case t.LOGGED_IN_USER:
    //   return { ...state, loggedInUser: action.payload };
    case t.CHAT_WITH_USER:
      return {...state, chatWithUser: action.payload};
    case t.ALL_MESSAGES_LOADING:
      return {...state, allChatLoading: action.payload};

    case t.ALL_USER_LIST_ERRROR:
      return {...state, userListError: action.payload};
    case t.ALL_USER_LIST_LOADING:
      return {...state, userListLoading: action.payload};
    /*  case 'ACTIVATE_GEOD':
            return action.geod;
        case 'CLOSE_GEOD':
            return {}; */
    default:
      return state;
  }
};

export default combineReducers({
  mainReducer
});
