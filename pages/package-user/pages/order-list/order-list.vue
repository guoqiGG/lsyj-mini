<template>
	<view class="order-list">
		<u-tabs :scrollable="true" :current="currentTab" :list="list1" @click="handleTabClick()"></u-tabs>
		<view class="order-list-content">
			<view class="order-list-content-box" v-for="(item,index) in orderLists" :key="item.orderId">
				<view class="order-list-content-box-title">
					<view class="order-list-content-box-title-left">
						订单编号：{{item.orderId}}
					</view>
					<view class="order-list-content-box-title-right" :class="item.orderStatus>1?'blue':''" v-if="currentTab!==5">
						<!-- // 00全部 1待支付 2待发货(已支付) 3已发货 4确认收货  5已取消-->
						{{item.orderStatus===1?'待支付':item.orderStatus===2?'待发货':item.orderStatus===3?'已发货':item.orderStatus===4?'已完成':item.orderStatus===5?'已取消':''}}
					</view>
					<view class="order-list-content-box-title-right" :class="item.orderStatus>1?'blue':''" v-else>
						<!-- //0-未申请退款；1-申请退款；2-退款中；3-退款失败；4-退款成功 5后台手动退款成功-->
						{{item.refundStatus===0?'未申请退款':item.refundStatus===1?'申请退款':item.refundStatus===2?'退款中':item.refundStatus===3?'退款失败':item.refundStatus===4?'退款成功':item.refundStatus===5?'后台退款成功':''}}
					</view>
				</view>
				<view class="order-list-content-box-content" @click="goOrderDetail(item.orderId)">
					<image class="order-list-content-box-content-img" :src="item.orderGoods[0].thumbail" mode="">
					</image>
					<view class="order-list-content-box-content-text">
						<view class="title">
							{{item.orderGoods[0].title}}
						</view>
						<view class="price">
							<view class="price-number">
								￥{{item.orderGoods[0].salePrice}}
							</view>
							<view class="price-amount">
								{{item.goodsCount}}件
							</view>

						</view>
					</view>
				</view>
				<view class="order-list-content-box-count">
					共{{item.goodsCount}}件商品 总计：{{item.totalAmount}}
				</view>

				<view class="order-list-content-box-btn" v-if="item.orderStatus===1">
					<view class="cancelBtn"  @click="cancelOrder(item.orderId)">
						取消订单
					</view>
					<view class="cancelBtn"
						style="margin-left: 20rpx;width: 120rpx;color: #D90024;border: 2rpx solid #D90024;"
						 @click="payOrder(item.orderId)">
						付款
					</view>

				</view>
				<view class="order-list-content-box-btn" v-if="item.orderStatus===3">
					<view class="cancelBtn"
						style="margin-left: 20rpx;width: 120rpx;color: #D90024;border: 2rpx solid #D90024;"
						 @click="receive(item.orderId)">
						确认收货
					</view>
				
				</view>


			</view>
			<!-- 空列表或加载全部提示 -->
			<EmptyAllTips v-if="isLoaded" :isEmpty="!orderLists.length" :emptyTips="i18n.noCommodity"
				:isAll="current == pages" />

		</view>
	</view>

</template>

