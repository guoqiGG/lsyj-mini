<template>
	<view class="con">
		<view class="logo">
			<view class="left-bg">
				<image src="/static/rectangle.png" mode="widthFix" />
			</view>
			<view class="right-bg">
				<image src="/static/cube.png" mode="widthFix" />
			</view>
			<image class="logo-img" src="/static/logo.png" mode="heightFix" @tap="toIndex" />
		</view>
		<!-- 微信登录 -->
		<view class="login-form">
			<!-- 按钮 -->
			<view>
				<button v-if="!isPrivacy" class="authorized-btn" @tap="maskBtn">
					手机号快捷登录
				</button>
				<button v-else open-type="getPhoneNumber" class="authorized-btn" @getphonenumber="getPhoneNumberLogin">
					手机号快捷登录
				</button>
			</view>
			<!-- 服务条款 -->
			<view class="item statement">
				<label class="statement-label" @tap.stop="handlePrivacyClick">
					<checkbox class="check-box" :checked="isPrivacy === 1" />
					<view style="color: #979797">
						我已阅读并同意氢春时代
						<text @tap.stop="toTermsOfService('serviceTerms')">《服务条款》</text>
						<text style="color: #979797">和</text>
						<text @tap.stop="toTermsOfService('servicePolicy')">《隐私协议》</text>
					</view>
				</label>
			</view>
		</view>
		<!-- 授权登录 -->
		<view>
			<u-popup :show="showAuth">
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
							<image :src="avatar ? avatar : '/static/head04.png'" mode="scaleToFill" />
						</button>
					</view>
					<view class="line" style="margin: 0;"></view>
					<view class="name">
						<view class="name-title"><text>昵称</text></view>
						<input class="name-input" type="nickname" placeholder="请输入昵称" :value="name"
							@change="getNickNameInt">
					</view>
					<!-- <view class="line"></view> -->
					<view :class="['button', (name && avatar) ? '' : 'un']" @tap="save"><text>保存</text></view>
				</view>
			</u-popup>
		</view>
		<hCompress ref="hCompress" />
	</view>
</template>

