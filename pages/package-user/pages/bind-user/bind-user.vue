<template>
    <view class="container">
        <view class="con">
            <view class="user-avatar">
                <image :src="userInfo.avatar ? userInfo.avatar : '/static/head04.png'" mode="scaleToFill" />
            </view>
            <view class="user-name"><text>{{ userInfo.name }}</text></view>
            <view class="in-text">
                <text>扫码核销</text>
            </view>
            <view class="invatation-img">
                <image v-if="shareWxCode" :show-menu-by-longpress='true' :src="shareWxCode" mode="scaleToFill" />
            </view>
            <view class="in-card-text">
                <text class="line"></text>
                <text class="title">核销卡</text>
                <text class="line"></text>
            </view>
        </view>
        <!-- <view class="download">下载保存到相册</view> -->
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
            userInfo: {},
            giftId: null,
        }
    },
    onLoad: function (options) {
        console.log(options)
        if (options.giftId) {
            this.giftId = options.giftId
            this.userInfo = uni.getStorageSync('bbcUserInfo')
            this.getInvitationCode()
        }
    },
    onShow: function () {
        // 头部导航标题
        uni.setNavigationBarTitle({
            title: '扫码核销'
        })
    },

    methods: {
        /**
         * 生成分销邀请二维码
         */
        getInvitationCode() {
            // 请求小程序菊花码
            const params = {
                url: '/pub/leader/qr/code?scene=' + this.userInfo.id + '*' + this.giftId,
                method: 'GET',
                responseType: 'arraybuffer',
                callBack: (res) => {
                    this.shareWxCode = 'data:image/jpg;base64,' + wx.arrayBufferToBase64(res)
                }
            }
            http.request(params)
        }
    }
}
</script>
<style>
@import "./bind-user.css";
</style>