import { useState, useEffect } from "react";
import { CatalogItem, UpdateCatalogRequest } from "./types";

interface DictItem {
  id: number;
  name: string;
  hex?: string;
}

interface EditModalProps {
  item: CatalogItem;
  onSave: (updated: CatalogItem) => void;
  onClose: () => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────
function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

// ── UI primitives (те же что в AddItemForm) ────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b6b80", marginBottom: 6, fontWeight: 600 }}>
      {children}
    </p>
  );
}

function TextInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      value={value}
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

function StyledSelect({ value, onChange, options, placeholder }: {
  value: number; onChange: (v: number) => void; options: DictItem[]; placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(Number(e.target.value))}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%", boxSizing: "border-box",
        background: "#16161f",
        border: `1.5px solid ${focused ? "#7B7EC8" : "#2a2a3e"}`,
        borderRadius: 8, color: value ? "#e8e8f0" : "#4a4a60",
        padding: "9px 32px 9px 12px", fontSize: 14,
        fontFamily: "inherit", outline: "none", cursor: "pointer",
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%236b6b80' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
        transition: "border-color 0.18s",
      }}
    >
      {placeholder && <option value="" disabled>{placeholder}</option>}
      {options.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
    </select>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "5px 14px", borderRadius: 20,
        border: active ? "1.5px solid #7B7EC8" : "1.5px solid #3a3a4a",
        background: active ? "#2e2e52" : "transparent",
        color: active ? "#c0bfff" : "#8a8a9a",
        fontSize: 13, fontFamily: "inherit",
        cursor: "pointer", transition: "all 0.18s ease", whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

function ColorSwatch({ hex, name, active, onClick }: { hex: string; name: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      title={name}
      onClick={onClick}
      style={{
        width: 28, height: 28, borderRadius: "50%",
        background: hex || "#ccc", padding: 0,
        border: active ? "2.5px solid #7B7EC8" : "2px solid transparent",
        outline: active ? "2px solid #2e2e52" : "none",
        outlineOffset: 1, cursor: "pointer",
        transition: "all 0.15s",
      }}
    />
  );
}

// ── Component ──────────────────────────────────────────────────────────────
export default function EditModal({ item, onSave, onClose }: EditModalProps) {
  const [stylesList,  setStylesList]  = useState<DictItem[]>([]);
  const [colorsList,  setColorsList]  = useState<DictItem[]>([]);
  const [seasonsList, setSeasonsList] = useState<DictItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [draft, setDraft] = useState<UpdateCatalogRequest>({
    id:         item.id,
    name:       item.name,
    gender:     item.gender,
    image_url:  item.imageUrl,
    season_id:  undefined,
    style_ids:  [],
    color_ids:  [],
  });

  // ── Fetch dictionaries ──
  useEffect(() => {
    const fetchDicts = async () => {
      try {
        const [stylesRes, colorsRes, seasonsRes] = await Promise.all([
          fetch("http://localhost:8080/api/v1/reference/styles",  { credentials: "include" }),
          fetch("http://localhost:8080/api/v1/reference/colors",  { credentials: "include" }),
          fetch("http://localhost:8080/api/v1/reference/seasons", { credentials: "include" }),
        ]);

        const styles  = await stylesRes.json();
        const colors  = await colorsRes.json();
        const seasons = await seasonsRes.json();

        const safeStyles  = Array.isArray(styles)  ? styles  : [];
        const safeColors  = Array.isArray(colors)  ? colors  : [];
        const safeSeasons = Array.isArray(seasons) ? seasons : [];

        setStylesList(safeStyles);
        setColorsList(safeColors);
        setSeasonsList(safeSeasons);

        setDraft((prev) => ({
          ...prev,
          season_id: safeSeasons.find((s: DictItem) => s.name === item.season)?.id,
          style_ids: safeStyles.filter((s: DictItem) => s.name === item.style).map((s: DictItem) => s.id),
        }));
      } catch (e) {
        console.error("Ошибка загрузки справочников", e);
      }
    };
    fetchDicts();
  }, [item]);

  // ── Escape ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // ── Update API (без изменений) ──
  const handleUpdate = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/v1/catalog/${draft.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(draft),
      });
      if (!response.ok) throw new Error();

      const updatedItem: CatalogItem = {
        id:       draft.id,
        name:     draft.name,
        gender:   draft.gender || "",
        imageUrl: draft.image_url,
        season:   seasonsList.find((s) => s.id === draft.season_id)?.name || "",
        style:    stylesList.find((s) => s.id === draft.style_ids?.[0])?.name || "",
      };

      onSave(updatedItem);
      onClose();
    } catch (e) {
      console.error(e);
      alert("Ошибка обновления");
    } finally {
      setLoading(false);
    }
  };

  const isValid = draft.name?.trim() !== "";

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
    >
      <style>{`@keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }`}</style>
      <div style={{ background: "#13131c", border: "1px solid #2a2a3e", borderRadius: 16, padding: "24px 24px 20px", width: 480, maxWidth: "calc(100vw - 32px)", maxHeight: "90vh", overflowY: "auto", animation: "slideUp 0.2s ease" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#7B7EC8", fontWeight: 700, marginBottom: 4 }}>Каталог</p>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#f0f0f8", margin: 0 }}>Редактировать предмет</h2>
          </div>
          <button type="button" onClick={onClose}
            style={{ background: "#1e1e2e", border: "1px solid #2a2a3e", borderRadius: 8, color: "#6b6b80", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18 }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#e8e8f0"; e.currentTarget.style.borderColor = "#4a4a6a"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#6b6b80"; e.currentTarget.style.borderColor = "#2a2a3e"; }}
          >×</button>
        </div>

        {/* Preview */}
        {draft.image_url && (
          <div style={{ marginBottom: 16, borderRadius: 10, overflow: "hidden", height: 130, background: "#1a1a28" }}>
            <img src={draft.image_url} alt={draft.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Название */}
          <div>
            <Label>Название</Label>
            <TextInput value={draft.name} onChange={(v) => setDraft((p) => ({ ...p, name: v }))} />
          </div>

          {/* Сезон */}
          <div>
            <Label>Сезон</Label>
            <StyledSelect
              value={draft.season_id ?? 0}
              onChange={(v) => setDraft((p) => ({ ...p, season_id: v }))}
              options={seasonsList}
              placeholder="Выбери сезон"
            />
          </div>

          {/* Стили — чипы */}
          <div>
            <Label>Стили</Label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {stylesList.map((s) => (
                <Chip
                  key={s.id}
                  label={s.name}
                  active={(draft.style_ids ?? []).includes(s.id)}
                  onClick={() => setDraft((p) => ({ ...p, style_ids: toggle(p.style_ids ?? [], s.id) }))}
                />
              ))}
            </div>
          </div>

          {/* Цвета — свотчи */}
          <div>
            <Label>Цвета</Label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {colorsList.map((c) => (
                <ColorSwatch
                  key={c.id}
                  hex={c.hex ?? "#ccc"}
                  name={c.name}
                  active={(draft.color_ids ?? []).includes(c.id)}
                  onClick={() => setDraft((p) => ({ ...p, color_ids: toggle(p.color_ids ?? [], c.id) }))}
                />
              ))}
            </div>
          </div>

          {/* URL фото */}
          <div>
            <Label>URL фото</Label>
            <TextInput value={draft.image_url ?? ""} onChange={(v) => setDraft((p) => ({ ...p, image_url: v }))} />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
          <button type="button" onClick={onClose}
            style={{ padding: "9px 20px", borderRadius: 8, border: "1.5px solid #2a2a3e", background: "transparent", color: "#8a8a9a", fontSize: 14, fontFamily: "inherit", cursor: "pointer" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#4a4a6a"; e.currentTarget.style.color = "#c0c0d0"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2a2a3e"; e.currentTarget.style.color = "#8a8a9a"; }}
          >Отмена</button>
          <button type="button" disabled={!isValid || loading} onClick={handleUpdate}
            style={{ padding: "9px 24px", borderRadius: 8, border: "none", background: isValid ? "linear-gradient(135deg, #5254a3, #7B7EC8)" : "#1e1e2e", color: isValid ? "#fff" : "#4a4a60", fontSize: 14, fontFamily: "inherit", fontWeight: 600, cursor: isValid && !loading ? "pointer" : "not-allowed", opacity: loading ? 0.6 : 1, transition: "opacity 0.18s" }}
            onMouseEnter={(e) => { if (isValid && !loading) e.currentTarget.style.opacity = "0.88"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = loading ? "0.6" : "1"; }}
          >{loading ? "Сохраняем..." : "Сохранить"}</button>
        </div>
      </div>
    </div>
  );
}