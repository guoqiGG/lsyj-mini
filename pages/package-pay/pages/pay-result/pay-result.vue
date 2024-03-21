<template>
  <view class="container">
    <!-- 失败 -->
    <view v-if="sts == 0" class="pay-fail">
      <view class="img">
        <image src="/static/pay-fail.png" mode=""></image>
      </view>
      <view class="pay-sts fail">支付失败，请重新支付</view>
      <view class="order-detail-title">订单信息</view>
      <view class="tips">
        该订单会为您保留
        <text class="warn">5分钟</text>
        ,<text class="tips">5分钟之后如果还未付款,系统将自动取消该订单</text>
      </view>

      <view class="btns">
        <text class="button checkorder" @tap="toOrderList">查看订单</text>
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
export default {
  components: {},
  props: {},
  data() {
    return {
      sts: 0,
      orderNumbers: "",
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      sts: options.sts,
      orderNumbers: options.orderNumbers,
    });
  },

  methods: {
    toOrderList: function () {
      uni.navigateTo({
        url: "/pages/package-user/pages/order-list/order-list?id=0"
      });
    },
    // 继续购物
    toCategory: function () {
      uni.switchTab({
        url: "/pages/category/category",
      });
    },
  },
};
</script>
<style>
@import "./pay-result.css";
</style>
