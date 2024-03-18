<template>
	<view class="leader-index">
		<view class="leader-index-background">

		</view>
		<view class="leader-index-cot">
			<view class="user-info">
				<view class="user-info-photo">
					<image :src="leaderInfo.avatar ? leaderInfo.avatar : '/static/head04.png'"
						@error="imageError(leaderInfo, 'pic')" />
				</view>
				<view class="user-info-name">
					{{ leaderInfo.leaderName }}
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
				<view class="list-line">
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
							<image src="/pages/package-leader/static/ls.png" mode=""></image>
						</view>
						<view class="list-line-lf-text">
							青春豆流水
						</view>
					</view>
					<view class="list-line-rt">
						<u-icon name="arrow-right" size="28"></u-icon>
					</view>
				</view>
				<view class="list-line" @click="userShopDetails()">
					<view class="list-line-lf">
						<view class="list-line-lf-img">
							<image src="/pages/package-leader/static/friend.png" mode=""></image>
						</view>
						<view class="list-line-lf-text">
							购物明细
						</view>
					</view>
					<view class="list-line-rt">
						<u-icon name="arrow-right" size="28"></u-icon>
					</view>
				</view>
				<view class="list-line">
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
				</view>
				<view class="list-line" @click="liveBroadcast()">
					<view class="list-line-lf">
						<view class="list-line-lf-img">
							<image src="/pages/package-leader/static/hx.png" mode=""></image>
						</view>
						<view class="list-line-lf-text">
							直播间
						</view>
					</view>
					<view class="list-line-rt">
						<u-icon name="arrow-right" size="28"></u-icon>
					</view>
				</view>

			</view>

		</view>

	</view>
</template>

<script>
const http = require("@/utils/http");
export default {
	data() {
		return {
			leaderInfo: {
				avatar: '',
				leaderName: '',
				balance: 0,
				totalIncome: 0
			},
			userId: null,
		}
	},
	onShow: function () {
		let bbcUserInfo = uni.getStorageSync("bbcUserInfo"); //用户信息
		this.userId = bbcUserInfo.id
		this.getLeaderInformation()
	},
	methods: {
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
		liveBroadcast(){
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
	padding: 26rpx 22rpx;
	background: #f2f2f2;
	position: relative;

	.leader-index-background {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
		width: 100%;
		height: 350rpx;
		opacity: 1;
		background: linear-gradient(180deg, #025BFF 0%, #025BFF 29%, #FFFFFF 100%);
	}
	
	.leader-index-cot {
		position: absolute;
		top: 0;
		left: 0;
		padding: 26rpx 22rpx;
		z-index: 3;

		.user-info {
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

		.finance {
			margin-top: 28rpx;
			width: 708rpx;
			height: 332rpx;
			border-radius: 12rpx;
			opacity: 1;
			padding: 76rpx 68rpx;
			box-sizing: border-box;
			background: #FFFFFF;

			.finance-number {
				display: flex;
				justify-content: space-between;

				.finance-number-lf {
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
				justify-content: space-between;

				.finance-button-lf {
					/deep/ .u-button {
						width: 162rpx;
						height: 54rpx;
						border-radius: 27rpx;
						background: #F91919;
						border: 0 solid transparent;
						color: #FFFFFF;
					}

					/deep/ .u-button__text {
						line-height: 54rpx !important;
						font-size: 24rpx !important;
					}
				}

				.finance-button-rt {
					/deep/ .u-button {
						width: 162rpx;
						height: 54rpx;
						border-radius: 27rpx;
						background: #FFFFFF;
						border: 2rpx solid #C53032;
						color: #C53032;
					}

					/deep/ .u-button__text {
						line-height: 54rpx !important;
						font-size: 24rpx !important;
					}
				}
			}
		}

		.invite {
			margin-top: 20rpx;
			width: 708rpx;
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
			margin-top: 20rpx;
			box-sizing: border-box;
			width: 708rpx;
			height: 652rpx;
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
	}
}
</style>