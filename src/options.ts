const apiKey = <HTMLInputElement>document.getElementById("api-key");
const spaceKey = <HTMLInputElement>document.getElementById("space-key");
const safeComment = <HTMLInputElement>document.getElementById("safe-comment");

// 保存された設定を読み込む
chrome.storage.sync.get(["apiKey", "spaceKey", "safeComment"], (result) => {
  apiKey.value = result.apiKey ?? "";
  spaceKey.value = result.spaceKey ?? "";
  safeComment.checked = result.safeComment ?? false;
});

// 設定を保存するイベントハンドラを追加
document.getElementById("options-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  chrome.storage.sync.set(
    {
      apiKey: apiKey.value,
      spaceKey: spaceKey.value,
      safeComment: safeComment.checked,
    },
    () => {
      console.log("設定が保存されました");
    }
  );
});
