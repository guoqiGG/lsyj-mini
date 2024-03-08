// 手机号中间4位加* 例子 184****6122
const phoneNumberAddStar = (params) => {
  var phone = params.toString().replace(/^(.{3})(?:\d+)(.{4})$/, "$1****$2");
  return phone;
};

export const util = {
  phoneNumberAddStar,
};

module.exports = util;
