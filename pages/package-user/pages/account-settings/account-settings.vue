<!-- 账户设置 -->
<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j">
    <view class="item-wrap">
      <view class="cloumn-item" @tap="toPersonalInformation">
        <view class="left-infor">
          <image :src="userInfo.avatar ? userInfo.avatar : '/static/head04.png'" mode="scaleToFill"
            @error="imageError(userInfo, 'avatar')" />
          <text class="nick-name">{{userInfo.name}}</text>
        </view>
        <view class="right-img">
          <view class="txt-wrap">个人信息</view>
          <image class="right-img" src="/static/arrow-right.png" mode="scaleToFill" />
        </view>
      </view>
      <view class="cloumn-item" @tap="toAddressList">
        <view class="txt-wrap">我的地址</view>
        <image class="right-img" src="/static/arrow-right.png" mode="scaleToFill" />
      </view>
    </view>
    <view class="item-wrap">
      <view class="cloumn-item" @tap.stop="">
        <view class="txt-wrap">手机号码</view>
        <view class="right-img">
          <view class="phone-number">{{ (userInfo.mobile).toString().replace(/^(.{3})(?:\d+)(.{4})$/, "$1****$2") }}</view>
        </view>
      </view>
    </view>
    <view class="item-wrap">
      <view class="cloumn-item" @tap="toTermsOfService('serviceTerms')">
        <view class="txt-wrap">服务条款</view>
        <image class="right-img" src="/static/arrow-right.png" mode="scaleToFill" />
      </view>
      <view class="cloumn-item" @tap="toTermsOfService('servicePolicy')">
        <view class="txt-wrap">隐私政策</view>
        <image class="right-img" src="/static/arrow-right.png" mode="scaleToFill" />
      </view>
    </view>
  </view>
</template>

<script>
const http = require('@/utils/http.js')
const util = require('@/utils/util.js')

export default {
  data() {
    return {
      // 用户信息
      userInfo: {}
    }
  },
  onShow() {
	  // 用户信息
	  this.userInfo = uni.getStorageSync("bbcUserInfo"); //用户信息
    uni.setNavigationBarTitle({
      title: '账户设置'
    })
    // 获取用户消息
    // this.queryUserInfo()
  },
  methods: {
    /**
       * 获取用户信息
       */
    queryUserInfo: function () {
      const params = {
        url: '/p/user/userInfo',
        method: 'GET',
        data: {},
        dontTrunLogin: true,
        callBack: (res) => {
          this.userInfo = res
          uni.setStorageSync('bbcUserInfo', res)
        }
      }
      http.request(params)
    },
    /**
       * 跳转到修改用户头像昵称资料
       */
    toPersonalInformation: function () {
      uni.navigateTo({
        url: '/pages/package-user/pages/personal-information/personal-information'
      })
    },
    /**
       * 我的地址
       */
    toAddressList: function () {
        uni.navigateTo({
          url: '/pages/package-user/pages/delivery-address/delivery-address'
        })
    },
    /**
       * 去条款页
       */
    toTermsOfService(key) {
      uni.navigateTo({
        url: '/pages/package-user/pages/terms-page/terms-page?sts=' + key
      })
    }
  }
}
</script>

<style>
@import "./account-settings.css"
</style>
