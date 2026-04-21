import React, { useState } from 'react';
import { Button, TextField, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../../../../context/AuthContext'; // Импортируем useAuth для получения токена
import ArticleEditor from '../../quill';

const FashionWeekForm: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>(''); // Состояние для текста статьи
  const [photo, setPhoto] = useState<File | null>(null); // Состояние для хранения загруженного фото
  const { getTokens } = useAuth(); // Получаем токены из контекста

  // Обработчики изменений полей
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type === 'image/png' || file.type === 'image/jpeg') {
        setPhoto(file);
      } else {
        alert('Пожалуйста, загрузите изображение в формате PNG или JPG.');
      }
    }
  };

  // Функция для чтения файла как base64
  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Обработчик сохранения статьи
  const handleSaveArticle = async () => {
    if (!photo) {
      alert('Пожалуйста, загрузите фото.');
      return;
    }

    try {
      const imageData = await readFileAsBase64(photo);

      const tokens = getTokens();
      if (!tokens?.accessToken) {
        alert('Ошибка аутентификации. Пожалуйста, войдите снова.');
        return;
      }

      const response = await fetch('http://localhost:8082/api/v1/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens.accessToken}`,
        },
        body: JSON.stringify({
          name: title, // Название статьи
          text: content, // Текст статьи
          image_name: photo.name, // Имя файла с расширением
          image_data: imageData, // Изображение в формате base64
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при отправке данных на сервер');
      }

      const result = await response.json();
      console.log('Успешно отправлено:', result);

      setTitle('');
      setContent('');
      setPhoto(null);
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Произошла ошибка при отправке данных.');
    }
  };

  return (
    <form className='addArticle'>
      <Box>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
          <input
            type="file"
            accept="image/png, image/jpeg" // Разрешаем только PNG и JPG
            onChange={handlePhotoChange}
            style={{ display: 'none' }}
            id="upload-photo"
          />
          <label htmlFor="upload-photo">
            <Box
              sx={{
                width: '20vw', // Размер квадрата
                height: '20vw', // Размер квадрата
                backgroundColor: '#808080', // Серый цвет
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px', // Скругление углов
                cursor: 'pointer',
                border: '2px dashed #F9F8F3', // Пунктирная рамка
                '&:hover': {
                  backgroundColor: '#6b6b6b', // Цвет при наведении
                },
              }}
            >
              <AddIcon sx={{ fontSize: '48px', color: '#F9F8F3' }} /> {/* Иконка плюса */}
            </Box>
          </label>
        </div>

        <TextField
          className='articleHeaderInput'
          margin="normal"
          variant="outlined"
          placeholder="Введите название статьи"
          value={title}
          onChange={handleTitleChange}
          fullWidth
          sx={{
            backgroundColor: 'transparent',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'transparent',
              },
              '&:hover fieldset': {
                borderColor: 'transparent',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'transparent',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#F9F8F399',
            },
            '& .MuiInputBase-input': {
              color: '#F9F8F399',
            },
          }}
        />
        <ArticleEditor content={content} setContent={setContent} />
        <div className='addButtons'>
          <Button
            className='add'
            variant="contained"
            color="primary"
            onClick={handleSaveArticle}
          >
            Опубликовать
          </Button>
          <Button
            className='cancel'
            variant="contained"
            color="primary"
            onClick={() => {
              setTitle('');
              setContent('');
              setPhoto(null);
            }}
          >
            Отменить
          </Button>
        </div>
      </Box>
    </form>
  );
};

export default FashionWeekForm;