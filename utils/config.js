// 配置文件
let domain, picDomain;

// 小程序名称
const mpAppName = "氢春态6欢乐团";
// ===============生产环境===============
if (process.env.NODE_ENV === "production") {
  // 统一接口域名
  // domain = "https://qct5.hnliyue.cn/youth"; // 青春态5 线上
  domain = "https://qct.hnliyue.cn/youth"; // 青春态6 线上
  // domain = "https://qct7.hnliyue.cn/youth"; // 青春态7 线上
  // 图片域名
  picDomain = "http://qingchuntaijava1.oss-cn-beijing.aliyuncs.com";
}

// =============== 开发环境 ===============
if (process.env.NODE_ENV === "development") {
  domain = "http://192.168.110.64:8072"; // 本地
  // domain = "https://qct5.hnliyue.cn/youth"; // 青春态5 线上
  // domain = "https://qct.hnliyue.cn/youth"; // 青春态6 线上
  // domain = "https://qct7.hnliyue.cn/youth"; // 青春态7 线上
  picDomain = "http://qingchuntaijava1.oss-cn-beijing.aliyuncs.com";
}

// =============== 自定义测试环境 ===============
if (process.env.VUE_APP_CUSTOM_ENV === "test") {
  domain = "http://192.168.110.64:8072";
  picDomain = "http://qingchuntaijava1.oss-cn-beijing.aliyuncs.com";
}
exports.mpAppName = mpAppName;
exports.picDomain = picDomain;
exports.domain = domain;
