<template>
    <view class="container">
        <view class="refund-top">
            <view class="refund-top-title"><text>退款成功</text></view>
            <view class="refund-top-time"><text>2024-03-03 10:57:50</text></view>
        </view>
        <view class="null-bg"></view>
        <view class="refund-middle">
            <view class="refund-middle-title"><text>退款信息</text></view>
            <view class="refund-middle-info">
                <view class="pic"></view>
                <view class="info">
                    <view class="name">张家传 草本药膏（止痒）</view>
                    <view class="number">数量：1件</view>
                </view>
            </view>
        </view>
        <view class="refund-bottom">
            <view class="text"><text>退款方式：仅退款</text></view>
            <view class="text"><text>退款原因：拍错/多拍/不喜欢</text></view>
            <view class="text"><text>退款说明：老李家</text></view>
            <view class="text"><text>退款金额：</text><text class="symbol">￥</text><text class="price">0.00</text></view>
            <view class="text"><text>退款编号：1773545003604381696</text></view>
            <view class="text"><text>申请时间：2024-03-29 10:57:34</text></view>
            <view class="text"><text>申请数量：1</text></view>
        </view>
    </view>
</template>
<script>
</script>
<style>
.container {
    
    min-height: 100vh;
}

.refund-top {
    padding: 36rpx 40rpx;
    background: #FFFFFF;
}

.refund-top .refund-top-title {
    font-weight: 400;
    font-size: 32rpx;
    color: #101010;
    line-height: 48rpx;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.refund-top .refund-top-time {
    font-weight: 400;
    font-size: 28rpx;
    color: #3D3D3D;
    line-height: 48rpx;
    letter-spacing: 1px;
    text-align: left;
    font-style: normal;
    text-transform: none;
}
.null-bg{
    background: #F6F6F6;
    width: 100%;
    height: 20rpx;
}

.refund-middle {
    background: #FFF;
}

.refund-middle .refund-middle-title {
    font-weight: 400;
    font-size: 32rpx;
    color: #101010;
    line-height: 48rpx;
    text-align: left;
    font-style: normal;
    text-transform: none;
    padding: 36rpx 40rpx;
}

.refund-middle .refund-middle-info {
    background: #F6F6F6;
    padding: 30rpx 40rpx;
    display: flex;
    flex-direction: row;
}

.refund-middle .refund-middle-info .pic {
    background: #FFF;
    border-radius: 12rpx;
    width: 200rpx;
    height: 200rpx;
}

.refund-middle .refund-middle-info .info {
    margin-left: 30rpx;
    width: calc(100% - 200rpx - 30rpx);
}

.refund-middle .refund-middle-info .info .name {
    font-weight: 400;
    font-size: 32rpx;
    color: #101010;
    line-height: 48rpx;
    text-align: left;
    font-style: normal;
    text-transform: none;
    margin-top: 10rpx;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.refund-middle .refund-middle-info .info .number {
    font-weight: 400;
    font-size: 28rpx;
    color: #979797;
    line-height: 48rpx;
    font-style: normal;
    text-transform: none;
    margin-top: 24rpx;
}

.refund-bottom {
    background: #FFF;
    padding: 30rpx 36rpx;
}

.refund-bottom .text {
    font-weight: 400;
    font-size: 28rpx;
    color: #979797;
    line-height: 48rpx;
    text-align: left;
    font-style: normal;
    text-transform: none;
    margin-bottom: 10rpx;
}
.refund-bottom .text .symbol{
    font-size: 18rpx;
}
.refund-bottom .text .symbol,.refund-bottom .text .price{
    color: #C53032;
}
</style>
