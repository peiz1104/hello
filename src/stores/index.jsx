/*
 * @Author: pengzhen
 * @Date:   2016-04-18 15:24:37
 * @Last Modified by:   pengzhen
 * @Last Modified time: 2016-09-06 13:36:48
 */

import {
    createStore,
    applyMiddleware,
    compose,
    combineReducers
}
from 'redux'
import middleware from './middleware';
import reducers from '../reducers/'

//redux 存放路由

var finalCreateStore = compose(
    applyMiddleware.apply(this, middleware),
    (process.env.NODE_ENV !== 'production' && window.devToolsExtension )
    ? window.devToolsExtension() : f => f
)(createStore);


export default finalCreateStore(reducers);
