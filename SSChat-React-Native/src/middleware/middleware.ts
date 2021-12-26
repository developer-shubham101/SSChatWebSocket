import * as actions from '../modules/websocket';
import * as t from '../redux/types';
import {appOptions} from "../config/appOptions";

const socketMiddleware = () => {
  let socket: WebSocket | null = null;
  const onOpen = store => event => {
    store.dispatch(actions.wsConnected(event.target.url));
  };

  const onClose = (store) => (e) => {
    console.log('socket closed', e);

    store.dispatch(actions.wsDisconnected());
    setTimeout(() => {
      store.dispatch(actions.wsConnect(appOptions.apiUrl));
    }, 3000);
  };

  const onMessage = store => event => {
    const payload = JSON.parse(event.data);
    console.log('payload========', payload);
    switch (payload.type) {
      case 'loginOrCreate':
        store.dispatch({type: t.USER_LOGIN_OR_SIGNUP, payload: payload.data});
        break;
      case 'allUsers':
        store.dispatch({type: t.ALL_USER_LIST, payload: payload.data});
        break;
      case 'createRoom':
        console.log('CREATE_ROOM', payload.data.newRoom);
        // store.dispatch({type: t.CHAT_WITH_USER, payload: payload.data.newRoom._id})
        store.dispatch({
          type: t.CREATE_ROOM_SUCCESS,
          payload: payload.data.newRoom,
        });
        break;
      case 'allRooms':
        console.log('Shubham:::', JSON.stringify(payload.data));
        store.dispatch({type: t.ALL_ROOMS_DATA, payload: payload.data});
        break;
      case 'allMessages':
        console.log('allMessages=======================', payload);
        store.dispatch({type: t.ALL_MESSAGE_IN_ROOM, payload: payload.data});
        break;
      case 'roomsModified':
        // store.dispatch({ type: t.MESSAGE_IN_ROOM, payload: payload.data })
        break;
      case 'message':
        console.log('message=======================', payload);
        payload.statusCode == 200
          ? store.dispatch({type: t.ALL_MESSAGE_IN_ROOM, payload: payload.data})
          : payload.statusCode == 201 &&
          store.dispatch({type: t.MESSAGE_IN_ROOM, payload: payload.data});
        break;
      case 'userModified':
        store.dispatch({type: t.USER_MODIFY, payload: payload.data});
        break;
      default:
        break;
    }
  };

  return (store) => (next) => (action) => {
    switch (action.type) {
      case 'WS_CONNECT':
        if (socket !== null) {
          socket.close();
        }
        console.log('host', action.host);
        // connect to the remote host
        socket = new WebSocket(action.host);

        // console.log({socket});

        // websocket handlers
        socket.onmessage = onMessage(store);
        socket.onclose = onClose(store);
        socket.onopen = onOpen(store);

        break;
      case 'WS_DISCONNECT':
        if (socket !== null) {
          socket.close();
        }
        socket = null;

        break;
      case 'LOGIN_USER':
        socket.send(JSON.stringify(action.payload));
        break;
      case 'GET_ALL_USERS':
        socket.send(JSON.stringify(action.payload));
        break;
      case 'CREATE_ROOM':
        // console.log("REQUEST_DATA",action.payload);
        socket.send(JSON.stringify(action.payload));
        break;
      case 'SEND_MESSAGE':
        socket.send(JSON.stringify(action.payload));
        break;
      case 'MAKE_MOVE':
        socket.send(
          JSON.stringify({
            command: 'MAKE_MOVE',
            move: action.move,
            victim: action.victim,
          }),
        );
        break;
      default:
        return next(action);
    }
  };
};

export default socketMiddleware();
