<template>
    <view class="gift-write-off">
        <view class="container">
            <view class="top-con">
                <view class="top">
                    <view class="left">
                        <view class="text">账户青春豆（个）</view>
                        <view class="bean-con">
                            <image src="/static/bean.png" />
                            <view class="bean-num">{{userInfo.score?userInfo.score:0}}</view>
                        </view>
                    </view>
                    <view class="right" @tap="toIntegralIndexPage">
                       去兑换
                    </view>
                </view>
            </view>
            <view class="title">青春豆明细</view>
            <view class="item" v-for="(item, index) in dataList" v-key="index">
                <view class="item-left">
                    <view class="type">{{ item.scoreName }}</view>
                    <view class="time">{{item.createTime}}</view>
                </view>
                <view v-if="item.type === 3"><text class="red">-</text><text class="red">{{ item.score }}</text></view>
                <view v-else><text class="green">+</text><text class="green">{{ item.score }}</text></view>
            </view>
            <!-- 空列表或加载全部提示 -->
            <EmptyAllTips v-if="isLoaded" :isEmpty="!dataList.length" emptyTips="暂无数据"
                :isAll="dataList.length > 5 && isAll" />
        </view>
    </view>
</template>

<script>

const config = require("@/utils/config.js");
const http = require("@/utils/http.js");
const util = require("@/utils/util.js");
export default {
    components: {},
    props: {},
    data() {
        return {
            current: 1,
            size: 20,
            pages: 1,
            dataList: [],
            isLoaded: false,
            isAll: false,
            userInfo: {}
        };
    },

    onShow: function () {
        this.userInfo = uni.getStorageSync('bbcUserInfo')
        this.getScoreList();
        
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.getNextPage();
    },
    methods: {
        toIntegralIndexPage(){
            uni.navigateTo({ url: '/pages/package-member-integral/pages/integral-index/integral-index' })
        },

        /**
         * 获取青春豆明细
         */
        getScoreList() {
            this.isLoaded = false;
            const params = {
                url: "/pub/user/integral/list",
                method: "POST",
                data: {
                    sign: 'qcsd',
                    data: JSON.stringify({ pageSize: this.size, pageNo: this.current, userId: uni.getStorageSync('bbcUserInfo').id, loginToken: uni.getStorageSync('bbcToken'), categoryId: 1 }),
                },
                callBack: (res) => {
                    this.isLoaded = true;
                    this.dataList = this.current == 1 ? res.list : this.dataList.concat(res.list)
                    this.pages = res.total == 0 ? 1 : Math.ceil(res.total / this.size)
                }
            }
            http.request(params);
        },
        // 触底加载下一页
        getNextPage() {
            if (this.pages > this.current) {
                this.current = this.current + 1
                this.getScoreList();
            } else {
                this.isAll = true
            }
        }
    },
};
</script>
<style>
@import "./integral-details.css";
</style>