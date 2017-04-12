/**
 * [FileUpload description]
 * files 要上传的文件
 * params 其他提交参数
 *
 * requestHeaders 请求头文件
 * dataType 数据类型
 * onSuccess 成功函数
 * onError 错误函数，后台异常情况
 * onProgress 上传中函数
 */
function noop(){}

let FileUpload = {
    xhrList: [],
    // 上传错误，非上传异常
    onUploadError(error){
        console.error(`【${error.type}】：${error.message}`);
    },
    /*外部调用方法，取消一个正在进行的xhr，传入id指定xhr（doupload时返回）或者默认取消最近一个。*/
    abort(id) {
        this.xhrList[id].abort()
    },
    upload(opts){

        const {
            action,
            name = 'files',
            files,
            formParams,
            params,
            requestHeaders,
            dataType = 'json',
            onSuccess = noop,
            onError = noop,
            onProgress = noop
        } = opts;

        var xhr = new XMLHttpRequest();
        this.xhrList.push(xhr)
        const currentXHRID = this.xhrList.length - 1

        /*这里部分浏览器实现不一致，而且IE没有这个方法*/
        xhr.onprogress = xhr.upload.onprogress = progress => {
            var per = Math.ceil((progress.loaded / progress.total) * 100);
            per = progress.total == 0 ? 100 : per;
            onProgress(per, progress);
        }
        xhr.onreadystatechange = () => {
            /*xhr finish*/
            try {
                if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                    const resp = dataType == 'json' ? JSON.parse(xhr.responseText) : xhr.responseText;
                    onSuccess(resp);
                } else if (xhr.readyState == 4) {
                    // xhr fail
                    const resp = dataType == 'json' ? JSON.parse(xhr.responseText) : xhr.responseText;
                    onError(resp)
                }
            } catch (e) {
                /*超时抛出不一样的错误，不在这里处理*/
                !this.onUploadError({
                    type: 'FINISHERROR',
                    message: e.message
                })
            }
        }
        /*xhr error*/
        xhr.onerror = () => {
            try {
                const resp = dataType == 'json' ? JSON.parse(xhr.responseText) : xhr.responseText;
                this.onUploadError({type: 'XHRERROR', message: resp})
            } catch (e) {
                this.onUploadError({type: 'XHRERROR', message: e.message})
            }
        }
        let formData = new FormData();
        // 添加文件列表到FormData
        files && Object.keys(files).forEach(key => {
            if(key == 'length') return
            formData.append(name, files[key]);
        });
        formParams && Object.keys(formParams).forEach(key => {
            formData.append(key, formParams[key]);
        });
        // 添加其他参数到url
        let paramStr = ''
        if (params) {
            const paramArr = [];
            Object.keys(params).forEach(key => paramArr.push(`${key}=${params[key]}`))
            paramStr = '?' + paramArr.join('&');
        }
        const targeturl = action + paramStr;

        xhr.open('POST', targeturl, true);

        requestHeaders &&
            Object.keys(requestHeaders).forEach(key => xhr.setRequestHeader(key, requestHeaders[key]));

        xhr.send(formData);

        return currentXHRID;
    }
};

module.exports = FileUpload;
