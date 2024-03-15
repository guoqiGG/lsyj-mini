<template>
    <view class="container">
        <view class="search-con">
            <image class="img" src="../../static/search.png" mode="scaleToFill" />
            <input class="input" placeholder="请输入搜索昵称" type="text" v-model="searchValue" />
            <view class="search-button" @click="searchBtn()">搜索</view>
        </view>
      <view class="con">
		  <view class="" style="margin-left: 40rpx;">
		  	总人数：{{total}}
		  </view>
        <view class="list-con" v-for="(item,index) in friendsList" :key="index">
            <!-- <image class="img-avatar" src="/static/head04.png" mode="scaleToFill" /> -->
            <image class="img-avatar" :src="item.avatar" mode="scaleToFill" />
            <view class="right-con">
                <view class="name">{{item.realName}}</view>
                <view class="phone">{{item.mobile}}</view>
            </view>
        </view>
		<!-- 空列表或加载全部提示 -->
		<EmptyAllTips v-if="isLoaded" :isEmpty="!friendsList.length" emptyTips="暂无数据" :isAll="isAll" />
	  </view>
    </view>
</template>
<script>

const http = require("@/utils/http");
export default {
    data() {
        return {
			total:0,
			isLoaded: false,
			isAll: false,
            searchValue: null,
			userId: null,
			current: 1,  // 当前页
			pages: 10 ,//总页数
			friendsList:[]
        }
    },
	onShow: function () {
		let bbcUserInfo =uni.getStorageSync("bbcUserInfo"); //用户信息
		this.userId=bbcUserInfo.id
	    this.getLeaderFriends()
	},
	methods:{
		// 团长好友列表
		getLeaderFriends(){
			this.isLoaded = false
			let obj={
				pageNo: this.current,
				pageSize: this.pages,
				userId: this.userId,
				name:this.searchValue,
			}
			const params = {
			    url: "/pub/leader/friend/list",
			    method: "POST",
			    data: {
			        sign: 'qcsd',
			        data: JSON.stringify(obj),
			    },
			    callBack: (res) => {
					this.isLoaded = true
					this.total=res.total
					this.friendsList = this.current == 1 ? res.list : this.friendsList.concat(res.list)
					this.pages = res.total == 0 ? 1 : Math.ceil(res.total / this.pages)
			    },
			}
			http.request(params);
		},
		searchBtn(){
			 this.current= 1,  // 当前页
			 this.pages= 1 ,//总页数
			 this.getLeaderFriends()
		}
	},
	/**
	* 页面上拉触底事件的处理函数
	*/
	onReachBottom() {
	    if (this.current < this.pages) {
	        this.current = this.current + 1
	        this.getLeaderFriends()
	    } else {
	        this.isAll = true
	    }
	}
}

</script>
<style>
@import './my-friends.css'
</style>