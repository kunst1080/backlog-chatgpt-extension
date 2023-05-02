class Config {
  readonly apiKey: string;
  readonly spaceKey: string;
  readonly enableSafeComment: boolean;
  readonly enableIssueSummary: boolean;

  constructor(
    apiKey: string,
    spaceKey: string,
    enableSafeComment: boolean,
    enableIssueSummary: boolean
  ) {
    this.apiKey = apiKey;
    this.spaceKey = spaceKey;
    this.enableSafeComment = enableSafeComment;
    this.enableIssueSummary = enableIssueSummary;
  }

  static load(): Promise<Config> {
    return new Promise((resolve) => {
      chrome.storage.sync.get(
        ["apiKey", "spaceKey", "enableSafeComment", "enableIssueSummary"],
        (result) => {
          resolve(
            new Config(
              result.apiKey ?? "",
              result.spaceKey ?? "",
              result.enableSafeComment ?? false,
              result.enableIssueSummary ?? false
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
        },
        () => {
          resolve();
        }
      );
    });
  }
}

export default Config;
