<template>
	<view class="order-list">
		<u-tabs :scrollable="false" :current="currentTab" :list="list1" @click="handleTabClick()"></u-tabs>
		<view class="order-list-content">
			<view class="order-list-content-box" v-for="(item,index) in orderLists" :key="item.orderId">
				<view class="order-list-content-box-title">
					<view class="order-list-content-box-title-left">
						订单编号：{{item.orderId}}
					</view>
					<view class="order-list-content-box-title-right">
						<!-- // 00全部 1待支付 2待发货(已支付) 3已发货 4确认收货 -->
						{{item.orderStatus===1?'待支付':item.orderStatus===2?'待发货':item.orderStatus===3?'已发货':item.orderStatus===4?'已完成':''}}
					</view>
				</view>
				<view class="order-list-content-box-content" @click="goOrderDetail()">
						<image class="order-list-content-box-content-img" :src="item.orderGoods[0].thumbail" mode=""></image>
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
				}],
				isLoaded: false,
				isAll: false,
				currentTab: 0,
				orderLists: [],
				pageNo: 1, // 当前页
				pageSIize: 10, //总页数
				loginToken: null,
				status: null,
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

			if(this.currentTab==0){
				this.status=this.list1[0].id
			}else if(this.currentTab==1){
				this.status=this.list1[1].id
			}else if(this.currentTab==2){
				this.status=this.list1[2].id
			}else if(this.currentTab==3){
				this.status=this.list1[3].id
			}else if(this.currentTab==4){
				this.status=this.list1[4].id
			}
		},
		onShow() {
			let bbcLoginResult = uni.getStorageSync("bbcLoginResult"); //用户信息
			this.loginToken = bbcLoginResult.loginToken
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
				this.status = e.id
				this.getOrderLists()
			},
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
						console.log(this.orderLists,'orderLists',this.pageSIize,'this.pageSIize')
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
			height: 398rpx;
			box-sizing: border-box;
			padding: 18rpx 22rpx;
			font-size: 28rpx;
		}

		.order-list-content-box-title {
			display: flex;
			justify-content: space-between;
			margin-bottom: 26rpx;
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
	}
</style>