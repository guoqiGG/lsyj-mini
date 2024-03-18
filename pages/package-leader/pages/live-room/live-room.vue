<template>
	<view class="Mall4j wallet-container">
		<view class="con">
			<image src="https://devcdn.hnbjx.net.cn/0c12b6d0-59c0-11ee-aba8-c9501bbb929b.png" @tap="toLive(room_id)">
			</image>
			<text class="desc">点击图片观看直播</text>
		</view>
	</view>
</template>

<script>
const util = require("@/utils/util.js");
import dayjs from "dayjs";
export default {
	data() {
		return {
			room_id: null,
			url: null
		};
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		console.log(options)
		this.room_id = options.room_id;
		this.url = options.url;
	},

	onShow: function () {
		util.checkAuthInfo(() => { });
		uni.setNavigationBarTitle({
			title: "邀请进直播间",
		});
	},
	methods: {
		// 进入直播间
		toLive: function (room_id) {
			util.checkAuthInfo(() => {
				const customParams = encodeURIComponent(
					JSON.stringify({
						path: this.url,
					})
				);
				wx.navigateTo({
					url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${room_id}&custom_params=${customParams}&open_share_ticket=1`,
				});
			});
		}
	},
	// 自定义分享
	onShareAppMessage() {
		return {
			title: dayjs().format("MM-DD") + "氢春态欢乐团邀您一起观看直播",
			path: "/package-user/pages/live-room/live-room?room_id=" +
				this.room_id +
				"&url=" +
				this.url,
			imageUrl: "http://qingchuntaijava1.oss-cn-beijing.aliyuncs.com/2023/10/2065112b1ce4443dad9ec00cfdcfd58b.jpg",
		};
	},
};
</script>

<style>
@import "./live-room.css";
</style>