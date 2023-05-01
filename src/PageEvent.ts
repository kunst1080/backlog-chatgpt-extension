class PageEvent {
  private observer: MutationObserver;
  private listeners: { [key: string]: (() => void)[] } = {};

  constructor(root: HTMLElement) {
    this.observer = new MutationObserver(this.handleMutations.bind(this));
    this.observer.observe(root, {
      attributes: false,
      childList: true,
      subtree: true,
    });
  }

  private handleMutations(mutations: MutationRecord[]) {
    for (let mutation of mutations) {
      if (
        mutation.type == "childList" &&
        mutation.target instanceof HTMLElement &&
        mutation.addedNodes.length > 0
      ) {
        this.notifyListeners(mutation.target.id);
      }
    }
  }

  private notifyListeners(id: string) {
    const specificListeners = this.listeners[id];
    if (specificListeners) {
      specificListeners.forEach((listener) => listener());
    }
  }

  public registerListener(eventId: string, listener: () => void) {
    if (!this.listeners[eventId]) {
      this.listeners[eventId] = [];
    }
    this.listeners[eventId].push(listener);
  }
}

export default PageEvent;
