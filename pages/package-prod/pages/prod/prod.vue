<template>
  <view class="container">
    <view class="image-view">
      <image :src="categoryImg" mode="widthFix" @error="handlePicError" />
    </view>
    <view class="prod-con">
      <view class="prod-name">银水杯</view>
      <view class="price"></view>
    </view>
  </view>
</template>

<script>
const http = require("@/utils/http.js");
const config = require("@/utils/config.js");
export default {
  props: {},
  data() {
    return {

    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
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
      title: '商品详情',
    });
  },

  /**
   * 页面相关事件处理函数--监听页面隐藏
   */
  onHide: function () {

  },
  methods: {
    // 获取商品信息
    getProdInfo() {
      this.activityInfo = {};
      let userId = null;
      if (uni.getStorageSync("bbcToken") && uni.getStorageSync("bbcUserInfo")) {
        userId = uni.getStorageSync("bbcUserInfo").userId;
      }
      uni.showLoading({
        // title: this.i18n.desperatelyBuying,
        // #ifndef MP-TOUTIAO
        mask: true,
        // #endif
      });
      const params = {
        url: "/prod/prodInfo",
        method: "GET",
        data: {
          prodId: this.prodId,
          userId,
        },
        callBack: (res) => {
          uni.hideLoading();
          this.prodInfo = res;
          var imgStrs = res.imgs;
          var imgs = imgStrs ? imgStrs.split(",") : [];

          imgs.forEach((e, i) => {
            if (e.indexOf("http") === -1) {
              imgs[i] = config.picDomain + "/" + e;
            }
          });
          this.prodInfo.imgs = imgs;
          this.prodInfo.pic =
            res.pic.indexOf("http") === -1
              ? config.picDomain + "/" + res.pic
              : res.pic;
          // if (!imgs) {
          //   imgs = ["/static/images/icon/def.png"];
          // }
          var content = util.formatHtml(res.content);
          const lowPrice = Math.min.apply(
            Math,
            res.skuList.map((item) => item.price)
          );
          const skuId = res.skuList.find(
            (item) => lowPrice === item.price
          ).skuId;
          let prodType = res.prodType;
          // 拼团平台下架判断
          if (prodType === 1 && !res.groupActivityVO) {
            prodType = 0;
          }
          console.log(res.skuList);
          console.log(imgs);
          this.setData({
            imgs: imgs,
            content: content,
            price: res.price,
            prodName: res.prodName,
            prodId: res.prodId,
            brief: res.brief,
            totalStocks: res.totalStocks,
            prodGroup: res.categoryId,
            // skuList: res.prodType === 2 && res.seckillVO ? res.seckillVO.seckillSkuList : res.prodType === 1 && res.groupActivityVO ? res.groupActivityVO.groupSkuList : res.skuList,
            skuList: res.skuList,
            skuId: skuId,
            skuLoad: true,
            pic:
              res.pic.indexOf("http") === -1
                ? config.picDomain + "/" + res.pic
                : res.pic,
            soldNum: res.soldNum,
            shopId: res.shopId,
            prodType: prodType, // 商品类型(0普通商品 1拼团 2秒杀 3青春豆 5活动商品)
            mold: res.mold, // 1虚拟商品
            deliveryModeVO: res.deliveryModeVO, // 配送方式
            liveRoomParams: res.liveRoomParams, // 直播列表
            preSellStatus: res.preSellStatus, // 预售状态 1：开启 0：未开启
            giveawayList: res.giveaway ? res.giveaway.giveawayProds : [], // 赠品商品栏
            comboList: res.comboList || [], // 套装商品列表
            preSellTime: res.preSellTime, // 预售发货时间
            isRefund: res.isRefund, // 0不支持退款 1支持退款
            writeOffTime: res.writeOffTime, // 核销有效期 -1.长期有效 0.自定义 x.x天内有效
            writeOffNum: res.writeOffNum, // 核销次数 -1.多次核销 0.无需核销 1.单次核销
            writeOffStart: res.writeOffStart, // 核销有效期开始时间
            writeOffEnd: res.writeOffEnd, // 核销有效期结束时间
            waterSoldNum: res.waterSoldNum ? res.waterSoldNum : 0, // 注水销量 （假销量）
            prodParameterList: res.prodParameterList,
            defaultPrice: res.price,
          });
          if (res.mold === 1) {
            this.virtualInfo = {
              virtualRemarks: res.virtualRemark
                ? JSON.parse(res.virtualRemark)
                : [], // 留言
              isRefund: res.isRefund, // 0不支持退款 1支持退款
              writeOffTime: res.writeOffTime, // 核销有效期 -1.长期有效 0.自定义 x.x天内有效
              writeOffNum: res.writeOffNum, // 核销次数 -1.多次核销 0.无需核销 1.单次核销
              writeOffStart: res.writeOffStart, // 核销有效期开始时间
              writeOffEnd: res.writeOffEnd, // 核销有效期结束时间
              prodParameterList: res.prodParameterList,
            };
          }

          this.preSellTime = res.preSellTime;
          // 初始化视频
          if (res.video) {
            this.$nextTick(() => {
              this.videoContext = uni.createVideoContext("myVideo", this);
            });
          }
          // 团购商品
          if (res.prodType === 1 && res.groupActivityVO) {
            if (res.groupActivityVO.activityStatus <= 2) {
              this.setData({
                activityInfo: res.groupActivityVO,
                groupActivityId: res.groupActivityVO.groupActivityId,
              });
              if (res.groupActivityVO.hasGroupTip) {
                this.getJoinGroupList();
              }
            }
          }
          if (res.prodType === 2 && res.seckillVO) {
            const nTime = new Date().getTime();
            const sTime = new Date(
              res.seckillVO.startTime.replace(/-/g, "/")
            ).getTime();
            const eTime = new Date(
              res.seckillVO.endTime.replace(/-/g, "/")
            ).getTime();
            res.seckillVO.activityStatus =
              nTime < sTime ? 1 : nTime < eTime ? 2 : 3;
            this.activityInfo = res.seckillVO;
          }

          if (!this.popupShow) {
            // 获取优惠券
            // this.getCouponList()
          }
          if (res.prodType !== 3) {
            // 获取店铺信息
            // this.getShopInfo();
          }
          // 把访问的商品分类写进缓存,用作推荐列表的参数
          uni.setStorageSync("bbcBrowseCategoryId", res.categoryId);

          if (uni.getStorageSync("bbcToken") && res.prodType !== 3) {
            // this.prodBrowseLog()
          }
          this.hadOnloaded = true;

          // #ifdef H5
          if (this.isWechat) {
            this.onShareWay(false);
          }
          // #endif
        },
        errCallBack: (err) => {
          uni.hideLoading();
          if (err.code === "A00001") {
            uni.showModal({
              title: this.i18n.tips,
              content: err.msg,
              showCancel: false,
              cancelText: this.i18n.cancel,
              confirmText: this.i18n.confirm,
              success: (res) => {
                if (res.confirm) {
                  getCurrentPages().length > 1
                    ? uni.navigateBack()
                    : util.toHomePage();
                }
              },
            });
          }
          this.hadOnloaded = true;
        },
      };
      http.request(params);
    },
    /**
* 图片加载失败时，现实默认图片
*/
    handlePicError() {
      this.categoryImg = '../../static/def.png'
    },
  },
};
</script>
<style>
@import "./prod.css";
</style>
