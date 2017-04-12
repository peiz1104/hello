/*
 * @Author: pengzhen
 * @Date:   2016-12-05 17:45:51
 * @Desc: this_is_desc
 * @Last Modified by:   pengzhen
 * @Last Modified time: 2016-12-19 22:16:42
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
    getMarketCateTree,
} from 'actions/commonAction';
const TreeNode = TreeSelect.TreeNode;

function mapStateToProps({common}) {
    return {
        marketCateTree: common.marketCateTree
    };
}

export class MarketCateTree extends React.Component {
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
        const tree = this.props.marketCateTree;
        this.getCateData(tree.rootId);
    }
    // handleChange=(value)=>{
    //     this.setState({
    //         value
    //     });
    //     this.props.onChange && this.props.onChange(value);
    // }
    getCateData(id,call){
        this.props.dispatch(getMarketCateTree(id,call))
    }
    loadCateTree=(node)=> {
        return new Promise((resolve) => {
            this.getCateData(node.props.eventKey,()=>{
                resolve();
            });
        });
    }
    render() {
        const tree = this.props.marketCateTree;
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
)(MarketCateTree)
