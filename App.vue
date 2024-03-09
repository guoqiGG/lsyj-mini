<script>
import Vue from 'vue'
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
	},
	onShow: function () {
		console.log('App Show')
	},
	onHide: function () {
		console.log('App Hide')
	}
}
</script>

<style lang="scss">
@import 'uni_modules/uview-ui/index.scss';
/*每个页面公共css */
@import "./app.css";
</style>