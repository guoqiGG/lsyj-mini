<template>
	<view class="leader-index">
		<view class="leader-index-background"></view>
		<view class="leader-index-cot">
			<view class="user-info">
				<view class="left">
					<view class="user-info-photo">
						<image :src="leaderInfo.avatar ? leaderInfo.avatar : '/static/head04.png'"
							@error="imageError(leaderInfo, 'pic')" />
					</view>
					<view class="user-info-name">
						{{ leaderInfo.leaderName }}
					</view>
				</view>
				<view class="right">
					<view class="orderNumber">
						<view class="title">订单数</view>
						<view class="number">{{ todayOrderNumber }}</view>
					</view>
					<view class="amount">
						<view class="title">金额</view>
						<view class="number">{{ todayAmount }}</view>
					</view>
				</view>
			</view>

			<view class="datepicker-con">
				<view class="con">
					<view class="title">销量：</view>
					<view class="startDate" @tap="open">{{ startDate ? startDate : '开始日期' }}</view>
					<text>-</text>
					<view class="endDate" @tap="open2">{{ endDate ? endDate : '结束日期' }}</view>
					<view class="search" @tap="getSale">查询</view>
				</view>
				<uv-datetime-picker ref="datetimePicker" :minDate="1704038400000" :maxDate="maxDate" v-model="startTime"
					mode="date" @confirm="confirm">
				</uv-datetime-picker>
				<uv-datetime-picker ref="datetimePicker2" :minDate="1704038400000" :maxDate="maxDate" v-model="endTime"
					mode="date" @confirm="confirm2">
				</uv-datetime-picker>
				<view class="sale">
					<view class="orderNumber">
						<view class="title"> 总订单数：</view>
						<view class="number">{{ orderNumber }}</view>
					</view>
					<view class="amount">
						<view class="title"> 总金额：</view>
						<view class="number">{{ amount }}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="finance">
			<view class="finance-number">
				<view class="finance-number-lf">
					<view class="finance-number-lf-tit">
						{{ leaderInfo.balance }}
					</view>
					<view class="finance-number-lf-cot">
						可提现（元）
					</view>
				</view>
				<view class="finance-number-lf">
					<view class="finance-number-lf-tit">
						{{ leaderInfo.totalIncome }}
					</view>
					<view class="finance-number-lf-cot">
						总收益（元）
					</view>
				</view>
			</view>
			<view class="finance-button">
				<view class="finance-button-lf">
					<u-button @click="instanceWithdrawal()" type="primary" text="立即提现"></u-button>
				</view>
				<view class="finance-button-rt">
					<u-button @click="withdrawalRecord()" class="button-rt" text="提现记录"></u-button>
				</view>
			</view>
		</view>

		<view class="invite" @tap="toInvitationCards">
			<view class="invite-img">
				<image src="/pages/package-leader/static/invite.png" mode=""></image>
			</view>
			<view class="invite-text-lf">
				邀请好友
			</view>
			<view class="invite-text-rt">
				推广奖励
			</view>
		</view>
		<view class="list">
			<view class="list-line" @click="goToFriends()">
				<view class="list-line-lf">
					<view class="list-line-lf-img">
						<image src="/pages/package-leader/static/friend.png" mode=""></image>
					</view>
					<view class="list-line-lf-text">
						我的好友
					</view>
				</view>
				<view class="list-line-rt">
					<u-icon name="arrow-right" size="28"></u-icon>
				</view>
			</view>
			<view class="list-line" @click="goRevenueDetails()">
				<view class="list-line-lf">
					<view class="list-line-lf-img">
						<image src="/pages/package-leader/static/mx.png" mode=""></image>
					</view>
					<view class="list-line-lf-text">
						收益明细
					</view>
				</view>
				<view class="list-line-rt">
					<u-icon name="arrow-right" size="28"></u-icon>
				</view>
			</view>
			<view class="list-line">
				<view class="list-line-lf">
					<view class="list-line-lf-img">
						<image src="/pages/package-leader/static/bean.png" mode=""></image>
					</view>
					<view class="list-line-lf-text">
						青春豆流水
					</view>
				</view>
				<view class="list-line-rt">
					<u-icon name="arrow-right" size="28"></u-icon>
				</view>
			</view>
			<view class="list-line" @click="liveBroadcast()">
				<view class="list-line-lf">
					<view class="list-line-lf-img">
						<image src="/pages/package-leader/static/live.png" mode=""></image>
					</view>
					<view class="list-line-lf-text">
						直播间列表
					</view>
				</view>
				<view class="list-line-rt">
					<u-icon name="arrow-right" size="28"></u-icon>
				</view>
			</view>
			<view class="list-line" @click="userShopDetails()">
				<view class="list-line-lf">
					<view class="list-line-lf-img">
						<image src="/pages/package-leader/static/user-shop.png" mode=""></image>
					</view>
					<view class="list-line-lf-text">
						购物明细
					</view>
				</view>
				<view class="list-line-rt">
					<u-icon name="arrow-right" size="28"></u-icon>
				</view>
			</view>
			<!-- <view class="list-line">
				<view class="list-line-lf">
					<view class="list-line-lf-img">
						<image src="/pages/package-leader/static/mx3.png" mode=""></image>
					</view>
					<view class="list-line-lf-text">
						核销明细
					</view>
				</view>
				<view class="list-line-rt">
					<u-icon name="arrow-right" size="28"></u-icon>
				</view>
			</view> -->
		</view>
	</view>
