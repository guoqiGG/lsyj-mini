<template>
	<view class="withdrawal">
		<view class="withdrawal-tit">
			<view class="withdrawal-tit-lf">
				提现方式
			</view>
			<view class="withdrawal-tit-rt">
				财务打款
			</view>
			
		</view>
		<view class="withdrawal-cot">
			<view class="withdrawal-cot-tit">
				提现金额
			</view>
			<view class="withdrawal-cot-cot">
				<view class="withdrawal-cot-cot-lf">
					¥
				</view>
				<view class="withdrawal-cot-cot-middle">
					 <u--input
					    :placeholder="withdrawalNumberPlaceholder"
					    border="surround"
					    v-model="withdrawalNumber"
					  ></u--input>
				</view>
				<view class="withdrawal-cot-cot-rt" @click="allWithdrawals()">
					全部提现
				</view>
			</view>
			<view class="withdrawal-cot-subscribe">
				提现需要T＋3审核，请耐心等待
			</view>
		</view>
		<view class="withdrawal-btn">
			<u-button style="font-size: 40rpx;" @click="onSubmitApplyWithdrawal()" text="确认提现"></u-button>
		</view>
		<view class="withdrawal-text">
			<view class="withdrawal-text-cot">
				注意事项：
			</view>
			<view class="withdrawal-text-cot">
				1.单次提现不得低于1元
			</view>
			<view class="withdrawal-text-cot">
				2.单次提现额度不得高于20000元
			</view>
			<view class="withdrawal-text-cot">
				3.每个用户每月有1次提现机会
			</view>
			<view class="withdrawal-text-cot">
				4.预计处理需要1-5个工作日
			</view>
		</view>
		
	</view>
</template>

<script>
	const http = require("@/utils/http");
	export default {
		data() {
			return {
				withdrawalNumberPlaceholder:'可提现金额￥',
				withdrawalNumber:null,
				withdrawable:null,
				userId:null,
			}
		},
		onLoad(option){
			if(option.withdrawable){
				this.withdrawable=option.withdrawable
				this.withdrawalNumberPlaceholder+=this.withdrawable
			}
			let bbcUserInfo =uni.getStorageSync("bbcUserInfo"); //用户信息
			this.userId=bbcUserInfo.id
		},
		
		methods: {
			onSubmitApplyWithdrawal(){
				console.log(this.withdrawalNumber)
				let obj = {
				        userId: this.userId,
						amount:this.withdrawalNumber
				    }
					console.log(obj,'obj====>')
				    const params = {
				        url: "/pub/leader/apply/withdrawal",
				        method: "POST",
				        data: {
				            sign: 'qcsd',
				            data: JSON.stringify(obj),
				        },
				        callBack: (res) => {
							uni.showModal({
								content:"提现申请已提交",
								confirmText:'确定',
								showCancel: false,
							})
				        },
				    }
				    http.request(params);
				// uni.showModal({
				// 	content:"提现申请已提交",
				// 	confirmText:'确定',
				// 	showCancel: false,
				// })
			},
			allWithdrawals(){
				this.withdrawalNumber=this.withdrawable
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/ .u-input{
		border: 1px solid transparent !important;
	}
.withdrawal{
	width: 100vw;
	height: 100vh;
	overflow-x: hidden;
	overflow-y: auto;
	box-sizing: border-box;
	padding:18rpx 10rpx;
	background: #f2f2f2;
	.withdrawal-tit{
		width: 710rpx;
		height: 112rpx;
		border-radius: 12rpx;
		opacity: 1;
		box-sizing: border-box;
		padding:32rpx 44rpx;
		background: #FFFFFF;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.withdrawal-tit-lf{
			font-size: 36rpx;
			color: #101010;
		}
		.withdrawal-tit-rt{
			font-size: 28rpx;
			color: #101010;
		}
	}
	.withdrawal-cot{
		margin-top: 20rpx;
		width: 710rpx;
		height: 342rpx;
		border-radius: 12rpx;
		background: #FFFFFF;
		box-sizing: border-box;
		padding: 30rpx 44rpx;
		.withdrawal-cot-tit{
			font-size: 36rpx;
			color: #101010;
		}
		.withdrawal-cot-cot{
			margin-top: 68rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.withdrawal-cot-cot-lf{
				font-size: 28rpx;
			}
			.withdrawal-cot-cot-rt{
				font-size: 28rpx;
				color: #C53032;
			}
		}
		
		.withdrawal-cot-subscribe{
			margin-top: 40rpx;
			box-sizing: border-box;
			width: 624rpx;
			height: 50rpx;
			border-radius: 4rpx;
			opacity: 1;
			line-height: 50rpx;
			background: #F4F4F4;
			font-size: 24rpx;
			color: #979797;
			padding-left: 22rpx;
		}
	}
	
	.withdrawal-btn{
		margin-top: 34rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		/deep/ .u-button{
			width: 638rpx !important;
			height: 102rpx !important;
			border-radius: 12rpx !important;
			background: #C53032 !important;
			color: #FFFFFF;
		}
		/deep/ .u-button__text{
			font-size: 40rpx !important;
		}
			
		
	}
	.withdrawal-text{
		margin-top: 40rpx;
		box-sizing: border-box;
		padding-left: 36rpx;
		
		.withdrawal-text-cot{
			font-size: 26rpx;
			margin-bottom: 20rpx;
			color: #9E9E9E;
		}
	}
	
}
</style>
