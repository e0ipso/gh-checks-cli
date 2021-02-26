module.exports = {
  hooks: {
    'commit-msg': 'commitlint -e $HUSKY_GIT_PARAMS',
    'pre-commit': 'npm run-script lint-staged',
    'pre-push': 'npm run-script test:ci',
  },
};
