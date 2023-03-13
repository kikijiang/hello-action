const github = require('@actions/github');
const core = require('@actions/core');
const { context } = github;

export const createCommentForPR = async () => {
  console.log("⚠️ github.context.token", context.token);
  const octokit = github.getOctokit(context.token);
  const result = await octokit.rest.pulls.createReviewComment({
    owner: context.repository_owner,
    repo: context.eventName,
    pull_number: context.event.bunmer,
    body: `<img decoding="async" src="https://mdn.alipayobjects.com/portal_d2gd4q/afts/img/A*Lo3eQqp40cAAAAAAAAAAAAAAAQAAAQ/original" width="50px">`,
    commit_id: context.sha,
    path: '',
    line: 2,
  })
  console.log("🎉😄创建 comment 成功", JSON.stringify(result))
}