<template>
	<view class="order-list">
		<u-tabs :scrollable="false" :list="list1" @click="click"></u-tabs>
		<view class="order-list-content">
			<view class="order-list-content-box">
				<view class="order-list-content-box-title">
					<view class="order-list-content-box-title-left">
						订单编号：1764841653610352640
					</view>
					<view class="order-list-content-box-title-right">
						待发货
					</view>
				</view>
				<view class="order-list-content-box-content" @click="goOrderDetail()">
					<view class="order-list-content-box-content-img">
						
					</view>
					<view class="order-list-content-box-content-text">
						<view class="title">
							测试限购
						</view>
						<view class="price">
							<view class="price-number">
								0.01
							</view>
							<view class="price-amount">
								X1
							</view>

						</view>
					</view>
				</view>
				<view class="order-list-content-box-count">
					共1件商品 总计：0.01
				</view>
			</view>
			<view class="order-list-content-box">
				<view class="order-list-content-box-title">
					<view class="order-list-content-box-title-left">
						订单编号：1764841653610352640
					</view>
					<view class="order-list-content-box-title-right">
						待发货
					</view>
				</view>
				<view class="order-list-content-box-content">
					<view class="order-list-content-box-content-img">
						
					</view>
					<view class="order-list-content-box-content-text">
						<view class="title">
							测试限购
						</view>
						<view class="price">
							<view class="price-number">
								0.01
							</view>
							<view class="price-amount">
								X1
							</view>
			
						</view>
					</view>
				</view>
				<view class="order-list-content-box-count">
					共1件商品 总计：0.01
				</view>
			</view>
			
		</view>
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				list1: [{
					name: '全部',
				}, {
					name: '待付款',
				}, {
					name: '待发货'
				}, {
					name: '待收货'
				}, {
					name: '已完成'
				}]
			}
		},
		methods: {
			goOrderDetail(){
				uni.navigateTo({
					url:'/pages/package-user/pages/order-detail/order-detail'
				})
			}

		}
	}
</script>

<style lang="scss" scoped>
	.order-list{
		background: #f2f2f2;
		height: 100vh;
		width: 100vw;
		overflow-x: hidden;
		overflow-y: auto;
	}
.order-list-content{
	.order-list-content-box{
		background: #fff;
		margin-top: 20rpx;
		width: 750rpx;
		height: 398rpx;
		box-sizing: border-box;
		padding: 18rpx 22rpx;
	}
	.order-list-content-box-title{
		display: flex;
		justify-content: space-between;
	}
	.order-list-content-box-content{
		display: flex;
			.order-list-content-box-content-img{
				width: 220rpx;
				height: 220rpx;
			}
			.order-list-content-box-content-text{
				margin-top: 62rpx;
				.title{
					font-size: 32rpx;
				}
				.price{
					width: 474rpx;
					display: flex;
					justify-content: space-between;
					margin-top: 20rpx;
					font-size: 24rpx;
					
				}
			}
	}
	.order-list-content-box-count{
		margin-top: 18rpx;
		display: flex;
		justify-content: flex-end;
	}
}
</style>