/*
* @Author: pengzhen
* @Date:   2016-11-30 17:06:09
* @Desc: this_is_desc
* @Last Modified by:   pengzhen
* @Last Modified time: 2016-11-30 17:06:41
*/

'use strict';
import './index.less';
import React from 'react';
import Dragula from 'react-dragula';

export default class DragList extends React.Component {
    static propTypes = {
        rowKey: React.PropTypes.string.isRequired,
        data: React.PropTypes.array.isRequired,
        disabledFilter: React.PropTypes.func.isRequired,
        onChange: React.PropTypes.func,
    };
    static defaultProps = {
        disabledFilter: function(){ return false; },
        onChange: function(){}
    };
    constructor(props) {
        super(props);
    }
    getAttr(el,name){
        return el.getAttribute(name);
    }
    dragulaDecorator = (componentBackingInstance) => {

        if (componentBackingInstance) {
            let options = {
                revertOnSpill: false,
                removeOnSpill: false,
                invalid: (el, handle)=>{
                    return this.getAttr(el,'data-disabled');
                },
            };
            this.drag = Dragula([componentBackingInstance], options);
            this.drag.on('drop',(el, target, source, sibling)=>{
                const data = this.props.data;
                let cur_index = this.getAttr(el,'data-index'),
                    next_index = sibling && this.getAttr(sibling,'data-index');
                let cur = data[cur_index],
                    next = next_index && data[next_index];
                this.props.onChange({
                    index: cur_index,
                    data: cur,
                },{
                    index: next_index,
                    data: next,
                });
                this.drag.cancel(true);
            });
        }
    }
    renderList(){
        let child = this.props.children;
        const { rowKey, data = [],disabledFilter } = this.props;
        if(Array.isArray(child) && child.length){
            child = child[0];
        }
        return data.map((item,i)=>{
            if(disabledFilter(item,i)){
                return <div
                    key={i}
                    className="drag-item-wrap disabled"
                    data-key={item[rowKey]}
                    data-index={i}
                    data-disabled={true}>
                    {React.cloneElement(child,{
                        data: item,
                        disabled: true
                    })}
                </div>
            }else{
                return <div
                    key={i}
                    className="drag-item-wrap"
                    data-key={item[rowKey]}
                    data-index={i} >
                    {React.cloneElement(child,{ data: item})}
                </div>
            }
        })
    }
    render() {
        const data = this.props.data || [];
        return (
            <div className='drag-list' ref={this.dragulaDecorator} >
                {this.renderList()}
            </div>
        );
    }
}
