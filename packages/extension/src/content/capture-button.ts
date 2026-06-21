// The floating "Capture" button shown next to a text selection.

let button: HTMLDivElement | null = null;

export function showCaptureButton(x: number, y: number, onClick: () => void): void {
  hideCaptureButton();

  button = document.createElement("div");
  button.id = "milo-capture-btn";
  button.style.left = `${x}px`;
  button.style.top = `${y + 12}px`;
  button.innerHTML = `<button type="button">✦ Capture</button>`;

  const el = button.querySelector("button");
  el?.addEventListener("click", (event) => {
    event.stopPropagation();
    event.preventDefault();
    onClick();
  });

  document.body.appendChild(button);
}

export function hideCaptureButton(): void {
  button?.remove();
  button = null;
}
