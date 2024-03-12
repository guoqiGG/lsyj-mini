

<template>
  <view class="Mall4j container">
    <!-- 失败 -->
    <view v-if="sts == 0" class="pay-fail">
      <view class="img">
        <image src="/static/pay-fail.png" mode=""></image>
      </view>
      <view class="pay-sts fail">支付失败，请重新支付</view>
      <view class="order-detail-title">订单信息</view>
      <view class="tips">
        该订单会为您保留
        <text class="warn">30分钟</text>
        ,<text class="tips">30分钟之后如果还未付款,系统将自动取消该订单</text>
      </view>

      <view class="btns">
        <text class="button checkorder" @tap="toOrderList">查看订单</text>
        <text class="button payagain" @tap="payAgain">重新支付</text>
      </view>
    </view>
    <!-- 成功 -->
    <view v-if="sts == 1" class="pay-success">
      <view class="img">
        <image src="/static/pay-success.png" mode=""></image>
      </view>
      <view class="pay-sts succ">支付成功</view>
      <view class="tips">支付成功，您可以去<text class="my-order" @tap="toOrderList">我的订单</text>里查看订单详情</view>
      <view class="btns">
        <text class="button checkorder" @tap="toOrderList">查看订单</text>
        <text class="button shopcontinue" @tap="toCategory">继续购物</text>
      </view>
    </view>
  </view>
</template>

<script>
import util from "@/utils/util.js";
export default {
  components: {},
  props: {},
  data() {
    return {
      sts: 0,
      orderNumbers: "",
      selPayType: "",
      orderType: "", // 订单类型 1团购 2秒杀
      hadUpload: false,
      ordermold: "", // 1虚拟商品
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      sts: options.sts,
      orderNumbers: options.orderNumbers,
      orderType: options.orderType,
      ordermold: options.ordermold,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 设置头部导航标题
    uni.setNavigationBarTitle({
      title: '支付结果'
    });
    if (this.sts == 1) {
      if (!this.hadUpload) {
        util.tapLog(null, this.orderNumbers, true);
        this.hadUpload = true;
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.hadUpload = false;
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { },
  methods: {
    toOrderList: function () {
      let paySts = this.sts == 0 ? 1 : 2;
      if (this.orderType == 1 || this.ordermold == 1) {
        // 1团购 || orderMold=1虚拟商品
        paySts = 0;
      }
      paySts = 0;
      this.$Router.replace({
        path: "/package-user/pages/order-list/order-list",
        query: { sts: paySts },
      });
    },
    // 继续购物
    toCategory: function () {
      uni.switchTab({
        url: "/pages/category/category",
      });
    },
    payAgain: function () {
      this.$Router.replace({
        path: "/package-pay/pages/pay-way/pay-way",
        query: { orderNumbers: this.orderNumbers },
      });
    },
  },
};
</script>
<style>
@import "./pay-result.css";
</style>