</template>

<script>
const http = require("@/utils/http");
import dayjs from "dayjs";
export default {
	data() {
		return {
			leaderInfo: {
				avatar: '',
				leaderName: '',
				balance: 0,
				totalIncome: 0,
			},
			userId: null,
			startTime: null,
			endTime: null,
			startDate: '',
			endDate: '',
			orderNumber: 0,
			amount: 0,
			todayOrderNumber: 0,
			todayAmount: 0,
			maxDate: new Date(new Date().toLocaleDateString()).getTime() - 1 * 24 * 60 * 60 * 1000
		}
	},
	onShow: function () {
		let bbcUserInfo = uni.getStorageSync("bbcUserInfo"); //用户信息
		this.userId = bbcUserInfo.id
		this.getLeaderInformation()
		this.getTodaySale()
	},
	methods: {
		open() {
			this.$refs.datetimePicker.open();
		},
		confirm(e) {
			this.startDate = dayjs(new Date(e.value)).format('YYYY-MM-DD')
		},
		open2() {
			this.$refs.datetimePicker2.open();
		},
		confirm2(e) {
			console.log(e)
			this.endDate = dayjs(new Date(e.value)).format('YYYY-MM-DD')
		},
		// 查询今日销量
		getTodaySale() {
			const params = {
				url: "/pub/user/leader/amount",
				method: "POST",
				data: {
					sign: 'qcsd',
					data: JSON.stringify({
						userId: uni.getStorageSync('bbcUserInfo').id
					}),
				},
				callBack: (res) => {
					console.log(res)
					this.todayOrderNumber = res.orderNumber ? res.orderNumber : 0
					this.todayAmount = res.amount ? res.amount : 0
				},
			}
			http.request(params);
		},
		// 查询一段时间内的销量
		getSale() {
			if (!this.startDate && !this.endDate) {
				uni.showToast({
					title: '请选择查询时间',
					icon: 'none',
					mask: true
				})
				return
			}
			if (this.startDate && !this.endDate) {
				uni.showToast({
					title: '请选择结束时间',
					icon: 'none',
					mask: true
				})
				return
			}
			if (!this.startDate && this.endDate) {
				uni.showToast({
					title: '请选择开始时间',
					icon: 'none',
					mask: true
				})
				return
			}
			if (this.startDate && this.endDate) {
				const params = {
					url: "/pub/user/leader/amount/date",
					method: "POST",
					data: {
						sign: 'qcsd',
						data: JSON.stringify({
							userId: uni.getStorageSync('bbcUserInfo').id,
							startDate: this.startDate,
							endDate: this.endDate
						}),
					},
					callBack: (res) => {
						this.orderNumber = res.orderNumber ? res.orderNumber : 0
						this.amount = res.amount ? res.amount : 0
					},
				}
				http.request(params);
			}
		},
		instanceWithdrawal() {
			uni.navigateTo({
				url: '/pages/package-leader/pages/withdrawal/withdrawal?withdrawable=' + this.leaderInfo.balance
			})
		},
		withdrawalRecord() {
			uni.navigateTo({
				url: "/pages/package-leader/pages/take-notes/take-notes"
			})
		},
		// 收益明细
		goRevenueDetails() {
			uni.navigateTo({
				url: "/pages/package-leader/pages/revenue-details/revenue-details"
			})
		},
		// 购物明细
		userShopDetails() {
			uni.navigateTo({
				url: "/pages/package-leader/pages/user-shop-details/user-shop-details"
			})
		},
		goToFriends() {
			uni.navigateTo({
				url: "/pages/package-leader/pages/my-friends/my-friends"
			})
		},
		// 直播间
		liveBroadcast() {
			uni.navigateTo({
				url: "/pages/package-leader/pages/live-broadcast/live-broadcast"
			})
		},
		// 查询团长信息
		getLeaderInformation() {
			let obj = {
				userId: this.userId
			}
			const params = {
				url: "/pub/leader",
				method: "POST",
				data: {
					sign: 'qcsd',
					data: JSON.stringify(obj),
				},
				callBack: (res) => {
					this.leaderInfo = res
					uni.setStorageSync('bbcLeaderInfo', res)
				},
			}
			http.request(params);
		},

		// 跳转到邀请好友页面
		toInvitationCards: function () {
			uni.navigateTo({
				url: '/pages/package-leader/pages/invitation-cards/invitation-cards'
			})
		},
	}
}
</script>

