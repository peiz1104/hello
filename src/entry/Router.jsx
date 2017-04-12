/*
 * @Author: pengzhen
 * @Date:   2016-10-17 19:40:58
 * @Desc: this_is_desc
 * @Last Modified by:   chenjingwei
 * @Last Modified time: 2017-03-02 18:10:02
 */

'use strict';
import React from 'react';
import {
    Provider,
    connect
} from 'react-redux';
import {
    Router,
    Route,
    Redirect
} from 'react-router';
import Demo from './Demo.jsx';
import TodoList from 'components/TodoList';   //没使用redux
import TodoList2 from 'components/TodoList2'; //使用redux
// import * as actions from 'actions/todoListActions';


// 其他文件中
export const LiveRouter = (
    <Route path='/live' component={Layout} >
        <Route path='demo' component={Demo} />
    </Route>
)


export const VideoRouter = (
    <Route path='/video' component={Layout} >
        <Route path='demo' component={Demo} />
    </Route>
)



export default class extends React.Component {
    render() {
        // store 和 redux
        // history 和 router
        return (
            <Provider store={this.props.store}>
                <Router history={this.props.history} >
                    {LiveRouter}
                    {VideoRouter}
                    <Route path='/' component={Layout} >
                        <Route path='demo' component={Demo} />
                        <Route path='todo' component={TodoList} />
                        <Route path='todo2' component={TodoList2} />
                    </Route>
                    <Redirect path='*' to='/demo' />
                </Router>
            </Provider>
        );
    }
}


class Layout extends React.Component {
    render() {
        // this.props.children 固定的
        console.log(this.props)
        return (
            <div>
                <header style={{
                    width:'80%',
                    height:'60px',
                    margin:'0 auto',
                    fontSize:'20px',
                    background:'#f7f7f7',
                    borderRadius:'20px',
                    textAlign:'center',
                    lineHeight:'60px'
                }}>任务管理</header>
                {this.props.children}
            </div>
        );
    }
}
