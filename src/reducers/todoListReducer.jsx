'use strict';
import {
    handleActions
} from 'redux-actions';

// {
//     todoListState: {
//         dataSource: [],
//         finishIds: []
//     }
// }

export const stateName = 'todoListState';


export default handleActions({
    // key 全局都不能 重复
    'clear/store': ()=>{
        return {};
    },
    'get/todo/list': (state, action) => {
        return {
            ...state,
            dataSource: action.data
        }
    },
    'add/todo/item': (state, action) => {
        let dataSource = [...state.dataSource];
        dataSource.push({
            id: dataSource.length + 1,
            text: action.value
        })
        return {
            ...state,
            dataSource: dataSource
        }
    },
    'add/finish/item': (state, action) => {
        // let finishIds = new Array(state.finishIds)
        // var a = new Object();
        // var b = a;
        // a == b // 地址是一样的
        let finishIds = [...state.finishIds];
        finishIds.push(action.id);
        return {
            ...state,
            finishIds: finishIds
        }
    },
    'remove/finish/item': (state, action) => {
        let finishIds = [...state.finishIds];
        let index = finishIds.indexOf(action.id);
        finishIds.splice(index, 1);
        return {
            ...state,
            finishIds: finishIds
        }
    },
}, {
    dataSource: [],
    finishIds: []
});


