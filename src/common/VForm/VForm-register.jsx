/*
* @Author: pengzhen
* @Date:   2016-11-09 14:35:51
* @Desc: this_is_desc
* @Last Modified by:   pengzhen
* @Last Modified time: 2016-11-09 15:36:23
*/

import Form from './VForm.jsx';

// 用户名验证
Form.registRuleType('username',{
    required: '账号不能为空',
})


// 密码验证
Form.registRuleType('password',{
    required: '密码不能为空',
    minLength: { value: 6,errorMsg: '密码长度不低于6位' }
    // password: "密码格式不正确",/*(6~14位字母与数字的组合)*/
})

// 分数验证
Form.registRuleType('score',{
    required: '分数不能为空',
    number: '分数必须是数字',
    min: { value: 0,errorMsg: '分数不能小于0' }
})
// 时长验证
Form.registRuleType('duration',{
    required: '时长不能为空',
    number: '时长必须是数字',
    min: { value: 0,errorMsg: '时长不能小于0' }
})

