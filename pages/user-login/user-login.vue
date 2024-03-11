<template>
  <view class="con">
    <view class="logo">
      <view class="left-bg">
        <image src="/static/rectangle.png" mode="widthFix" />
      </view>
      <view class="right-bg">
        <image src="/static/cube.png" mode="widthFix" />
      </view>
      <image class="logo-img" src="/static/logo.png" mode="heightFix" @tap="toIndex" />
    </view>
    <!-- 微信登录 -->
    <view class="login-form">
      <!-- 按钮 -->
      <view>
        <button v-if="!isPrivacy" class="authorized-btn" @tap="maskBtn">
          手机号快捷登录
        </button>
        <button v-else open-type="getPhoneNumber" class="authorized-btn" @getphonenumber="getPhoneNumberLogin">
          手机号快捷登录
        </button>
      </view>
      <!-- 服务条款 -->
      <view class="item statement">
        <label class="statement-label" @tap.stop="handlePrivacyClick">
          <checkbox class="check-box" :checked="isPrivacy === 1" />
          <view style="color: #979797">
            我已阅读并同意氢春态欢乐园
            <text @tap.stop="toTermsOfService('serviceTerms')">《服务条款》</text>
            <text style="color: #979797">和</text>
            <text @tap.stop="toTermsOfService('servicePolicy')">《隐私协议》</text>
          </view>
        </label>
      </view>
    </view>
  </view>
</template>

<script>
const http = require("@/utils/http");
const util = require("@/utils/util.js");
import { encrypt } from "@/utils/crypto.js";
import { picDomain } from "@/utils/config";

export default {
  props: {},
  data() {
    return {
      uniLoginLogoImg: "",
      code: "",
      isPrivacy: 0,
      passwordType: true,
      appType: uni.getStorageSync("bbcAppType"),
      privacyNumber: "",
      // 图片域名
      picDomain: picDomain,
    };
  },
  watch: {
    loginStatus(nv) {
      this.errorTips = 0;
      this.validCode = "";
      this.principal = "";
      this.credentials = "";
      const phone = uni.getStorageSync("bbcUserInfo").userMobile || "";

    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 头部导航标题
    uni.setNavigationBarTitle({
      title: '用户登录',
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    uni.getSystemInfo({
      success: (res) => {
        // 根据屏幕高度设置 top 值
        this.regLocation = res.windowHeight - 150 + "px";
      },
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 头部导航标题
    uni.setNavigationBarTitle({
      title: '用户登录'
    });

    // 如果没有tempUid 则先获取
    if (!uni.getStorageSync("bbcTempUid")) {
      // #ifdef H5
      window.history.replaceState({}, "", window.location.href.split("?")[0]);
      // #endif
      // util.weChatLogin();
    }
  },

  methods: {
    /**
     * 蒙版按钮
     */
    maskBtn() {
      uni.showToast({
        title: '请先阅读并勾选协议',
        icon: "none",
      });
    },

    /**
     * 微信小程序获取手机号一键登录按钮
     */
    getPhoneNumberLogin(e) {
      // 拒绝了授权
      if (!e.detail.code) {
        return;
      }
      // const params = {
      //   url: "/pub/user/login/auth",
      //   method: "POST",
      //   data: {
      //     code: e.detail.code,
      //     // tempUid: uni.getStorageSync("bbcTempUid"),
      //   },
      //   callBack: (res) => {
      //     if (res.accessToken) {
      //       uni.setStorageSync("bbcIsPrivacy", 1);
      //       uni.setStorageSync("bbcHadLogin", true);
      //       uni.setStorageSync("bbcToken", res.accessToken);
      //       uni.setStorageSync("bbcLoginResult", res); // 保存整个登录数据
      //       const expiresTimeStamp =
      //         (res.expiresIn * 1000) / 2 + new Date().getTime();
      //       // 缓存token的过期时间
      //       uni.setStorageSync("bbcExpiresTimeStamp", expiresTimeStamp);

      //       // 还原全局 正在登录状态
      //       getApp().globalData.isLanding = false;
      //       while (getApp().globalData.requestQueue.length) {
      //         http.request(getApp().globalData.requestQueue.pop());
      //       }
      //       uni.redirectTo({
      //         url: "/package-user/pages/login-success/login-success",
      //       });
      //     }
      //   },
      //   errCallBack: (err) => {
      //     console.log(err)
      //     this.loginErrHandle(err);
      //   },
      // };
      // http.request(params);
      let res = {
        accessToken: 'qcsd' // 设置假的token
      }
      uni.setStorageSync("bbcIsPrivacy", 1);
      uni.setStorageSync("bbcHadLogin", true);
      uni.setStorageSync("bbcToken", res.accessToken);
      uni.setStorageSync("bbcLoginResult", res); // 保存整个登录数据
      const expiresTimeStamp =
        (res.expiresIn * 1000) / 2 + new Date().getTime();
      // 缓存token的过期时间
      uni.setStorageSync("bbcExpiresTimeStamp", expiresTimeStamp);

      // 还原全局 正在登录状态
      getApp().globalData.isLanding = false;
      while (getApp().globalData.requestQueue?.length) {
        http.request(getApp().globalData.requestQueue.pop());
      }
      uni.redirectTo({
        url: "/pages/package-user/pages/login-success/login-success",
      });
    },


    /**
     * 条款点击事件(勾选/取选)
     */
    handlePrivacyClick() {
      this.isPrivacy = this.isPrivacy === 1 ? 0 : 1;
    },

    /**
     * 登录异常
     */
    loginErrHandle(err) {
      if (
        err.code === "A00001" ||
        err.code === "A00005" ||
        err.code === "A00006"
      ) {
        uni.showToast({
          title: err.msg || "Error",
          icon: "none",
        });
      }
      if (err.code === "A00012") {
        // 还原全局 正在登录状态
        getApp().globalData.isLanding = false;
        while (getApp().globalData.requestQueue.length) {
          http.request(getApp().globalData.requestQueue.pop());
          getApp().globalData.currentReqCounts--;
        }
        // tempUid 错误，重新获取
        uni.removeStorageSync("bbcTempUid");
        uni.showModal({
          showCancel: false,
          title: '提示',
          content: '登录信息异常，请重新登录',
          confirmText: '确定',
          success: (res) => {
            if (res.confirm) {
              // #ifdef H5
              window.history.replaceState(
                {},
                "",
                window.location.href.split("?")[0]
              );
              // #endif
              util.weChatLogin();
            }
          },
        });
      }
      if (err.code === "A04002") {
        // 弹窗
        uni.showModal({
          showCancel: false,
          title: '该账户已绑定其他微信',
          content: '一个账户只能绑定一个微信，您的手机号已经绑定了其他微信，请您先解除后再尝试。',
          confirmText: '知道了',
          confirmColor: "#F81A1A",
        });
      }
    },

    /**
     * 回到首页
     */
    toIndex() {
      util.toHomePage();
    },
    /**
     * 去服务条款和隐私协议页面
     */
    toTermsOfService(key) {
      uni.navigateTo({
        url: "/pages/package-user/pages/terms-page/terms-page?sts=" + key,
      });
    },
  },
};
</script>
<style>
@import "./user-login.css";
</style>
