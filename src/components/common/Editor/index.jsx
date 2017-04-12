/*
 * @Author: pengzhen
 * @Date:   2016-11-22 10:17:52
 * @Desc: this_is_desc
 * @Last Modified by:   pengzhen
 * @Last Modified time: 2016-11-29 17:45:25
 */

'use strict';
import React from 'react';
import { createElement } from 'common/utils/dom';
import { getRealPath } from 'common/Img';
import wangeditor from './wangEditor/js/wangEditor.js';
import FileUpload from 'common/FileUpload';
// 阻止输出log
wangEditor.config.printLog = false;
export default class index extends React.Component {
    static propTypes = {
        onChange: React.PropTypes.func
    };
    static defaultProps = {
        onChange: function(){}
    };
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        let _self = this;
        var editor = new wangEditor(this.editorDom);
        this.editor = editor;
        // 普通的自定义菜单
        editor.config.menus = [
            'source',
            '|',
            'bold',
            'underline',
            'italic',
            'strikethrough',
            'eraser',
            'forecolor',
            'bgcolor',
            '|',
            'quote',
            'fontsize',
            'head',
            'unorderlist',
            'orderlist',
            'alignleft',
            'aligncenter',
            'alignright',
            '|',
            'link',
            'table',
            'img',
            '|',
            'undo',
            'redo',
            'fullscreen'
        ];
        editor.config.menuFixed = false;
        // 上传图片（举例）
        // editor.config.uploadImgFileName = 'file';
        // editor.config.uploadImgUrl = '/qm/upload/file/img/editor/upload';

        editor.config.customUpload = true;
        // 自定义上传的init事件
        editor.config.customUploadInit = function () {
            let btn = document.getElementById(editor.customUploadBtnId);
            btn.onclick = ()=>{
                let input = selectFile();
                input.onchange = (e)=>{
                    let file = e.target.files[0];
                    
                    FileUpload.upload({
                        name: 'file',
                        action: '/qm/upload/file/img/editor/upload',
                        files: [file],
                        onSuccess: (res)=>{
                            editor.hideUploadProgress(0);
                            editor.command(null, 'insertHtml',
                                '<img src="' + res.previewPath + '" alt="' + file.name + '" style="max-width:100%;"/>');
                        },
                        onProgress: (pre)=>{
                            editor.showUploadProgress(pre);
                        }
                    });
                    document.body.removeChild(input);
                }
            };
        };
        // 配置自定义参数（举例）
        // editor.config.uploadParams = {
        //     token: 'abcdefg',
        //     user: 'wangfupeng1988'
        // };

        // 设置 headers（举例）
        // editor.config.uploadHeaders = {
        //     'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarylaoppwcEfyY6l7Ag'
        // };

        // 隐藏掉插入网络图片功能。该配置，只有在你正确配置了图片上传功能之后才可用。
        // editor.config.hideLinkImg = true;
        // 自定义load事件
        // editor.config.uploadImgFns.onload = function (resultText, xhr) {
        //     console.log(resultText,xhr)
        //     try{
        //         // resultText 服务器端返回的text
        //         // xhr 是 xmlHttpRequest 对象，IE8、9中不支持
        //         let res = JSON.parse(resultText);

        //         // 上传图片时，已经将图片的名字存在 editor.uploadImgOriginalName
        //         var originalName = editor.uploadImgOriginalName || '';
                
        //         // 如果 resultText 是图片的url地址，可以这样插入图片：
        //         editor.command(null, 'insertHtml',
        //             '<img src="' + getRealPath(res.url) + '" alt="' + originalName + '" style="max-width:100%;"/>');
        //         // 如果不想要 img 的 max-width 样式，也可以这样插入：
        //         // editor.command(null, 'InsertImage', resultText);
        //     }catch(e){
        //         console.error(e);
        //     }
        // };

        // // 自定义timeout事件
        // editor.config.uploadImgFns.ontimeout = function (xhr) {
        //     // xhr 是 xmlHttpRequest 对象，IE8、9中不支持
        //     alert('上传超时');
        // };

        // // 自定义error事件
        // editor.config.uploadImgFns.onerror = function (xhr) {
        //     // xhr 是 xmlHttpRequest 对象，IE8、9中不支持
        //     alert('上传错误');
        // };

        editor.onchange = function () {
            // 编辑区域内容变化时，实时打印出当前内容
            // console.log(this.$txt.html());
            _self.props.onChange(this.$txt.html());
        };
        editor.create();
        if(this.props.value){
            editor.$txt.html(this.props.value);
        }
    }
    componentWillUnmount() {
        this.editor.destroy();
    }
    render() {
        return (
            <div className="editor-container" style={{ height: this.props.height}}>
                <div
                    ref={ref=>{ this.editorDom = ref; }}
                    style={{ height: '100%'}}>
                </div>
            </div>
        );
    }
}


function selectFile(){
    let input = createElement('<input accept="image/jpg,image/jpeg,image/png" style="position: fixed;z-index: -1000;visibility: hidden;" type="file" />');
    document.body.appendChild(input);
    input.click();
    return input;
}