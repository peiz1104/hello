/*
 * @Author: pengzhen
 * @Date:   2016-10-31 15:57:37
 * @Desc: this_is_desc
 * @Last Modified by:   pengzhen
 * @Last Modified time: 2016-11-30 15:14:18
 */

'use strict';
import './index.less';
import React from 'react';
import { Link } from 'react-router';
import Img from 'common/Img/';
import History from 'common/History';

export default class index extends React.Component {
    static propTypes = {
        name: React.PropTypes.string
    };

    constructor(props) {
        super(props);
        this.state = {
            time: 5
        };
    }
    componentDidMount() {
        this.timer = setInterval(() => {
            this.setState({
                time: this.state.time - 1
            }, () => {
                if (this.state.time == 0) {
                    clearInterval(this.timer);
                    History.push('/')
                }
            });
        }, 1000);
    }
    componentWillUnmount() {
        clearInterval(this.timer);
    }
    render() {
        return (
            <div className='page-404'>
                <div className="content">
                    <h1>404 Page not found</h1>
                    <Link to='/' className="time">返回首页 {this.state.time}</Link>
                </div>
            </div>
        );
    }
}
