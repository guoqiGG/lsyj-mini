<template>
	<view class="apply-leader">
		<u--form labelPosition="left" :model="state" ref="uForm">
			<u-form-item prop="name" ref="item1">
				<u--input v-model="state.name" placeholder="请输入内容" border="surround"></u--input>
			</u-form-item>
			<u-form-item prop="name" ref="item1">
				<u--input v-model="state.name" placeholder="请输入内容" border="surround"></u--input>
			</u-form-item>
			<u-form-item prop="name" ref="item1">
				<u--input v-model="state.name" placeholder="请输入内容" border="surround"></u--input>
			</u-form-item>
		</u--form>

		<view class="store">
			<view class="isStore" @click="isStoreClick()" :class="{'store-border':isStore}">
				<view class="tit">
					有实体门店
				</view>
				<view class="cot">
					如便利店、快递站点等
				</view>
				<view :class="{'triangle':isStore}"></view>
				<view class="icon">
					<u-icon name="checkbox-mark" color="#fff" size="25"></u-icon>
				</view>
			</view>
			<view class="isStore" :class="{'store-border':!isStore}" @click="isNotStoreClick()">
				<view class="tit">
					无实体门店
				</view>
				<view class="cot">
					如小区、住宅等
				</view>
				<view :class="{'triangle':!isStore}"></view>
				<view class="icon">
					<u-icon name="checkbox-mark" color="#fff" size="25"></u-icon>
				</view>
			</view>

		</view>
		<u--form v-if="isStore" labelPosition="left" :model="state" ref="uForm">
			<u-form-item prop="name" ref="item1">
				<u--input v-model="state.name" placeholder="地址" border="surround"></u--input>
			</u-form-item>
			<u-form-item prop="name" ref="item1">
				<u--input v-model="state.name" placeholder="自提点" border="surround"></u--input>
			</u-form-item>
			</u-form-item>
		</u--form>
		<u-button type="primary" text="确定"></u-button>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				state: {
					tel: '',
					name: '',
					userNumber: '',
					address: '',
					selfAddress: ''
				},
				isStore: true
			}
		},
		methods: {
			isStoreClick() {
				this.isStore = true
			},
			isNotStoreClick() {
				this.isStore = false
			}

		}
	}
</script>
<style lang="less" scoped>
	/deep/ .u-input__content {
		width: 710rpx !important;
		height: 94rpx !important;
		border-radius: 4rpx !important;
		background: #FFFFFF !important;
		padding-left: 34rpx;
		box-sizing: border-box;
	}

	/deep/ .u-input {
		padding: 0 !important;
	}

	/deep/ .u-button {
		margin-top: 40rpx !important;
		width: 710rpx !important;
		height: 94rpx !important;
		border-radius: 4rpx !important;
		opacity: 1;

		/* 02 */
		background: #025BFF !important;
	}

	.apply-leader {
		width: 100vw;
		height: 100vh;
		overflow-x: hidden;
		overflow-y: auto;
		box-sizing: border-box;
		padding: 38rpx 20rpx;
		background: #f2f2f2;

		.store {
			display: flex;
			justify-content: space-between;

			.isStore {
				width: 338rpx;
				height: 182rpx;
				opacity: 1;
				box-sizing: border-box;
				background: #FFFFFF;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				border-radius: 8rpx;
				position: relative;

				.tit {
					font-size: 28rpx;

					line-height: 48rpx;
					text-align: center;

					color: #101010;
				}

				.cot {
					font-size: 22rpx;
					font-weight: normal;
					line-height: 48rpx;
					text-align: center;
					letter-spacing: 0rpx;

					font-variation-settings: "opsz" auto;
					color: #9E9E9E;
				}


			}

			.store-border {
				border: 4rpx solid #025BFF;
			}

			.triangle {
				position: absolute;
				top: 0;
				right: 0;
				width: 0;
				height: 0;
				border-top: 40rpx solid transparent;
				/* 顶部透明 */
				border-right: 40rpx solid #025BFF;
				/* 右边蓝色 */
				transform: rotate(270deg);
				/* 旋转45度，使其为直角三角形 */
			}

			.icon {
				position: absolute;
				top: 0;
				right: 0;
			}
		}

	}
</style>