// Lightweight on-page toast (e.g. "Capturing…", "Saved: <title>").

export function showToast(message: string): void {
  const toast = document.createElement("div");
  toast.className = "milo-toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  window.setTimeout(() => {
    toast.style.opacity = "0";
  }, 2600);
  window.setTimeout(() => {
    toast.remove();
  }, 3000);
}
