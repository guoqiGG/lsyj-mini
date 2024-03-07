<template>
	<view class="main">
		<view class="background"></view>
		<view class="user">
			<!-- <button @click="login()">一键登录</button> -->
			<view class="user-login">
				<view class="user-img">
					<image src="/static/user/head-pic.png" mode=""></image>
				</view>
				<view class="user-info">
					<view class="user-name">
						QCT9996
					</view>
					<view class="user-name-type">
						普通
					</view>
				</view>
			</view>
			<view class="order">
				<view class="order-title">
					<view class="order-title-left">
						我的订单
					</view>
					<view class="order-title-right" @click="goOrderList(0)">
						全部订单>
					</view>
				</view>
				<view class="order-content">
					<view class="order-wrap" @click="goOrderList(1)">
						<view class="order-img">
							<image src="/static/user/pay.png" mode=""></image>
						</view>
						<view class="order-text">
							待付款
						</view>
					</view>
					<view class="order-wrap" @click="goOrderList(2)">
						<view class="order-img">
							<image src="/static/user/order-deliver.png" mode=""></image>
						</view>
						<view class="order-text">
							待发货
						</view>
					</view>
					<view class="order-wrap" @click="goOrderList(3)">
						<view class="order-img">
							<image src="/static/user/order-receiving.png" mode=""></image>
						</view>
						<view class="order-text">
							待收货
						</view>
					</view>
					<view class="order-wrap" @click="goOrderList(4)">
						<view class="order-img">
							<image src="/static/user/order-finish.png" mode=""></image>
						</view>
						<view class="order-text">
							已完成
						</view>
					</view>
					<view class="order-wrap" @click="goRefund()">
						<view class="order-img">
							<image src="/static/user/order-refund.png" mode=""></image>
						</view>
						<view class="order-text">
							退款/售后
						</view>
					</view>

				</view>
			</view>
			<view class="receving-address">
				<view class="receving-address-text">
					<view class="receving-address-text-title">
						收货地址
					</view>
					<view class="receving-address-text-content">
						请在地址管理中添加收货地址
					</view>
				</view>
				<view class="receving-address-pic">
					<image src="/static/user/receiving-address.png" mode=""></image>
				</view>

			</view>
			<view class="become-leader">
				<view class="become-leader-pic">
					<image src="/static/user/become-leader.png" mode=""></image>
				</view>
				<view class="become-leader-text">

					<view class="become-leader-text-title">
						成为团长
					</view>
					<view class="become-leader-text-content">
						分享转化获佣金
					</view>
				</view>
			</view>

			<view class="service-tool">
				<view class="service-tool-title">
					服务与工具
				</view>
				<view class="service-tool-content">
					<view class="service-tool-content-wrap">
						<view class="service-tool-content-img">
							<image src="/static/user/coupon.png" mode=""></image>
						</view>
						<view class="service-tool-content-text">
							优惠券
						</view>
					</view>
					<view class="service-tool-content-wrap" @tap="goCardPackage">
						<view class="service-tool-content-img">
							<image src="/static/user/bag.png" mode=""></image>
						</view>
						<view class="service-tool-content-text">
							卡包
						</view>
					</view>
					<view class="service-tool-content-wrap">
						<view class="service-tool-content-img">
							<image src="/static/user/system.png" mode=""></image>
						</view>
						<view class="service-tool-content-text">
							系统设置
						</view>
					</view>
					<view class="service-tool-content-wrap">
						<view class="service-tool-content-img">
							<image src="/static/user/address-manage.png" mode=""></image>
						</view>
						<view class="service-tool-content-text">
							地址管理
						</view>
					</view>

				</view>

			</view>

		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {

		}
	},
	methods: {
		goRefund() {
			uni.navigateTo({
				url: '/pages/package-refund/pages/apply-refund/apply-refund'
			})
		},
		goOrderList(orderId) {
			uni.navigateTo({
				url: '/pages/package-user/pages/order-list/order-list?id=' + orderId
			})
		},
		// 跳转我的卡包
		goCardPackage() {
			uni.navigateTo({
				url: '/pages/package-user/pages/card-package/card-package'
			})
		},
		// login(){
		//     console.log('登录')
		// 	uni.showModal({
		// 		title: '登录获取权限提醒',
		// 		content: '是否同意获取权限'
		// 		success: function (res) {
		// 			if (res.confirm) {
		// 				uni.getUserProfile({
		// 					success:(userinfo)=>{
		// 						uni.login({
		// 						  provider: 'weixin', //使用微信登录
		// 						  success: function (loginRes) {
		// 						    console.log(loginRes.authResult);
		// 							uni.request({
		// 							    url: 'https://www.example.com/request', //仅为示例，并非真实接口地址。
		// 							    data: {
		// 									appid:'wx2ce1b5f7423287cb',
		// 							        text: 'uni.request'
		// 							    },
		// 							    header: {
		// 							        'content-type': 'application/json'//自定义请求头信息
		// 							    },
		// 							    success: (res) => {
		// 							        console.log(res.data);
		// 							        this.text = 'request success';
		// 							    }
		// 							});
		// 						  }
		// 						});

		// 					}
		// 				})
		// 				console.log('用户点击确定');
		// 			} else if (res.cancel) {
		// 				uni.showToast({
		// 					title:'获取失败',
		// 					icon:'none'
		// 				})
		// 				console.log('用户点击取消');
		// 			}
		// 		}
		// 	});

		// }

	}
}
</script>

