<template>
    <view class="Mall4j container">
        <view class="main">
            <radio-group v-if="reDraw" class="radio-group">
                <block v-for="(item, index) in addressList" :key="index">
                    <view class="address">
                        <view class="personal" :data-id="item.id" @tap="selAddrToOrder">
                            <view class="info-tit">
                                <text class="name">{{ item.name }}</text>
                                <text class="tel">{{ item.tel }}</text>
                                <image src="/static/revise.png" :data-id="item.id" @tap.stop="toEditAddress" />
                            </view>
                            <view class="addr">
                                <text class="addr-get">{{ item.address }}</text>
                            </view>
                        </view>
                        <view class="select-btn" v-if="item.isDefault == 1">
                            <view class="box">
                                <label :data-addrid="item.id" color="#005AFF">
                                    <!-- <radio :checked="item.isDefault == 1" color="#005AFF" disabled /> -->
                                    当前为默认地址
                                </label>
                            </view>
                        </view>
                    </view>
                </block>
            </radio-group>
        </view>
        <view class="footer" @tap="onAddAddr">
            <text>{{ addNewAddress }}</text>
        </view>
        <!-- 空列表或加载全部提示 -->
        <EmptyAllTips v-if="isLoaded" :emptyImg="3" :isEmpty="addressList.length == 0" :emptyTips="noShippingAddress" />
    </view>
</template>

<script>
const http = require('@/utils/http')
export default {
    props: {},
    data() {
        return {
            userId: 0,
            addressList: [],
            reDraw: true,
            isLoaded: true,
            noShippingAddress: '您还没有收货地址',
            addNewAddress: '新增收货地址',
            current: 1,
            pages: 1,
            pageSize: 20
        }
    },
    onLoad: function (option) {
        if (option.order) {
            this.setData({
                order: option.order
            })
        }
    },
    // 加载地址列表
    onShow: function () {
        // 加载导航标题
        uni.setNavigationBarTitle({
            title: '收货地址'
        })
        if (uni.getStorageSync('bbcUserInfo')) {
            this.userId = uni.getStorageSync('bbcUserInfo').id
        }
        this.getAddrList()
    },
    methods: {
        /**
         * 获取收货地址列表
         */
        getAddrList: function () {
            this.reDraw = false
            this.isLoaded = false
            const params = {
                url: '/pub/user/address/list',
                method: 'POST',
                data: {
                    sign: "qcsd",
                    data: JSON.stringify({
                        userId: this.userId,
                        pageNo: this.current,
                        pageSize: this.pageSize
                    })
                },
                callBack: (res) => {
                    this.isLoaded = true
                    this.reDraw = true
                    this.addressList = this.current == 1 ? res.list : this.addressList.concat(res.list)
                    this.pages = res.total == 0 ? 1 : Math.ceil(res.total / this.pageSize)
                }
            }
            http.request(params)
        },

        /**
         * 新增收货地址
         */
        onAddAddr: function (e) {
            if (this.addressList.length == 10) {
                uni.showToast({
                    title: '添加收货地址',
                    icon: 'none'
                })
            } else {
                uni.navigateTo({
                    url: '/pages/package-user/pages/edit-address/edit-address'
                })
            }
        },
        /**
         * 设置为默认地址
         */
        onDefaultAddr: function (e) {
            var addrId = e.currentTarget.dataset.id
            const params = {
                url: '/p/address/defaultAddr/' + id,
                method: 'PUT',
                callBack: (res) => {
                    this.getAddrList()
                }
            }
            http.request(params)
        },

        /**
         * 修改地址
         */
        toEditAddress: function (e) {
            var id = e.currentTarget.dataset.id
            uni.navigateTo({
                url: '/pages/package-user/pages/edit-address/edit-address?id=' + id
            })
        },

        /**
         * 选择地址 跳转回提交订单页
         */
        selAddrToOrder: function (e) {
            const id = e.currentTarget.dataset.id
            let item = null
            this.addressList.forEach((addrItem) => {
                if (addrItem.addrId == id) {
                    item = addrItem
                }
            })
            if (this.order == 0) {
                var pages = getCurrentPages() // 当前页面
                var prevPage = pages[pages.length - 2] // 上一页面
                prevPage.item = item
                prevPage.selAddress = 'yes'
                // 返回
                uni.navigateBack({
                    delta: 1
                })
            }
        },
    },
    /**
* 页面上拉触底事件的处理函数
*/
    onReachBottom() {
        if (this.current < this.pages) {
            this.current = this.current + 1
            this.getAddrList()
        } else {
            this.isAll = true
        }
    }
}
</script>
<style>
@import "./delivery-address.css";
</style>