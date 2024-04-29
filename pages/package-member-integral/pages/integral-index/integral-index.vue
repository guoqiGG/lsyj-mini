<template>
  <!-- 青春豆商城 -->
  <view class="Mall4j integral-index">
    <view class="integral-msg">
      <view class="my-integral">
        <view class="number-box">
          <view class="text">我的青春豆</view>
          <view class="number">{{ userInfo.score ? userInfo.score : 0 }}</view>
        </view>
        <view class="det" @tap="toIntegralDetailsPage">明细
        </view>
      </view>
    </view>
    <view class="integral-list">
      <view class="member-tits">
        <view class="text">青春豆兑换</view>
      </view>
      <view class="con-box">
        <block v-for="(prod, prodId) in scoreProdList" :key="prodId">
          <!-- <goodsitem :prod="prod" /> -->
        </block>
      </view>
      <!-- <view v-if="!scoreProdList.length" class="empty"> 暂无数据 </view> -->
      <!-- 空列表或加载全部提示 -->
      <EmptyAllTips v-if="true" :isEmpty="!scoreProdList.length" :isAll="scoreProdList.length > 10 && loadAll" />
    </view>
  </view>
</template>

<script>
const http = require("@/utils/http.js");
// import goodsitem from "../../components/integral-goods-list/index.vue";
export default {
  components: {
    // goodsitem,
  },
  props: {},
  data() {
    return {
      current: 1,
      size: 20,
      scoreProdList: [],
      scoreInfo: "",
      pages: "",
      loadAll: false, // 已加载全部
      isLoaded: false,
      userInfo: {}
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getScoreProdList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    uni.setNavigationBarTitle({
      title: '青春豆中心',
    });
    this.userInfo = uni.getStorageSync('bbcUserInfo')
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
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.current < this.pages) {
      this.current = this.current + 1;
      this.getScoreProdList();
    } else {
      this.setData({
        loadAll: true,
      });
    }
  },
  methods: {
    // 跳转到氢春豆明细
    toIntegralDetailsPage() {
      uni.navigateTo({ url: '/pages/package-member-integral/pages/integral-details/integral-details' })
    },
    /**
     * 获取青春豆商品列表
     */
    getScoreProdList() {
      this.isLoaded = false;
      var param = {
        url: "/search/page",
        method: "GET",
        data: {
          current: this.current,
          size: this.size,
          prodType: 3,
          sort: 2,
          userId: uni.getStorageSync("bbcUserInfo")
            ? uni.getStorageSync("bbcUserInfo").userId
            : "",
        },
        callBack: (res) => {
          this.isLoaded = true;
          var scoreProdList = [];
          if (this.current == 1) {
            this.setData({
              scoreProdList: res.records[0].products,
              pages: res.pages,
            });
          } else {
            scoreProdList = this.scoreProdList;
            scoreProdList.push(...res.records[0].products);
            this.setData({
              scoreProdList,
            });
          }
        },
      };
      http.request(param);
    },
  },
};
</script>
<style>
@import "./integral-index.css";
</style>
