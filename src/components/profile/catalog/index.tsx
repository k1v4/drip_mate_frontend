import { useState, useMemo } from "react";
import { CatalogItem, MOCK_ITEMS, SEASONS, STYLES, GENDERS, Season, Style, Gender } from "./types";
import EditModal from "./EditModal";

// ── Season badge color map ─────────────────────────────────────────────────
const SEASON_COLORS: Record<string, { bg: string; color: string }> = {
  "Весна":      { bg: "#1a2e1f", color: "#6bcf7f" },
  "Лето":       { bg: "#2a2510", color: "#d4b44a" },
  "Осень":      { bg: "#2a1a0e", color: "#d4844a" },
  "Зима":       { bg: "#101e2a", color: "#4ab0d4" },
  "Демисезон":  { bg: "#1e1a2a", color: "#a47bd4" },
};

const GENDER_ICONS: Record<string, string> = {
  "Мужской": "♂",
  "Женский": "♀",
  "Унисекс": "⚥",
};

// ── Sub-components ─────────────────────────────────────────────────────────
function Badge({ children, bg, color }: { children: React.ReactNode; bg: string; color: string }) {
  return (
    <span style={{
      background: bg, color, fontSize: 11, fontWeight: 600,
      padding: "3px 9px", borderRadius: 20, whiteSpace: "nowrap",
      letterSpacing: "0.03em",
    }}>
      {children}
    </span>
  );
}

function FilterSelect<T extends string>({
  value, onChange, options, placeholder,
}: {
  value: T | ""; onChange: (v: T | "") => void; options: readonly T[]; placeholder: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T | "")}
      style={{
        background: "#16161f", border: "1.5px solid #2a2a3e",
        borderRadius: 8, color: value ? "#e8e8f0" : "#4a4a60",
        padding: "8px 32px 8px 12px", fontSize: 13,
        fontFamily: "inherit", outline: "none", cursor: "pointer",
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%236b6b80' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center",
        transition: "border-color 0.18s",
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "#7B7EC8")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "#2a2a3e")}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

// ── CatalogRow ─────────────────────────────────────────────────────────────
interface CatalogRowProps {
  item: CatalogItem;
  onEdit: (item: CatalogItem) => void;
  onDelete: (id: string) => void;
}

function CatalogRow({ item, onEdit, onDelete }: CatalogRowProps) {
  const [hovered, setHovered] = useState(false);
  const seasonStyle = SEASON_COLORS[item.season] ?? { bg: "#1e1e2e", color: "#8a8a9a" };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 16,
        padding: "12px 16px",
        background: hovered ? "#16161f" : "transparent",
        borderRadius: 10,
        borderBottom: "1px solid #1a1a28",
        transition: "background 0.15s",
        cursor: "default",
      }}
    >
      {/* Photo */}
      <div style={{
        width: 56, height: 56, borderRadius: 8,
        overflow: "hidden", flexShrink: 0,
        background: "#1e1e2e",
        border: "1px solid #2a2a3e",
      }}>
        {item.imageUrl
          ? <img src={item.imageUrl} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#3a3a50", fontSize: 22 }}>✦</div>
        }
      </div>

      {/* Name */}
      <div style={{ flex: "2 1 0", minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#e8e8f0", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {item.name}
        </p>
      </div>

      {/* Season */}
      <div style={{ flex: "1 1 0", display: "flex" }}>
        <Badge bg={seasonStyle.bg} color={seasonStyle.color}>{item.season}</Badge>
      </div>

      {/* Style */}
      <div style={{ flex: "1 1 0" }}>
        <span style={{ fontSize: 13, color: "#8a8a9a" }}>{item.style}</span>
      </div>

      {/* Gender */}
      <div style={{ width: 80, display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ color: "#6b6b80", fontSize: 14 }}>{GENDER_ICONS[item.gender]}</span>
        <span style={{ fontSize: 13, color: "#8a8a9a" }}>{item.gender}</span>
      </div>

      {/* Actions */}
      <div style={{
        display: "flex", gap: 6,
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.15s",
        flexShrink: 0,
      }}>
        <ActionButton onClick={() => onEdit(item)} title="Редактировать">
          ✎
        </ActionButton>
        <ActionButton onClick={() => onDelete(item.id)} title="Удалить" danger>
          ✕
        </ActionButton>
      </div>
    </div>
  );
}

