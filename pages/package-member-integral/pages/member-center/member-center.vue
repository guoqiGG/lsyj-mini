<!-- 会员中心 -->
<template>
    <view class="container">
        <view class="member-info-container">
            <view class="member-avatar">
                <image class="img" src="../../static/member-avatar-default.png" mode="scaleToFill" />
            </view>
            <view class="member-name">QCT9996</view>
            <view class="member-level">普通</view>
        </view>
        <view class="watch-beans">
            <view class="watch-container" @tap="clickWatch">
                <view class="text-con">
                    <view>观看记录</view>
                    <image class="right-arrow" src="../../static/icon-right-arrow.png"></image>
                </view>
                <view class="number">
                    0
                </view>
            </view>
            <view class="watch-container blue-container"  @tap="clickWatch">
                <view class="text-con">
                    <view>当前青春豆</view>
                    <image class="right-arrow" src="../../static/icon-right-arrow-blue.png"></image>
                </view>
                <view class="number">
                    0
                </view>
            </view>
        </view>
        <view class="member-growth">
            <view class="member-tit">
                青春豆攻略
            </view>
            <view class="content">
                <view class="title">
                    <view class="content-number">1</view>
                    <view class="content-title">什么是青春豆？</view>
                </view>
                <view class="content-text">
                    青春豆是商城对用户的一种奖励，用户可以在兑换区兑换相应的商品。
                </view>
            </view>
            <view class="content">
                <view class="title">
                    <view class="content-number">2</view>
                    <view class="content-title">如何获得青春豆？</view>
                </view>
                <view class="content-text">
                    <view>
                        (1) 观看直播达到一定时长可获取。
                    </view>
                    <view>
                        (2) 参与活动，比如分享直播链接、转发商品链接、介绍新会员注册等，即可获得相应青春豆奖励。
                    </view>
                    <view>(3) 在商城购买部分商品，即可获得相应青春豆。</view>
                </view>
            </view>
            <view class="content">
                <view class="title">
                    <view class="content-number">3</view>
                    <view class="content-title">青春豆</view>
                </view>
                <view class="content-text">
                    青春豆最终解释权归本商城所有。
                </view>
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
			clickWatch(){
                uni.showToast({
                    title: '功能暂未开放',
                    icon: 'none',
                    mask: true
                })
            }
		}
	}
</script>
<style>
@import './member-center.css'
</style>