<template>
	<view class="submit-order">
		<view class="submit-order-background">
		</view>
		<view class="submit-order-index">
			<view v-if="!express" class="submit-order-index-express">
				<view class="submit-order-index-express-title">
					邮寄到家
				</view>
				<view class="submit-order-index-express-content">
					<view class="submit-order-index-express-content-address">
						<view class="address" v-if="!address">
							<text style="color: red;">暂无收货地址(请点击右侧按钮填写地址)</text>
							<image class="img" src="/static/revise.png" @tap.stop="toEditAddress()" />
						</view>
						<view class="address" v-if="address">
							<text>{{ address.address }}</text>
							<image class="img" src="/static/revise.png" @tap.stop="toEditAddress(address.id)" />
						</view>
					</view>
					<view class="submit-order-index-express-content-info" v-if="address">
						<view class="info-name">
							{{ address.name }}
						</view>
						<view class="info-tel">
							{{ address.tel }}
						</view>
					</view>
					<view class="submit-order-index-express-content-line">
					</view>
					<view class="submit-order-index-express-content-ex">
						<view class="express-type">
							配送方式
						</view>
						<view class="send-express">
							快递配送
						</view>
					</view>
				</view>
			</view>
			<view v-if="express" class="submit-order-index-not-express">
				<view class="submit-order-index-not-express-title">
					到店自提
				</view>
				<view class="submit-order-index-not-express-content">
					<view class="not-express-info">
						<view class="not-express-info-tel">
							<view class="title">
								自提点
							</view>
							<view class="addressName">
								{{ userInfo.leaderName }}
							</view>
							<view class="tel">
								{{ userInfo.leaderMobile }}
							</view>
						</view>
						<view class="not-express-info-address">
							{{ userInfo.leaderAddress }}
						</view>
					</view>
					<view class="submit-order-index-not-express-content-line">

					</view>
					<view class="submit-order-index-not-express-content-input">
						<u--input placeholder="姓名" v-model="name"></u--input>
						<u--input placeholder="电话" v-model="tel"></u--input>
					</view>
				</view>
			</view>
			<view class="submit-order-comodity-info">
				<view class="submit-order-comodity-info-tit">
					<image class="image" :src="orderItemInfo.goods[0].thumbail"></image>
					<view class="text">
						<view class="text-title">
							{{ orderItemInfo.goods[0].goodsName }}
						</view>
						<view class="text-size">
							{{ orderItemInfo.goods[0].specificationName }}
						</view>
						<view class="text-cot">
							<view class="text-cot-price">
								￥{{ parsePrice(orderItemInfo.goodsAmount)[0]
								}}.{{ parsePrice(orderItemInfo.goodsAmount)[1] }}
							</view>
							<view class="text-cot-amount">
								×{{ orderItemInfo.goods[0].buyNumber }}
							</view>
						</view>
					</view>
				</view>
				<view class="submit-order-comodity-info-line"></view>
				<view class="submit-order-comodity-info-express">
					<view class="submit-order-comodity-info-express-left">
						配送费用：
					</view>
					<view class="submit-order-comodity-info-express-right">
						￥{{ parsePrice(orderItemInfo.deliveryAmount)[0]
						}}.{{ parsePrice(orderItemInfo.deliveryAmount)[1] }}
					</view>
				</view>
				<view class="submit-order-comodity-info-line"></view>
				<view class="submit-order-comodity-info-order-remark">
					<view class="submit-order-comodity-info-order-remark-left">
						订单备注：
					</view>
					<view class="submit-order-comodity-info-order-remark-right">
						选填
					</view>

				</view>

			</view>

			<view class="submit-order-coupon">
				<view class="submit-order-coupon-select" v-if="couponList.length">
					<view class="submit-order-coupon-select-left">
						平台优惠券：<text style="color: #9e9e9e;">{{ couponList.length }}张可用</text>
					</view>
					<view class="submit-order-coupon-select-button">
						<view v-if="totalCouponAmount <= 0" style="font-size: 24rpx;color: #9E9E9E;"
							@click="selectCouponClick()">选择优惠券</view>
						<view style="font-size: 24rpx;color: #C53032;" v-else @click="selectCouponClick()">-￥{{
				parsePrice(totalCouponAmount)[0] }}.{{ parsePrice(totalCouponAmount)[1] }}</view>
						<view>
							<image style="width: 18rpx;height:24rpx;margin-left:10rpx;" src="/static/arrow-right.png"
								mode="scaleToFill" />
						</view>
					</view>
				</view>
				<view class="submit-order-coupon-amount-price">
					<view class="submit-order-coupon-amount-price-left">
						商品总额：
					</view>
					<view class="submit-order-coupon-amount-price-right">
						￥{{ parsePrice(orderItemInfo.goodsAmount)[0] }}.{{ parsePrice(orderItemInfo.goodsAmount)[1] }}
					</view>
				</view>
				<view class="submit-order-coupon-express-price">
					<view class="submit-order-coupon-express-price-left">
						商品运费：
					</view>
					<view class="submit-order-coupon-express-price-right">
						￥{{ parsePrice(orderItemInfo.deliveryAmount)[0]
						}}.{{ parsePrice(orderItemInfo.deliveryAmount)[1] }}
					</view>
				</view>
			</view>

			<view class="submit-order-price">
				<view class="submit-order-price-left">
					<view class="submit-order-price-left-text">
						总计：
					</view>
					<view class="submit-order-price-middle-text" v-if="totalAmount >= 0">
						￥{{ parsePrice(totalAmount)[0] }}.{{ parsePrice(totalAmount)[1] }}
					</view>
					<view class="submit-order-price-middle-text" v-else>
						￥0.00
					</view>
				</view>
				<view class="submit-order-price-button" @tap="submitOrder">
					<u-button type="primary" text="提交订单"></u-button>
				</view>
			</view>
		</view>
		<view class="submit-popup">
			<u-popup :show="show" @close="close">
				<view class="popup-style">
					<view class="popup-style-title">
						<view class="popup-style-title-left">
							{{ "优惠券(" + couponList.length + ")" }}
						</view>
						<view @click="close()" class="popup-style-title-right">
							<u-icon name="close" size="38"></u-icon>
						</view>
					</view>
					<view class="popup-style-content">
						<u-checkbox-group v-model="checkboxValue1" placement="column" @change="checkboxChange">
							<view v-for="(item, index) in couponList" class="popup-style-content-wrap" :key="item.id">
								<view class="popup-style-content-wrap-left">
									<view class="popup-style-content-wrap-left-img">
										<image src="/pages/package-pay/static/coupon-list.png" mode=""></image>
									</view>
									<view class="popup-style-content-wrap-left-text">
										<text class="popup-style-content-wrap-left-text-number-left">
											￥
										</text>
										<text class="popup-style-content-wrap-left-text-number-middle">
											{{ parsePrice(item.couponAmount)[0]
											}}
										</text>
										<text class="popup-style-content-wrap-left-text-number-right">
											.{{ parsePrice(item.couponAmount)[1] }}
										</text>
									</view>
								</view>
								<view class="popup-style-content-wrap-right">
									<view class="popup-style-content-wrap-right-title">
										<view class="popup-style-content-wrap-right-title-lf">
											平台
										</view>
										<view class="popup-style-content-wrap-right-title-rt"
											style="overflow:hidden; white-space:nowrap; text-overflow:ellipsis;">
											{{ item.couponName }}
										</view>
									</view>
									<view class="popup-style-content-wrap-right-cot">
										（特殊商品除外）
									</view>
									<view class="popup-style-content-wrap-right-button">
										<u-checkbox :disabled="item.disabled" :key="item.id" :name="item.id"
											@change="getCheckClick(item.id)">
										</u-checkbox>
									</view>
									<view class="popup-style-content-wrap-right-time">
										{{ item.updateTime }}
									</view>
								</view>
							</view>
						</u-checkbox-group>
					</view>
					<view class="popup-style-button">

						<u-button @click="confirmSelectCoupon()" type="primary" text="确定"></u-button>
					</view>
				</view>
			</u-popup>
		</view>

	</view>