function ActionButton({ onClick, title, children, danger }: {
  onClick: () => void; title: string; children: React.ReactNode; danger?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 30, height: 30, borderRadius: 7,
        border: `1px solid ${hovered ? (danger ? "#5a2020" : "#3a3a5a") : "#2a2a3e"}`,
        background: hovered ? (danger ? "#2a1010" : "#1e1e2e") : "transparent",
        color: hovered ? (danger ? "#e06060" : "#c0bfff") : "#4a4a60",
        cursor: "pointer", fontSize: 14,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.15s",
        fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  );
}

// ── Delete confirm dialog ──────────────────────────────────────────────────
function DeleteConfirm({ itemName, onConfirm, onCancel }: {
  itemName: string; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 100,
      }}
    >
      <div style={{
        background: "#13131c", border: "1px solid #2a2a3e",
        borderRadius: 14, padding: "28px 28px 22px",
        width: 360, maxWidth: "calc(100vw - 32px)",
        animation: "slideUp 0.18s ease",
      }}>
        <style>{`@keyframes slideUp { from { opacity:0;transform:translateY(12px) } to { opacity:1;transform:translateY(0) } }`}</style>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f0f0f8", margin: "0 0 10px" }}>Удалить предмет?</h3>
        <p style={{ fontSize: 14, color: "#6b6b80", margin: "0 0 24px", lineHeight: 1.5 }}>
          «{itemName}» будет удалён из каталога. Это действие нельзя отменить.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button type="button" onClick={onCancel} style={{
            padding: "8px 18px", borderRadius: 8,
            border: "1.5px solid #2a2a3e", background: "transparent",
            color: "#8a8a9a", fontSize: 14, fontFamily: "inherit", cursor: "pointer",
          }}>Отмена</button>
          <button type="button" onClick={onConfirm} style={{
            padding: "8px 18px", borderRadius: 8, border: "none",
            background: "#5a1515", color: "#e07070",
            fontSize: 14, fontFamily: "inherit", fontWeight: 600, cursor: "pointer",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#6e1a1a"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#5a1515"; }}
          >Удалить</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function CatalogList() {
  const [items, setItems] = useState<CatalogItem[]>(MOCK_ITEMS);
  const [search, setSearch] = useState("");
  const [filterSeason, setFilterSeason] = useState<Season | "">("");
  const [filterStyle, setFilterStyle] = useState<Style | "">("");
  const [filterGender, setFilterGender] = useState<Gender | "">("");
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<CatalogItem | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const q = search.toLowerCase();
      if (q && !item.name.toLowerCase().includes(q)) return false;
      if (filterSeason && item.season !== filterSeason) return false;
      if (filterStyle && item.style !== filterStyle) return false;
      if (filterGender && item.gender !== filterGender) return false;
      return true;
    });
  }, [items, search, filterSeason, filterStyle, filterGender]);

  const hasFilters = search || filterSeason || filterStyle || filterGender;

  const handleSave = (updated: CatalogItem) => {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setDeletingItem(null);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0e0e14",
      color: "#e8e8f0",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>
      <main style={{ padding: "28px 28px 60px", maxWidth: 900, margin: "0 auto" }}>
        {/* Heading */}
        <p style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#7B7EC8", fontWeight: 700, marginBottom: 6 }}>
          Каталог
        </p>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 6px", color: "#f0f0f8" }}>
          Предметы одежды
        </h1>
        <p style={{ fontSize: 13, color: "#6b6b80", margin: "0 0 6px" }}>
          Управляй каталогом — редактируй и удаляй предметы
        </p>
        <p style={{ fontSize: 12, color: "#4a4a60", margin: "0 0 15px" }}>
          {items.length} предметов в каталоге
        </p>

        {/* Toolbar */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20, alignItems: "center" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 180px", minWidth: 160 }}>
            <span style={{
              position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)",
              color: "#4a4a60", fontSize: 14, pointerEvents: "none",
            }}>⌕</span>
            <input
              type="text"
              value={search}
              placeholder="Поиск по названию..."
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{
                width: "100%", boxSizing: "border-box",
                background: "#16161f",
                border: `1.5px solid ${searchFocused ? "#7B7EC8" : "#2a2a3e"}`,
                borderRadius: 8, color: "#e8e8f0",
                padding: "8px 12px 8px 32px",
                fontSize: 13, fontFamily: "inherit", outline: "none",
                transition: "border-color 0.18s",
              }}
            />
          </div>

          <FilterSelect value={filterSeason} onChange={setFilterSeason} options={SEASONS} placeholder="Сезон" />
          <FilterSelect value={filterStyle} onChange={setFilterStyle} options={STYLES} placeholder="Стиль" />
          <FilterSelect value={filterGender} onChange={setFilterGender} options={GENDERS} placeholder="Пол" />

          {hasFilters && (
            <button type="button" onClick={() => { setSearch(""); setFilterSeason(""); setFilterStyle(""); setFilterGender(""); }}
              style={{
                background: "none", border: "1.5px solid #2a2a3e",
                borderRadius: 8, color: "#6b6b80",
                padding: "8px 14px", fontSize: 12,
                fontFamily: "inherit", cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "color 0.15s, border-color 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#e8e8f0"; e.currentTarget.style.borderColor = "#4a4a6a"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#6b6b80"; e.currentTarget.style.borderColor = "#2a2a3e"; }}
            >
              Сбросить ✕
            </button>
          )}
        </div>

        {/* Table header */}
        <div style={{
          display: "flex", gap: 16,
          padding: "6px 16px",
          borderBottom: "1px solid #1e1e2e",
          marginBottom: 4,
        }}>
          {[
            { label: "Фото", flex: "0 0 56px" },
            { label: "Название", flex: "2 1 0" },
            { label: "Сезон", flex: "1 1 0" },
            { label: "Стиль", flex: "1 1 0" },
            { label: "Пол", flex: "0 0 80px" },
            { label: "", flex: "0 0 66px" },
          ].map((col) => (
            <span key={col.label} style={{ flex: col.flex, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#3a3a50", fontWeight: 600 }}>
              {col.label}
            </span>
          ))}
        </div>

        {/* List */}
        {filtered.length > 0 ? (
          <div>
            {filtered.map((item) => (
              <CatalogRow
                key={item.id}
                item={item}
                onEdit={setEditingItem}
                onDelete={(id) => setDeletingItem(items.find((i) => i.id === id) ?? null)}
              />
            ))}
          </div>
        ) : (
          <div style={{ padding: "60px 0", textAlign: "center" }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>✦</p>
            <p style={{ fontSize: 14, color: "#4a4a60" }}>Ничего не найдено</p>
            {hasFilters && (
              <button type="button" onClick={() => { setSearch(""); setFilterSeason(""); setFilterStyle(""); setFilterGender(""); }}
                style={{ marginTop: 12, background: "none", border: "none", color: "#7B7EC8", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                Сбросить фильтры
              </button>
            )}
          </div>
        )}

        {/* Count */}
        {filtered.length > 0 && filtered.length !== items.length && (
          <p style={{ fontSize: 12, color: "#3a3a50", marginTop: 16, textAlign: "right" }}>
            Показано {filtered.length} из {items.length}
          </p>
        )}
      </main>

      {/* Modals */}
      {editingItem && (
        <EditModal
          item={editingItem}
          onSave={handleSave}
          onClose={() => setEditingItem(null)}
        />
      )}
      {deletingItem && (
        <DeleteConfirm
          itemName={deletingItem.name}
          onConfirm={() => handleDelete(deletingItem.id)}
          onCancel={() => setDeletingItem(null)}
        />
      )}
    </div>
  );
}
