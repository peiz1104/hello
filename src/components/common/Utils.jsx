/*
 * @Author: liuyang
 * @Date:   2016-05-03 13:30:43
 * @Desc:   this is desc
 * @Last Modified by:   pengzhen
 * @Last Modified time: 2016-09-21 10:26:04
 */

import {
  message
} from 'antd';
import ajax from 'common/Ajax';
import History from 'common/History';

/**
 * [Number 数字类，可用中文数字转换]
 */
var NumberUtils = {
  ary0: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'],
  ary1: ['', '十', '百', '千'],
  ary2: ['', '万', '亿', '兆'],
  strrev: function(str) {
    str += '';
    var ary = []
    for (var i = str.length; i >= 0; i--) {
      ary.push(str[i])
    }
    return ary.join('');
  },
  parseNum: function(num) {
    var ary = this.strrev(num);
    // console.log(ary)
    var zero = ''
    var newary = ''
    var i4 = -1
    for (var i = 0; i < ary.length; i++) {
      if (i % 4 == 0) { //首先判断万级单位，每隔四个字符就让万级单位数组索引号递增
        i4++;
        newary = Number.ary2[i4] + newary; //将万级单位存入该字符的读法中去，它肯定是放在当前字符读法的末尾，所以首先将它叠加入$r中，
        zero = ''; //在万级单位位置的“0”肯定是不用的读的，所以设置零的读法为空
      }
      //关于0的处理与判断。
      if (ary[i] == '0') { //如果读出的字符是“0”，执行如下判断这个“0”是否读作“零”
        switch (i % 4) {
          case 0:
            break;
            //如果位置索引能被4整除，表示它所处位置是万级单位位置，这个位置的0的读法在前面就已经设置好了，所以这里直接跳过
          case 1:
          case 2:
          case 3:
            if (ary[i - 1] != '0') {
              zero = '零'
            } //如果不被4整除，那么都执行这段判断代码：如果它的下一位数字（针对当前字符串来说是上一个字符，因为之前执行了反转）也是0，那么跳过，否则读作“零”
            break;
        }
        newary = zero + newary;
        zero = '';
      } else { //如果不是“0”
        newary = Number.ary0[parseInt(ary[i])] + Number.ary1[i % 4] + newary; //就将该当字符转换成数值型,并作为数组ary0的索引号,以得到与之对应的中文读法，其后再跟上它的的一级单位（空、十、百还是千）最后再加上前面已存入的读法内容。
      }
    }
    if (newary.indexOf('零') == 0) {
      newary = newary.substr(1)
    } //处理前面的0
    return newary;
  }
};

