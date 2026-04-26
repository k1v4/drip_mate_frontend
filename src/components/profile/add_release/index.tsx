import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';

// ── Types ──────────────────────────────────────────────────────────────────
interface DictItem {
  id: number;
  name: string;
}

interface ColorItem {
  id: number;
  name: string;
  hex: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────
function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

// ── UI primitives (стиль онбординга) ──────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b6b80', marginBottom: 8, fontWeight: 600 }}>
      {children}
    </p>
  );
}

function StyledSelect({ value, onChange, options, placeholder }: {
  value: string;
  onChange: (v: string) => void;
  options: DictItem[];
  placeholder: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: '100%', boxSizing: 'border-box',
        background: '#16161f',
        border: `1.5px solid ${focused ? '#7B7EC8' : '#2a2a3e'}`,
        borderRadius: 8, color: value ? '#e8e8f0' : '#4a4a60',
        padding: '10px 32px 10px 14px', fontSize: 14,
        fontFamily: 'inherit', outline: 'none', cursor: 'pointer',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%236b6b80' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
        transition: 'border-color 0.18s',
      }}
    >
      <option value="" disabled>{placeholder}</option>
      {options.map((o) => <option key={o.id} value={String(o.id)}>{o.name}</option>)}
    </select>
  );
}

function StyledInput({ value, onChange, placeholder, type = 'text' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: '100%', boxSizing: 'border-box',
        background: '#16161f',
        border: `1.5px solid ${focused ? '#7B7EC8' : '#2a2a3e'}`,
        borderRadius: 8, color: '#e8e8f0',
        padding: '10px 14px', fontSize: 14,
        fontFamily: 'inherit', outline: 'none',
        transition: 'border-color 0.18s',
      }}
    />
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '5px 14px', borderRadius: 20,
        border: active ? '1.5px solid #7B7EC8' : '1.5px solid #3a3a4a',
        background: active ? '#2e2e52' : 'transparent',
        color: active ? '#c0bfff' : '#8a8a9a',
        fontSize: 13, fontFamily: 'inherit',
        cursor: 'pointer', transition: 'all 0.18s ease', whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
}

// ── Toast ──────────────────────────────────────────────────────────────────
function Toast({ message, success, onClose }: { message: string; success: boolean; onClose: () => void }) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: 24, zIndex: 999,
      display: 'flex', alignItems: 'center', gap: 12,
      background: success ? '#0e1e18' : '#1e1018',
      border: `1px solid ${success ? '#1a5a3a' : '#5a2020'}`,
      borderRadius: 10, padding: '12px 16px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      animation: 'toastIn 0.2s ease', maxWidth: 320,
    }}>
      <style>{`@keyframes toastIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }`}</style>
      <span style={{ fontSize: 16 }}>{success ? '✓' : '⚠️'}</span>
      <span style={{ fontSize: 13, color: success ? '#6bcf7f' : '#e07070', lineHeight: 1.4 }}>{message}</span>
      <button type="button" onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#6b3030', fontSize: 16, cursor: 'pointer', padding: 0, flexShrink: 0 }}>×</button>
    </div>
  );
}

function useToast() {
  const [state, setState] = useState<{ message: string; success: boolean } | null>(null);
  const show = (message: string, success: boolean) => {
    setState({ message, success });
    setTimeout(() => setState(null), 4000);
  };
  const toast = state ? <Toast message={state.message} success={state.success} onClose={() => setState(null)} /> : null;
  return { showToast: show, toast };
}

// ── Main Component ─────────────────────────────────────────────────────────
const GENDERS = [
  { id: 'male', name: 'Мужской' },
  { id: 'female', name: 'Женский' },
  { id: 'unisex', name: 'Унисекс' },
];

const MATERIALS = [
  { id: 'cotton', name: 'Хлопок' },
  { id: 'polyester', name: 'Полиэстер' },
  { id: 'wool', name: 'Шерсть' },
  { id: 'leather', name: 'Кожа' },
  { id: 'linen', name: 'Лён' },
  { id: 'denim', name: 'Деним' },
];

