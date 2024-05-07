<template>
  <!-- 青春豆商城 -->
  <view class=" integral-index">
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
        <view class="text">青春豆兑换<text class="bulletin" @tap="popShow">(☞兑换须知)</text></view>
      </view>
      <view class="con-box">
        <view class="item" v-for="item in exchangeList" :key="item.id">
          <image :src="item.url" />
          <view class="desc"> <text>{{ item.name }}{{ item.type === 2 ? '价值' + item.key + '元' : '' }} (需{{ item.value
              }}豆)</text>
          </view>
          <view class="button" @tap="exchange(item.id, item.type)">
            <text>立即兑换</text>
          </view>
        </view>
      </view>
      <!-- <view v-if="!scoreProdList.length" class="empty"> 暂无数据 </view> -->
      <!-- 空列表或加载全部提示 -->
      <!-- <EmptyAllTips v-if="true" :isEmpty="!scoreProdList.length" :isAll="scoreProdList.length > 10 && loadAll" /> -->
    </view>

    <uv-popup ref="popup" mode="center" bgColor="none">
      <view class="member-growth">
        <image class="bg-2" src="/static/bulletin-bg-2.png" />
        <image class="bg-3" src="/static/bulletin-bg-3.png" />
        <view class="title">欢迎体验</view>
        <view class="con">
          <view class="member-tit">
            公告
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
        <view class="close" @tap="close">×</view>
      </view>
    </uv-popup>
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
      exchangeList: [],
      show: false
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
    this.getExchangeList()
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
    popShow() {
      this.$refs.popup.open('center');
    },
    close() {
      this.$refs.popup.close()
    },
    goHome() {
      util.toHomePage()
    },
    // 跳转到青春豆明细
    toIntegralDetailsPage() {
      uni.navigateTo({ url: '/pages/package-member-integral/pages/integral-details/integral-details?score=' + this.score })
    },

    // 兑换
    exchange: util.debounce(function (id, type) {
      const params = {
        url: "/pub/exchange/get",
        method: "POST",
        data: JSON.stringify({ userId: uni.getStorageSync('bbcUserInfo').id, id: id, type: type }),
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
    // 获取兑换列表
    getExchangeList() {
      const params = {
        url: "/pub/exchange/list",
        method: "post",
        data: JSON.stringify({
          pageSize: 10000000,
          pageNo: 1
        }),
        callBack: (res) => {
          this.exchangeList = res.list
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
<style lang="scss" scoped>
/deep/ .uv-popup .uv-popup__content {
  overflow: visible !important;
}
</style>