<!-- 会员中心 -->
<template>
    <view class="container">
        <view class="member-info-container">
            <view class="member-avatar">
                <image style="width: 100%;height: 100%;margin: 0,0;" v-if="userInfo.avatar" class="img"
                    :src="userInfo.avatar" mode="" />
            </view>
            <view class="member-name">{{ userInfo.name }}</view>
            <view class="member-level">{{ userInfo.type == 1 ? '团长' : '普通' }}</view>
        </view>
        <view class="watch-beans">
            <view class="watch-container" @tap="clickWatch">
                <view class="text-con">
                    <view>观看记录</view>
                    <image class="right-arrow" src="../../static/icon-right-arrow.png"></image>
                </view>
                <view class="number">
                    {{ watchRecordTotal }}
                </view>
            </view>
            <view class="watch-container blue-container" @tap="toIntegralDetailsPage">
                <view class="text-con">
                    <view>当前青春豆</view>
                    <image class="right-arrow" src="../../static/icon-right-arrow-blue.png"></image>
                </view>
                <view class="number">
                    {{ score ? score : 0 }}
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
import { userInfo } from "os";

const http = require("@/utils/http");
export default {
    data() {
        return {
            score: null,
            watchRecordTotal: 0,
            userInfo: {}
        }
    },
    onShow() {
        this.userInfo = uni.getStorageSync('bbcUserInfo')
        this.watchRecord()
        this.getScore()
    },
    methods: {
        // 跳转到观看记录
        clickWatch() {
            uni.navigateTo({ url: '/pages/package-member-integral/pages/watch-records/watch-records' })
        },
        // 跳转到青春豆明细
        toIntegralDetailsPage() {
            uni.navigateTo({ url: '/pages/package-member-integral/pages/integral-details/integral-details?score=' + this.score })
        },
        // 观看记录
        watchRecord() {
            const params = {
                url: "/huan/tuo/user/viewing/time/list",
                method: "POST",
                data: JSON.stringify({ pageSize: 5, pageNo: 1, userId: uni.getStorageSync('bbcUserInfo').id }),
                // data: JSON.stringify({ pageSize: 5, pageNo: 1, userId: 71872 }),
                callBack: (res) => {
                    this.watchRecordTotal = res.list.length
                }
            }
            http.request(params);
        },
        // 获取用户青春豆数量
        getScore() {
            const params = {
                url: "/pub/user/integral",
                method: "post",
                data: {
                    sign: 'qcsd',
                    data: JSON.stringify({
                        userId: uni.getStorageSync('bbcUserInfo').id
                    })
                },
                callBack: (res) => {
                    this.score = res.score
                },
            };
            http.request(params);
        }
    }
}
</script>
<style>
@import './member-center.css'
</style>