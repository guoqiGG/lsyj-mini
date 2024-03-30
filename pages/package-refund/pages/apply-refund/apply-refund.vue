<template>
	<view class="apply-refund">
		<view class="refund-info">
			<view class="refund-info-title">订单编号：{{orderNumber}}</view>
			<u-line></u-line>
			<view class="refund-info-content">
				<view class="refund-info-content-img">
					<image style="width: 100%;height: 100%;border-radius: 14rpx;"
						:src="orderDetail.orderGoods[0].thumbail" mode=""></image>
				</view>
				<view class="refund-info-content-text">
					<view class="refund-info-content-text-title">
						商品退款
					</view>
					<view class="refund-info-content-text-content">
						<view class="refund-info-content-text-content-price">
							<text
								style="color: #C53032;font-size: 32rpx;">￥{{orderDetail.orderGoods[0].salePrice}}</text>
							<text
								style="margin-left: 14rpx;color: #979797;font-size: 24rpx;">{{orderDetail.goodsCount}}件</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<u-cell-group>
			<u-cell title="退款方式" value="退货退款"  ></u-cell>
			<u-cell title="退款原因" :value="refundReason" isLink @click="pickerMethod()"></u-cell>
		</u-cell-group>
		<u-cell-group>
			<u-cell title="退款金额" :value="orderDetail.totalAmount"></u-cell>
		</u-cell-group>
		<view class="u-form">
			<u--form labelPosition="left">
				<u-form-item labelWidth="208rpx" label="手机号码" borderBottom>
					<input class="" placeholder="请输入手机号码" type="text" :value="orderDetail.userPhone" maxlength="11" />
				</u-form-item>
				<u-form-item labelWidth="208rpx" label="退款说明" borderBottom>
					<input class="" placeholder="必填最多50字" type="text" :value="remark" maxlength="50"
						@input="onAddrInput" />
				</u-form-item>
				<u-form-item labelWidth="208rpx" label="退款凭证" borderBottom>
					<u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" name="1" multiple
						:maxCount="10"></u-upload>
				</u-form-item>
			</u--form>
		</view>
		<view class="button-style" @click="applyRefund">
			确定
		</view>
		<u-picker :show="show" :defaultIndex="defaultIndex" :columns="columns" @confirm="confirm"
			@cancel="show= false"></u-picker>
	
	</view>
</template>
<script setup>
	const http = require("@/utils/http");
	const config = require("@/utils/config.js"); // 统一的网络请求方法
	export default {
		data() {
			return {
				fileList1: [],
				defaultIndex: [0],
				show: false,
				columns: [
					['拍错', '协商一致退款', '其他']
				],
				orderNumber: null,
				loginToken: null,
				userId: null,
				orderDetail: null,
				refundReason: "拍错", //退款原因
				remark: null, //备注
				
			}
		},
		onLoad(option) {
			if (option.orderId) {
				this.orderNumber = option.orderId
				let bbcLoginResult = uni.getStorageSync("bbcLoginResult"); //用户信息
				this.loginToken = bbcLoginResult.loginToken
				this.userId = bbcLoginResult.id
				this.getOrderDetail()
			}
		},

		methods: {
			// 获取商品详情
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
						
					},
				}
				http.request(params);
			
			},
			// 退款
			applyRefund() {
				let pics=[]
				this.fileList1.map(item=>{
					pics.push(item.url)
				})
				let obj = {
					loginToken: this.loginToken,
					orderId: this.orderNumber,
					userId: this.userId,
					refundReason: Number(this.defaultIndex)+1,
					remark: this.remark,
					pics:pics,
					refundGoods:[{goodsId:this.orderDetail.orderGoods[0].goodsId,number:this.orderDetail.goodsCount}]
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
						uni.navigateTo({
							url: `/pages/package-user/pages/order-list/order-list?id=` + 0
						})
					},
				}
				http.request(params);
			},
			
			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			// 新增图片
			async afterRead(event) {
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					let item = this[`fileList${event.name}`][fileListLen]
					this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					fileListLen++
				}
			},
			uploadFilePromise(url) {
				let httpurl=config.domain+"/upload/oss"
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: config.domain+"/upload/oss", // 仅为示例，非真实的接口地址
						filePath: url,
						name: 'file',
						formData: {
							user: 'test'
						},
						success: (res) => {
							setTimeout(() => {
								resolve(res.data)
							}, 1000)
						}
					});
				})
			},
			// 退款原因
			pickerMethod() {
				this.show = true
			},
			// picker确定按钮
			confirm(e) {
				this.defaultIndex = e.indexs[0]
				this.refundReason = e.value[0]
				this.show = false
			},
			// 退款说明
			onAddrInput(e) {
				this.remark = e.detail.value
			},
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
			padding: 48rpx 32rpx;

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