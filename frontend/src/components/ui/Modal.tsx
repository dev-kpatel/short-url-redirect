// components/ui/Modal.tsx
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  /** Optional title id for aria-labelledby */
  titleId?: string;
  /** Children can be ReactNodes or a render-prop receiving { close } */
  children: React.ReactNode | ((api: { close: () => void }) => React.ReactNode);
};

export function Modal({ open, onClose, titleId, children }: ModalProps) {
  const firstFocusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    // (basic scroll lock)
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // focus
    setTimeout(() => firstFocusRef.current?.focus(), 0);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const content =
    typeof children === "function" ? (children as any)({ close: onClose }) : children;

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="w-full max-w-3xl rounded-xl bg-white shadow-lg outline-none"
          tabIndex={-1}
          ref={firstFocusRef}
        >
          {content}
        </div>
      </div>
    </div>,
    document.body
  );
}
