<template>
    <view class="gift-write-off">
        <view class="container">
            <view class="item" v-for="(item, index) in dataList" v-key="index">

                <view class="item-cen">
                    <view class="img">
                        <image src="/static/watch-records-img.png" @error="errorImg(index)" />
                    </view>
                    <view class="right-con">
                        <view class="right-top">
                            <view class="room-name">{{ item.courseName }}</view>
                            <view class="watch-time">观看时长：<text class="time">{{ item.durationStr }}</text></view>
                        </view>
                        <view class="date">{{ item.createTime.split(" ")[0] }}</view>
                    </view>
                </view>
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
            size: 10,
            pages: 1,
            dataList: [],
            isLoaded: false,
            isAll: false,
        };
    },

    onShow: function () {
        this.getWatchRecordsList();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.getNextPage();
    },
    methods: {

        /**
         * 获取观看时长列表
         */
        getWatchRecordsList() {
            this.isLoaded = false;
            const params = {
                url: "/huan/tuo/user/viewing/time/list",
                method: "POST",
                data: JSON.stringify({ pageSize: this.size, pageNo: this.current, userId: uni.getStorageSync('bbcUserInfo').id }),            
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
                this.getWatchRecordsList();
            } else {
                this.isAll = true
            }
        }
    },
};
</script>
<style>
@import "./watch-records.css";
</style>