<template>
  <view :class="' coupon-item ' + (canUse ? '' : 'gray')">
    <view class="left">
      <view class="num"><text style="font-size: 28rpx;">￥</text><text class="coupon-price">
          <text>{{ parsePrice(item.couponAmount)[0] }}</text>
          <text class="small">.{{ parsePrice(item.couponAmount)[1] }}</text>
        </text>
      </view>
      <view class="coupon-condition"  v-if="item.fullAmount&&item.typeList && (item.typeList).includes(4)">满{{item.fullAmount}}元可用</view>
    </view>
    <view class="right">
      <view class="c-des">
        <text>
          <text class="c-type">平台</text>
          <text>{{ item.couponName }}</text>
        </text>
        <view class="rule"  v-if="item.type == 0">全部分类可用</view>
       <view class="rule"  v-if="item.typeList && (item.typeList).includes(1)" >指定分类不可用</view>
       <view class="rule" v-if="item.typeList && (item.typeList).includes(2)">指定商品不可用 </view>
        <view class="rule" v-if="item.typeList && (item.typeList).includes(3)">指定商品可用</view>
        <view v-if="item && update" class="c-date">
          <view v-if="showTimeType == 1 && item.validTimeType == 2" class="c-data-info">{{ '领券' + ' ' }}{{
    item.validDays }}天后失效</view>
          <view v-else class="c-data-info">{{ item.createTime }}</view>
          <view v-if="item.canReceive && !order" class="c-btn" @tap="receiveCoupon">立即领取</view>
          <view v-if="item.canUse == false && !order" class="no-use-btn" @tap="receiveCoupon">立即领取</view>
        </view>
        <view v-if="order && canUse" class="sel-btn">
          <checkbox color="#eb2444" :data-couponid="item.couponId" :checked="item.choose" @tap="checkCoupon" />
        </view>
      </view>
      <!-- 我的优惠券状态(优惠券状态 0:失效 1:有效 2:使用过) -->
	  <!-- 0待使用 1已使用 2已过期 -->
      <!-- 已使用 -->
      <image v-if="status == 1 && myCoupon" class="tag-img" src="/static/coupon-used.png" />
      <!-- 已过期 -->
      <image v-if="status == 2 && myCoupon" class="tag-img" src="/static/coupon-ot.png" />
    </view>
  </view>
</template>

<script>
const http = require('@/utils/http.js')
const util = require('@/utils/util.js')

export default {

  components: {},
  props: {
    // item: Object,
    couponItem: Object,
    status: [Number, String],
    order: Boolean,
    canUse: Boolean,
    index: Number,
    showTimeType: Number,
    myCoupon: Boolean
  },
  data() {
    return {
      stsType: 4,
      item: this.couponItem, // 领券操作会直接修改父组件传递的数据引起报错,这个用来存数据
      update: true, // 组件内部数据改变不触发视图重绘,这个用来手动重绘
    }
  },

  computed: {
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  beforeMount: function () {
  },
  methods: {
    /**
     * 调整金额格式
     */
    parsePrice(val) {
      if (!val) {
        val = 0
      }
      return val.toFixed(2).split('.')
    },
    receiveCoupon(e) {
      util.checkAuthInfo(() => {
        var couponId = this.item.couponId
        http.request({
          url: '/p/myCoupon/receive',
          method: 'POST',
          data: couponId,
          callBack: (res) => {
            this.update = false
            var coupon = this.item
            coupon.canReceive = false
            this.setData({
              item: coupon
            })
            uni.showToast({
              title: res,
              // #ifndef MP-TOUTIAO
              mask: true
              // #endif
            })
            this.update = true
          }
        })
      })
    },

    checkCoupon(e) {
      this.$emit('checkCoupon', {
        couponId: e.currentTarget.dataset.couponid
      })
    },

    /**
     * 立即使用
     */
    useCoupon() {
      util.checkAuthInfo(() => {
        var url = '/package-prod/pages/prod-classify/prod-classify?sts=' + this.stsType
        var id = this.item.couponId
        var title = '优惠券活动商品'
        if (id) {
          url += '&tagid=' + id + '&title=' + title
        }

        uni.navigateTo({
          url: url
        })
      })
    }

  }
}
</script>
<style>
@import "./index.css";
</style>
