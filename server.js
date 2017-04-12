/*eslint no-console:0 */
'use strict';
require('core-js/fn/object/assign');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');
var http = require("http");
var Api = require("./server_api_define.js").Api;

// 创建api服务
var api_root_dir = __dirname + "/../";;
console.log("root_dir : " + api_root_dir)

var api = new Api();
var server = http.createServer();
server.on("request", function (request, response) {
    api.dispatch(request, response, api_root_dir);
});
server.listen(config.apiPort);
console.log('Listening API at localhost:' + config.apiPort);

new WebpackDevServer(webpack(config), config.devServer)
    .listen(config.port, 'localhost', (err) => {
        if (err) {
            console.log(err);
        }
        console.log('Listening at localhost:' + config.port);
    });

