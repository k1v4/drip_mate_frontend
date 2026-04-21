import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import React, { JSX, useEffect, useState } from 'react';
import AddShoeForm from './add';
import { instance } from '../../../utils/axios';
import { useAuth } from '../../../context/AuthContext';
import DeleteIcon from '@mui/icons-material/Delete';

// Тип для элемента коллекции
interface Item {
  id: number;
  name: string;
  url: string;
}

const Collection: React.FC = (): JSX.Element => {
  const [items, setItems] = useState<Item[]>([]);
  const [showHello, setShowHello] = useState<boolean>(false);
  const { getTokens } = useAuth();

  useEffect(() => {
    const tokens = getTokens();
    if (!tokens?.accessToken) return; // Не выполняем запрос, если токен отсутствует
  
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
    if (!tokens?.accessToken) {
      alert('Ошибка аутентификации. Пожалуйста, войдите снова.');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8081/api/v1/shoes/${id}`, {
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
    <div className='collectionMain'>
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
          variant="contained"
          className='addShoes'
          endIcon={<Add />}
          onClick={handleAddShoe}
        >
          Добавить пару
        </Button>
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

export default Collection;