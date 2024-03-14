<template>
	<view class="container">
		<view class="main">
			<!-- 信息输入框 -->
			<view class="section">
				<input placeholder="真实姓名" type="text" @input="onRealNameInput" />
			</view>
			<view class="section">
				<input placeholder="手机号码" type="number" maxlength="11" @input="onMobileInput">
			</view>
			<!-- 有无实体店 -->
			<view class="station_have">
				<view :class="['station_have_item', type == 0 ? 'station_have_item1' : '']" @tap="changeStationHave(0)">
					<view class="title">有实体门店</view>
					<view class="desc">如便利店、快递站点等</view>
					<image class="checked" v-if="type == 0" src="/static/checked.png"></image>
				</view>
				<view :class="['station_have_item', type == 1 ? 'station_have_item1' : '']" @tap="changeStationHave(1)">
					<view class="title">无实体门店</view>
					<view class="desc">如小区、住宅等</view>
					<image class="checked" v-if="type == 1" src="/static/checked.png"></image>
				</view>
			</view>
			<!-- 自提点名称 -->
			<!-- <view class="section" v-if="type == 0">
				<input placeholder="自提点名称" type="text" maxlength="18" @input="onStationNameInput" />
			</view> -->
			<!-- 备注 -->
			<view class="section">
				<input placeholder="自提点名称" type="remark"  @input="onRemarkInput" />
			</view>
			<!-- 自提点地址 -->
			<view class="section section-address" v-if="type == 0">
				<input style="padding-right: 70rpx;" placeholder="自提点地址" :value="address" type="text" 
					@input="onAddrInput" />
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

export default {
	data() {
		return {
			name: '', // 真实姓名
			leaderStore: '',// 自提点名称
			type: 0, // 0有店 1无店
			mobile: '',	// 手机号
			address: '',// 门店地址
			userId: null,
			remark: ''
		}
	},

	onShow: function () {
		let bbcUserInfo = uni.getStorageSync("bbcUserInfo"); //用户信息
		this.userId = bbcUserInfo.id
		// 头部导航标题
		uni.setNavigationBarTitle({
			title: '申请团长'
		})
	},
	methods: {
		changeStationHave: function (isHave) {
			this.setData({
				type: isHave,
			})
			if (isHave == 1) {
				this.setData({
					address: '',
					leaderStore: '',
				})

			}
		},
		onMobileInput: function (e) {
			this.setData({
				mobile: e.detail.value
			})
		},
		onRealNameInput: function (e) {
			this.setData({
				name: e.detail.value
			})
		},
		onAddrInput: function (e) {
			this.setData({
				address: e.detail.value
			})
		},
		onStationNameInput: function (e) {
			this.setData({
				leaderStore: e.detail.value
			})
		},
		onRemarkInput: function (e) {
			this.setData({
				remark: e.detail.value
			})
		},

		/**
		 * 提交申请
		 */
		submitDisterApply: function () {
			var name = this.name.trim()
			var mobile = this.mobile
			var type = this.type
			var leaderStore = this.leaderStore
			var address = this.address
			var remark = this.remark

			if (!name) {
				uni.showToast({
					title: '请输入真实姓名',
					icon: 'none'
				})
			} else if (name.length < 2) {
				uni.showToast({
					title: '请输入正确的真实姓名',
					icon: 'none'
				})
			} if (mobile.length == 0) {
				uni.showToast({
					title: '请输入手机号',
					icon: 'none'
				})
			} else if (!util.checkPhoneNumber(mobile)) {
				uni.showToast({
					title: '请输入正确的手机号码',
					icon: 'none'
				})
			} 
			else if (this.type == 0 && remark == '') {
				uni.showToast({
					title: '自提点名称不能为空',
					icon: 'none'
				})
			}
			else if (this.type == 0 && address == '') {
				uni.showToast({
					title: '自提点地址不能为空',
					icon: 'none'
				})
			} else {
				const params = {
					url: '/pub/leader/apply',
					method: 'POST',
					data: {
						sign: 'qcsd',
						data: JSON.stringify({
							name: name,
							mobile: mobile,
							type: type,
							leaderStore: leaderStore,
							address: address,
							remark: remark,
							userId: this.userId,
						})
					},
					callBack: res => {
						uni.showModal({
							content: '申请已提交，请等待审核',
							showCancel: false,
							cancelText: '取消',
							confirmText: '确认',
							complete: () => {
								uni.switchTab({
									url: '/pages/user/user'
								})
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