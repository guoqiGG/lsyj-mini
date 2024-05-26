<template>
	<view class="container">
		<navigation />
		<view :style="liveBroadcastList.length > 0 ? 'padding-bottom:10rpx;' : ''">
			<view class="live-item" v-for="item in liveBroadcastList" :key="item.coureId"
				@tap="toHuanTuoLiveList(item.coureId, item.coureName, item.url)">
				<view class="coureName">{{ item.coureName }}</view>
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
			this.isLoaded = false
			const params = {
				url: "/pub/user/get/douyin/coure",
				method: "GET",
				callBack: (res) => {
					this.liveBroadcastList = res;
				},
			};
			http.request(params);
		},
		toHuanTuoLiveList(coureId, coureName, url) {
			uni.navigateTo({ url: '/pages/package-user/pages/huantuolive/huantuolive?coureId=' + coureId + '&coureName=' + coureName + '&url=' + url })
		},
	},
};
</script>

<style>
@import "./live-broadcast.css";
</style>