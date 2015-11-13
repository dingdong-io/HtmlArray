if (typeof jQuery === "undefined") { //兼容无jQuery的情况,此时引入的子页面脚本不运行

  jQuery = {}
}
if (!window.Zepto) {
  Zepto = {}
}

var $$ = jQuery || Zepto; //由于微商城项目主要采用zepto,jQuery交出$控制权
jQuery.noConflict();
$ = Zepto; //如果jQuery采用不完整版,就需要





$$(function () {

    setTimeout(function () { //等待获取页面文件的参数
      //兼容HtmlArray.config未定义的情况

      if (typeof HtmlArray.config !== "object") {
        HtmlArray.config = {}
      }
      //兼容HtmlArray未定义的情况
      if (typeof HtmlArray !== "object") {
        HtmlArray = []
      }


      //默认的初始化,不推荐修改此处. 推荐在组合页配置全局HtmlArray.config={}
      var iPageNum = 0, //第n个页面
        init = {
          //组合页面的标题
          title: 'HtmlArray',
          deleteTemp: false, //删除临时节点
          eachTitle: false, //每个页面显示标题
          src: ['src', 'href'], //自定义的资源路径属性
        },
        errors = {
          hasError: false,
          pageCount: 0,
          pageError: function () { //路径错误
            errors.hasError = true;
            if (errors.pageCount === 0) {
              $$(".pgErrorInfo").find("span").append(iPageNum + 1)
              errors.pageCount = 1
            } else {
              $$(".pgErrorInfo").find("span").append('/' + (iPageNum + 1))
            }
          }
        };
      Array.prototype.push.apply(init.src, HtmlArray.config.src)

      //地址转换,接受字符串参数,返回值{dir:'xx',type:'xx'}
      var pathChange = function (path) {
        var toPath = {}
          //兼容采用双反斜杠的路径 去掉行首空格(好根据行首进行路径类型判断)
        if (undefined == path) path = '' //防止双逗号错误
        var dir = path.replace(/\\/g, '/').replace(/^[ 　]*/, '')

        //防止空路径(''和双逗号),尤其是用户设置空路径会引起中断
        if (dir === '') toPath.type = null
          //绝对路径,不转换 两种情况:首位'/',或带协议头(必带':/',包括ie直接返的盘符d:/)
        else if (/^\//.test(dir) || /file:\//.test(dir)) toPath.type = 'absolute'
        else if (/:\//.test(dir)) toPath.type = 'absolute_http'
          //本页内部锚点链接--文件名可带# 且资源路径已经改为独立处理
          //        else if (/^#/.test(dir)) toPath.type = 'anchor'

        //相对路径
        else {
          toPath.type = 'relative'
            //兼容node方式的相对路径写法
          if (/^.\//.test(dir)) {
            dir = dir.replace(/^.\//, '')
          }

        }

        toPath.url = dir
        return toPath
      }



      //页面标题
      $$("head").prepend("<title>" + (HtmlArray.config.title || init.title))

      //主循环函数,不采用for是避免异步造成的变量混乱
      var main = function () {
          var mainEnd = function () {
            iPageNum++
            main() //if中调用主函数的循环
              //exportError()不适合在这里
          }

          if (iPageNum < HtmlArray.length) {
            //处理第n个子页面,同时也是循环中的当前子页面
            var oP = pathChange(HtmlArray[iPageNum]);

            //防止空路径参数设置为''引起的中断 及跨域型绝对路径
            if ((null == oP.type) || ('absolute-http' == oP.type)) {
              errors.pageError()
              mainEnd()
            }
            //非空路径,执行ajax
            else {

              //添加临时包裹节点页面中
              //var wrapTemp = oP.url.replace(/[\/\.]+/mg,'-')//以路径命名类
              var wrapTemp = "pgWrapTemp" + iPageNum
              var childTemp = "pgChildTemp" + iPageNum
              $$("body").append('<div class="' + wrapTemp + '">')
              wrapTemp = $$('.' + wrapTemp)


              $$.ajax({
                  url: oP.url,
                  type: "GET",
                  error: function () {
                    errors.pageError()
                    mainEnd()
                  },
                  success: function (res, stutas, xhr) {
                    //去公用
                    res = res
                      .replace(/<link.*?common\/css\/common\.css.*?>/ig, '') //去公用css
                      .replace(/<script.*?common\/js\/zepto-1\.16\.min\.js.*?<\/script>/ig, '') //去公用zepto
                    //源文件路径(不含文件名)
                    if (/.*\//.test(oP.url)) { //当子页面与组合页位于不同目录,包括绝对定位 和相对定位中出现'/'
                      oP.path = oP.url.replace(/(.*\/)(.*)\..*/, '$1')
                    } else { //当子页面与组合页位于同一目录
                      oP.path = ''
                    }


                    //源文件中的资源 前缀字符集,如href
                    var sSrcTitle = '',
                      iSrcCount = 0;
                    for (var srcI = init.src.length - 1; srcI >= 0; srcI--) {
                      if (!iSrcCount) {
                        iSrcCount = 1
                        sSrcTitle += init.src[srcI]
                      } else sSrcTitle += '|' + init.src[srcI]
                    }
                    //源文件中的资源 路径处理
                    var srcReg = new RegExp('(' + sSrcTitle + ')\\s*=\\s*[\'\"]((?!#|\/|(.*?:\/)).*)[\'\"]','ig')
                    res = res.replace(srcReg,'$1="'+oP.path+'$2"')



                    //res插入前处理
                    oP.head = res.match(/<head[\s\S]+<body/i).toString()
                    oP.head = oP.head.substring(0, oP.head.length - 5)
                    oP.head = oP.head
                      .replace(/(<\/?head>)|(<title.*?<\/title>)|(<meta.*?>)/ig, '')
                      .replace(/([\r\n]\s*)+/mg, '\n')


                    oP.body = res.match(/<body[\s\S]+<\/body/i).toString()
                    oP.body = oP.body.substring(0, oP.body.length - 6)
                    oP.body = oP.body
                      .replace(/<\/?body.*?>|<script[\s\S]*?<\/script>/ig, '') //去掉了body属性/去除脚本
                      .replace(/([\r\n]\s*)+/mg, '\n')

                    wrapTemp
                      .append(oP.head)
                      .append(oP.title)
                      .append(oP.body)
                      .append('<div class="' + childTemp + '">')
                    childTemp = $$('.' + childTemp)



                    init.deleteTemp = HtmlArray.config.deleteTemp || init.deleteTemp

                    //按源文件路径加入标题字段
                    if (HtmlArray.config.eachTitle || init.eachTitle && !init.deleteTemp) {
                      oP.title = RegExp.$2
                      wrapTemp.before('<h1 class="pgTitle">' + oP.title + '<a target="_blank" href="' + oP.url + '">' + oP.url + '</a><input type="button" value="隐藏" /><span title="删除后,恢复请刷新页面">删除该节点</span></h1>')
                      var wrapTempControl = wrapTemp.prev('h1')
                      wrapTempControl.on('click', 'input', function () {
                        if (wrapTemp.css('display') == 'none') {
                          wrapTemp.show()
                          $$(this).val('隐藏')
                        } else {
                          wrapTemp.hide();
                          $$(this).val('显示')
                        }
                      })
                      wrapTempControl.on('click', 'span', function () {
                        wrapTemp.remove();
                        $$(this).html("已删除")
                        wrapTempControl.find('input').remove();
                      })
                    }



                    //删除临时节点
                    if (init.deleteTemp) {
                      wrapTempControl.remove()
                      childTemp.unwrap().remove()
                    } else {
                      childTemp.remove()
                    }

                    mainEnd() //单页面加载结束,也是if中调用主函数的循环
                  }, //success结束

                }) //ajax结束

            } //if(null == oP.type)的else结束

          } //多个子页面间的if循环结束
          //else 为iPageNum>=HtmlArray.length,即页面循环结束
          else {
            exportError()
          }

        } //main

      main()


      //错误输出
      function exportError() {
        setTimeout(function () {
          if (errors.hasError) {
            $$(".pgErrorInfo").css("display", "block")
            $$(".pgErrorBg").css("display", "block")
          }
          $$(".pgErrorInfo").click(function () {
            $$(".pgErrorInfoClose").trigger('click')
          })
          $$(".pgErrorBg").click(function () {
            $$(".pgErrorInfoClose").trigger('click')
          })
          $$(".pgErrorInfoClose").click(function () {
            $$(".pgErrorInfo").css("display", "none")
            $$(".pgErrorBg").css("display", "none")
          })
          $$(".pgErrorInfoPath").click(function (e) {
            return false;
          })
        }, 3000)
      }

    }, 300)//setTimeout //等待获取页面文件的参数

  }) //$(function(){})的结束
