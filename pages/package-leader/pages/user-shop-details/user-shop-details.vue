<template>
	<view class="content">
		<view class="search_box">
			<view class="search">
				<u-icon top="22" class="search_icon" name="search" size="40"></u-icon>
				<text class="line"></text>
				<input type="text" class="input" v-model="keyword" placeholder="搜索订单" />
				<button size="default" type="default" class="button" @click="searchBtn">搜索</button>
			</view>
			<view class="tab" style="margin-top:30rpx;">
				<u-subsection :list="list" fontSize="14px" activeColor="#025BFF" inactiveColor="#9E9E9E"
					bgColor="#ffffff" :current="current" @change="sectionChange">
				</u-subsection>
			</view>
		</view>
		<view class="leader-index">
			<view class="list">
				<view class="list_item" v-for="item in 4 ">
					<view class="top">
						<text>行止由心</text>
						<text style="color: #C53032;font-size: 26rpx;">交易关闭</text>
					</view>
					<view class="middle">
						<image class="pro_img" src="../../static/mx3.png" mode=""></image>
						<view class="pro_box">
							<view class="">
								<view style="font-size: 28rpx;">溢水杯</view>
								<view style="font-size: 22rpx;">下单时间：2024-03-05 9：45</view>
							</view>
							<view class="">
								<view style="font-size: 24rpx;">溢水杯</view>
								<view style="font-size: 22rpx;color: #979797;">共1件</view>
							</view>
						</view>
					</view>
					<view class="footer">
						<text class="pro_detail">查看详情</text>
					</view>
				</view>
			</view>

		</view>

	</view>

</template>

<script>
	export default {
		data() {
			return {
				keyword: '',
				list: ['全部', '待付款', '待发货', '待收货', '已完成'],
				current: 0
			}
		},
		methods: {
			sectionChange(index) {
				this.current = index;
			},
			searchBtn() {
				console.log(124235)
				console.log(this.keyword)
			}

		}
	}
</script>

<style lang="scss" scoped>
	.search_box{
		height: 166rpx;
		padding: 26rpx 22rpx;
		background: #FFFFFF;
		.search {
			height: 78rpx;
			position: relative;
			background: #FFFFFF;
			box-shadow: 0rpx 8rpx 24rpx 0rpx rgba(141, 141, 141, 0.3);
			border-radius: 40rpx;
			padding-left: 10rpx;
			.line {
				position: absolute;
				top: 22rpx;
				left: 56rpx;
				width: 4rpx;
				height: 40rpx;
				background-color: rgba(216, 216, 216, 0.3);
			}
		
			.uicon-search {
				position: absolute !important;
				left: 0 !important;
				top: 10rpx !important;
			}
		
			.input {
				position: absolute;
				left: 60rpx;
				top: 0;
				width: 90%;
				height: 58rpx;
				padding: 10rpx 20rpx;
				border-radius: 40rpx;
		
			}
		
			.button {
				position: absolute;
				right: 0;
				top: 0;
				text-align: center;
				width: 202rpx;
				height: 78rpx;
				background: #025BFF;
				box-shadow: 0rpx 8rpx 24rpx 0rpx rgba(141, 141, 141, 0.3);
				border-radius: 0rpx 40rpx 40rpx 0rpx;
				font-weight: 400;
				font-size: 32rpx;
				color: #FFFFFF;
				z-index: 99;
		
			}
		}
		
		.tab {
			.u-subsection {
				font-size: 30rpx !important;
		
				.u-subsection__item__text {
					font-size: 30rpx !important;
				}
			}
		}
	}
	.leader-index {
		width: 100vw;
		overflow-x: hidden;
		overflow-y: auto;
		box-sizing: border-box;
		padding: 0rpx 22rpx;
		background: #f2f2f2;
		position: relative;
		.list {
			margin-top: 20rpx;
			font-weight: 400;
			.list_item {
				height: 312rpx;
				border-radius: 12rpx;
				opacity: 1;
				background: #FFFFFF;
				padding: 14rpx 18rpx 10rpx;
				margin-bottom: 20rpx;
				.top {
					display: flex;
					justify-content: space-between;
				}
				.middle {
					margin-top: 30rpx;
					display: flex;
					align-items: center;
					.pro_img {
						width: 168rpx;
						height: 168rpx;
						border-radius: 12rpx;
						opacity: 1;
						background: #D8D8D8;
						margin-right: 30rpx;
					}
					.pro_box {
						display: flex;
						flex: 1;
						justify-content: space-between;
					}
		
				}
				.footer {
					display: flex;
					justify-content: flex-end;
					.pro_detail {
						width: 138rpx;
						height: 46rpx;
						background: #FFFFFF;
						border-radius: 27rpx 27rpx 27rpx 27rpx;
						border: 2rpx solid #C53032;
						font-size: 24rpx;
						font-weight: 400;
						color: #C53032;
						text-align: center;
						line-height: 46rpx;
					}
				}
			}
		}
		
	}
</style>