<template>
	<view class="content">
           asd123
		   <swiper 
		   circular="true"
		   :indicator-dots="true" 
		   :autoplay="true" 
		   :interval="3000" 
		   :duration="1000">
		   <block v-for="(item, seq) in indexImgs" :key="seq">
			   <swiper-item class="banner-item">
			   	<view class="img-box">
					<img :src="item.imgUrl" alt="" />
				</view>
			   </swiper-item>
		   </block>
		   </swiper>
		   <view class="middle">
		   	<view class="convert" @click="goConvert()">
				<view class="convert-title">
					青春豆兑换区
				</view>
				<view class="convert-sub">
					福利多多
				</view>
				<view class="convert-go-pic">
					<view class="convert-go">
					    GO>
					</view>
					<view class="convert-pic">
						<image src="/static/index-convert.png" alt="" />
					</view>
				</view>
				
		   	</view>
		   	<view class="singIn">
		   		<view class="singIn-title">
		   			签到
		   		</view>
		   		<view class="singIn-sub">
		   			签到有礼
		   		</view>
		   		<view class="singIn-go-pic">
		   			<view class="singIn-go">
		   			    GO>
		   			</view>
		   			<view class="singIn-pic">
		   				<image src="/static/index-signIn.png" alt="" />
		   			</view>
		   		</view>
		   	</view>
		   </view>
		   <view class="sponsored-ad">
			   <view class="sponsored-ad-title">
			   	    赞助广告
			   </view>
			   <view class="sponsored-ad-content-box">
			   	<view class="sponsored-ad-content">
			   	
			   </view>
			   </view>
			   
		   	
		   </view>
		  <!-- <view class="">
		   	{{text}}1
		   </view> -->
		   
	</view>
</template>

<script>
	import {mapGetters,mapState} from 'vuex'
	export default {
		data() {
			return {
				title: 'Hello',
				indexImgs:[
					{
						imgUrl:'https://qingchuntai2.oss-cn-beijing.aliyuncs.com/2024/02/20/1.jpg',
						id:1
					},
					{
						imgUrl:'https://qingchuntai2.oss-cn-beijing.aliyuncs.com/2024/02/20/2.jpg',
						id:2
					},
					{
						imgUrl:'https://qingchuntai2.oss-cn-beijing.aliyuncs.com/2024/02/20/3.jpg',
						id:3
					},
					{
						imgUrl:'https://qingchuntai2.oss-cn-beijing.aliyuncs.com/2024/02/20/4.jpg',
						id:4
					},
				],
			}
		},
		computed:{
			// ...mapState('user',['text'])
		},
		onLoad() {

		},
		methods: {
			goConvert(){
				uni.navigateTo({
					url:'/pages/youth-bean-center/youth-bean-center'
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.content{
		// width: 700rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
		height: 100vh;
		background: #e6e6e6;
		overflow-x:hidden;
	}
swiper {
  width: 710rpx;
  height: 320rpx;
  overflow: hidden;
  // margin: 0 30rpx;
}
.middle{
	display: flex;
	justify-content:space-between;
	align-items: center;
	margin-top: 20rpx;
	.convert{
		background: linear-gradient(270deg, #BCD73A 0%, #43C944 96%);;
		width: 346rpx;
		height: 294rpx;
        border-radius: 8rpx;
		box-sizing: border-box;
		padding: 14rpx 22rpx;
		.convert-title{
			font-size: 36rpx;
			color: #FFFFFF;
		}
		.convert-sub{
			font-size: 22rpx;
			color: #FFFFFF;
		}
		.convert-go-pic{
			display: flex;
			justify-content: space-between;
			width: 320rpx;
			height: 196rpx;
			.convert-go{
				margin-top: 114rpx;
				width: 112rpx;
				height: 62rpx;
				background: #fff;
				border-radius: 30rpx;
				color: #AAD53D;
				line-height: 62rpx;
				text-align: center;
			}
			.convert-pic{
				box-sizing: border-box;
				width: 196rpx;
				height: 196rpx;
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
	}
	.singIn{
		background: linear-gradient(270deg, #F1C33C 0%, #FE8206 100%);
		width: 346rpx;
		height: 294rpx;
		border-radius: 8rpx;
		box-sizing: border-box;
		padding: 14rpx 22rpx;
		.singIn-title{
			font-size: 36rpx;
			color: #FFFFFF;
		}
		.singIn-sub{
			font-size: 22rpx;
			color: #FFFFFF;
		}
		.singIn-go-pic{
			display: flex;
			justify-content: space-between;
			width: 320rpx;
			height: 196rpx;
			.singIn-go{
				margin-top: 114rpx;
				width: 112rpx;
				height: 62rpx;
				background: #fff;
				border-radius: 30rpx;
				color: #FD8307;
				line-height: 62rpx;
				text-align: center;
			}
			.singIn-pic{
				box-sizing: border-box;
				width: 196rpx;
				height: 196rpx;
				image{
					width: 120%;
					height: 120%;
				}
			}
		}
	}

}
    .sponsored-ad{
		width: 710rpx;
		margin-top: 20rpx;
		background: #FFFFFF;
		.sponsored-ad-title{
			background: linear-gradient(270deg, #86AFFF 0%, #045BFF 100%);
			height: 86rpx;
			box-sizing: border-box;
			padding: 22rpx 24rpx;
			color: #FFFFFF;
		}
		.sponsored-ad-content-box{
			box-sizing: border-box;
			padding: 52rpx 24rpx;
			width: 710rpx;
			height: 404rpx;
			border-radius: 8rpx;
			background: #FFFFFF;
		}
		.sponsored-ad-content{
			width: 662rpx;
			height: 296rpx;
			border-radius: 8rpx;
			background: #D8D8D8;
		}
	}
</style>
