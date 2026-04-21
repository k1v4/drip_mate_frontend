import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Импортируем axios (на будущее)
import { useNavigate } from 'react-router-dom';

// Тип для элемента статьи
interface Article {
  id: number;
  publication_date: string;
  name: string;
  text: string;
  author: string;
  image_url: string;
}

const Home = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const limit = 8;
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, [offset]);


  const fetchArticles = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8082/api/v1/articles?limit=${limit}&offset=${offset}`
      );

      if (Array.isArray(response.data.items)) {
        setArticles(response.data.items);
      } else {
        console.error('Некорректный формат данных:', response.data);
        setArticles([]);
      }
    } catch (error) {
      console.error('Ошибка при загрузке статей:', error);
      setArticles([]);
    }
  };

  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);

    const day = String(date.getDate()).padStart(2, '0'); // dd
    const month = String(date.getMonth() + 1).padStart(2, '0'); // mm (месяцы начинаются с 0)
    const year = date.getFullYear(); // yyyy

    return `${day}.${month}.${year}`;
  };

  return (
    <div className='homeRoot'>
      <div>
        <div className='mainImg' style={{ width: '100%', height: '67vh', overflow: 'hidden', marginBottom: '2%' }}>
          <img
            src='https://82a3fa46-643f-4a21-8a10-c2889596892b.selstorage.ru/CREPS_HUB_main%20(4).png'
            alt="Описание изображения"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top',
              borderRadius: '20px',
            }}
          />
        </div>

        <h1 className='slogan'>Stressed. Depressed. But well dressed.</h1>

        <div className='items-container'>
          {articles.map((article) => (
            <div key={article.id} className='item' onClick={() => { navigate(`/article/${article.id}`) }}>
              <div className='article-content'>
                <img src={article.image_url} alt={article.name} className='article-image' />
                <div className='article-text'>
                  <h2>{article.name}</h2>
                  <div className='article-meta'>
                    <span className='author'>{article.author}</span>
                    <span className='date'>{formatDate(article.publication_date)}</span> {/* Форматируем дату */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Пагинация */}
        <div className='pagination'>
          <button
            onClick={() => {
              if (offset >= limit) {
                setOffset(offset - limit);
              }
            }}
            disabled={offset === 0}
          >
            Назад
          </button>
          <span>Страница {Math.floor(offset / limit) + 1}</span>
          <button
            onClick={() => {
              setOffset(offset + limit);
            }}
            disabled={articles.length < limit}
          >
            Вперёд
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;