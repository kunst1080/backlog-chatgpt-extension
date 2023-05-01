import Config from "./Config";

const apiKey = <HTMLInputElement>document.getElementById("api-key");
const spaceKey = <HTMLInputElement>document.getElementById("space-key");
const enableSafeComment = <HTMLInputElement>(
  document.getElementById("enable-safe-comment")
);

// 保存された設定を読み込む
Config.load().then((config) => {
  apiKey.value = config.apiKey;
  spaceKey.value = config.spaceKey;
  enableSafeComment.checked = config.enableSafeComment;
});

// 設定を保存する
document
  .getElementById("options-form")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();
    await new Config(
      apiKey.value,
      spaceKey.value,
      enableSafeComment.checked
    ).save();
    console.log("設定が保存されました");
  });
