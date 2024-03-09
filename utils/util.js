const config = require("./config.js");
const http = require("./http.js");
import { picDomain } from "./config.js";

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

export const util = {
  refreshToken
};

module.exports = util;
