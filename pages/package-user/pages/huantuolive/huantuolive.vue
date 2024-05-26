<template>
    <view class="con">
        <web-view :src="urls" />
    </view>
</template>
<script>
const util = require("@/utils/util.js");
const http = require("@/utils/http");
export default {
    data() {
        return {
            urls: null,
            coureId: null,
            coureName: null,
            liveUrl: null,
            timer: null
        }
    },
    onLoad(options) {
        util.checkAuthInfo(() => {
            this.getdySign(options.url)
            if (options.url) {
                this.liveUrl = decodeURIComponent(options.url)
            }
            if (options.coureName) {
                this.coureName = options.coureName
            }
            if (options.coureId) {
                this.coureId = options.coureId
                uni.setStorageSync('coureId', options.coureId)
                uni.setStorageSync('coureName', options.coureName)
                uni.setStorageSync('url', options.url)
                uni.setStorageSync('coureIdExpiredTime', new Date().getTime())
            }
            // if (options.userId) {
            //     if (!uni.getStorageSync('bbcUserInfo').puid) {
            //         http.request({
            //             url: '/pub/leader/binding',
            //             methods: 'POST',
            //             data: {
            //                 sign: 'qcsd',
            //                 data: JSON.stringify({
            //                     loginToken: uni.getStorageSync('bbcToken'),
            //                     parentId: options.userId
            //                 })
            //             },
            //             callBack: (res) => {
            //                 if (res.loginToken) {
            //                     uni.setStorageSync('bbcToken', res.loginToken)
            //                     uni.setStorageSync('bbcUserInfo', res)
            //                 }
            //                 uni.showToast({
            //                     title: '绑定成功',
            //                     icon: 'none',
            //                     duration: 2000
            //                 })
            //             }
            //         })
            //     }
            // }
        })

    },
    onShow() {
        console.log('onShow')
        clearInterval(this.timer)
        this.timer = null
        this.timer = setInterval(() => {
            this.insertWatchTime()
        }, 60000);
    },
    onShareAppMessage: function () {
        return {
            path: `pages/package-user/pages/huantuolive/huantuolive?url=${this.liveUrl}&coureName=${this.coureName}&coureId=${this.coureId}&userId=${uni.getStorageSync('bbcUserInfo').id}`,
            title: this.coureName,
            imageUrl: '/static/logo_11.png',
        };
    },
    methods: {
        stringToBase64(str) {
            let base64 = '';
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            for (let i = 0; i < str.length; i += 3) {
                const char1 = str.charCodeAt(i);
                const char2 = str.charCodeAt(i + 1);
                const char3 = str.charCodeAt(i + 2);

                const enc1 = char1 >> 2;
                const enc2 = ((char1 & 3) << 4) | (char2 >> 4);
                const enc3 = ((char2 & 15) << 2) | (char3 >> 6);
                const enc4 = char3 & 63;

                base64 += characters.charAt(enc1) + characters.charAt(enc2) + characters.charAt(enc3) + characters.charAt(enc4);
            }
            return base64
        },

        utf8_encode(str) {
            var output = '';
            for (var n = 0; n < str.length; n++) {
                var c = str.charCodeAt(n);
                if (c < 128) {
                    output += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    output += String.fromCharCode((c >> 6) | 192);
                    output += String.fromCharCode((c & 63) | 128);
                } else {
                    output += String.fromCharCode((c >> 12) | 224);
                    output += String.fromCharCode(((c >> 6) & 63) | 128);
                    output += String.fromCharCode((c & 63) | 128);
                }
            }
            return output;
        },
        // 插入观看时间 
        insertWatchTime() {
            const params = {
                url: `/voice/engine/time?course_id=${this.coureId}&userId=${uni.getStorageSync('bbcUserInfo').id}`,
                method: "GET",
                callBack: (res) => {
                }
            };
            http.request(params);
        },
        // 生成抖音签名信息 并生成直播间地址
        getdySign(url) {
            let userId = uni.getStorageSync('bbcUserInfo').id
            const params = {
                url: `/voice/engine/sign?userId=${userId}`,
                method: "GET",
                callBack: (res) => {
                    let Sign = res.sign
                    let Nickname = encodeURIComponent(this.stringToBase64(this.utf8_encode(uni.getStorageSync('bbcUserInfo').name)))
                    let UserId = uni.getStorageSync('bbcUserInfo').id
                    this.urls = `${url}?Sign=${Sign}&Nickname=${Nickname}&UserId=${UserId}&Timestamp=${res.timeStamp}&forceCheck=true`
                }
            };
            http.request(params);
        },
    },
    onHide() {
        console.log('onHide')
        clearInterval(this.timer)
        this.timer = null
    },
    onUnload() {
        console.log('onUnload')
        clearInterval(this.timer)
        this.timer = null
    }

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