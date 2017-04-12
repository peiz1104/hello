/*
 * @Author: pengzhen
 * @Date:   2016-12-06 17:42:49
 * @Desc: this_is_desc
 * @Last Modified by:   pengzhen
 * @Last Modified time: 2016-12-07 11:17:36
 */

'use strict';
import './index.less';
import React from 'react';
import {
    Icon
} from 'antd';

export default class TreeList extends React.Component {
    static propTypes = {
        dataSource: React.PropTypes.array,
        renderContent: React.PropTypes.func,
        onLoadData: React.PropTypes.func,
        model: React.PropTypes.object,
    };
    static defaultProps = {
        renderContent: row => row.label,
    };
    defaultModel = {
        id: 'id',
        pId: 'pId',
        label: 'label',
        isLeaf: 'isLeaf',
        children: 'children'
    };
    constructor(props) {
        super(props);
        this.state = {
            openKeys: []
        }
    }
    getModel(data) {
        if (typeof this.props.getModel == 'function') {
            return this.props.getModel(data);
        } else {
            let model = {...this.defaultModel,
                ...this.props.model
            };
            return {
                ...data,
                id: data[model.id],
                pId: data[model.pId],
                label: data[model.label],
                isLeaf: data[model.isLeaf],
                children: data[model.children],
            };
        }
    }
    reloadRow(key) {
        let item = this.refs[key];
        if (item) {
            item.toggleExpand(true);
        }
    }
    getNewTreeData(pid, children) {
        return this._getNewTreeData(this.props.dataSource, pid, children);
    }
    _getNewTreeData(data, pid, children) {
        children = children || [];
        let newData = data.map(item => {
            item = this.getModel(item);
            let newChildren = item.children;
            if (item.id == pid) {
                newChildren = newChildren || [];
                let keys = newChildren.map(child => {
                    child = this.getModel(child);
                    return child.id;
                });
                newChildren = children.map(child => {
                    child = this.getModel(child);
                    let index = keys.indexOf(child.id);
                    if (index !== -1) {
                        child.children = newChildren[index].children
                        return child;
                    } else {
                        return child;
                    }
                });
            } else if (newChildren && newChildren.length > 0) {
                newChildren = this._getNewTreeData(item.children, pid, children);
            }
            item.children = newChildren;
            return item;
        })
        return newData;
    }
    handleSelect(data){
        this.props.onSelect && this.props.onSelect(data.id,data);
    }
    handleItemExpand(data, isOpen, call) {
        let openKeys = [...this.state.openKeys];
        data = this.getModel(data);
        if (isOpen) {
            openKeys.push(data.id);
        } else {
            openKeys = openKeys.filter(key => data.id != key);
        }
        this.setState({
            openKeys
        });
        if (this.props.onLoadData) {
            this.props.onLoadData(data, this.props.isSimpleData ? call : (children) => {
                call();
                return this.getNewTreeData(data.id, children)
            })
        } else {
            call();
        }
    }
    loopData(list = []) {
        let openKeys = this.state.openKeys;
        return list.map(data => {
            // let content = this.props.renderContent(data);
            data = this.getModel(data);
            if (data.isLeaf !== true) {
                return (
                    <TreeItem
                        key={data.id}
                        ref={data.id}
                        hideExpand={this.props.hideExpand}
                        open={openKeys.indexOf(data.id) !== -1}
                        activeKey={this.props.activeKey}
                        onSelect={this.handleSelect.bind(this,data)}
                        onExpand={this.handleItemExpand.bind(this,data)}
                        renderContent={this.props.renderContent}
                    >
                        {data.children && this.loopData(data.children)}
                    </TreeItem>
                )
            } else {
                return (
                    <TreeItem
                        key={data.id}
                        hasChild={false}
                        hideExpand={this.props.hideExpand}
                        active={this.props.activeKey==data.id}
                        onSelect={this.handleSelect.bind(this,data)}
                        onExpand={this.handleItemExpand.bind(this,data)}
                        renderContent={this.props.renderContent}
                    >
                    </TreeItem>
                )
            }
        });
    }
    loopSimpleList(dataSource){
        let pIdMap = {};
        dataSource.map(item => {
            item = this.getModel(item);
            !pIdMap[item.pId] && (pIdMap[item.pId] = []);
            pIdMap[item.pId].push(item);
        });
        console.log(pIdMap)
        return this.loopSimpleData(this.props.rootPId, pIdMap);
    }
    loopSimpleData(pId, map, level) {
        level = level || 0;
        let openKeys = this.state.openKeys;
        let list = map[pId] || [];
        return list.map(data => {
            data = this.getModel(data);
            if (data.isLeaf !== true) {
                return (
                    <TreeItem
                        key={data.id}
                        ref={data.id}
                        level={level}
                        hideExpand={this.props.hideExpand}
                        open={openKeys.indexOf(data.id) !== -1}
                        active={this.props.activeKey==data.id}
                        onSelect={this.handleSelect.bind(this,data)}
                        onExpand={this.handleItemExpand.bind(this,data)}
                        renderContent={this.props.renderContent.bind(this,level,data)}>
                        {map[data.id] && this.loopSimpleData(data.id,map,level+1)}
                    </TreeItem>
                )
            } else {
                return (
                    <TreeItem
                        key={data.id}
                        hasChild={false}
                        level = {level}
                        hideExpand={this.props.hideExpand}
                        active={this.props.activeKey==data.id}
                        onSelect={this.handleSelect.bind(this,data)}
                        onExpand={this.handleItemExpand.bind(this,data)}
                        renderContent={this.props.renderContent.bind(this,level,data)}>
                    </TreeItem>
                )
            }
        })
    }
    render() {
        const {
            dataSource = []
        } = this.props;
        let content = undefined;
        if (this.props.isSimpleData) {
            content = this.loopSimpleList(dataSource);
        } else {
            content = this.loopData(dataSource);
        }
        let className = 'tree-list';
        className += this.props.className ? ' ' + this.props.className : '';
        // className += this.props.hideExpand ? ' hide-expand':'';
        return (
            <div className={className}>{content}</div>
        );
    }
}

