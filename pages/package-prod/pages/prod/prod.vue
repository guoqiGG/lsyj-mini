<template>
  <view class="container">
    <view class="image-con">
      <image class="image" :src="productDetail.thumbail" mode="aspectFit" @error="handlePicError" />
    </view>
    <view class="prod-content" v-if="productDetail.name">
      <view class="prod-name">{{productDetail.name}}</view>
      <view class="price">
        <text class="symbol">￥</text>
        <text class="big-num">{{parseInt(price)}}</text>
        <text class="small-num">.{{smallPrice}}</text>
      </view>
      <view class="prod-number">仅剩<text class="red">{{productDetail.stock}}</text>件</view>
    </view>
    <view class="prod-select-number">
      <view class="prod-select-number-left">
        <view class="has-select-text">已选</view>
        <view class="has-select-number">{{numberValue}}件</view>
      </view>
      <view class="prod-select-number-right" @tap="openSkuPopup">
        ...
      </view>
    </view>

    <view class="footer">
      <view class="con">
        <view class="left">
          <image src="/static/tabbar/uncheck-home.png" mode="scaleToFill" />
          <view class="text">首页</view>
        </view>
        <view class="right">
          <view class="buy-now">立即购买</view>
        </view>
      </view>
    </view>
    <!-- 规格 弹出层 -->
    <view class="sku-con">
      <u-popup :show="skuShow">
        <view class="close" @tap="closeSkuPopup">
          <image class="close-img" src="/static/close.png" />
        </view>
        <view class="con-container">
          <view class="sku-info">
            <view class="sku-info-left">
              <image class="image" :src="productDetail.thumbail" mode="aspectFit" @error="handlePicError" />
            </view>
            <view class="sku-info-right">
              <view class="price">
                <text class="symbol">￥</text>
                <text class="big-num">{{parseInt(totalPrice)}}</text>
                <text class="small-num">.{{totalSmallPrice}}</text>
              </view>
              <view class="select-number">已选：<text class="number">{{numberValue}}件</text></view>
              <view class="stock">库存：<text class="stock-number">{{productDetail.stock}}</text></view>
            </view>
          </view>
          <view class="select-number-con">
            <view class="number-title"><text>数量</text></view>
            <view class="number-con">
              <view class="minus" @tap="numberValueMinus">-</view>
              <input class="input" type="number" min="1" v-model="numberValue"  @input="numberInput()"/>
              <view class="add" @tap="numberValueAdd">+</view>
            </view>
          </view>
          <view class="buy-now"><text>立即购买</text></view>
        </view>
      </u-popup>
    </view>
	<!-- 加载状态 -->
	<view v-if="!productDetail.name">
		<u-loading-icon :show="loadingShow" text="加载中" textSize="40"></u-loading-icon>
	</view>
  </view>
</template>
<script>
const http = require("@/utils/http");
export default {
  data() {
    return {
	  loadingShow:true,
      skuShow: false,//规格弹窗显示
      numberValue: 1,// 选择件数默认为 1
	  goodsId:null,//商品id
	  productDetail:{},
	  price:null,
	  smallPrice:null,
	  totalPrice:null,
	  totalSmallPrice:null
    }
  },
  onLoad(option){
	if(option.prodId){
		this.goodsId=option.prodId
		this.getProductDetail()
	}
	  
  },
  methods: {

    /**
* 图片加载失败时，现实默认图片
*/
    handlePicError() {
      this.categoryImg = '../../static/def.png'
    },
    // 打开规格弹窗
    openSkuPopup() {
      this.skuShow = true
    },
    // 关闭规格弹窗
    closeSkuPopup() {
      this.skuShow = false
    },
    // 减少数量
    numberValueMinus() {
	  this.numberValue=Number(this.numberValue)
      this.numberValue = this.numberValue <= 1 ? 1 : this.numberValue - 1
	  this.totalPrice=(this.price*this.numberValue).toFixed(2)
	  var parts = this.totalPrice.split('.');
	  if (parts.length === 2) {
	  	this.totalSmallPrice=parts[1]
	  }
    },
    // 增加商品数量
    numberValueAdd() {
	  this.numberValue=Number(this.numberValue)
      this.numberValue = this.numberValue + 1
	  this.totalPrice=(this.price*this.numberValue).toFixed(2)
	  var parts = this.totalPrice.split('.');
	  if (parts.length === 2) {
	  	this.totalSmallPrice=parts[1]
	  }
    },
	 numberInput(){
		this.numberValue=Number(this.numberValue)
		this.totalPrice=(this.price*this.numberValue).toFixed(2)
		var parts = this.totalPrice.split('.');
		if (parts.length === 2) {
			this.totalSmallPrice=parts[1]
		}
	},
	getProductDetail() {
	    let obj = {
	            goodsId: this.goodsId
	        }
	        const params = {
	            url: "/pub/goods/detail",
	            method: "POST",
	            data: {
	                sign: 'qcsd',
	                data: JSON.stringify(obj),
	            },
	            callBack: (res) => {
	                this.productDetail =res
					var num=res.goodsSkus[0].price
					this.price=num.toFixed(2)
					console.log(this.price,'this.price')
					this.totalPrice=this.price
					var parts = this.price.split('.');
					if (parts.length === 2) {
						this.smallPrice=parts[1]
						this.totalSmallPrice=parts[1]
					}
					
	            },
	        }
	        http.request(params);
	},
	
	
  },
}
</script>
<style>
@import './prod.css'
</style>