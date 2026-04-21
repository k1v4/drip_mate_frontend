import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import React, { JSX, useEffect, useState } from 'react';
import FashionWeekForm from './add';
import { instance } from '../../../utils/axios';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

interface Item {
  id: number;
  name: string;
  image_url: string;
}

const Articles: React.FC = (): JSX.Element => {
  const [items, setItems] = useState<Item[]>([]);
  const [showHello, setShowHello] = useState<boolean>(false);
  const { getTokens, setTokens } = useAuth();
  const navigate = useNavigate();

  const refreshTokens = async () => {
    const tokens = getTokens(); 
    try {
      const response = await instance.post('http://localhost:8080/api/v1/refresh', {
        refreshToken: tokens?.refreshToken, 
      });
      const newTokens = response.data; 
      setTokens(newTokens); 
      return newTokens;
    } catch (error) {
      console.error('Ошибка при обновлении токенов:', error);
      throw error;
    }
  };

  const fetchArticles = async () => {
    const tokens = getTokens();
    if (!tokens?.accessToken) {
      console.error('Токен отсутствует');
      return;
    }

    try {
      const response = await instance.get('http://localhost:8082/api/v1/user_articles', {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      });
      const fetchedItems = response.data.map((article: any) => ({
        id: article.id,
        name: article.name,
        image_url: article.image_url
      }));
      setItems(fetchedItems);
    } catch (error: any) {
      console.log(error.response?.data?.message);

      if (error.response?.status === 401) {
        try {
          // Обновляем токены
          const newTokens = await refreshTokens();

          // Повторяем запрос с новым токеном
          const response = await instance.get('http://localhost:8082/api/v1/user_articles', {
            headers: { Authorization: `Bearer ${newTokens.accessToken}` },
          });
          const fetchedItems = response.data.map((article: any) => ({
            id: article.id,
            name: article.name,
            image_url: article.image_url,
          }));
          setItems(fetchedItems);
        } catch (refreshError) {
          console.error('Ошибка при обновлении токенов или повторном запросе:', refreshError);
          // Если обновление токенов не удалось, перенаправляем на страницу логина
          navigate('/login');
        }
      } else {
        console.error('Ошибка при загрузке статей:', error);
      }
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []); // Убираем tokens из зависимостей

  // Обработчик нажатия на кнопку
  const handleAddArticle = () => {
    setShowHello(!showHello);
  };

  const handleDelete = async (id: number) => {
    const tokens = getTokens();
    if (!tokens?.accessToken) {
      alert('Ошибка аутентификации. Пожалуйста, войдите снова.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8082/api/v1/articles/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении статьи');
      }

      // Удаляем статью из списка
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      console.log('Статья успешно удалена');
    } catch (error) {
      console.error('Ошибка при удалении статьи:', error);
      alert('Произошла ошибка при удалении статьи.');
    }
  };

  return (
    <div className='articleMain'>
      <div className='buttonAdd'>
        <Button
          type='submit'
          sx={{
            fontFamily: 'Inter',
            width: '15vw',
            backgroundColor: '#F9F8F3',
            borderRadius: '15px',
            borderColor: '#fff',
            color: '#0E0F15',
          }}
          variant='contained'
          className='addShoes'
          endIcon={<Add />}
          onClick={handleAddArticle}
        >
          {showHello ? 'Показать статьи' : 'Добавить статью'}
        </Button>
      </div>
      <div>
        {showHello ? (
          <FashionWeekForm />
        ) : (
          <div className='articlesItems'>
            {items.map((item) => (
              <div className='item' key={item.id} onClick={() => { navigate(`/article/${item.id}`) }}>
                <div className="imageContainer">
                  <img src={item.image_url} alt={item.name} />
                  <span
                    className="deleteIcon"
                    onClick={(e) => {
                      e.stopPropagation(); // Останавливаем всплытие события
                      handleDelete(item.id); // Вызываем функцию удаления
                    }}
                  >
                    <DeleteIcon /> {/* Иконка корзины из MUI */}
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

export default Articles;