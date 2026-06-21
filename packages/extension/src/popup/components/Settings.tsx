import { useEffect, useState } from "react";
import { Toggle } from "./ui";

/** The capture-on-select toggle, persisted directly to chrome.storage.local. */
export function Settings() {
  const [captureOnSelect, setCaptureOnSelect] = useState(true);

  useEffect(() => {
    void chrome.storage.local
      .get({ captureOnSelect: true })
      .then((settings) => setCaptureOnSelect(Boolean(settings.captureOnSelect)));
  }, []);

  const toggle = (value: boolean) => {
    setCaptureOnSelect(value);
    void chrome.storage.local.set({ captureOnSelect: value });
  };

  return <Toggle checked={captureOnSelect} onChange={toggle} label="Capture on select" />;
}
