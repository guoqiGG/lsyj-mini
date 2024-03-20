<template>
    <view class="con">
        <view class="h-tabs">
            <view :class="'h-tab ' + (coupon_state == 1 ? 'on' : '')" data-type="1" @tap="changeTab">可合并
            </view>
            <view :class="'h-tab ' + (coupon_state == 2 ? 'on' : '')" data-type="2" @tap="changeTab">已合并
            </view>
        </view>
        <view class="container">
            <view class="item" v-for="item, index in dataList" :key="index">
                <view class="left">
                    <image src="../../static/icon_delivery.png" mode="scaleToFill" />
                </view>
                <view class="right">
                    <view class="coupon-name">{{ item.name }}</view>
                    <view class="coupon-text" v-if="coupon_state == '2'">合成时间：{{ item.createTime }}</view>
                    <view class="coupon-text" v-if="coupon_state == '2' && item.status == 1">核销时间：{{ item.cancelDate }}
                    </view>
                    <view class="coupon-text" v-if="coupon_state == '1'">
                        领取时间：{{ item.createTime }}</view>
                </view>
                <view class="use" v-if="coupon_state == 1 && item.type == 0"
                    @tap="syntheticGiftCard(coupon_state == 1 ? item.giftId : item.id, userId)">
                    <text class="text">合并</text>
                </view>

                <view class="use" v-if="coupon_state == 1 && item.type == 2"
                    @tap="syntheticGiftCard(coupon_state == 1 ? item.giftId : item.id, userId)">
                    <text class="text">合并</text>
                </view>

                <view class="use" v-if="coupon_state == '2' && item.status == 0 && item.type == 0"
                    @tap="writeOffSyntheticGiftCard(item.id, userId)">核销
                </view>

                <view class="use" v-if="coupon_state == '2' && item.status == 0 && item.type == 2"
                    @tap="toBindLeader(item.id)">扫码核销
                </view>

                <view class="use used" v-if="coupon_state == '2' && item.status == 1">已核销</view>
            </view>
            <!-- 空列表或加载全部提示 -->
            <EmptyAllTips v-if="isLoaded" :isEmpty="!dataList.length" emptyTips="暂无数据" :isAll="isAll" />
        </view>
    </view>
</template>
<script>
const http = require("@/utils/http");
const util = require("@/utils/util");
export default {
    data() {
        return {
            isLoaded: false,
            coupon_state: 1, //礼品卡状态 1可合并 2 已合并
            dataList: [],
            isAll: false,
            remark: "",
            pageSize: 10,
            userId: 0,
            current: 1,  // 当前页
            pages: 1 //总页数
        };
    },
    onShow: function () {
        uni.setNavigationBarTitle({
            title: "我的卡包",
        });
        util.checkAuthInfo(() => {
            if (uni.getStorageSync('bbcUserInfo')) {
                this.userId = uni.getStorageSync('bbcUserInfo').id
            }
            const params = {
                url: "/pub/user/update/gift",
                method: "POST",
                data: JSON.stringify({
                    userId: uni.getStorageSync('bbcUserInfo').id,
                    openid: uni.getStorageSync('bbcUserInfo').openId
                }),
                callBack: (res) => {
                    this.getGiftCardList()
                },
            }
            http.request(params);

        })
    },
    methods: {
        // 标签切换事件
        changeTab(e) {
            this.coupon_state = e.currentTarget.dataset.type
            this.current = 1
            this.pages = 1
            this.getGiftCardList();
        },
        getGiftCardList() {
            this.isLoaded = false
            let data
            if (this.coupon_state == 1) { //可合并列表
                data = {
                    pageNo: this.current,
                    pageSize: this.pageSize,
                    userId: this.userId
                }
                const params = {
                    url: "/pub/user/gift/list",
                    method: "POST",
                    data: {
                        sign: 'qcsd',
                        data: JSON.stringify(data),
                    },
                    callBack: (res) => {
                        this.isLoaded = true
                        this.dataList = this.current == 1 ? res.list : this.dataList.concat(res.list)
                        this.pages = res.total == 0 ? 1 : Math.ceil(res.total / this.pageSize)
                    },
                }
                http.request(params);
            } else { // 已合并列表
                data = {
                    pageNo: this.current,
                    pageSize: this.pageSize,
                    userId: this.userId
                }
                const params = {
                    url: "/pub/user/gift/combine/list",
                    method: "POST",
                    data: {
                        sign: 'qcsd',
                        data: JSON.stringify(data),
                    },
                    callBack: (res) => {
                        this.isLoaded = true
                        this.dataList = this.current == 1 ? res.list : this.dataList.concat(res.list)
                        this.pages = res.total == 0 ? 1 : Math.ceil(res.total / this.pageSize)
                    },


                }
                http.request(params);
            }

        },
        // 合成礼品卡
        syntheticGiftCard: util.debounce(function (giftId, userId) {
            let data = {
                giftId: giftId,
                userId: userId
            }
            const params = {
                url: "/pub/user/gift/merge",
                method: "POST",
                data: {
                    sign: 'qcsd',
                    data: JSON.stringify(data),
                },
                callBack: (res) => {
                    if (res) {
                        uni.showToast({
                            title: res,
                            icon: 'none',
                            mask: true
                        })
                        this.pages = 1
                        this.current = 1
                        this.getGiftCardList()

                    }
                },
            }
            http.request(params);
        }, 1000),
        // 核销合成礼品卡
        writeOffSyntheticGiftCard: util.debounce(function (id, userId) {
            uni.showModal({
                title: "添加备注",
                editable: true,
                placeholderText: "备注(非必填)",
                showCancel: true,
                success: ({ confirm, cancel, content }) => {
                    let data = {
                        remark: content,
                        giftRuleId: id,
                        userId: userId
                    }
                    if (confirm) {
                        const params = {
                            url: "/pub/user/gift/cancel",
                            method: "POST",
                            data: {
                                sign: "qcsd",
                                data: JSON.stringify(data)
                            },
                            callBack: (res1) => {
                                uni.showToast({
                                    title: res1,
                                    icon: "none",
                                });
                                this.pages = 1
                                this.current = 1
                                this.getGiftCardList()
                            },
                        };
                        http.request(params);
                    } else if (cancel) {
                    }
                },
            });
        }, 1000
        ),
        toBindLeader: util.debounce(function (id) {
            console.log('/pages/package-user/pages/bind-user/bind-user?giftId=' + id)

            uni.navigateTo({
                url: '/pages/package-user/pages/bind-user/bind-user?giftId=' + id
            })
        }, 1000),
    },
    /**
    * 页面上拉触底事件的处理函数
    */
    onReachBottom() {
        if (this.current < this.pages) {
            this.current = this.current + 1
            this.getGiftCardList()
        } else {
            this.isAll = true
        }
    }
};
</script>
<style>
@import "./card-package.css";
</style>