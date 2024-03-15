<template>
	<view class="apply-refund">
		<view class="refund-info">
			<view class="refund-info-title">订单编号：{{orderNumber}}</view>
			<u-line></u-line>
			<view class="refund-info-content">
				<view class="refund-info-content-img">
					<image style="width: 100%;height: 100%;border-radius: 14rpx;" :src="orderDetail.orderGoods[0].thumbail" mode=""></image>
				</view>
				<view class="refund-info-content-text">
					<view class="refund-info-content-text-title">
						商品退款
					</view>
					<view class="refund-info-content-text-content">
						<view class="refund-info-content-text-content-price" >
							<text style="color: #C53032;font-size: 32rpx;">￥{{orderDetail.orderGoods[0].salePrice}}</text>
							<text style="margin-left: 14rpx;color: #979797;font-size: 24rpx;">{{orderDetail.goodsCount}}件</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<u-cell-group>
			<u-cell title="退款方式" value="仅退款"></u-cell>
			<u-cell title="退款原因" value="拍错/多拍/不喜欢" isLink></u-cell>
		</u-cell-group>
		<u-cell-group>
			<u-cell title="退款金额" :value="orderDetail.totalAmount"></u-cell>
		</u-cell-group>
		<view class="u-form">
			<u--form labelPosition="left">
				<u-form-item labelWidth="208rpx" label="手机号码" borderBottom>
					<input class="" placeholder="请输入手机号码" type="text" :value="orderDetail.userPhone" maxlength="11"
					  @input="onAddrInput" />
					<!-- {{orderDetail.userPhone}} -->
				</u-form-item>
				<u-form-item labelWidth="208rpx" label="退款说明" borderBottom>
					<input class="" placeholder="必填最多50字" type="text" value="" maxlength="50"
					  @input="onAddrInput" />
				</u-form-item>
				<u-form-item labelWidth="208rpx" label="退款凭证" borderBottom>
					<u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" name="1" multiple
						:maxCount="10"></u-upload>
				</u-form-item>


			</u--form>
		</view>
		<view class="button-style" @click="applyRefund">
			退款凭证
		</view>
	</view>
</template>
<script setup>
	const http = require("@/utils/http");
	export default {
		data() {
			return {
				orderNumber: null,
				loginToken: null,
				orderDetail: null,
			}
		},
		onLoad(option) {
			if (option.orderId) {
				this.orderNumber = option.orderId
				let bbcLoginResult = uni.getStorageSync("bbcLoginResult"); //用户信息
				this.loginToken = bbcLoginResult.loginToken
				this.getOrderDetail()
			}
		},
	
		methods: {
			getOrderDetail() {
				let obj = {
					orderId: this.orderNumber,
					loginToken: this.loginToken,
				}
				const params = {
					url: "/pub/order/detail",
					method: "POST",
					data: {
						sign: 'qcsd',
						data: JSON.stringify(obj),
					},
					callBack: (res) => {
						this.orderDetail = res
						console.log(254325)
					},
				}
				http.request(params);

			},
			applyRefund(){
				let obj = {
					orderId: this.orderId,
					loginToken: this.loginToken,
				}
				const params = {
					url: "/pub/order/apply/refund",
					method: "POST",
					data: {
						sign: 'qcsd',
						data: JSON.stringify(obj),
					},
					callBack: (res) => {
						uni.showToast({
						  title: "申请成功~",
						  icon: "none",
						});
					},
				}
				http.request(params);
			}
		}
	}
</script>
<style lang="scss" scoped>
	.apply-refund {
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
			padding: 48rpx 32rpx ;

			.refund-info-content-img {
				margin-right: 16rpx;
				width: 160rpx;
				height: 160rpx;
				border-radius: 14rpx;
			}

			.refund-info-content-text {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.refund-info-content-text-title {
					font-size: 14px;
				}
			}
		}


	}

	.u-form {
		margin-top: 200rpx;
		margin-left: 20rpx;
	}

	.button-style {
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