import util from "@/utils/util";
const config = require("./config.js"); // 统一的网络请求方法
let loadingTimer, isShowLoad;
function request(params) {
  // 全局变量
  var globalData = getApp().globalData;
  // 默认全局 loading
  // 如需自定义请求loading, 将 params.selfLoading 设置为 true;  (e.g 提交秒杀订单)
  if (globalData.currentReqCounts === 0 && !params.selfLoading) {
    loadingTimer = setTimeout(() => {
      clearTimeout(loadingTimer);
      isShowLoad = true;
      uni.showLoading();
    }, 500);
  }
  globalData.currentReqCounts++;

  if (Object.prototype.toString.call(params.data) == "[object Array]") {
    params.data = JSON.stringify(params.data);
  } else if (Object.prototype.toString.call(params.data) == "[object Number]") {
    params.data = params.data + "";
  }

  uni.request({
    url: (params.domain ? params.domain : config.domain) + params.url,
    // 接口请求地址
    data: params.data,
    header: {
      // 'content-type': params.method == "GET" ? 'application/x-www-form-urlencoded' : 'application/json;charset=utf-8',
      Authorization: uni.getStorageSync("bbcToken"),
      locale: "zh_CN",
    },
    method: params.method == undefined ? "POST" : params.method,
    dataType: "json",
    responseType:
      params.responseType == undefined ? "text" : params.responseType,
    success: (res) => {
      // 隐藏loading加载，放在最前面，防止真机小程序showToast显示时间太短问题
      hideLoad(globalData);
      const responseData = res.data;
      // 请求小程序码
      if (params.responseType === "arraybuffer" && res.statusCode === 200) {
        if (params.callBack) {
          params.callBack(responseData);
        }
        return;
      }

      // 0 请求成功
      if (responseData.code === 0) {
        if (params.callBack) {
          params.callBack(responseData.data);
        }
        return;
      }
      // -640 请求成功 用户首次登录
      if (responseData.code == -640) {
        uni.setStorageSync("noAuth", true); // 用户是否首次授权
        if (params.callBack) {
          params.callBack(responseData.msg);
        }
      }

      // -641 token过期
      if (responseData.code === -641) {
        // 重设登录后跳转地址
        // util.setRouteUrlAfterLogin();
        uni.removeStorageSync("bbcLoginResult");
        uni.removeStorageSync("bbcToken");
        uni.removeStorageSync("bbcHadBindUser");
        uni.removeStorageSync("bbcCode");
        uni.removeStorageSync("bbcUserInfo");
        uni.removeStorageSync("bbcExpiresTimeStamp");
        uni.removeStorageSync("noAuth");
        if (!params.dontTrunLogin && !getApp().globalData.showLoginExpired) {
          getApp().globalData.showLoginExpired = true;
          uni.showModal({
            title: "提示",
            content: uni.getStorageSync("bbcHadLogin")
              ? "登录已过期，请重新登陆！"
              : "请先进行登录！",
            cancelText: "取消",
            confirmText: "确定",
            success: (res) => {
              if (res.confirm) {
                getApp().globalData.showLoginExpired = false;
                uni.redirectTo({
                  url: "/pages/user-login/user-login",
                });
              } else {
                getApp().globalData.showLoginExpired = false;
                const router = getCurrentPages();
                uni.navigateBack(0);
              }
            },
          });
        }
        if (params.errCallBack) {
          params.errCallBack(responseData);
        }
        return;
      }

      // 500 服务器出了点小差
      // if (responseData.code === 500) {
      //   console.error("============== 请求异常 ==============");
      //   // console.log("接口: ", params.url);
      //   console.log("异常信息: ", responseData);
      //   console.error("============== 请求异常 ==============");
      //   if (params.errCallBack) {
      //     params.errCallBack(responseData);
      //     return;
      //   }
      //   uni.showToast({
      //     title: "服务器出了点小差~",
      //     icon: "none",
      //   });
      // }

      // 500 用于直接显示提示用户的错误，内容由输入内容决定
      if (responseData.code === 500) {
        if (params.errCallBack) {
          params.errCallBack(responseData);
		  getApp().globalData.showLoginExpired = false;
		  uni.redirectTo({
		    url: "/pages/user-login/user-login",
		  });
          return;
        }
        uni.showToast({
          title: responseData.msg || "Error",
          icon: "none",
        });
        return;
      }

      // 其他异常
      // if (responseData.code !== "00000") {
      //   // console.log('params', params)

      //   if (params.errCallBack) {
      //     params.errCallBack(responseData);
      //   } else {
      //     // console.log(`接口: ${params.url}`);
      //     // console.log(`返回信息： `, res);
      //   }
      // }
    },
    fail: (err) => {
      console.log(err);
      // 隐藏loading加载，放在最前面，防止真机小程序showToast显示时间太短问题
      hideLoad(globalData);
      if (err.errMsg == "request:fail abort") {
        console.log("请求被取消啦~");
        return;
      }
      setTimeout(() => {
        uni.showToast({
          title: "服务器出了点小差",
          icon: "none",
        });
      }, 1);
    },
    complete: (res) => {
      // const resCode = res.data.code
      // globalData.currentReqCounts--
      // if (globalData.currentReqCounts === 0 && !params.selfLoading) {
      //   clearTimeout(loadingTimer)
      //   uni.hideLoading()
      // }
    },
  });
}
function hideLoad(globalData) {
  globalData.currentReqCounts--;
  if (globalData.currentReqCounts === 0) {
    clearTimeout(loadingTimer);
    isShowLoad && uni.hideLoading();
    isShowLoad = false;
  }
}
function upload(params) {
  wx.uploadFile({
    url: config.domain + params.url,
    filePath: params.filePath,
    name: params.name,
    header: {
      Authorization: uni.getStorageSync("bbcToken"),
    },
    dataType: "json",
    responseType:
      params.responseType == undefined ? "json" : params.responseType,
    success: (res) => {
      console.log(res, "upload===res");
      const responseData = res.data;
      console.log(responseData, "responseData");
      if (res.statusCode === 200) {
        if (params.callBack) {
          params.callBack(responseData);
        }
      } else {
        uni.showToast({
          title: res.msg || "Error",
          icon: "none",
        });
      }
    },
    fail: function () {
      uni.hideLoading();
    },
  });
}
exports.request = request;
exports.upload = upload;
