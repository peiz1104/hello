/*
 * @Author: pengzhen
 * @Date:   2016-12-05 17:45:51
 * @Desc: this_is_desc
 * @Last Modified by:   pengzhen
 * @Last Modified time: 2016-12-19 14:40:47
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
    getCateTree,
} from 'actions/commonAction';
const TreeNode = TreeSelect.TreeNode;

function mapStateToProps({common}) {
    return {
        cateTree: common.cateTree
    };
}

export class CateTree extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
        type: React.PropTypes.oneOf(['C','E','S','A','H','L','O','P','Q']).isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            value: props.defaultValue
        }
    }
    componentWillMount() {
        const tree = this.props.cateTree;
        this.getCateData(tree.rootId);
    }
    // handleChange=(value)=>{
    //     this.setState({
    //         value
    //     });
    //     this.props.onChange && this.props.onChange(value);
    // }
    getCateData(id,call){
        this.props.dispatch(getCateTree(id,this.props.type,call))
    }
    loadCateTree=(node)=> {
        return new Promise((resolve) => {
            this.getCateData(node.props.eventKey,()=>{
                resolve();
            });
        });
    }
    render() {
        const tree = this.props.cateTree[this.props.type] || {};
        return (
            <TreeSelect
                showCheckedStrategy={TreeSelect.SHOW_PARENT}
                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                loadData={this.loadCateTree}
                treeData={tree.data || []}
                treeDataSimpleMode = {tree.treeDataSimpleMode}
                {...this.props}
            />
        );
    }
}

export default connect(
    mapStateToProps,
    // Implement map dispatch to props
)(CateTree)
