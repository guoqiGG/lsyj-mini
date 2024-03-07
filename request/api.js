export default class Request {
    http(param) {
        let url = param.url;
        let method = param.method;
        let header = param.header || {};
        let data = Object.assign(param.data || {});
        let hideLoading = param.hideLoading || false;
    }
}