const AddItemForm: React.FC = () => {
  // ── Dictionaries from API ──
  const [categories, setCategories] = useState<DictItem[]>([]);
  const [seasons,    setSeasons]    = useState<DictItem[]>([]);
  const [styles,     setStyles]     = useState<DictItem[]>([]);
  const [colors,     setColors]     = useState<ColorItem[]>([]);

  // ── Form state ──
  const [title,       setTitle]       = useState('');
  const [photo,       setPhoto]       = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [categoryId,  setCategoryId]  = useState('');
  const [seasonId,    setSeasonId]    = useState('');
  const [gender,      setGender]      = useState('');
  const [material,    setMaterial]    = useState('');
  const [formality,   setFormality]   = useState('');
  const [styleIds,    setStyleIds]    = useState<number[]>([]);
  const [colorIds,    setColorIds]    = useState<number[]>([]);

  const [loading, setLoading] = useState(false);
  const { showToast, toast } = useToast();

  // ── Load dictionaries ──
  useEffect(() => {
    const load = async () => {
      try {
        const [catRes, seasonRes, styleRes, colorRes] = await Promise.all([
          fetch('/api/v1/reference/categories', { credentials: 'include' }),
          fetch('/api/v1/reference/seasons',    { credentials: 'include' }),
          fetch('/api/v1/reference/styles',     { credentials: 'include' }),
          fetch('/api/v1/reference/colors',     { credentials: 'include' }),
        ]);
        setCategories(await catRes.json());
        setSeasons(await seasonRes.json());
        setStyles(await styleRes.json());
        setColors(await colorRes.json());
      } catch (e) {
        console.error('Ошибка загрузки справочников', e);
      }
    };
    load();
  }, []);

  // ── Photo ──
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  // ── Reset ──
  const handleCancel = () => {
    setTitle(''); setPhoto(null); setPhotoPreview(null);
    setCategoryId(''); setSeasonId(''); setGender('');
    setMaterial(''); setFormality('');
    setStyleIds([]); setColorIds([]);
  };

  // ── Submit ──
  const handlePublish = async () => {
    if (!title)      return showToast('Введите название', false);
    if (!photo)      return showToast('Загрузите фото', false);
    if (!categoryId) return showToast('Выберите категорию', false);
    if (!seasonId)   return showToast('Выберите сезон', false);
    if (!gender)     return showToast('Выберите пол', false);
    if (!material)   return showToast('Выберите материал', false);
    if (!formality)  return showToast('Укажите уровень формальности', false);

    if (loading) return;

    try {
      setLoading(true);

      // Бэк использует c.FormFile("image") и c.Bind() — нужен multipart/form-data
      const formData = new FormData();
      formData.append('image',           photo);
      formData.append('name',            title);
      formData.append('category_id',     categoryId);
      formData.append('season_id',       seasonId);
      formData.append('gender',          gender);
      formData.append('material',        material);
      formData.append('formality_level', formality);
      // массивы — каждый элемент отдельным append под одним ключом
      styleIds.forEach((id) => formData.append('style_ids', String(id)));
      colorIds.forEach((id) => formData.append('color_ids', String(id)));

      // Content-Type НЕ выставляем вручную — браузер сам добавит boundary
      const response = await fetch('/api/v1/catalog', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (response.status !== 201) throw new Error();

      showToast('Предмет успешно добавлен', true);
      handleCancel();
    } catch (e) {
      console.error(e);
      showToast('Ошибка при создании предмета', false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0e0e14', color: '#e8e8f0',
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      display: 'flex', flexDirection: 'column',
    }}>
      <main style={{ padding: '28px', maxWidth: 640, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>

        <p style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7B7EC8', marginBottom: 6, fontWeight: 700 }}>
          Каталог
        </p>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 6px', color: '#f0f0f8' }}>
          Новый предмет
        </h1>
        <p style={{ fontSize: 13, color: '#6b6b80', margin: '0 0 32px' }}>
          Заполни все поля — предмет появится в каталоге
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Photo */}
          <div>
            <SectionLabel>Фото</SectionLabel>
            <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} id="upload-photo" />
            <label htmlFor="upload-photo">
              <div style={{
                width: 220, height: 220, borderRadius: 12, cursor: 'pointer',
                border: '2px dashed #2a2a3e', background: '#16161f',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', transition: 'border-color 0.18s',
              }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#7B7EC8')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#2a2a3e')}
              >
                {photoPreview
                  ? <img src={photoPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <AddIcon sx={{ fontSize: 48, color: '#3a3a5a' }} />
                }
              </div>
            </label>
          </div>

          {/* Name */}
          <div>
            <SectionLabel>Название предмета</SectionLabel>
            <StyledInput value={title} onChange={setTitle} placeholder="Белая рубашка" />
          </div>

          {/* Category + Season */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <SectionLabel>Категория</SectionLabel>
              <StyledSelect value={categoryId} onChange={setCategoryId} options={categories} placeholder="Выбери категорию" />
            </div>
            <div>
              <SectionLabel>Сезон</SectionLabel>
              <StyledSelect value={seasonId} onChange={setSeasonId} options={seasons} placeholder="Выбери сезон" />
            </div>
          </div>

          {/* Gender + Material */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <SectionLabel>Пол</SectionLabel>
              <StyledSelect value={gender} onChange={setGender} options={GENDERS.map(g => ({ id: g.id as unknown as number, name: g.name }))} placeholder="Выбери пол" />
            </div>
            <div>
              <SectionLabel>Материал</SectionLabel>
              <StyledSelect value={material} onChange={setMaterial} options={MATERIALS.map(m => ({ id: m.id as unknown as number, name: m.name }))} placeholder="Выбери материал" />
            </div>
          </div>

          {/* Formality */}
          <div>
            <SectionLabel>Формальность (1–5)</SectionLabel>
            <div style={{ display: 'flex', gap: 8 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setFormality(String(n))}
                  style={{
                    width: 44, height: 44, borderRadius: 8, fontWeight: 600, fontSize: 15,
                    border: formality === String(n) ? '1.5px solid #7B7EC8' : '1.5px solid #3a3a4a',
                    background: formality === String(n) ? '#2e2e52' : 'transparent',
                    color: formality === String(n) ? '#c0bfff' : '#8a8a9a',
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.18s',
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
            <p style={{ fontSize: 11, color: '#4a4a60', marginTop: 6 }}>1 — неформально · 5 — максимально формально</p>
          </div>

          {/* Styles */}
          <div>
            <SectionLabel>Стили</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {styles.map((s) => (
                <Chip key={s.id} label={s.name}
                  active={styleIds.includes(s.id)}
                  onClick={() => setStyleIds((prev) => toggle(prev, s.id))}
                />
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <SectionLabel>Цвета</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {colors.map((c) => {
                const active = colorIds.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    title={c.name}
                    onClick={() => setColorIds((prev) => toggle(prev, c.id))}
                    style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: c.hex || '#ccc', padding: 0,
                      border: active ? '2.5px solid #7B7EC8' : '2px solid transparent',
                      outline: active ? '2px solid #2e2e52' : 'none',
                      outlineOffset: 1, cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
            <button
              type="button" onClick={handleCancel}
              style={{ padding: '10px 24px', borderRadius: 8, border: '1.5px solid #2a2a3e', background: 'transparent', color: '#8a8a9a', fontSize: 14, fontFamily: 'inherit', cursor: 'pointer' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#4a4a6a'; e.currentTarget.style.color = '#c0c0d0'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a3e'; e.currentTarget.style.color = '#8a8a9a'; }}
            >
              Отменить
            </button>
            <button
              type="button" onClick={handlePublish} disabled={loading}
              style={{
                padding: '10px 28px', borderRadius: 8, border: 'none',
                background: 'linear-gradient(135deg, #5254a3, #7B7EC8)',
                color: '#fff', fontSize: 14, fontFamily: 'inherit', fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1, transition: 'opacity 0.18s',
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = '0.88'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = loading ? '0.6' : '1'; }}
            >
              {loading ? 'Публикация...' : 'Опубликовать'}
            </button>
          </div>
        </div>
      </main>

      {toast}
    </div>
  );
};

export default AddItemForm;