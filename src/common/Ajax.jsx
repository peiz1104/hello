/*
 * @Author: pengzhen
 * @Date:   2016-04-20 11:08:49
 * @Last Modified by:   pengzhen
 * @Last Modified time: 2016-12-09 10:51:14
 */
import reqwest from 'reqwest';
import History from 'common/History';
import {
    message
} from 'antd';

function noop() {}
export default function(opt) {
    let call_succ = opt.success || noop;
    let call_error = opt.error || noop;
    opt.method = opt.type || 'post';
    opt.type = opt.dataType || 'json';
    opt = {
        cache: 'false',
        ...opt
    };
    opt.error = noop;
    opt.success = (res) => {
        if (res.isSuccess) {
            call_succ.call(this, res.data,res);
        } else {
            switch (res.statusCode) {
                case 401:
                    // History.push('/login');
                    message.warn(`[401] ${res.message}`);
                    break;
                case 403:
                    message.warn('用户权限验证失败');
                    break;
                case 500:
                    // message.error(res.message);
                    break;
            }
            call_error.call(this, res);
        }
    };
    reqwest(opt);
}
