<template>
    <view class="container">
        <view class="search-con">
            <image class="img" src="../../static/search.png" mode="scaleToFill" />
            <input class="input" placeholder="请输入搜索昵称" type="text" :value="searchValue" />
            <view class="search-button">搜索</view>
        </view>
      <view class="con">
        <view class="list-con" v-for="item,index in 10" :key="index">
            <image class="img-avatar" src="/static/head04.png" mode="scaleToFill" />
            <view class="right-con">
                <view class="name">QCT9996</view>
                <view class="phone">18437930709</view>
            </view>
        </view>
      </view>
    </view>
</template>
<script>
export default {
    data() {
        return {
            searchValue: ''
        }
    }
}

</script>
<style>
@import './my-friends.css'
</style>