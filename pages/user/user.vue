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
						<view class="info-edit" @tap="openShowAuthPopup">
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
					<view class="order-wrap" @click="goOrderList(5)">
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
		<!-- 授权登录 -->
		<view>
			<u-popup :show="showAuth" closeable="true" @close="closeShowAuthPopup">
				<view class="con-container">
					<view class="title"><text>氢春时代 申请</text></view>
					<view class="desc">
						<view class="desc-big"><text>获取您的昵称、头像</text></view>
						<view class="desc-small"><text>提供具有辨识度的用户中心界面</text></view>
					</view>
					<!-- <view class="line"></view> -->
					<view class="avatar" style="margin-top: 20rpx;">
						<view class="avatar-title"><text>头像</text></view>
						<button class="avatar-img" style="background-color: transparent; margin: 0; padding: 0"
							open-type="chooseAvatar" @chooseavatar="getUploadImg">
							<image :src="userInfo.avatar ? userInfo.avatar : '/static/head04.png'" mode="scaleToFill" />
						</button>
					</view>
					<view class="line" style="margin: 0;"></view>
					<view class="name">
						<view class="name-title"><text>昵称</text></view>
						<input class="name-input" type="nickname" placeholder="请输入昵称" :value="userInfo.name"
							@change="getNickNameInt">
					</view>
					<!-- <view class="line"></view> -->
					<view class="button" @tap="save"><text>保存</text></view>
				</view>
			</u-popup>
		</view>
	</view>
</template>

<script>
const http = require("@/utils/http.js");
const util = require("@/utils/util");
import hCompress from "@/components/helang-compress/helang-compress";

export default {
	data() {
		return {
			isLeader: true, // 是否是团长
			userInfo: {}, // 用户信息
			isAuthInfo: false, //用户是否登录
			showAuth: false // 显示授权用户信息
		}
	},
	components: {
		hCompress,
	},

	onShow: function () {

		if (uni.getStorageSync("bbcToken")) {
			this.isAuthInfo = true;
			this.userInfo = uni.getStorageSync('bbcUserInfo')
			this.getUserInfo()
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
			util.checkAuthInfo(() => {
				uni.navigateTo({
					url: '/pages/package-user/pages/order-list/order-list?id=' + orderId
				})
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
			util.checkAuthInfo(() => {
				uni.navigateTo({
					url: '/pages/package-user/pages/account-settings/account-settings'
				})
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
		},
		// 修改用户信息
		save() {
			let obj = {
				userId: this.userInfo.id,
				avatar: this.userInfo.avatar,
				name: this.userInfo.name,
				loginToken: uni.getStorageSync('bbcToken')
			}
			const params = {
				url: "/pub/user/update",
				method: "POST",
				data: {
					sign: 'qcsd',
					data: JSON.stringify(obj),
				},
				callBack: (res) => {
					if (res.loginToken) {
						uni.setStorageSync('bbcToken', res.loginToken)
					}
					this.getUserInfo()
					this.showAuth = false
				},
				errCallBack: (res) => {
					this.showAuth = false
				}
			};
			http.request(params);
		},
		// 用户默认地址
		getDefaultAddress() {
			const params = {
				url: "/pub/user/infById?userId=" + uni.getStorageSync('bbcUserInfo').id,
				method: "GET",
				callBack: (res) => {
					this.userInfo.userAddress = res.userAddress
				},
			};
			http.request(params);
		},
		// 打开授权弹出层
		openShowAuthPopup() {
			this.showAuth = true
		},
		// 关闭授权弹出层
		closeShowAuthPopup() {
			this.showAuth = false
		},

		// 获取用户信息
		getUserInfo() {
			const params = {
				url: "/pub/user/infoByToken?loginToken=" + uni.getStorageSync('bbcToken'),
				method: "GET",
				callBack: (res) => {
					uni.setStorageSync('bbcUserInfo', res)
					this.userInfo = res
					this.userInfo.type === 0 ? this.isLeader = false : this.userInfo.type === 1 ? this
						.isLeader = true : ''
				},
			};
			http.request(params);
		}
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
				font-size: 28rpx;
				color: #979797;
			}
		}

		.order-content {
			margin-top: 44rpx;
			display: flex;
			justify-content: space-between;

			.order-wrap {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: center;

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
					font-size: 30rpx;
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
				font-size: 38rpx;
				color: #101010;
			}

			.receving-address-text-content {
				font-size: 28rpx;
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
				font-size: 38rpx;
				color: #101010;
			}

			.become-leader-text-content {
				font-size: 30rpx;
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
			font-size: 38rpx;
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
				align-items: center;
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
				font-size: 28rpx;
				line-height: 48rpx;
			}

		}

	}
}

.con-container {
	// padding: 50rpx 46rpx 70rpx;
	padding: 50rpx 0rpx 70rpx;


}



.con-container .title {
	font-weight: 400;
	font-size: 28rpx;
	color: #101010;
	line-height: 48rpx;
	text-align: left;
	font-style: normal;
	text-transform: none;
	text-align: center;
}

.con-container .desc {
	margin-top: 34rpx;
	padding: 0rpx 46rpx 0rpx;

}

.con-container .desc .desc-big {
	font-weight: 400;
	font-size: 28rpx;
	color: #101010;
	line-height: 48rpx;
	text-align: left;
	font-style: normal;
	text-transform: none;
}

.con-container .desc .desc-small {
	font-weight: 400;
	font-size: 24rpx;
	color: #979797;
	line-height: 48rpx;
	text-align: left;
	font-style: normal;
	text-transform: none;
}

.con-container .button {
	margin: 66rpx auto 0;
	width: 364rpx;
	height: 78rpx;
	background: #025bff;
	border-radius: 12rpx 12rpx 12rpx 12rpx;
	font-weight: 400;
	font-size: 28rpx;
	color: #ffffff;
	line-height: 78rpx;
	text-align: center;
	font-style: normal;
	text-transform: none;
}

.con-container .button.un {
	background: #F6F6F6;
	color: #979797;
}

.con-container .line {
	width: 100%;
	height: 1rpx;
	background: #e6e6e6;
	margin: 22rpx 0 0rpx;
}

.con-container .avatar,
.con-container .name {
	height: 84rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
	background: linear-gradient(270deg, #FFFFFF 0%, #B4CEFF 100%);
	padding: 14rpx 46rpx;
}

.con-container .avatar .avatar-title,
.con-container .name .name-title {
	width: 80rpx;
	font-weight: 400;
	font-size: 28rpx;
	color: #101010;
	line-height: 48rpx;
	text-align: left;
	font-style: normal;
	text-transform: none;
	margin-right: 58rpx;
}

.con-container .avatar .avatar-img {
	width: 100%;
	height: 100%;
	background: #f4f4f4;
	border-radius: 8rpx 8rpx 8rpx 8rpx;
	overflow: hidden;
	display: flex;
	justify-content: flex-start;
	align-items: center;
}

.con-container .avatar .avatar-img image {
	width: 78rpx;
	height: 78rpx;

}



.con-container .name .name-input {
	font-weight: 400;
	font-size: 28rpx;
	color: #979797;
	line-height: 48rpx;
	text-align: left;
	font-style: normal;
	text-transform: none;
}

/deep/.u-icon__icon {
	font-size: 35rpx !important;
}
</style>