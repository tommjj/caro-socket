import EventEmitter = require('events');

// tạo trình lắng nghe sử lý sự kiện server
class AppEmitter extends EventEmitter {}

const appEmitter = new AppEmitter();

export default appEmitter;