var UploadUtil = {
  upload: function({
    url,
    name,
    file,
    data,
    onProgress,
    onLoad,
    onError,
    cors,
    withCredentials
  }) {
    var form = new FormData()
    for (var i in file.files) {
      form.append(file.name, file.files[i]);
    }
    for (var i in data) {
      form.append(i, data[i]);
    }
    var xhr = UploadUtil.createCORSRequest('post', url, cors);
    xhr.withCredentials = withCredentials;
    xhr.upload.addEventListener('progress', onProgress, false);
    xhr.onload = onLoad;
    xhr.onerror = onError;

    xhr.send(form);
    return xhr;
  },
  createCORSRequest: function(method, url) {
    var xhr = new XMLHttpRequest()
    if ('withCredentials' in xhr) {
      // XHR for Chrome/Firefox/Opera/Safari.
      xhr.open(method, url, true);
    } else if (typeof XDomainRequest !== 'undefined') {
      // XDomainRequest for IE.
      xhr = new XDomainRequest();
      xhr.open(method, url);
    } else {
      // CORS not supported.
      xhr = null;
    }
    return xhr;
  }
}
var TimeConvert = {
  //时间戳转换为时分秒 HH:mm:SS,根据传过来的format决定返回格式,ymdhms,ymd,hms
  minsCon: function(times, format) {
    if(!times){
      return ;
    }
    var d = new Date(times);
    var HH = d.getHours();
    if (HH < 10) {
      HH = '0' + HH;
    }
    var mm = d.getMinutes();
    if (mm < 10) {
      mm = '0' + mm;
    }
    var ss = d.getSeconds();
    if (ss < 10) {
      ss = '0' + ss;
    }
    var mon = d.getMonth() + 1;
    if (mon < 10) {
      mon = '0' + mon;
    }
    var day = d.getDate();
    if (day < 10) {
      day = '0' + day;
    }
    if (format == 'ymdhms') {
      return d.getFullYear() + '-' + mon + '-' + day + ' ' + HH + ':' + mm + ':' + ss;
    } else if (format == 'hms') {
      return HH + ':' + mm + ':' + ss;
    } else if (format == 'hm') {
      return HH + ':' + mm;
    } else if (format == 'ymd') {
      return d.getFullYear() + '-' + mon + '-' + day;
    } else if (format == 'md') {
      return mon + '月' + day + '日';
    }


  },
  strToDate: function(formatStr, dateStr ) { //格式化日期字符串转换为日期
    if(!dateStr){
      return ;
    }
    var year = 0;
    var start = -1;
    var len = dateStr ? dateStr.length : 0;
    if ((start = formatStr.indexOf('yyyy')) > -1 && start < len) {
      year = dateStr.substr(start, 4);
    }
    var month = 0;
    if ((start = formatStr.indexOf('MM')) > -1 && start < len) {
      month = parseInt(dateStr.substr(start, 2)) - 1;
    }
    var day = 0;
    if ((start = formatStr.indexOf('dd')) > -1 && start < len) {
      day = parseInt(dateStr.substr(start, 2));
    }
    var hour = 0;
    if (((start = formatStr.indexOf('HH')) > -1 || (start = formatStr.indexOf('hh')) > 1) && start < len) {
      hour = parseInt(dateStr.substr(start, 2));
    }
    var minute = 0;
    if ((start = formatStr.indexOf('mm')) > -1 && start < len) {
      minute = dateStr.substr(start, 2);
    }
    var second = 0;
    if ((start = formatStr.indexOf('ss')) > -1 && start < len) {
      second = dateStr.substr(start, 2);
    }
    return new Date(year, month, day, hour, minute, second);
  },
  strToForStr: function(formatStr, dateStr) { //yyyy-MM-dd hh:mm:ss格式字符串转换为指定格式字符串
    if(!dateStr){
      return ;
    }
    let date = this.strToDate('yyyy-MM-dd HH:mm:ss', dateStr);
    let str = this.minsCon(date.getTime(), formatStr);
    return str;
  },
  getTimes: function(startDate, endDate) {
    if(!startDate||!endDate){
      return ;
    }
    let times = this.strToDate('yyyy-MM-dd HH:mm:ss', endDate).getTime() - this.strToDate('yyyy-MM-dd HH:mm:ss', startDate).getTime();
    times = times <= 0 ? 0 : times;
    return times;
  },
  dateDiff: function(strInterval, dtStart, dtEnd) { //计算两个日期之间的差
    if(!dtStart||!dtEnd){
      return ;
    }
    switch (strInterval) {
      case 't':
        return parseInt((dtEnd - dtStart));
      case 's':
        return parseInt((dtEnd - dtStart) / 1000);
      case 'n':
        return parseInt((dtEnd - dtStart) / 60000);
      case 'h':
        return parseInt((dtEnd - dtStart) / 3600000);
      case 'd':
        return parseInt((dtEnd - dtStart) / 86400000);
      case 'w':
        return parseInt((dtEnd - dtStart) / (86400000 * 7));
      case 'm':
        return (dtEnd.getMonth() + 1) + ((dtEnd.getFullYear() - dtStart.getFullYear()) * 12) - (dtStart.getMonth() + 1);
      case 'y':
        return dtEnd.getFullYear() - dtStart.getFullYear();
    }
  },
  secondTohms: function(mins, format) { //秒数转换为时分秒格式
    if(!mins){
      return mins;
    }
    var time = parseInt(mins);
    var hours = parseInt(time / 3600);
    var min = parseInt((time - hours * 3600) / 60);
    var s = parseInt((time - hours * 3600) % 60);
    var text = 's';
    if (parseInt(hours) > 0) {
      text = 'hms';
    } else if (parseInt(min) > 0) {
      text = 'ms';
    }
    if (hours < 10) {
      hours = '0' + hours;
    }
    if (min < 10) {
      min = '0' + min;
    }
    if (s < 10) {
      s = '0' + s;
    }
    if (format == 'hms') { //时分秒
      return hours + ': ' + min + ': ' + s;
    } else if (format == 'ms') { //分秒
      return min + ': ' + s;
    } else if (format == 'zh') {
      if (text == 'hms') {
        return hours + '小时' + min + '分' + s + '秒';
      } else if (text == 'ms') {
        return min + '分' + s + '秒';
      } else {
        return mins + '秒';
      }
    } else if (format == 'english') {
      if (text == 'hms') {
        return hours + ':' + min + ':' + s;
      } else {
        return min + ':' + s;
      }
    }

  }
}


