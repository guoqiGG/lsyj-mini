<template>
  <view class="Mall4j con">
    <view class="logo">
      <view class="logo-con">
        <!-- <image :src="uniLoginLogoImg" mode="heightFix" @tap="toIndex" /> -->
        <image :src="picDomain + '/2023/10/3531fd5d3d034964bd1c365db16a8421.png'" mode="heightFix" @tap="toIndex" />
      </view>
    </view>
    <!-- 微信登录 -->
    <view class="login-form">
      <!-- 按钮 -->
      <view>
        <button open-type="getPhoneNumber" class="authorized-btn" @getphonenumber="getPhoneNumberLogin">
          手机号快捷登录
        </button>
      </view>
      <!-- 服务条款 -->
      <view class="item statement">
        <label class="statement-label" @tap.stop="handlePrivacyClick">
          <checkbox class="check-box" :checked="isPrivacy === 1" />
          <view style="color: #999999">
            我已阅读并同意氢春态欢乐团
            <text @tap.stop="toTermsOfService('serviceTerms')">《服务条款》</text>
            <text style="color: #999999">和</text>
            <text @tap.stop="toTermsOfService('servicePolicy')">《隐私协议》</text>
          </view>
        </label>
      </view>
    </view>
  </view>
</template>

<script>
// const http = require("../../utils/http");
// const util = require("../../utils/util.js");
import { encrypt } from "../../utils/crypto.js";
import { picDomain } from "../../utils/config";

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
    // this.getConfig();
    // 如果没有 tempUid 重新请求一个
    // if (!uni.getStorageSync("bbcTempUid")) util.weChatLogin();
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
    // #ifdef MP-WEIXIN
    /**
     * 蒙版按钮
     */
    maskBtn() {
      uni.showToast({
        title: this.i18n.agreementTips,
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
      const params = {
        url: "/ma/login",
        method: "POST",
        data: {
          code: e.detail.code,
          tempUid: uni.getStorageSync("bbcTempUid"),
        },
        callBack: (res) => {
          if (res.accessToken) {
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
            while (getApp().globalData.requestQueue.length) {
              http.request(getApp().globalData.requestQueue.pop());
            }
            // 请求购物车数量
            http.getCartCount();
            uni.redirectTo({
              url: "/package-user/pages/login-success/login-success",
            });
          }
        },
        errCallBack: (err) => {
          this.loginErrHandle(err);
        },
      };
      http.request(params);
    },
    // #endif

    /**
     * 条款点击事件(勾选/取选)
     */
    handlePrivacyClick() {
      this.isPrivacy = this.isPrivacy === 1 ? 0 : 1;
    },

    /**
     * 登录
     */
    login() {
      // 密码账号登录
      if (this.loginStatus === 0) {
        this.errorTips = !this.principal.trim()
          ? 1
          : !this.credentials.trim()
            ? 2
            : 0;
      }
      // 验证码登录 - 手机号校验
      if (this.loginStatus === 1) {
        this.errorTips = !this.principal.trim()
          ? 8
          : !util.checkPhoneNumber(this.principal)
            ? 1
            : !this.validCode.trim()
              ? 3
              : 0;
      }
      if (this.errorTips) return;
      if (this.isPrivacy != 1) {
        uni.showToast({
          title: this.i18n.agreementTips,
          icon: "none",
        });
        return;
      }
      const url =
        uni.getStorageSync("bbcAppType") > AppType.MP
          ? this.loginStatus === 0
            ? "/login"
            : "/smsLogin"
          : this.loginStatus === 0
            ? "/wx/login"
            : "/smsLogin";
      const params = {
        url,
        method: "POST",
        data: {
          passWord:
            this.loginStatus === 0 ? encrypt(this.credentials) : this.validCode,
          socialType: uni.getStorageSync("bbcAppType"),
          tempUid: uni.getStorageSync("bbcTempUid"),
          userName: this.principal,
        },
        callBack: (res) => {
          util.loginSuccess(res.tokenInfo ? res.tokenInfo : res);
        },
        errCallBack: (err) => {
          this.loginErrHandle(err);
        },
      };
      http.request(params);
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
          title: this.i18n.tips,
          content: this.i18n.codeErrorTips,
          confirmText: this.i18n.confirm,
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
          title: this.i18n.bindedTipsTit,
          content: this.i18n.bindedTipsCon,
          confirmText: this.i18n.bindedTipsBtn,
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
