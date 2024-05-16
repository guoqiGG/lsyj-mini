<template>
	<view class="main">
		<!-- #ifndef H5-->
		<navigationBar v-if="navigationBarIsShow" bg-color="bg-gradual-pink" :show-back="false"
			:navigation-bar-style="tabConfig" :is-left="false" :is-bg-img="isBgImg" :title="title" />
		<!-- #endif -->
		<view :class="['news-swiper']">
			<view class="news-swiper-con">
				<view class="message-play">
					<image src="/static/horn.png" class="hornpng" />
					<view class="scroll-news-content" :style="'transform: translateX(' + move + 'px);'">
						<view class="news-content">
							<view class="news-text">走进氢春态，省钱成常态！进入直播间，福利不间断！</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<swiper class="swiper" circular="true" :indicator-dots="true" :autoplay="true" :interval="3000"
			:duration="1000">
			<block v-for="item in indexImgs" :key="item.id">
				<swiper-item class="banner-item">
					<view class="img-box">
						<img v-if="item.type == 0" :src="item.url" alt="" />
						<video v-else :src="item.url" :controls="false" autoplay loop muted :object-fit="fill"></video>
					</view>
				</swiper-item>
			</block>
		</swiper>
		<view class="middle">
			<view class="convert" @click="goConvert()">
				<image class="bg-convert-2" src="/static/bg-convert-2.png" />
				<image class="bg-convert-3" src="/static/bg-convert-3.png" />
				<view class="convert-title">
					青春豆兑换区
				</view>
				<view class="convert-sub">
					福利多多
				</view>
				<view class="convert-go-pic">
					<view class="convert-go">
						GO>
					</view>
				</view>
			</view>
			<view class="singIn" @tap="goMemberCenter">
				<image class="bg-singIn-2" src="/static/bg-singIn-2.png" />
				<image class="bg-singIn-3" src="/static/bg-singIn-3.png" />
				<view class="singIn-title">
					签到
				</view>
				<view class="singIn-sub">
					签到有礼
				</view>
				<view class="singIn-go-pic">
					<view class="singIn-go">
						GO>
					</view>
				</view>
			</view>
		</view>
		<view class="sponsored-ad">
			<!-- <view class="sponsored-ad-title" @tap="toLiveAddress">
				广告
			</view> -->
			<view class="sponsored-ad-content-box">
				<view class="sponsored-ad-content">
					<image :src="liveImg" style="width: 100%; height:100%;border-radius: 20rpx;" alt="" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import navigationBar from '@/components/navigation-bar/index.vue'
