class Config {
  readonly apiKey: string;
  readonly spaceKey: string;
  readonly enableSafeComment: boolean;
  readonly enableIssueSummary: boolean;
  readonly enableIssueTitle: boolean;

  constructor(
    apiKey: string,
    spaceKey: string,
    enableSafeComment: boolean,
    enableIssueSummary: boolean,
    enableIssueTitle: boolean
  ) {
    this.apiKey = apiKey;
    this.spaceKey = spaceKey;
    this.enableSafeComment = enableSafeComment;
    this.enableIssueSummary = enableIssueSummary;
    this.enableIssueTitle = enableIssueTitle;
  }

  static load(): Promise<Config> {
    return new Promise((resolve) => {
      chrome.storage.sync.get(
        [
          "apiKey",
          "spaceKey",
          "enableSafeComment",
          "enableIssueSummary",
          "enableIssueTitle",
        ],
        (result) => {
          resolve(
            new Config(
              result.apiKey ?? "",
              result.spaceKey ?? "",
              result.enableSafeComment ?? false,
              result.enableIssueSummary ?? false,
              result.enableIssueTitle ?? false
            )
          );
        }
      );
    });
  }

  save(): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.sync.set(
        {
          apiKey: this.apiKey,
          spaceKey: this.spaceKey,
          enableSafeComment: this.enableSafeComment,
          enableIssueSummary: this.enableIssueSummary,
          enableIssueTitle: this.enableIssueTitle,
        },
        () => {
          resolve();
        }
      );
    });
  }
}

export default Config;
