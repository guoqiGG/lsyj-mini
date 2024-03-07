<template>
	<view class="apply-refund">
		<view class="refund-info">
			<view class="refund-info-title">订单编号：{{orderNumber}}</view>
			<u-line></u-line>
			<view class="refund-info-content">
				<view class="refund-info-content-img">

				</view>
				<view class="refund-info-content-text">
					<view class="refund-info-content-text-title">
						商品退款
					</view>
					<view class="refund-info-content-text-content">
						<view class="refund-info-content-text-content-price">
							$0.01
						</view>
						<view class="refund-info-content-text-content-number">
							1件
						</view>
					</view>

				</view>
			</view>
		</view>

		<u-cell-group>
			<u-cell title="退款方式" value="仅退款"></u-cell>
			<u-cell title="会员等级" value="拍错/多拍/不喜欢" isLink></u-cell>
		</u-cell-group>
		<u-cell-group>
			<u-cell title="退款金额" value="$0.01"></u-cell>
		</u-cell-group>
		<view class="u-form">
			<u--form labelPosition="left">
			<u-form-item labelWidth="208rpx" label="手机号码" borderBottom>
				1231231241
			</u-form-item>
			<u-form-item labelWidth="208rpx" label="退款说明" borderBottom>
				必填最多50字
			</u-form-item>
			<u-form-item labelWidth="208rpx" label="退款凭证" borderBottom>
				<u-upload
						:fileList="fileList1"
						@afterRead="afterRead"
						@delete="deletePic"
						name="1"
						multiple
						:maxCount="10"
					></u-upload>
			</u-form-item>
			

		</u--form>
		</view>
		<view class="button-style">
			退款凭证
		</view>
	</view>
</template>
<script setup>
	export default {
		data() {
			return {
				orderNumber: '1764841653610352640'
			}
		}
	}
</script>
<style lang="scss" scoped>
	.apply-refund{
		width: 100vw;
		overflow-x: hidden;
	}
	.refund-info {
		width: 375px;
		height: 174px;
		padding: 12px 10px;

		.refund-info-title {
			height: 24px;
			margin-bottom: 10px;
			font-size: 14px;
		}

		.refund-info-content {
			display: flex;
			justify-content: flex-start;

			.refund-info-content-img {
				width: 80px;
				height: 80px;
			}

			.refund-info-content-text {
				.refund-info-content-text-title {
					font-size: 14px;
				}
			}
		}

		
	}
	.u-form{
		margin-top: 200rpx;
		margin-left: 20rpx;
	}
	.button-style{
		width: 710rpx;
		height: 92rpx;
		background: #F81A19;
		font-size: 28rpx;
		line-height: 92rpx;
		color: #FFFFFF;
		text-align: center;
		border-radius: 12rpx;
		margin-left: 20rpx;
		margin-top: 20rpx;
		
	}
	
</style>