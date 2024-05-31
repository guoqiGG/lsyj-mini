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
							<view class="news-text">走进邻舍云集，省钱成常态！进入直播间，福利不间断！</view>
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
			<view class="sponsored-ad-title" @tap="toLiveAddress">
				赞助广告
			</view>
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
			title: '邻舍云集',
			imageUrl: '/static/logo_11.png'
		}
	},
	data() {
		return {
			navigationBarIsShow: true,
			title: '邻舍云集',
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
	min-height: 100vh;
	background: linear-gradient(180deg, #A691F4 0%, #A691F4 20%, #f2f2f2 40%);
}

.news-swiper {
	margin-top: 10rpx;
}

// /* 消息播放 */
.message-play {
	position: relative;
	height: 64rpx;
	background: #fff;
	margin: 0 20rpx;
	box-sizing: border-box;
	border-radius: rpx;
	padding: 0rpx 0 0rpx 120rpx;
	border-radius: 8rpx;
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
	color: #A691F4;
	font-size: 30rpx;
}

.scroll-news-content {
	width: 100%;
	overflow: hidden;
	white-space: nowrap;
	height: 64rpx;
	font-weight: 400;
	font-size: 30rpx;

	line-height: 64rpx;
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
	height: 320rpx;
	margin: 20rpx 20rpx 0;
	border-radius: 20rpx;
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
		border-radius: 25rpx;
		box-sizing: border-box;
		padding: 14rpx 22rpx;
		position: relative;
		overflow: hidden;
		background: linear-gradient(90deg, #3AB0D7  0%, #08D0C3 100%);

		.convert-title {
			position: absolute;
			top: 15rpx;
			left: 30rpx;
			font-weight: 400;
			font-size: 36rpx;
			color: #FFFFFF;
			line-height: 48rpx;
			letter-spacing: 1px;
		}

		.convert-sub {
			position: absolute;
			top: 60rpx;
			left: 30rpx;
			font-weight: 400;
			font-size: 22rpx;
			color: #FFFFFF;
			line-height: 48rpx;
		}

		.convert-go-pic {
			display: flex;
			justify-content: space-between;
			height: 196rpx;
			position: absolute;
			bottom: -20rpx;

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
				color: #3AB0D7;
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
		border-radius: 25rpx;
		overflow: hidden;
		background: linear-gradient(90deg,  #FE8E06 0%, #FFBF2A 100%);

		.singIn-title {
			position: absolute;
			top: 15rpx;
			left: 30rpx;
			font-weight: 400;
			font-size: 36rpx;
			color: #FFFFFF;
			line-height: 48rpx;
			letter-spacing: 1px;
		}

		.singIn-sub {
			position: absolute;
			top: 60rpx;
			left: 30rpx;
			font-weight: 400;
			font-size: 22rpx;
			color: #FFFFFF;
			line-height: 48rpx;
		}

		.singIn-go-pic {
			display: flex;
			justify-content: space-between;
			height: 196rpx;
			position: absolute;
			bottom: -20rpx;

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
				color: #FE8E06;
				line-height: 62rpx;
			}
		}
	}

}

.sponsored-ad {
	width: 710rpx;
	margin: 0 20rpx;
	margin-top: 20rpx;
	padding-top: 20rpx;
	background: linear-gradient(90deg, #045BFF  0%, #86AFFF 100%);
	border-radius: 20rpx 20rpx 20rpx 20rpx;

	.sponsored-ad-title {
		margin: 0 20rpx 20rpx;
		height: 48rpx;
		box-sizing: border-box;
		font-weight: 400;
		font-size: 34rpx;
		color: #FFFFFF;
		line-height: 48rpx;
		letter-spacing: 1px;
		padding-left: 10rpx;
	}

	.sponsored-ad-content-box {
		box-sizing: border-box;
		padding: 42rpx 24rpx;
		width: 100%;
		border-radius: 20rpx;
		background: #FFFFFF;
	}

	.sponsored-ad-content {
		width: 100%;
		height: 296rpx;
		border-radius: 20rpx;
		//background: #D8D8D8;
	}
}
</style>