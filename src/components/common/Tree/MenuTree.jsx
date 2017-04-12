/*
 * @Author: pengzhen
 * @Date:   2016-12-05 17:45:51
 * @Desc: this_is_desc
 * @Last Modified by:   pengzhen
 * @Last Modified time: 2016-12-12 13:44:31
 */

'use strict';
import './MenuTree.less';
import React from 'react';
import {
    connect
} from 'react-redux';
import TreeList from 'components/common/Tree/';
import {
    Icon
} from 'antd';
import {
    getCateTree,
} from 'actions/commonAction';

function mapStateToProps({common}) {
    return {
        cateTree: common.cateTree
    };
}
export class MenuTree extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            activeKey: undefined
        }
    }
    componentWillMount() {
        const tree = this.props.cateTree;
        this.getCateData(tree.rootId);
    }
    getActiveKey(){
        return this.props.activeKey !== undefined ? this.props.activeKey : this.state.activeKey;
    }
    handleSelect=(key,row)=>{
        if(this.props.activeKey === undefined){
            this.setState({
                activeKey: key
            });
        }
        this.props.onSelect && this.props.onSelect(key,row);
    }
    handleLoadData=(row,call)=>{
        this.getCateData(row.id,call);
    }
    getCateData(id,call){
        this.props.dispatch(getCateTree(id,this.props.cateType,call))
    }
    renderNodeContent=(level,row,status,toggleExpand)=>{
        let className = 'menu-item-content'+(this.state.activeKey==row.id?' active':'');
        let icon = status == 'loading' && <Icon type='loading' spin /> ||
                status !== true && <Icon type="up" /> || <Icon type="down" />
        return (
            <div style={{marginLeft: 20*level}}
                className={className}>
                {row.name}
                {!row.isLeaf &&
                    <span className="menu-arrow" onClick={toggleExpand}>{icon}</span>}
            </div>
        );
    }
    render() {
        const tree = this.props.cateTree[this.props.cateType] || {};
        let root = tree.root || {};
        return (
            <div className='menu-tree-wrapper'>
                <div className="menu-tree-title"
                    onClick={this.handleSelect.bind(this,null)}>{root.name}</div>
                <TreeList
                    className='menu-tree'
                    rootPId={null}
                    getModel={(data)=>{
                        return {
                            ...data,
                            label: data.name,
                            isLeaf: data.isParent == 'false',
                        };
                    }}
                    isSimpleData
                    hideExpand
                    activeKey={this.getActiveKey()}
                    dataSource={tree.data}
                    onSelect={this.handleSelect}
                    onLoadData={this.handleLoadData}
                    renderContent={this.renderNodeContent} />
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    // Implement map dispatch to props
)(MenuTree)