<style lang="less" scoped>
.main {
	overflow-y: auto;
	background: #f2f2f2;
	// z-index: 2;
	height: 100vh;
	overflow: auto;
	position: relative;
}

.background {
	position: fixed;
	left: 0rpx;
	top: 0rpx;
	width: 100vw;
	height: 574rpx;
	z-index: 3;
	background: linear-gradient(180deg, #025BFF 0%, rgba(216, 216, 216, 0) 89%);
}

.user {
	position: fixed;
	box-sizing: border-box;
	overflow-x: hidden;
	padding: 0 20rpx;
	width: 100vw;
	z-index: 5;

	.user-login {
		box-sizing: border-box;
		padding: 36rpx 32rpx;
		height: 178rpx;
		display: flex;
		justify-content: flex-start;

		.user-img {
			width: 108rpx;
			height: 108rpx;
			background: #E5E5E5;
			border-radius: 54rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.user-info {
			margin-left: 22rpx;
			color: #fff;

			.user-name {
				font-size: 34rpx;
			}

			.user-name-type {
				font-size: 24rpx;
			}
		}
	}

	.order {
		width: 710rpx;
		height: 320rpx;
		border-radius: 12rpx;
		background: #fff;
		box-sizing: border-box;
		padding: 32rpx 37rpx;

		.order-title {
			display: flex;
			justify-content: space-between;

			.order-title-left {
				width: 144rpx;
				line-height: 48rpx;
				font-size: 34rpx;
				color: #101010;
			}

			.order-title-right {
				width: 144rpx;
				line-height: 48rpx;
				font-size: 20rpx;
				color: #979797;
			}
		}

		.order-content {
			margin-top: 44rpx;
			display: flex;
			justify-content: space-between;

			.order-wrap {
				.order-img {
					width: 78rpx;
					height: 78rpx;
					display: flex;
					justify-content: center;
					align-items: center;

					image {
						text-align: center;
						width: 100%;
						height: 100%;
					}
				}

				.order-text {
					text-align: center;
					font-size: 24rpx;
					line-height: 48rpx;
					margin-top: 28rpx;
				}
			}

		}
	}

	.receving-address {
		margin-top: 20rpx;
		width: 710rpx;
		height: 222rpx;
		border-radius: 12rpx;
		background: #FFFFFF;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.receving-address-text {
			box-sizing: border-box;
			padding-left: 28rpx;

			.receving-address-text-title {
				font-size: 34rpx;
				color: #101010;
			}

			.receving-address-text-content {
				font-size: 24rpx;
				color: #3D3D3D;
			}
		}

		.receving-address-pic {
			width: 276rpx;
			height: 276rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.become-leader {
		margin-top: 20rpx;
		width: 710rpx;
		height: 250rpx;
		background: #FFFFFF;
		border-radius: 12rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.become-leader-text {
			box-sizing: border-box;
			padding-right: 98rpx;

			.become-leader-text-title {
				font-size: 34rpx;
				color: #101010;
			}

			.become-leader-text-content {
				font-size: 24rpx;
				color: #3D3D3D;
			}
		}

		.become-leader-pic {
			padding-left: 28rpx;
			box-sizing: border-box;
			width: 328rpx;
			height: 284rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.service-tool {
		margin-top: 20rpx;
		width: 710rpx;
		height: 232rpx;
		border-radius: 12rpx;
		background: #FFFFFF;
		box-sizing: border-box;
		padding: 18rpx 19rpx;

		.service-tool-title {
			font-size: 34rpx;
		}

		.service-tool-content {
			margin-top: 14rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 20rpx;
			box-sizing: border-box;

			.service-tool-content-wrap {
				display: flex;
				flex-direction: column;
				justify-content: center;
			}

			.service-tool-content-img {
				width: 78rpx;
				height: 78rpx;
				display: flex;
				justify-content: center;
				align-items: center;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.service-tool-content-text {
				text-align: center;
				font-size: 24rpx;
				line-height: 48rpx;
			}

		}

	}
}
</style>
