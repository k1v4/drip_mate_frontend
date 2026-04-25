import React, { JSX, useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './style.scss';

type OutfitItem = {
  id: string;
  name: string;
  category: string;
  season: string;
  imageUrl: string;
};

// Тип который приходит с бэка (Catalog[])
interface CatalogItem {
  id: string;
  name: string;
  category: string;
  season: string;
  image_url: string;
}

const SelectResult: React.FC = (): JSX.Element => {
  const [items, setItems] = useState<OutfitItem[]>([]);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const isDetailMode = Boolean(id);

  useEffect(() => {
    const catalogItems: CatalogItem[] = location.state ?? [];

    setItems(
      catalogItems.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        season: item.season,
        imageUrl: item.image_url,
      }))
    );
  }, [location.state]);

  const handleSaveOutfit = async () => {
    if (saving) return;
    try {
      setSaving(true);

      const response = await fetch('http://localhost:8080/api/v1/users/outfit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: `Образ от ${new Date().toLocaleDateString('ru-RU')}`,
          catalog_item_ids: items.map((item) => item.id),
        }),
      });

      if (!response.ok) throw new Error();

      navigate('/');
    } catch (e) {
      console.error('Ошибка сохранения образа:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOutfit = async () => {
    try {
      console.log('delete outfit id:', id);

      // заглушка API
      await new Promise((res) => setTimeout(res, 500));

      alert(`Образ ${id} удалён`);

      navigate('/');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="outfitRoot">

      {/* HEADER */}
      <div className="outfitHeader">
        <h1 onClick={() => navigate('/')} className="logo">
          DRIP MATE
        </h1>

        <p>
          {isDetailMode
            ? `Просмотр образа #${id}`
            : 'Собранные предметы под твой стиль'}
        </p>

        {/* SAVE / DELETE */}
        {!isDetailMode ? (
          <button
            className="saveButton"
            onClick={handleSaveOutfit}
            disabled={saving}
            style={{ opacity: saving ? 0.6 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}
          >
            {saving ? 'Сохранение...' : 'Сохранить образ'}
          </button>
        ) : (
          <button className="deleteButton" onClick={handleDeleteOutfit}>
            Удалить образ
          </button>
        )}
      </div>

      {/* GRID */}
      <div className="outfitGrid">
        {items.map((item) => (
          <div className="outfitCard" key={item.id}>
            <div className="imageWrapper">
              <img src={item.imageUrl} alt={item.name} />
            </div>

            <div className="info">
              <h3>{item.name}</h3>
              <p>{item.category}</p>
              <span>{item.season}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default SelectResult;