import { mpAppName } from '@/utils/config';
const util = require("@/utils/util.js");
const http = require("@/utils/http.js");
export default {
	components: {
		navigationBar
	},
	onLoad: function (options) {
		// 团长绑定用户
		if (options.scene) {
			if (uni.getStorageSync('bbcToken')) {
				if (decodeURIComponent(options.scene).includes('*')) { // 团长扫用户
					let userId = options.scene.split('*')[0]
					let giftId = options.scene.split('*')[1]
					http.request({
						url: '/pub/user/leader/binding',
						methods: 'POST',
						data: {
							sign: 'qcsd',
							data: JSON.stringify({
								userId: userId,
								giftRuleUserId: giftId,
								loginToken: uni.getStorageSync('bbcToken')
							})
						},
						callBack: (res) => {
							if (res.loginToken) {
								uni.setStorageSync('bbcToken', res.loginToken)
							}
							uni.showToast({
								title: '核销成功',
								icon: 'none',
							})
						}
					})
				} else { // 用户扫团长
					http.request({
						url: '/pub/leader/binding',
						methods: 'POST',
						data: {
							sign: 'qcsd',
							data: JSON.stringify({
								loginToken: uni.getStorageSync('bbcToken'),
								parentId: options.scene
							})
						},
						callBack: (res) => {
							if (res.loginToken) {
								uni.setStorageSync('bbcToken', res.loginToken)
								uni.setStorageSync('bbcUserInfo', res)
							}
							uni.showToast({
								title: '绑定成功',
								icon: 'none',
							})
						}
					})
				}
			} else {
				util.checkAuthInfo(() => {
				})
			}
		}
		this.getCarousel()
		this.getLiveImg()
	},
	onShareAppMessage: function () {
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		})
		return {
			path: "pages/user/user" + (uni.getStorageSync('bbcUserInfo') ? "?puid=" + (uni.getStorageSync('bbcUserInfo').puid ? uni.getStorageSync('bbcUserInfo').puid : uni.getStorageSync('bbcUserInfo').id) : ''),
			title: mpAppName,
			imageUrl: '/static/logo_11.png',
			success: function (res) {
				// 转发成功
			},
			fail: function (res) {
				// 转发失败
			}
		};
	},
	//用户点击右上角分享朋友圈
	onShareTimeline: function () {
		return {
			title: '氢春时代',
			imageUrl: '/static/logo_11.png'
		}
	},
	data() {
		return {
			navigationBarIsShow: true,
			title: '氢春时代',
			tabConfig: {
				background: '',
				fontColor: '#FFFFFF',
				iconColor: '#FFFFFF'
			},
			isBgImg: false,
			indexImgs: [],
			liveImg: null,
		}
	},
	methods: {
		// 跳转到青春豆兑换专区
		goConvert() {
			util.checkAuthInfo(() => {
				uni.navigateTo({
					url: '/pages/package-member-integral/pages/integral-index/integral-index'
				})
			})
		},
		// 跳转到会员中心
		goMemberCenter() {
			util.checkAuthInfo(() => {
				uni.navigateTo({
					url: '/pages/package-member-integral/pages/member-center/member-center'
				})
			})
		},
		// 获取首页轮播列表
		getCarousel() {
			var that = this
			const params = {
				url: '/swiper/user/list',
				method: 'GET',
				callBack: function (res) {
					that.setData({
						indexImgs: res
					})
				}
			}
			http.request(params)
		},
		// 获取首页直播图片
		getLiveImg() {
			const params = {
				url: '/admin/get/setting?name=HOME_PAGE_IMAGE&pageNo=1&pageSize=10',
				method: "GET",
				callBack: (res) => {
					this.liveImg = res.list[0].value
				},
			};
			http.request(params);
		},
	},
}
</script>