var _eventCompat = function(event) {
  var type = event.type;
  if (type == 'DOMMouseScroll' || type == 'mousewheel') {
    event.delta = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
  }
  //alert(event.delta);
  if (event.srcElement && !event.target) {
    event.target = event.srcElement;
  }
  if (!event.preventDefault && event.returnValue !== undefined) {
    event.preventDefault = function() {
      event.returnValue = false;
    };
  }
  /*
     ......其他一些兼容性处理 */
  return event;
};

var addEvent = (function(window, undefined) {
  if (window.addEventListener) {
    return function(el, type, fn, capture) {
      if (type === 'mousewheel' && document.mozHidden !== undefined) {
        type = 'DOMMouseScroll';
      }
      el.addEventListener(type, fn, capture || false);
    }
  } else if (window.attachEvent) {
    return function(el, type, fn, capture) {
      el.attachEvent('on' + type, fn);
    }
  } else {
    console.error('addEvent 浏览器版本不支持')
  }
})(window);

var removeEvent = (function(window, undefined) {
  if (window.removeEventListener) {
    return function(el, type, fn, capture) {
      if (type === 'mousewheel' && document.mozHidden !== undefined) {
        type = 'DOMMouseScroll';
      }
      el.removeEventListener(type, fn, capture || false);
    }
  } else if (window.detachEvent) {
    return function(el, type, fn, capture) {
      el.detachEvent('on' + type, fn);
    }
  } else {
    console.error('addEvent 浏览器版本不支持')
  }
})(window);
var DocumentUtils = {

  addEvent: addEvent,
  removeEvent: removeEvent,
  addEventListener: function(el, type, fn, capture) {
    addEvent(el, type, fn, capture)
    return {
      remove: function() {
        removeEvent(el, type, fn, capture)
      }
    }
  },
  //获得对象距离页面顶端的距离
  getH: function(obj) {
    var h = 0;
    while (obj) {
      h += obj.offsetTop;
      obj = obj.offsetParent;
    }
    return h;
  },
  //滚动条在Y轴上的滚动距离
  getScrollTop: function() {
    var scrollTop = 0,
      bodyScrollTop = 0,
      documentScrollTop = 0;
    if (document.body) {
      bodyScrollTop = document.body.scrollTop;
    }
    if (document.documentElement) {
      documentScrollTop = document.documentElement.scrollTop;
    }
    scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
    return scrollTop;
  },
  //文档的总高度
  getScrollHeight: function() {
    var scrollHeight = 0,
      bodyScrollHeight = 0,
      documentScrollHeight = 0;
    if (document.body) {
      bodyScrollHeight = document.body.scrollHeight;
    }
    if (document.documentElement) {
      documentScrollHeight = document.documentElement.scrollHeight;
    }
    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
    return scrollHeight;
  },
  //浏览器视口的高度
  getWindowHeight: function() {
    var windowHeight = 0;
    if (document.compatMode == 'CSS1Compat') {
      windowHeight = document.documentElement.clientHeight;
    } else {
      windowHeight = document.body.clientHeight;
    }
    return windowHeight;
  },
  css: function(obj, attr, value) {
    if (value !== undefined) {
      attr == 'opacity' ? (obj.style['filter'] = 'alpha(opacity=' + value * 100 + ')', obj.style[attr] = value) : obj.style[attr] = value;
    } else {
      if (typeof arguments[1] == 'object') {
        for (var i in attr) i == 'opacity' ? (obj.style['filter'] = 'alpha(opacity=' + attr[i] * 100 + ')', obj.style[i] = attr[i]) : obj.style[i] = attr[i];
      } else {
        return obj.currentStyle ? obj.currentStyle[attr] : window.getComputedStyle(obj, null)[attr]
      }
    }
  },
  getStyle: function(obj, prop) {
    var style = obj.currentStyle || window.getComputedStyle(obj, '');
    if (prop == 'scrollTop') {
      return obj[prop];
    } else if (obj.style.filter) {
      return obj.style.filter.match(/\d+/g)[0];
    }
    return style[prop];
  },
  setStyle: function(obj, prop, val) {
    switch (prop) {
      case 'scrollTop':
        obj.scrollTop = val;
        break;
      case 'opacity':
        // if($util.client.browser.ie){
        //     obj.style.filter = 'alpha(' + prop + '=' + val*100 + ')'
        // }else{
        obj.style[prop] = val;
        // }
        break;
      default:
        obj.style[prop] = val + 'px';
        break;
    }
  },
  setStyles: function(obj, props) {
    for (var prop in props) {
      switch (prop) {
        case 'scrollTop':
          obj.scrollTop = props[prop];
          break;
        case 'opacity':
          // if($util.client.browser.ie){
          //     obj.style.filter = 'alpha(' + prop + '=' + props[prop] + ')'
          // }else{
          obj.style[prop] = props[prop];
          // }
          break;
        default:
          obj.style[prop] = props[prop] + 'px';
          break;
      }
    }
  },
  scrollTo: function(position, duration) {
    if (position === 0 || position) {
      duration = duration || 300;
      document.documentElement.scrollTop++;
      document.body.scrollTop++;
      if (document.documentElement.scrollTop) {
        var am = new Animation(document.documentElement);
        am.go({
          scrollTop: position
        }, duration, Tween.Back.easeOut).start();
      } else if (document.body.scrollTop) {
        var am = new Animation(document.body);
        am.go({
          scrollTop: position
        }, duration, Tween.Back.easeOut).start();
      }
    }
  },
  //获得对象距离页面顶端的距离
  getOffestTop: function(obj) {
    var h = 0;
    while (obj) {
      h += obj.offsetTop;
      obj = obj.offsetParent;
    }
    return h;
  },
  getInnerText: function(html) {
    let div = document.createElement('div');
    div.innerHTML = html;
    return div.innerText;
  },
  loadedJSArray: [],
  loadJS: function(src, callback,multiple) {
    if(DocumentUtils.loadedJSArray.indexOf(src) === -1 || multiple){
      var script = document.createElement('script');
      var head = document.getElementsByTagName('head')[0];
      var loaded;
      script.src = src;
      if (typeof callback === 'function') {
        script.onload = script.onreadystatechange = function() {
          if (!loaded && (!script.readyState || /loaded|complete/.test(script.readyState))) {
            script.onload = script.onreadystatechange = null;
            loaded = true;
            callback();
          }
        }
      }
      head.appendChild(script);
      DocumentUtils.loadedJSArray.push(src);
    }else{
      callback();
    }
  }
};

