/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "build",
        "ci",
        "chore",
        "revert",
      ],
    ],
    // Giới hạn độ dài title cho dễ đọc
    "header-max-length": [2, "always", 72],
    // (optional) cho phép scope custom theo module/app bạn
    // 'scope-enum': [2, 'always', ['app','auth','ui','api','config','deps','release']],
  },
};
