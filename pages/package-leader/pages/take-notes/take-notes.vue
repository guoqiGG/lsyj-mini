<template>
  <view class="Mall4j container">
    <view class="take-notes">
      <view class="total">
        <text>总提现：</text>
        <text class="total-num">￥2.00</text>
      </view>
      <block v-for="(item, id) in 10" :key="id">
        <view class="items">
          <view class="left">
            <view  class="text">线下打款</view>
            <!-- <view  class="text">线上打款</view> -->
            <view class="date">2024-03-08 17:07:11</view>
          </view>
          <view class="right">
            <view class="number">+ {{ toPrice(item.amount) }}</view>
            <view v-if="item.state == -1" class="status">回退</view>
            <view v-if="item.state == 0" class="status">提现中</view>
            <view v-if="item.state == 1" class="status">提现成功</view>
            <view v-if="item.state == 2" class="status">拒绝提现</view>
          </view>
        </view>
      </block>
      <!-- 空列表或加载全部提示 -->
      <EmptyAllTips v-if="isLoaded" :isEmpty="!records.length" :emptyTips="noWithdrawalRecord" :isAll="totalPage > 1"
        :allTips="loadingMsg" />
    </view>
  </view>
</template>
<script>
const http = require('@/utils/http.js')
export default {
  components: {},
  props: {},
  data() {
    return {
      totalWithdrawCash: 0,
      records: [],
      loadingMsg: '',
      emptyMsg: '',
      totalPage: 1,
      pageNum: 1,
      current: '',
      isLoaded: false,
      noWithdrawalRecord: '还没有提现记录哦~'
    }
  },

  computed: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadingMsg = '加载中'
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 头部导航标题
    uni.setNavigationBarTitle({
      title: '提现记录'
    })

    // this.getTotalWithdrawCash()
    // this.loadPageData(1)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    if (this.current < this.pages) {
      this.setData({
        current: this.current + 1
      })
      this.getWithdrawCashPage()
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.pageNum < this.totalPage) {
      this.loadPageData(this.pageNum + 1)
    }
  },
  methods: {
    /**
     * 获取提现总金额
     */
    getTotalWithdrawCash: function () {
      var ths = this
      const params = {
        url: '/p/distribution/withdrawCash/totalWithdrawCash',
        method: 'GET',
        // data: {
        //   shopId: 1
        // },
        callBack: function (res) {
          ths.setData({
            totalWithdrawCash: res
          })
        }
      }
      http.request(params)
    },

    /**
     * 分页获取提现记录
     */
    loadPageData: function (pageNum) {
      this.isLoaded = false
      var ths = this
      const params = {
        url: '/p/distribution/withdrawCash/page',
        method: 'GET',
        data: {
          // shopId: 1,
          current: pageNum,
          size: 20
        },
        callBack: (res) => {
          this.isLoaded = true
          var records = []

          if (res.current == 1) {
            records = res.records
          } else {
            records = this.records.concat(res.records)
          }
          var loadingMsg = this.loadingMsg
          if (pageNum == res.pages) {
            loadingMsg = '没有更多了~'
          }
          ths.setData({
            records: records,
            totalPage: res.pages,
            pageNum: pageNum,
            loadingMsg: loadingMsg,
            emptyMsg: '还没有提现记录哦~'
          })
        }
      }
      http.request(params)
    }
  }
}
</script>
<style>
@import "./take-notes.css";
</style>
