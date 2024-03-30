<template>
	<view class="main">
		<view class="top">
			<!-- 导航&公告 -->
			<!-- #ifndef H5-->
			<navigationBar v-if="navigationBarIsShow" bg-color="bg-gradual-pink" :show-back="false"
				:navigation-bar-style="tabConfig" :is-left="false" :is-bg-img="isBgImg" :title="title" />
			<!-- #endif -->
			<view :class="['news-swiper']">
				<!-- 消息播放 -->
				<view style="
            display: block;
            padding-top: 26rpx;
            height: 280rpx;
            background: #005aff;
          ">
					<view class="message-play">
						<image src="/static/horn.png" class="hornpng" />
						<view class="scroll-news-content" :style="'transform: translateX(' + move + 'px);'">
							<view class="news-content">
								<view class="news-text">走进氢春态，省钱成常态！进入直播间，福利不间断！</view>
							</view>
						</view>
						<!-- <text class="arrow" /> -->
					</view>
				</view>
				<!-- 消息播放end -->
			</view>
			<!-- 导航&公告end -->
		</view>

		<swiper class="swiper" circular="true" :indicator-dots="true" :autoplay="true" :interval="3000"
			:duration="1000">
			<block v-for="(item, seq) in indexImgs" :key="seq">
				<swiper-item class="banner-item">
					<view class="img-box">
						<img :src="item.imgUrl" alt="" />
					</view>
				</swiper-item>
			</block>
		</swiper>

		<view class="content">
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
						<view class="convert-pic">
							<image src="/static/index-convert.png" alt="" />
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
						<view class="singIn-pic">
							<image src="/static/index-signIn.png" alt="" />
						</view>
					</view>
				</view>
			</view>
			<view class="sponsored-ad">
				<view class="sponsored-ad-title">
					赞助广告
				</view>
				<view class="sponsored-ad-content-box">
					<!-- <view class="sponsored-ad-content"> -->
					<ad unit-id="adunit-a27196394237e84f" bindload="adLoad" binderror="adError" bindclose="adClose">
					</ad>
					<!-- </view> -->
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
		console.log('options.scene', options)
		// 团长绑定用户
		if (options.scene) {
			if (uni.getStorageSync('bbcToken')) {
				console.log(decodeURIComponent(options.scene))
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
	},
	onShareAppMessage: function () {
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		})
		return {
			path: "pages/user/user",
			title: mpAppName,
			imageUrl: '/static/logo.png',
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
			imageUrl: '/static/logo.png'
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
			indexImgs: [{
				imgUrl: 'https://qingchuntai2.oss-cn-beijing.aliyuncs.com/2024/02/20/1.jpg',
				id: 1
			},
			{
				imgUrl: 'https://qingchuntai2.oss-cn-beijing.aliyuncs.com/2024/02/20/2.jpg',
				id: 2
			},
			{
				imgUrl: 'https://qingchuntai2.oss-cn-beijing.aliyuncs.com/2024/02/20/3.jpg',
				id: 3
			},
			{
				imgUrl: 'https://qingchuntai2.oss-cn-beijing.aliyuncs.com/2024/02/20/4.jpg',
				id: 4
			},
			],
		}
	},
	// js文件，广告事件监听 Page({
	adLoad() {
		console.log('Banner 广告加载成功')
	},

	adError(err) {
		console.error('Banner 广告加载失败', err)
	},
	adClose() {
		console.log('Banner 广告关闭')
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
		}
	},
}
</script>

<style lang="less" scoped>
.main {
	background-color: #e6e6e6;
	min-height: 100vh;
}

.content {
	// width: 700rpx;
	padding: 0 20rpx;
	box-sizing: border-box;
	// height: 100vh;
	background: #e6e6e6;
	overflow-x: hidden;
}

.top {
	background: #025BFF;
	width: 100%;
	height: 480rpx;
}

.news-swiper {
	padding: 0 10rpx;
}

