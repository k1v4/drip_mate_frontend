import { Add } from '@mui/icons-material';
import { Button, Slider, Typography } from '@mui/material';
import React, { JSX, useEffect, useState } from 'react';
import AddShoeForm from './add';
import { instance } from '../../../utils/axios';
import { useAuth } from '../../../context/AuthContext';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom'; // 👈 ДОБАВИЛИ

interface Item {
  id: number;
  name: string;
  url: string;
}

const Selection: React.FC = (): JSX.Element => {
  const [items, setItems] = useState<Item[]>([]);
  const [showHello, setShowHello] = useState<boolean>(false);
  const { getTokens } = useAuth();
  const navigate = useNavigate(); // 👈 ДОБАВИЛИ

  const [rating, setRating] = useState<number>(1);

  useEffect(() => {
    const tokens = getTokens();
    if (!tokens?.accessToken) return;

    const fetchShoes = async () => {
      try {
        const response = await instance.get('http://localhost:8081/api/v1/shoes', {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        });

        const fetchedItems = response.data.shoes.map((shoe: any) => ({
          id: shoe.shoeId,
          name: shoe.name,
          url: shoe.imageUrl,
        }));

        setItems(fetchedItems);
      } catch (error) {
        console.error('Ошибка при загрузке обуви:', error);
      }
    };

    fetchShoes();
  }, [getTokens]);

  const handleAddShoe = () => {
    setShowHello(!showHello);
  };

  const handleDelete = async (id: number) => {
    const tokens = getTokens();
    if (!tokens?.accessToken) return;

    try {
      await fetch(`http://localhost:8081/api/v1/shoes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });

      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // ================================
  // 👇 MOCK API + NAVIGATE
  // ================================
  const handleSubmitRating = async () => {
    console.log('Выбран рейтинг:', rating);

    try {
      // 🔥 mock API запрос
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockResponse = {
        outfitId: 123,
        items: items,
        rating,
      };

      console.log('mock response:', mockResponse);

      // 👉 переход на outfit страницу
      navigate('/outfit', {
        state: mockResponse,
      });

    } catch (e) {
      console.error('Ошибка формирования образа:', e);
    }
  };

  const handleRatingChange = (_: Event, value: number | number[]) => {
    setRating(value as number);
  };

  return (
    <div className='collectionMain'>
      <div className="ratingContainer">
        <div className="ratingContent">

          <Typography sx={{ color: '#F9F8F3', textAlign: 'center', mb: 2, fontFamily: 'Inter', fontSize: '25px' }}>
            Выберите уровень формальности образа
          </Typography>

          <Typography sx={{ color: '#aaa', fontSize: '12px', textAlign: 'center', mb: 2 }}>
            1 — неформально · 5 — максимально формально
          </Typography>

          <Slider
            value={rating}
            min={1}
            max={5}
            step={1}
            marks
            valueLabelDisplay="auto"
            onChange={handleRatingChange}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: '#F9F8F3',
              color: '#0E0F15',
              borderRadius: '12px',
            }}
            onClick={handleSubmitRating}
          >
            Подобрать образ
          </Button>
        </div>
      </div>

      <div>
        {showHello ? (
          <AddShoeForm />
        ) : (
          <div className="collectionItems">
            {items.map((item) => (
              <div className="item" key={item.id}>
                <div className="imageContainer">
                  <img src={item.url} alt={item.name} />
                  <span
                    className="deleteIcon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                  >
                    <DeleteIcon />
                  </span>
                </div>
                <p>{item.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Selection;