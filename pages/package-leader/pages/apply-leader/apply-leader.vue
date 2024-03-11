<template>
	<view class="container">
		<view class="main">
			<!-- 信息输入框 -->
			<view class="section">
				<input placeholder="手机号码" type="number" maxlength="11" @input="onMobileInput">
			</view>
			<view class="section">
				<input placeholder="真实姓名" type="text" @input="onRealNameInput" />
			</view>
			<!-- 有无实体店 -->
			<view class="station_have">
				<view :class="['station_have_item', type == 1 ? 'station_have_item1' : '']" @tap="changeStationHave(1)">
					<view class="title">有实体门店</view>
					<view class="desc">如便利店、快递站点等</view>
					<image class="checked" v-if="type == 1" src="/static/checked.png"></image>
				</view>
				<view :class="['station_have_item', type == 0 ? 'station_have_item1' : '']" @tap="changeStationHave(0)">
					<view class="title">无实体门店</view>
					<view class="desc">如小区、住宅等</view>
					<image class="checked" v-if="type == 0" src="/static/checked.png"></image>
				</view>
			</view>

			<!-- 详细地址 -->
			<view class="section section-address" v-if="type == 1">
				<input style="padding-right: 70rpx;" placeholder="详细地址" :value="addr" type="text" maxlength="18"
					@input="onAddrInput" />
				<image class="addres-icon" src="/static/submit-address.png" @tap="selectLoaction" />
			</view>

			<!-- 自提点名称 -->
			<view class="section" v-if="type == 1">
				<input placeholder="自提点名称" type="text" maxlength="18" @input="onStationNameInput" />
			</view>

			<!-- 提交申请栏 -->
			<view class="submit-btn" @tap="submitDisterApply">
				<text>提交申请</text>
			</view>
			<!--end 提交申请栏 -->

		</view>

	</view>
</template>

<script>
const http = require('@/utils/http.js')
const util = require('@/utils/util.js')
var t = 0
var show = false
var moveY = 200
let index = [18, 0, 0]
export default {
	data() {
		return {
			name: '', // 真实姓名
			leaderStore: '',
			type: 1,
			userMobile: '',
			distributionCardNo: '',
			windowHeight: 0,

		}
	},

	onShow: function () {
		// 头部导航标题
		uni.setNavigationBarTitle({
			title: '申请成为团长'
		})
		this.showIndexBtn = getCurrentPages().length <= 1
	},
	onReady: function () {
		this.animation = wx.createAnimation({
			transformOrigin: '50% 50%',
			duration: 0,
			timingFunction: 'ease',
			delay: 0
		})
		this.animation.translateY(200 + 'vh').step()
		this.setData({
			animation: this.animation.export(),
			show: show
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
	},

	methods: {

		/**
		 * 返回首页
		 */
		toIndex() {
			util.toHomePage()
		},
		// 空方法
		nono() {

		},
		onMobileInput: function (e) {
			this.setData({
				userMobile: e.detail.value
			})
		},
		onRealNameInput: function (e) {
			this.setData({
				name: e.detail.value
			})
		},
		onIdCardNoInput: function (e) {
			this.setData({
				identityCardNumber: e.detail.value
			})
		},
		onAddrInput: function (e) {
			this.setData({
				addr: e.detail.value
			})
		},
		onStationNameInput: function (e) {
			this.setData({
				leaderStore: e.detail.value
			})
		},
		/**
		 * 提交申请
		 */
		submitDisterApply: function () {
			var identityCardNumber = this.identityCardNumber
			var identityCardPicBack = this.identityCardPicBack
			var identityCardPicFront = this.identityCardPicFront
			var identityCardPicHold = this.identityCardPicHold
			var distributionCardNo = this.distributionCardNo
			var name = this.name.trim()
			var userMobile = this.userMobile
			var needIdCardNo = this.needIdCardNo
			var neddIdCardPic = this.neddIdCardPic
			var needRealName = this.needRealName
			var areaId = this.areaId
			var leaderStore = this.leaderStore
			var addr = this.addr
			if (userMobile.length == 0) {
				uni.showToast({
					title: '请输入手机号',
					icon: 'none'
				})
			} else if (!util.checkPhoneNumber(userMobile)) {
				uni.showToast({
					title: '请输入正确的手机号码',
					icon: 'none'
				})
			} else if (needRealName && !name) {
				uni.showToast({
					title: '请输入真实姓名',
					icon: 'none'
				})
			} else if (needRealName && name.length < 2) {
				uni.showToast({
					title: '请输入正确的真实姓名',
					icon: 'none'
				})
			} else if (needIdCardNo && !util.checkIDCard(identityCardNumber)) {
				uni.showToast({
					title: '请输入正确的身份证号码',
					icon: 'none'
				})
			} else if (this.type == 1 && areaId == 0) {
				uni.showToast({
					title: '申请地区不能为空',
					icon: 'none'
				})
			} else if (this.type == 1 && leaderStore == '') {
				uni.showToast({
					title: '自提点名称不能为空',
					icon: 'none'
				})
			}
			else if (this.type == 1 && addr == '') {
				uni.showToast({
					title: '自提点详细地址不能为空',
					icon: 'none'
				})
			} else {

				const params = {
					url: '/p/distribution/register/addDistributionUser',
					method: 'post',
					data: {
						identityCardNumber: identityCardNumber,
						identityCardPicBack: identityCardPicBack,
						identityCardPicFront: identityCardPicFront,
						identityCardPicHold: identityCardPicHold,
						name: name,
						sharerCardNo: distributionCardNo,
						userMobile: userMobile,
						leaderStore: leaderStore,
						type: this.type,
						addr: addr,
						provinceId: this.provinceId,
						province: this.province,
						cityId: this.cityId,
						city: this.city,
						areaId: this.areaId,
						area: this.area,
						lat: this.lat,
						lng: this.lng
					},
					callBack: res => {
						uni.showModal({
							content: '申请已提交，请等待审核',
							showCancel: false,
							cancelText: '确认',
							confirmText: '取消',
							complete: () => {
								this.$Router.pushTab('/pages/user/user')
							}
						})
					}
				}
				http.request(params)
			}
		}
	}
}
</script>
<style>
@import "./apply-leader.css";
</style>