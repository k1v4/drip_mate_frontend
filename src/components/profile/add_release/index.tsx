import React, { useState } from 'react';
import { Button, TextField, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../../../context/AuthContext'; // Импортируем useAuth для получения токена

const AddReleaseForm: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [releaseDate, setReleaseDate] = useState<string>(''); // Состояние для даты релиза
  const [photo, setPhoto] = useState<File | null>(null);
  const { getTokens } = useAuth(); // Получаем токены из контекста

  // Обработчики изменений полей
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleReleaseDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReleaseDate(event.target.value); // Обновляем состояние даты
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPhoto(event.target.files[0]);
    }
  };

  // Функция для чтения файла как base64
  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1]; // Убираем префикс "data:image/..."
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file); // Читаем файл как Data URL
    });
  };

  // Обработчик публикации
  const handlePublish = async () => {
    if (!photo) {
      alert('Пожалуйста, загрузите фото.');
      return;
    }

    if (!releaseDate) {
      alert('Пожалуйста, выберите дату релиза.');
      return;
    }

    try {
      // Читаем фото как base64
      const imageData = await readFileAsBase64(photo);

      // Получаем JWT-токен
      const tokens = getTokens();
      if (!tokens?.accessToken) {
        alert('Ошибка аутентификации. Пожалуйста, войдите снова.');
        return;
      }

      // Отправляем данные на сервер
      const response = await fetch('http://localhost:8083/api/v1/releases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens.accessToken}`,
        },
        body: JSON.stringify({
          name: title,
          release_date: releaseDate, // Используем выбранную дату
          image_data: imageData, // Изображение в формате base64
          image_name: photo.name, // Имя файла с расширением
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при отправке данных на сервер');
      }

      const result = await response.json();
      console.log('Успешно отправлено:', result);

      // Очищаем форму после успешной отправки
      handleCancel();
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Произошла ошибка при отправке данных.');
    }
  };

  // Обработчик отмены
  const handleCancel = () => {
    setTitle('');
    setReleaseDate('');
    setPhoto(null);
  };

  return (
    <form className='addArticle'>
      <Box>
        {/* Форма загрузки фото */}
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
          <input
            type="file"
            accept="image/*"
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

        {/* Поле для названия */}
        <TextField
          margin="normal"
          label="Введите название релиза"
          variant="outlined"
          placeholder="Введите название релиза"
          fullWidth
          value={title}
          onChange={handleTitleChange}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
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

        {/* Поле для выбора даты */}
        <TextField
          margin="normal"
          label="Дата релиза"
          type="date" // Тип поля — дата
          variant="outlined"
          fullWidth
          InputLabelProps={{
            shrink: true, // Чтобы лейбл не накладывался на значение
          }}
          value={releaseDate}
          onChange={handleReleaseDateChange}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
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

        {/* Кнопки */}
        <div className='addButtons'>
          <Button
            className='add'
            variant="contained"
            color="primary"
            onClick={handlePublish}
            sx={{
              backgroundColor: '#F9F8F3',
              color: '#0E0F15',
              fontFamily: 'Inter',
              borderRadius: '15px',
              marginRight: '8px',
            }}
          >
            Опубликовать
          </Button>
          <Button
            className='cancel'
            variant="contained"
            color="primary"
            onClick={handleCancel}
            sx={{
              backgroundColor: '#F9F8F3',
              color: '#FFFFFF',
              fontFamily: 'Inter',
              borderRadius: '15px',
            }}
          >
            Отменить
          </Button>
        </div>
      </Box>
    </form>
  );
};

export default AddReleaseForm;