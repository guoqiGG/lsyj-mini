<script>
import Vue from 'vue'
const util = require("@/utils/util.js");
export default {
	onLaunch: function () {
		console.log('App Launch')
		// #ifndef H5
		uni.getSystemInfo({
			success: function (res) {
				// px转换到rpx的比例
				const pxToRpxScale = 750 / res.windowWidth;
				const systems = {
					ktxStatusHeight: res.statusBarHeight * pxToRpxScale, // 状态栏的高度
					navigationHeight: 44 * pxToRpxScale, // 导航栏的高度
					ktxWindowWidth: res.windowWidth * pxToRpxScale, // window的宽度
					ktxWindowHeight: res.windowHeight * pxToRpxScale, // window的高度
					ktxScreentHeight: res.screenHeight * pxToRpxScale, // 屏幕的高度
				};
				Vue.prototype.$system = systems;
				Vue.prototype.$lineHeight =
					systems.ktxStatusHeight + systems.navigationHeight;
			},
		});
		// #endif

		// 微信小程序检查升级
		this.checkMiniUpdate();
		// 微信环境统一登录方法
		// util.weChatLogin();
	},
	onShow: function () {
		console.log('App Show')
	},
	onHide: function () {
		console.log('App Hide')
	},
	globalData: {
		// 定义全局请求队列
		requestQueue: [],
		// 是否正在进行登陆
		isLanding: false,
		// 当前请求数量
		currentReqCounts: 0,
		// 当前是否已显示登录失效弹窗
		showLoginExpired: false,
	},
	methods: {
		/**
	* 微信小程序检查升级
	*/
		checkMiniUpdate() {
			const updateManager = wx.getUpdateManager();
			updateManager.onCheckForUpdate(function (res) {
				// 请求完新版本信息的回调
				console.log(res.hasUpdate);
			});

			updateManager.onUpdateReady(function () {
				wx.showModal({
					title: "更新提示",
					content: "新版本已经准备好，是否重启应用？",
					success: function (res) {
						if (res.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate();
						}
					},
				});
			});

			updateManager.onUpdateFailed(function () {
				// 新版本下载失败
				uni.showToast({
					title: "新版本下载失败,请重试",
					duration: 2000,
					icon: "none",
				});
			});
		},
	},
}
</script>

<style lang="scss">
@import 'uni_modules/uview-ui/index.scss';
/*每个页面公共css */
@import "./app.css";
</style>