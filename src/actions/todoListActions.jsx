import ajax from 'common/Ajax';

// {
//     isSuccess: false,
//     message: '',
//     data: {

//     }
// }
// isSuccess
// ajax({
//     url: '/qm/api/v5/login',
//     data: {

//     },
//     success(data){

//     },
//     error(res){
//         message.error(res.message)
//     }
// })


export function getTodoList() {
    return function (dispatch) {
        // 模拟ajax
        setTimeout(function() {
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
            // dispatch({
            //     type: '123',
            //     name: '1234',
            //     name2: '1234',
            // })
            dispatch({
                type: 'get/todo/list', // 在reducer中写的key
                data: data
            })
        }, 1000);
    }
}

export function toggleItemStatus(id,status) {
    return function (dispatch) {
        if(status){
            dispatch({
                type: 'add/finish/item',
                id: id
            })
        }else{
            dispatch({
                type: 'remove/finish/item',
                id: id
            })
        }
    }
}

export function addTodoItem(text) {
    return function (dispatch) {
        dispatch({
            type: 'add/todo/item',
            value: text
        })
    }
}