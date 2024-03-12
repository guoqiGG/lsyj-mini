<template>
  <view class="Mall4j container">
    <!--input列表 -->
    <view v-if="!isMap" class="input-box">
      <view class="section">
        <text>收件人</text>
        <input placeholder="请输入收件人名字" type="text" maxlength="15" :value="name" @input="onReceiverInput" />
      </view>
      <view class="section">
        <text>手机号码</text>
        <input placeholder="11位手机号码" type="number" maxlength="11" :value="tel" @input="onMobileInput" />
      </view>
      <view class="section">
        <text>详细地址</text>
        <input class="addr" placeholder="如省/市/区/小区/楼号/单元/门牌号" type="text" :value="address" maxlength="50"
          @input="onAddrInput" />
      </view>
      <view class="section">
        <text>默认地址</text>
        <radio-group>
          <label class="radio" data-default="1" @tap="onDefaultAddr">
            <radio :checked="isDefault == 1" color="#005AFF" />是
          </label>
          <label style="margin-left: 10rpx;" class="radio" data-default="0" @tap="onDefaultAddr">
            <radio :checked="isDefault == 0" color="#005AFF" />否
          </label>
        </radio-group>
      </view>
    </view>
    <!-- end input列表 -->
    <!-- 功能按钮 -->
    <view v-if="!isMap" class="btn-box">
      <view class="keep btn" @tap="onSaveAddr">
        <text>保存收货地址</text>
      </view>

      <view v-if="id != 0" class="clear btn" @tap="onDeleteAddr">
        <text>删除收货地址</text>
      </view>
    </view>
    <!-- end 功能按钮 -->


  </view>
</template>

<script>
const http = require('@/utils/http.js')
const util = require('@/utils/util.js')
const config = require('@/utils/config.js')


export default {
  data() {
    return {
      addrInfoList: [],
      name: '', // 收件人
      tel: '',  // 手机号
      address: '', // 收获地址
      isEdit: false,// true 编辑 false 新增 
      isDefault: 1, // 0不是默认地址 1默认地址
      id: 0,
      userId: 0,
    }
  },
  onLoad: function (options) {
    // 获取地址列表信息
    this.isEdit = !!options.id
    if (uni.getStorageSync('bbcUserInfo')) {
      this.userId = uni.getStorageSync('bbcUserInfo').id
    }
    if (options.id) {
      this.getAddressInfoById(options.id)
      this.id = options.id
    }

  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    // 加载导航标题
    uni.setNavigationBarTitle({
      title: this.isEdit ? '编辑收货地址' : '新增收获地址'
    })
    if (uni.getStorageSync('bbcUserInfo')) {
      this.userId = uni.getStorageSync('bbcUserInfo').id
    }

  },
  methods: {
    /**
           * 设置为默认地址
           */
    onDefaultAddr: function (e) {
      this.isDefault = e.currentTarget.dataset.default
    },

    /**
     * 获取地址详情
     */
    getAddressInfoById(addrId) {
      const params = {
        url: '/pub/user/address/list',
        method: 'POST',
        data: {
          sign: 'qcsd',
          data: JSON.stringify({
            userId: this.userId,
            id: addrId
          })
        },
        callBack: res => {
          this.setData({
            name: res.list[0].name,
            tel: res.list[0].tel,
            address: res.list[0].address,
            isDefault: res.list[0].isDefault,
          })
        }
      }
      http.request(params)
    },




    /**
     * 保存地址
     */
    onSaveAddr: function () {
      var ths = this
      var name = ths.name
      var tel = ths.tel
      var address = ths.address
      var isDefault = ths.isDefault

      if (!name) {
        uni.showToast({
          title: '请输入收货人姓名',
          icon: 'none'
        })
        return
      }
      if (!tel) {
        uni.showToast({
          title: '请输入手机号',
          icon: 'none'
        })
        return
      }
      if (!util.checkPhoneNumber(tel)) {
        uni.showToast({
          title: '请输入正确的手机号码',
          icon: 'none'
        })
        return
      }
      if (!address || address.length < 5) {
        uni.showToast({
          title: '请您填写字数不小于5的详细地址',
          icon: 'none'
        })
        return
      }

      if (ths.id == 0) {
        // 新增
        const params = {
          url: '/pub/user/address/add',
          method: 'POST',
          data: {
            sign: 'qcsd',
            data: JSON.stringify({
              userId: this.userId,
              name: name,
              tel: tel,
              address: address,
              isDefault: isDefault
            })
          },
          callBack: function (res) {
            uni.navigateBack({
              delta: 1
            })
          }
        }
        http.request(params)
      } else {
        // 编辑
        const params = {
          url: '/pub/user/address/update',
          method: 'POST',
          data: {
            sign: 'qcsd',
            data: JSON.stringify({
              userId:this.userId,
              id: this.id,
              name: name,
              tel: tel,
              address: address,
              isDefault: isDefault,
              isDeleted: 0
            })
          },
          callBack: function (res) {
            uni.navigateBack({
              delta: 1
            })
          }
        }
        http.request(params)
      }
    },
    onReceiverInput: function (e) {
      this.setData({
        name: e.detail.value
      })
    },
    onMobileInput: function (e) {
      this.setData({
        tel: e.detail.value
      })
    },
    onAddrInput: function (e) {
      this.setData({
        address: e.detail.value
      })
    },
    // 删除配送地址
    onDeleteAddr: function (e) {
      var ths = this
      uni.showModal({
        title: '',
        content: '确定要删除此收货地址吗?',
        cancelText: '取消',
        confirmText: '确定',
        confirmColor: '#eb2444',
        success(res) {
          if (res.confirm) {
            const params = {
              url: '/pub/user/address/update',
              method: 'POST',
              data: {
                sign: 'qcsd',
                data: JSON.stringify({
                  id: ths.id,
                  isDeleted: 1
                })
              },
              callBack: function (res) {
                uni.navigateBack({
                  delta: 1
                })
              }
            }
            http.request(params)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }

      })
    },
    // 空方法
    nono() {

    }
  }
}

</script>
<style>
@import "./edit-address.css";
</style>
