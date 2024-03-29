export const wsConnect = (host: any | undefined) => ({type: 'WS_CONNECT', host: host});
export const wsConnecting = (host: any | undefined) => ({type: 'WS_CONNECTING', host});
export const wsConnected = (host: any | undefined) => ({type: 'WS_CONNECTED', host});
export const wsDisconnect = (host: any | undefined) => ({type: 'WS_DISCONNECT', host});
export const wsDisconnected = (host: any | undefined) => ({type: 'WS_DISCONNECTED', host});
export const wsLoginUser = (payload: any) => ({type: 'LOGIN_USER', payload});
export const wsGetAllUsers = (payload: any) => ({type: 'GET_ALL_USERS', payload});
export const wsGetAllRooms = (payload: any) => ({type: 'GET_ALL_USERS', payload});
export const wsCreateRoom = (payload: any) => ({type: 'CREATE_ROOM', payload});
export const wsSendMessage = (payload: any) => ({type: 'SEND_MESSAGE', payload});
export const wsGetAllMessages = (payload: any) => ({type: 'SEND_MESSAGE', payload});
