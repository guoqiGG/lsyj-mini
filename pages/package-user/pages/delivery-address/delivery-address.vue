<template>
    <view class="Mall4j container">
        <view class="main">
            <radio-group v-if="reDraw" class="radio-group">
                <block v-for="(item, index) in addressList" :key="index">
                    <view class="address">
                        <view class="personal" :data-addrid="item.addrId" @tap="selAddrToOrder">
                            <view class="info-tit">
                                <text class="name">{{ item.receiver }}</text>
                                <text class="tel">{{ item.mobile }}</text>
                                <image src="/static/revise.png" :data-addrid="item.addrId" @tap.stop="toEditAddress" />
                            </view>
                            <view class="addr">
                                <text class="addr-get">{{ item.province }}{{ item.city }}{{ item.area
                                    }}{{ item.addr }}</text>
                            </view>
                        </view>
                        <view class="select-btn">
                            <view class="box">
                                <label :data-addrid="item.addrId" @tap="onDefaultAddr">
                                    <radio :checked="item.commonAddr == 1" color="#005AFF" />{{
                i18n.asDefaultAddress
            }}
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
            defaultSize: 'mini',
            disabled: false,
            plain: true,
            loading: false,
            addressList: [],
            addAddress: '',
            order: -1,
            item: '',
            selAddress: '',
            reDraw: true,
            isLoaded: true,
            noShippingAddress: '您还没有收货地址',
            addNewAddress: '新增收货地址'
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
                url: '/p/address/list',
                method: 'GET',
                callBack: (res) => {
                    this.isLoaded = true
                    this.setData({
                        addressList: res,
                        reDraw: true
                    })
                }
            }
            // http.request(params)
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
            var addrId = e.currentTarget.dataset.addrid
            const params = {
                url: '/p/address/defaultAddr/' + addrId,
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
            var addrId = e.currentTarget.dataset.addrid
            uni.navigateTo({
                url: '/package-user/pages/edit-address/edit-address?addrId=' + addrId
            })
        },

        /**
         * 选择地址 跳转回提交订单页
         */
        selAddrToOrder: function (e) {
            const id = e.currentTarget.dataset.addrid
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
        }
    }
}
</script>
<style>
@import "./delivery-address.css";
</style>