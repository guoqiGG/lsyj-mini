<template>
    <view class="container">
        <view class="income-all">
            <view class="income-total"><text>累计收益 (元)</text></view>
            <view class="income-total-text"><text>23.08</text></view>
            <view class="income-box">
                <view class="box">
                    <view class="box-title"><text>可提现金额 (元)</text></view>
                    <view class="box-number"><text>2.16</text></view>
                </view>
                <view class="box">
                    <view class="box-title"><text>已提现金额 (元)</text></view>
                    <view class="box-number"><text>0</text></view>
                </view>
            </view>
        </view>
        <view class="income-con">
            <view class="today-income"><text>今日收益</text><text class="red">￥0</text></view>
            <view class="today-income"><text>本月收益</text><text class="red">￥0</text></view>
        </view>
        <view class="income-detail">
            <view class="income-detail-top">
                <view class="income-detail-top-title"><text>余额明细</text></view>
                <view class="income-detail-top-right"><text>日期选择</text></view>
            </view>
            <view class="income-detail-list-box">
                <view class="income-detail-list" v-for="item,index in 5">
                    <view class="left-box"></view>
                    <view class="right-box">
                        <view class="name-box">
                            <view class="name">蜂疗灸</view>
                            <view class="income-money">-2.40</view>
                        </view>
                        <view class="order-people">下单人：用户BG17Ih6q</view>
                        <view class="other">
                            <view class="amount">余额：0.00</view>
                            <view class="time">2024-02-29 17:43</view>
                        </view>
                    </view>
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
    }
}

</script>
<style>
@import './income-details.css'
</style>