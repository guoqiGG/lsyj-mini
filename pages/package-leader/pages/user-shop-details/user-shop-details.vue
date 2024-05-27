<template>
	<view style="background: #f2f2f2;">
		<view class="order-list">
			<!-- 	<view class="search">
			<u-icon top="22" class="search_icon" name="search" size="40"></u-icon>
			<text class="line"></text>
			<input type="text" class="input" v-model="keyword" placeholder="搜索订单" />
			<button size="default" type="default" class="button" @click="searchBtn">搜索</button>
		</view> -->
			<u-tabs :scrollable="true" :current="currentTab" :list="list1" @click="handleTabClick"></u-tabs>
			<view class="order-list-content">
				<view class="order-list-content-box" v-for="(item, index) in orderLists" :key="item.orderId">
					<view class="order-list-content-box-title">
						<view class="order-list-content-box-title-left">
							订单编号：{{ item.orderId }}
						</view>
						<view class="order-list-content-box-title-right" :class="item.orderStatus > 1 ? 'blue' : ''"
							v-if="currentTab !== 5">
							<!-- // 00全部 1待支付 2待发货(已支付) 3已发货 4确认收货  5已取消-->
							{{ item.orderStatus === 1 ? '待支付' : item.orderStatus === 2 ? '待发货' : item.orderStatus === 3
				?
				'已发货' : item.orderStatus === 4 ? '已完成' : item.orderStatus === 5 ? '已取消' : '' }}
						</view>
						<view class="order-list-content-box-title-right" :class="item.orderStatus > 1 ? 'blue' : ''"
							v-else>
							<!-- //0-未申请退款；1-申请退款；2-退款中；3-退款失败；4-退款成功 5后台手动退款成功-->
							{{ item.refundStatus === 0 ? '未申请退款' : item.refundStatus === 1 ? '申请退款' : item.refundStatus
				===
				2 ? '退款中' : item.refundStatus === 3 ? '退款失败' : item.refundStatus === 4 ? '退款成功' :
					item.refundStatus === 5 ? '后台退款成功' : '' }}
						</view>
					</view>
					<view class="order-list-content-box-content" @tap="toOrderDetails(item.orderId)">
						<image class="order-list-content-box-content-img" :src="item.orderGoods[0].thumbail" mode="">
						</image>
						<view class="order-list-content-box-content-text">
							<view class="title">
								{{ item.orderGoods[0].title }}
							</view>
							<view class="price">
								<view class="price-number">
									￥{{ item.orderGoods[0].salePrice }}
								</view>
								<view class="price-amount">
									{{ item.goodsCount }}件
								</view>

							</view>
						</view>
					</view>
					<view class="order-list-content-box-count">
						共{{ item.goodsCount }}件商品 总计：{{ item.totalAmount }}
					</view>
				</view>
				<!-- 空列表或加载全部提示 -->
				<EmptyAllTips v-if="isLoaded" :isEmpty="!orderLists.length" emptyTips="暂无订单信息" :isAll="isAll" />
			</view>
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
			pageSize: 10, //每页条数
			loginToken: null,
			status: 0,
			userId: null, //用户id
			activeLineStyle: {
				width: '56rpx',
				height: '2rpx',
				background: '#025BFF'
			}
		}
	},
	onLoad(option) {

	},
	onShow() {
		this.loginToken = uni.getStorageSync("bbcToken")
		this.userId = uni.getStorageSync("bbcUserInfo").id
		this.mobile = uni.getStorageSync("bbcUserInfo").leaderMobile
		this.getOrderLists()
	},
	methods: {
		// searchBtn() {
		// 	console.log(124235)
		// 	console.log(this.keyword)
		// }
		handleTabClick(e) {
			this.currentTab = e.index;
			this.pageNo = 1
			this.orderLists = []
			this.status = e.id
			this.getOrderLists()
		},
		// 获取订单信息
		getOrderLists() {
			this.isLoaded = false
			let obj = {
				pageNo: this.pageNo,
				pageSize: this.pageSize,
				loginToken: this.loginToken,
				status: this.status,
				mobile: this.mobile,
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
					if (this.pageNo != 1 && res.length == 0) {
						this.isAll = true
					}
				},
			}
			http.request(params);
		},
		// 到订单详情页
		toOrderDetails(orderId) {
			let refund = false
			uni.navigateTo({
				url: `/pages/package-user/pages/order-detail/order-detail?orderId=${orderId}&showRefund=${refund}`
			})
		}
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {
		if ((this.orderLists.length % this.pageSize == 0) && this.orderLists.length >= this.pageSize && this.isAll == false) {
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
	overflow-x: hidden;
	overflow-y: auto;
}

.order-list-content {
	.order-list-content-box {
		background: #fff;
		margin-top: 20rpx;
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

// .search {
// 			height: 78rpx;
// 			position: relative;
// 			background: #FFFFFF;
// 			box-shadow: 0rpx 8rpx 24rpx 0rpx rgba(141, 141, 141, 0.3);
// 			border-radius: 40rpx;
// 			padding-left: 10rpx;
// 			.line {
// 				position: absolute;
// 				top: 22rpx;
// 				left: 56rpx;
// 				width: 4rpx;
// 				height: 40rpx;
// 				background-color: rgba(216, 216, 216, 0.3);
// 			}

// 			.uicon-search {
// 				position: absolute !important;
// 				left: 0 !important;
// 				top: 10rpx !important;
// 			}

// 			.input {
// 				position: absolute;
// 				left: 60rpx;
// 				top: 0;
// 				width: 90%;
// 				height: 58rpx;
// 				padding: 10rpx 20rpx;
// 				border-radius: 40rpx;

// 			}

// 			.button {
// 				position: absolute;
// 				right: 0;
// 				top: 0;
// 				text-align: center;
// 				width: 202rpx;
// 				height: 78rpx;
// 				background: #025BFF;
// 				box-shadow: 0rpx 8rpx 24rpx 0rpx rgba(141, 141, 141, 0.3);
// 				border-radius: 0rpx 40rpx 40rpx 0rpx;
// 				font-weight: 400;
// 				font-size: 32rpx;
// 				color: #FFFFFF;
// 				z-index: 99;

// 			}
// 		}</style>