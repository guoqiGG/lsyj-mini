<template>
	<view class="order-detail">
		<view class="order-detail-backgroundImg">
			<image src="/pages/package-user/static/order-detail.png" mode=""></image>
		</view>
		<view class="order-detail-status">
			<view class="order-detail-status-content">
				<view class="order-detail-status-content-img">
					<image src="/pages/package-user/static/order-detail-status.png" mode=""></image>
				</view>
				<view class="order-detail-status-content-text">
					买家付款
				</view>
			</view>
			<view class="order-detail-status-content">
				<view class="order-detail-status-content-status">
				</view>
				<view class="order-detail-status-content-text">
					商品发货
				</view>
			</view>
			<view class="order-detail-status-content">
				<view class="order-detail-status-content-status">
				</view>
				<view class="order-detail-status-content-text">
					交易完成
				</view>
			</view>
		</view>
		<view class="address">
			<view class="address-icon">
				！！
			</view>
			<view class="address-name">
				北京市
			</view>
			<view class="address-tel">
				1753331996
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
	.order-detail{
		width: 100vw;
		overflow-x: hidden;
		height: 100vh;
		overflow: auto;
		background: #f2f2f2;
		.order-detail-backgroundImg{
			width: 100%;
			height: 200rpx;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.order-detail-status{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.order-detail-status-content{
				width: 33%;
				height: 142px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				position: relative;
				.order-detail-status-content-text{
					font-size: 12px;
				}
			}
		}
		.order-detail-status-content-img{
			position: absolute;
			width: 15px;
			height: 15px;
			image{
				width: 100%;
				height: 100%;
			}
		}
	}

</style>
