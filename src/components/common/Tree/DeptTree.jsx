/*
 * @Author: pengzhen
 * @Date:   2016-12-05 17:45:51
 * @Desc: this_is_desc
 * @Last Modified by:   pengzhen
 * @Last Modified time: 2016-12-20 17:50:16
 */

'use strict';
import React from 'react';
import {
    connect
} from 'react-redux';
import {
    TreeSelect,
} from 'antd';
import {
    getDeptTree,
} from 'actions/commonAction';
const TreeNode = TreeSelect.TreeNode;

function mapStateToProps({common}) {
    return {
        deptTree: common.deptTree
    };
}

export class DeptTree extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            value: props.defaultValue
        }
    }
    componentWillMount() {
        const tree = this.props.deptTree;
        this.getDeptData(tree.rootId,null,null,true);
    }
    // handleChange=(value)=>{
    //     this.setState({
    //         value
    //     });
    //     this.props.onChange && this.props.onChange(value);
    // }
    getDeptData(id,call,url,isNew){
        this.props.dispatch(getDeptTree(id,call,url,isNew))
    }
    loadDeptTree=(node)=> {
        return new Promise((resolve) => {
            this.getDeptData(node.props.eventKey,()=>{
                resolve();
            });
        });
    }
    render() {
        const tree = this.props.deptTree;
        return (
            <TreeSelect
                showCheckedStrategy={TreeSelect.SHOW_PARENT}
                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                loadData={this.loadDeptTree}
                treeData={tree.data}
                treeDataSimpleMode = {tree.treeDataSimpleMode}
                {...this.props}
            />
        );
    }
}

export default connect(
    mapStateToProps,
    // Implement map dispatch to props
)(DeptTree)
