import { Box, Button, TextField } from '@mui/material';
import React, { JSX, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';

const Personal: React.FC = (): JSX.Element => {
  const { getTokens } = useAuth();
  const tokens = getTokens();

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokens || !tokens.accessToken) {
      alert('Пользователь не авторизован');
      return;
    }
    try {
      await axios.put('http://localhost:8080/api/v1/users', formData, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      alert('Данные успешно обновлены');
    } catch (error) {
      console.error('Ошибка при обновлении данных:', error);
      alert('Ошибка обновления данных');
    }
  };

  return (
    <div className='personalMain'>
      <form className="formPersonal" onSubmit={handleSubmit}>
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          flexDirection='column'
          maxWidth='55%'
          margin='auto'
          padding='2% 5%'
          borderRadius={5}
          bgcolor='#F9F8F3'
        >
          <h1 className='personalDataHeader'>Ваши данные</h1>
          <div className="userInfo">
            <TextField
              margin="normal"
              label="Имя"
              variant="outlined"
              placeholder="Введите ваше имя"
              fullWidth
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              label="Фамилия"
              variant="outlined"
              placeholder="Введите вашу фамилию"
              fullWidth
              name="surname"
              value={formData.surname}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              label="Никнейм"
              variant="outlined"
              placeholder="Введите ваш никнейм"
              fullWidth
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="userInfo">
            <TextField 
              type='password' 
              margin='normal' 
              label="Пароль" 
              variant="outlined" 
              placeholder='Введите ваш пароль' 
              fullWidth
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <TextField 
              margin='normal' 
              label="Электронная почта" 
              variant="outlined" 
              placeholder='Введите ваш email' 
              fullWidth
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <Button 
              type='submit' 
              sx={{
                fontFamily: 'Inter',
                marginTop: 1.5, 
                width: '100%', 
                backgroundColor: 'transparent', 
                borderRadius: '15px', 
                borderColor: '#0E0F15', 
                color: '#0E0F15'
              }} 
              variant="contained"
              className='submitUserProfileChanges'
            >
              Сохранить изменения
            </Button>
          </div>
        </Box>
      </form>
    </div>
  );
};

export default Personal;
