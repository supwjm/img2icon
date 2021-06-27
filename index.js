// eslint-disable-next-line import/no-extraneous-dependencies
const globby = require('globby');
// eslint-disable-next-line import/no-extraneous-dependencies
const nunjucks = require('nunjucks');
const path = require('path');
const fs = require('fs');
const img2base64 = require('img-convert-to-base64');
// const root = process.cwd();

class Img2Icont {
  constructor(root, iconsPath, stylePath, demoPath) {
    this.root = root;
    this.iconsPath = iconsPath;
    this.stylePath = stylePath;
    this.demoPath = demoPath;
  }

  run() {
    this.getIcons().then((aFiles) => {
      const oUrls = this.getBase64(aFiles);
      const aParam = [
        {
          destination: path.resolve(this.stylePath),
          file: 'template/icons.njk',
          data: { aFiles, path: `/${path.relative(this.root, this.iconsPath).replace('\\', '/')}` },
        },
        {
          destination: path.resolve(this.demoPath),
          file: 'template/demo.njk',
          data: { aFiles, oUrls },
        },
      ];

      aParam.forEach((item) => {
        this.render(item.destination, item.file, item.data);
      });
    });
  }

  // 获取文件对应的base64
  getBase64(aFiles) {
    const data = {};
    aFiles.forEach((item) => {
      data[item.fulPath] = img2base64.parse(item.fulPath);
    });
    return data;
  }

  // 获取图标
  getIcons() {
    const icons = `${this.iconsPath}/*`;
    const root = process.cwd();
    return globby(icons).then((files) => {
      this.iconFiles = files;
      const pat = new RegExp(/([a-z-_1-9]+)\.(.+)/);
      const aFiles = files.map((item) => ({
        fileName: pat.exec(item)[1],
        exe: pat.exec(item)[2],
        fulPath: path.join(root, item),
      }));
      return aFiles;
    });
  }

  // 创建目录
  mkdirs(dirpath) {
    if (!fs.existsSync(path.dirname(dirpath))) {
      this.mkdirs(path.dirname(dirpath));
    }
    if (!fs.existsSync(dirpath)) {
      fs.mkdirSync(dirpath);
    }
  }

  // 创建文件
  writeFile(fileName, data) {
    return new Promise((resolve, reject) => {
      var dir = path.dirname(fileName);
      this.mkdirs(dir);
      fs.writeFile(fileName, data, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // 渲染模板
  render(destination, file, data) {
    const template = path.resolve(__dirname, file);
    const content = nunjucks.render(template, data);
    this.writeFile(destination, content);
  }
}

module.exports = Img2Icont;
