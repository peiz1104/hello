import React from 'react';
import ReactDOM from 'react-dom';
import History from 'common/History';
import store from '../stores/'
import {
    syncHistoryWithStore
} from 'react-router-redux';
import Router from './Router.jsx';

const history = syncHistoryWithStore(History, store);

ReactDOM.render(
    <Router
      store = { store }
      history = { history }
      />,
    document.getElementById('app'));