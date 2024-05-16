<template>
	<view class="container">
		<navigation />
		<view :style="liveBroadcastList.length > 0 ? 'padding-bottom:10rpx;' : ''">
			<view class="live-item" v-for="item in liveBroadcastList" :key="item.courseId" @tap="toHuanTuoLiveList">
				<view class="courseName">{{ item.courseName }}</view>
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
				url: "/huan/tuo/newPage?pageNo=" + this.current + '&pageSize=' + this.size,
				method: "GET",
				callBack: (res) => {
					console.log(res)
					this.isLoaded = true;
					this.liveBroadcastList = res.list;
				},
			};
			http.request(params);
		},
		toHuanTuoLiveList() {
			uni.navigateTo({ url: '/pages/package-user/pages/huantuolive/huantuolive' })
		},
	},
};
</script>

<style>
@import "./live-broadcast.css";
</style>