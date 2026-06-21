// Styles for the on-page UI. Injected as a single <style> tag so the content
// script stays self-contained (it can't pull in the popup's Tailwind build).
// IDs/classes are prefixed `milo-` to avoid clashing with the host page.

const CSS = `
#milo-capture-btn {
  position: absolute;
  z-index: 2147483000;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
#milo-capture-btn button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background: #4f46e5;
  border: none;
  border-radius: 9px;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(79, 70, 229, 0.35);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
#milo-capture-btn button:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 26px rgba(79, 70, 229, 0.45);
}
.milo-toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 2147483001;
  max-width: 320px;
  padding: 12px 16px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #18181b;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-left: 3px solid #4f46e5;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  transition: opacity 0.3s ease;
}
`;

export function injectStyles(): void {
  if (document.getElementById("milo-styles")) return;
  const style = document.createElement("style");
  style.id = "milo-styles";
  style.textContent = CSS;
  document.head.appendChild(style);
}
