<template>
  <view class="Mall4j login-success">
    <view class="success-img">
      <image src="@/static/allow.png" mode="heightFix" />
    </view>
    <view class="title">登录成功，账户已绑定此微信号</view>
    <view class="sub-title">后续可在 [我的] 进行账户管理</view>
    <button class="btn" @tap="back">返回</button>
  </view>
</template>

<script>
const util = require('@/utils/util.js')
export default {
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 头部导航标题
    uni.setNavigationBarTitle({
      title: '用户登录'
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 头部导航标题
    uni.setNavigationBarTitle({
      title: '用户登录'
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },
  methods: {
    back() {
      util.previousPage()
    }
  }
}
</script>
<style>
@import "./login-success.css";
</style>
