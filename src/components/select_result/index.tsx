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
    if (isDetailMode) {
      // Если items уже переданы из Outfits — используем их, запрос не делаем
      const stateItems = location.state?.items;
      if (stateItems?.length) {
        setItems(stateItems.map((item: any) => ({
          id:       item.id,
          name:     item.name,
          category: item.material ?? '',
          season:   '',
          imageUrl: item.image,
        })));
        return;
      }

      // Фолбэк: прямой переход по URL — грузим с бэка
      const fetchOutfit = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/v1/users/outfit/${id}`, {
            credentials: 'include',
          });
          if (!response.ok) throw new Error();
          const data = await response.json();
          setItems(
            (data.items ?? []).map((item: any) => ({
              id:       item.id,
              name:     item.name,
              category: item.material ?? '',
              season:   '',
              imageUrl: item.image,
            }))
          );
        } catch (e) {
          console.error('Ошибка загрузки образа:', e);
        }
      };
      fetchOutfit();
    } else {
      // Режим рекомендации — данные из location.state
      const catalogItems: CatalogItem[] = location.state ?? [];
      setItems(
        catalogItems.map((item) => ({
          id:       item.id,
          name:     item.name,
          category: item.category,
          season:   item.season,
          imageUrl: item.image_url,
        }))
      );
    }
  }, [id, isDetailMode, location.state]);

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
      const response = await fetch(`http://localhost:8080/api/v1/users/outfit/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.status !== 204) throw new Error();
      navigate('/');
    } catch (e) {
      console.error('Ошибка удаления образа:', e);
    }
  };

  return (
    <div className="outfitRoot">
      <div className="outfitHeader">
        <h1 onClick={() => navigate('/')} className="logo">DRIP MATE</h1>
        <p>{isDetailMode ? 'Просмотр образа' : 'Собранные предметы под твой стиль'}</p>
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