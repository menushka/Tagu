import * as React from 'react';
import { Provider } from 'react-redux';
import store from './store/store';
import Main from './components/Main';

type AppProps = {};

type AppState = {};

export class App extends React.Component<AppProps, AppState> {
  render() {
    return (
      <Provider store={store}>
        <Main />
      </Provider>
    );
  }
}
