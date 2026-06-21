// MV3 service workers are killed when idle. While a capture is running we ping a
// cheap API periodically so the worker isn't suspended mid-pipeline.

let timer: ReturnType<typeof setInterval> | null = null;

export function startKeepAlive(): void {
  if (timer !== null) return;
  timer = setInterval(() => {
    void chrome.runtime.getPlatformInfo();
  }, 20_000);
}

export function stopKeepAlive(): void {
  if (timer !== null) {
    clearInterval(timer);
    timer = null;
  }
}
