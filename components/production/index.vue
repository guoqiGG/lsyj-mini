<template>
  <view class="Mall4j prod-items" @tap="toProdPage">
    <view class="hot-imagecont">
      <image v-if="item.thumbail" :src="srcToShow" class="hotsaleimg" mode="aspectFit" @error="handlePicError" />
      <image v-else src="/static/def.png" mode="aspectFit" class="hotsaleimg" />
    </view>
    <view class="hot-text">
      <view>
        <view class="hotprod-text">
          {{ item.name }}
        </view>
      </view>
      <view class="prod-text-info" :class="{ 'collection-row': showCancelCollect }">
        <view class="price">
          <text class="symbol">￥</text>
          <text class="big-num">{{ parsePrice(item.price)[0] }}</text>
          <text class="big-num">.{{ parsePrice(item.price)[1] }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const http = require('@/utils/http.js')
const util = require("@/utils/util.js");
export default {
  components: {},
  props: {
    item: {
      type: Object,
      default: () => { }
    },
  },
  data() {
    return {
      isPicError: false,
      sub: 10
    }
  },

  computed: {
    srcToShow() {
      return this.isPicError ? '../../static/def.png' : this.item.thumbail
    }
  },
  /**
     * 生命周期函数--监听页面加载
     */
  created() {
  },

  methods: {
    /**
     * 图片加载失败时显示默认图片
     */
    handlePicError() {
      this.isPicError = true
    },
    toProdPage() {
      let prodId = this.item.goodsId
      uni.navigateTo({ url: '/pages/package-prod/pages/prod/prod?prodId=' + prodId })
    },
  }
}
</script>
<style>
@import "./index.css";
</style>
