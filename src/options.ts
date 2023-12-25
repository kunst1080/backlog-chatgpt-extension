import Config from "./Config";

const apiKey = <HTMLInputElement>document.getElementById("api-key");
const spaceKey = <HTMLInputElement>document.getElementById("space-key");
const enableSafeComment = <HTMLInputElement>(
  document.getElementById("enable-safe-comment")
);
const enableIssueSummary = <HTMLInputElement>(
  document.getElementById("enable-issue-summary")
);
const enableIssueTitle = <HTMLInputElement>(
  document.getElementById("enable-issue-title")
);

// 保存された設定を読み込む
Config.load().then((config) => {
  apiKey.value = config.apiKey;
  spaceKey.value = config.spaceKey;
  enableSafeComment.checked = config.enableSafeComment;
  enableIssueSummary.checked = config.enableIssueSummary;
  enableIssueTitle.checked = config.enableIssueTitle;
});

// 設定を保存する
document
  .getElementById("options-form")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();
    await new Config(
      apiKey.value,
      spaceKey.value,
      enableSafeComment.checked,
      enableIssueSummary.checked,
      enableIssueTitle.checked
    ).save();
    console.log("設定が保存されました");
  });
