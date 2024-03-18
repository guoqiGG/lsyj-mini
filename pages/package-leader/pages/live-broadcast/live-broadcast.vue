<template>
	<view class="Mall4j container">
		<view :style="liveBroadcastList.length > 0 ? 'padding-bottom:10rpx;' : ''">
			<view class="live-container" v-if="liveBroadcastList.length > 0">
				<view v-for="(item, index) in liveBroadcastList" :key="index" :data-roomid="item.roomId"
					:data-anchorwechat="item.roomId" :data-roomStatus="item.liveStatus"
					:data-startTime="item.createTime" @tap="toLivePage">
					<!-- <image class="share" src="/static/share.png" /> -->
					<view class="live-item">
						<view class="live-left">
							<!-- <image class="image" src="/static/share.png" /> -->
							<image class="image" :src="item.coverImg.includes('http')
			? item.coverImg
			: 'http://qingchuntaijava1.oss-cn-beijing.aliyuncs.com' +
			item.coverImg
			" mode="scaleToFill"></image>
							<view :class="[
			'b-situation',
			'bg-white',
			item.liveStatus == 101 ? 'on-live' : 'no-live',
		]">
								<image class="like-icon" src="/static/icon-live.png"></image>
								<view class="b-processing">
									<!-- 直播间状态。101：直播中，102：未开始，103已结束，104禁播，105：暂停，106：异常，107：已过期 -->
									<text class="state">{{
			item.liveStatus == 101
				? "直播中"
				: item.liveStatus == 102
					? "未开始"
					: item.liveStatus == 103
						? "已结束"
						: item.liveStatus == 104
							? "禁播"
							: item.liveStatus == 105
								? "暂停"
								: item.liveStatus == 106
									? "异常"
									: item.liveStatus == 107
										? "已过期"
										: ""
		}}</text>
								</view>
							</view>
							<view :class="[
				'like',
				'bg-white',
				item.liveStatus == 101 ? 'on-live' : 'no-live',
			]">
								<image class="like-icon" src="/static/icon-product.png"></image>
								<view class="like-num" style="color: ff0000; opacity: 1">
									商品99+</view>
							</view>
						</view>
						<view class="live-right">
							<view class="top">
								<image class="image" :src="item.feedsImg.includes('http')
			? item.feedsImg
			: 'http://qingchuntaijava1.oss-cn-beijing.aliyuncs.com' +
			item.feedsImg
			" mode="scaleToFill"></image>
							</view>
							<view class="bottom">
								<image class="image" :src="item.shareImg.includes('http')
			? item.shareImg
			: 'http://qingchuntaijava1.oss-cn-beijing.aliyuncs.com' +
			item.shareImg
			" mode="scaleToFill"></image>
							</view>
						</view>
					</view>
					<view v-if="index < liveBroadcastList.length - 1" class="item-center-line"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
const util = require("@/utils/util.js");
const http = require("@/utils/http");
export default {
	data() {
		return {
			liveBroadcastList: [],
			current: 1,
			size: 10,
			pages: 1,
		};
	},

	onShow: function () {
		this.queryLiveList(); // 播放列表
	},
	methods: {
		// 获取直播间列表
		queryLiveList() {
			let obj = {
				pageNo: 1,
				pageSize: 10,
				statusList: [101, 102, 107],
			}
			this.isLoaded = false
			const params = {
				url: "/admin/get/live/list",
				method: "POST",
				data: {
					sign: 'qcsd',
					data: JSON.stringify(obj),
				},
				callBack: (res) => {
					this.isLoaded = true;
					this.liveBroadcastList = res.list;
				},
			};
			http.request(params);
		},
		// 分享
		toLivePage(e) {
			// 跳转到直播间页面
			uni.navigateTo({
				url: "/pages/package-leader/pages/live-room/live-room?room_id=" +
					e.currentTarget.dataset.roomid +
					"&url=" +
					e.currentTarget.dataset.url,
			});
		},
	},
};
</script>

<style>
@import "./live-broadcast.css";
</style>