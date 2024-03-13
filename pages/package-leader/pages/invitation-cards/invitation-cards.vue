<template>
    <view class="container">
        <view class="con">
            <view class="user-avatar">
                <image src="/static/head04.png" mode="scaleToFill" />
            </view>
            <view class="user-name"><text>用户名称</text></view>
            <view class="in-text">
                <text>邀你一起加入，推广赢奖励</text>
            </view>
            <view class="invatation-img">
                <image :show-menu-by-longpress='true' src="/static/head04.png" mode="scaleToFill" />
            </view>
            <view class="in-card-text">
                <text class="line"></text>
                <text class="title">邀请卡</text>
                <text class="line"></text>
            </view>
        </view>
        <view class="download">下载保存到相册</view>
    </view>
</template>

<script>
const http = require('@/utils/http.js')
const util = require('@/utils/util.js')
const config = require('@/utils/config.js')
var Qr = require('@/utils/wxqrcode')
export default {
    data() {
        return {
            shareWxCode: '', // 生成的二维码路径 微信端
            leaderInfo: {}
        }
    },
    onShow: function () {
        // 头部导航标题
        uni.setNavigationBarTitle({
            title: '邀请用户'
        })
        util.checkAuthInfo(() => {
            this.leaderInfo = uni.getStorageSync('bbcUserInfo')
            this.getInvitationCode()
        })
    },

    methods: {
        /**
         * 获取分销员信息
         */
        getDisInfo() {
            http.request({
                url: '/p/distribution/user/distributionUserInfo',
                method: 'GET',
                data: {
                    shopId: 1
                },
                callBack: (res) => {
                    this.distInfo = res
                }
            })
        },
        /**
         * 生成分销邀请二维码
         * 小程序端 生成小程序菊花码  否则生成普通二维码
         */
        getInvitationCode() {
            // 请求小程序菊花码
            const params = {
                url: '/pub/leader/qr/code',
                method: 'POST',
                responseType: 'arraybuffer',
                data: {
                    sign: "qcsd",
                    data: JSON.stringify({
                        scene: this.leaderInfo.id,
                        pageStr: '/pages/index/index'
                    })
                },
                callBack: (res) => {
                    console.log(res)
                    this.shareWxCode = 'data:image/jpg;base64,' + wx.arrayBufferToBase64(res)
                }
            }
            http.request(params)
        }
    }
}
</script>
<style>
@import "./invitation-cards.css";
</style>