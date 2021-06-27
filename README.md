# img2icon
将图片转化成base64 生成对应的icons.scss 和 demo.html，本工具是在搭建公司小程序 + webpack 开发手脚架过程中开发的，不同公司架构不同，不一定适合您。

# 安装依赖

```
npm i img2icon

```
# 使用
* 在根目录创建img2icon.js,内容如下：

```
const Img2Icont = require('img2icon');
// Img2Icont('源码根目录', 'icons所在目录', 'icons.scss生成路径', 'doc/icon/demo.html生成路径');
const img2Icont = new Img2Icont('src', 'src/images/icons', 'src/style/icons.scss', 'doc/icon/demo.html');
img2Icont.run();

```

* 在package.json script 中定义 "img2icont": "node img2icont.js",
* 每次icons目录添加图标后，运行npm run img2icont,就会生成对应的icons.scss 和 demo.html
