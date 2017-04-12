// 导入样式文件
// 只引入这个组件需要的样式文件
import './index.less';

import React, { Component } from 'react';
import { connect } from 'react-redux'; // redux
// redux 是对状态树的管理，所有组件都能拿到状态树上的值
import { getTodoList, toggleItemStatus, addTodoItem } from 'actions/todoListActions';

// ALL：全部，FINISH: 已完成，UNDO: 未完成
const ActiveTypes = ['ALL', 'UNDO', 'FINISH'];


/**
 * TodoList 待办事项列表
 */
class TodoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeType: ActiveTypes[0], // 当前选中的筛选类型
            inputValue: ''
        }
    }

    componentWillMount() {
        // 一般在这里进行数据请求
        this.props.dispatch(getTodoList());
    }
    /**
     * 修改input的value
     */
    handleChangeInput = (e) => {
        this.setState({
            inputValue: e.target.value
        });
    }
    /**
     * 修改筛选类型
     */
    handleChangeType(type) {
        console.log(type)
        this.setState({
            activeType: type
        });
    }
    /**
     * 点击单个Item,修改item状态
     */
    handleClickItem = (data, status) => {
        this.props.dispatch(toggleItemStatus(data.id,status)); // 变成已结束还是未结束
    }
    /**
     * 创建新的todo-item
     */
    handleCreate = () => {
        const inputValue = this.state.inputValue;
        if (inputValue) {
            this.props.dispatch(addTodoItem(inputValue));
            this.setState({
                inputValue: ''
            });
        } else {
            alert('内容不能为空')
        }
    }
    /**
     * 数据筛选
     */
    dataSourceFilter(data) {
        let newData = [];
        const activeType = this.state.activeType; // 已选择的类型
        const finishIds = this.props.finishIds; // 已完成的任务id
        if (activeType == 'ALL') {
            newData = data;
        } else if (activeType == 'UNDO') {
            data.forEach(item => {
                if (finishIds.indexOf(item.id) == -1) {
                    newData.push(item);
                }
            })
        } else if (activeType == 'FINISH') {
            data.forEach(item => {
                if (finishIds.indexOf(item.id) != -1) {
                    newData.push(item);
                }
            })
        }
        return newData;
    }
    /**
     * 渲染ToolBar
     */
    renderToolBar() {
        const activeType = this.state.activeType;
        // let arr = [];
        // for(var i = 0;i<ActiveTypes.length;i++){
        //     arr.push(<button>{ActiveTypes[i]}</button>)
        // }

        // [1,2,3,4,5].forEach((item,index)=>{

        // })

        // [1,2,3,4,5].map((item,index)=>{
        //     return item+1
        // })
        // // [2,3,4,5,6]
        // function funcA(value) {
        //     console.log(value)
        // }
        // var funcB = funcA.bind(this)
        // var funcC = funcA.bind(this,'name')

        // funcB(123); // 123
        // funcC(123); // name
        // funcB('name',123)
        return (
            <div className="tool-bar">
                {ActiveTypes.map((type,index) =>{
                    return <button key={index}
                        className={type == activeType ? 'active' : ''}
                        onClick={this.handleChangeType.bind(this, type)} >
                        {type}
                    </button>

                })}
            </div>
        )
    }
    /**
     * 渲染列表
     */
    renderList() {

        const { dataSource, finishIds } = this.props;
        const newData = this.dataSourceFilter(dataSource);
        // const newData = dataSource;
        if (newData.length) {
            return newData.map(item =>
                <TodoItem
                    key={item.id}
                    finish={finishIds.indexOf(item.id) != -1}
                    data={item}
                    onClick={this.handleClickItem} />);
        } else {
            return <div className="no-data">没有相关任务</div>
        }
    }
    /**
     * 渲染新建框
     */
    renderNewBox() {
        return (
            <div className="create-box">
                <input type="text" value={this.state.inputValue} onChange={this.handleChangeInput} />
                <button onClick={this.handleCreate}>NEW</button>
            </div>
        )
    }
    render() {
        return (
            <div className='page-todo-list'>
                <h1 className="title">TODO LIST</h1>
                {this.renderToolBar()}
                <div className="content">
                    {/*this.renderNewBox()*/}
                    {this.renderList()}
                </div>
            </div>
        );
    }
}

// 和redux相关
// actions
// reducers

// onClick->dispatch(actions)->reducer(修改状态树)->mapStateToProps(传给组件)->render触发渲染


// 从状态树上取你要的属性
function mapStateToProps(state) {
    console.log(state)
    return {
        dataSource: state.todoListState.dataSource,
        finishIds: state.todoListState.finishIds,
    }
}
export default connect(mapStateToProps)(TodoList);


/**
 * TodoItem
 */
class TodoItem extends Component {
    render() {
        const { data, onClick, finish } = this.props;
        return (
            <div className={'todo-item' + (finish ? ' finish' : '')}
                onClick={onClick.bind(this, data, !finish)}>{data.text}</div>
        );
    }
}
