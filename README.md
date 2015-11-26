# HtmlArray
用前端的方式方法组合html页面，静态页面组合的快速方案。

### [简单示例](https://github.com/dingdong-io/HtmlArray/blob/master/examples/easy.html)
　核心代码
    <script type="text/javascript" src="other/jquery-2.1.4.min.js"></script>
    <script  type="text/javascript" src="../HtmlArray.js"></script>
    <script>
      HtmlArray = [
        "module/header/header.html",
        "module/footer/footer.html",
      ];
    </script>
1.引入依赖的jQuery
2.引入HtmlArray
3.定义HtmlArray数组，每一个子页面的路径（字符串格式）集合。
　　好了，打开页面看看吧，就是如此简单。
  　如果还有什么要说的，路径需要在本地，不允许跨域，写个"http://example.com"是无效的（除非你是该站站长）
  
### [参数范例](https://github.com/dingdong-io/HtmlArray/blob/master/examples/AllConfig.html)
  待补充

### 使用环境
　　项目的初衷就是用纯前端的方式来组合页，甚至允许前端工程师不用搭建服务器。

*  适用范围
  快速组合页面，特别适合前端工程师
  待补充
  
*  不搭建服务器
  当然这种时候你只能在本地打开，不过需要做一步设置，可以[参考这里](http://blog.sina.com.cn/s/blog_a76aa1590101eams.html)。右击chrome的快捷方式--目标--在原来字段的后面加上“ --allow-file-access-from-files”即可。
  该方法对chrome有效，其它webkit内核的浏览器也可，如国内双核浏览器设置后在极速模式下有效，兼容模式下报错。
  实测下，需要先关闭chrome，等待浏览器进程全部关完后，再用该快捷方式开启即可。
  
*  开启服务器
  当然，作为一个web工作者，我仍然推荐你开启服务器，都是静态页面，IIS/apache都是可以胜任的。接下来，你就不受浏览器限制了，IE/火狐都是可以的，你还可以在局域网中的其它设备，包括手机访问到它。
  当然，绑定域名后，公网上亦可访问。
  
  尽管如此，它应该是帮助前端工程师组合页面所用，而不应该用在后端。
  
  
##### 项目来由  
　　起因是公司项目采用模块化设计，头部、底部、主体、子模块分别有几个模板，后端再把它们组合成完整的页面。
　　一方面前端需要先手工组合出页面，确保样式、脚本在组合页中无误再提交给后端。另一方面随着子模块和组合页越来越多，维护越发麻烦，一个子模块的改动，所有引用到它的合成面都需要改动，于是萌发组合页面的想法。（但是没有什么后端经验就决定用js）
　
    
  





