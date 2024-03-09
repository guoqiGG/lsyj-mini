<template>
  <!-- 商品详情 -->
  <view :class="['Mall4j contenta', popupShowHiden ? 'page-hidden' : '']">
    <view :class="['container', skuShow || commentShow ? 'overflow' : '']">
      <!-- 轮播图 & 商品视频-->
      <prod-imgs-video ref="media" :imgs="prodInfo.imgs" :video="prodInfo.video" @videoSts="videoSts" />
      <!-- 轮播图 & 商品视频end -->
      <!-- 商品信息 -->
      <view class="prod-info">
        <view class="tit-wrap">
          <view class="prod-tit">{{ prodName }}</view>
        </view>
        <!-- 普通商品价格 -->
        <view class="prod-price">
          <text v-if="defaultSku.price" class="price">￥
            <text class="price-num">{{ parsePrice(defaultSku.price)[0] }}</text>.{{ parsePrice(defaultSku.price)[1] }}
          </text>
          <text v-if="prodType == 3 && defaultSku.price && defaultSku.skuScore" class="plus">+</text>
          <text v-if="prodType == 3 && defaultSku.skuScore" class="price">
            <text class="price-num">{{
    parsePrice(defaultSku.skuScore)[0]
  }}</text>
            {{ i18n.integral }}
          </text>
          <text v-if="prodType == 3 &&
    (defaultSku.skuScore || defaultSku.price) &&
    defaultSku.skuVO.number > 0
    " class="plus">+</text>
          <text v-if="prodType == 3 && defaultSku.skuVO.number > 0" class="plus" style="margin-left: 0"><text
              class="price-num">{{ defaultSku.skuVO.number }}</text>礼品券
          </text>
          <text v-if="preSellStatus == 1" class="condition">{{
    i18n.preSale
  }}</text>
        </view>
        <view class="soldNum">
          <text style="font-size: 24rpx; font-weight: 600">销量：</text><text style="font-size: 24rpx">已售&nbsp;<text
              style="color: #ff5000">{{
      soldNum + waterSoldNum
    }}</text>&nbsp;件,仅剩&nbsp;
            <text style="color: #ff5000">{{ totalStocks }}</text>&nbsp;件</text>
        </view>
      </view>
      <!-- 商品信息end -->
      <!-- 领券 -->
      <view v-if="(couponList.length &&
    prodType != 5 &&
    prodType != 2 &&
    prodType != 3) ||
    (prodType == 2 &&
      activityInfo.activityStatus == 1 &&
      couponList.length)
    " class="coupon" @tap="showPopup">
        <view class="coupon-tit">{{ i18n.coupons }}</view>
        <view :class="['coupon-con', curLang == 'en' ? 'coupon-con-en' : '']">
          <block v-for="(item, index) in couponList" :key="index">
            <text v-if="index < 2" class="item">
              <block v-if="item.couponType == 1">
                {{
    parseDiscountProd(
      item.couponType,
      item.cashCondition,
      item.reduceAmount
    )
  }}
              </block>
              <block v-if="item.couponType == 2">
                {{
    parseDiscountProd(
      item.couponType,
      item.cashCondition,
      item.couponDiscount
    )
  }}
              </block>
            </text>
          </block>
        </view>
        <view class="num">{{ i18n.inTotal }}{{ couponList.length }}{{ i18n.piecesZ }}</view>
        <view class="more">...</view>
      </view>
      <!-- 领券end -->

      <!-- 已选规格 -->
      <!-- sku弹窗组件 -->
      <prod-sku-select v-if="skuLoad" :mold="mold" :pic="pic" :sku-list="skuList" :sku-id="skuId"
        :default-price="defaultPrice" :virtual-info="virtualInfo" :sku-show-type="skuShowType" :prod-type="prodType"
        :pre-sell-status="preSellStatus" :prod-num="prodNum" :activity-info="activityInfo"
        :page-type="prodType === 2 ? 2 : 1" :sku-show="skuShow" @setSku="setSku" @showSku="showSku"
        @closeSkuPop="closeSkuPop" @setVirtualInputInfo="setVirtualInputInfo" @addToCart="addToCart" @buyNow="buyNow"
        @setProdNum="setProdNum" />
      <!-- 已选规格end -->

      <!-- 商品详情 -->
      <view class="prod-detail">
        <view>
          <view v-for="item in prodParameterList" :key="item.prodParameterId" class="parameter-box">
            <view class="parameter-key">
              {{ item.parameterKey }}
            </view>
            <view class="parameter-vaule">
              {{ item.parameterValue }}
            </view>
          </view>
        </view>
        <view>
          <rich-text :nodes="content" />
        </view>
      </view>
      <!-- 商品详情end -->

      <!-- 底部按钮 -->
      <view class="cart-footer">
        <view class="btn icon" @tap="toHomePage">
          <image src="/static/images/tabbar/homepage.png" />{{ i18n.homepage }}
        </view>
        <view class="btn icon" @tap="toCartPage" v-if="prodType != 3">
          <image src="/static/images/tabbar/basket.png" />
          {{ i18n.shoppingCart }}
          <view v-if="totalCartNum > 0" class="badge">
            {{ totalCartNum > 99 ? "99+" : totalCartNum }}
          </view>
        </view>
        <!-- 普通商品按钮: 普通商品   或未启动或未开始的团购-->
        <block v-if="(hadOnloaded && prodType === 0) ||
    (prodType === 1 &&
      (!activityInfo.activityStatus ||
        activityInfo.activityStatus == 1)) ||
    (prodType === 2 && !prodInfo.seckillVO)
    ">
          <block v-if="preSellStatus != 1">
            <view v-if="mold !== 1" class="btn cart cart-radius" @tap="addToCart">
              <text>{{ i18n.addShoppingCart }}</text>
            </view>
            <view class="btn buy cart-radius" @tap="buyNow(0)">
              <text>{{ i18n.buyNow }}</text>
            </view>
          </block>
          <view v-if="preSellStatus == 1" class="btn pre-sale-buy cart-radius" @tap="buyNow(0)">{{ i18n.buyNow }}
          </view>
        </block>
        <!-- 秒杀  或正在进行的团购 -->
        <block v-if="(hadOnloaded && prodType == 2 && activityInfo.activityStatus) ||
    (prodType == 1 && activityInfo.activityStatus == 2)
    ">
          <view v-if="activityInfo.activityStatus === 1 || prodType === 1" class="btn alone-buy cart-radius"
            @tap="showSku(1)">
            <text>{{
    activityInfo.activityStatus === 1 && prodType == 2
      ? i18n.retailPricePurchase
      : i18n.individualShopping
  }}</text>
          </view>
          <view v-if="activityInfo.activityStatus === 2" :class="[
    'btn group-buy cart-radius',
    activityInfo.activityStatus === 1 ? 'gray-btn' : '',
  ]" @tap="showGroupSku">
            <text>{{
    prodType === 1 ? i18n.startAGroup : i18n.immediatelyBuy
  }}</text>
          </view>
        </block>
        <!-- 青春豆的按钮 -->
        <block v-if="hadOnloaded && prodType == 3">
          <view class="btn pre-sale-buy cart-radius" style="margin-left: 250rpx; font-size: 40rpx; font-weight: 800"
            @tap="showGroupSku">
            <text>{{ i18n.redeemNow }}</text>
          </view>
        </block>

        <!-- 活动商品不可购买 -->
        <block v-if="hadOnloaded && prodType == 5">
          <view class="btn buy cart-radius gray-btn" :class="{ 'en-btn': isEn }">
            <text>{{ i18n.notAvailableForPurchase }}</text>
          </view>
        </block>
      </view>
      <!-- 底部按钮 end -->



      <!-- 优惠券 -->
      <view v-if="popupShow" class="popup-hide" @tap="
    popupShow = false;
  popupShowHiden = false;
  ">
        <view class="popup-box radius" @tap.stop>
          <view class="popup-tit radius">
            <text>优惠券</text>
            <text class="close" @tap="closePopup" />
          </view>
          <view class="popup-cnt">
            <block v-for="(item, couponId) in couponList" :key="couponId">
              <coupon :show-time-type="1" :can-use="item.canUse" :coupon-item="item" />
            </block>
          </view>
        </view>
      </view>
      <!-- 优惠券 end -->
      <view class="promo-con">
        <view v-if="showBacktop" class="suspension-btn" @tap="handleScorllTop">
          <image src="/static/images/icon/back-to-top.png" />
        </view>
      </view>
      <!-- 回到顶部 && 分享 end-->
    </view>
  </view>