/* Animation 动画 */
var Animation = function(obj) {
  this.obj = obj;
  this.frames = 0;
  this.timmer = undefined;
  this.running = false;
  this.ms = [];
}

Animation.prototype = {
  fps: 60,
  init: function(props, duration, tween) {
    //console.log('初始化');
    this.curframe = 0;
    this.initstate = {};
    this.props = props;
    this.duration = duration || 1000;
    this.tween = tween || function(t, b, c, d) {
      return t * c / d + b;
    };
    this.frames = Math.ceil(this.duration * this.fps / 1000);
    for (var prop in this.props) {
      this.initstate[prop] = {
        from: parseFloat(DocumentUtils.getStyle(this.obj, prop)),
        to: parseFloat(this.props[prop])
      };
    }
  },
  start: function() {
    if (!this.running && this.hasNext()) {
      //console.log('可以执行...');
      this.ms.shift().call(this)
    }
    return this;
  },
  //开始播放
  play: function(callback) {
    //console.log('开始动画！');
    var that = this;

    this.running = true;

    if (this.timmer) {
      this.stop();
    }

    this.timmer = setInterval(function() {
        if (that.complete()) {
          that.stop();
          that.running = false;
          if (callback) {
            callback.call(that);
          }
          return;
        }
        that.curframe++;
        that.enterFrame.call(that);
      },
      1000 / this.fps);

    return this;
  },
  // 停止动画
  stop: function() {
    //console.log('结束动画！');
    if (this.timmer) {
      clearInterval(this.timmer);
      // 清除掉timmer id
      this.timmer = undefined;
    }

  },
  go: function(props, duration, tween) {
    var that = this;
    //console.log(tween)
    this.ms.push(function() {
      that.init.call(that, props, duration, tween);
      that.play.call(that, that.start);
    });
    return this;
  },
  //向后一帧
  next: function() {
    this.stop();
    this.curframe++;
    this.curframe = this.curframe > this.frames ? this.frames : this.curframe;
    this.enterFrame.call(this);
  },
  //向前一帧
  prev: function() {
    this.stop();
    this.curframe--;
    this.curframe = this.curframe < 0 ? 0 : this.curframe;
    this.enterFrame.call(this);
  },
  //跳跃到指定帧并播放
  gotoAndPlay: function(frame) {
    this.stop();
    this.curframe = frame;
    this.play.call(this);
  },
  //跳到指定帧停止播放
  gotoAndStop: function(frame) {
    this.stop();
    this.curframe = frame;
    this.enterFrame.call(this);
  },
  //进入帧动作
  enterFrame: function() {
    //console.log('进入帧：' + this.curframe)
    var ds;
    for (var prop in this.initstate) {
      var initProp = this.initstate[prop];
      ds = this.tween(this.curframe, initProp['from'], initProp['to'] - initProp['from'], this.frames).toFixed(2);
      // console.log(prop + ':' + ds)
      DocumentUtils.setStyle(this.obj, prop, ds)
    }
  },
  //动画结束
  complete: function() {
    return this.curframe >= this.frames;
  },
  hasNext: function() {
    return this.ms.length > 0;
  }
}

