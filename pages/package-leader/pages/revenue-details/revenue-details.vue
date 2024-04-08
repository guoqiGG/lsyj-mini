<template>
	<view class="revenue-list">
		<view class="revenue-list-content">
			<view class="revenue-list-content-box" v-for="(item, index) in revenueLists" :key="item.orderId">
				<image class="bg_list" src="/static/login/revenue_bg.png" mode=""></image>
				<view class="bg_list content">
					<view class="top">
						<text style="font-size: 36rpx;color: #101010;">{{item.name}}</text>
						<text >{{item.createTime}}</text>
					</view>
					<view class="middle">
						<text>{{item.mobile}}</text>
					</view>
					<view class="bottom">
						<text>订单编号：{{item.orderNumber}}</text>
						<view class="">
							<text style="font-size: 28rpx;color: #101010;" >金额:</text>
							<text style="font-size: 28rpx;color: #E27E1E;">+￥{{item.amount}}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 空列表或加载全部提示 -->
			<EmptyAllTips v-if="isLoaded" :isEmpty="!revenueLists.length" emptyTips="暂无更多内容"
				:isAll="pageNo == pageSIize" />
		</view>
	</view>

</template>

<script>
	const http = require("@/utils/http");
	export default {
		data() {
			return {
				isLoaded: false,
				isAll: false,
				revenueLists: [],
				pageNo: 1, // 当前页
				pageSIize: 10, //总页数
				loginToken: null,
				status: 0,
				userId: null, //用户id
			}
		},

		onShow() {
			let bbcLoginResult = uni.getStorageSync("bbcLoginResult"); //用户信息
			this.loginToken = bbcLoginResult.loginToken
			this.userId = bbcLoginResult.id
			this.mobile = bbcLoginResult.leaderMobile
			this.getRevenueLists()
		},
		methods: {
			// 获取收益明细
			getRevenueLists() {
				this.isLoaded = false
				let obj = {
					pageNo: this.pageNo,
					pageSIize: this.pageSIize,
					userId: this.userId,
				}
				const params = {
					url: "/pub/user/leader/amount/list",
					method: "POST",
					data: {
						sign: 'qcsd',
						data: JSON.stringify(obj),
					},
					callBack: (res) => {
						console.log(res,'res')
						this.isLoaded = true
						this.revenueLists = this.pageNo == 1 ? res.list : this.revenueLists.concat(res.list)
						this.pageSIize = res.total == 0 ? 1 : Math.ceil(res.total / this.pageSize)
						
						console.log(this.revenueLists,'this.revenueLists')
					},
				}
				http.request(params);
			},

		},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom() {

			if (this.pageNo < this.pageSIize) {
				this.pageNo = this.pageNo + 1
				this.getRevenueLists()
			} else {
				this.isAll = true
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/ .u-tabs__wrapper__nav__line {
		left: -12rpx;
		width: 58rpx !important;

	}


	/deep/ .u-tabs__wrapper__nav__item__text {
		font-size: 28rpx !important;
	}

	.revenue-list {
		background: #f2f2f2;
		height: 100vh;
		width: 100vw;
		overflow-x: hidden;
		overflow-y: auto;
	}

	.revenue-list-content {
		padding: 0rpx 20rpx;
		.revenue-list-content-box {
			width: 100%;
			height: 176rpx;
			font-size: 28rpx;
			font-weight: 400;
			color: #101010;
			position: relative;
			margin: 20rpx 0rpx 40rpx;
			border-radius: 12rpx;

			.bg_list {
				width: 100%;
				height: 176rpx;
				position: absolute;
				top: 0;
				left: 0;
			}
			.content{
				// padding: 12rpx 26rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
					
				.top,.middle,.bottom{
					padding: 12rpx 26rpx ;
				}
				.top{
					display: flex;
					justify-content: space-between;
					font-weight: 400;
					font-size: 24rpx;
					color: #979797;
					padding: 12rpx 26rpx 0rpx ;
				}
				.bottom{
					height: 54rpx;
					background: #FFFFFF;
					border-radius: 0rpx 0rpx 12rpx 12rpx;
					display: flex;
					justify-content: space-between;
					font-weight: 400;
					font-size: 26rpx;
					color: #101010;
				}
			}
		}
	}
</style>