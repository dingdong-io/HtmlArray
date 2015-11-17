var oP = {}
oP.url = 'file:///F:/lzz/work/io_module/HtmlArrayLocal/%E7%BB%84%E5%90%88.html'
//地址转换,接受字符串参数,返回值{dir:'xx',type:'xx'}
var pathChange = function (path) {
  var toPath = {}
    //兼容采用双反斜杠的路径 去掉行首空格(好根据行首进行路径类型判断)
  var dir = path.replace(/\\/g, '/').replace(/^[ 　]*/, '')

  //防止空路径,尤其是用户设置空路径会引起中断
  if (dir === '') toPath.type = null
  //绝对路径,不转换 两种情况:首位'/',或带协议头(必带':/',包括ie直接返的盘符d:/)
  else if (/^\//.test(dir)||/file:\//.test(dir)) toPath.type = 'absolute'
  else if(/:\//.test(dir)) toPath.type = 'absolute_http'

  //相对路径
  else {
    toPath.type = 'relative'
    //兼容node方式的相对路径写法
    if (/^.\//.test(dir)) {
      dir = dir.replace(/^.\//, '')
    }

  }

  toPath.dir = dir
  console.log(toPath)
  return toPath
}


oP.url = pathChange(oP.url)
console.log(oP.url.type)
console.log(oP.url.dir)

pathChange('file:///F:/lzz/work/io_module/HtmlArrayLocal/%E7%BB%84%E5%90%88.html')
pathChange('https:///F:/lzz/work/io_module/HtmlArrayLocal/%E7%BB%84%E5%90%88.html')
pathChange('  　')
pathChange(' . /e')
pathChange('e12 / ..')
pathChange('./oth')
pathChange('http:./oth')
pathChange('https://./oth')
pathChange('file:\\\\./oth')


