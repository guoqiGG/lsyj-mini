<template>
	<view class="main">
		<view class="background"></view>
		<view class="user">
			<view class="user-login" v-if="isAuthInfo">
				<image class="user-img" :src="userInfo.avatar
				? userInfo.avatar : '/static/head04.png'
				" mode="scaleToFill" />
				<view class="user-info">
					<view class="user-name">
						<view>
							{{ userInfo.name }}
						</view>
						<view class="info-edit" @tap="editInfo">
							<image src="/static/info-edit.png" mode="scaleToFill" />
						</view>
					</view>
					<view class="user-name-type">
						{{ userInfo.type === 0 ? '普通' : userInfo.type === 1 ? '团长' : '' }}
					</view>
				</view>
			</view>
			<view class="user-login" v-if="!isAuthInfo">
				<view class="user-img" @tap="toLogin">
					<image src="/static/user/head-pic.png"></image>
				</view>
				<view class="user-info"><text class="login-text" @tap="toLogin">立即登录</text></view>
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
				<view class="receving-address-text" v-if="!isAuthInfo">
					<view class="receving-address-text-title">
						收货地址
					</view>
					<view class="receving-address-text-content" style="margin-top: 10rpx;">
						请在地址管理中添加收货地址
					</view>
				</view>
				<view class="receving-address-text" v-if="isAuthInfo">
					<view class="receving-address-text-title">
						{{ userInfo.leaderAddress ? '自提地址' : '收货地址' }}
					</view>
					<view class="receving-address-text-content"
						style="font-weight: 400;font-size: 28rpx;color: #101010;line-height: 48rpx;"
						v-if="userInfo.leaderAddress">{{ userInfo.leaderStore }}
					</view>
					<view class="receving-address-text-content" style="margin-top: 10rpx;">
						{{ userInfo.leaderAddress
				? userInfo.leaderAddress : userInfo.userAddress ? userInfo.userAddress : '请在地址管理中添加收货地址' }}
					</view>
					<view class="receving-address-text-content" v-if="userInfo.leaderAddress"><text
							style="font-weight: 400;font-size: 28rpx;color: #101010;line-height: 48rpx;">
							{{ userInfo.leaderName }}：</text>{{ userInfo.leaderMobile }}</view>
				</view>
				<view class="receving-address-pic">
					<image src="/static/user/receiving-address.png" mode=""></image>
				</view>
			</view>
			<view class="become-leader" @click="goLeader()">
				<view class="become-leader-pic">
					<image src="/static/user/become-leader.png" mode=""></image>
				</view>
				<view class="become-leader-text">

					<view class="become-leader-text-title">
						{{ (isLeader && isAuthInfo) ? '团长管理' : '成为团长' }}
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
					<view class="service-tool-content-wrap" @tap="goCoupon">
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
					<view class="service-tool-content-wrap" @tap="toSystemSetUp">
						<view class="service-tool-content-img">
							<image src="/static/user/system.png" mode=""></image>
						</view>
						<view class="service-tool-content-text">
							系统设置
						</view>
					</view>
					<view class="service-tool-content-wrap" @tap="toAddressList">
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
		<hCompress ref="hCompress" />
	</view>
</template>

<script>
const http = require("@/utils/http.js");
const util = require("@/utils/util");
import hCompress from "@/components/helang-compress/helang-compress";

