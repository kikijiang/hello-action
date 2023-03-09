const core = require('@actions/core');
const github = require('@actions/github');

/**
 * 1. input：小程序应用 ID，API 调用的身份信息
 * 2. 内部逻辑：调用行星 API
 * 3. output：暂无
 */

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('appId');
  console.log(`Hello ${nameToGreet}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
