import { useState, useEffect } from "react";
import { CatalogItem, SEASONS, STYLES, GENDERS } from "./types";

interface EditModalProps {
  item: CatalogItem;
  onSave: (updated: CatalogItem) => void;
  onClose: () => void;
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b6b80", marginBottom: 6, fontWeight: 600 }}>
      {children}
    </p>
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%", boxSizing: "border-box",
        background: "#16161f",
        border: `1.5px solid ${focused ? "#7B7EC8" : "#2a2a3e"}`,
        borderRadius: 8, color: "#e8e8f0",
        padding: "9px 12px", fontSize: 14,
        fontFamily: "inherit", outline: "none",
        transition: "border-color 0.18s",
      }}
    />
  );
}

function SelectInput<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: readonly T[] }) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%", boxSizing: "border-box",
        background: "#16161f",
        border: `1.5px solid ${focused ? "#7B7EC8" : "#2a2a3e"}`,
        borderRadius: 8, color: "#e8e8f0",
        padding: "9px 12px", fontSize: 14,
        fontFamily: "inherit", outline: "none",
        cursor: "pointer", transition: "border-color 0.18s",
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b6b80' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 12px center",
        paddingRight: 32,
      }}
    >
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

export default function EditModal({ item, onSave, onClose }: EditModalProps) {
  const [draft, setDraft] = useState<CatalogItem>(item);

  // закрытие по Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const set = <K extends keyof CatalogItem>(key: K, value: CatalogItem[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const isValid = draft.name.trim() !== "";

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 100,
        animation: "fadeIn 0.15s ease",
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>

      <div style={{
        background: "#13131c",
        border: "1px solid #2a2a3e",
        borderRadius: 16,
        padding: "28px 28px 24px",
        width: 480, maxWidth: "calc(100vw - 32px)",
        animation: "slideUp 0.2s ease",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#7B7EC8", fontWeight: 700, marginBottom: 4 }}>
              Каталог
            </p>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#f0f0f8", margin: 0 }}>
              Редактировать предмет
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "#1e1e2e", border: "1px solid #2a2a3e",
              borderRadius: 8, color: "#6b6b80",
              width: 32, height: 32, display: "flex",
              alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: 18, lineHeight: 1,
              transition: "color 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#e8e8f0"; e.currentTarget.style.borderColor = "#4a4a6a"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#6b6b80"; e.currentTarget.style.borderColor = "#2a2a3e"; }}
          >
            ×
          </button>
        </div>

        {/* Preview photo */}
        {draft.imageUrl && (
          <div style={{ marginBottom: 20, borderRadius: 10, overflow: "hidden", height: 140, background: "#1a1a28" }}>
            <img
              src={draft.imageUrl}
              alt={draft.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }}
            />
          </div>
        )}

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <Label>Название</Label>
            <TextInput value={draft.name} onChange={(v) => set("name", v)} placeholder="Белая рубашка" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <Label>Сезон</Label>
              <SelectInput value={draft.season} onChange={(v) => set("season", v)} options={SEASONS} />
            </div>
            <div>
              <Label>Пол</Label>
              <SelectInput value={draft.gender} onChange={(v) => set("gender", v)} options={GENDERS} />
            </div>
          </div>

          <div>
            <Label>Стиль</Label>
            <SelectInput value={draft.style} onChange={(v) => set("style", v)} options={STYLES} />
          </div>

          <div>
            <Label>URL фото</Label>
            <TextInput value={draft.imageUrl ?? ""} onChange={(v) => set("imageUrl", v)} placeholder="https://..." />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "9px 20px", borderRadius: 8,
              border: "1.5px solid #2a2a3e", background: "transparent",
              color: "#8a8a9a", fontSize: 14, fontFamily: "inherit", cursor: "pointer",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#4a4a6a"; e.currentTarget.style.color = "#c0c0d0"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2a2a3e"; e.currentTarget.style.color = "#8a8a9a"; }}
          >
            Отмена
          </button>
          <button
            type="button"
            disabled={!isValid}
            onClick={() => onSave(draft)}
            style={{
              padding: "9px 24px", borderRadius: 8, border: "none",
              background: isValid ? "linear-gradient(135deg, #5254a3, #7B7EC8)" : "#1e1e2e",
              color: isValid ? "#fff" : "#4a4a60",
              fontSize: 14, fontFamily: "inherit", fontWeight: 600,
              cursor: isValid ? "pointer" : "not-allowed",
              transition: "opacity 0.18s",
            }}
            onMouseEnter={(e) => { if (isValid) e.currentTarget.style.opacity = "0.88"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
