<template>
	<view class="container">
		<view class="con">
			<view class="list">
				<view class="left-con">
					<view class="name">03.04 衣服卡①</view>
					<view class="time">发布时间：2024-03-04 13:39</view>
				</view>
				<view class="button" @click="receiveGift">
					立即领取
				</view>
				// wxml文件
				<ad unit-id="adunit-040f4d55ac211624" ad-type="video" ad-theme="white" bindload="adLoad"
					binderror="adError" bindclose="adClose"></ad>
			</view>
		</view>
	</view>
</template>

<script>
	const http = require("@/utils/http");
	export default {
		data() {
			return {};
		},
		onShow: function() {
			uni.setNavigationBarTitle({
				title: '领取礼品卡'
			})
		},

		onLoad: function(options) {},
		// js文件，广告事件监听 Page({ 
		adLoad() {
			console.log('视频广告 广告加载成功')
		},
		adError(err) {
			console.error('视频广告 广告加载失败', err)
		},
		adClose() {
			console.log('视频广告 广告关闭')
		},
		// }) 
		methods: {
			receiveGift() {
				let Token = uni.getStorageSync("bbcToken"); //用户信息
				let userInfo = uni.getStorageSync("bbcUserInfo"); //用户信息
				if (Token) {
					let obj = {
						id: 1,
						userId: userInfo.id,
					}
					const params = {
						url: "/pub/user/receive/gift",
						method: "POST",
						data: {
							sign: 'qcsd',
							data: JSON.stringify(obj),
						},
						callBack: (res) => {
							console.log(res, "领取礼品卡===res")
						},
					}
					http.request(params);
				} else {
					// 缓存当前页面路径
					uni.setStorageSync("routeUrl", "/pages/package-user/pages/exchange-area/exchange-area");
					uni.switchTab({
						url: '/pages/user-login/user-login'
					});

				}
			}

		},
	};
</script>

<style>
	@import "./exchange-area.css";
</style>