import React, { JSX, useEffect, useState } from 'react';
import { IPropsGetArticle } from '../../../common/types/auth';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';

const GetArticlePage: React.FC<IPropsGetArticle> = (props: IPropsGetArticle): JSX.Element => {
  const { navigate } = props;
  const { id } = useParams<{ id: string }>(); // Достаем articleId из пути
  const [article, setArticle] = useState<{ name: string; text: string } | null>(null);

  useEffect(() => {
    if (id) {
      // Запрос на сервер для получения данных статьи по articleId
      fetch(`http://localhost:8082/api/v1/articles/${id}`)
        .then(response => response.json())
        .then(data => {
          setArticle({
            name: data.name,
            text: data.text,
          });
        })
        .catch(error => {
          console.error('Ошибка при загрузке статьи:', error);
        });
    }
  }, [id]);

  return (
    <div className='page-container'>
      <Button
        variant="contained"
        sx={{
          background: 'transparent',
          color: '#F9F8F3',
          borderRadius: '15px',
          border: '1px solid #F9F8F3', // Указываем ширину, стиль и цвет границы
        }}
        className='back-button'
        onClick={() => navigate('/')}
        startIcon={<ArrowBackIcon />}
      >
        Назад
      </Button>

      <div className='center-content'>
        {article ? (
          <>
            <h1>{article.name}</h1>
            <div className='articleHtmlBack' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.text) }} />
          </>
        ) : (
          <p>Загрузка статьи...</p>
        )}
      </div>
    </div>
  );
};

export default GetArticlePage;