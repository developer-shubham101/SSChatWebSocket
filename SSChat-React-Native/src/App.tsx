import React, {useEffect} from 'react';
import {Provider} from 'react-redux';

import Navigator from './navigations/Navigator';

import store from './modules/store';
import {wsConnect} from './modules/websocket';
import {appOptions} from "./config/appOptions";

const App = () => {

  useEffect(() => {
    store.dispatch(wsConnect(appOptions.apiUrl));
  }, []);

  return (
    <Provider store={store}>
      <Navigator/>
    </Provider>

  );
};

export default App;
