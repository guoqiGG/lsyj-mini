// 配置文件
let domain;

// 小程序名称
const mpAppName = "氢春时代";
// ===============生产环境===============
if (process.env.NODE_ENV === "production") {
  // 统一接口域名
  domain = "https://qct.hnliyue.cn/youth"; //  氢春时代 线上
}

// =============== 开发环境 ===============
if (process.env.NODE_ENV === "development") {
  // domain = "http://192.168.110.69:8072"; // 本地
  domain = "https://qct.hnliyue.cn/youth"; // 氢春时代 线上
}

// =============== 自定义测试环境 ===============
if (process.env.VUE_APP_CUSTOM_ENV === "test") {
  domain = "http://192.168.110.64:8072";
}
exports.mpAppName = mpAppName;
exports.domain = domain;
