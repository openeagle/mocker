const fs = require("fs");
const path = require("path"); //用于处理文件与目录的路径。path.resolve() path.join()常用
const chokidar = require("chokidar");
const clearModule = require("clear-module");
const safe = require("colors-cli/safe");

// 对函数进行 节流（只运行最后一次）
function throttle(fn, delay = 500) {
  let timer = null;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      clearTimeout(timer);
      timer = null;
      fn.apply(this, args);
    }, delay);
  };
}

module.exports = {
  // 合并对象
  mergeRecursive(obj1 = {}, obj2 = {}) {
    const objs = JSON.parse(JSON.stringify(obj1));
    for (let p in obj2) {
      if (this.typeOf(obj2[p]) === "Object") {
        objs[p] = this.mergeRecursive(objs[p], obj2[p]);
      } else if (this.typeOf(obj2[p]) === "Array") {
        // 数组a [{a: 1, b: 2}]  数组b [{c: 3}, {c: 4}, {c: 5}]
        // 合并为 [{a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 4}, {a: 1, b: 2, c: 5}]
        let obj1Key = this.getObjectOriginKey(p, obj1)
        if (obj1Key && obj1[obj1Key][0] && this.typeOf(obj1[obj1Key]) === "Array") {
          // 两个都是数组、以obj1[0]为准进行合并obj2的所有项目
          objs[p] = [obj1[obj1Key][0]]; // 防止obj2[p]为空数组
          for (const j in obj2[p]) {
            objs[p][j] = this.mergeRecursive(obj1[obj1Key][0], obj2[p][j]);
          }
        } else {
          // obj1不存在该数组则直接赋值
          objs[p] = obj2[p];
        }
        delete objs[obj1Key]
      } else {
        objs[p] = obj2[p];
      }
    }
    return objs;
  },
  // 获取对象里原本对应的key值，兼容以'|'分割的key
  // 如 getObjectOriginKey('a', { 'a|10': 1 })  返回值：'a|10'
  getObjectOriginKey(objKey = '', obj2 = {}, separator = '|') {
    // 查询同样的key 已“|”分割的
    const obj1Key = objKey.split(separator)[0];
    for(const key in obj2) {
      if (key.split(separator)[0] === obj1Key) {
        return key
      }
    }
    return undefined
  },
  // 监听文件触发mock数据更新
  wathFile(watchFile, conf = {}, callBack) {
    const watchFiles = (Array.isArray(watchFile)
        ? watchFile
        : typeof watchFile === "string"
          ? [watchFile]
          : []
    ).map(str => path.resolve(str));
    if (watchFiles.some(file => !file)) {
      throw new Error("Mocker file does not exist!.");
    }

    const watchOptions = {
      ...conf
    };

    // 监听配置入口文件所在的目录，一般为认为在配置文件/mock 目录下的所有文件
    // 加上path.resolve，保证 `./mock/`能够找到`./mock/index.js`，要不然就要监控到上一级目录了
    const watcher = chokidar.watch(
      watchFiles.map(watchFile => path.resolve(__dirname, watchFile)),
      watchOptions
    );
    const handleWatch = throttle(() => {
      watchFiles.forEach(file => this.cleanCache(file));
      callBack && callBack(this.getMocks(watchFiles)); // 本地mock数据
    });
    watcher.on("all", (event, path) => {
      // 支持的事件名eventName
      // - add 新增文件时触发
      // - addDir 新增文件夹的时候触发
      // - unlink 对应的文件的删除
      // - unlinkDir 对应的文件夹的删除
      // - change 文件内容改变时触发
      // - all 指代以上所有事件（除了ready, raw, and error之外所有的事件类型）
      // - ready
      // - raw
      // - error 捕获error
      if (event === "change" || event === "add") {
        try {
          // 当监听的可能是多个配置文件时，需要清理掉更新文件以及入口文件的缓存，重新获取
          this.cleanCache(path);
          handleWatch();
          console.log(
            `${safe.green_b.black(" Done: ")} Hot Mocker ${safe.green(
              path.replace(process.cwd(), "")
            )} file replacement success!`
          );
        } catch (ex) {
          // console.error(ex)
          console.error(
            `${safe.red_b.black(" Failed: ")} Hot Mocker ${safe.red(
              path.replace(process.cwd(), "")
            )} file replacement failed!!`
          );
        }
      }
    });
  },
  // 获取本地mock数据
  getMocks(Files) {
    const fileList = this.getAllFiles(Files); // 所有mock文件路径
    const mockObj = {}; // {'E:\project\mocker\packages\example\mocker/common.js': {}  }
    const errorMock = {}; // {'GET /dsp/common/captcha': [] }
    fileList.forEach(filePath => {
      try {
        let mockerItem = require(filePath);
        mockerItem = mockerItem.default ? mockerItem.default : mockerItem; // 单个文件mock数据

        for (const key in mockerItem) {
          // 判断文件冲突
          for (const file in mockObj) {
            const mockData = mockObj[file];
            if (mockData[key] !== undefined) {
              errorMock[key] = errorMock[key] || [filePath];
              errorMock[key].push(file);
            }
          }
        }
        mockObj[filePath] = mockerItem;
      } catch (e) {
        console.log(e);
      }
    });
    for (const key in errorMock) {
      const filesStr = errorMock[key].join(" | ");
      console.log(
        `${safe.red("Mock数据冲突")} MockKey ${safe.green(key)}`,
        ` 文件路径 - ${filesStr}`
      );
    }

    return Object.values(mockObj).reduce((mockers, curMocker) => {
      return Object.assign(mockers, curMocker);
    }, {});
  },
  // 获取文件夹下的所有文件
  getAllFiles(roots) {
    let res = [];
    roots.forEach(path => {
      const files = fs.readdirSync(path);
      files.forEach(file => {
        const pathname = path + "/" + file;
        const stat = fs.lstatSync(pathname);
        if (!stat.isDirectory()) {
          res.push(pathname);
        } else {
          res = res.concat(this.getAllFiles([pathname]));
        }
      });
    });
    return res;
  },
  // 清除本地文件缓存 （不清除会导致第二次读取的数据跟上一次一样）
  cleanCache(modulePath) {
    // causing the module's resources not to be released.
    // https://github.com/jaywcjlove/webpack-api-mocker/issues/30
    try {
      modulePath = path.resolve(modulePath);
      const stat = fs.lstatSync(modulePath);
      if (stat.isDirectory()) {
        return;
      }
    } catch (e) {}

    const module = require.cache[modulePath];
    if (!module) return; // remove reference in module.parent

    if (module.parent) {
      module.parent.children.splice(module.parent.children.indexOf(module), 1);
    } // https://github.com/jaywcjlove/mocker-api/issues/42

    clearModule(modulePath);
  },
  // 判断数据类型
  typeOf(val) {
    // Object、Array、Function、Boolean、String、Number、Undefind、Null
    const type = Object.prototype.toString.call(val);
    const arr = type.match(new RegExp("object (.*?)]"));
    return arr[1] || false;
  },
  throttle
};