// /* 消息播放 */
.message-play {
	position: relative;
	height: 64rpx;
	background: #fff;
	margin: 0 10rpx;
	padding: 0 10rpx 0 55rpx;
	box-sizing: border-box;
	border-radius: 8rpx;
}

.message-play .hornpng {
	width: 140rpx;
	height: 250rpx;
	position: absolute;
	left: -20rpx;
	bottom: -25rpx;
	margin-right: 8rpx;
	z-index: 998;
	transform: rotate(-12deg);
}

.message-play .swiper-cont {
	height: 64rpx;
	line-height: 64rpx;
	margin-top: 0;
	z-index: 999;
}

.message-play .swiper-cont .items {
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	text-align: left;
	font-size: 32rpx;
}

.news-text {
	color: #BC0906;
	font-size: 30rpx;
}

.arrow {
	width: 15rpx;
	height: 15rpx;
	border-top: 3rpx solid #686868;
	border-right: 3rpx solid #686868;
	transform: rotate(45deg);
	position: absolute;
	right: 30rpx;
	top: 34rpx;
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

.scroll-news-content .content {
	display: inline-block;
	background: #fff;
}

.scroll-news-content .content:nth-child(2) {
	margin-left: 10rpx;
	padding-right: 50rpx;
	box-sizing: border-box;
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
	margin-top: -195rpx;
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

.middle {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 20rpx;

	.convert {
		background: linear-gradient(270deg, #BCD73A 0%, #43C944 96%);
		;
		width: 346rpx;
		height: 294rpx;
		border-radius: 8rpx;
		box-sizing: border-box;
		padding: 14rpx 22rpx;

		.convert-title {
			font-size: 36rpx;
			color: #FFFFFF;
		}

		.convert-sub {
			font-size: 22rpx;
			color: #FFFFFF;
		}

		.convert-go-pic {
			display: flex;
			justify-content: space-between;
			width: 320rpx;
			height: 196rpx;

			.convert-go {
				margin-top: 114rpx;
				width: 112rpx;
				height: 62rpx;
				background: #fff;
				border-radius: 30rpx;
				color: #AAD53D;
				line-height: 62rpx;
				text-align: center;
			}

			.convert-pic {
				box-sizing: border-box;
				width: 196rpx;
				height: 196rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}

	.singIn {
		background: linear-gradient(270deg, #F1C33C 0%, #FE8206 100%);
		width: 346rpx;
		height: 294rpx;
		border-radius: 8rpx;
		box-sizing: border-box;
		padding: 14rpx 22rpx;

		.singIn-title {
			font-size: 36rpx;
			color: #FFFFFF;
		}

		.singIn-sub {
			font-size: 22rpx;
			color: #FFFFFF;
		}

		.singIn-go-pic {
			display: flex;
			justify-content: space-between;
			width: 320rpx;
			height: 196rpx;

			.singIn-go {
				margin-top: 114rpx;
				width: 112rpx;
				height: 62rpx;
				background: #fff;
				border-radius: 30rpx;
				color: #FD8307;
				line-height: 62rpx;
				text-align: center;
			}

			.singIn-pic {
				box-sizing: border-box;
				width: 196rpx;
				height: 196rpx;

				image {
					width: 120%;
					height: 120%;
				}
			}
		}
	}

}

.sponsored-ad {
	width: 710rpx;
	margin-top: 20rpx;
	background: #FFFFFF;

	.sponsored-ad-title {
		background: linear-gradient(270deg, #86AFFF 0%, #045BFF 100%);
		height: 86rpx;
		box-sizing: border-box;
		padding: 22rpx 24rpx;
		color: #FFFFFF;
		font-size: 34rpx;
	}

	.sponsored-ad-content-box {
		box-sizing: border-box;
		padding: 52rpx 24rpx;
		width: 710rpx;
		height: 404rpx;
		border-radius: 8rpx;
		background: #FFFFFF;
	}

	.sponsored-ad-content {
		width: 662rpx;
		height: 296rpx;
		border-radius: 8rpx;
		background: #D8D8D8;
	}
}
</style>