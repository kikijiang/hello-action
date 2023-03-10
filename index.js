const crypto = require('crypto');

const core = require('@actions/core');
const github = require('@actions/github');
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

try {
  const appId = core.getInput('appId');
  const apiSecretKey = core.getInput('apiSecretKey');
  console.log(`Hello ${appId}!`);
  console.log("=======", api_public_key)
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  console.log("secret key:", apiSecretKey);
  const encrptStr = crypto.publicEncrypt(api_public_key, "I'm KIKI");
  const realPrivateKey = 'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCEXvy3seJkjVV30SphhYg7jtRiFjN2FlD0ksGbgdGuh0H96C8Nzar2QPj2u3kqns+m8X2W3EYzAvSrsKLFks+/K9vk0RcrE8KxO4XMbCxETkJGUqgLqkaTHTujCw0Wl6/nZ0JoracoU4l4wu5HSoAhQ9Xl17NTCdvIfAliI05TJhai3+R539By2oYaPKh4hDQ2PzAWD8AE84EkJa1h/Tbqj3xXzWY+puXJP1iGRRI0yFRqjtFItYjzhO9exnTBnMuKGSYFAcxNFVmlhM2JX+Lnn8DQ1JYHi376neWeNRaafVN5X/TEPiafaPBze1qXJ46CI3fpbm8QuJgAhev20+mnAgMBAAECggEAVY3nHPs17fODSBvCnqFlucjI8FSVEj++NzUbOV0gnwMA3hDRSMSjOOIph58H40odwDLZD0ZzgMjqRoW1zqji6RZ521xg8xCkh1SHV+aafdNu9nC5+EAnuTHtt6WO4glMQe31eB60qVXExm6G/0Dhq55ig1l0p7j5eozgq7NSDl7e6+b2kK21AcDddUzJ6BQJM/sR6jVpewcjoP7aw7po4UZfqpFHtkzGk+HEkkZxgYUV6Ew1dnNUmSZBSWCwoWFVrYh1UT+aVKW8Wf0bwQHMji7CRYIs5R/XIaZTusQTKzier0jB9NKB1+oenB30+hA/EgyYGyg/MVWoOcVNNndO4QKBgQDhZs9RBHkcYs1I+HdocwzfDBp3F2gL5cwfG1n5DO4FhuVEWkkqJeb85Nl1dPEAvp0TKWLmzfuZuR+dQsu8YBbTt0y/Vsgm/v7jRxtoqx0oEVoDGUpalXIhjj+kQxv4UMrCDJ7OM7aUUzeQjSmPY3qYXK6DD7Qd8KcKgK8POwXV/wKBgQCWVypeJ7ap6Zox/H3IJRlt/fyCIlp3efBbX5SlxoRghSnquL7PDvGbpkEdPoqYk0We/xa6ZD0mQmR77AdT0B+nTcBIykMyhWldN2u9k8fQtAuAQ0SkcQTTqnDD0jWAAc18xJjqh11PS1vrU7ID6oDAOPGgG19hhLQYYzgWc9t8WQKBgCSLyN13/jMOCf7k2meDD/kyOzBICUS0k64Pfz0UTZtzzcSRZv+Aeb1TVbbnqRPX1BwBP9nwV/UKwQd8hxAZ/FmDhNwZNAaunaE4LEeCRw3yEkgiV53sUT8Dk2oMv4I5h0aDSVRhqh7Oh1nWqYBoPr5peJojd67LECpxxvCPP1j9AoGAcwua4VhUoOuhUpUcD9fMAO62l0MApaMLenDHCKDEVjQw4myjn0GZQ/nSpDViy+UPBt+/nbztSmTODkKNTObcAiQue8VD7NpIycuKSBVZd+z/TBSt54SRJASurDslM6Ktg8fSGM6jafWKDqgKdpKyGea5iELKF478Xhk3J39bO2kCgYEAxX0uyemjjdnIP02MAuL1NmwCVIeHokDeuSrmOcNxCXTaqACxZzNVACxgaNqyd1qp+ALTDH7wBgnXKagG9pQl2jkg24dEomWpvUoM38+EBZ28OVHyyz8tyLdgDuYWOmQ7LRonSKVGAqVkGd8xDbf/bBls/J9xggUiKB58vAU0GTA='
  const nativeStr = crypto.privateDecrypt(realPrivateKey, encrptStr);
  console.log("🎉解密成功啦", nativeStr)
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
