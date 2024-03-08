<template>
	<view class="submit-order">
		<view class="submit-order-background">

		</view>
		<view class="submit-order-index">
			<view v-if="!express" class="submit-order-index-express">
				<view class="submit-order-index-express-title">
					邮寄到家
				</view>
				<view class="submit-order-index-express-content">
					<view class="submit-order-index-express-content-address">
						北京市市辖区东城区哦呦呦
					</view>
					<view class="submit-order-index-express-content-info">
						<view class="info-name">
							呃呃呃
						</view>
						<view class="info-tel">
							17533339999
						</view>

					</view>
					<view class="submit-order-index-express-content-line">

					</view>
					<view class="submit-order-index-express-content-ex">
						<view class="express-type">
							配送方式
						</view>
						<view class="send-express">
							快递配送
						</view>
					</view>
				</view>
			</view>
			<view v-if="express" class="submit-order-index-not-express">
				<view class="submit-order-index-not-express-title">
					到店自提
				</view>
				<view class="submit-order-index-not-express-content">
					<view class="not-express-info">
						<view class="not-express-info-tel">
							<view class="title">
								自提点
							</view>
							<view class="addressName">
								骑士美梦安全屋
							</view>
							<view class="tel">
								18422233395
							</view>
						</view>
						<view class="not-express-info-address">
							河南省郑州市管城回族区紫荆山路101号 荣汇国际
						</view>
					</view>
					<view class="submit-order-index-not-express-content-line">

					</view>
					<view class="submit-order-index-not-express-content-input">
						<u--input placeholder="姓名" v-model="name"></u--input>
						<u--input placeholder="电话" v-model="tel"></u--input>
					</view>
				</view>
			</view>

			<view class="submit-order-comodity-info">
				<view class="submit-order-comodity-info-tit">
					<view class="image">

					</view>
					<view class="text">
						<view class="text-title">
							蛋白修护
						</view>
						<view class="text-cot">
							<view class="text-cot-price">
								￥39.90
							</view>
							<view class="text-cot-amount">
								×1
							</view>
						</view>
					</view>

				</view>
				<view class="submit-order-comodity-info-line"></view>
				<view class="submit-order-comodity-info-express">
					<view class="submit-order-comodity-info-express-left">
						配送费用：
					</view>
					<view class="submit-order-comodity-info-express-right">
						￥0.00
					</view>
				</view>
				<view class="submit-order-comodity-info-line"></view>
				<view class="submit-order-comodity-info-order-remark">
					<view class="submit-order-comodity-info-order-remark-left">
						订单备注：
					</view>
					<view class="submit-order-comodity-info-order-remark-right">
						选填
					</view>

				</view>

			</view>

			<view class="submit-order-coupon">
				<view class="submit-order-coupon-select">
					<view class="submit-order-coupon-select-left">
						平台优惠券：
					</view>
					<view class="submit-order-coupon-select-button">

					</view>

				</view>
				<view class="submit-order-coupon-amount-price">
					<view class="submit-order-coupon-amount-price-left">
						商品总额：
					</view>
					<view class="submit-order-coupon-amount-price-right">
						￥39.90
					</view>
				</view>
				<view class="submit-order-coupon-express-price">
					<view class="submit-order-coupon-express-price-left">
						商品运费：
					</view>
					<view class="submit-order-coupon-express-price-right">
						￥0.00
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
				express: true,
				name: '',
				tel: ''

			}
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.submit-order {
		width: 100vw;
		height: 100vh;
		overflow-x: hidden;
		overflow-y: auto;

		background: #f2f2f2;
		position: relative;

		.submit-order-background {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 760rpx;
			background: linear-gradient(180deg, #025BFF 0%, #F2F2F2 90%);
			z-index: 2;
		}

		.submit-order-index {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 3;
			box-sizing: border-box;
			padding: 40rpx 20rpx;

			.submit-order-index-express {
				.submit-order-index-express-title {
					margin-left: 166rpx;
					width: 378rpx;
					height: 66rpx;
					border-radius: 33rpx;
					opacity: 1;
					text-align: center;
					line-height: 66rpx;
					background: #FFFFFF;
					font-size: 32rpx;
					color: #025BFF;
				}

				.submit-order-index-express-content {
					margin-top: 32rpx;
					width: 710rpx;
					height: 268rpx;
					border-radius: 8rpx;
					background: #FFFFFF;
					padding: 40rpx 20rpx;
					box-sizing: border-box;

					.submit-order-index-express-content-address {
						font-size: 26rpx;
						margin-left: 20rpx;
						color: #101010;
					}

					.submit-order-index-express-content-info {
						font-size: 22rpx;
						margin: 20rpx;
						color: #101010;
						display: flex;
						justify-content: flex-start;

						.info-tel {
							margin-left: 10rpx;
						}
					}

					.submit-order-index-express-content-line {
						width: 670rpx;
						height: 0rpx;
						opacity: 1;
						margin: 30rpx 0;
						border: 2rpx solid #E6E6E6;
					}

					.submit-order-index-express-content-ex {
						box-sizing: border-box;
						padding: 0 20rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						font-size: 26rpx;
						color: #101010;
					}

				}

			}

			.submit-order-index-not-express {

				.submit-order-index-not-express-title {
					margin-left: 166rpx;
					width: 378rpx;
					height: 66rpx;
					border-radius: 33rpx;
					opacity: 1;
					text-align: center;
					line-height: 66rpx;
					background: #FFFFFF;
					font-size: 32rpx;
					color: #025BFF;
				}

				.submit-order-index-not-express-content {
					width: 710rpx;
					border-radius: 8rpx;
					opacity: 1;

					background: #FFFFFF;
					margin-top: 32rpx;
					box-sizing: border-box;
					padding: 16rpx 20rpx;

					.not-express-info {
						.not-express-info-tel {
							margin-left: 14rpx;
							display: flex;
							justify-content: flex-start;
							align-items: center;

							.title {
								font-size: 32rpx;
								font-weight: 600;
								color: #101010;
							}

							.addressName {
								font-size: 28rpx;
								margin: 0 16rpx;
								color: #101010;
							}
						}
					}

					.not-express-info-address {
						width: 500rpx;
						margin-left: 126rpx;
						font-size: 28rpx;
						color: #101010;
						white-space: wrap;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
						overflow: hidden;
						text-overflow: ellipsis;
						margin-top: 10rpx;
						line-height: 50rpx;
					}
				}

				.submit-order-index-not-express-content-line {
					margin-top: 30rpx;
					width: 670rpx;
					height: 0rpx;
					opacity: 1;

					border: 2rpx solid #E6E6E6;
				}

				.submit-order-index-not-express-content-input {
					margin-top: 30rpx;

					/deep/ .u-input__content {
						width: 654rpx !important;
						height: 78rpx !important;
						border-radius: 39rpx !important;
						opacity: 1;

						background: #F6F6F6 !important;
						box-sizing: border-box;
						padding-left: 48rpx;
					}

					/deep/ .u-input {
						border: 0rpx solid transparent !important;
					}
				}
			}

			.submit-order-comodity-info {
				margin-top: 20rpx;
				width: 710rpx;
				height: 440rpx;
				border-radius: 8rpx;
				opacity: 1;
				box-sizing: border-box;
				padding: 20rpx;
				background: #FFFFFF;

				.submit-order-comodity-info-tit {
					display: flex;
					justify-content: flex-start;

					.image {
						width: 200rpx;
						height: 200rpx;
						border-radius: 8rpx;
						opacity: 1;
						background: #D8D8D8;

						image {
							width: 100%;
							height: 100%;
						}
					}

					.text {
						margin-left: 20rpx;

						.text-title {
							font-size: 32rpx;
							line-height: 48rpx;
							color: #101010;
						}

						.text-cot {
							width: 442rpx;
							margin-top: 112rpx;
							display: flex;
							justify-content: space-between;

							.text-cot-price {
								font-size: 18;
								color: #C53032;
							}

							.text-cot-amount {
								font-size: 24rpx;
								line-height: 40rpx;
								color: #9E9E9E;
							}
						}
					}
				}

				.submit-order-comodity-info-line {
					margin-top: 20rpx;
					width: 670rpx;
					height: 0rpx;
					opacity: 1;

					border: 2rpx solid #E6E6E6;
				}

				.submit-order-comodity-info-express {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-top: 26rpx;

					.submit-order-comodity-info-express-left {
						font-size: 32rpx;
						color: #101010;
					}

					.submit-order-comodity-info-express-right {
						font-size: 24rpx;
						color: #9E9E9E;
					}
				}

				.submit-order-comodity-info-order-remark {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					margin-top: 26rpx;

					.submit-order-comodity-info-order-remark-left {
						font-size: 32rpx;
						color: #101010;
					}

					.submit-order-comodity-info-order-remark-right {}
				}

			}
  
            .submit-order-coupon{
				width: 355px;
				border-radius: 4px;
				opacity: 1;
				background: #FFFFFF;
				box-sizing: border-box;
				padding:8px 10px ;
			}
         

		}

	}
</style>