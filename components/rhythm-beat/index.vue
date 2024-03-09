<template>
  <view class="Mall4j beat">
    <view class="wrap">
      <view class="music">
        <view class="li m1" />
        <view class="li m2" />
        <view class="li m3" />
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {}
  },

  computed: {
    i18n() {
      return this.$t('index')
    }
  }
}
</script>

<style>
@import "./index.css";
</style>
