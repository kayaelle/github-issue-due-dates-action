import * as core from '@actions/core';
import {context} from '@actions/github';
import Octokit from './integrations/Octokit';
import {datesToDue} from './utils/dateUtils';
import {OVERDUE_TAG_NAME, NEXT_WEEK_TAG_NAME} from './constants';

export const run = async () => {
  try {
    const githubToken = core.getInput('GH_TOKEN');
    if (!githubToken) {
      throw new Error('Missing GH_TOKEN environment variable');
    }

    const ok = new Octokit(githubToken);

    const issues = await ok.listAllOpenIssues(context.repo.owner, context.repo.repo);
    const results = await ok.getIssuesWithDueDate(issues);
    for (const issue of results) {
      const daysUtilDueDate = await datesToDue(issue.due);

      // Between 0 and 1 day until due date
      if (daysUtilDueDate <= 1 && daysUtilDueDate > 0) {
        await ok.addLabelToIssue(context.repo.owner, context.repo.repo, issue.number, [TOMORROW_TAG_NAME]);
      }

      // Between 1 and 2 days until due date
      if (daysUtilDueDate <= 2 && daysUtilDueDate > 1) {
        await ok.addLabelToIssue(context.repo.owner, context.repo.repo, issue.number, [TWO_DAYS_TAG_NAME]);
      }

       // Between 2 and 3 days until due date
      if (daysUtilDueDate <= 3 && daysUtilDueDate > 2) {
        await ok.addLabelToIssue(context.repo.owner, context.repo.repo, issue.number, [THREE_DAYS_TAG_NAME]);
      }

       // Between 3 and 5 days until due date
      if (daysUtilDueDate <= 5 && daysUtilDueDate > 3) {
        await ok.addLabelToIssue(context.repo.owner, context.repo.repo, issue.number, [FIVE_DAYS_TAG_NAME]);
      }

      // Between 0 and 7 days until due date
      if (daysUtilDueDate <= 7 && daysUtilDueDate > 0) {
        await ok.addLabelToIssue(context.repo.owner, context.repo.repo, issue.number, [NEXT_WEEK_TAG_NAME]);
      }
      // Issue is due
      if (daysUtilDueDate <= 0) {
        await ok.removeLabelFromIssue(context.repo.owner, context.repo.repo, NEXT_WEEK_TAG_NAME, issue.number);
        await ok.addLabelToIssue(context.repo.owner, context.repo.repo, issue.number, [OVERDUE_TAG_NAME]);
      }
    }
    return {
      ok: true,
      issuesProcessed: results.length,
    }
  } catch (e) {
    core.setFailed(e.message);
    throw e;
  }
};

run();