<style lang="scss" scoped>
.leader-index {
	width: 100vw;
	height: 100vh;
	overflow-x: hidden;
	overflow-y: auto;
	box-sizing: border-box;
	background: #f2f2f2;
	position: relative;
	padding-bottom: 20rpx;

	.leader-index-cot {
		background: linear-gradient(180deg, #FD594D 0%, #ffffff 100%);
		padding: 30rpx;
	}
}

.finance {
	margin: 0 20rpx;
	margin-top: 20rpx;
	height: 332rpx;
	border-radius: 12rpx;
	opacity: 1;
	padding: 76rpx 68rpx;
	box-sizing: border-box;
	background: #FFFFFF;

	.finance-number {
		display: flex;

		.finance-number-lf {
			flex: 1;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			padding: 0 56rpx;
			box-sizing: border-box;

			.finance-number-lf-tit {
				font-size: 40rpx;
				font-weight: normal;
				line-height: 48rpx;
				text-align: center;
				letter-spacing: 0rpx;

				font-variation-settings: "opsz" auto;
				/* 10 */
				color: #101010;
			}

			.finance-number-lf-cot {
				margin-top: 10rpx;
				font-size: 24rpx;
				font-weight: normal;
				line-height: 48rpx;
				text-align: center;
				color: #9E9E9E;
			}
		}
	}

	.finance-button {
		margin-top: 40rpx;
		display: flex;

		.finance-button-lf {
			flex: 1;
			display: flex;
			justify-content: center;

			/deep/ .u-button {
				width: 162rpx;
				height: 54rpx;
				border-radius: 27rpx;
				background: #4083FF;
				border: 0 solid transparent;
				color: #FFFFFF;
			}

			/deep/ .u-button__text {
				line-height: 54rpx !important;
				font-size: 24rpx !important;
			}
		}

		.finance-button-rt {
			flex: 1;
			display: flex;
			justify-content: center;

			/deep/ .u-button {
				width: 162rpx;
				height: 54rpx;
				border-radius: 27rpx;
				background: #FFFFFF;
				border: 2rpx solid #4083FF;
				color: #4083FF;
			}

			/deep/ .u-button__text {
				line-height: 54rpx !important;
				font-size: 24rpx !important;
			}
		}
	}
}

.invite {
	margin: 0 20rpx;
	margin-top: 20rpx;
	height: 124rpx;
	border-radius: 12rpx;
	background: #FFFFFF;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	box-sizing: border-box;
	padding: 20rpx 40rpx;

	.invite-img {
		width: 86rpx;
		height: 86rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.invite-text-lf {
		margin-left: 24rpx;
		font-size: 32rpx;
		font-weight: normal;
		line-height: 48rpx;
		color: #101010;
	}

	.invite-text-rt {
		margin-left: 24rpx;
		font-size: 24rpx;
		font-weight: normal;
		line-height: 48rpx;
		color: #979797;
	}
}

.list {
	margin: 0 20rpx;
	margin-top: 20rpx;
	box-sizing: border-box;
	border-radius: 12rpx;
	background: #FFFFFF;
	padding: 44rpx 44rpx;

	.list-line {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 40rpx;

		.list-line-lf {
			display: flex;
			align-items: center;
			justify-content: flex-start;

			.list-line-lf-img {
				width: 60rpx;
				height: 60rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.list-line-lf-text {
				margin-left: 20rpx;
				font-size: 28rpx;
			}
		}
	}
}

.user-info {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;

	.left {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		height: 80rpx;

		.user-info-photo {
			width: 80rpx;
			height: 80rpx;

			image {
				border-radius: 50%;
				width: 100%;
				height: 100%;
			}
		}

		.user-info-name {
			margin-left: 20rpx;
			color: #FFF;
			font-size: 32rpx;
		}
	}

	.right {
		display: flex;
		align-items: center;
		color: #FFF;

		.orderNumber {
			display: flex;
			flex-direction: column;
			align-items: center;

			.title {
				font-weight: 400;
				font-size: 32rpx;
				color: #FFFFFF;
				line-height: 48rpx;
			}

			.number {
				font-weight: 400;
				font-size: 32rpx;
				color: #FFFFFF;
				line-height: 48rpx;
			}
		}

		.amount {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-right: 48rpx;
			margin-left: 52rpx;

			.title {
				font-weight: 400;
				font-size: 32rpx;
				color: #FFFFFF;
				line-height: 48rpx;
			}

			.number {
				font-weight: 400;
				font-size: 32rpx;
				color: #FFFFFF;
				line-height: 48rpx;

			}
		}
	}
}

.datepicker-con {
	background: #fff;
	margin-top: 20rpx;
	padding: 20rpx 20rpx;
	border-radius: 12rpx 12rpx 12rpx 12rpx;

	.con {
		display: flex;
		flex-direction: row;
		align-items: center;

		.title {
			font-weight: 400;
			font-size: 32rpx;
			color: #101010;
			line-height: 48rpx;
		}

		.startDate,
		.endDate {
			width: 150rpx;
			border-radius: 198rpx 198rpx 198rpx 198rpx;
			border: 2rpx solid #979797;
			text-align: center;
			font-weight: 400;
			font-size: 24rpx;
			color: #9E9E9E;
			line-height: 48rpx;
			padding: 2rpx 20rpx;
		}

		text {
			color: #979797;
			padding: 0 12rpx;
		}

		.search {
			margin-left: 12rpx;
			padding: 6rpx 12rpx;
			background: #FD594D;
			font-weight: 400;
			font-size: 32rpx;
			color: #FFFFFF;
			border-radius: 12rpx 12rpx 12rpx 12rpx;
		}
	}

	.sale {
		margin-top: 15rpx;
		display: flex;
		flex-direction: row;

		.orderNumber,
		.amount {
			flex: 1;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
		}

		.amount {
			margin-left: 30rpx;
		}
	}
}
</style>