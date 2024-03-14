<template>
	<view class="waterfall">
		<uv-waterfall ref="waterfall" v-model="list" :add-time="10" :left-gap="leftGap" :right-gap="rightGap"
			:column-gap="columnGap" @changeList="changeList">
			<!-- 第一列数据 -->
			<template v-slot:list1>
				<!-- 为了磨平部分平台的BUG，必须套一层view -->
				<view>
					<view v-for="(item, index) in list1" :key="item.id" class="waterfall-item">
						<view class="waterfall-item__image">
							<image src="/static/allow.png" mode="widthFix"></image>
						</view>
						<view class="waterfall-item__ft">
							<view class="waterfall-item__ft__title">
								<text class="value">{{ item.total }}</text>
							</view>
							<view class="waterfall-item__ft__desc uv-line-2">
								<text class="value">{{ item.typeStr }}</text>
							</view>
						</view>
					</view>
				</view>
			</template>
			<!-- 第二列数据 -->
			<template v-slot:list2>
				<!-- 为了磨平部分平台的BUG，必须套一层view -->
				<view>
					<view v-for="(item, index) in list2" :key="item.id" class="waterfall-item">
						<view class="waterfall-item__image">
							<image src="/static/allow.png" mode="widthFix"></image>
						</view>
						<view class="waterfall-item__ft">
							<view class="waterfall-item__ft__title">
								<text class="value">{{ item.total }}</text>
							</view>
							<view class="waterfall-item__ft__desc uv-line-2">
								<text class="value">{{ item.typeStr }}</text>
							</view>
						</view>
					</view>
				</view>
			</template>
		</uv-waterfall>
	</view>
</template>
<script>
import http from "@/utils/http"
export default {
	data() {
		return {
			list: [],// 瀑布流全部数据
			list1: [],// 瀑布流第一列数据
			list2: [],// 瀑布流第二列数据
			leftGap: 10,
			rightGap: 10,
			columnGap: 10,
			pageSize: 20,
			current: 1
		}
	},
	computed: {
		imageStyle(item) {
			return item => {
				const v = uni.upx2px(750) - this.leftGap - this.rightGap - this.columnGap;
				const w = v / 2;
				const rate = w / item.w;
				const h = rate * item.h;
				return {
					width: w + 'px',
					height: h + 'px'
				}
			}
		}
	},

	async onLoad() {
		this.getData()
	},
	methods: {
		// 这点非常重要：e.name在这里返回是list1或list2，要手动将数据追加到相应列
		changeList(e) {
			this[e.name].push(e.value);
		},

		// 模拟的后端数据
		getData() {
			const params = {
				url: '/video/get/list?pageSize=' + this.pageSize + '&pageNo=' + this.current,
				method: 'GET',
				callBack: function (res) {
					console.log(res)
					this.list = res.list
					this.list1 = res.list
					this.list2 = res.list
					console.log(this.list1)
					console.log(this.list2)
				}
			}
			http.request(params)
		}
	}
}
</script>
<style>
page {
	background: #f1f1f1;
}
</style>

<style scoped lang="scss">
$show-lines: 1;
@import '@/uni_modules/uv-ui-tools/libs/css/variable.scss';

.waterfall-item {
	overflow: hidden;
	margin-top: 10px;
	border-radius: 6px;
}

.waterfall-item__ft {
	padding: 20rpx;
	background: #fff;

	&__title {
		margin-bottom: 10rpx;
		line-height: 48rpx;
		font-weight: 700;

		.value {
			font-size: 32rpx;
			color: #303133;
		}
	}

	&__desc .value {
		font-size: 28rpx;
		color: #606266;
	}

	&__btn {
		padding: 10px 0;
	}
}
</style>