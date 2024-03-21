import App from "./App";

// #ifndef VUE3
import Vue from "vue";
import "./uni.promisify.adaptor";
import store from "./store/store.js";
import uView from "./uni_modules/uview-ui";

Vue.config.productionTip = false;
Vue.mixin({
  methods: {
    setData: function (obj, callback) {
      const that = this;
      let keys = [];
      let val, data;
      Object.keys(obj).forEach(function (key) {
        keys = key.split(".");
        val = obj[key];
        data = that.$data;
        keys.forEach(function (key2, index) {
          if (index + 1 == keys.length) {
            that.$set(data, key2, val);
          } else {
            if (!data[key2]) {
              that.$set(data, key2, {});
            }
          }
          data = data[key2];
        });
      });
      callback && callback();
    },
    // 图片出错处理
    imageError(target, attr) {
      target[attr] = "";
    },
  },
});
App.mpType = "app";
Vue.use(uView);
uni.$u.config.unit = "rpx";
const app = new Vue({
  ...App,
});
Vue.prototype.parsePrice = function (val) {
  if (!val) {
    val = 0;
  }
  return val.toFixed(2).split(".");
};
Vue.prototype.toPrice = function (val) {
  if (!val) {
    val = 0;
  }
  return val.toFixed(2);
};
Vue.prototype.parsePrice = function (val) {
  if (!val) {
    val = 0;
  }
  return val.toFixed(2).split(".");
};
Vue.prototype.toPrice = function (val) {
  if (!val) {
    val = 0;
  }
  return val.toFixed(2);
};

/**
 * 解决四舍五入精度问题
 * @param {*} d 保留位数
 * @param {*} value 值
 * @returns
 */
const toFixxed = function (d, value) {
  let s = value + "";
  if (!d) d = 0;
  if (s.indexOf(".") == -1) s += ".";
  s += new Array(d + 1).join("0");
  if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (d + 1) + "})?)\\d*$").test(s)) {
    s = "0" + RegExp.$2;
    var pm = RegExp.$1;
    var a = RegExp.$3.length;
    var b = true;
    if (a == d + 2) {
      a = s.match(/\d/g);
      if (parseInt(a[a.length - 1]) > 4) {
        for (var i = a.length - 2; i >= 0; i--) {
          a[i] = parseInt(a[i]) + 1;
          if (a[i] == 10) {
            a[i] = 0;
            b = i != 1;
          } else break;
        }
      }
      s = a.join("").replace(new RegExp("(\\d+)(\\d{" + d + "})\\d$"), "$1.$2");
    }
    if (b) s = s.substr(1);
    return (pm + s).replace(/\.$/, "");
  }
  return value + "";
};

Vue.prototype.toFixxed = (val) => {
  if (!val) {
    val = 0;
  }
  return toFixxed(2, val);
};

app.$mount();
// #endif

// #ifdef VUE3
import { createSSRApp } from "vue";
export function createApp() {
  const app = createSSRApp(App);
  return {
    app,
    store,
  };
}
// #endif