export default {
	data() {
		return {
			isLeader: true,  // 是否是团长
			userInfo: {}, // 用户信息
			isAuthInfo: false, //用户是否登录	
		}
	},
	components: {
		hCompress,
	},

	onShow: function () {
		// 用户信息
		this.userInfo = uni.getStorageSync("bbcUserInfo"); //用户信息
		this.userInfo.type === 0 ? this.isLeader = false : this.userInfo.type === 1 ? this.isLeader = true : ''
		if (uni.getStorageSync("bbcToken")) {
			this.isAuthInfo = true;
			this.getDefaultAddress()
		} else {
			this.isAuthInfo = false;
		}
	},
	methods: {
		// 跳转申请退款
		goRefund() {
			uni.navigateTo({
				url: '/pages/package-refund/pages/apply-refund/apply-refund'
			})
		},
		// 跳转订单列表
		goOrderList(orderId) {
			uni.navigateTo({
				url: '/pages/package-user/pages/order-list/order-list?id=' + orderId
			})
		},
		// 跳转我的卡包
		goCardPackage() {
			util.checkAuthInfo(() => {
				uni.navigateTo({
					url: '/pages/package-user/pages/card-package/card-package'
				})
			})
		},
		// 跳转我的优惠券
		goCoupon() {
			util.checkAuthInfo(() => {
				uni.navigateTo({
					url: '/pages/package-user/pages/coupon/coupon'
				})
			})
		},
		// 跳转系统设置
		toSystemSetUp() {
			uni.navigateTo({
				url: '/pages/package-user/pages/account-settings/account-settings'
			})
		},
		goLeader() {
			util.checkAuthInfo(() => {
				if (this.isLeader) {
					uni.navigateTo({
						url: '/pages/package-leader/pages/leader-index/leader-index'
					})
				} else {
					uni.navigateTo({
						url: '/pages/package-leader/pages/apply-leader/apply-leader'
					})
				}
			})
		},
		// 跳转到我的地址列表
		toAddressList() {
			util.checkAuthInfo(() => {
				uni.navigateTo({
					url: '/pages/package-user/pages/delivery-address/delivery-address'
				})
			})
		},
		toLogin() {
			uni.navigateTo({
				url: '/pages/user-login/user-login'
			})
		},
		/**
			 * 头像
			 */
		getUploadImg: function (e) {
			var tempFilePaths = e.detail.avatarUrl;
			const params = {
				url: "/upload/oss",
				filePath: tempFilePaths,
				name: "file",
				callBack: (res2) => {
					this.userInfo.avatar = res2
					this.setUserInfo()
				},
			};
			const obj = {
				src: tempFilePaths,
				quality: 0.2,
			};
			this.$refs.hCompress.compress(obj, e.detail.avatarUrl).then((res) => {
				params.filePath = res;
				http.upload(params);
			});
		},
		// 用户昵称
		getNickNameInt: function (e) {
			this.userInfo.name = e.detail.value;
			this.setUserInfo()
		},
		// 修改用户信息
		setUserInfo() {
			let obj = {
				userId: this.userInfo.id,
				avatar: this.userInfo.avatar,
				name: this.userInfo.name,
			}
			const params = {
				url: "/pub/user/update",
				method: "POST",
				data: {
					sign: 'qcsd',
					data: JSON.stringify(obj),
				},
				callBack: (res) => {
					uni.setStorageSync("bbcUserInfo", res); //用户信息
					this.userInfo = res
					uni.showToast({
						title: "修改成功",
						icon: "none",
					});
				},
			};
			http.request(params);
		},
		// 用户默认地址
		getDefaultAddress() {
			const params = {
				url: "/pub/user/address?loginToken=" + this.userInfo.loginToken,
				method: "GET",
				callBack: (res) => {
					this.userInfo.userAddress = res.userAddress
				},
			};
			http.request(params);
		},

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
		align-items: center;

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
			margin-left: 20rpx;
			color: #fff;

			.user-name {
				font-weight: 400;
				font-size: 34rpx;
				color: #FFFFFF;
				line-height: 48rpx;
				text-align: left;
				font-style: normal;
				text-transform: none;
				display: flex;
				flex-direction: row;
			}

			.info-edit {
				margin-left: 15rpx;
				width: 52rpx;
				height: 52rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.info-edit image {}

			.user-name-type {
				font-weight: 400;
				font-size: 24rpx;
				color: #FFFFFF;
				line-height: 48rpx;
				text-align: left;
				font-style: normal;
				text-transform: none;
			}

			.login-text {
				font-weight: 400;
				font-size: 34rpx;
				color: #FFFFFF;
				line-height: 48rpx;
				text-align: left;
				font-style: normal;
				text-transform: none;
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
