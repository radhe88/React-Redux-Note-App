import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import NoteApp from './NoteApp';

ReactDOM.render(
  <Provider store={store}>
    <NoteApp />
  </Provider>,
  document.getElementById('root')
);