</template>

<script>
const http = require("@/utils/http.js");
const config = require("@/utils/config.js");
const util = require("@/utils/util.js");
var Qr = require("@/utils/wxqrcode.js");
import coupon from "@/components/coupon/index.vue";
import rhythmBeat from "@/components/rhythm-beat/index.vue";
import prodSkuSelect from "@/components/prod-sku-select/index.vue";
// import Pay from '../../utils/pay.js'

// #ifdef H5
import Wechat from "../../../utils/wechat.js";
// #endif
export default {
  components: {
    coupon,
    rhythmBeat,
    prodSkuSelect,
  },
  props: {},
  data() {
    return {
      virtualInfo: {},
      defaultPrice: 0,
      isEn: uni.getStorageSync("bbcLang") == "en", // 是否为英文
      seckillVO: null, // 秒杀信息
      groupActivityVO: null, // 团购信息

      isWechat: false, // 是否为微信环境
      shopId: 1,
      shopInfo: "", // 店铺信息

      comboList: [], // 优惠套餐列表
      mainDiscountPackageData: [], // 套餐主商品信息
      giveawayList: [], // 赠品列表
      picDomain: config.picDomain,
      prodNum: 1,
      totalCartNum: 0,
      groupActivityId: 0,
      discountId: null, // 满减折活动id
      pic: "",
      soldNum: 0,
      imgs: "",
      prodName: "",
      price: 0,
      actPrice: 0,
      content: "",
      prodId: 0,
      brief: "",
      skuId: 0,
      popupShow: false,
      // 是否获取过用户领取过的优惠券id
      loadCouponIds: false,
      skuShow: false,
      skuGroupShow: false,
      commentShow: false,
      couponList: [],
      skuList: [],
      skuLoad: false,
      findSku: true,
      defaultSku: {},
      defaultActivitySku: "",
      prodCommData: "",
      prodCommPage: {
        current: 0,
        pages: 0,
        records: [],
      },
      littleCommPage: [],
      evaluate: -1,
      isCollection: false,
      shareShow: false,
      // 是否分销员
      isDist: false,
      // 是否分销商品
      isDistProd: false,
      // 分销员卡号
      distributionCardNo: "",
      // 是否显示二维码弹层
      wxCodeShow: false,
      // 分享二维码图片路径
      shareWxCode: "",
      // 团购活动
      activityInfo: {},
      // 距离团购活动结束还剩多久
      endOfGroupTime: {},
      // 可加入的团列表
      joinGroupList: [],
      // sku的显示类型 0普通sku 1拼团sku
      skuShowType: 0,
      // 活动剩余库存
      totalStocks: 0,
      waterSoldNum: 0, //注水销量
      joinGroupListTimer: "",
      endOfGroupTimer: "",
      scene: "",
      prodDiscountList: [], // 商品促销活动列表
      prodType: 0, // 商品类型(0普通商品 1拼团 2秒杀 3青春豆 5活动商品)
      showDiscountPopup: false, // 促销弹窗显隐
      popupShowHiden: false, // 所有弹窗的显隐判断

      guideShare: false, // 引导蒙版

      deliveryModeVO: null, // 配送方式

      isPlaying: false,
      showBacktop: false,
      liveRoomParams: [], // 直播列表

      // 预售
      preSellStatus: 0, // 预售状态 1：开启 0：未开启
      preSellTime: "", // 预售发货时间

      scrollTop: -1, // 滚动监听
      curLang: uni.getStorageSync("bbcLang"),

      // 虚拟商品
      mold: "", // 1虚拟商品
      virtualRemarks: [], // 留言
      isRefund: null, // 0不支持退款 1支持退款
      writeOffTime: null, // 核销有效期 -1.长期有效 0.自定义 x.x天内有效
      writeOffNum: null, // 核销次数 -1.多次核销 0.无需核销 1.单次核销
      writeOffStart: null, // 核销有效期开始时间
      writeOffEnd: null, // 核销有效期结束时间
      prodParameterList: [], // 商品参数
      // 是否已请求过商品详情
      hadOnloaded: false,
      prodInfo: {},

      // 分销海报
      showShareBtn: false, // 分享栏
      showCanvasImg: true, // 海报图片（小程序不显示）
      canvasW: 0, // 画布宽
      canvasH: 0, // 画布高
      canvasHMax: 0, // 画布最大高
      systemInfo: {},
      shareImgUrl: "",
      marginTopCanvas: 0,
      shareProdId: 0,
      shareProdName: "",
      sharePic: "",
      sharePrice: "",
      isLoaded: false,
      userInfo: {},
      prodGroup: null, // 商品分类ID
    };
  },

  computed: {
    i18n() {
      return this.$t("index");
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // #ifdef H5
    this.isWechat = Wechat.isWechat();
    // #endif
    // #ifdef APP-PLUS
    this.isWechat = false;
    // #endif
    // #ifdef MP-WEIXIN
    this.isWechat = true;
    // #endif
    // console.log(1111,this.$Route.query.cardno)
    this.setData({
      prodId: this.$Route.query.prodId,
      distributionCardNo: this.$Route.query.cardno || "",
    });
    // 普通的跳转
    if (this.$Route.query.prodId) {
      this.executionFunction();
    }
    // 扫码进入 (小程序)
    if (this.$Route.query.scene) {
      const scene = decodeURIComponent(this.$Route.query.scene);
      // 如果是微信小程序中下载保存的二维码
      if (scene.indexOf(",") !== -1) {
        this.setData({
          prodId: scene.split(",")[0],
          distributionCardNo: scene.split(",")[1],
        });
        this.saveShareLog();
        this.executionFunction();
      } else {
        this.setData({
          scene: scene,
        });
        // 根据Ticket获取保存的内容
        this.getContent();
      }
    }
    if (this.$Route.query.cardno || this.$Route.query.isShare) {
      this.saveShareLog();
    }
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

    if (this.prodId) {
      // 加载购物车数字
      this.getCartCount();
      if (this.hadOnloaded) {
        this.getProdInfo();
      }
      // 获取用户信息
      if (!uni.getStorageSync("bbcUserInfo")) {
        this.queryUserInfo();
      } else {
        this.userInfo = uni.getStorageSync("bbcUserInfo");
      }
    }
    this.skuLoad = false;
    this.skuShowType = 0; // 重置sku类型
  },

  /**
   * 页面相关事件处理函数--监听页面隐藏
   */
  onHide: function () {
    this.skuShow = false;
    this.popupShowHiden = false;
    if (this.isPlaying) {
      this.$refs.media.stopPlay();
    }
    clearTimeout(this.joinGroupListTimer);
    clearTimeout(this.endOfGroupTimer);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 页面滚动事件
   */
  onPageScroll: function (e) {
    this.scrollTop = e.scrollTop;
    if (this.scrollTop > 1500) {
      this.setData({
        showBacktop: true,
      });
    } else if (this.scrollTop < 1500) {
      this.setData({
        showBacktop: false,
      });
    }
  },

  /**
   * 用户点击转发
   */
  onShareAppMessage: function (res) {
    var cardno = uni.getStorageSync("bbcDistCardNo");
    return {
      title: this.prodName,
      path:
        "/package-prod/pages/prod/prod?prodId=" +
        this.prodId +
        "&isShare=1" +
        (res.from === "button" ? "&cardno=" + cardno : ""),
      imageUrl: this.pic,
      desc: this.brief,
    };
  },

  watch: {
    skuShow(nv) {
      if (nv && this.isPlaying) {
        this.$refs.media.stopPlay();
      }
    },
    commentShow(nv) {
      if (nv && this.isPlaying) {
        this.$refs.media.stopPlay();
      }
    },
    showDiscountPopup(nv) {
      if (nv && this.isPlaying) {
        this.$refs.media.stopPlay();
      }
    },
    popupShow(nv) {
      if (nv && this.isPlaying) {
        this.$refs.media.stopPlay();
      }
    },
  },

  methods: {
    /**
     * videoSts
     */
    videoSts(sts) {
      this.isPlaying = sts;
    },
    /**
     * 设置虚拟商品信息
     */
    setVirtualInputInfo(virtualRemarkList) {
      this.virtualRemarks = virtualRemarkList;
    },
    /**
     * 隐藏sku弹窗
     */
    closeSkuPop() {
      this.closePopup();
    },

    /**
     * 修改商品的sku
     */
    setSku(sku, findSku) {
      this.findSku = findSku;
      // 团购的sku
      if (this.prodType === 1) {
        this.defaultActivitySku = sku;
      }

      this.defaultSku = sku || {};
    },

    /**
     * 修改商品数量
     */
    setProdNum(prodNum) {
      this.prodNum = prodNum;
    },

    /**
     * 获取购物车
     */
    getCartCount() {
      const params = {
        url: "/p/shopCart/prodCount",
        method: "GET",
        dontTrunLogin: true,
        callBack: (res) => {
          this.totalCartNum = res;
        },
      };
      http.request(params);
    },
    /**
     * 咨询客服
     */
    handleCustomService() {
      util.checkAuthInfo(() => {
        uni.navigateTo({
          url:
            "/package-user/pages/chat/chat-im?shopId=" +
            this.shopId +
            "&prodId=" +
            this.prodId,
        });
      });
    },

    /**
     * 执行函数
     */
    executionFunction: function () {
      // 加载商品数据
      this.getProdInfo();
    },

    /**
     * 根据Ticket获取保存的内容
     */
    getContent: function () {
      http.request({
        url: "/qrcodeTicket/getContent",
        method: "GET",
        data: {
          ticket: this.scene,
        },
        callBack: (res) => {
          var content = JSON.parse(res.content);
          var ids = JSON.parse(content.content);
          if (res.type == 1) {
            // pc团购二维码跳转
            this.setData({
              prodId: ids.prodId,
              groupActivityId: ids.groupActivityId,
            });
          } else if (res.type == 2) {
            // 分销员二维码跳转
            this.setData({
              prodId: ids.shareProdId,
              distributionCardNo: ids.cardNo,
            });
          }
          this.executionFunction(); // 所有需要加载的函数
          this.saveShareLog();
        },
      });
    },

    /**
     * 查询分销相关信息
     */
    getDistInfo() {
      // 查询分销开关是否开启
      http.request({
        url: "/p/distribution/distributionBasicSet/canDistribution",
        method: "GET",
        dontTrunLogin: true,
        callBack: (res) => {
          if (res == 1) {
            this.getIsDistInfo();
          }
        },
      });
    },

    /**
     * 查询用户 是否为分销员
     */
    getIsDistInfo() {
      http.request({
        url: "/p/distribution/user/distributionUserInfo",
        method: "GET",
        callBack: (res) => {
          if (res && res.state == 1) {
            this.setData({
              isDist: true,
            });
            this.getIsDistProd();
            wx.setStorageSync("bbcDistCardNo", res.cardNo);
          }
        },
      });
    },

    /**
     * 获取用户信息
     * **/
    queryUserInfo: function () {
      const params = {
        url: "/p/user/userInfo",
        method: "GET",
        data: {},
        dontTrunLogin: true,
        callBack: (res) => {
          this.userInfo = res;
          uni.setStorageSync("bbcUserInfo", res);
        },
      };
      http.request(params);
    },

    /**
     * 查询是否为分销商品
     */
    getIsDistProd() {
      http.request({
        url: "/p/distribution/prod/isStateByProdId",
        method: "GET",
        data: {
          prodId: this.prodId,
          state: 1,
        },
        callBack: (res) => {
          if (res) {
            this.setData({
              isDistProd: true,
            });
          }
        },
      });
    },

    /**
     * 获取商品是否被收藏信息
     */
    getCollection() {
      const params = {
        url: "/p/user/collection/isCollection",
        method: "GET",
        dontTrunLogin: true,
        data: {
          prodId: this.prodId,
        },
        callBack: (res) => {
          this.setData({
            isCollection: res,
          });
        },
      };
      http.request(params);
    },

    /**
     * 去往优惠套餐详情
     */
    toDiscountPackageDetail(id) {
      uni.navigateTo({
        url:
          "/package-prod/pages/discount-package-detail/discount-package-detail?comboId=" +
          id +
          "&shopId=" +
          this.shopId,
      });
    },
    // 保存浏览记录
    prodBrowseLog() {
      http.request({
        url: "/p/prodBrowseLog",
        method: "POST",
        data: {
          prodId: this.prodId,
        },
      });
    },
    // 获取商品信息
    getProdInfo() {
      this.activityInfo = {};
      let userId = null;
      if (uni.getStorageSync("bbcToken") && uni.getStorageSync("bbcUserInfo")) {
        userId = uni.getStorageSync("bbcUserInfo").userId;
      }
      uni.showLoading({
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
              title: '提示',
              content: err.msg,
              showCancel: false,
              cancelText: '取消',
              confirmText: '确定',
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
     * 获取店铺信息
     */
    getShopInfo() {
      http.request({
        url: "/shop/headInfo",
        method: "GET",
        data: {
          shopId: this.shopId,
        },
        callBack: (res) => {
          this.setData({
            shopInfo: res,
          });
          uni.setStorageSync("bbcShopInfo", res);
        },
      });
    },

    getProdCommData() {
      http.request({
        url: "/prod/prodCommData",
        method: "GET",
        data: {
          prodId: this.prodId,
        },
        callBack: (res) => {
          this.setData({
            prodCommData: res,
          });
        },
      });
    },

    getCouponList() {
      http.request({
        url: "/coupon/listByProdId",
        method: "GET",
        data: {
          prodId: this.prodId,
          shopId: this.shopId,
        },
        callBack: (res) => {
          this.setData({
            couponList: res,
          });
        },
      });
    },

    // 可加入的拼团列表
    getJoinGroupList() {
      http.request({
        url: "/group/joinGroupList",
        method: "GET",
        data: {
          groupActivityId: this.groupActivityId,
          showSize: 3,
        },
        callBack: (res) => {
          this.setData({
            joinGroupList: res,
          });
          this.joinGroupListCountdown(res);
        },
      });
    },

    joinGroupListCountdown(joinGroupList) {
      joinGroupList.forEach((item) => {
        item.endOfGroupTime = Object.assign(
          {},
          util.endOfStartTime(
            new Date().getTime(),
            util.dateToTimestamp(item.endTime)
          )
        );
        if (!item.endOfGroupTime.signs) {
          uni.redirectTo({
            url: "/package-prod/pages/prod/prod?prodId=" + this.prodId,
          });
          return;
        }
      });
      this.joinGroupList = [];
      this.joinGroupList = joinGroupList;
      this.joinGroupListTimer = setTimeout(
        () => this.joinGroupListCountdown(joinGroupList),
        1000
      );
    },

    /**
     * 去凑团
     */
    toSpellGroupDetail(e) {
      util.tapLog(3);
      const groupTeamId = e.currentTarget.dataset.groupteamid;
      util.checkAuthInfo(() => {
        uni.navigateTo({
          url:
            "/package-activities/pages/spell-group-details/spell-group-details?groupTeamId=" +
            groupTeamId,
        });
      });
    },

    /**
     * 跳转到首页
     */
    toHomePage: function () {
      util.tapLog(3);
      util.toHomePage();
    },

    /**
     * 跳转到满折
     */
    toDiscountList(id) {
      uni.navigateTo({
        url:
          "/package-activities/pages/discount-detail/discount-detail?discountId=" +
          id,
      });
    },

    /**
     * 跳转到赠品详情
     */
    toGiveawaysProd(id) {
      uni.navigateTo({
        url: "/package-prod/pages/prod/prod?prodId=" + id,
      });
    },
    /**
     * 跳转到购物车
     */
    toCartPage: function () {
      util.tapLog(3);
      this.$Router.pushTab("/pages/basket/basket");
    },

    /**
     * 加入购物车
     */
    addToCart: function (event) {
      if (!this.skuShow) {
        this.skuShow = true;
        this.popupShowHiden = true;
        return;
      }
      if (!this.findSku) {
        return;
      }
      // 查看是否授权
      util.checkAuthInfo(this.callChangeItem);
    },

    callChangeItem() {
      if (this.prodNum < 1) {
        uni.showToast({
          title: '商品数量不能小于1',
          icon: "none",
        });
        this.prodNum = 1;
        return;
      }
      console.log(1111, this.distributionCardNo);
      http.request({
        url: "/p/shopCart/changeItem",
        method: "POST",
        data: {
          basketId: 0,
          count: this.prodNum,
          prodId: this.prodId,
          shopId: this.shopId,
          shopName: this.shopName,
          skuId: this.defaultSku.skuId,
          distributionCardNo: this.distributionCardNo,
        },
        callBack: (res) => {
          util.tapLog(4, null, null, this.prodNum);
          this.totalCartNum = +this.totalCartNum + +this.prodNum;
          this.skuShow = false;
          this.popupShowHiden = false;
          uni.showToast({
            title: '加入购物车成功',
            icon: "none",
          });
        },
      });
    },

    /**
     * 立即购买
     * @param {Number} orderType 订单类型  0普通 1团购 2秒杀 3青春豆
     */
    buyNow(orderType) {
      util.tapLog(3);
      if (!this.skuShow) {
        this.skuShow = true;
        this.popupShowHiden = true;
        return;
      }
      // 查看是否授权
      util.checkAuthInfo(() => {
        if (this.prodNum < 1) {
          return;
        }

        const orderItem = {
          prodId: this.prodId,
          skuId: this.defaultSku.skuId,
          prodCount: this.prodNum,
          shopId: this.shopId,
          prodGroup: this.prodGroup,
          distributionCardNo: this.distributionCardNo,
        };
        this.userInfo.station?.province
          ? uni.setStorageSync("bbcDvyType", 2)
          : uni.setStorageSync("bbcDvyType", 1);

        let url = `/package-prod/pages/submit-order/submit-order?orderEntry=1&orderType=${orderType}&mold=${this.mold}`;

        if (orderType == 1) {
          // 团购订单
          orderItem.groupSkuId = this.defaultActivitySku.groupSkuId;
          orderItem.groupTeamId = 0;
        } else if (orderType == 2) {
          // 秒杀订单
          orderItem.seckillSkuId = this.defaultSku.seckillSkuId;
          // 请求秒杀订单路径
          const params = {
            url: "/p/seckill/orderPath",
            method: "GET",
            data: {
              prodId: this.prodId,
            },
            callBack: (res) => {
              url = `/package-prod/pages/submit-order/submit-order?orderEntry=1&orderType=${orderType}&orderPath=${res}&mold=${this.mold}`;
              this.toSubmitOrder(orderItem, url);
            },
          };
          http.request(params);
          return;
        }
        // else if (orderType == 3 && !this.defaultSku.price) {
        //   uni.setStorageSync('bbcOrderItem', Object.assign({}, orderItem))
        //   // 纯青春豆商品直接支付
        //   return this.scorePay()
        // }
        // 青春豆商品需跳转支付页面
        this.toSubmitOrder(orderItem, url);
      });
    },
    scorePay() {
      const orderParam = uni.getStorageSync("bbcOrderItem") || {};
      // 获取订单信息
      const params = {
        url: "/p/score/confirm",
        method: "POST",
        data: {
          addrId: 0,
          couponIds: [],
          couponUserIds: [],
          orderItem: uni.getStorageSync("bbcOrderItem"),
          skuId: this.defaultSku.skuId,
          dvyType: 1, // 配送类型 1:快递 2:自提 3：无需快递 4:同城配送
          isScorePay: 0,
          prodCount: orderParam.prodCount,
          userChangeCoupon: 0,
          userUseScore: 0,
        },
        callBack: (res) => {
          // 如果有金额说明是有运费等, 走普通订单流程;否则弹窗直接支付
          if (res.actualTotal) {
            const url = `/package-prod/pages/submit-order/submit-order?orderEntry=1&orderType=3&mold=${this.mold}`;
            this.toSubmitOrder(orderParam, url);
            return;
          }
          this.submitScoreOrder(res);
        },
        errCallBack: (errMsg) => {
          if (errMsg.code === "A03001" || errMsg.code === "A03002") {
            uni.showModal({
              title: this.i18n.tips,
              content:
                errMsg.code === "A03001"
                  ? '订单不支持该配送方式，请重新下单'
                  : '请勿同时提交订单',
              showCancel: false,
            });
          }
        },
      };
      http.request(params);
    },





    /**
     * 跳转提交订单页
     */
    toSubmitOrder(orderItem, url) {
      uni.setStorageSync("bbcOrderItem", Object.assign({}, orderItem));
      uni.navigateTo({
        url,
      });
    },

    /**
     * 优惠券
     */
    showPopup: function () {
      util.tapLog(3);
      const params = {
        url: "/p/myCoupon/listCouponIds",
        method: "GET",
        callBack: (myCouponList) => {
          var couponList = this.couponList;
          couponList.forEach((coupon) => {
            if (myCouponList && myCouponList.length) {
              // 领取该优惠券数量
              var couponLimit = 0;
              // 改用户是否有可以使用的优惠券
              var isMyUseCoupon = false;
              myCouponList.forEach((myCouponItem) => {
                if (myCouponItem.couponId == coupon.couponId) {
                  couponLimit = couponLimit + myCouponItem.curUserReceiveCount;
                  if (
                    myCouponItem.status == 1 &&
                    myCouponItem.curUserReceiveCount > 0
                  ) {
                    isMyUseCoupon = true;
                  }
                }
              });
              // 判断用户是否到达领取优惠券上限
              if (couponLimit >= coupon.limitNum || coupon.stocks == 0) {
                coupon.canReceive = false;
                // 判断领取优惠券到达上限后,该种优惠券如果没有可用优惠券,则不可领取和使用
                if (isMyUseCoupon == false) {
                  coupon.canUse = false;
                } else {
                  coupon.canUse = true;
                }
              } else {
                coupon.canUse = true;
                coupon.canReceive = true;
              }
            } else {
              coupon.canUse = coupon.stocks !== 0;
              coupon.canReceive = true;
            }
          });
          couponList.sort((a, b) => b.canUse - a.canUse);
          this.setData({
            couponList: couponList,
            popupShow: true,
            popupShowHiden: true,
            loadCouponIds: true,
          });
        },
      };
      util.checkAuthInfo(() => {
        http.request(params);
      });
    },

    showSku: function (alonebuy) {
      util.tapLog(3);
      this.skuShow = true;
      this.popupShowHiden = true;
      this.skuShowType =
        alonebuy == 1
          ? 0
          : (this.groupActivityId && this.activityInfo.activityStatus === 2) ||
            (this.prodType === 2 && this.activityInfo.activityStatus === 2)
            ? 1
            : 0;
    },
    showGroupSku: function () {
      util.tapLog(3);
      if (this.activityInfo.activityStatus === 1) {
        uni.showToast({
          title: '活动未开始',
          icon: "none",
        });
        return;
      }
      this.setData({
        skuShow: true,
        popupShowHiden: true,
        skuShowType: 1,
      });
    },
    showComment: function (e) {
      util.tapLog(3);
      this.setData({
        commentShow: true,
        evaluate: e,
        prodCommPage: {
          current: 0,
          pages: 0,
          records: [],
        },
      });
      this.getProdCommPage();
    },
    closePopup: function () {
      util.tapLog(3);
      this.setData({
        popupShow: false,
        skuShow: false,
        commentShow: false,
        popupShowHiden: false,
      });
    },
    onShowShare: function () {
      // util.tapLog(3)
      const that = this;
      this.shareImgUrl = "";
      this.shareShow = true;
      this.setData({
        shareShow: true,
        popupShowHiden: true,
      });
      // #ifndef MP-WEIXIN
      this.showShareBtn = true;
      // #endif
      // #ifdef MP-WEIXIN
      this.showCanvasImg = false;
      // #endif
      this.shareProdId = this.prodId;
      this.shareProdName = this.prodName;
      this.sharePic = this.pic;
      this.sharePrice = this.price;
      uni.getSystemInfo({
        success: function (res) {
          that.systemInfo = res;
          that.canvasW = res.windowWidth * 0.8;
          that.canvasHMax =
            (res.windowHeight - (400 * res.windowWidth) / 750) * 0.9;
          that.marginTopCanvas =
            (res.windowHeight - (400 * res.windowWidth) / 750) * 0.1 * 0.7;
        },
      });
      // 从缓存获取分销员卡号，如果没有则去接口获取，以备转发时使用
      var cardno = wx.getStorageSync("bbcDistCardNo");
      if (!cardno) {
        http.request({
          url: "/p/distribution/user/distributionUserInfo",
          method: "GET",
          selfLoading: true,
          callBack: (res) => {
            wx.setStorageSync("bbcDistCardNo", res.cardNo);
            this.getShareQRCode();
          },
        });
      } else {
        this.getShareQRCode();
      }
    },
    closeEarn: function () {
      util.tapLog(3);
      this.setData({
        shareShow: false,
        popupShowHiden: false,
      });
    },
    toDistCenterPage: function () {
      uni.navigateTo({
        url: "/package-distribution/pages/dis-center/dis-center",
      });
    },





    /**
     * 关闭二维码弹窗
     */
    closeCodePopup() {
      util.tapLog(3);
      this.setData({
        wxCodeShow: false,
        popupShowHiden: false,
      });
    },

    /**
     * 判断图片是否存在
     */
    imgCanUse(path) {
      const imgObj = new Image();
      imgObj.src = path;
      if (imgObj.fileSize > 0 || (imgObj.width > 0 && imgObj.height > 0)) {
        return true;
      }
      return false;
    },
    /**
     * 回到页面顶部
     */
    handleScorllTop() {
      uni.pageScrollTo({
        duration: 100,
        scrollTop: 0,
      });
    }
  },
};
</script>
<style>
@import "./prod.css";
</style>
