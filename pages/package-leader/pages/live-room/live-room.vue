
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
	const config = require("@/utils/config.js");
	const util = require("@/utils/util.js");
		const http = require("@/utils/http");
	import dayjs from "dayjs";
	export default {
		data() {
			return {
				room_id: null,
				url: null,
				isCheckinProhibited: false, // 是否禁止签到 true 禁止 false 不禁止
				isWechat: false, // 是否为微信环境
				startTime: null,
				endTime: null,
			};
		},

		computed: {
			
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			this.isWechat = true;
			this.room_id = options.room_id;
			this.url = options.url;
			this.getLiveRoomInfo(options.room_id);
		},

		onShow: function() {
			util.checkAuthInfo(() => {});
			uni.setNavigationBarTitle({
				title: "邀请进直播间",
			});
			this.getSignTime(); // 直播间签到的时长
			if (uni.getStorageSync("bbcToken")) {
				this.queryUserInfo(); // 获取用户信息
				this.getInsertWriteOffGiftCondition(); //获取插入核销礼物的判断条件
			}
		},
		methods: {
			// 获取直播间信息
			getLiveRoomInfo(room_id) {
				uni.request({
					url: config.domain + "/p/score/get/room/status",
					data: {
						roomId: room_id,
					},
					header: {
						Accept: "application/json",
						"Content-Type": "application/json",
						"X-Requested-With": "XMLHttpRequest",
					},
					method: "GET",
					sslVerify: true,
					success: ({
						data,
						statusCode,
						header
					}) => {
						wx.setStorageSync("liveStatus", data.data.liveStatus);
						this.startTime = data.data.startTime;
						this.endTime = data.data.endTime;
					},
					fail: (error) => {},
				});
			},
			// 进入直播间
			toLive: function(room_id) {
				let that = this;
				util.checkAuthInfo(() => {
					if (uni.getStorageSync("sign")) {
						uni.removeStorageSync("sign");
					}
					if (that.isWechat) {
						const customParams = encodeURIComponent(
							JSON.stringify({
								path: that.url,
							})
						);
						that.clear();
						wx.setStorageSync("liveRoomId", room_id);
						if (wx.getStorageSync("liveStatus") == 101) {
							that.toTimer(); // 计时器
						}

						if (wx.getStorageSync("liveStatus") == 102) {
							// 未开播进入直播间
							if (new Date().getTime() < new Date(that.startTime).getTime()) {
								let second =
									new Date(that.startTime).getTime() - new Date().getTime();
								that.$store.state.checkIn.indexSetTimer = setTimeout(() => {
									that.toTimer(); // 计时器
								}, second);
							}
							if (new Date().getTime() >= new Date(that.startTime).getTime()) {
								that.toTimer(); // 计时器
							}
						}
						wx.navigateTo({
							url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${room_id}&custom_params=${customParams}&open_share_ticket=1`,
						}); // 其中wx2b03c6e691cd7370是直播组件appid不能修改
					} 
				});
			},
			// 获取直播签到时长限制
			getSignTime: function() {
				uni.request({
					url: config.domain + "/p/score/getViewTime",
					data: {},
					header: {
						Accept: "application/json",
						"Content-Type": "application/json",
						"X-Requested-With": "XMLHttpRequest",
					},
					method: "GET",
					sslVerify: true,
					success: ({
						data,
						statusCode,
						header
					}) => {
						// res.data=00000 等于5个零  不让签到
						if (data.data == "00000") {
							this.isCheckinProhibited = true;
							wx.setStorageSync("signTime", 0);
						} else {
							this.isCheckinProhibited = false;
							wx.setStorageSync("signTime", Number(data.data) * 60);
						}
					},
					fail: (error) => {},
				});
			},

			// 签到
			userSign: function() {
				uni.request({
					url: config.domain + "/p/score/updateUserScore",
					data: {
						bizId: wx.getStorageSync("liveRoomId"),
						userId: wx.getStorageSync("userID"), // 用户ID
					},
					header: {
						Accept: "application/json",
						"Content-Type": "application/json",
						"X-Requested-With": "XMLHttpRequest",
					},
					method: "GET",
					sslVerify: true,
					success: ({
						data,
						statusCode,
						header
					}) => {
						if (data.code == "00000") {
							wx.setStorageSync("sign", "签到成功");
						}
					},
					fail: (error) => {},
				});
			},

			// 插入观看时间
			watchTimes() {
				const params = {
					url: "/live/liveRoom/putRealTime",
					method: "POST",
					data: {
						userId: wx.getStorageSync("userID"), // 用户ID
						liveRoomId: wx.getStorageSync("liveRoomId"), // 房间ID
					},
					callBack: (res) => {
						console.log("每分钟插入");
						if (res) {
							if (
								res == wx.getStorageSync("insertWriteOffGiftCondition").time &&
								wx.getStorageSync("insertWriteOffGiftCondition").open == 1
							) {
								this.insertWriteOffGift();
							}
							if (
								Number(res) * 60 >= uni.getStorageSync("signTime") &&
								!uni.getStorageSync("sign") &&
								!this.isCheckinProhibited
							) {
								this.userSign();
							}
						}
					},
				};
				http.request(params);
			},

			// 获取用户信息
			queryUserInfo: function() {
				const params = {
					url: "/p/user/userInfo",
					method: "GET",
					data: {},
					dontTrunLogin: true,
					callBack: (res) => {
						uni.setStorageSync("bbcUserInfo", res);
						uni.setStorageSync("userID", res.userId);
					},
				};
				http.request(params);
			},

			// 获取插入核销礼物的判断条件
			getInsertWriteOffGiftCondition() {
				const params = {
					url: "/p/score/score/getViewTime",
					method: "GET",
					data: {},
					callBack: (res) => {
						wx.setStorageSync("insertWriteOffGiftCondition", res);
					},
				};
				http.request(params);
			},
			// 插入核销礼物
			insertWriteOffGift() {
				uni.request({
					url: config.domain + "/p/score/insertUserScore",
					data: {
						bizId: wx.getStorageSync("liveRoomId"),
						userId: wx.getStorageSync("userID"), // 用户ID
					},
					header: {
						Accept: "application/json",
						"Content-Type": "application/json",
						"X-Requested-With": "XMLHttpRequest",
					},
					method: "GET",
					sslVerify: true,
					success: ({
						data,
						statusCode,
						header
					}) => {},
					fail: (error) => {},
				});
			},
			// 清除计时器  倒计时
			clear: function() {
				console.log("清除index页面的计时器");
				clearInterval(this.$store.state.checkIn.indexTimer);
				this.$store.state.checkIn.indexTimer = null;
				clearTimeout(this.$store.state.checkIn.indexSetTimer);
				this.$store.state.checkIn.indexSetTimer = null;
				this.insertWatchSecond();
			},
			//插入直播间观看时长秒数
			insertWatchSecond() {
				if (wx.getStorageSync("liveStatus") != 101) return;
				if (
					wx.getStorageSync("liveRoomId") &&
					wx.getStorageSync("bbcUserInfo").openId
				) {
					console.log("插入直播间观看时长秒数");
					// 插入观看秒数
					/* uni.request({
						url: config.domain + "/p/score/add/user/second",
						data: {
							openId: wx.getStorageSync("bbcUserInfo").openId,
							roomId: wx.getStorageSync("liveRoomId"),
							time: Number(
								wx.getStorageSync("watchSecond") ?
								wx.getStorageSync("watchSecond") :
								0
							) % 60,
						},
						header: {
							Accept: "application/json",
							"Content-Type": "application/json",
							"X-Requested-With": "XMLHttpRequest",
						},
						method: "GET",
						sslVerify: true,
						success: ({
							data,
							statusCode,
							header
						}) => {},
						fail: (error) => {},
					}); */
				}
			},

			// 计时器 计时
			toTimer() {
				let that = this;
				let aa =
					0 +
					Number(
						wx.getStorageSync("watchSecond") ?
						wx.getStorageSync("watchSecond") :
						0
					);

				let endTime = that.endTime ?
					new Date(that.endTime).getTime() :
					new Date().getTime();
				console.log(endTime);

				that.$store.state.checkIn.indexTimer = setInterval(() => {
					console.log("已观看时长", aa);
					aa += 1;
					// 每一分钟插入
					if (aa % 180 == 0) {
						console.log(new Date().getTime(), endTime);
						if (new Date().getTime() <= endTime) {
							console.log("每分钟插入");
							that.watchTimes();
						}
						wx.setStorageSync("watchSecond", 0);
					}
					//  获取观看的秒
					if (aa % 180 !== 0) {
						let bb = aa % 180;
						wx.setStorageSync("watchSecond", bb);
					}
				}, 1000);
			},
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