<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j container">
    <view class="img">
      <image src="/static/images/icon/pay-success.png" mode=""></image>
    </view>
    <view class="pay-success">
      <view class="pay-det">
        <view class="text">支付成功</view>
        <view class="pay-success">支付成功，您可以去<text class="my-order" @tap="toOrderList">我的订单</text>里查看订单详情</view>
      </view>
      <view class="pay-bottom">
        <view class="other-action">
          <view class="item" @tap="toCategory">继续购物</view>
          <view class="item bl" @tap="viewCodePop">查看提货码</view>
        </view>
      </view>
    </view>

    <!-- 查看提货码 -->
    <view class="popup-hide" :hidden="!showCodePop">
      <view class="popup-mask" @tap="closePopup" />
      <view class="code-box">
        <view class="con-tit">提 货 码</view>
        <view class="address">
          <view class="item">
            <view class="label">提货地址：</view>
            <view class="det">{{ stationInfo.stationAddress }}</view>
          </view>
          <view class="item">
            <view class="label">提货时间：</view>
            <view class="det">{{ stationInfo.stationTime }}</view>
          </view>
        </view>
        <view class="code">
          <image :src="stationQrCode" />
        </view>
        <view class="code-num">{{ stationInfo.stationCode }}</view>
        <view class="code-btn" @tap="closePopup">我知道了</view>
      </view>
    </view>
  </view>
</template>

<script>
const http = require("@/utils/http.js");
const util = require("@/utils/util.js");
var Qr = require("@/utils/wxqrcode");
export default {
  data() {
    return {
      showCodePop: false, // 选择提货时间弹窗
      stationInfo: {}, // 自提点信息
      stationQrCode: "", // 提货码二维码
      orderNumbers: "",
      actualTotal: 0, // 实际金额
      getStatusS: null,
      status: 0,
      getNum: 1,
      // orderSts  订单状态
      orderSts: 7,
    };
  },

  computed: {
  },

  onShow: function () {
    // 头部导航标题
    uni.setNavigationBarTitle({
      title: '支付成功'
    });
    if (this.showCodePop) {
      this.getStatus();
    }
  },

  onLoad: function (options) {
    if (options.orderNumbers) {
      this.orderNumbers = options.orderNumbers;
    }
    this.queryActualTotal();
  },

  onHide() {
    if (this.getStatusS) {
      clearInterval(this.getStatusS);
    }
  },

  onUnload() {
    if (this.getStatusS) {
      clearInterval(this.getStatusS);
    }
  },

  methods: {
    viewCodePop() {
      this.setData({
        showCodePop: true,
      });
      this.queryStationInfo();
      this.getStatus();
    },
    closePopup: function () {
      this.setData({
        showCodePop: false,
      });
      clearInterval(this.getStatusS);
    },

    // 获取订单提货状态
    getStatus() {
      var ths = this;
      const params = {
        url: "/p/myOrder/getOrderStatus",
        method: "GET",
        selfLoading: true,
        data: {
          orderNumber: this.orderNumbers,
        },
        callBack: function (res) {
          if (ths.getNum === 1) ths.status = res.status;
          ths.getNum++;
          if (res.status !== ths.status) {
            ths.status = res.status;
            clearInterval(ths.getStatusS);
            ths.toOrderDetail();
          }
          if (
            res.refundStatus === 1 ||
            res.refundStatus === 2 ||
            res.status >= 3
          ) {
            clearInterval(ths.getStatusS);
          }
        },
      };
      if (this.getStatusS) {
        clearInterval(this.getStatusS);
      }
      this.getStatusS = setInterval(() => {
        http.request(params);
      }, 1000);
    },

    // 前往订单页面
    toOrderDetail() {
      this.$Router.push({
        path: `/package-user/pages/order-detail/order-detail?orderNum=${this.orderNumbers}`,
      });
    },

    /**
     * 请求实付金额
     */
    queryActualTotal: function () {
      const params = {
        url: "/p/myOrder/orderDetail",
        method: "GET",
        data: {
          orderNumber: this.orderNumbers,
        },
        callBack: (res) => {
          this.orderSts = res.status;
          this.actualTotal = res.actualTotal;
        },
      };
      http.request(params);
    },

    /**
     * 请求自提点数据
     */
    queryStationInfo: function () {
      const params = {
        url: "/p/myStationOrder/stationDetail",
        method: "GET",
        data: {
          orderNumber: this.orderNumbers,
        },
        callBack: (res) => {
          this.stationInfo = res;
          this.getQrcode(res.stationCode);
        },
      };
      http.request(params);
    },

    /**
     * 生成二维码
     */
    getQrcode: function (stationCode) {
      this.stationQrCode = Qr.createQrCodeImg(stationCode);
    },

    // 继续购物
    toCategory: function () {
      uni.switchTab({
        url: "/pages/category/category",
      });
    },

    // 查看详情
    toOrderList: function () {
      // uni.navigateTo({
      // 	url: '/pages/order-list/order-list?sts=0'
      // });
      this.$Router.push({
        path: "/package-user/pages/order-list/order-list",
        query: { sts: 0 },
      });
    },
  },
};
</script>

<style>
@import "./pay-success.css";
</style>