<style lang="less" scoped>
.main {
	background-color: #e6e6e6;
	min-height: 100vh;
	background: linear-gradient(180deg, #025BFF 0%, rgba(2, 91, 255, 0) 40%);
}



.news-swiper {
	margin-top: 10rpx;
}

.news-swiper-con {}

// /* 消息播放 */
.message-play {
	position: relative;
	height: 64rpx;
	background: #fff;
	margin: 0 20rpx;
	box-sizing: border-box;
	border-radius: rpx;
	padding: 0rpx 0 0rpx 120rpx;
	border-radius: 40rpx;
}

.message-play .hornpng {
	width: 202rpx;
	height: 202rpx;
	position: absolute;
	left: -46rpx;
	top: -80rpx;
	margin-right: 8rpx;
	z-index: 998;
	transform: rotate(12.78deg);
}

.news-text {
	color: #BC0906;
	font-size: 30rpx;
}

.scroll-news-content {
	width: 100%;
	overflow: hidden;
	white-space: nowrap;
	height: 64rpx;
	line-height: 64rpx;
	font-size: 30rpx;
	color: #232323;
}

.scroll-news-content .news-content {
	animation: loop 8s linear infinite;
}

@keyframes loop {
	0% {
		transform: translateX(100%);
		-webkit-transform: translateX(100%);
	}

	100% {
		transform: translateX(calc(-120% + 90rpx));
		-webkit-transform: translateX(calc(-120% + 90rpx));
	}
}

// /* 消息播放end */

swiper {
	width: calc(100% - 40rpx);
	height: 320rpx;
	margin: 0 20rpx;
	margin-top: 20rpx;
	border-radius: 8rpx;
	overflow: hidden;
}

swiper .banner-item {
	width: 100%;
	height: 320rpx;
}

swiper .banner-item .img-box {
	width: 100%;
	height: 320rpx;
}

swiper .banner-item .img-box img {
	width: 100%;
	height: 320rpx;
}

swiper .banner-item .img-box video {
	width: 100%;
	height: 100%;
}

.middle {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 20rpx;
	padding: 0 20rpx;

	.convert {
		width: 346rpx;
		height: 294rpx;
		background: linear-gradient(90deg, #3874e4 0%, #BA55FF 100%);
		border-radius: 20rpx;
		box-sizing: border-box;
		padding: 14rpx 22rpx;
		position: relative;
		overflow: hidden;

		.bg-convert-2 {
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
		}

		.bg-convert-3 {
			position: absolute;
			width: 130%;
			height: 130%;
			top: -45rpx;
			left: -55rpx;
		}

		.convert-title {
			font-weight: 400;
			font-size: 40rpx;
			color: #FFFFFF;
			line-height: 48rpx;
			letter-spacing: 1px;
		}

		.convert-title {
			font-size: 36rpx;
			color: #FFFFFF;
		}

		.convert-sub {
			font-weight: 400;
			font-size: 22rpx;
			color: #FFFFFF;
			line-height: 48rpx;
		}

		.convert-go-pic {
			display: flex;
			justify-content: space-between;
			height: 196rpx;

			.convert-go {
				margin-top: 94rpx;
				width: 112rpx;
				height: 62rpx;
				background: #fff;
				border-radius: 30rpx;
				line-height: 62rpx;
				text-align: center;
				font-weight: 400;
				font-size: 40rpx;
				color: #6E2EED;
				line-height: 62rpx;
			}

			.convert-pic {
				box-sizing: border-box;
				height: 196rpx;
			}
		}
	}

	.singIn {
		width: 346rpx;
		height: 294rpx;
		box-sizing: border-box;
		padding: 14rpx 22rpx;
		position: relative;
		background: linear-gradient(90deg, #e7324d 0%, #e2ae70 100%);
		border-radius: 20rpx;
		overflow: hidden;

		.bg-singIn-2 {
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
		}

		.bg-singIn-3 {
			position: absolute;
			width: 130%;
			height: 130%;
			top: -45rpx;
			left: -55rpx;
		}

		.singIn-title {
			font-weight: 400;
			font-size: 40rpx;
			color: #FFFFFF;
			line-height: 48rpx;
			letter-spacing: 1px;
			font-style: normal;
			text-transform: none;
		}

		.singIn-sub {
			font-weight: 400;
			font-size: 22rpx;
			color: #FFFFFF;
			line-height: 48rpx;
		}

		.singIn-go-pic {
			display: flex;
			justify-content: space-between;
			height: 196rpx;

			.singIn-go {
				margin-top: 94rpx;
				width: 112rpx;
				height: 62rpx;
				background: #fff;
				border-radius: 30rpx;
				line-height: 62rpx;
				text-align: center;
				font-weight: 400;
				font-size: 40rpx;
				color: #F32843;
			}
		}
	}

}

.sponsored-ad {
	width: 710rpx;
	margin: 0 20rpx;
	margin-top: 20rpx;
	padding-top: 20rpx;
	padding-bottom: 30rpx;

	.sponsored-ad-title {
		margin: 0 20rpx 20rpx;
		height: 48rpx;
		box-sizing: border-box;
		font-weight: 400;
		font-size: 34rpx;
		color: #101010;
		line-height: 48rpx;
		letter-spacing: 1px;
		border-left: 6rpx solid #518BFC;
		padding-left: 10rpx;
	}

	.sponsored-ad-content-box {
		box-sizing: border-box;
		padding: 30rpx 24rpx;
		width: 100%;
		border-radius: 20rpx;
		background: #9DBEFF;
	}

	.sponsored-ad-content {
		width: 100%;
		height: 296rpx;
		border-radius: 20rpx;
		//background: #D8D8D8;
	}
}
</style>