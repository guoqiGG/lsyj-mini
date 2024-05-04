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
          <image
            src="https://qingchuntai2.oss-cn-beijing.aliyuncs.com/2024/05/04/a2f9f7e1-8f89-4998-8a1d-187ec5e82889%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20240504161638.jpg" />
          <view @tap="exchange">
            <text v-if="scoreNumber">衣服优惠券(需{{ scoreNumber }}豆)</text>
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
          为方便家人们兑换礼品，已领取的衣服卡和积分做如下变更:
        </view>
        <view class="content-text">
          ①衣服卡变换成青春豆，一张衣服卡等于一个青春豆；
        </view>
        <view class="content-text">
          ②小鹅通积分变换成青春豆，一个积分等于一个青春豆；
        </view>
        <view class="content-text">
          ③青春豆兑换的优惠券在“优惠券”中查询
        </view>
        <view class="content-text">
          如果有青春豆数量对不上的可以联系团长。
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
      scoreNumber: null
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
    this.getExchangeScore()
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
            icon: 'none',
            duration: 3000
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
    },
    // 获取衣服券需要多少豆兑换
    getExchangeScore() {
      const params = {
        url: "/test/user/integral",
        method: "get",
        callBack: (res) => {
          this.scoreNumber = res
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
