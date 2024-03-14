// 配置文件
let domain, picDomain;

// 微信公众号的appId;  小程序appId配置在 manifest.json ->  mp-weixin -> appid
// const mpAppId = "wxfde31417f37933aa"; // 氢春态5
// const mpAppId = "wx35b4644786775a09"; // 氢春态6
// const mpAppId = "wx2ce1b5f7423287cb"; // 氢春态7

// 小程序名称
const mpAppName = "氢春态欢乐园";
// ===============生产环境===============
if (process.env.NODE_ENV === "production") {
  // 统一接口域名
  domain = "https://qct5.hnliyue.cn/youth"; // 青春态5 线上
  // domain = "https://qct.hnliyue.cn/youth"; // 青春态6 线上
  // domain = "https://qct7.hnliyue.cn/youth"; // 青春态7 线上
  // 图片域名
  picDomain = "http://qingchuntaijava1.oss-cn-beijing.aliyuncs.com";
}

// =============== 开发环境 ===============
if (process.env.NODE_ENV === "development") {
  // domain = "http://192.168.110.64:8072"; // 本地
  domain = "https://qct5.hnliyue.cn/youth"; // 青春态5 线上
  // domain = "https://qct.hnliyue.cn/youth"; // 青春态6 线上
  // domain = "https://qct7.hnliyue.cn/youth"; // 青春态7 线上
  picDomain = "http://qingchuntaijava1.oss-cn-beijing.aliyuncs.com";
}

// =============== 自定义测试环境 ===============
if (process.env.VUE_APP_CUSTOM_ENV === "test") {
  domain = "http://192.168.110.64:8072";
  picDomain = "http://qingchuntaijava1.oss-cn-beijing.aliyuncs.com";
}

exports.mpAppId = mpAppId;
exports.mpAppName = mpAppName;
exports.picDomain = picDomain;
exports.domain = domain;
