<template>
	<view class="order-list">
		<u-tabs :scrollable="false" :current="currentTab" :list="list1" @click="handleTabClick()"></u-tabs>
		<view class="order-list-content">
			<view class="order-list-content-box" v-for="(item,index) in orderLists" :key="item.id">
				<view class="order-list-content-box-title">
					<view class="order-list-content-box-title-left">
						订单编号：<!-- {{item.}} -->
					</view>
					<view class="order-list-content-box-title-right">
						待发货
					</view>
				</view>
				<view class="order-list-content-box-content" @click="goOrderDetail()">
					<view class="order-list-content-box-content-img">

					</view>
					<view class="order-list-content-box-content-text">
						<view class="title">
							限购
						</view>
						<view class="price">
							<view class="price-number">
								0.01
							</view>
							<view class="price-amount">
								X1
							</view>

						</view>
					</view>
				</view>
				<view class="order-list-content-box-count">
					共1件商品 总计：0.01
				</view>
			</view>
			<view class="order-list-content-box" @click="goOrderDetail()">
				<view class="order-list-content-box-title">
					<view class="order-list-content-box-title-left">
						订单编号：1764841653610352640
					</view>
					<view class="order-list-content-box-title-right">
						待发货
					</view>
				</view>
				<view class="order-list-content-box-content">
					<view class="order-list-content-box-content-img">

					</view>
					<view class="order-list-content-box-content-text">
						<view class="title">
							限购
						</view>
						<view class="price">
							<view class="price-number">
								0.01
							</view>
							<view class="price-amount">
								X1
							</view>

						</view>
					</view>
				</view>
				<view class="order-list-content-box-count">
					共1件商品 总计：0.01
				</view>
			</view>

		</view>
	</view>

</template>

<script>
	const http = require("@/utils/http");
	export default {
		data() {
			return {
				list1: [{
					name: '全部',
					id:10009999,
				}, {
					name: '待付款',
					id:1000,
				}, {
					name: '待发货',
					id:1001,
				}, {
					name: '待收货',
					id:2001,
				}, {
					name: '已完成',
					id:2002,
				}],
				currentTab: 0,
				
				// 1000-待付款,1001-已支付(待发货),2001-待收货,2002-后台确认收货（已完成),3001-用户点击确认收货(已完成),9000-已取消,-8000-错误
				
				
				orderLists: [],
				pageNo: 1, // 当前页
				pageSIize: 10, //总页数
				loginToken: null,
				status:null,
				activeLineStyle: {
					width: '56rpx',
					height: '2rpx',
					background: '#025BFF'
				}
			}
		},
		onLoad(orderId) {
			console.log(orderId)
			this.currentTab = orderId.id
		},
		onShow() {
			let bbcUserInfo = uni.getStorageSync("bbcUserInfo"); //用户信息
			this.loginToken = bbcUserInfo.loginToken
			this.getOrderLists()
		},
		methods: {
			goOrderDetail() {
				uni.navigateTo({
					url: '/pages/package-user/pages/order-detail/order-detail'
				})
			},
			handleTabClick(e) {
				this.currentTab = e.index;
				this.status=e.id
			},
			getOrderLists() {
				let obj = {
					pageNo: this.pageNo,
					pageSIize: this.pageSIize,
					loginToken: 1,
					status:1000,
				}
				const params = {
					url: "/pub/order/list",
					method: "POST",
					data: {
						sign: 'qcsd',
						data: JSON.stringify(obj),
					},
					callBack: (res) => {
						this.orderLists = res.list
					},
				}
				http.request(params);
			},

		},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom() {
			if (this.current < this.pages) {
				this.current = this.current + 1
				this.getLeaderFriends()
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
		font-size: 28rpx!important;
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
			height: 398rpx;
			box-sizing: border-box;
			padding: 18rpx 22rpx;
			font-size: 28rpx;
		}

		.order-list-content-box-title {
			display: flex;
			justify-content: space-between;
		}

		.order-list-content-box-content {
			display: flex;

			.order-list-content-box-content-img {
				width: 220rpx;
				height: 220rpx;
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
	}
</style>