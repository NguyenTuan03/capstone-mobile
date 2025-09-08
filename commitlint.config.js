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
    "type-empty": [2, "never"],
    "subject-empty": [2, "never"],
    "header-max-length": [2, "always", 72],
  },
  prompt: {
    questions: {
      type: {
        description: "Chọn loại commit:",
        enum: {
          feat: { description: "✨  Tính năng mới", title: "Features" },
          fix: { description: "🐛  Sửa bug", title: "Bug Fixes" },
          docs: { description: "📝  Tài liệu", title: "Documentation" },
          style: {
            description: "💄  Format/style (không ảnh hưởng logic)",
            title: "Styles",
          },
          refactor: {
            description: "♻️  Refactor code",
            title: "Code Refactoring",
          },
          perf: {
            description: "⚡️  Cải thiện hiệu năng",
            title: "Performance",
          },
          test: { description: "✅  Thêm/chỉnh test", title: "Tests" },
          build: { description: "📦  Build system, deps", title: "Builds" },
          ci: {
            description: "🤖  CI/CD config",
            title: "Continuous Integrations",
          },
          chore: {
            description: "🔧  Việc lặt vặt (không ảnh hưởng code)",
            title: "Chores",
          },
          revert: { description: "⏪  Revert commit", title: "Reverts" },
        },
      },
    },
  },
};
