<template>
    <view>
        <u-popup :show="showAuth">
            <view class="con-container">
                <view class="title"><text>氢春态欢乐园 申请</text></view>
                <view class="desc">
                    <view class="desc-big"><text>获取您的昵称、头像</text></view>
                    <view class="desc-small"><text>提供具有辨识度的用户中心界面</text></view>
                </view>
                <view class="line"></view>
                <view class="avatar">
                    <view class="avatar-title"><text>头像</text></view>
                    <button class="avatar-img" style="background-color: transparent; margin: 0; padding: 0"
                        open-type="chooseAvatar" @chooseavatar="getUploadImg">
                        <image :src="avatar ? avatar : '/static/head04.png'" mode="scaleToFill" />
                    </button>
                </view>
                <view class="line"></view>
                <view class="name">
                    <view class="name-title"><text>昵称</text></view>
                    <input class="name-input" type="nickname" placeholder="请输入昵称" :value="name"
                        @change="getNickNameInt">
                </view>
                <view class="line"></view>
                <view :class="['button', (name && avatar) ? '' : 'un']" @tap="save"><text>保存</text></view>
            </view>
        </u-popup>
    </view>
</template>
<style>
@import "./user-login.css"
</style>