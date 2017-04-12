// 导入样式文件
import './index.less';
import React, { Component } from 'react';

// ALL：全部，FINISH: 已完成，UNDO: 未完成
const ActiveTypes = ['ALL', 'UNDO', 'FINISH'];



/**
 * TodoList 待办事项列表
 */
class TodoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [], // 列表数据源
            activeType: ActiveTypes[0], // 当前选中的筛选类型
            finishIds: [],
            inputValue: ''
        }
    }

    componentWillMount() {
        setTimeout(() => {
            const data = [
                { id: 1, text: 'TODO ITEM 1' },
                { id: 2, text: 'TODO ITEM 2' },
                { id: 3, text: 'TODO ITEM 3' },
                { id: 4, text: 'TODO ITEM 4' },
                { id: 5, text: 'TODO ITEM 5' },
                { id: 6, text: 'TODO ITEM 6' },
                { id: 7, text: 'TODO ITEM 7' },
                { id: 8, text: 'TODO ITEM 8' }
            ];
            this.setState({
                dataSource: data
            });
        }, 1000)
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
        this.setState({
            activeType: type
        });
    }
    /**
     * 点击单个Item,修改item状态
     */
    handleClickItem = (data, status) => {
        let finishIds = [...this.state.finishIds];
        if (status) { // 变为已完成状态
            finishIds.push(data.id);
        } else { // 变成未完成状态
            // finishIds.remove(data.id);
            let index = finishIds.indexOf(data.id);
            finishIds.splice(index, 1);
        }
        this.setState({
            finishIds: finishIds
        });
    }
    /**
     * 创建新的todo-item
     */
    handleCreate = () => {
        const inputValue = this.state.inputValue;
        if (inputValue) {
            let dataSource = [...this.state.dataSource];
            dataSource.push({
                id: dataSource.length + 1,
                text: inputValue
            })
            this.setState({
                dataSource: dataSource,
                inputValue: ''
            });
        }else{
            alert('内容不能为空')
        }
    }
    /**
     * 数据筛选
     */
    dataSourceFilter(data) {
        let newData = [];
        const { activeType, finishIds } = this.state;
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
        return (
            <div className="tool-bar">
                {ActiveTypes.map(type =>
                    <button key={type}
                        className={type == activeType ? 'active' : ''}
                        onClick={this.handleChangeType.bind(this, type)} >
                        {type}
                    </button>
                )}
            </div>
        )
    }
    /**
     * 渲染列表
     */
    renderList() {
        const { dataSource, finishIds } = this.state;
        const newData = this.dataSourceFilter(dataSource);
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
                    {this.renderNewBox()}
                    {this.renderList()}
                </div>
            </div>
        );
    }
}

export default TodoList;


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
