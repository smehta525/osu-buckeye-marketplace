import { useEffect, useState } from "react";
import "./Toast.css";

type Props = {
  message: string;
  visible: boolean;
  toastKey: number;
};

export default function Toast({ message, visible, toastKey }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setShow(true));
      });
    } else {
      setShow(false);
    }
  }, [visible, toastKey]);

  if (!visible && !show) return null;

  return (
    <div className={`toast ${show ? "toast-visible" : "toast-hidden"}`}>
      <span className="toast-icon">✓</span>
      <span className="toast-message">{message}</span>
    </div>
  );
}