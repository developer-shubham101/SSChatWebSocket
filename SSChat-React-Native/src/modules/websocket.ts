export const wsConnect = host => ({type: 'WS_CONNECT', host: host});
export const wsConnecting = host => ({type: 'WS_CONNECTING', host});
export const wsConnected = host => ({type: 'WS_CONNECTED', host});
export const wsDisconnect = host => ({type: 'WS_DISCONNECT', host});
export const wsDisconnected = host => ({type: 'WS_DISCONNECTED', host});
export const wsLoginUser = payload => ({type: 'LOGIN_USER', payload});
export const wsGetAllUsers = payload => ({type: 'GET_ALL_USERS', payload});
export const wsGetAllRooms = payload => ({type: 'GET_ALL_USERS', payload});
export const wsCreateRoom = payload => ({type: 'CREATE_ROOM', payload});
export const wsSendMessage = payload => ({type: 'SEND_MESSAGE', payload});
export const wsGetAllMessages = (payload) => ({type: 'SEND_MESSAGE', payload});

// export const wsCreateRoom = (payload, dispatch) => new Promise((resolve, reject) => {
//     // do anything here
//     dispatch({ type: 'CREATE_ROOM', payload });
//     resolve();
//   })

// const websocketInitialState = {};

// export const websocketReducer = (state = { ...websocketInitialState }, action) => {
//   switch (action.type) {
//     case 'WS_CONNECT':
//       console.log("WS_CONNECT:::", action.host)
//       return { ...state, host: action.host };
//     default:
//       return state;
//   }
// };
