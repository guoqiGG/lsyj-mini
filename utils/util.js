const config = require("./config.js");
const http = require("./http.js");
import { picDomain } from "./config.js";

// 检查是否授权
const checkAuthInfo = (fn) => {
  const pages = getCurrentPages();
  if (uni.getStorageSync("bbcToken")) {
    fn();
    return;
  }
  // 设置登录后的跳转地址
  setRouteUrlAfterLogin();
  uni.redirectTo({
    url: "/pages/user-login/user-login",
  });
};

/**
 * 设置登录后的跳转地址
 */
const setRouteUrlAfterLogin = () => {
  const pages = getCurrentPages();
};

// 登录返回上一页
const previousPage = (isRefreshToken) => {
  const pages = getCurrentPages();
  const nowRoute = pages[pages.length - 1].route;
  // 若为刷新token的登录
  if (isRefreshToken) {
    // 在登录页面登录时
    if (nowRoute === "pages/user-login/user-login") {
      util.toHomePage();
    }
    return;
  }
  util.toHomePage();
};

/**
 * 回到首页
 */
const toHomePage = () => {
  uni.switchTab({ url: "/pages/index/index" });
};

/**
 * 防抖
 * @param fn
 * @param wait
 * @returns {Function}
 * @constructor
 */
const debounce = (fn, t) => {
  const delay = t || 500;
  let timer;
  return function () {
    const args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    const callNow = !timer;
    timer = setTimeout(() => {
      timer = null;
    }, delay);
    if (callNow) fn.apply(this, args);
  };
};

/**
 * 手机号正则校验
 */
const checkPhoneNumber = (phoneNumber) => {
  var regexp = /^[1][0-9]{10}$/;
  return regexp.test(phoneNumber);
};

/**
 * 微信环境统一登录方法 (公众号 & 小程序)
 */
const weChatLogin = () => {
  if (getApp().globalData.isLanding) return;
  // 改变全局中登录
  const globalData = getApp().globalData;
  globalData.isLanding = true;

  // 微信小程序
  // 请求微信接口获取 code
  wx.login({
    success: (res) => {
      // 用code 请求登录
      loginByCode(res.code);
    },
  });
  return;
};

/**
 * 通过微信返回的code登录
 * @param {String} code 请求微信返回的 code
 */
const loginByCode = (code) => {
  const params = {
    url: "/pub/user/login/auth",
    method: "POST",
    data: JSON.stringify({ code: code, loginType: 1 }),
    callBack: (res) => {
      if (!res.id) {
        uni.setStorageSync("bbcTempUid", res);
      } else {
        uni.setStorageSync("bbcTempUid", res.openId);
      }
      // 还原全局 正在登录状态
      getApp().globalData.isLanding = false;
      while (getApp().globalData.requestQueue.length) {
        http.request(getApp().globalData.requestQueue.pop());
        getApp().globalData.currentReqCounts--;
      }
    },
    errCallBack: () => {
      // 还原全局 正在登录状态
      getApp().globalData.isLanding = false;
      while (getApp().globalData.requestQueue.length) {
        http.request(getApp().globalData.requestQueue.pop());
        getApp().globalData.currentReqCounts--;
      }
      uni.removeStorageSync("bbcLoginResult");
      uni.removeStorageSync("bbcToken");
      uni.removeStorageSync("bbcHadBindUser");
      uni.removeStorageSync("bbcCode");
      uni.removeStorageSync("bbcUserInfo");
      uni.removeStorageSync("bbcExpiresTimeStamp");
    },
  };
  http.request(params);
};

/**
 * 登录成功
 * @param {Object} loginRes 登录成功返回的数据
 * @param {Boolean} isRefreshToken 该次登录是否为刷新token;
 */
const loginSuccess = (loginRes, isRefreshToken) => {
  uni.setStorageSync("bbcIsPrivacy", 1);
  uni.setStorageSync("bbcHadLogin", true);
  uni.setStorageSync("bbcToken", loginRes.accessToken);
  uni.setStorageSync("bbcLoginResult", loginRes); // 保存整个登录数据
  const expiresTimeStamp =
    (loginRes.expiresIn * 1000) / 2 + new Date().getTime();
  // 缓存token的过期时间
  uni.setStorageSync("bbcExpiresTimeStamp", expiresTimeStamp);

  // 还原全局 正在登录状态
  getApp().globalData.isLanding = false;
  while (getApp().globalData.requestQueue.length) {
    http.request(getApp().globalData.requestQueue.pop());
  }
  // previousPage(isRefreshToken);
};


export const util = {
  checkAuthInfo,
  previousPage,
  toHomePage,
  debounce,
  checkPhoneNumber,
  weChatLogin,
  loginSuccess
};

module.exports = util;
