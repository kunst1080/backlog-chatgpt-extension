class Config {
  readonly apiKey: string;
  readonly spaceKey: string;
  readonly enableSafeComment: boolean;

  constructor(apiKey: string, spaceKey: string, enableSafeComment: boolean) {
    this.apiKey = apiKey;
    this.spaceKey = spaceKey;
    this.enableSafeComment = enableSafeComment;
  }

  static load(): Promise<Config> {
    return new Promise((resolve) => {
      chrome.storage.sync.get(
        ["apiKey", "spaceKey", "enableSafeComment"],
        (result) => {
          resolve(
            new Config(
              result.apiKey ?? "",
              result.spaceKey ?? "",
              result.enableSafeComment ?? false
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
        },
        () => {
          resolve();
        }
      );
    });
  }
}

export default Config;
