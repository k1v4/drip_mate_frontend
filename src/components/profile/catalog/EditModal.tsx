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

// ── UI ─────────────────────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: 10,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "#6b6b80",
      marginBottom: 6,
      fontWeight: 600
    }}>
      {children}
    </p>
  );
}

function TextInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        background: "#16161f",
        border: "1.5px solid #2a2a3e",
        borderRadius: 8,
        color: "#e8e8f0",
        padding: "9px 12px",
      }}
    />
  );
}

function SelectInput({
  value,
  onChange,
  options,
}: {
  value: number;
  onChange: (v: number) => void;
  options: DictItem[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{
        width: "100%",
        background: "#16161f",
        border: "1.5px solid #2a2a3e",
        borderRadius: 8,
        color: "#e8e8f0",
        padding: "9px 12px",
      }}
    >
      {options.map((o) => (
        <option key={o.id} value={o.id}>
          {o.name}
        </option>
      ))}
    </select>
  );
}

// ── Component ──────────────────────────────────────────────────────────────
export default function EditModal({ item, onSave, onClose }: EditModalProps) {
  const [stylesList, setStylesList] = useState<DictItem[]>([]);
  const [colorsList, setColorsList] = useState<DictItem[]>([]);
  const [seasonsList, setSeasonsList] = useState<DictItem[]>([]);

  const [loading, setLoading] = useState(false);

  // 🔥 нормальная инициализация draft
  const [draft, setDraft] = useState<UpdateCatalogRequest>({
    id: item.id,
    name: item.name,
    gender: item.gender,
    image_url: item.imageUrl,

    // пока пусто — потом подставим после загрузки справочников
    season_id: undefined,
    style_ids: [],
    color_ids: [],
  });

  // ── Fetch dictionaries ──
  useEffect(() => {
    const fetchDicts = async () => {
      try {
        const [stylesRes, colorsRes, seasonsRes] = await Promise.all([
          fetch("http://localhost:8080/api/v1/reference/styles"),
          fetch("http://localhost:8080/api/v1/reference/colors"),
          fetch("http://localhost:8080/api/v1/reference/seasons"),
        ]);

        const styles = await stylesRes.json();
        const colors = await colorsRes.json();
        const seasons = await seasonsRes.json();

        const safeStyles = Array.isArray(styles) ? styles : [];
        const safeColors = Array.isArray(colors) ? colors : [];
        const safeSeasons = Array.isArray(seasons) ? seasons : [];

        setStylesList(safeStyles);
        setColorsList(safeColors);
        setSeasonsList(safeSeasons);

        // 🔥 МАППИНГ UI → ID
        setDraft((prev) => ({
          ...prev,
          season_id: safeSeasons.find(s => s.name === item.season)?.id,
          style_ids: safeStyles
            .filter(s => s.name === item.style)
            .map(s => s.id),
        }));

      } catch (e) {
        console.error("Ошибка загрузки справочников", e);
      }
    };

    fetchDicts();
  }, [item]);

  // ── Update API ──
  const handleUpdate = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:8080/api/v1/catalog/${draft.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(draft),
        }
      );

      if (!response.ok) throw new Error();

      // 🔥 обратно в UI модель
      const updatedItem: CatalogItem = {
        id: draft.id,
        name: draft.name,
        gender: draft.gender || "",
        imageUrl: draft.image_url,

        season:
          seasonsList.find(s => s.id === draft.season_id)?.name || "",

        style:
          stylesList.find(s => s.id === draft.style_ids?.[0])?.name || "",
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
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{
        background: "#13131c",
        border: "1px solid #2a2a3e",
        borderRadius: 16,
        padding: 24,
        width: 420,
      }}>
        <h2 style={{ color: "#fff" }}>Редактировать</h2>

        {draft.image_url && (
          <img
            src={draft.image_url}
            style={{ width: "100%", height: 140, objectFit: "cover", marginBottom: 12 }}
          />
        )}

        <Label>Название</Label>
        <TextInput
          value={draft.name}
          onChange={(v) => setDraft(prev => ({ ...prev, name: v }))}
        />

        <Label>Сезон</Label>
        <SelectInput
          value={draft.season_id ?? 0}
          onChange={(v) => setDraft(prev => ({ ...prev, season_id: v }))}
          options={seasonsList}
        />

        <Label>Стиль</Label>
        <SelectInput
          value={draft.style_ids?.[0] ?? 0}
          onChange={(v) => setDraft(prev => ({ ...prev, style_ids: [v] }))}
          options={stylesList}
        />

        <Label>Цвет</Label>
        <SelectInput
          value={draft.color_ids?.[0] ?? 0}
          onChange={(v) => setDraft(prev => ({ ...prev, color_ids: [v] }))}
          options={colorsList}
        />

        <Label>URL</Label>
        <TextInput
          value={draft.image_url ?? ""}
          onChange={(v) => setDraft(prev => ({ ...prev, image_url: v }))}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16, gap: 10 }}>
          <button onClick={onClose}>Отмена</button>

          <button
            disabled={!isValid || loading}
            onClick={handleUpdate}
          >
            {loading ? "Сохраняем..." : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  );
}