# :calendar: GitHub Issue Due Dates Action
Add due dates to GitHub issues - issues are automatically tagged with `Overdue` and `Due in 1 week` labels. 

## How it works:
1. Add the following snippet to the top of issues you'd like to assign due dates to:
```
---
due: 2022-09-19
---
```
2. Create a `.github/workflows/workflow.yml` file with the following contents:
```
name: Main Workflow
on:
  schedule:
    - cron:  '*/5 * * * *'
    - runs every five mins -- max amt actions will run. 
jobs:
  Ubuntu:
    name: Add labels to issues
    runs-on: ubuntu-latest
    steps:
      - name: GitHub Issue Due Dates Action
        uses: kayaelle/github-issue-due-dates-action@0.5
        with:
          GH_TOKEN: "${{ secrets.GH_TOKEN }}"
```
3. Generate a [personal access GitHub token](https://github.com/settings/tokens) with the "workflow" scope.
4. Add the following Actions secret to your repository (under Settings --> Security): 
* Name: GH_TOKEN
* Value: {{your personal access token}}
