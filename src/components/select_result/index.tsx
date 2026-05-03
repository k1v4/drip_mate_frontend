import React, { JSX, useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './style.scss';
import { instance } from '../../utils/axios';

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
  const logId: number | undefined = location.state?.logId;

  useEffect(() => {
    if (isDetailMode) {
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

      const fetchOutfit = async () => {
          try {
              const response = await instance.get(`/api/v1/users/outfit/${id}`);
              setItems((response.data.items ?? []).map((item: any) => ({
                  id:       item.id,
                  name:     item.name,
                  category: item.material ?? '',
                  season:   '',
                  imageUrl: item.image,
              })));
          } catch (e) {
              console.error('Ошибка загрузки образа:', e);
          }
      };
      fetchOutfit();
    } else {
      // Режим рекомендации — catalog лежит в location.state.items
      const catalogItems: CatalogItem[] = location.state?.items ?? [];
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
            await instance.post('/api/v1/users/outfit', {
                name: `Образ от ${new Date().toLocaleDateString('ru-RU')}`,
                catalog_item_ids: items.map((item) => item.id),
                ...(logId !== undefined && { log_id: logId }),
            });
            navigate('/');
        } catch (e) {
            console.error('Ошибка сохранения образа:', e);
        } finally {
            setSaving(false);
        }
    };

  const handleDeleteOutfit = async () => {
      try {
          await instance.delete(`/api/v1/users/outfit/${id}`);
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