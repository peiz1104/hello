/*
* @Author: pengzhen
* @Date:   2016-04-18 16:12:38
* @Last Modified by:   pengzhen
* @Last Modified time: 2016-11-15 13:25:21
*/

function clientMiddleware({ dispatch, getState }) {
    // console.log('Enter thunkMiddleware');
    return function(next) {
        // console.log('Function "next" provided:', next);
        return function (action) {
            // console.log('Handling action:', action);
            return typeof action === 'function' ?
                action(dispatch, getState) :
                next(action)
        }
    }
}

// function logger({ getState }) {
//     return (next) => (action) => {
//         // console.log('dispatching', action); // eslint-disable-line
//         const result = next(action);

//         // console.log('next state', getState()); // eslint-disable-line
//         return result;
//     };
// }


export default [
    clientMiddleware
    // logger
]
