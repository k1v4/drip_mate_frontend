import React, { useState } from 'react';
import {
  Button,
  TextField,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../../../context/AuthContext';

const AddReleaseForm: React.FC = () => {
  const { getTokens } = useAuth();

  // ===== state =====
  const [title, setTitle] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);

  const [category, setCategory] = useState('');
  const [season, setSeason] = useState('');
  const [style, setStyle] = useState('');
  const [formality, setFormality] = useState<number | ''>('');

  // ===== handlers =====

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPhoto(event.target.files[0]);
    }
  };

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

  // ===== submit =====

  const handlePublish = async () => {
    if (!photo) return alert('Загрузите фото');
    if (!title) return alert('Введите название');
    if (!category || !season || !style) return alert('Заполните все категории');
    if (formality === '') return alert('Укажите уровень формальности');

    try {
      const imageData = await readFileAsBase64(photo);

      const tokens = getTokens();
      if (!tokens?.accessToken) {
        alert('Ошибка авторизации');
        return;
      }

      const response = await fetch('http://localhost:8083/api/v1/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens.accessToken}`,
        },
        body: JSON.stringify({
          name: title,
          category,
          season,
          style,
          formality,
          image_data: imageData,
          image_name: photo.name,
        }),
      });

      if (!response.ok) throw new Error();

      alert('Успешно создано');
      handleCancel();
    } catch (e) {
      console.error(e);
      alert('Ошибка при создании');
    }
  };

  const handleCancel = () => {
    setTitle('');
    setPhoto(null);
    setCategory('');
    setSeason('');
    setStyle('');
    setFormality('');
  };

  return (
    <form className='addArticle'>
      <Box display="flex" flexDirection="column" alignItems="center">

        {/* ===== Фото ===== */}
        <div style={{ marginBottom: '24px' }}>
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
                width: '220px',
                height: '220px',
                backgroundColor: '#808080',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px',
                cursor: 'pointer',
                border: '2px dashed #F9F8F3',
              }}
            >
              <AddIcon sx={{ fontSize: '48px', color: '#F9F8F3' }} />
            </Box>
          </label>
        </div>

        {/* ===== Название ===== */}
        <TextField
          label="Название предмета"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ marginBottom: 2, maxWidth: '400px' }}
        />

        {/* ===== CATEGORY ===== */}
        <FormControl fullWidth sx={{ marginBottom: 2, maxWidth: '400px' }}>
          <InputLabel>Категория</InputLabel>
          <Select
            value={category}
            label="Категория"
            onChange={(e) => setCategory(e.target.value)}
          >
            <MenuItem value="shoes">Обувь</MenuItem>
            <MenuItem value="outerwear">Верхняя одежда</MenuItem>
            <MenuItem value="pants">Брюки</MenuItem>
            <MenuItem value="tshirt">Футболки</MenuItem>
          </Select>
        </FormControl>

        {/* ===== SEASON ===== */}
        <FormControl fullWidth sx={{ marginBottom: 2, maxWidth: '400px' }}>
          <InputLabel>Сезон</InputLabel>
          <Select
            value={season}
            label="Сезон"
            onChange={(e) => setSeason(e.target.value)}
          >
            <MenuItem value="summer">Лето</MenuItem>
            <MenuItem value="winter">Зима</MenuItem>
            <MenuItem value="spring">Весна</MenuItem>
            <MenuItem value="autumn">Осень</MenuItem>
          </Select>
        </FormControl>

        {/* ===== STYLE ===== */}
        <FormControl fullWidth sx={{ marginBottom: 2, maxWidth: '400px' }}>
          <InputLabel>Стиль</InputLabel>
          <Select
            value={style}
            label="Стиль"
            onChange={(e) => setStyle(e.target.value)}
          >
            <MenuItem value="casual">Casual</MenuItem>
            <MenuItem value="sport">Sport</MenuItem>
            <MenuItem value="formal">Formal</MenuItem>
            <MenuItem value="streetwear">Streetwear</MenuItem>
          </Select>
        </FormControl>

        {/* ===== FORMALITY ===== */}
        <TextField
          label="Формальность (1-5)"
          type="number"
          inputProps={{ min: 1, max: 5 }}
          fullWidth
          value={formality}
          onChange={(e) => setFormality(Number(e.target.value))}
          sx={{ marginBottom: 3, maxWidth: '400px' }}
        />

        {/* ===== BUTTONS ===== */}
        <div className='addButtons' style={{ width: '400px' }}>
          <Button
            variant="contained"
            onClick={handlePublish}
            sx={{
              backgroundColor: '#F9F8F3',
              color: '#0E0F15',
              borderRadius: '12px',
            }}
          >
            Опубликовать
          </Button>

          <Button
            variant="outlined"
            onClick={handleCancel}
            sx={{
              borderColor: '#F9F8F3',
              color: '#F9F8F3',
              borderRadius: '12px',
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