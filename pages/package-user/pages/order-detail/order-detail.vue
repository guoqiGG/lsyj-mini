<template>
	<view class="order-detail">
		<view class="order-detail-backgroundImg">
			<image src="/pages/package-user/static/order-detail-bg.png" mode=""></image>
		</view>
		<!-- v-if="orderDetail.orderStatus!=5&&orderDetail.orderStatus!=1" -->
		<view class="order-detail-status">
			<view class="order-detail-status-content">
				<view class="status-img-box">
					<image v-if="orderDetail.orderStatus>1&&orderDetail.orderStatus!=5" class="status-img"
						src="/pages/package-user/static/order-detail-status.png" mode=""></image>
					<image v-else class="status-img" src="/pages/package-user/static/order-detail-status2.png" mode="">
					</image>
				</view>
				<view class="status-text"
					:class="orderDetail.orderStatus>1&&orderDetail.orderStatus!=5?'isSelectColor':''">
					买家付款
				</view>
			</view>
			<view class="order-detail-status-content">
				<view class="status-img-box">
					<image v-if="orderDetail.orderStatus>2&&orderDetail.orderStatus!=5" class="status-img"
						src="/pages/package-user/static/order-detail-status.png" mode=""></image>
					<image v-else class="status-img" src="/pages/package-user/static/order-detail-status2.png" mode="">
					</image>
				</view>
				<view class="status-text"
					:class="orderDetail.orderStatus>2&&orderDetail.orderStatus!=5?'isSelectColor':''">
					商品发货
				</view>
			</view>
			<view class="order-detail-status-content">
				<view class="status-img-box">
					<image v-if="orderDetail.orderStatus>3&&orderDetail.orderStatus!=5" class="status-img"
						src="/pages/package-user/static/order-detail-status.png" mode=""></image>
					<image v-else class="status-img" src="/pages/package-user/static/order-detail-status2.png" mode="">
					</image>
				</view>
				<view class="status-text"
					:class="orderDetail.orderStatus>3&&orderDetail.orderStatus!=5?'isSelectColor':''">
					交易完成
				</view>
			</view>
		</view>
		<!-- 地址 -->
		<view class="address">
			<view class="icon">
				<image style="width: 38rpx;height: 40rpx;" src="/pages/package-user/static/address.png" mode=""></image>
			</view>
			<view class="right">
				<view class="address-info">
					<text class="name">{{orderDetail.userName}}</text>
					<text class="name">{{orderDetail.userPhone}}</text>
				</view>
				<view class="addres-detail">
					{{orderDetail.address}}
				</view>
			</view>
		</view>

		<!-- 产品 -->
		<view class="product">
			<view class="product_icon">
				<image style="width: 100%;height: 100%;" :src="orderDetail.orderGoods[0].thumbail" mode=""></image>
			</view>
			<view class="right">
				<view class="name">
					{{orderDetail.orderGoods[0].title}}
				</view>
				<view class="price_box">
					<view class="price">
						<text>￥{{orderDetail.orderGoods[0].salePrice}}</text>
						<text style="color: #979797;margin-left: 20rpx;">{{orderDetail.goodsCount}}件</text>
					</view>
					<view class="btn" @click="applyRefund(orderDetail.orderId)"
						v-if="orderDetail.orderStatus==2&&orderDetail.isCanApplyRefund==1">
						<!-- isCanApplyRefund==1可以申请0,不可申请 -->
						申请退款
					</view>
					<view class="btn" @click="receive(orderDetail.orderId)"
						v-if="orderDetail.orderStatus==3">
						确认收货
					</view>
				
				</view>
			</view>
		</view>
		<!-- 订单 -->
		<view class="order">
			<view class="item">
				<text style="color: #9E9E9E;">订单编号：</text>
				<text>{{orderDetail.orderId}}</text>
			</view>
			<view class="item">
				<text style="color: #9E9E9E;">下单时间：</text>
				<text>{{orderDetail.statusCreateTime}}</text>
			</view>
			<view class="line">
			</view>
			<view class="item">
				<text style="color: #9E9E9E;">支付方式：</text>
				<text>微信支付</text>
			</view>
			<view class="item">
				<text style="color: #9E9E9E;">配送方式：</text>
				<text>{{orderDetail.orderType===1?'快递配送':orderDetail.orderType===2?'到店自提':''}}</text>
			</view>
			<view class="btn" @tap="copyText(orderDetail.orderId)">
				复制
			</view>
		</view>
		<view class="total_price" style="height: 190rpx;">
			<view class="item">
				<text style="color: #9E9E9E;">商品总额：</text>
				<text style="font-size: 30rpx;">￥{{orderDetail.totalAmount}}</text>
			</view>
			<view class="item">
				<text style="color: #9E9E9E;">商品运费：</text>
				<text style="font-size: 30rpx;">￥{{orderDetail.totalAmount}}</text>
			</view>
			<view class="item">
				<text></text>
				<text style="color:#C53032">订单总额：<text
						style="font-size: 34rpx;">￥{{orderDetail.totalAmount}}</text></text>
			</view>
		</view>
		<view class="refundBtn" @click="applyRefund(orderDetail.orderId)"
		v-if="orderDetail.orderStatus==2&&orderDetail.isCanApplyRefund==1"
			>
			<view class="btn">
				整单退款
			</view>
			
		</view>
		<view class="refundBtn" @click="receive(orderDetail.orderId)"
		v-if="orderDetail.orderStatus==3"
			>
			<view class="btn">
				确认收货
			</view>
			
		</view>
		
	</view>
</template>

