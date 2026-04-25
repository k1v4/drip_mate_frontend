import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Types ──────────────────────────────────────────────────────────────────
export interface PersonalInfoData {
  firstName: string;
  lastName: string;
  username: string;
}

interface PersonalInfoStepProps {
  onBack: () => void;
  onNext: (data: PersonalInfoData) => void;
  totalSteps: number;
  currentStep: number;
}

// ── Toast ──────────────────────────────────────────────────────────────────
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: 24,
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "#1e1018",
        border: "1px solid #5a2020",
        borderRadius: 10,
        padding: "12px 16px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        animation: "toastIn 0.2s ease",
        maxWidth: 320,
      }}
    >
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <span style={{ fontSize: 16 }}>⚠️</span>
      <span style={{ fontSize: 13, color: "#e07070", lineHeight: 1.4 }}>{message}</span>
      <button
        type="button"
        onClick={onClose}
        style={{
          marginLeft: "auto",
          background: "none",
          border: "none",
          color: "#6b3030",
          fontSize: 16,
          cursor: "pointer",
          lineHeight: 1,
          padding: 0,
          flexShrink: 0,
        }}
      >
        ×
      </button>
    </div>
  );
}

function useToast() {
  const [message, setMessage] = useState<string | null>(null);

  const showError = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 4000);
  };

  const toast = message ? (
    <Toast message={message} onClose={() => setMessage(null)} />
  ) : null;

  return { showError, toast };
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
  const [loading, setLoading] = useState(false);

  const { showError, toast } = useToast();
  const navigate = useNavigate();
  

  const isValid =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    username.trim() !== "";

  const progressPct = (currentStep / totalSteps) * 100;

  const handleNext = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/v1/me/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: firstName,
          surname: lastName,
          username,
        }),
      });
      if (!response.ok) throw new Error();
      onNext({ firstName, lastName, username });
      navigate('/')
    } catch (e) {
      console.error(e);
      showError("Не удалось сохранить профиль. Попробуй ещё раз.");
    } finally {
      setLoading(false);
    }
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
            disabled={!isValid || loading}
            onClick={handleNext}
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
              cursor: isValid && !loading ? "pointer" : "not-allowed",
              opacity: loading ? 0.6 : 1,
              transition: "opacity 0.18s, background 0.18s",
            }}
            onMouseEnter={(e) => {
              if (isValid && !loading) e.currentTarget.style.opacity = "0.88";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = loading ? "0.6" : "1";
            }}
          >
            {loading ? "Сохранение..." : "Завершить →"}
          </button>
        </div>
      </main>

      {/* Toast */}
      {toast}
    </div>
  );
}