<script>
const http = require("@/utils/http");
const util = require("@/utils/util.js");
import hCompress from "@/components/helang-compress/helang-compress";
import {
	resolve
} from "path";
import {
	rejects
} from "assert";
export default {
	props: {},
	components: {
		hCompress,
	},
	data() {
		return {
			uniLoginLogoImg: "",
			code: "",
			isPrivacy: 0,
			passwordType: true,
			appType: uni.getStorageSync("bbcAppType"),
			privacyNumber: "",
			showAuth: false, // 用户是否首次登录 true 是 false 否
			name: '',
			avatar: ''
		};
	},


	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

		// 头部导航标题
		uni.setNavigationBarTitle({
			title: '用户登录',
		});
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		uni.getSystemInfo({
			success: (res) => {
				// 根据屏幕高度设置 top 值
				this.regLocation = res.windowHeight - 150 + "px";
			},
		});
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		// 头部导航标题
		uni.setNavigationBarTitle({
			title: '用户登录'
		});

		if (getApp().globalData.isLanding) return;
		// 改变全局中登录
		const globalData = getApp().globalData;
		globalData.isLanding = true;
		wx.login({
			success: (res) => {
				// 用code 请求登录
				this.loginByCode(res.code);
			},
		});
	},
	methods: {
		/**
		 * 通过微信返回的code登录
		 * @param {String} code 请求微信返回的 code
		 */
		loginByCode(code) {
			const params = {
				url: "/pub/user/login/auth",
				method: "POST",
				data: JSON.stringify({
					code: code,
					loginType: 1
				}),
				callBack: (res) => {
					if (!res.id) {
						uni.setStorageSync("bbcTempUid", res);
						// 还原全局 正在登录状态
						getApp().globalData.isLanding = false;
						while (getApp().globalData.requestQueue.length) {
							http.request(getApp().globalData.requestQueue.pop());
							getApp().globalData.currentReqCounts--;
						}
						if (uni.getStorageSync('noAuth')) {
							this.showAuth = true
						} else {
							this.showAuth = false
						}
					} else {
						uni.setStorageSync("bbcTempUid", res.openId);
						if (res.loginToken) {
							uni.setStorageSync("bbcIsPrivacy", 1);
							uni.setStorageSync("bbcHadLogin", true);
							uni.setStorageSync("bbcToken", res.loginToken);
							uni.setStorageSync("bbcLoginResult", res); // 保存整个登录数据
							uni.setStorageSync("bbcUserInfo", res); //用户信息
							uni.setStorageSync('noAuth', false) // 用户是否首次授权
							const expiresTimeStamp =
								(res.expiresIn * 1000) / 2 + new Date().getTime();
							// 缓存token的过期时间
							uni.setStorageSync("bbcExpiresTimeStamp", expiresTimeStamp);
							// 还原全局 正在登录状态
							getApp().globalData.isLanding = false;
							while (getApp().globalData.requestQueue.length) {
								http.request(getApp().globalData.requestQueue.pop());
							}
							// 返回未登录前点击的页面
							util.previousPage()
						}
					}
				},
				errCallBack: () => {
					// 还原全局 正在登录状态
					getApp().globalData.isLanding = false;
					while (getApp().globalData.requestQueue.length) {
						http.request(getApp().globalData.requestQueue.pop());
						getApp().globalData.currentReqCounts--;
					}
					uni.removeStorageSync("bbcLoginResult");
					uni.removeStorageSync("bbcToken");
					uni.removeStorageSync("bbcHadBindUser");
					uni.removeStorageSync("bbcCode");
					uni.removeStorageSync("bbcUserInfo");
					uni.removeStorageSync("bbcExpiresTimeStamp");
					uni.removeStorageSync("noAuth");
				},
			};
			http.request(params);
		},
		/**
		 * 蒙版按钮
		 */
		maskBtn() {
			uni.showToast({
				title: '请先阅读并勾选协议',
				icon: "none",
			});
		},

		/**
		 * 微信小程序获取手机号一键登录按钮
		 */
		getPhoneNumberLogin(e) {
			// 拒绝了授权
			if (!e.detail.code) {
				return;
			}
			const params = {
				url: "/pub/user/login/auth",
				method: "POST",
				data: JSON.stringify({
					code: e.detail.code,
					loginType: 2,
					openid: uni.getStorageSync('bbcTempUid'),
					name: this.name,
					avatar: this.avatar
				}),
				callBack: (res) => {
					if (res.loginToken) {
						uni.setStorageSync("bbcIsPrivacy", 1);
						uni.setStorageSync("bbcHadLogin", true);
						uni.setStorageSync("bbcToken", res.loginToken);
						uni.setStorageSync("bbcLoginResult", res); // 保存整个登录数据
						uni.setStorageSync("bbcUserInfo", res); //用户信息
						uni.setStorageSync('noAuth', false) // 用户是否首次授权
						const expiresTimeStamp =
							(res.expiresIn * 1000) / 2 + new Date().getTime();
						// 缓存token的过期时间
						uni.setStorageSync("bbcExpiresTimeStamp", expiresTimeStamp);
						// 还原全局 正在登录状态
						getApp().globalData.isLanding = false;
						while (getApp().globalData.requestQueue.length) {
							http.request(getApp().globalData.requestQueue.pop());
						}
						// 返回未登录前点击的页面
						util.previousPage()
					}
				},
				errCallBack: (err) => {
					console.log(err)
					this.loginErrHandle(err);
				},
			};
			http.request(params);
		},


		/**
		 * 条款点击事件(勾选/取选)
		 */
		handlePrivacyClick() {
			this.isPrivacy = this.isPrivacy === 1 ? 0 : 1;
		},

		/**
		 * 登录异常
		 */
		loginErrHandle(err) {
			if (
				err.code === 500
			) {
				uni.showToast({
					title: err.msg || "Error",
					icon: "none",
				});
			}


		},

		/**
		 * 回到首页
		 */
		toIndex() {
			util.toHomePage();
		},
		/**
		 * 去服务条款和隐私协议页面
		 */
		toTermsOfService(key) {
			uni.navigateTo({
				url: "/pages/package-user/pages/terms-page/terms-page?sts=" + key,
			});
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
					this.avatar = res2
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
			this.name = e.detail.value;
		},
		save() {
			if (this.name.trim() && this.avatar) {
				this.showAuth = false
			}
		}
	},
};
</script>
<style>
@import "./user-login.css";
</style>