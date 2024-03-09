const path = require("path");
const resolve = (dir) => path.join(__dirname, dir);
module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias // 添加别名1
      .set("@", resolve("/"))
      .set("@pages", resolve("src/pages"))
      .set("@static", resolve("src/static"))
      .set("@images", resolve("src/static/images"));
  },
};
