<template>
    <view class="con">
        <web-view :src="urls" />
    </view>
</template>
<script>
const util = require("@/utils/util.js");
const http = require("@/utils/http");
import { mpAppName } from '@/utils/config';
export default {
    data() {
        return {
            urls: null
        }
    },
    onLoad(options) {
        if (options.puid) {
            if (uni.getStorageSync('bbcToken')) {
                if (!uni.getStorageSync('bbcUserInfo').puid) {
                    http.request({
                        url: '/pub/leader/binding',
                        methods: 'POST',
                        data: {
                            sign: 'qcsd',
                            data: JSON.stringify({
                                loginToken: uni.getStorageSync('bbcToken'),
                                parentId: options.puid
                            })
                        },
                        callBack: (res) => {
                            if (res.loginToken) {
                                uni.setStorageSync('bbcToken', res.loginToken)
                                uni.setStorageSync('bbcUserInfo', res)
                            }
                            uni.showToast({
                                title: '绑定成功',
                                icon: 'none',
                                duration: 2000
                            })
                        }
                    })
                }

            } else {
                util.checkAuthInfo(() => { })
            }
        }
    },
    onShow() {
        this.toLiveAddress()
    },
    onShareAppMessage: function () {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        return {
            path: "pages/package-user/pages/huantuolive/huantuolive" + (uni.getStorageSync('bbcUserInfo') ? "?puid=" + (uni.getStorageSync('bbcUserInfo').puid ? uni.getStorageSync('bbcUserInfo').puid : uni.getStorageSync('bbcUserInfo').id) : ''),
            title: mpAppName,
            imageUrl: '/static/logo_11.png',
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        };
    },
    methods: {
        getShareInfo() {
            var url = encodeURIComponent(window.location.href.split("#")[0]);
            let userId = uni.getStorageSync('bbcUserInfo').id
            const params = {
                url: `/wx/h5/getSing?url=${url}&userId=${userId}`,
                method: "GET",
                callBack: (res) => {
                    wx.config({
                        debug: false,
                        appId: res.appId,
                        timestamp: parseInt(res.timestamp),
                        nonceStr: res.nonceStr,
                        signature: res.signature,
                        jsApiList: [
                            "updateAppMessageShareData",
                            "updateTimelineShareData"
                        ]
                    });

                    wx.ready(() => {
                        wx.checkJsApi({
                            jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                            success: function (res) {
                                console.log('可以用');
                            },
                            fail: function (err) {
                                console.log('不可以用', err);
                            },
                        });
                        wx.updateAppMessageShareData({
                            title: res.title,
                            desc: res.coupyweiring,
                            link: window.location.href.split("#")[0] + '#/pages/package-user/pages/huantuolive/huantuolive?userId=' + res.userId,
                            imgUrl: res.img,
                            success: function () {
                                console.log('分享成功')
                            },
                            fail: function (err) {
                                console.log('分享失败', err)
                            },
                        })
                    });
                    //错误了会走 这里
                    wx.error(function (err) {
                        // console.log('微信分享错误信息', err)
                    });
                },
                errCallBack: () => {
                    console.log('失败')
                },
            };
            http.request(params);

        },
        goHome() {
            uni.switchTab({ url: "/pages/index/index" });
        },
        // 跳转到欢拓直播地址
        toLiveAddress() {
            util.checkAuthInfo(() => {
                const params = {
                    url: '/huan/tuo/user/courseId',
                    data: JSON.stringify({
                        userId: uni.getStorageSync("bbcUserInfo").id,
                        type: 1  // 0 h5  1 小程序
                    }),
                    callBack: (res) => {
                        this.urls = res
                    },
                    errCallBack: () => {
                        // alert('errCallBack',)
                    },

                };
                http.request(params);
            })
        }
    },

}
</script>
<style>
.con {
    height: 100vh;
    width: 100vw;
    position: relative;
}

.home {
    position: absolute;
    width: 70rpx;
    height: 70rpx;
    border-radius: 50%;
    background: #FFF;
    top: 70%;
    left: 10%;
    z-index: 10000;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.15);


}

.home image {
    margin-top: 10rpx;
    margin-left: 10rpx;
    width: 50rpx;
    height: 50rpx;
}
</style>