import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
export interface PersonalInfoData {
  firstName: string;
  lastName: string;
  username: string;
  city: string;
}

interface PersonalInfoStepProps {
  onBack: () => void;
  onNext: (data: PersonalInfoData) => void;
  totalSteps: number;
  currentStep: number;
}

// ── Sub-components ─────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 10,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "#6b6b80",
        marginBottom: 8,
        fontWeight: 600,
      }}
    >
      {children}
    </p>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}

function Field({ label, value, onChange, placeholder, hint }: FieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <SectionLabel>{label}</SectionLabel>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
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
          padding: "10px 14px",
          fontSize: 14,
          fontFamily: "inherit",
          outline: "none",
          transition: "border-color 0.18s",
        }}
      />
      {hint && (
        <p style={{ fontSize: 11, color: "#4a4a60", marginTop: 4 }}>{hint}</p>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function PersonalInfoStep({
  onBack,
  onNext,
  totalSteps,
  currentStep,
}: PersonalInfoStepProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [city, setCity] = useState("");

  const isValid =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    username.trim() !== "" &&
    city.trim() !== "";

  const progressPct = (currentStep / totalSteps) * 100;

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
      {/* Nav */}
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

      {/* Progress */}
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

      {/* Body */}
      <main style={{ padding: "28px 28px 40px", flex: 1, maxWidth: 480 }}>
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
          Личные данные
        </p>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            margin: "0 0 6px",
            color: "#f0f0f8",
          }}
        >
          Расскажи о себе
        </h1>
        <p style={{ fontSize: 13, color: "#6b6b80", margin: "0 0 32px" }}>
          Эта информация будет отображаться в твоём профиле
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <Field
              label="Имя"
              value={firstName}
              onChange={setFirstName}
              placeholder="Иван"
            />
            <Field
              label="Фамилия"
              value={lastName}
              onChange={setLastName}
              placeholder="Иванов"
            />
          </div>
          <Field
            label="Username"
            value={username}
            onChange={(v) => setUsername(v.replace(/\s/g, "").toLowerCase())}
            placeholder="ivan_ivanov"
            hint="Только латиница, цифры и _"
          />
          <Field
            label="Город проживания"
            value={city}
            onChange={setCity}
            placeholder="Москва"
          />
        </div>

        {/* Actions */}
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
            disabled={!isValid}
            onClick={() => onNext({ firstName, lastName, username, city })}
            style={{
              padding: "10px 28px",
              borderRadius: 8,
              border: "none",
              background: isValid
                ? "linear-gradient(135deg, #5254a3, #7B7EC8)"
                : "#1e1e2e",
              color: isValid ? "#fff" : "#4a4a60",
              fontSize: 14,
              fontFamily: "inherit",
              fontWeight: 600,
              cursor: isValid ? "pointer" : "not-allowed",
              transition: "opacity 0.18s, background 0.18s",
            }}
            onMouseEnter={(e) => {
              if (isValid) e.currentTarget.style.opacity = "0.88";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            Завершить →
          </button>
        </div>
      </main>
    </div>
  );
}
