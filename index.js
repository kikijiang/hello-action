const crypto = require('crypto');

const core = require('@actions/core');
const github = require('@actions/github');
const { api_public_key, api_private_key } = require('./key')

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
  const appId = core.getInput('appId');
  const apiSecretKey = core.getInput('apiSecretKey');
  console.log(`Hello ${appId}!`);
  console.log("=======", api_public_key)
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  console.log("secret key:", apiSecretKey);
  const encrptStr = crypto.publicEncrypt(api_public_key, "I'm KIKI");
  const nativeStr = crypto.privateDecrypt(api_private_key, encrptStr);
  console.log("🎉解密成功啦", nativeStr)
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
