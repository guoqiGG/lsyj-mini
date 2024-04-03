<template>
	<view class="container">
		<view class="image-con">
			<image class="image" :src="productDetail.thumbail" mode="aspectFit" @error="handlePicError" />
		</view>
		<view class="prod-content" v-if="productDetail.name">
			<view class="prod-name">{{ productDetail.name }}</view>
			<view class="price">
				<text class="symbol">￥</text>
				<text class="big-num">{{ parsePrice(price)[0] }}</text>
				<text class="small-num">.{{ parsePrice(price)[1] }}</text>
			</view>
			<view class="prod-number">仅剩<text class="red">{{ productDetail.stock }}</text>件</view>
			<view class="prod-number" v-if="productDetail.canUseCoupon"><text style="color: #9e9e9e;font-size: 24rpx;">{{ productDetail.canUseCoupon===0?'不可用优惠券':'' }}</text></view>
		</view>
		<view class="prod-select-number">
			<view class="prod-select-number-left">
				<view class="has-select-text">已选</view>
				<view class="has-select-number">{{ numberValue }}件</view>
			</view>
			<view class="prod-select-number-right" @tap="openSkuPopup">
				...
			</view>
		</view>

		<view class="footer">
			<view class="con">
				<view class="left" @tap="toHomePage()">
					<image src="/static/tabbar/uncheck-home.png" mode="scaleToFill" />
					<view class="text">首页</view>
				</view>
				<view class="right">
					<view class="buy-now" @tap="openSkuPopup()">立即购买</view>
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
							<image class="image" :src="productDetail.thumbail" mode="aspectFit"
								@error="handlePicError" />
						</view>
						<view class="sku-info-right">
							<view class="price">
								<text class="symbol">￥</text>
								<!--        <text class="big-num">{{ parseInt(totalPrice) }}</text>
                <text class="big-num">.{{ totalSmallPrice }}</text> -->
								<text class="big-num">{{ parsePrice(totalPrice)[0] }}</text>
								<text class="small-num">.{{ parsePrice(totalPrice)[1] }}</text>
							</view>
							<view class="select-number">已选：<text class="number">{{ numberValue }}件</text></view>
							<view class="stock">库存：<text class="stock-number">{{ productDetail.stock }}</text></view>
						</view>
					</view>

					<view class="select-number-con">
						<view class="number-title"><text>数量</text></view>
						<view class="number-con">
							<view class="minus" @tap="numberValueMinus">-</view>
							<input class="input" type="number" min="1" v-model="numberValue" @input="numberInput()" />
							<view class="add" @tap="numberValueAdd">+</view>
						</view>
					</view>
					<view class="goods-sku" v-if="goodsSkus.length > 1">
						<view class="goods-sku-title"><text>规格</text></view>
						<view class="goods-sku-list">
							<view :class="['goods-sku-list-item', chechIndex == item.id ? 'checked' : '']"
								v-for="item in goodsSkus" :key="item.id" @tap="skuSelectClick(item.id)">
								{{ item.specificationName }}
							</view>
						</view>
					</view>
					<view class="buy-now" @tap="buyNow()"><text>立即购买</text></view>
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
	const util = require("@/utils/util");
	export default {
		data() {
			return {
				loadingShow: true,
				skuShow: false, //规格弹窗显示
				goodsSkus: [], // 商品规格
				numberValue: 1, // 选择件数默认为 1
				goodsId: null, //商品id
				productDetail: {},
				price: null, // 总价格
				// smallPrice: null, // 小数价格
				totalPrice: null, //总价格
				// totalSmallPrice: null,//总的小数
				chechIndex: 0, //选中商品规格 默认第一个
				orderType: 1, // 1-配送单，2-自提单   leaderType 0-有店 1-无店
			}
		},
		onLoad(option) {
			if (option.prodId) {
				this.goodsId = option.prodId
				this.getProductDetail()
			}
		},
		onShow() {
			//   if (uni.getStorageSync('bbcUserInfo').leaderName && uni.getStorageSync('bbcUserInfo').leaderMobile) {
			// leaderType===0?
			// 
			//     this.orderType = 2
			//   }
			if (uni.getStorageSync('bbcUserInfo').leaderType === 0) {
				this.orderType = 2
			} else if (uni.getStorageSync('bbcUserInfo').leaderType === 1) {
				this.orderType = 1
			}
			this.skuShow = false
		},
		methods: {
			toHomePage() {
				util.toHomePage()
			},
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
				this.numberValue = Number(this.numberValue)
				this.numberValue = this.numberValue <= 1 ? 1 : this.numberValue - 1
				this.totalPrice = (this.price * this.numberValue)

			},
			// 增加商品数量
			numberValueAdd() {
				this.numberValue = Number(this.numberValue)
				this.numberValue = this.numberValue + 1
				this.totalPrice = (this.price * this.numberValue)

			},
			numberInput() {
				this.numberValue = Number(this.numberValue)
				this.totalPrice = (this.price * this.numberValue)

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
						this.productDetail = res
						this.price = this.totalPrice = res.goodsSkus[0].price
						// this.totalPrice = this.price
						this.goodsSkus = res.goodsSkus
						this.chechIndex = res.goodsSkus[0].id
					},
				}
				http.request(params);
			},
			skuSelectClick(id) {
				this.chechIndex = id
			},
			buyNow(){
				util.checkAuthInfo(() => {
					// 订单预检
					let obj = {
						loginToken: uni.getStorageSync('bbcToken'),
						userId: uni.getStorageSync('bbcUserInfo').id,
						orderType: this.orderType,
						goods: [{
							goodsId: this.goodsId,
							skuId: this.chechIndex,
							buyNumber: this.numberValue
						}]
					}
					const params = {
						url: "/pub/order/preview",
						method: "POST",
						data: {
							sign: 'qcsd',
							data: JSON.stringify(obj),
						},
						callBack: (res) => {
							let orderItem = res
							let url = '/pages/package-pay/pages/submit-order/submit-order'
							this.toSubmitOrder(orderItem, url)
						},
						errCallBack: (errMsg) => {
							if (errMsg.code === 500) {
								uni.showToast({
									title: errMsg.msg,
									icon: 'none',
									mask: true
								})
							}
							this.closeSkuPopup()
						},
				
					}
					http.request(params);
				})
			},
				//buyNow: util.debounce(function () {
				// util.checkAuthInfo(() => {
				// 	// 订单预检
				// 	let obj = {
				// 		loginToken: uni.getStorageSync('bbcToken'),
				// 		userId: uni.getStorageSync('bbcUserInfo').id,
				// 		orderType: this.orderType,
				// 		goods: [{
				// 			goodsId: this.goodsId,
				// 			skuId: this.chechIndex,
				// 			buyNumber: this.numberValue
				// 		}]
				// 	}
				// 	const params = {
				// 		url: "/pub/order/preview",
				// 		method: "POST",
				// 		data: {
				// 			sign: 'qcsd',
				// 			data: JSON.stringify(obj),
				// 		},
				// 		callBack: (res) => {
				// 			let orderItem = res
				// 			let url = '/pages/package-pay/pages/submit-order/submit-order'
				// 			this.toSubmitOrder(orderItem, url)
				// 		},
				// 		errCallBack: (errMsg) => {
				// 			if (errMsg.code === 500) {
				// 				uni.showToast({
				// 					title: errMsg.msg,
				// 					icon: 'none',
				// 					mask: true
				// 				})
				// 			}
				// 			this.closeSkuPopup()
				// 		},

				// 	}
				// 	http.request(params);
				// })
			// }, 1000)
			/**
			 * 跳转提交订单页
			 */
			toSubmitOrder(orderItem, url) {
				uni.setStorageSync("bbcOrderItem", Object.assign({}, orderItem));
				uni.navigateTo({
					url,
				});
			}
		},
		onShareAppMessage: function(res) {
			return {
				title: this.productDetail.name,
				path: '/pages/package-prod/pages/prod/prod?prodId=' + this.goodsId,
				imageUrl: this.productDetail.thumbail,
				success: function(res) {
					// 转发成功
				},
				fail: function(res) {
					// 转发失败
				}
			}
		}
	}
</script>
<style>
	@import './prod.css'
</style>