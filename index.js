const crypto = require('crypto');
const OSS = require("ali-oss");

const core = require('@actions/core');
const github = require('@actions/github');
const glob = require('@actions/glob')


const { api_public_key } = require('./key')

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

const globDeal = async (artifactPath) => {
  const globber = await glob.create(artifactPath);
  const files = await globber.glob();
  return files;
}

try {
  const appId = core.getInput('appId');
  const apiSecretKey = core.getInput('apiSecretKey');
  const artifact = core.getInput('artifact');
  console.log(`Hello ${appId}!`);
  console.log("=======", api_public_key)
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // 1. 网关私钥可以通过 variable 传递
  // console.log("secret key:", apiSecretKey);
  const encrptStr = crypto.publicEncrypt(api_public_key, "I'm KIKI");
  const nativeStr = crypto.privateDecrypt(apiSecretKey, encrptStr);
  console.log("🎉解密成功啦", nativeStr.toString())

  // 2. 使用临时凭证上传 artifact
  // 在客户端使用临时访问凭证初始化OSS客户端，用于临时授权访问OSS资源。
  // 设置客户端请求访问凭证的地址。
  Promise.resolve({
    data:{
      "SecurityToken": "CAIS8wF1q6Ft5B2yfSjIr5bDfdzalb5V5rGtekz6qVAhVblUiLbxpDz2IHBEf3hrAu8at/k/m2BS6vcclqNpQppCXlfYYNBstjuxI6QkO9ivgde8yJBZor/HcDHhJnyW9cvWZPqDP7G5U/yxalfCuzZuyL/hD1uLVECkNpv74vwOLK5gPG+CYCFBGc1dKyZ7tcYeLgGxD/u2NQPwiWeiZygB+CgE0D8jsfjlmpDMtEWC1QOlktV4/dqhfsKWCOB3J4p6XtuP2+h7S7HMyiY56WIRpPct3fcfpmue44HCUwMNskucUfDd99p0NxN0fbQq1Xm1L3BVOpcagAE+H3stMvA7U9DRUpwL1mz0i9b5i8gvfeFLDhYbH9E28nC+ZT0hYk+cjMveBZ0WnBmychYUhBHlMaX9uHBsgS77db48/vf3SgvdpE7mfy2RaqU5+PusYZ6uI4QFOIVJzJIk0MqZV3Z+P9vNonJKGFivDZlQBaTM2KWhXthDx+xGuQ==",
      "AccessKeyId": "STS.NUv6fnxatQsFxjKMPtY6xgsZF",
      "AccessKeySecret": "D4JwF9Maktrrtu1v9ThMrqZzk3kGv7gsNpHu42EfMAAp",
    }
  }).then((token) => {
    const client = new OSS({
      // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
      region: 'oss-cn-hangzhou',
      accessKeyId: token.data.AccessKeyId,
      accessKeySecret: token.data.AccessKeySecret,
      stsToken: token.data.SecurityToken,
      // 填写Bucket名称。
      bucket: "githubforkiki",
    });
    console.log("🎉建立上传 oss 的客户端成功！")

    globDeal(artifact).then(res => {
      console.log("📁结果", JSON.stringify(res));
      const file = res[2];
      // 使用临时访问凭证上传文件。
      // 填写不包含Bucket名称在内的Object的完整路径，例如exampleobject.jpg。
      // 填写本地文件的完整路径，例如D:\\example.jpg。
      client.put(`${appId}.tgz`, artifact).then((res)=>{
        console.log("🎉上传成功", res)
      }).catch(e=>console.log(e))
    })
  });

  // 4. create comment for pr
  github.create

  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  // console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
