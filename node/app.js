var express = require('express'),
    fs = require('fs'),
    async = require('async')

var url = require("url");
c = console.log.bind(console)

var server = express()
server.use('/bigpipe', express.static(__dirname + '/static'));
server.use('/lib', express.static(__dirname + '/bower_components'));

server.listen(7777, function () {
    console.log('server is listen on port 7777......');
})

/*路由*/
server.get('*', function (req, res, next) {

    var pathname = url.parse(req.url).pathname;
    if ('/' == pathname) {
/*如果请求首页,就将头尾通过异步插件同时传过去-bigpipe的核心实现*/
        var content = fs.readFileSync(__dirname + '/bigpipe.html', 'utf8');

        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.write(content);

        // 下面开始加载文件内容
        // 开始并行加载多个文件
        async.parallel([function (callback) {
            fs.readFile(__dirname + '/data/header2/头部.html', 'utf8', function (err, data) {
                if (err) c('头部出错')
                data = data.replace(/[\r\n]\s+/g, '\\n').replace(/<\/script>/g,'<\\/script>')
                //            data = data.replace(/\//g, '&#47;');
                //            console.log(data)
                res.write("<script>bigpipe.set('header','" + data + "');</script>");
                callback(err, data);
            });
    }, function (callback) {
            fs.readFile(__dirname + '/data/footer/底部.html', 'utf8', function (err, data) {
                if (err) c('底部出错')
                data = data.replace(/[\r\n]\s+/g, '\\n').replace(/<\/script>/g,'<\\/script>')
                //            data = data.replace(/\//g, '&#47;');
                //            console.log(data);


                res.write("<script>bigpipe.set('footer','" + data + "');</script>");

                callback(err, data);
            })
    }], function (err, result) {
            if (err) res.end();

            res.end();

        });

    }

    /* '*',其它路由 */
    else {

        console.log(req.url)
        var content = fs.readFileSync(__dirname + '/' + pathname)

        res.end(content);
    }

    next()
});