var Tween = {
  Linear: function(t, b, c, d) {
    return c * t / d + b;
  },
  Quad: {
    easeIn: function(t, b, c, d) {
      return c * (t /= d) * t + b;
    },
    easeOut: function(t, b, c, d) {
      return -c * (t /= d) * (t - 2) + b;
    },
    easeInOut: function(t, b, c, d) {
      if ((t /= d / 2) < 1) return c / 2 * t * t + b;
      return -c / 2 * ((--t) * (t - 2) - 1) + b;
    }
  },
  Cubic: {
    easeIn: function(t, b, c, d) {
      return c * (t /= d) * t * t + b;
    },
    easeOut: function(t, b, c, d) {
      return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    easeInOut: function(t, b, c, d) {
      if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
      return c / 2 * ((t -= 2) * t * t + 2) + b;
    }
  },
  Quart: {
    easeIn: function(t, b, c, d) {
      return c * (t /= d) * t * t * t + b;
    },
    easeOut: function(t, b, c, d) {
      return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeInOut: function(t, b, c, d) {
      if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
      return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    }
  },
  Quint: {
    easeIn: function(t, b, c, d) {
      return c * (t /= d) * t * t * t * t + b;
    },
    easeOut: function(t, b, c, d) {
      return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    easeInOut: function(t, b, c, d) {
      if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
      return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    }
  },
  Sine: {
    easeIn: function(t, b, c, d) {
      return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    easeOut: function(t, b, c, d) {
      return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    easeInOut: function(t, b, c, d) {
      return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    }
  },
  Expo: {
    easeIn: function(t, b, c, d) {
      return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    easeOut: function(t, b, c, d) {
      return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },
    easeInOut: function(t, b, c, d) {
      if (t == 0) return b;
      if (t == d) return b + c;
      if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
      return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    }
  },
  Circ: {
    easeIn: function(t, b, c, d) {
      return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    easeOut: function(t, b, c, d) {
      return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    easeInOut: function(t, b, c, d) {
      if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
      return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    }
  },
  Elastic: {
    easeIn: function(t, b, c, d, a, p) {
      if (t == 0) return b;
      if ((t /= d) == 1) return b + c;
      if (!p) p = d * .3;
      if (!a || a < Math.abs(c)) {
        a = c;
        var s = p / 4;
      } else var s = p / (2 * Math.PI) * Math.asin(c / a);
      return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    easeOut: function(t, b, c, d, a, p) {
      if (t == 0) return b;
      if ((t /= d) == 1) return b + c;
      if (!p) p = d * .3;
      if (!a || a < Math.abs(c)) {
        a = c;
        var s = p / 4;
      } else var s = p / (2 * Math.PI) * Math.asin(c / a);
      return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
    },
    easeInOut: function(t, b, c, d, a, p) {
      if (t == 0) return b;
      if ((t /= d / 2) == 2) return b + c;
      if (!p) p = d * (.3 * 1.5);
      if (!a || a < Math.abs(c)) {
        a = c;
        var s = p / 4;
      } else var s = p / (2 * Math.PI) * Math.asin(c / a);
      if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
      return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
    }
  },
  Back: {
    easeIn: function(t, b, c, d, s) {
      if (s == undefined) s = 1.70158;
      return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    easeOut: function(t, b, c, d, s) {
      if (s == undefined) s = 1.70158;
      return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    easeInOut: function(t, b, c, d, s) {
      if (s == undefined) s = 1.70158;
      if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
      return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    }
  },
  Bounce: {
    easeIn: function(t, b, c, d) {
      return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b;
    },
    easeOut: function(t, b, c, d) {
      if ((t /= d) < (1 / 2.75)) {
        return c * (7.5625 * t * t) + b;
      } else if (t < (2 / 2.75)) {
        return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
      } else if (t < (2.5 / 2.75)) {
        return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
      } else {
        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
      }
    },
    easeInOut: function(t, b, c, d) {
      if (t < d / 2) return Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
      else return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
    }
  }
}
Animation.TWEEN = Tween;

var PaginationUtil = {
  getBtnArr: function(page) {
    let curPage = page.currentPage,
      totalPage = Math.ceil(page.totalCount / page.pageSize),
      btnArr = [];

    function getBtn(index, label) {
      let active = curPage == index,
        // label = '...' 或者 是当前页码都不能点击
        pointer = label == '...' ? false : !active;
      return {
        // 是否选中
        active: active,
        // 显示label
        label: label || index,
        // 是否可以点击
        pointer: pointer
      };
    }

    if (totalPage <= 5) {
      for (let i = 1; i <= totalPage; i++) {
        btnArr.push(getBtn(i));
      }
    } else {
      if (curPage <= 3) {
        // 靠前
        for (let i = 1; i <= 4; i++) {
          btnArr.push(getBtn(i));
        }
        btnArr.push(getBtn(null, '...'));
        btnArr.push(getBtn(totalPage));
      } else if (curPage + 2 >= totalPage) {
        // 靠后
        btnArr.push(getBtn(1));
        // 离1太远，中间加一个'...'
        btnArr.push(getBtn(null, '...'));
        btnArr.push(getBtn(totalPage - 3));
        btnArr.push(getBtn(totalPage - 2));
        btnArr.push(getBtn(totalPage - 1));
        btnArr.push(getBtn(totalPage));
      } else {
        // 靠中间
        btnArr.push(getBtn(1));
        // 离1太远，中间加一个'...'
        btnArr.push(getBtn(null, '...'));
        btnArr.push(getBtn(curPage - 1));
        btnArr.push(getBtn(curPage));
        btnArr.push(getBtn(curPage + 1));
        if (curPage + 3 <= totalPage) {
          btnArr.push(getBtn(null, '...'));
        }
        btnArr.push(getBtn(totalPage));
      }
    }
    return btnArr;
  }
};

var SubmitUtil = {
  //创建XHR对象
  createXHR: function() {
    let xHR = null;
    try {
      xHR = new XMLHttpRequest();
    } catch (e) {
      try {
        xHR = new ActiveXObject('Microsoft.XMLHTTP');
      } catch (e) {
        xHR = new ActiveXObject('Msxml2.XMLHTTP');
      }
    }
    return xHR;
  },
  error: function(msg) {
    message.warn(typeof msg == 'string' && msg || '服务器异常');
  },
  getFormData: function(obj) {
    let form = new FormData();
    for (let key in obj) {
      form.append(key, obj[key]);
    }
    return form;
  },
  submit: function(obj, url, callback) {
    let addEvent = window.attachEvent && 'attachEvent' || window.addEventListener && 'addEventListener',
      xHR = this.createXHR();
    xHR[addEvent]('error', this.error, false);
    xHR.open('POST', url, true);
    xHR.send(this.getFormData(obj));
    xHR.onreadystatechange = function(e) {
      let readyState = xHR.readyState,
        status = xHR.status;
      if(readyState == 4 && status == 200) {
        let response = e.target.response;
          response = response && JSON.parse(response);
        callback && callback(response);
      }
      if (status >= 500) {
        this.error();
      }
    };
  }
}

/**
 * 调用者需要确定缓存的数据是不经常变动的
 */
var CacheUtil = {
  /**
   * param condition  是否应该请求发起
   */
  exe: function(fn, condition) {
    if (condition == undefined || condition == null) {
      fn();
    } else if (condition == true) {
      fn();
    }
  }
};

/**
 * [throttle 节流函数]
 * @param  {[type]} handler [被触发方法]
 * @param  {[type]} wait    [wait 毫秒内不会被触发 默认 200]
 * @param  {[type]} mustRun [mustRun 毫秒内一定会触发一次 默认16.7]
 * @return {[type]}         [运行函数]
 */
function throttle(handler, wait, mustRun) {
  var timeout,
    lastTime = new Date();
  wait = wait || 200;
  mustRun = mustRun || 16.7; // 默认1000/60，60帧

  return function() {
    var _arguments = arguments;
    var curTime = new Date();
    clearTimeout(timeout);
    // 如果达到了规定的触发时间间隔，触发 handler
    if (curTime - lastTime >= mustRun) {
      handler.apply(this, _arguments);
      lastTime = curTime;
      // 没达到触发间隔，重新设定定时器
    } else {
      timeout = setTimeout(function() {
        handler.apply(this, _arguments);
      }, wait);
    }
  };
}

/**
 * [getImageColor 获取图片像素颜色]
 * @param  {[type]} img [description]
 * @param  {Number} x   [description]
 * @param  {Number} y   [description]
 * @return {[type]}     [rgba颜色]
 */
function getImageColor(img, x = 10, y = 10) {
  try {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.drawImage(img, 0, 0);
    // 获取该点像素的数据
    var imageData = context.getImageData(x, y, 1, 1);
    // 获取该点像素数据
    var pixel = imageData.data;
    var pixelColor = 'rgba(' + pixel[0] + ',' + pixel[1] + ',' + pixel[2] + ',' + pixel[3] + ')';
    return pixelColor;
  } catch (e) {
    console.log('解析图片错误，图片可能跨域。')
  }
}

/**
 * 判断课程是否是scorm课程
 */
function isScorm(content_type) {
  return content_type == 'R';
}

/**
 * 判断课程是否是调查课程
 */
function isSurvey(content_type) {
  return content_type == 'S';
}

function redirectByContentType(contentType, content_id, source_content_id, backUrl,openWin) {
  let urlMap = {
    // scorm课
        R: '/course/' + content_id + '/scorm'
    }
    // S 调查 P 评估
    // if(contentType=='S' || contentType=='P') {
    //  let newWin = window.open();
    //  ajax({
    //    url: `/qm/api/course/${content_id}/subcontent/detail`,
    //    success: (id)=>{
    //      newWin.location.href = `${location.protocol}//${location.host}/es/index_survey.html#/${id}/preview?content_id=${content_id}&source_content_id=${source_content_id}`;
    //    },
    //    error: ()=>{
    //      newWin.close();
    //    }
    //  })
    // } else
  if (contentType == 'L') {
      // 纯直播直接跳转进入直播页面
    let child = openWin && openWin.location ? openWin : window.open();
      ajax({
      url: '/qm/api/course/' + content_id + '/outline/list',
      success: (data) => {
        // 获取课程下面的第一个章节
        let catalog = data[0] || {},
        sub_content_id = catalog.sub_content_id;
        child.location.href = '/#/zhibo?sub_content_id=' + sub_content_id + '&course_id=' + content_id;
        let param = {
          sub_content_id : sub_content_id,
          content_id : content_id,
          source_content_id : source_content_id,
          status : 'C'
        };
        ajax({
          url: '/qm/api/course/' + content_id + '/subperformance/save',
          data: param,
          success: function(data) {}
        });
      },
      error : function() {
        message.warn('服务器异常');
        child.close();
      }
    });
    } else {
      let url = urlMap[contentType] || '/course/' + content_id + '/play';
      History.push({
        pathname : url,
        state : {
          scorm_learner_attempt_id : Date.now(),
          backUrl : backUrl
        }
      });
    }
}



export {
  NumberUtils,
  UploadUtil,
  TimeConvert,
  DocumentUtils,
  Animation,
  PaginationUtil,
  SubmitUtil,
  CacheUtil,
  throttle,
  getImageColor,
  isScorm,
  isSurvey,
  redirectByContentType
}
