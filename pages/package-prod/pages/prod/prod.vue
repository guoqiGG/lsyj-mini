<template>
  <view class="container">
    <view class="image-con">
      <image class="image" src="/static/def.png" mode="aspectFit" @error="handlePicError" />
    </view>
    <view class="prod-content">
      <view class="prod-name">银水杯</view>
      <view class="price">
        <text class="symbol">￥</text>
        <text class="big-num">11</text>
        <text class="small-num">.22</text>
      </view>
      <view class="prod-number">仅剩<text class="red">xx</text>件</view>
    </view>
    <view class="prod-select-number">
      <view class="prod-select-number-left">
        <view class="has-select-text">已选</view>
        <view class="has-select-number">1件</view>
      </view>
      <view class="prod-select-number-right" @tap="openSkuPopup">
        ...
      </view>
    </view>

    <view class="footer">
      <view class="con">
        <view class="left">
          <image src="/static/tabbar/uncheck-home.png" mode="scaleToFill" />
          <view class="text">首页</view>
        </view>
        <view class="right">
          <view class="buy-now">立即购买</view>
        </view>
      </view>
    </view>
    <!-- 规格 弹出层 -->
    <view class="sku-con">
      <u-popup :show="skuShow">
        <view class="close" @tap="closeSkuPopup">
          <image class="close-img" src="/static/close.png" />
        </view>
        <view class="con-container">
          <view class="sku-info">
            <view class="sku-info-left">
              <image class="image" src="/static/def.png" mode="aspectFit" @error="handlePicError" />
            </view>
            <view class="sku-info-right">
              <view class="price">
                <text class="symbol">￥</text>
                <text class="big-num">11</text>
                <text class="small-num">.22</text>
              </view>
              <view class="select-number">已选：<text class="number">1件</text></view>
              <view class="stock">库存：<text class="stock-number">714</text></view>
            </view>
          </view>
          <view class="select-number-con">
            <view class="number-title"><text>数量</text></view>
            <view class="number-con">
              <view class="minus" @tap="numberValueMinus">-</view>
              <input class="input" type="number" min="1" :value="numberValue" />
              <view class="add" @tap="numberValueAdd">+</view>
            </view>
          </view>
          <view class="buy-now"><text>立即购买</text></view>
        </view>
      </u-popup>
    </view>

  </view>
</template>
<script>
export default {
  data() {
    return {
      skuShow: true,//规格弹窗显示
      numberValue: 1,// 选择件数默认为 1
    }
  },
  methods: {

    /**
* 图片加载失败时，现实默认图片
*/
    handlePicError() {
      this.categoryImg = '../../static/def.png'
    },
    // 打开规格弹窗
    openSkuPopup() {
      this.skuShow = true
    },
    // 关闭规格弹窗
    closeSkuPopup() {
      this.skuShow = false
    },
    // 减少数量
    numberValueMinus() {
      this.numberValue = this.numberValue <= 1 ? 1 : this.numberValue - 1
    },
    // 增加商品数量
    numberValueAdd() {
      this.numberValue = this.numberValue + 1
    },
  },
}
</script>
<style>
@import './prod.css'
</style>