</template>

<script>
	const http = require("@/utils/http");
	const util = require("@/utils/util");
	export default {
		data() {
			return {
				express: false, // 是否是散客 fasle 是  true 不是
				name: '',
				tel: '',
				address: '', // 用户默认地址
				show: false,
				couponList: [

				],
				checkboxValue1: [],
				totalAmount: 0,
				totalCouponAmount: 0,
				radiolist: [{
					name: '',
					disabled: false
				}],
				checkList: [],
				orderItemInfo: {}, //订单信息
				userInfo: {},
			}
		},
		onLoad(options) {
			if (uni.getStorageSync('bbcOrderItem')) {
				this.orderItemInfo = uni.getStorageSync('bbcOrderItem')
				this.totalAmount = this.orderItemInfo.totalAmount
				this.couponList = this.orderItemInfo.validCouponList
				this.couponList.map(item => {
					item.disabled = false
				})
			}
		},
		onShow() {
			if (uni.getStorageSync('bbcOrderItem')) {
				this.userInfo = uni.getStorageSync('bbcOrderItem').userInfo
				this.name = this.userInfo.name
				this.tel = this.userInfo.mobile
				if (this.userInfo.leaderAddress) {
					this.express = true // 有店团长
				} else { // 散客 无店团长
					this.express = false
				}
				this.getUseraddress()
			}
		},
		methods: {
			close() {
				this.show = false
				// console.log('close');
				this.checkList = []
				this.checkboxValue1 = []
			},
			selectCouponClick() {
				this.show = true
			},
			// 选中的优惠券
			checkboxChange(n) {
				console.log('选中的优惠券', n);
			},
			getCheckClick(e) {
				let index = this.checkList.indexOf(e)
				if (index === -1) {
					this.checkList.push(e);
				} else {
					this.checkList.splice(index, 1);
				}
			},
			// 提交
			confirmSelectCoupon() {
				let obj = []
				this.totalCouponAmount = 0
				this.couponList.map(item => {
					if (this.checkList.indexOf(item.id) !== -1) {
						obj.push(item)
						this.totalCouponAmount += item.couponAmount
					}
				})
				this.totalAmount = this.orderItemInfo.totalAmount
				this.totalAmount -= this.totalCouponAmount
				this.show = false

			},
			// 获取用户默认地址
			getUseraddress() {
				const params = {
					url: '/pub/user/address/list',
					method: 'POST',
					data: {
						sign: "qcsd",
						data: JSON.stringify({
							userId: this.userInfo.id,
							pageNo: 1,
							pageSize: 1
						})
					},
					callBack: (res) => {
						this.address = res.list[0]
					}
				}
				http.request(params)
			},

			// 跳转到编辑新增地址页面
			toEditAddress(e) {
				if (e) {
					var id = e
					uni.navigateTo({
						url: '/pages/package-user/pages/edit-address/edit-address?id=' + e
					})
				} else {
					uni.navigateTo({
						url: '/pages/package-user/pages/edit-address/edit-address'
					})
				}
			},
			// 提交订单
			submitOrder: util.debounce(function() {
				if (this.express == false && !this.address?.id) {
					uni.showToast({
						title: '请先填写收货地址',
						icon: 'none',
						mask: true
					})
					return
				}
				// console.log(this.checkList, 'this.checkList')
				const params = {
					url: '/pub/order/create',
					method: 'POST',
					data: {
						sign: "qcsd",
						data: JSON.stringify({
							loginToken: this.userInfo.loginToken,
							couponIds: this.checkList,
							userId: this.userInfo.id,
							orderType: this.express ? 2 : 1,
							userAddressId: this.express ? '' : this.address.id,
							address: this.express ? this.userInfo.leaderAddress : '',
							goods: this.orderItemInfo.goods,
							comment: '',
							openId: this.userInfo.openId
						})
					},
					callBack: (res) => {
						if (res.isNeedPay === 1) {
							this.pay(res.orderId, 10, this.express ? 2 : 1)
						} else { // 0金额支付
							// 兑换支付
							let url =
								'/pages/package-pay/pages/pay-result/pay-result?sts=1&orderNumbers=' + res
								.orderId
							uni.redirectTo({
								url: url
							})
						}
					}
				}
				http.request(params)
			}, 1000),
			// 支付 dvyType 2自提 1快递
			pay(orderId, payType, dvyType) {
				const params = {
					url: '/pub/pay/order',
					method: 'POST',
					data: {
						sign: "qcsd",
						data: JSON.stringify({
							orderId: orderId,
							payType: payType,
							loginToken: this.userInfo.loginToken
						})
					},
					callBack: (res) => {
						wx.requestPayment({
							timeStamp: res.timeStamp,
							nonceStr: res.nonceStr,
							package: res.packageValue,
							signType: res.signType,
							paySign: res.paySign,
							success: e => {
								console.log('success', e)
								this.routeToAfterPay(true, this.orderNumbers)
							},
							fail: (e) => {
								console.log('failed', e)
								this.routeToAfterPay(false, this.orderNumbers)
							}
						})
					}
				}
				http.request(params)
			},
			// /**
			// * 支付成功或失败后的统一跳转
			// * @param {Boolean} isSuccess 是否支付成功
			// * @param {String} orderNumbers 订单编号
			// **/
			routeToAfterPay(isSuccess, orderNumbers) {
				let url = ''
				if (isSuccess) {
					// 支付成功后的跳转
					url = '/pages/package-pay/pages/pay-result/pay-result?sts=1&orderNumbers=' + orderNumbers
				} else {
					// 支付失败的跳转
					url = '/pages/package-pay/pages/pay-result/pay-result?sts=0&orderNumbers=' + orderNumbers
				}
				uni.redirectTo({
					url: url
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.submit-order {
		width: 100vw;
		height: 100vh;
		overflow-x: hidden;
		overflow-y: hidden;

		background: #f2f2f2;
		position: relative;

		.submit-order-background {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 760rpx;
			background: linear-gradient(180deg, #025BFF 0%, #F2F2F2 90%);
			z-index: 2;
		}

		.submit-order-index {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 3;
			box-sizing: border-box;
			padding: 40rpx 20rpx;

			.submit-order-index-express {
				.submit-order-index-express-title {
					margin-left: 166rpx;
					width: 378rpx;
					height: 66rpx;
					border-radius: 33rpx;
					opacity: 1;
					text-align: center;
					line-height: 66rpx;
					background: #FFFFFF;
					font-size: 32rpx;
					color: #025BFF;
				}

				.submit-order-index-express-content {
					margin-top: 32rpx;
					width: 710rpx;
					height: 268rpx;
					border-radius: 8rpx;
					background: #FFFFFF;
					padding: 40rpx 20rpx;
					box-sizing: border-box;

					.submit-order-index-express-content-address {
						font-size: 26rpx;
						margin-left: 20rpx;
						color: #101010;
					}

					.submit-order-index-express-content-address .address {
						display: flex;
						flex-direction: row;
						align-items: center;
						justify-content: space-between;
					}

					.submit-order-index-express-content-address .img {
						width: 40rpx;
						height: 40rpx;
					}

					.submit-order-index-express-content-info {
						font-size: 22rpx;
						margin: 20rpx;
						color: #101010;
						display: flex;
						justify-content: flex-start;

						.info-tel {
							margin-left: 10rpx;
						}
					}

					.submit-order-index-express-content-line {
						width: 670rpx;
						height: 0rpx;
						opacity: 1;
						margin: 30rpx 0;
						border: 2rpx solid #E6E6E6;
					}

					.submit-order-index-express-content-ex {
						box-sizing: border-box;
						padding: 0 20rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						font-size: 26rpx;
						color: #101010;
					}

				}

			}

			.submit-order-index-not-express {

				.submit-order-index-not-express-title {
					margin-left: 166rpx;
					width: 378rpx;
					height: 66rpx;
					border-radius: 33rpx;
					opacity: 1;
					text-align: center;
					line-height: 66rpx;
					background: #FFFFFF;
					font-size: 32rpx;
					color: #025BFF;
				}

				.submit-order-index-not-express-content {
					width: 710rpx;
					border-radius: 8rpx;
					opacity: 1;

					background: #FFFFFF;
					margin-top: 32rpx;
					box-sizing: border-box;
					padding: 16rpx 20rpx;

					.not-express-info {
						.not-express-info-tel {
							margin-left: 14rpx;
							display: flex;
							justify-content: flex-start;
							align-items: center;

							.title {
								font-size: 32rpx;
								font-weight: 600;
								color: #101010;
							}

							.addressName {
								font-size: 28rpx;
								margin: 0 16rpx;
								color: #101010;
							}
						}
					}

					.not-express-info-address {
						width: 500rpx;
						margin-left: 126rpx;
						font-size: 28rpx;
						color: #101010;
						white-space: wrap;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
						overflow: hidden;
						text-overflow: ellipsis;
						margin-top: 10rpx;
						line-height: 50rpx;
					}
				}

				.submit-order-index-not-express-content-line {
					margin-top: 30rpx;
					width: 670rpx;
					height: 0rpx;
					opacity: 1;

					border: 2rpx solid #E6E6E6;
				}

				.submit-order-index-not-express-content-input {
					margin-top: 30rpx;

					/deep/ .u-input__content {
						width: 654rpx !important;
						height: 78rpx !important;
						border-radius: 39rpx !important;
						opacity: 1;

						background: #F6F6F6 !important;
						box-sizing: border-box;
						padding-left: 48rpx;
					}

					/deep/ .u-input {
						border: 0rpx solid transparent !important;
					}
				}
			}

			.submit-order-comodity-info {
				margin-top: 20rpx;
				width: 710rpx;
				height: 440rpx;
				border-radius: 8rpx;
				opacity: 1;
				box-sizing: border-box;
				padding: 20rpx;
				background: #FFFFFF;

				.submit-order-comodity-info-tit {
					display: flex;
					justify-content: flex-start;

					.image {
						width: 200rpx;
						height: 200rpx;
						border-radius: 8rpx;
						opacity: 1;
						background: #D8D8D8;

						image {
							width: 100%;
							height: 100%;
						}
					}

					.text {
						margin-left: 20rpx;

						.text-title {
							font-size: 32rpx;
							line-height: 48rpx;
							color: #101010;
						}
							
						.text-size{
							font-size: 26rpx;
							line-height: 48rpx;
							color: #696868;
							margin-top: 20rpx;
						}

						.text-cot {
							width: 442rpx;
							margin-top: 44rpx;
							display: flex;
							justify-content: space-between;

							.text-cot-price {
								font-size: 18;
								color: #C53032;
							}

							.text-cot-amount {
								font-size: 24rpx;
								line-height: 40rpx;
								color: #9E9E9E;
							}
						}
					}
				}

				.submit-order-comodity-info-line {
					margin-top: 20rpx;
					width: 670rpx;
					height: 0rpx;
					opacity: 1;

					border: 2rpx solid #E6E6E6;
				}

				.submit-order-comodity-info-express {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-top: 26rpx;

					.submit-order-comodity-info-express-left {
						font-size: 32rpx;
						color: #101010;
					}

					.submit-order-comodity-info-express-right {
						font-size: 24rpx;
						color: #9E9E9E;
					}
				}

				.submit-order-comodity-info-order-remark {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					margin-top: 26rpx;

					.submit-order-comodity-info-order-remark-left {
						font-size: 32rpx;
						color: #101010;
					}
				}

			}

			.submit-order-coupon {
				margin-top: 10px;
				width: 710rpx;
				border-radius: 8rpx;
				opacity: 1;
				background: #FFFFFF;
				box-sizing: border-box;
				padding: 16rpx 20rpx;

				.submit-order-coupon-select {
					display: flex;
					justify-content: space-between;

					.submit-order-coupon-select-left {
						font-size: 32rpx;
						color: #101010;
					}

					.submit-order-coupon-select-button {
						display: flex;
						flex-direction: row;
						align-items: center;

						/deep/ .u-button {
							width: 78px !important;
							height: 28px !important;
							border-radius: 4px !important;
							background: #FFFFFF !important;
							box-sizing: border-box !important;
							border: 1px solid #979797 !important;
							color: #9E9E9E !important;
						}

						/deep/ .u-button__text {
							font-size: 24rpx !important;
						}
					}
				}

				.submit-order-coupon-amount-price,
				.submit-order-coupon-express-price {
					margin-top: 18rpx;
					display: flex;
					justify-content: space-between;

					.submit-order-coupon-amount-price-left,
					.submit-order-coupon-express-price-left {
						font-size: 32rpx;
						color: #101010;
					}

					.submit-order-coupon-amount-price-right,
					.submit-order-coupon-express-price-right {
						font-size: 32rpx;
						color: #C53032;
					}
				}

			}


			.submit-order-price {
				position: fixed;
				bottom: 0;
				left: 0;
				margin-left: -10%;
				width: 120%;
				height: 168rpx;
				background: #FFFFFF;
				box-sizing: border-box;
				padding: 14rpx 15%;
				display: flex;
				justify-content: space-between;

				.submit-order-price-left {
					display: flex;
					justify-content: flex-start;
					margin-top: 13px;

					.submit-order-price-left-text {
						font-size: 12px;
						color: #101010;
					}

					.submit-order-price-middle-text {
						font-size: 14px;
						color: #C53032;
					}
				}

				.submit-order-price-button {
					/deep/ .u-button {
						width: 100px !important;
						height: 36px !important;
						border-radius: 18px !important;
						background: linear-gradient(270deg, #FC4D0E 0%, #F58927 100%) !important;
						border: 0px solid transparent;
					}

				}

			}
		}

		.popup-style {
			height: 1168rpx;
			box-sizing: border-box;
			padding: 10rpx 20rpx;
			position: relative;

			.popup-style-title {
				display: flex;
				justify-content: space-between;
			}

			.popup-style-content {
				margin-top: 40rpx;
				height: 900rpx;
				overflow-y: auto;

				.popup-style-content-wrap {
					width: 712rpx;
					display: flex;
					justify-content: flex-start;
					margin-bottom: 20rpx;

					.popup-style-content-wrap-left {
						width: 258rpx;
						height: 192rpx;
						position: relative;

						.popup-style-content-wrap-left-img {
							position: absolute;
							top: 0;
							left: 0;
							width: 100%;
							height: 100%;
							z-index: 2;

							image {
								width: 100%;
								height: 100%;
							}

						}

						.popup-style-content-wrap-left-text {
							position: absolute;
							top: 50%;
							left: 50%;
							transform: translate(-50%, -50%);
							z-index: 5;

							.popup-style-content-wrap-left-text-number-left {
								font-size: 32rpx;
								color: #FFFFFF;
							}

							.popup-style-content-wrap-left-text-number-middle {
								font-size: 55rpx;
								color: #FFFFFF;
							}

							.popup-style-content-wrap-left-text-number-right {
								font-size: 32rpx;
								color: #FFFFFF;
							}

							.popup-style-content-wrap-left-text-info {
								font-size: 24rpx;
								color: #FFFFFF;
							}
						}
					}

					.popup-style-content-wrap-right {
						width: 452rpx;
						height: 192rpx;
						background: #FFFFFF;
						box-sizing: border-box;
						padding: 18rpx 20rpx;

						box-shadow: 0rpx 2rpx 8rpx 0rpx rgba(187, 187, 187, 0.5);

						.popup-style-content-wrap-right-title {
							display: flex;
							justify-content: flex-start;

							.popup-style-content-wrap-right-title-lf {
								width: 86rpx;
								height: 36rpx;
								border-radius: 18rpx;
								background: #FBEFEF;
								font-size: 24rpx;
								text-align: center;
								line-height: 36rpx;
								color: #C53032;
							}

							.popup-style-content-wrap-right-title-rt {
								margin-left: 10rpx;
								font-size: 24rpx;
								color: #101010;
							}
						}

						.popup-style-content-wrap-right-cot {
							font-size: 32rpx;
							color: #101010;
						}


						.popup-style-content-wrap-right-button {
							margin-left: 342rpx;
							margin-bottom: 16rpx;

							/deep/ .u-checkbox__icon-wrap {
								width: 40rpx !important;
								height: 40rpx !important;
								border-radius: 20rpx !important;

							}

							/deep/ .u-icon__icon {
								font-size: 36rpx !important;
							}
						}

						.popup-style-content-wrap-right-time {
							font-size: 20rpx;
							color: #3D3D3D;
						}
					}
				}
			}

		}

		.popup-style-button {
			position: absolute;
			bottom: 40rpx;
			left: 40rpx;

			/deep/ .u-button {
				width: 670rpx !important;
				height: 78rpx !important;
				border-radius: 54rpx !important;

				background: #025BFF !important;
			}
		}
	}
</style>