<script>
	const http = require("@/utils/http");
	export default {
		data() {
			return {
				// 00全部 1待支付 2待发货(已支付) 3已发货 4确认收货
				list1: [{
					name: '全部',
					id: 0,
				}, {
					name: '待付款',
					id: 1,
				}, {
					name: '待发货',
					id: 2,
				}, {
					name: '待收货',
					id: 3,
				}, {
					name: '已完成',
					id: 4,
				},
				{
					name: '退款/售后',
					id: 100,
				},
				],
				isLoaded: false,
				isAll: false,
				currentTab: 0,
				orderLists: [],
				pageNo: 1, // 当前页
				pageSIize: 10, //总页数
				loginToken: null,
				status: null,
				userId: null, //用户id
				activeLineStyle: {
					width: '56rpx',
					height: '2rpx',
					background: '#025BFF'
				}
			}
		},
		onLoad(option) {
			this.currentTab = option.id
			if (this.currentTab == 0) {
				this.status = this.list1[0].id
			} else if (this.currentTab == 1) {
				this.status = this.list1[1].id
			} else if (this.currentTab == 2) {
				this.status = this.list1[2].id
			} else if (this.currentTab == 3) {
				this.status = this.list1[3].id
			} else if (this.currentTab == 4) {
				this.status = this.list1[4].id
			} else if (this.currentTab == 5) {
				this.status = this.list1[5].id
			}
		},
		onShow() {
			let bbcLoginResult = uni.getStorageSync("bbcLoginResult"); //用户信息
			this.loginToken = bbcLoginResult.loginToken
			this.userId = bbcLoginResult.id
			this.getOrderLists()
		},
		methods: {
			// 跳转取订单详情
			goOrderDetail(orderId) {
				if(this.currentTab!==5){
					uni.navigateTo({
						url: `/pages/package-user/pages/order-detail/order-detail?orderId=` + orderId
					})
				}
				
			},
			// 取消订单
			cancelOrder(orderId) {
				let obj = {
					orderId: orderId,
					userId: this.userId,
					loginToken: this.loginToken,
				}
				const params = {
					url: "/pub/order/cancel",
					method: "POST",
					data: {
						sign: 'qcsd',
						data: JSON.stringify(obj),
					},
					callBack: (res) => {
						uni.showToast({
							title: "取消成功~",
							icon: "none",
						});
						this.getOrderLists()
					},
				}
				http.request(params);
			},
			// 支付 dvyType 2自提 1快递
			payOrder(orderId) {
				const params = {
					url: '/pub/pay/order',
					method: 'POST',
					data: {
						sign: "qcsd",
						data: JSON.stringify({
							orderId: orderId,
							payType: 10,
							loginToken: this.loginToken
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
								this.getOrderLists()
							},
							fail: (e) => {
								console.log('failed', e)
							}
						})
					}
				}
				http.request(params)
			},
			// 确认收货
			receive(orderId) {
				const params = {
					url: '/pub/order/confirm',
					method: 'POST',
					data: {
						sign: "qcsd",
						data: JSON.stringify({
							orderId: orderId,
							loginToken: this.loginToken
						})
					},
					callBack: (res) => {
						this.getOrderLists()
					}
				}
				http.request(params)
			},
			handleTabClick(e) {
				this.currentTab = e.index;
				this.status = e.id
				this.getOrderLists()
			},
			// 获取订单信息
			getOrderLists() {
				this.isLoaded = false
				let obj = {
					pageNo: this.pageNo,
					pageSIize: this.pageSIize,
					loginToken: this.loginToken,
					status: this.status,
				}
				const params = {
					url: "/pub/order/list",
					method: "POST",
					data: {
						sign: 'qcsd',
						data: JSON.stringify(obj),
					},
					callBack: (res) => {
						this.isLoaded = true
						this.orderLists = this.pageNo == 1 ? res : this.orderLists.concat(res)
						this.pageSIize = res.total == 0 ? 1 : Math.ceil(res.total / this.pageSize)
					},
				}
				http.request(params);
			},

		},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom() {

			if (this.pageNo < this.pageSIize) {
				this.pageNo = this.pageNo + 1
				this.getOrderLists()
			} else {
				this.isAll = true
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/ .u-tabs__wrapper__nav__line {
		left: -12rpx;
		width: 58rpx !important;

	}
		

	/deep/ .u-tabs__wrapper__nav__item__text {
		font-size: 28rpx !important;
	}

	.order-list {
		background: #f2f2f2;
		height: 100vh;
		width: 100vw;
		overflow-x: hidden;
		overflow-y: auto;
	}

	.order-list-content {
		.order-list-content-box {
			background: #fff;
			margin-top: 20rpx;
			width: 750rpx;
			// height: 398rpx;
			box-sizing: border-box;
			padding: 18rpx 22rpx;
			font-size: 28rpx;
		}

		.order-list-content-box-title {
			display: flex;
			justify-content: space-between;
			margin-bottom: 26rpx;

			.blue {
				color: #025BFF;
			}
		}

		.order-list-content-box-content {
			display: flex;

			.order-list-content-box-content-img {
				width: 220rpx;
				height: 220rpx;
				margin-right: 22rpx;
				border-radius: 12rpx
			}

			.order-list-content-box-content-text {
				margin-top: 62rpx;

				.title {
					font-size: 32rpx;
				}

				.price {
					width: 474rpx;
					display: flex;
					justify-content: space-between;
					margin-top: 20rpx;
					font-size: 24rpx;

				}
			}
		}

		.order-list-content-box-count {
			margin-top: 18rpx;
			display: flex;
			justify-content: flex-end;
		}

		.order-list-content-box-btn {
			width: 100%;
			height: 54rpx;
			display: flex;
			justify-content: flex-end;
			margin: 10rpx;

			.cancelBtn {
				width: 168rpx;
				height: 54rpx;
				border: 2rpx solid #979797;
				font-weight: 400;
				font-size: 24rpx;
				color: #979797;
				line-height: 54rpx;
				text-align: center;
				border-radius: 30rpx;
			}
		}
	}
</style>