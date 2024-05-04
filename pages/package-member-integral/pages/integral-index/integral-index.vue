<template>
  <!-- 青春豆商城 -->
  <view class="Mall4j integral-index">
    <view class="integral-msg">
      <view class="my-integral">
        <view class="number-box">
          <view class="text">我的青春豆</view>
          <view class="number">{{ score ? score : 0 }}</view>
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
        <view class="item" v-for="item in 1">
          <image src="/static/clothes.png" />
          <view @tap="exchange">
            <text>衣服优惠券</text>
          </view>
        </view>
      </view>
      <!-- <view v-if="!scoreProdList.length" class="empty"> 暂无数据 </view> -->
      <!-- 空列表或加载全部提示 -->
      <!-- <EmptyAllTips v-if="true" :isEmpty="!scoreProdList.length" :isAll="scoreProdList.length > 10 && loadAll" /> -->
    </view>
    <view class="member-growth">
      <view class="member-tit">
        公告：
      </view>
      <view class="content">
        <view class="content-text">
          为方便家人们兑换礼品，已领取的衣服卡和万能卡做如下变更:
        </view>
        <view class="content-text">
          ① 衣服卡变换成青春豆，一张衣服卡等于一个青春豆，请在首页☞青春豆兑换区查看；
        </view>
        <view class="content-text">
          ② 万能卡变换成代金券，一张万能卡等于0.3元代金券，请在个人中心的优惠券中查看。
          如果有青春豆或代金券数量对不上的可以联系团长。
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const http = require("@/utils/http.js");
const util = require("@/utils/util.js");
export default {
  components: {
  },
  props: {},
  data() {
    return {
      current: 1,
      size: 20,
      scoreProdList: [],
      score: null,
      pages: "",
      loadAll: false, // 已加载全部
      isLoaded: false,
    };
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    uni.setNavigationBarTitle({
      title: '青春豆中心',
    });
    this.getScore()
  },
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
    // 跳转到青春豆明细
    toIntegralDetailsPage() {
      uni.navigateTo({ url: '/pages/package-member-integral/pages/integral-details/integral-details?score=' + this.score })
    },

    // 兑换
    exchange: util.debounce(function () {
      const params = {
        url: "/pub/user/integral/exchange",
        method: "POST",
        data: JSON.stringify({ userId: uni.getStorageSync('bbcUserInfo').id }),
        callBack: (res) => {
          uni.showToast({
            title: '兑换成功',
            icon: 'none'
          })
          this.getScore()
        }
      }
      http.request(params);

    }, 1000),
    // 获取用户青春豆数量
    getScore() {
      const params = {
        url: "/pub/user/integral",
        method: "post",
        data: {
          sign: 'qcsd',
          data: JSON.stringify({
            userId: uni.getStorageSync('bbcUserInfo').id
          })
        },
        callBack: (res) => {
          this.score = res.score
        },
      };
      http.request(params);
    }
  },
};
</script>
<style>
@import "./integral-index.css";
</style>
