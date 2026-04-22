import { Box, Button, TextField } from '@mui/material';
import React, { JSX, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';

const Personal: React.FC = (): JSX.Element => {
  const { getTokens } = useAuth();
  const tokens = getTokens();

  // 🔹 профиль
  const [profileData, setProfileData] = useState({
    username: '',
    name: '',
    surname: '',
    city: '',
    email: '',
  });

  // 🔹 пароль отдельно
  const [passwordData, setPasswordData] = useState({
    password: '',
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  // 🔹 обновление профиля
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tokens?.accessToken) return;

    try {
      await axios.put(
        'http://localhost:8080/api/v1/users/profile',
        profileData,
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      alert('Профиль обновлён');
    } catch (error) {
      console.error(error);
      alert('Ошибка обновления профиля');
    }
  };

  // 🔹 смена пароля
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tokens?.accessToken) return;

    try {
      await axios.put(
        'http://localhost:8080/api/v1/users/password',
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      alert('Пароль обновлён');
      setPasswordData({ password: '' });
    } catch (error) {
      console.error(error);
      alert('Ошибка смены пароля');
    }
  };

  return (
    <div className='personalMain'>

      {/* ================= PROFILE ================= */}
      <form className="formPersonal" onSubmit={handleProfileSubmit}>
        <Box
          display='flex'
          flexDirection='column'
          maxWidth='55%'
          margin='auto'
          padding='2% 5%'
          borderRadius={5}
          bgcolor='#F9F8F3'
        >
          <h2>Профиль</h2>

          <div className="userInfo">
            <TextField name="username" label="Username" fullWidth onChange={handleProfileChange} />
            <TextField name="name" label="Имя" fullWidth onChange={handleProfileChange} />
            <TextField name="surname" label="Фамилия" fullWidth onChange={handleProfileChange} />
            <TextField name="city" label="Город" fullWidth onChange={handleProfileChange} />
            <TextField name="email" label="Email" fullWidth onChange={handleProfileChange} />
          </div>

          <Button
            type="submit"
            variant="contained"
            sx={{
              marginTop: 2,
              backgroundColor: '#0E0F15',
              color: '#F9F8F3',
            }}
          >
            Сохранить профиль
          </Button>
        </Box>
      </form>

      {/* ================= PASSWORD ================= */}
      <form className="formPersonal" onSubmit={handlePasswordSubmit}>
        <Box
          display='flex'
          flexDirection='column'
          maxWidth='55%'
          margin='auto'
          padding='2% 5%'
          borderRadius={5}
          bgcolor='#F9F8F3'
          marginTop={3}
        >
          <h2>Безопасность</h2>

          <div className="userInfo">
            <TextField
              type="password"
              name="password"
              label="Новый пароль"
              fullWidth
              value={passwordData.password}
              onChange={handlePasswordChange}
            />
          </div>

          <Button
            type="submit"
            variant="contained"
            sx={{
              marginTop: 2,
              backgroundColor: '#0E0F15',
              color: '#F9F8F3',
            }}
          >
            Сменить пароль
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default Personal;