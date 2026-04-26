import { useEffect, useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
interface DictItem {
  id: number;
  name: string;
  hex?: string;
}

export interface StyleStepData {
  styles: number[];
  music: number[];
  colors: number[];
  city: string;
  maxPrice: number;
}

interface StyleStepProps {
  onBack?: () => void;
  onNext?: (data: StyleStepData) => void;
  totalSteps?: number;
  currentStep?: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────
function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

// ── UI Components ──────────────────────────────────────────────────────────
function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
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
    <p style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b6b80", marginBottom: 10, fontWeight: 600 }}>
      {children}
    </p>
  );
}

function CityInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type="text"
      value={value}
      placeholder="Москва"
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        boxSizing: "border-box",
        background: "#16161f",
        border: `1.5px solid ${focused ? "#7B7EC8" : "#2a2a3e"}`,
        borderRadius: 8,
        color: "#e8e8f0",
        padding: "9px 12px",
        fontSize: 14,
        fontFamily: "inherit",
        outline: "none",
        transition: "border-color 0.18s",
      }}
    />
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function StyleStep({
  onBack,
  onNext,
  totalSteps = 2,
  currentStep = 1,
}: StyleStepProps) {
  const [stylesList, setStylesList] = useState<DictItem[]>([]);
  const [musicList, setMusicList]   = useState<DictItem[]>([]);
  const [colorsList, setColorsList] = useState<DictItem[]>([]);

  const [selectedStyles, setSelectedStyles] = useState<number[]>([]);
  const [selectedMusic,  setSelectedMusic]  = useState<number[]>([]);
  const [selectedColors, setSelectedColors] = useState<number[]>([]);

  const [city,     setCity]     = useState("");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [loading,  setLoading]  = useState(false);

  // ── Load dictionaries ──
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stylesRes, colorsRes, musicRes] = await Promise.all([
          fetch("/api/v1/reference/styles"),
          fetch("/api/v1/reference/colors"),
          fetch("/api/v1/reference/musics"),
        ]);
        setStylesList(await stylesRes.json());
        setColorsList(await colorsRes.json());
        setMusicList(await musicRes.json());
      } catch (e) {
        console.error("Ошибка загрузки справочников", e);
      }
    };
    fetchData();
  }, []);

  // ── Submit ──
  const handleNext = async () => {
    if (loading) return;
    if (!selectedStyles.length || !selectedMusic.length || !selectedColors.length || !city.trim()) {
      alert("Выберите хотя бы один вариант в каждом блоке и укажите город");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch("/api/v1/me/context", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ city, styles: selectedStyles, music: selectedMusic, colors: selectedColors }),
      });
      if (!response.ok) throw new Error();
      onNext?.({ styles: selectedStyles, music: selectedMusic, colors: selectedColors, city, maxPrice });
    } catch (e) {
      console.error(e);
      alert("Ошибка при сохранении");
    } finally {
      setLoading(false);
    }
  };

  const progressPct = (currentStep / totalSteps) * 100;

  return (
    <div style={{ minHeight: "100vh", background: "#0e0e14", color: "#e8e8f0", display: "flex", flexDirection: "column" }}>
      {/* NAV */}
      <nav style={{ display: "flex", justifyContent: "space-between", padding: "16px 28px", borderBottom: "1px solid #1e1e2e" }}>
        <span style={{ fontWeight: 700 }}>DRIP MATE</span>
      </nav>

      {/* Progress */}
      <div style={{ padding: "20px 28px 0" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ height: 3, flex: 1, background: "#1e1e2e", marginRight: 16 }}>
            <div style={{ width: `${progressPct}%`, height: "100%", background: "#7B7EC8" }} />
          </div>
          <span style={{ fontSize: 12 }}>Шаг {currentStep} из {totalSteps}</span>
        </div>
      </div>

      {/* BODY */}
      <main style={{ padding: 28, flex: 1 }}>
        <h1>Расскажи о своём стиле</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 40 }}>

          {/* Col 1 — Styles */}
          <div>
            <SectionLabel>Стили</SectionLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {stylesList.map((s) => (
                <Chip key={s.id} label={s.name} active={selectedStyles.includes(s.id)}
                  onClick={() => setSelectedStyles((prev) => toggle(prev, s.id))} />
              ))}
            </div>
          </div>

          {/* Col 2 — Music + City */}
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <div>
              <SectionLabel>Музыка</SectionLabel>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {musicList.map((m) => (
                  <Chip key={m.id} label={m.name} active={selectedMusic.includes(m.id)}
                    onClick={() => setSelectedMusic((prev) => toggle(prev, m.id))} />
                ))}
              </div>
            </div>

            <div>
              <SectionLabel>Город</SectionLabel>
              <CityInput value={city} onChange={setCity} />
            </div>
          </div>

          {/* Col 3 — Colors + Price */}
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <div>
              <SectionLabel>Цвета</SectionLabel>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {colorsList.map((c) => {
                  const active = selectedColors.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedColors((prev) => toggle(prev, c.id))}
                      style={{
                        width: 28, height: 28, borderRadius: "50%",
                        background: c.hex || "#ccc",
                        border: active ? "2px solid #7B7EC8" : "2px solid transparent",
                        cursor: "pointer", padding: 0,
                        outline: active ? "2px solid #2e2e52" : "none",
                        outlineOffset: 1,
                        transition: "all 0.15s",
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 40 }}>
          <button
            type="button" onClick={onBack}
            style={{ padding: "10px 24px", borderRadius: 8, border: "1.5px solid #2a2a3e", background: "transparent", color: "#8a8a9a", fontSize: 14, fontFamily: "inherit", cursor: "pointer" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#4a4a6a"; e.currentTarget.style.color = "#c0c0d0"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2a2a3e"; e.currentTarget.style.color = "#8a8a9a"; }}
          >
            Назад
          </button>
          <button
            type="button" onClick={handleNext} disabled={loading}
            style={{ padding: "10px 28px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #5254a3, #7B7EC8)", color: "#fff", fontSize: 14, fontFamily: "inherit", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1, transition: "opacity 0.18s" }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = "0.88"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = loading ? "0.6" : "1"; }}
          >
            {loading ? "Сохранение..." : "Далее →"}
          </button>
        </div>
      </main>
    </div>
  );
}