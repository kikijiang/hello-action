/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 806:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 946:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(806);
const github = __nccwpck_require__(946);

/**
 * 1. input：小程序应用 ID，API 调用的身份信息
 * 2. 内部逻辑：
 *  2.0 调用 github api，创建 pr 的评论，评论内容是 loading 状态
 *  2.1 调用行星 API，获取阿里云 OSS 的临时访问凭证
 *  2.2 调用阿里云 nodejs 的 SDK 上传本地文件到阿里云 OSS
 *  2.3 根据 pull_request 的类型，判断是否是第一次创建 pr，调用不同的行星 API（或者传不同的参数）
 *  2.4 调用行星轮询接口，直到获取到预览码，调用 github api 更新预览码评论
 * 3. output：暂无
 */

try {
  // `who-to-greet` input defined in action metadata file
  const appId = core.getInput('appId');
  const apiSecretKey = core.getInput('apiSecretKey');
  console.log(`Hello ${appId}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  console.log("secret key:", apiSecretKey)
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}

})();

module.exports = __webpack_exports__;
/******/ })()
;