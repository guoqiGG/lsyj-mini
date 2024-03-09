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
      <view class="prod-select-number-right">
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

  </view>
</template>
<script>
export default {
  data() {
    return {
    }
  },
  methods: {
    /**
* 图片加载失败时，现实默认图片
*/
    handlePicError() {
      this.categoryImg = '../../static/def.png'
    },
  },
}
</script>
<style>
@import './prod.css'
</style>