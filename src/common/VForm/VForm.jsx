/*
* @Author: pengzhen
* @Date:   2016-11-08 13:00:38
* @Desc: this_is_desc
* @Last Modified by:   pengzhen
* @Last Modified time: 2016-11-30 10:36:33
*/

'use strict';
import React from 'react';
import {
    Form
} from 'antd';
const FormItem = Form.Item;
const createForm = Form.create;


export default class VForm extends Form {}
VForm.defaultProps = {
    prefixCls: 'ant-form',
    onSubmit: function onSubmit(e) {
        e.preventDefault();
    }
};
var eachChildren = (children,type,callback)=>{
    if (!Array.isArray(children)) {
        children = [children]
    }
    children = children.map(function(child,i){
        if (Array.isArray(child)){
            return eachChildren(child,type,callback);
        }else if (typeof child === 'object' && child !== null) {
            const props = { key: i };
            if (child.type === type) {
                child = callback(child);
            }else if(child.props && typeof child.props.children === 'object'){
                props.children = eachChildren(child.props.children,type,callback);
            }
            return React.cloneElement(child, props);
        }else{
            return child;
        }
    }.bind(this));
    return children;
}
VForm.create = function(opt){
    return function(Component){
        let render = Component.prototype.render;
        Component.prototype.render = function(){
            const { getFieldDecorator } = this.props.form;
            return eachChildren(render.call(this),VForm.Item,(child)=>{
                return React.cloneElement(child,{
                    getFieldDecorator
                })
            })[0];
        }
        return createForm(opt)(class extends React.Component {
            render(){
                let form = Validator.getForm(this.props.form);
                return <Component ref={(ref)=>{this.component = ref;}} {...this.props} form={form} />
            }
        });
    }
}


VForm.Item = class extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
        getFieldDecorator: React.PropTypes.func.isRequired,
        ruleType: React.PropTypes.string,
        controlType: React.PropTypes.any,
        valueType: React.PropTypes.string,
        valuePropName: React.PropTypes.string,
        initialValue: React.PropTypes.any,
        trigger: React.PropTypes.string,
        getValueFromEvent: React.PropTypes.func,
        validateTrigger: React.PropTypes.string,
        rules: React.PropTypes.object
    };
    static defaultProps = {
        getFieldDecorator: function(){ return children => children },
        valuePropName: 'value',
    };
    getOptions(props){
        return {
            valuePropName: props.valuePropName,
            valueType: props.valueType,
            initialValue: props.initialValue,
            trigger: props.trigger,
            getValueFromEvent: props.getValueFromEvent,
            validateTrigger: props.validateTrigger,
            rules: props.rules || Validator.RuleType[props.ruleType]
        };
    }
    renderChildren(children){
        let getFieldDecorator = this.props.getFieldDecorator;
        if (!Array.isArray(children)) {
            children = [children]
        }
        if(this.props.controlType){
            return eachChildren(children,this.props.controlType,(child,i)=>{
                if(child.props.name){
                    return React.cloneElement(getFieldDecorator(
                        child.props.name,
                        this.getOptions(this.props)
                    )(child),{
                        key: i
                    });
                }else{
                    return child;
                }
            })
        }else{
            return children.map((child,i)=>{
                if(child.props.name){
                    return React.cloneElement(getFieldDecorator(
                        child.props.name,
                        this.getOptions(this.props)
                    )(child),{
                        key: i
                    });
                }else{
                    return child;
                }
            });
        }
    }
    render(){
        let props = {...this.props};
        Object.keys(VForm.Item.propTypes).forEach(k=>delete props[k]);
        return <FormItem {...props}>
            {this.renderChildren(this.props.children)}
        </FormItem>
    }
}



const MESSAGES = {
    trim: '该参数不能全为空格',
    required: '该参数不能为空',
    replaceNull:'该参数包含空格',
    email: '请输入有效的电子邮件地址',
    url: '请输入有效的网址',
    date: '请输入有效的日期',
    dateISO: '请输入有效的日期 (YYYY-MM-DD)',
    number: '请输入有效的数字',
    digits: '只能输入数字',
    maxLength: '最多可以输入 {value} 个字符',
    minLength: '最少要输入 {value} 个字符',
    rangeLength: '请输入长度在 {min} 到 {max} 之间的字符串',
    range: '请输入范围在 {min} 到 {max} 之间的数值',
    max: '请输入不大于 {value} 的数值',
    min: '请输入不小于 {value} 的数值',
    password: '密码格式不正确',/*(6~14位字母与数字的组合)*/
    phone: '请输入正确的手机号码',
    english:'请输入英文字母',
    realName:'姓名格式不正确(中文或者英文)'
}

