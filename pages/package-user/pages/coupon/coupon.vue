<template>
  <!-- 我的优惠券 -->
  <view class="Mall4j container">
    <view class="h-tabs">
      <!-- 0待使用 1已使用 2已过期 -->
      <view :class="'h-tab ' + (status == 0 ? 'on' : '')" data-status="0" @tap="changeTab">未使用</view>
      <view :class="'h-tab ' + (status == 1 ? 'on' : '')" data-status="1" @tap="changeTab">使用记录</view>
      <view :class="'h-tab ' + (status == 2 ? 'on' : '')" data-status="2" @tap="changeTab">已过期</view>
    </view>
    <view class="coupons">
      <block v-for="(item, index) in couponList" :key="index">
        <coupon :data-couponid="item.couponId" :can-use="status == 0" :coupon-item="item" :status="status"
          :my-coupon="true" />
      </block>
    </view>

    <!-- 空列表或加载全部提示 -->
    <EmptyAllTips v-if="isLoaded" :isEmpty="!couponList.length || couponList == []" :emptyTips="i18n.couponTips"
      :isAll="isAll" />
  </view>
</template>

<script>
const http = require('@/utils/http.js')
import coupon from '@/components/coupon/index.vue'
export default {
  components: {
    coupon
  },
  props: {},
  data() {
    return {
      status: 0,
      couponList: [],
      pages: 1,
      current: 1,
      pageSize: 20,
      isLoaded: false,
      userId: 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    uni.setNavigationBarTitle({
      title: '我的优惠券'
    })
    if (uni.getStorageSync('bbcUserInfo')) {
      this.userId = uni.getStorageSync('bbcUserInfo').id
    }
    this.loadMyCouponData(this.status)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    if (this.current < this.pages) {
      this.loadOrderData(this.sts, this.current + 1)
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.current < this.pages) {
      this.current = this.current + 1
      this.loadMyCouponData(this.status)
    } else {
      this.isAll = true
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { },
  methods: {
    /**
     * 获取我的优惠券列表
     */
    loadMyCouponData(status) {
      this.isLoaded = false
      // 我的优惠券状态(status优惠券状态 0待使用 1已使用 2已过期)
      let data = {
        pageNo: this.current,
        pageSize: this.pageSize,
        userId: this.userId,
        status: status
      }
      const params = {
        url: '/pub/user/coupon/list',
        method: 'POST',
        data: {
          sign: 'qcsd',
          data: JSON.stringify(data)
        },
        callBack: (res) => {
          this.isLoaded = true
          this.couponList = this.current == 1 ? res.list : this.couponList.concat(res.list)
          this.pages = res.total == 0 ? 1 : Math.ceil(res.total / this.pageSize)
        }
      }
      http.request(params)
    },

    /**
     *  标签切换事件
     */
    changeTab(e) {
      // this.current = 1
      console.log(e, 'eeeeeeeeeeeeeeeeeeee')
      this.status = e.currentTarget.dataset.status
      this.current = 1
      this.pages = 1
      this.couponList = []

      this.loadMyCouponData(this.status)
    }
  }
}
</script>
<style>
@import "./coupon.css";
</style>