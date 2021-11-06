[![CircleCI](https://circleci.com/gh/GeroVeni/meditatii-server/tree/master.svg?style=svg&circle-token=3ddbb3f49fa0f1c29bb03b189207bf315c4892a1)](https://circleci.com/gh/GeroVeni/meditatii-server/tree/master)

# Meditatii Frontend

## Developing

In order to get started, clone the repo to your local machine.

To contribute, raise a PR from a new branch. Creating a PR automatically triggers a github workflow that deploys the branch (using Firebase) to a test location and generates a link to the version of the site. Merging the PR, will automatically deploy the changes to the live version of the site.

## Local testing

To test the site locally, before pushing the new branch and opening a PR, you can use the following command and access the website at <http://localhost:5000>.

```bash
firebase emulators:start
```

## Naming conventions

### Commit messages

For commit messages, we follow the guidelines in [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/). In summary, commit messages are of the form `<type>: <description>` and they do not use capital letters (unless necessary e.g. for acronyms, or names and words that have a capital letter). The `<type>` can be one of the following:

* `feat`: The commit adds a new feature
* `fix`: The commit fixes a a bug
* `test`: The commit adds or updates tests, or is test related.
* `docs`: The commit adds or updates documentation, or is related to documentation.
* `refactor`: The commit makes refactoring changes to the code, that do not change behaviour and do not fix any issues.
* `ci`: The commit adds or updates ci (circular integration) workflows, or is related to ci.
* `chore`: For chores and tasks that do not fall in the above categories.

If a commit belongs to more than one categories, first try and split it into two (or more) separate commits. If that is not possible, use the major focus of the commit as the commit type and description.

Examples:

* `feat: add offers endpoints`
* `fix: update order number on payment failure`
* `test: add tests for messages and tutors databases`

### Branch names

For branch names, we loosely follow a pattern similar to conventional commits `<type>/<description>`. Branch names should use dashes(`-`) for spaces and should be short yet descriptive of the changes in the branch. If the branch contains one commit, the branch name, should closely resemble the commit name (e.g. commit name: `feat: add offers endpoints`, branch name: `feat/add-offers`). If the branch contains more than one commits, the main focus of the changes in the branch should be used.

Examples:

* `feat/add-offers`
* `fix/update-order-number`
* `test/messages-db`
