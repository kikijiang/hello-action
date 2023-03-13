const github = require('@actions/github');
const core = require('@actions/core');
const { context } = github;
const { payload } = context;

export const createCommentForPR = async () => {
  const githubToken = core.getInput('githubToken');
  console.log("⚠️ sectrets.GITHUB_TOKEN", githubToken);
  const octokit = github.getOctokit(githubToken);
  const result = await octokit.rest.pulls.createReviewComment({
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    pull_number: payload.number,
    body: `<img decoding="async" src="https://mdn.alipayobjects.com/portal_d2gd4q/afts/img/A*Lo3eQqp40cAAAAAAAAAAAAAAAQAAAQ/original" width="50px">`,
    commit_id: context.sha,
    path: '',
    line: 2,
  })
  console.log("🎉😄创建 comment 成功", JSON.stringify(result))
}
