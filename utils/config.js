

// 配置文件
let domain, imDomain, imWsDomain, domainAddress, merchantPlatformUrl, picDomain;

// 微信公众号的appId;  小程序appId配置在 manifest.json ->  mp-weixin -> appid
const mpAppId = "wx35b4644786775a09";
// 小程序名称
const mpAppName = "氢春态欢乐园";
// ===============生产环境===============
if (process.env.NODE_ENV === "production") {
  // 统一接口域名
  domain = "https://www.zzqct.com/api";
  // 客服api
  imDomain = "https://www.zzqct.com:8093";
  // 客服ws
  imWsDomain = "wss://www.zzqct.com:8093";
  // 移动端域名地址配置-用于分享时跳转链接
  domainAddress = "https://www.zzqct.com/api";
  // 商家管理后台地址
  merchantPlatformUrl = "18135771668";
  // 图片域名
  picDomain = "http://qingchuntaijava1.oss-cn-beijing.aliyuncs.com";
}

// =============== 开发环境 ===============
if (process.env.NODE_ENV === "development") {
  domain = "https://www.zzqct.com/api";
  // domain = "http://192.168.1.100:8086";
  imDomain = "https://www.zzqct.com:8093";
  imWsDomain = "wss://www.zzqct.com:8093";
  domainAddress = "https://www.zzqct.com/api";
  picDomain = "http://qingchuntaijava1.oss-cn-beijing.aliyuncs.com";
  merchantPlatformUrl = "18135771668";
}

// =============== 自定义测试环境 ===============
if (process.env.VUE_APP_CUSTOM_ENV === "test") {
  domain = "http://192.168.1.17:8086";
  imDomain = "http://192.168.1.17:8089";
  imWsDomain = "ws://192.168.1.17:8089";
  domainAddress = "https://www.zzqct.com/api";
  picDomain = "http://qingchuntaijava1.oss-cn-beijing.aliyuncs.com";
  merchantPlatformUrl = "18135771668";
}

exports.mpAppId = mpAppId;
exports.mpAppName = mpAppName;
exports.picDomain = picDomain;
exports.domain = domain;
exports.imDomain = imDomain;
exports.imWsDomain = imWsDomain;
exports.domainAddress = domainAddress;
exports.merchantPlatformUrl = merchantPlatformUrl;
