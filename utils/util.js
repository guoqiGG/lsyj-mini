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
 * 刷新token
 */
const refreshToken = (params) => {
  const refreshToken = uni.getStorageSync("bbcLoginResult").refreshToken;
  const expiresTimeStamp = uni.getStorageSync("bbcExpiresTimeStamp");
  if (
    !(
      refreshToken &&
      expiresTimeStamp &&
      expiresTimeStamp < new Date().getTime()
    )
  ) {
    return params;
  }
  getApp().globalData.isLanding = true;
  getApp().globalData.requestQueue.push(params);
  return {
    url: "/token/refresh",
    method: "POST",
    login: true,
    isRefreshing: true,
    dontTrunLogin: true,
    data: {
      refreshToken,
    },
    callBack: (res) => {
      getApp().globalData.isLanding = false;
      loginSuccess(res, true);
    },
    errCallBack: (errMsg) => {
      // 清除refreshToken 过期时间
      uni.removeStorageSync("bbcExpiresTimeStamp");
      uni.removeStorageSync("bbcLoginResult");
      uni.removeStorageSync("bbcToken");
      uni.removeStorageSync("bbcHadBindUser");
      uni.removeStorageSync("bbcCode");
      uni.removeStorageSync("bbcUserInfo");
      uni.removeStorageSync("bbcExpiresTimeStamp");

      // 还原全局 正在登录状态
      getApp().globalData.isLanding = false;
      while (getApp().globalData.requestQueue.length) {
        const queueParam = getApp().globalData.requestQueue.pop();
        http.request(queueParam);
      }
      // 请求微信环境登录
      weChatLogin();
    },
  };
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

export const util = {
  refreshToken,
  checkAuthInfo,
  previousPage,
  toHomePage,
  debounce,
  checkPhoneNumber,
};

module.exports = util;
