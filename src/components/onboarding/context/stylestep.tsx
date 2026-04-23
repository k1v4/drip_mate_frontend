import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
type StyleTag =
  | "Casual"
  | "Smart casual"
  | "Minimalist"
  | "Streetwear"
  | "Formal"
  | "Sporty"
  | "Vintage"
  | "Techwear";

type MusicTag =
  | "Indie"
  | "Electronic"
  | "Hip-hop"
  | "Classical"
  | "Jazz"
  | "Pop"
  | "Rock";

interface ColorSwatch {
  id: string;
  hex: string;
  label: string;
}

export interface StyleStepData {
  styles: StyleTag[];
  music: MusicTag[];
  colors: string[];
  city: string;
  maxPrice: number;
}

interface StyleStepProps {
  onBack?: () => void;
  onNext?: (data: StyleStepData) => void;
  totalSteps?: number;
  currentStep?: number;
}

// ── Constants ──────────────────────────────────────────────────────────────
const STYLE_TAGS: StyleTag[] = [
  "Casual",
  "Smart casual",
  "Minimalist",
  "Streetwear",
  "Formal",
  "Sporty",
  "Vintage",
  "Techwear",
];

const MUSIC_TAGS: MusicTag[] = [
  "Indie",
  "Electronic",
  "Hip-hop",
  "Classical",
  "Jazz",
  "Pop",
  "Rock",
];

const COLOR_SWATCHES: ColorSwatch[] = [
  { id: "indigo", hex: "#4B5090", label: "Indigo" },
  { id: "lavender", hex: "#7B7EC8", label: "Lavender" },
  { id: "copper", hex: "#A0674A", label: "Copper" },
  { id: "forest", hex: "#3A6B4C", label: "Forest" },
  { id: "mauve", hex: "#7B4F72", label: "Mauve" },
  { id: "tan", hex: "#A08060", label: "Tan" },
  { id: "white", hex: "#F0EEE8", label: "White" },
  { id: "cream", hex: "#D4C9A8", label: "Cream" },
];

const MAX_PRICE_LIMIT = 10_000;

// ── Helpers ────────────────────────────────────────────────────────────────
function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

// ── Sub-components ─────────────────────────────────────────────────────────
function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "5px 14px",
        borderRadius: 20,
        border: active ? "1.5px solid #7B7EC8" : "1.5px solid #3a3a4a",
        background: active ? "#2e2e52" : "transparent",
        color: active ? "#c0bfff" : "#8a8a9a",
        fontSize: 13,
        fontFamily: "inherit",
        cursor: "pointer",
        transition: "all 0.18s ease",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 10,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "#6b6b80",
        marginBottom: 10,
        fontWeight: 600,
      }}
    >
      {children}
    </p>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function StyleStep({
  onBack,
  onNext,
  totalSteps = 3,
  currentStep = 1,
}: StyleStepProps) {
  const [selectedStyles, setSelectedStyles] = useState<StyleTag[]>([
    "Casual",
    "Minimalist",
  ]);
  const [selectedMusic, setSelectedMusic] = useState<MusicTag[]>([
    "Indie",
    "Electronic",
  ]);
  const [selectedColors, setSelectedColors] = useState<string[]>([
    "indigo",
    "lavender",
  ]);
  const [city, setCity] = useState("Пермь");
  const [maxPrice, setMaxPrice] = useState(5000);

  const progressPct = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    onNext?.({
      styles: selectedStyles,
      music: selectedMusic,
      colors: selectedColors,
      city,
      maxPrice,
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0e0e14",
        color: "#e8e8f0",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Nav ── */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 28px",
          borderBottom: "1px solid #1e1e2e",
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontWeight: 700,
            fontSize: 15,
            color: "#e8e8f0",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#7B7EC8",
              display: "inline-block",
            }}
          />
          DRIP MATE
        </span>
        <button
          type="button"
          style={{
            background: "none",
            border: "none",
            color: "#6b6b80",
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Настройка профиля
        </button>
      </nav>

      {/* ── Progress ── */}
      <div style={{ padding: "20px 28px 0" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <div
            style={{
              height: 3,
              flex: 1,
              background: "#1e1e2e",
              borderRadius: 2,
              overflow: "hidden",
              marginRight: 16,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progressPct}%`,
                background: "linear-gradient(90deg, #5254a3, #7B7EC8)",
                borderRadius: 2,
                transition: "width 0.4s ease",
              }}
            />
          </div>
          <span style={{ fontSize: 12, color: "#6b6b80", whiteSpace: "nowrap" }}>
            Шаг {currentStep} из {totalSteps}
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <main style={{ padding: "28px 28px 40px", flex: 1 }}>
        {/* Heading */}
        <p
          style={{
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#7B7EC8",
            marginBottom: 6,
            fontWeight: 700,
          }}
        >
          Стиль
        </p>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            margin: "0 0 6px",
            color: "#f0f0f8",
          }}
        >
          Расскажи о своём стиле
        </h1>
        <p style={{ fontSize: 13, color: "#6b6b80", margin: "0 0 28px" }}>
          Выбери то, что тебе близко — это поможет точнее подобрать образы
        </p>

        {/* ── Grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "32px 40px",
          }}
        >
          {/* Col 1 — Preferred styles */}
          <div>
            <SectionLabel>Предпочитаемые стили</SectionLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {STYLE_TAGS.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  active={selectedStyles.includes(tag)}
                  onClick={() =>
                    setSelectedStyles((prev) => toggle(prev, tag))
                  }
                />
              ))}
            </div>
          </div>

          {/* Col 2 — Music + City */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
              <SectionLabel>Музыкальные предпочтения</SectionLabel>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {MUSIC_TAGS.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    active={selectedMusic.includes(tag)}
                    onClick={() =>
                      setSelectedMusic((prev) => toggle(prev, tag))
                    }
                  />
                ))}
              </div>
            </div>

          </div>

          {/* Col 3 — Colors + Price */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
              <SectionLabel>Любимые цвета</SectionLabel>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {COLOR_SWATCHES.map((swatch) => {
                  const active = selectedColors.includes(swatch.id);
                  return (
                    <button
                      key={swatch.id}
                      type="button"
                      title={swatch.label}
                      onClick={() =>
                        setSelectedColors((prev) => toggle(prev, swatch.id))
                      }
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: swatch.hex,
                        border: active
                          ? "2.5px solid #7B7EC8"
                          : "2px solid transparent",
                        cursor: "pointer",
                        outline: active ? "2px solid #2e2e52" : "none",
                        outlineOffset: 1,
                        transition: "all 0.15s ease",
                        boxSizing: "border-box",
                        padding: 0,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Actions ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            marginTop: 40,
          }}
        >
          <button
            type="button"
            onClick={onBack}
            style={{
              padding: "10px 24px",
              borderRadius: 8,
              border: "1.5px solid #2a2a3e",
              background: "transparent",
              color: "#8a8a9a",
              fontSize: 14,
              fontFamily: "inherit",
              cursor: "pointer",
              transition: "border-color 0.18s, color 0.18s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#4a4a6a";
              e.currentTarget.style.color = "#c0c0d0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#2a2a3e";
              e.currentTarget.style.color = "#8a8a9a";
            }}
          >
            Назад
          </button>
          <button
            type="button"
            onClick={handleNext}
            style={{
              padding: "10px 28px",
              borderRadius: 8,
              border: "none",
              background: "linear-gradient(135deg, #5254a3, #7B7EC8)",
              color: "#fff",
              fontSize: 14,
              fontFamily: "inherit",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "opacity 0.18s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Далее →
          </button>
        </div>
      </main>
    </div>
  );
}