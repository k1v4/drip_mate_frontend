import { Add } from '@mui/icons-material';
import { Button, Pagination } from '@mui/material';
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

const mockArticles: Item[] = [
  { id: 1, name: 'Paris Fashion Week', image_url: 'https://picsum.photos/500?1' },
  { id: 2, name: 'Streetwear Trends', image_url: 'https://picsum.photos/500?2' },
  { id: 3, name: 'Minimal Style', image_url: 'https://picsum.photos/500?3' },
  { id: 4, name: 'Sneaker Culture', image_url: 'https://picsum.photos/500?4' },
  { id: 5, name: 'Luxury Looks', image_url: 'https://picsum.photos/500?5' },
  { id: 6, name: 'Winter Fits', image_url: 'https://picsum.photos/500?6' },
  { id: 7, name: 'Summer Outfits', image_url: 'https://picsum.photos/500?7' },
  { id: 8, name: 'Monochrome', image_url: 'https://picsum.photos/500?8' },
];

const Articles: React.FC = (): JSX.Element => {
  const [items, setItems] = useState<Item[]>([]);
  const [showHello, setShowHello] = useState(false);
  const [loading, setLoading] = useState(true);

  const { getTokens, setTokens } = useAuth();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const refreshTokens = async () => {
    const tokens = getTokens();
    const response = await instance.post('http://localhost:8080/api/v1/refresh', {
      refreshToken: tokens?.refreshToken,
    });
    const newTokens = response.data;
    setTokens(newTokens);
    return newTokens;
  };

  const fetchArticles = async () => {
    const tokens = getTokens();

    try {
      const response = await instance.get('http://localhost:8082/api/v1/user_articles', {
        headers: { Authorization: `Bearer ${tokens?.accessToken}` },
      });

      const fetchedItems = response.data.map((article: any) => ({
        id: article.id,
        name: article.name,
        image_url: article.image_url,
      }));

      setItems(fetchedItems.length ? fetchedItems : mockArticles);
    } catch (error: any) {
      if (error.response?.status === 401) {
        try {
          const newTokens = await refreshTokens();
          const response = await instance.get('http://localhost:8082/api/v1/user_articles', {
            headers: { Authorization: `Bearer ${newTokens.accessToken}` },
          });

          const fetchedItems = response.data.map((article: any) => ({
            id: article.id,
            name: article.name,
            image_url: article.image_url,
          }));

          setItems(fetchedItems.length ? fetchedItems : mockArticles);
        } catch {
          navigate('/login');
        }
      } else {
        setItems(mockArticles);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 🔥 мгновенный UI
    setItems(mockArticles);

    // фоновая загрузка
    fetchArticles();
  }, []);

  const handleAddArticle = () => {
    setShowHello(!showHello);
  };

  const handleDelete = async (id: number) => {
    const tokens = getTokens();
    if (!tokens?.accessToken) return;

    try {
      await fetch(`http://localhost:8082/api/v1/articles/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });

      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch {
      alert('Ошибка при удалении');
    }
  };

  const paginatedItems = items.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className='articleMain'>
      <div className='buttonAdd'>
        <Button
          sx={{
            fontFamily: 'Inter',
            width: '15vw',
            backgroundColor: '#F9F8F3',
            borderRadius: '15px',
            color: '#0E0F15',
          }}
          variant='contained'
          endIcon={<Add />}
          onClick={handleAddArticle}
        >
          {showHello ? 'Показать статьи' : 'Добавить статью'}
        </Button>
      </div>

      {showHello ? (
        <FashionWeekForm />
      ) : (
        <>
          <div className='articlesItems'>
            {paginatedItems.map((item) => (
              <div
                className='item'
                key={item.id}
                onClick={() => navigate(`/article/${item.id}`)}
              >
                <div className="imageContainer">
                  <img src={item.image_url} alt={item.name} />
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

          <div className="paginationContainer">
            <Pagination
              count={Math.ceil(items.length / itemsPerPage)}
              page={page}
              onChange={(_, value) => setPage(value)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Articles;