<script>
	const http = require("@/utils/http");
	import uniCopy from "@/components/js_sdk/copy/uni-copy.js";
	export default {
		data() {
			return {
				orderId: null, //订单id
				loginToken: null,
				orderDetail: null,
			}
		},
		onLoad(option) {
			if (option.orderId) {
				this.orderId = option.orderId
				let bbcLoginResult = uni.getStorageSync("bbcLoginResult"); //用户信息
				this.loginToken = bbcLoginResult.loginToken
				this.getOrderDetail()
			}

		},
		methods: {
			getOrderDetail() {
				let obj = {
					orderId: this.orderId,
					loginToken: this.loginToken,
				}
				const params = {
					url: "/pub/order/detail",
					method: "POST",
					data: {
						sign: 'qcsd',
						data: JSON.stringify(obj),
					},
					callBack: (res) => {
						this.orderDetail = res
					},
				}
				http.request(params);

			},
			// 申请退款
			applyRefund(orderId) {
				uni.navigateTo({
					url: `/pages/package-refund/pages/apply-refund/apply-refund?orderId=` + orderId
				})

			},
			// 确认收货
			receive(orderId) {
				const params = {
					url: "/pub/order/confirm",
					method: "POST",
					data: {
						sign: 'qcsd',
						data: JSON.stringify({
							orderId: orderId,
							loginToken: this.loginToken
						}),
					},
					callBack: (res) => {
						this.getOrderDetail()
					},
				}
				http.request(params);

			},
			copyText(text) {
				uniCopy({
					content: text,
					success: (res) => {
						uni.showToast({
							title: res,
							icon: "none",
						});
					},
					error: (e) => {
						uni.showToast({
							title: e,
							icon: "none",
							duration: 3000,
						});
					},
				});
			}

		}
	}
</script>

<style lang="scss" scoped>
	.order-detail {
		width: 100vw;
		overflow-x: hidden;
		height: 100vh;
		overflow: auto;
		background: #f2f2f2;

		.order-detail-backgroundImg {
			width: 100%;
			height: 200rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.order-detail-status {
			display: flex;
			align-items: center;

			.order-detail-status-content {
				flex: 1;
				height: 84rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				position: relative;
				font-size: 26rpx;
				text-align: center;

				.status-img-box {
					position: absolute;
					margin: 0 auto;
					top: -20rpx;
					width: 36rpx;
					height: 36rpx;
					background-color: #fff;
					border-radius: 50%;
					display: flex;
					justify-content: center;
					align-items: center;

					.status-img {
						width: 80%;
						height: 80%;
					}
				}

				.isSelectColor {
					color: #C53032;
				}

			}
		}

		.address {
			margin-top: 20rpx;
			height: 90rpx;
			background: #FFFFFF;
			padding: 24rpx 20rpx;
			display: flex;

			.icon {
				width: 60rpx;
				text-align: center;
				margin-top: 10rpx;
			}

			.right {
				flex: 1;

				.address-info {
					width: 100%;
					display: flex;
					font-size: 28rpx;
					font-weight: 400;

					.name {
						width: 50%;
					}
				}

				.addres-detail {
					margin-top: 10rpx;
					font-weight: 400;
					font-size: 26rpx;
					color: #979797;
				}
			}
		}

		.product {
			margin-top: 20rpx;
			height: 200rpx;
			background: #FFFFFF;
			padding: 34rpx 40rpx;
			display: flex;

			.product_icon {
				width: 194rpx;
				height: 194rpx;
				background: #D8D8D8;
				border-radius: 12rpx 12rpx 12rpx 12rpx;
				margin-right: 34rpx;
			}

			.right {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.name {
					font-weight: 400;
					font-size: 28rpx;
					color: #101010;
				}

				.price_box {
					display: flex;
					justify-content: space-between;

					.price {
						font-weight: 400;
						font-size: 32rpx;
						color: #C53032;
					}

					.btn {
						
						width: 132rpx;
						height: 46rpx;
						font-weight: 400;
						font-size: 24rpx;
						line-height: 46rpx;
						text-align: center;
						border-radius: 30rpx;
						color: #C53032;
						border-radius:26rpx ;
						border: 2rpx solid #C53032;

					}
				}
			}
		}

		.order {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			height: 324rpx;
			margin-top: 20rpx;
			background: #FFFFFF;
			padding: 40rpx 28rpx;
			font-weight: 400;
			font-size: 28rpx;
			color: #101010;
			position: relative;

			.line {
				width: 710rpx;
				height: 0rpx;
				border: 2rpx solid #E6E6E6;
			}

			.btn {
				position: absolute;
				right: 30rpx;
				top: 30rpx;
				width: 90rpx;
				height: 36rpx;

				background: #FFFFFF;
				border-radius: 38rpx 38rpx 38rpx 38rpx;
				border: 2rpx solid #979797;
				text-align: center;
			}
		}

		.total_price {
			margin: 20rpx 0;
			height: 190rpx;
			background: #FFFFFF;
			border-radius: 0rpx 0rpx 0rpx 0rpx;
			font-weight: 400;
			font-size: 28rpx;
			color: #101010;
			line-height: 34rpx;
			padding: 20rpx 32rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.item {
				display: flex;
				justify-content: space-between;
			}
		}

		.refundBtn {
			width: 100%;
			height: 128rpx;
			background-color: #FFFFFF;
			align-items: center;
			display: flex;
			justify-content: flex-end;

			.btn {
				width: 164rpx;
				height: 54rpx;
				border-radius: 31rpx;
				border: 2rpx solid #C53032;
				line-height: 54rpx;
				font-weight: 400;
				font-size: 28rpx;
				color: #C53032;
				text-align: center;
				margin-right: 30rpx;
			}
		}
	}
</style>