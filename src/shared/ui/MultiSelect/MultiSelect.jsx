import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./MultiSelect.module.css";

export function MultiSelect({
  label,
  placeholder = "Выберите…",
  options = [],   // [{ value, label }]
  value = [],     // массив value
  onChange,       // (nextArray) => void
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selectedSet = useMemo(() => new Set(value), [value]);

  useEffect(() => {
    function onDocMouseDown(e) {
      if (!open) return;
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function onEsc(e) {
      if (!open) return;
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  function toggle(val) {
    const next = new Set(value);
    if (next.has(val)) next.delete(val);
    else next.add(val);
    onChange?.(Array.from(next));
  }

  const displayText = useMemo(() => {
    if (!value.length) return "";
    const map = new Map(options.map((o) => [o.value, o.label]));
    return value.map((v) => map.get(v) ?? v).join(", ");
  }, [value, options]);

  return (
    <div style={{ display: "grid", gap: 6 }}>
      {label ? (
        <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>
          {label}
        </div>
      ) : null}

      <div className={styles.wrap} ref={ref}>
        <div
          className={styles.control}
          role="button"
          tabIndex={0}
          onClick={() => setOpen((s) => !s)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setOpen((s) => !s);
          }}
        >
          <div className={`${styles.value} ${!value.length ? styles.placeholder : ""}`}>
            {value.length ? displayText : placeholder}
          </div>

          <div className={styles.right}>
            <span className={styles.chev}>{open ? "▲" : "▼"}</span>
          </div>
        </div>

        {open ? (
          <div className={styles.menu}>
            <div className={styles.menuInner}>
              {options.map((o) => {
                const checked = selectedSet.has(o.value);

                return (
                  <div
                    key={o.value}
                    className={styles.row}
                    onClick={() => toggle(o.value)}  // ✅ клик по СТРОКЕ выбирает
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => { }}            // чтобы React не ругался
                      readOnly
                    />
                    <span>{o.label}</span>
                  </div>
                );
              })}
            </div>

            <div className={styles.footer}>
              <button
                type="button"
                className={styles.smallBtn}
                onClick={() => onChange?.([])}
              >
                Очистить
              </button>
              <button
                type="button"
                className={styles.smallBtn}
                onClick={() => setOpen(false)}
              >
                Готово
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
