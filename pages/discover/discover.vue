<template>
	<view class="waterfall">
		<uv-waterfall ref="waterfall" v-model="list" :add-time="10" :left-gap="leftGap" :right-gap="rightGap"
			:column-gap="columnGap" @changeList="changeList">
			<!-- 第一列数据 -->
			<template v-slot:list1>
				<!-- 为了磨平部分平台的BUG，必须套一层view -->
				<view>
					<view v-for="(item, index) in list1" :key="item.id" class="waterfall-item">
						<view class="waterfall-item__image" :style="[imageStyle(item)]">
							<video :src="item.video" :show-bottom-progress="false" :style="[imageStyle(item)]"
								:id="'video' + item.id" bindtap="videoPlay"></video>
						</view>
						<view class=" waterfall-item__ft">
							<view class="waterfall-item__ft__title">
								<text class="value">{{ item.total }}</text>
							</view>
							<view class="waterfall-item__ft__desc uv-line-2">
								<text class="value">{{ item.typeStr }}</text>
							</view>
						</view>
					</view>
				</view>
			</template>
			<!-- 第二列数据 -->
			<template v-slot:list2>
				<!-- 为了磨平部分平台的BUG，必须套一层view -->
				<view>
					<view v-for="(item, index) in list2" :key="item.id" class="waterfall-item">
						<view class="waterfall-item__image" :style="[imageStyle(item)]">
							<video :src="item.video" :show-bottom-progress="false" :style="[imageStyle(item)]"
								:id="'video' + item.id" bindtap="videoPlay"></video>
						</view>
						<view class="waterfall-item__ft">
							<view class="waterfall-item__ft__title">
								<text class="value">{{ item.total }}</text>
							</view>
							<view class="waterfall-item__ft__desc uv-line-2">
								<text class="value">{{ item.typeStr }}asdadddddddddddddddddddddddddddddddddddddd</text>
							</view>
						</view>
					</view>
				</view>
			</template>
		</uv-waterfall>
	</view>
</template>
<script>
import http from '@/utils/http'
import { guid } from '@/uni_modules/uv-ui-tools/libs/function/index.js'
export default {
	data() {
		return {
			list: [],// 瀑布流全部数据
			list1: [],// 瀑布流第一列数据
			list2: [],// 瀑布流第二列数据
			leftGap: 10,
			rightGap: 10,
			columnGap: 10,
			pageSize: 6,
			pages: 1,
			current: 1,
			isLoaded: false,
			isAll: false,
			indexCurrent: null
		}
	},
	computed: {
		imageStyle(item) {
			return item => {
				const v = uni.upx2px(750) - this.leftGap - this.rightGap - this.columnGap;
				const w = v / 2;
				const rate = w / item.w;
				const h = rate * item.h;
				return {
					width: w + 'px',
					height: h + 'px'
				}
			}
		}
	},
	async onLoad() {
		const { data } = await this.getData();
		this.list = data;
	},
	methods: {
		changeList(e) {
			this[e.name].push(e.value);
		},
		getData() {
			return new Promise((resolve) => {
				var that = this
				this.isLoaded = false

				const params = {
					url: '/video/get/list?pageSize=' + that.pageSize + '&pageNo=' + that.current,
					method: 'GET',
					callBack: function (res) {
						that.isLoaded = true
						let list = []
						list = res.list
						list.forEach(e => {
							e.allowEdit = false
						});
						list = that.current == 1 ? list : that.list.concat(list)
						console.log(111, list)
						that.pages = res.total == 0 ? 1 : Math.ceil(res.total / that.pageSize)
						resolve({ data: list })
					}
				}
				http.request(params)
			})
		},
		videoPlay(e) {
			console.log(e)
			let curIdx = e.currentTarget.id;
			// 没有播放时播放视频
			// console.log(curIdx)
			if (!this.data.indexCurrent) {
				this.setData({
					indexCurrent: curIdx
				})
				let videoContext = wx.createVideoContext(curIdx, this) //这里对应的视频id
				videoContext.play()
			} else { // 有播放时先将prev暂停，再播放当前点击的current
				let videoContextPrev = wx.createVideoContext(this.data.indexCurrent, this)//this是在自定义组件下，当前组件实例的this，以操作组件内 video 组件（在自定义组件中药加上this，如果是普通页面即不需要加）
				if (this.data.indexCurrent != curIdx) {
					console.log(123)
					videoContextPrev.pause()
					this.setData({
						indexCurrent: curIdx
					})
					let videoContextCurrent = wx.createVideoContext(curIdx, this)
					videoContextCurrent.play()
				}
			}
		},
	},
	async onReachBottom() {
		if (this.current < this.pages) {
			this.current = this.current + 1
			const { data } = await this.getData();
			this.list = data;
		} else {
			this.isAll = true
		}
	}
}
</script>
<style>
page {
	background: #f1f1f1;
}
</style>
<style scoped lang="scss">
$show-lines: 1;
@import '@/uni_modules/uv-ui-tools/libs/css/variable.scss';

.waterfall-item {
	overflow: hidden;
	margin-top: 10px;
	border-radius: 6px;
}

.waterfall-item__image {
	border-radius: 16rpx;
	overflow: hidden;

	video {
		border-radius: 16rpx;
		// width: 100%;
		// height: 100%;
	}
}

.waterfall-item__ft {
	padding: 20rpx;
	background: #fff;

	&__title {
		margin-bottom: 10rpx;
		line-height: 48rpx;
		font-weight: 700;

		.value {
			font-weight: 400;
			font-size: 28rpx;
			color: #101010;
			line-height: 40rpx;
			text-align: left;
			font-style: normal;
			text-transform: none;
		}
	}

	&__desc .value {
		font-weight: 400;
		font-size: 24rpx;
		color: #101010;
		line-height: 34rpx;
		text-align: left;
		font-style: normal;
		text-transform: none;
	}

	&__btn {
		padding: 10px 0;
	}
}
</style>