export class TreeItem extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
        onExpand: React.PropTypes.func,
    };
    static defaultProps = {
        onExpand: function(call) {
            call();
        }
    };
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            open: props.children && props.children.length,
        }
    }

    toggleExpand(isOpen,e) {
        if (this.state.loading) return;
        if (isOpen) {
            this.setState({
                loading: true
            });
        }
        this.props.onExpand(isOpen, () => {
            // 展开
            this.setState({
                loading: false,
                open: true,
            });
        })
        e.stopPropagation();
    }
    render() {
        let {
            loading
        } = this.state;
        const open = this.props.open;
        let showExpand = !this.props.hideExpand && this.props.hasChild !== false;
        // let hasChild = this.props.hasChild !== false;
        let className = showExpand ? 'tree-list-item has-child' : 'tree-list-item';
        className+=(this.props.active?' active':'');
        let icon = loading && <Icon type='loading' spin /> ||
            open && <Icon type='minus' /> || <Icon type='plus' />;

        // 当前节点的状态 open close loading
        let status = loading && 'loading' || !open;
        return (
            <div className="tree-list-item-wrapper">
                <div className={className}>
                    {showExpand &&
                        <a className="expand-btn"
                            onClick={this.toggleExpand.bind(this,!open)}>
                            {icon}
                        </a>}
                    <div onClick={this.props.onSelect} className="tree-list-item-content">
                        {this.props.renderContent(status,this.toggleExpand.bind(this,!open))}
                    </div>
                </div>
                {open && <div className="tree-list-child">{this.props.children}</div>}
            </div>
        );
    }
}
