<template>
    <uv-popup ref="popup" mode="center" bgColor="none">
        <view class="popup-con">
            <view class="close" @tap="close">×</view>
            <image class="mother-bg" src="/static/mother-bg.png" />
            <image class="mother-bg2" src="/static/mother-bg2.png" @tap="close" />
            <view class="title">512母亲节</view>
            <view class="title2">
                <view class="title-1">母亲节快乐</view>
                <view class="title-2">
                    <view>王总携全体员工</view>
                    <view>祝天下母亲</view>
                    <view>福寿安康 喜乐绵长</view>
                </view>
            </view>
        </view>
    </uv-popup>
</template>
<script>
const util = require("@/utils/util.js");
const http = require("@/utils/http.js");
import dayjs from 'dayjs';
export default {
    methods: {
        popShow() {
            if (uni.getStorageSync('motherPopShowExpiresTimeStamp') && new Date().getTime() > uni.getStorageSync('motherPopShowExpiresTimeStamp')) {
                uni.removeStorageSync('motherPopShowExpiresTimeStamp')
                uni.removeStorageSync('motherPopShow')
            }
            let date = dayjs(new Date()).format('YYYY-MM-DD')
            if (date == '2024-05-12' && !uni.getStorageSync('motherPopShow')) {
                this.$refs.popup.open('center');
                uni.setStorageSync('motherPopShow', true)
                const expiresTimeStamp = new Date().getTime() + 3 * 60 * 60 * 1000
                uni.setStorageSync('motherPopShowExpiresTimeStamp', expiresTimeStamp)
            }
        },
        close() {
            this.$refs.popup.close()
        },
    },
}
</script>

<style lang="less" scoped>
.popup-con {
    position: relative;

    .mother-bg {
        width: 1220rpx;
        height: 1836rpx;
    }

    .mother-bg2 {
        position: absolute;
        width: 1220rpx;
        height: 2000rpx;
        top: 45%;
        left: calc(50% + 20rpx);
        transform: translate(-50%, -50%);
    }

    .title {
        font-family: helvetica, "Heiti SC", PingFangSC-Light;
        position: absolute;
        background: linear-gradient(90deg, #FFE7CD 0%, #FFFFFF 100%);
        box-shadow: 0rpx 8rpx 20rpx 0rpx #F6BBA8;
        border-radius: 50rpx 50rpx 50rpx 50rpx;
        top: 488rpx;
        left: 748rpx;
        font-weight: 900;
        font-size: 32rpx;
        color: #D9463C;
        line-height: 34rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
        padding: 8rpx 12rpx;
        text-shadow: 1rpx 0 #FFFFFF,
            -1rpx 0 #FFFFFF,
            0 1rpx #FFFFFF,
            0 -1rpx #FFFFFF;
        text-align: center;
    }

    .title2 {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        margin-top: -20rpx;

        .title-1 {
            font-weight: bold;
            font-size: 92rpx;
            line-height: 87rpx;
            color: #CD3C36;
            text-shadow: 6rpx 0 #FFFFFF,
                -6rpx 0 #FFFFFF,
                0 6rpx #FFFFFF,
                0 -6rpx #FFFFFF;
            text-align: center;
        }

        .title-2 {
            margin-top: 40rpx;
            font-weight: 600;
            font-size: 52rpx;
            color: #CD3C36;
            line-height: 72rpx;
            text-align: center;
            font-style: normal;
            text-transform: none;
            position: relative;
        }

        .title-2::before {
            position: absolute;
            content: '“';
            width: 40rpx;
            height: 40rpx;
            left: -20rpx;
            top: -30rpx;
        }

        .title-2::after {
            position: absolute;
            content: '”';
            width: 40rpx;
            height: 40rpx;
            right: -20rpx;
            bottom: -30rpx;
        }
    }

    .close {
        position: absolute;
        width: 64rpx;
        height: 64rpx;
        border: 6rpx solid #ffffff;
        border-radius: 50%;
        text-align: center;
        line-height: 54rpx;
        font-size: 60rpx;
        color: #fff;
        top: 20%;
        right: 25%;
        z-index: 20;
    }
}
</style>