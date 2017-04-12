import React, { Component, PropTypes } from 'react';

class Demo extends Component {
    // 构造函数
    constructor(props) {
        super(props);
        console.log(1, 'constructor')
        this.state = {
            num: 0
        }
    }
    // 组件初始化完成前
    componentWillMount() {
        console.log(2, 'componentWillMount')
    }
    // 组件初始化完成后，dom已生成
    componentDidMount() {
        console.log(3, 'componentDidMount')
    }

    // 当属性修改时触发
    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps')
    }

    // 当属性或者状态被修改的时候触发，用来计算组件是否需要重新渲染
    shouldComponentUpdate(nextProps, nextState) {
        console.log('shouldComponentUpdate')
        return true;
    }

    // 开始更新渲染之前
    componentWillUpdate(nextProps, nextState) {
        console.log('componentWillUpdate')
    }

    // 更新渲染结束之后
    componentDidUpdate(prevProps, prevState) {
        console.log('componentDidUpdate')
    }

    // 组件被销毁前
    componentWillUnmount() {
        console.log('componentWillUnmount')
    }
    add = () => {
        this.setState({
            num: this.state.num + 1
        });
    }
    render() {
        console.log('render')
        return (
            <div>
                <h1>NUM : {this.state.num} <button style={{ background: '#388ecb', color: '#fff',padding: 10 }} onClick={this.add}>add</button></h1>
            </div>
        );
    }
}

export default Demo;