function isNull(value){
    return !value && value!==0 && typeof value!=='boolean'?true:false;
}

const METHODS = {
    trim: function( value ) {
        return (typeof value != 'string') || isNull(value) || (value || '').trim().length > 0;
    },
    required: function( value ) {
        return !isNull(value) && value.trim().length > 0;
    },
    replaceNull: function( value ){
         return isNull(value) || value.length==value.replace(/\s/g,'').length;
    },
    email: function( value ) {
        return isNull(value) || /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test( value );
    },
    phone: function(value){
        return isNull(value) || /^1((3[0-9]|4[57]|5[0-35-9]|7[0678]|8[0-9])\d{8}$)/.test( value );
    },
    url: function( value ) {
        return isNull(value) || /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test( value );
    },
    date: function( value ) {
        return isNull(value) || !/Invalid|NaN/.test( new Date( value ).toString() );
    },
    dateISO: function( value ) {
        return isNull(value) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test( value );
    },
    number: function( value ) {
        return isNull(value) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test( value );
    },
    digits: function( value ) {
        return isNull(value) || /^\d+$/.test( value );
    },
    minLength: function( value, param ) {
        return isNull(value) || value.length >= param['value'];
    },
    maxLength: function( value, param ) {
        return isNull(value) || value.length <= param['value'];
    },
    rangelength: function( value, param ) {
        return isNull(value) || ( value.length >= param['min'] && value.length <= param['max'] );
    },
    min: function( value, param ) {
        return isNull(value) || value >= param['value'];
    },
    max: function( value, param ) {
        return isNull(value) || value <= param['value'];
    },
    range: function( value, param ) {
        return isNull(value) || ( value >= param['min'] && value <= param['max'] );
    },
    password: function(value,param){
        return isNull(value) || /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,14}$/.test( value );
    },
    english:function(value,param){
        return isNull(value) || /^([a-zA-Z]+)$/.test( value );
    },
    realName:function(value,param){
        return isNull(value) || /^([\u4e00-\u9fa5]+|([a-zA-Z]+\s?)+)$/.test( value );
    }
}
function MSG(msg,param){
    if(typeof param === 'object'){
        for(const prop in param){
            const re =new RegExp('{'+prop+'\\}','gim');
            msg = msg.replace(re,param[prop]);
        }
    }else{
        const re =new RegExp('{0\\}','gim');
        msg = msg.replace(re,param);
    }
    return msg;
}
let Validator = function (validator){
    this.getRule = function(params){
        let other = {};
        if(typeof params === 'string'){
            other.message = params;
        }else if(typeof params === 'object'){
            other = params;
        }
        return { ...other,validator:validator }
    }
};


VForm.regist = function(key,validator){
    let v = new Validator(validator);
    Validator.set(key,v);
}

VForm.registRuleType = function(name,type){
    Validator.RuleType[name] = type;
}



Validator.RuleType = {};
Validator.MAP = {};
Validator.set = function(key,v){
    Validator.MAP[key] = v;
}
Validator.get = function(key){
    return Validator.MAP[key];
}
Validator.getRule = function(key,params){
    let v = Validator.get(key);
    if(v){
        return v.getRule(params);
    }
}
Validator.getForm = function(form){
    return {
        ...form,
        getFieldDecorator(name,opts={}){
            const { getFieldDecorator } = form;
            let newRules = [];
            let valueType = opts.valueType;
            opts.rules = opts.rules || {};
            if(opts.rules.ruleType){
                opts.rules = {
                    ...Validator.RuleType[opts.rules.ruleType],
                    ...opts.rules
                };
                delete opts.rules.ruleType;
            }
            Object.keys(opts.rules).map(k => {
                let params = opts.rules[k];
                if(params) {
                    if(k == 'validator') {
                        newRules.push({ validator: params });
                    }else if(k == 'required' && params){
                        newRules.push({ required: true, message: params || '该参数不能为空'});
                        newRules.push(Validator.getRule('trim',params))
                    }else{
                        let rule = Validator.getRule(k,params);
                        if(rule){
                            newRules.push(rule);
                        }else{
                            console.error(`校验规则【${k}】未注册`);
                        }
                    }
                }
            });
            if(valueType){
                newRules = newRules.map(r=>{
                    r.type = valueType;
                    return r;
                });
            }
            opts.rules = newRules;
            return getFieldDecorator(name,opts)
        }
    }
}

Object.keys(METHODS).forEach(k => {
    let method = METHODS[k];
    let defaultMsg = MESSAGES[k];
    VForm.regist(k,function(params,value,call){
        if(method(value,params)){
            call()
        }else{
            let message = params.errorMsg || defaultMsg;
            message = MSG(message,params);
            call(new Error(message));
        }
    })
})
