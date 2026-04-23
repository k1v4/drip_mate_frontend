import React, { JSX, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './style.scss';

type OutfitItem = {
  id: number;
  name: string;
  category: string;
  season: string;
  imageUrl: string;
};

const SelectResult: React.FC = (): JSX.Element => {
  const [items, setItems] = useState<OutfitItem[]>([]);
  const navigate = useNavigate();
  const { id } = useParams(); // 👈 ключевой момент

  const isDetailMode = Boolean(id);

  useEffect(() => {
    const mock: OutfitItem[] = [
      {
        id: 1,
        name: 'Nike Hoodie',
        category: 'Hoodie',
        season: 'Winter',
        imageUrl: 'https://picsum.photos/500?1',
      },
      {
        id: 2,
        name: 'Cargo Pants',
        category: 'Pants',
        season: 'Autumn',
        imageUrl: 'https://picsum.photos/500?2',
      },
      {
        id: 3,
        name: 'Basic Tee',
        category: 'T-Shirt',
        season: 'Summer',
        imageUrl: 'https://picsum.photos/500?3',
      },
    ];

    setItems(mock);
  }, []);

  const handleSaveOutfit = () => {
    console.log('Outfit saved:', items);
    alert('Образ сохранён');
  };

  // 👇 НОВАЯ ЛОГИКА
  const handleDeleteOutfit = async () => {
    try {
      console.log('delete outfit id:', id);

      // заглушка API
      await new Promise((res) => setTimeout(res, 500));

      alert(`Образ ${id} удалён`);

      // после удаления можно вернуться назад
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
          <button className="saveButton" onClick={handleSaveOutfit}>
            Сохранить образ
          </button>
        ) : (
          <button
            className="deleteButton"
            onClick={handleDeleteOutfit}
          >
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