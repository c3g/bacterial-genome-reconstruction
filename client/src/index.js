import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import App from './components/App';
import store from './store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import './detect-platform';

const render = Component =>
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <Component />
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  );

render(App)

if (module.hot) {
  module.hot.accept('./components/App', () => {
    const NextApp = require('./components/App')
    render(NextApp)
  })
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
